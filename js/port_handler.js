//'use strict';

var usbDevices = {
    STM32DFU: {'vendorId': 1155, 'productId': 57105}
};

var PortHandler = new function () {
    this.initial_ports = false;
    this.port_detected_callbacks = [];
    this.port_removed_callbacks = [];
    this.dfu_available = false;
};



PortHandler.loadToggleState = function() {
    chrome.storage.local.get('last_used_bps', function (result) {
        if (result['last_used_bps']) {
            $('#baud').val(result['last_used_bps']);
        }
    });

    chrome.storage.local.get('wireless_mode_enabled', function (result) {
        if (result['wireless_mode_enabled']) {
            $('#wireless-mode').prop('checked', true).change();
        }
    });
    chrome.storage.local.get('auto_connect_enabled', function (result) {
        if (result['auto_connect_enabled']) {
            $('#auto-connect').prop('checked', true).change();
        }
    });
    chrome.storage.local.get('tcp_connect_enabled', function (result) {
        if (result['tcp_connect_enabled']) {
            $('#tcp-networking').prop('checked', true).change();
            $('#udp-networking').prop('checked', false).change();
        }
    });
    chrome.storage.local.get('udp_connect_enabled', function (result) {
        if (result['udp_connect_enabled']) {
            $('#udp-networking').prop('checked', true).change();
            $('#tcp-networking').prop('checked', false).change();
        }
    });
}

PortHandler.initialize = function () {
    // start listening, check after 250ms
    this.loadToggleState();
    this.check();
};

PortHandler.check = function () {
    var self = this;

    connection.getDevices(function(current_ports) {
        // port got removed or initial_ports wasn't initialized yet
        if (self.array_difference(self.initial_ports, current_ports).length > 0 || !self.initial_ports) {
            var removed_ports = self.array_difference(self.initial_ports, current_ports);

            if (self.initial_ports != false) {
                if (removed_ports.length > 1) {
                    console.log('PortHandler - Removed: ' + removed_ports);
                } else {
                    console.log('PortHandler - Removed: ' + removed_ports[0]);
                }
            }

            // disconnect "UI" if necessary
            // Keep in mind that this routine can not fire during atmega32u4 reboot procedure !!!
            if (GUI.connected_to) {
                for (var i = 0; i < removed_ports.length; i++) {
                    if (removed_ports[i] == GUI.connected_to) {
                        $('div#port-picker a.connect').click();
                    }
                }
            }

            self.update_port_select(current_ports);

            // trigger callbacks (only after initialization)
            if (self.initial_ports) {
                for (var i = (self.port_removed_callbacks.length - 1); i >= 0; i--) {
                    var obj = self.port_removed_callbacks[i];

                    // remove timeout
                    clearTimeout(obj.timer);

                    // trigger callback
                    obj.code(removed_ports);

                    // remove object from array
                    var index = self.port_removed_callbacks.indexOf(obj);
                    if (index > -1) self.port_removed_callbacks.splice(index, 1);
                }
            }

            // auto-select last used port (only during initialization)
            if (!self.initial_ports) {
                chrome.storage.local.get('last_used_port', function (result) {
                    // if last_used_port was set, we try to select it
                    if (result.last_used_port) {
                        current_ports.forEach(function(port) {
                            if (port == result.last_used_port) {
                                console.log('Selecting last used port: ' + result.last_used_port);   
                                $('#port').val(result.last_used_port);
                                //buzz autoconnect here
                                if ( helper['autoconnect']  ) {
                                    $('div.connect_controls a.connect').trigger("click");
                                    console.log('opening port: ' + result.last_used_port);
                                }  
                            }
                        });
                    } else {
                        console.log('Last used port wasn\'t saved "yet", auto-select disabled.');
                    }
                });

                // last-used is overwridden my a tcp or udp switch being active.... as it doesn't recodd them.
                chrome.storage.local.get('tcp_connect_enabled', function (result) {
                    if (result['tcp_connect_enabled']) {

                        helper['tcp-networking'] = true;
                        helper['udp-networking'] = false;
                        console.log("tcp true"); 
                        $('div#port-picker #port').val('manual');
                        $('#port-override').val('tcp://localhost:5760');
                        $('#port-override-option').show();
                    }
                });
                // last-used is overwridden my a tcp or udp switch being active.... as it doesn't recodd them.
                chrome.storage.local.get('udp_connect_enabled', function (result) {
                    if (result['udp_connect_enabled']) {
                        helper['udp-networking'] = true;
                        helper['tcp-networking'] = false;
                        console.log("udp true"); 
                        $('div#port-picker #port').val('manual');
                        $('#port-override').val('udp://localhost:14550');
                        $('#port-override-option').show();
                    }
                });

            }

            if (!self.initial_ports) {
                // initialize
                self.initial_ports = current_ports;
            } else {
                for (var i = 0; i < removed_ports.length; i++) {
                    self.initial_ports.splice(self.initial_ports.indexOf(removed_ports[i]), 1);
                }
            }
        }

        // new port detected
        var new_ports = self.array_difference(current_ports, self.initial_ports);

        if (new_ports.length) {
            if (new_ports.length > 1) {
                console.log('PortHandler - Found: ' + new_ports);
            } else {
                console.log('PortHandler - Found: ' + new_ports[0]);
                connection.newport = new_ports[0]; // remmber name of new port
            }

            self.update_port_select(current_ports);

            // found a new usb device, turn off gui switches for tcp/udp...
            $('#tcp-networking').prop('checked', false).change();
            $('#udp-networking').prop('checked', false).change();

            // select / highlight new port, if connected -> select connected port
            if (!GUI.connected_to) {
                $('div#port-picker #port').val(new_ports[0]);
                if ( helper['autoconnect'] == true ) {
                    $('div#port-picker #port').val(GUI.connected_to);
                }
            } else {
                $('div#port-picker #port').val(GUI.connected_to);
            } 

            // trigger callbacks
            for (var i = (self.port_detected_callbacks.length - 1); i >= 0; i--) {
                var obj = self.port_detected_callbacks[i];

                // remove timeout
                clearTimeout(obj.timer);

                // trigger callback
                obj.code(new_ports);

                // remove object from array
                var index = self.port_detected_callbacks.indexOf(obj);
                if (index > -1) self.port_detected_callbacks.splice(index, 1);
            }

            self.initial_ports = current_ports;
        }

        self.check_usb_devices();

        GUI.updateManualPortVisibility();
        setTimeout(function () {
            self.check();
        }, 50); // buzz was 250
    });
};

PortHandler.check_usb_devices = function (callback) {
    chrome.usb.getDevices(usbDevices.STM32DFU, function (result) {
        if (result.length) {
            if (!$("div#port-picker #port [value='DFU']").length) {
                $('div#port-picker #port').append($('<option/>', {value: "DFU", text: "DFU", data: {isDFU: true}}));
                $('div#port-picker #port').val('DFU');
            }
            self.dfu_available = true;
        } else {
            if ($("div#port-picker #port [value='DFU']").length) {
               $("div#port-picker #port [value='DFU']").remove();
            }
            self.dfu_available = false;
        }

        if(callback) callback(self.dfu_available);
    });
};

PortHandler.update_port_select = function (ports) {
    $('div#port-picker #port').html(''); // drop previous one

    for (var i = 0; i < ports.length; i++) {
        $('div#port-picker #port').append($("<option/>", {value: ports[i], text: ports[i], data: {isManual: false}}));
    }

    $('div#port-picker #port').append($("<option/>", {value: 'manual', text: 'Manual Selection', data: {isManual: true, value:''}}));
  //  $('div#port-picker #port').append($("<option/>", {value: 'manual-tcp', text: 'TCP',          data: {isManual: true, value:'tcp://127.0.0.1:5760'}}));
  //  $('div#port-picker #port').append($("<option/>", {value: 'manual-udp', text: 'UDP',          data: {isManual: true, value:'udp://127.0.0.1:14550'}}));

};

PortHandler.port_detected = function(name, code, timeout, ignore_timeout) {
    var self = this;
    var obj = {'name': name, 'code': code, 'timeout': (timeout) ? timeout : 10000};

    if (!ignore_timeout) {
        obj.timer = setTimeout(function() {
            console.log('PortHandler - timeout - ' + obj.name);

            // trigger callback
            code(false);

            // remove object from array
            var index = self.port_detected_callbacks.indexOf(obj);
            if (index > -1) self.port_detected_callbacks.splice(index, 1);
        }, (timeout) ? timeout : 10000);
    } else {
        obj.timer = false;
        obj.timeout = false;
    }

    this.port_detected_callbacks.push(obj);

    return obj;
};

PortHandler.port_removed = function (name, code, timeout, ignore_timeout) {
    var self = this;
    var obj = {'name': name, 'code': code, 'timeout': (timeout) ? timeout : 10000};

    if (!ignore_timeout) {
        obj.timer = setTimeout(function () {
            console.log('PortHandler - timeout - ' + obj.name);

            // trigger callback
            code(false);

            // remove object from array
            var index = self.port_removed_callbacks.indexOf(obj);
            if (index > -1) self.port_removed_callbacks.splice(index, 1);
        }, (timeout) ? timeout : 10000);
    } else {
        obj.timer = false;
        obj.timeout = false;
    }

    this.port_removed_callbacks.push(obj);

    return obj;
};

// accepting single level array with "value" as key
PortHandler.array_difference = function (firstArray, secondArray) {
    var cloneArray = [];

    // create hardcopy
    for (var i = 0; i < firstArray.length; i++) {
        cloneArray.push(firstArray[i]);
    }

    for (var i = 0; i < secondArray.length; i++) {
        if (cloneArray.indexOf(secondArray[i]) != -1) {
            cloneArray.splice(cloneArray.indexOf(secondArray[i]), 1);
        }
    }

    return cloneArray;
};

PortHandler.flush_callbacks = function () {
    var killed = 0;

    for (var i = this.port_detected_callbacks.length - 1; i >= 0; i--) {
        if (this.port_detected_callbacks[i].timer) clearTimeout(this.port_detected_callbacks[i].timer);
        this.port_detected_callbacks.splice(i, 1);

        killed++;
    }

    for (var i = this.port_removed_callbacks.length - 1; i >= 0; i--) {
        if (this.port_removed_callbacks[i].timer) clearTimeout(this.port_removed_callbacks[i].timer);
        this.port_removed_callbacks.splice(i, 1);

        killed++;
    }

    return killed;
};
