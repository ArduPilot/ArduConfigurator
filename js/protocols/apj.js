/*
    ArduPilot( apj, concepts derived from px4) compatible Bootloader interaction code  and flashing etc.
    // this can flash a .apj file to an ArduPilot board with an AP bootloader

    popular choices - 921600, 460800, 256000, 230400, 153600, 128000, 115200, 57600, 38400, 28800, 19200
*/
//'use strict';

//var serial = {};
//import('../serial.js');
//serial.connect = function () { }
//console.log(serial)

// use it as "await sleep(250);"  // ms
sleep = async function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var APJ_protocol = function () {
    this.baud;
    this.options = {};
    this.callback; // ref
    this.hex; // ref
    this.verify_hex;

    this.receive_buffer;

    this.bytes_to_read = 0; // ref
    this.read_callback; // ref

    this.upload_time_start;
    this.upload_process_alive;


    this.command = {
        INSYNC:    0x12,          //decimal 18
        EOC:       0x20,              //    32 
        OK:                     0x10, //dec 16
        FAILED:                 0x11, //    17
        INVALID:                0x13, //    19
        BAD_SILICON_REV:        0x14, //    20
        NOP:                    0x00,
        GET_SYNC:               0x21,
        GET_DEVICE:             0x22,
        CHIP_ERASE:             0x23,
        CHIP_VERIFY:            0x24,
        PROG_MULTI:             0x27,
        READ_MULTI:             0x28,
        GET_CRC:                0x29,
        GET_OTP:                0x2a,
        GET_SN:                 0x2b,
        GET_CHIP:               0x2c,
        SET_BOOT_DELAY:         0x2d,
        GET_CHIP_DES:           0x2e,
        MAX_DES_LENGTH:           20,

        REBOOT:                 0x30, // dec 48
        SET_BAUD:               0x33,
        INFO_BL_REV:            0x01,
        BL_REV_MIN:                 2,
        BL_REV_MAX:                 5,
        INFO_BOARD_ID:              0x02,
        INFO_BOARD_REV:             0x03,
        INFO_FLASH_SIZE:            0x04,

        PROG_MULTI_MAX:            252,
        READ_MULTI_MAX:            255,

        //NSH_INIT:                   0x30,
        //NSH_REBOOT_BL:              0x30,
        //NSH_REBOOT:                 0x30,
        

        // above are ok'd by buzz
        //get:                    0x00, // Gets the version and the allowed commands supported by the current version of the bootloader
        //get_ver_r_protect_s:    0x01, // Gets the bootloader version and the Read Protection status of the Flash memory
        //get_ID:                 0x02, // Gets the chip ID
        //read_memory:            0x11, // Reads up to 256 bytes of memory starting from an address specified by the application
        //go:                     0x21, // Jumps to user application code located in the internal Flash memory or in SRAM
       // write_memory:           0x31, // Writes up to 256 bytes to the RAM or Flash memory starting from an address specified by the application
        // erase:                  0x43, // Erases from one to all the Flash memory pages
        // extended_erase:         0x44, // Erases from one to all the Flash memory pages using two byte addressing mode (v3.0+ usart).
        // write_protect:          0x63, // Enables the write protection for some sectors
        // write_unprotect:        0x73, // Disables the write protection for all Flash memory sectors
        // readout_protect:        0x82, // Enables the read protection
        // readout_unprotect:      0x92  // Disables the read protection
    };

    // Erase (x043) and Extended Erase (0x44) are exclusive. A device may support either the Erase command or the Extended Erase command but not both.

    this.available_flash_size = 0;
    this.page_size = 0;
    this.useExtendedErase = false;

    this.board_ids = {
        CubeOrange_joey : 1033,     CubeOrange_joey_bl : 1033,         KakuteF7Mini : 145,         KakuteF7Mini_bl : 145,       fmuv2 : 9,  skyviper_f412_rev1 : 9,
        HitecMosaic : 1016,         HitecMosaic_bl : 1016,         revo_mini_i2c : 124,             revo_mini_i2c_bl : 124,         SuccexF4 : 1011,
        SuccexF4_bl : 1011,         MatekH743_periph : 1013,         G4_ESC : 1027,                 G4_ESC_bl : 1027,               OmnibusNanoV6 : 133,
        OmnibusNanoV6_bl : 133,     CUAV_GPS : 1001,                CUAV_GPS_bl : 1001,                QioTekZealotF427 : 1021,        QioTekZealotF427_bl : 1021,
        FreeflyRTK : 1028,          FreeflyRTK_bl : 1028,         CubeBlack_periph : 1401,          CubeBlack_periph_bl : 1401,        mRoNexus : 1015,
        mRoNexus_bl : 1015,         crazyflie2 : 12,                crazyflie2_bl : 12,             mRoControlZeroOEMH7 : 1024,        mRoControlZeroOEMH7_bl : 1024,
        KakuteF4 : 122,              KakuteF4_bl : 122,              speedybeef4 : 134,             speedybeef4_bl : 134,           mRoControlZeroF7 : 141,
        mRoControlZeroF7_bl : 141,  mRoControlZeroClassic : 1022,  mRoControlZeroClassic_bl : 1022, KakuteF7 : 123,                 KakuteF7_bl : 123,
        F4BY : 20,                  F4BY_bl : 20,                   fmuv5 : 50,   fmuv5_bl : 50,    NucleoH743 : 139,               NucleoH743_bl : 139,
        TBS_Colibri_F7_bl : 50,         F35Lightning : 135,         F35Lightning_bl : 135,         fmuv3_bdshot : 9,                f405_MatekGPS : 1014,
        f405_MatekGPS_bl : 1014,     VRCore_v10 : 1910,             VRCore_v10_bl : 1910,         CubeOrange : 140,                 CubeOrange_bl : 140,
        f303_MatekGPS : 1004,        f303_MatekGPS_bl : 1004,         R9Pilot : 1008,               R9Pilot_bl : 1008,              omnibusf4pro : 131,
        omnibusf4pro_bl : 131,       fmuv3 : 9,                     fmuv3_bl : 9,                   mRoPixracerPro : 1017,         mRoPixracerPro_bl : 1017,
        CubeBlack_plus : 1003,       CubeBlack_plus_bl : 1003,         iomcu : 3,                   MazzyStarDrone : 188,             MazzyStarDrone_bl : 188,
        CubeOrange_periph : 1400,    CubeOrange_periph_bl : 1400,   OMNIBUSF7V2_bdshot : 121,         MambaF405v2 : 1019,         MambaF405v2_bl : 1019,
        MatekF405_Wing : 127,         MatekF405_Wing_bl : 127,         OMNIBUSF7V2 : 121,           OMNIBUSF7V2_bl : 121,         VRUBrain_v51 : 1351,
        VRUBrain_v51_bl : 1351,     HerePro : 1037,                 HerePro_bl : 1037,              MatekF405_CAN : 1014,         MatekF405_CAN_bl : 1014,
        CubeYellow : 120,           CubeYellow_bl : 120,            f303_periphhwdef_bl:1004,         f303_periphhwdef:1004,         MatekH743 : 1013,
        MatekH743_bl : 1013,         Pixracer_periph : 1402,         Pixracer_periph_bl : 1402,      MatekF405 : 125,                MatekF405_bl : 125,
        KakuteF4Mini : 1030,         KakuteF4Mini_bl : 1030,         revo_mini : 124,               revo_mini_bl : 124,         luminousbee4 : 11,
        MatekF765_Wing : 143,        MatekF765_Wing_bl : 143,         airbotf4 : 128,               airbotf4_bl : 128,         HolybroGPS : 1035,
        HolybroGPS_bl : 1035,        omnibusf4v6 : 137,             omnibusf4v6_bl : 137,           fmuv5_bdshot : 50,         FlywooF745 : 1027,
        FlywooF745_bl : 1027,       f103_periphhwdef_bl:1000,         f103_periphhwdef:1000,         BeastF7 : 1026,            BeastF7_bl : 1026,
        VRBrain_v54 : 1154,         VRBrain_v54_bl : 1154,          VRBrain_v51 : 1151,             VRBrain_v51_bl : 1151,         CUAV_X7 : 1010,
        CUAV_X7_bl : 1010,          sparky2 : 130,                  sparky2_bl : 130,               omnibusf4 : 1002,         omnibusf4_bl : 1002,
        mRoControlZeroH7 : 1023,    mRoControlZeroH7_bl : 1023,         Durandal : 139,             Durandal_bl : 139,         ZubaxGNSS : 1005,
        ZubaxGNSS_bl : 1005,        skyviper_journey : 9,           BeastH7 : 1025,                 BeastH7_bl : 1025,         mRoX21_777 : 136,
        mRoX21_777_bl : 136,        mindpx_v2 : 88,                 mindpx_v2_bl : 88,              DrotekP3Pro : 13,         DrotekP3Pro_bl : 13,
        MambaF405US_I2C : 1038,     MambaF405US_I2C_bl : 1038,         CUAV_Nora : 1009,            CUAV_Nora_bl : 1009,         CUAVv5Nano_bl : 50,
        mini_pix : 3,               mini_pix_bl : 3,                Pixracer : 11,                  Pixracer_bl : 11,         H757I_EVAL : 146,      
        H757I_EVAL_bl : 146,        VRBrain_v52 : 1152,             VRBrain_v52_bl : 1152,          luminousbee5 : 1029,        luminousbee5_bl : 1029
    };
};


function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

// no input parameters
APJ_protocol.prototype.connect = function (port, baud, hex, options, callback) {
    var self = this;
    self.hex = hex;
    self.baud = baud;
    self.callback = callback;
    self.port  = port;

    // we will crunch the options here since doing it inside initialization routine would be too late
    self.options = {
        no_reboot:      false,
        reboot_baud:    false,
        erase_chip:     false
    };

    if (options.no_reboot) {
        self.options.no_reboot = true;
    } else {
        self.options.reboot_baud = options.reboot_baud;
    }

    if (options.erase_chip) {
        self.options.erase_chip = true;
    }

    if (self.options.no_reboot) {
        serial.connect(port, {bitrate: self.baud, parityBit: 'even', stopBits: 'one'}, function (openInfo) {
            if (openInfo) {
                // we are connected, disabling connect button in the UI
                GUI.connect_lock = true;

                self.initialize();
            } else {
                GUI.log('<span style="color: red">Failed</span> to open serial port');
            }
        });
    } else {
        serial.connect(port, {bitrate: self.options.reboot_baud}, function (openInfo) {
            if (openInfo) {
                console.log('Sending  reboot');

                // we are connected, disabling connect button in the UI
                GUI.connect_lock = true;

                preflight_reboot(); 
                // or send 44 bytes [253, 32, 0, 0, 47, 1, 1, 76, 0, 0, 0, 0, 128, 63, 0, 0, 0, 0, 0, 0, 128, 63, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 246, 0, 1, 1, 31, 104]

                var bufferOut = new ArrayBuffer(44);
                var bufferView = new Uint8Array(bufferOut);

                //bufferView[0] = 0x52;   zzzzzzz
                bufferView = [253, 32, 0, 0, 47, 1, 1, 76, 0, 0, 0, 0, 128, 63, 0, 0, 0, 0, 0, 0, 128, 63, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 246, 0, 1, 1, 31, 104]

                // serial.send(bufferOut, function () {} )
                // serial.send(bufferOut, function () {} )

                serial.send(bufferOut, function () {
                    serial.disconnect(function (result) {
                        if (result) {
                            var intervalMs = 200;
                            var retries = 0;
                            var maxRetries = 50; // timeout after intervalMs * 50
                            var interval = setInterval(function() {
                                var tryFailed = function() {
                                    retries++;
                                    if (retries > maxRetries) {
                                        clearInterval(interval);
                                        GUI.log('<span style="color: red">Failed</span> to flash ' + port);
                                    }
                                }
                                // Check for DFU devices
                                console.log("apj serial.disconnect interval")
                                PortHandler.check_usb_devices(function(dfu_available) {

                                    console.log("apj check_usb_devices")
                                    // if (dfu_available) {
                                    //     clearInterval(interval);
                                    //     APJDFU.connect(usbDevices.APJDFU, hex, options);
                                    //     return;
                                    // }
                                    // Check for the serial port
                                    serial.getDevices(function(devices) {
                                        if (devices && devices.includes(port)) {
                                            // Serial port might briefly reappear on DFU devices while
                                            // the FC is rebooting, so we don't clear the interval
                                            // until we successfully connect.
                                            serial.connect(port, {bitrate: self.baud, parityBit: 'even', stopBits: 'one'}, function (openInfo) {
                                                console.log("apj check_usb_devices -> serial.connect")
                                                if (openInfo) {
                                                    clearInterval(interval);
                                                    self.initialize(); // sets up 10 sec timeout and goes to upload step 1
                                                } else {
                                                    GUI.connect_lock = false;
                                                    tryFailed();
                                                }
                                            });
                                            return;
                                        }
                                        tryFailed();
                                    });
                                });
                            }, intervalMs);
                        } else {
                            GUI.connect_lock = false;
                        }
                    });
                });
            } else {
                GUI.log('<span style="color: red">Failed</span> to open serial port');
            }
        });
    }
};

// initialize certain variables and start timers that oversee the communication
APJ_protocol.prototype.initialize = function () {
    var self = this;

    console.log("apj.initialize");

    // reset and set some variables before we start
    self.receive_buffer = [];
    self.verify_hex = [];

    self.upload_time_start = new Date().getTime();
    self.upload_process_alive = false;

    // reset progress bar to initial state
    self.progress_bar_e = $('.progress');
    self.progress_bar_e.val(0);
    self.progress_bar_e.removeClass('valid invalid');

    // lock some UI elements TODO needs rework
    $('select[name="release"]').prop('disabled', true);

    serial.onReceive.addListener(function (info) {
        self.read(info);
    });

    helper.interval.add('APJ_timeout', function () {
        if (self.upload_process_alive) { // process is running
            self.upload_process_alive = false;
        } else {
            console.log('APJ - timed out, programming failed ...');

            $('span.progressLabel').text('APJ - timed out, programming: FAILED');
            self.progress_bar_e.addClass('invalid');

            googleAnalytics.sendEvent('Flashing', 'Programming', 'timeout');

            // protocol got stuck, clear timer and disconnect
            helper.interval.remove('APJ_timeout');

            GUI.connect_lock = false;

            // exit
            self.upload_procedure(99);
        }
    }, 30000); // buzz todo was 2000, needs to be at least 30s, as we need 20s just for erase

    

    self.upload_procedure(1);
};

// no input parameters
// this method should be executed every 1 ms via interval timer
APJ_protocol.prototype.read = function (readInfo) {
    // routine that fills the buffer
    var data = new Uint8Array(readInfo.data);

    //if (data[0] == 254 ) return; // discard mavlink stuff

    if ((data.length > 30 ) && (data.includes(254)))  {
       // return;
    }

    if (data.length > 0 )console.log('READ-->',Array.from(data)); // display as Array as its simpler

    for (var i = 0; i < data.length; i++) {
        this.receive_buffer.push(data[i]);
    }

    // routine that fetches data from buffer if statement is true
    if (this.receive_buffer.length >= this.bytes_to_read && this.bytes_to_read != 0) {
        var data = this.receive_buffer.slice(0, this.bytes_to_read); // bytes requested
        this.receive_buffer.splice(0, this.bytes_to_read); // remove read bytes

        this.bytes_to_read = 0; // reset trigger

        this.read_callback(data);
    }
    //console.log('r');
};

// we should always try to consume all "proper" available data while using retrieve
APJ_protocol.prototype.retrieve = function (n_bytes, callback) {
    if (this.receive_buffer.length >= n_bytes) {
        // data that we need are there, process immediately
        var data = this.receive_buffer.slice(0, n_bytes);
        this.receive_buffer.splice(0, n_bytes); // remove read bytes

        callback(data);
    } else {
        // still waiting for data, add callback
        this.bytes_to_read = n_bytes;
        this.read_callback = callback;
    }
};

// Array = array of bytes that will be send over serial
// bytes_to_read = received bytes necessary to trigger read_callback
// callback = function that will be executed after received bytes = bytes_to_read
APJ_protocol.prototype.send = function (Array, bytes_to_read, callback) {

    self = this;
    // flip flag
    this.upload_process_alive = true;

    var bufferOut = new ArrayBuffer(Array.length);
    var bufferView = new Uint8Array(bufferOut);

    // set Array values inside bufferView (alternative to for loop)
    bufferView.set(Array);

    // update references
    this.bytes_to_read = bytes_to_read;

    this.write_success = false;
    this.read_callback = callback;
    this.read_callback2 = callback;

    this.write_callback = function (writeInfo) {
        // don't use 'this' in here
        self.write_success = true;
        self.read_callback = self.read_callback2;// read callback is only set after write has completed
    };
    

    // empty receive buffer before next command is out
    this.receive_buffer = [];

    console.log("SEND-->",Array); 

    // send over the actual data
    serial.send(bufferOut, this.write_callback ); // we don't really care if/when its written

};

// val = single byte to be verified
// data = response of n bytes from mcu (array)
// result = true/false
APJ_protocol.prototype.verify_response = function (val, data) {
    var self = this;

    if (val != data[0]) {
        var message = 'APJ Communication failed, wrong response, expected: ' + val + ' (0x' + val.toString(16) + ') received: ' + data[0] + ' (0x' + data[0].toString(16) + ')';
        console.error(message);
        $('span.progressLabel').text(message);
        self.progress_bar_e.addClass('invalid');

        // disconnect
        this.upload_procedure(99);

        return false;
    }

    return true;
};

// first_array = usually hex_to_flash array
// second_array = usually verify_hex array
// result = true/false
APJ_protocol.prototype.verify_flash = function (first_array, second_array) {
    for (var i = 0; i < first_array.length; i++) {
        if (first_array[i] != second_array[i]) {
            console.log('Verification failed on byte: ' + i + ' expected: 0x' + first_array[i].toString(16) + ' received: 0x' + second_array[i].toString(16));
            return false;
        }
    }

    console.log('Verification successful, matching: ' + first_array.length + ' bytes');

    return true;
};


//APJ_protocol.prototype.xxxxx

// step = value depending on current state of upload_procedure
APJ_protocol.prototype.upload_procedure = function (step) {
    var self = this;

    switch (step) {
        case 1:
            // initialize serial interface on the MCU side, auto baud rate settings
            $('span.progressLabel').text('Contacting bootloader ...');

            console.log("uploading step... ",step)

            var send_counter = 0;
            helper.interval.add('apj_initialize_mcu', function () { // 200 ms interval (just in case mcu was already initialized), we need to break the 2 bytes command requirement
                self.send([self.command.GET_SYNC,self.command.EOC], 2, function (reply) { // 2 byte reply expected, INSYNC then OK
                    //console.log("RAW REPLY to GET_SYNC", reply )

                    if (reply[0] == self.command.INSYNC ) { // INSYNC = 0x12  or decimal 18
                        
                        console.log('INSYNC - APJ - Serial interface initialized on the MCU side');

                        // proceed to next step
                       // self.upload_procedure(2);
                    } 

                    if (reply[1] == self.command.OK ) { // second byte is ok

                        console.log('OK - APJ - Serial interface initialized on the MCU side');
                        helper.interval.remove('apj_initialize_mcu');
                        self.upload_procedure(2);
                    }

                    // if we still see mavlink stream, force a reboot..
                     if (reply[0] == 254 &&  (( reply[1] == 9)||( reply[1] == 28) ) ) { // starting bytes for a mavlink heartbeat....
                        serial.emptyOutputBuffer();
                        serial.bytesReceived = 0; 
                        preflight_reboot();
                        //self.upload_procedure(1);
                        self.connect(self.port,self.baud,self.hex,self.options,self.callback); // recursive retry
                     }
                    // if we still see mavlink stream, force a reboot..
                    if (reply[0] == 253 &&  (( reply[1] == 9)||( reply[1] == 25)||( reply[1] == 28)||( reply[1] == 12)||( reply[1] == 29) )  ) { // starting bytes for a mavlink heartbeat....
                        preflight_reboot();
                        //self.upload_procedure(1);
                        self.connect(self.port,self.baud,self.hex,self.options,self.callback); // recursive retry
                     }
                    // if (reply[0] == self.command.INVALID ) {

                    // }
                        // $('span.progressLabel').text('Communication with bootloader failed');
                        // self.progress_bar_e.addClass('invalid');

                        // helper.interval.remove('apj_initialize_mcu');

                        // // disconnect
                        // self.upload_procedure(99);
                    //}
                });

                if (send_counter++ > 5) {
                    // stop retrying, its too late to get any response from MCU
                    console.log('APJ - no response from bootloader, disconnecting');

                    GUI.connect_lock = false;

                    $('span.progressLabel').text('No response from the bootloader, programming: FAILED');
                    self.progress_bar_e.addClass('invalid');

                    helper.interval.remove('apj_initialize_mcu');
                    helper.interval.remove('APJ_timeout');

                    // exit
                    self.upload_procedure(99);
                }
            }, 2000, true);
            break;
        case 2: //get info  is a 3 byte send .. uploader.GET_DEVICE + INFO_BL_REV + uploader.EOC
            // get version of the bootloader ,  withich is an 'int' ( 4 bytes )
            self.send([self.command.GET_DEVICE, self.command.INFO_BL_REV , self.command.EOC], 4, function (data) { 


                var val = jspack.Unpack("<I", data);//struct.unpack("<I", data)  
                if ( val == undefined) return;
                //return val[0]
                
                console.log("BL REV",data,val[0]);

                if ( val[0] == 5) { 
                    console.log("Good Bootloader version=5 detected... continuing..");
                }

                if ( val[0] > 10) { 
                    console.log("iNVALID BL REV, restrting...");
                    self.upload_procedure(1);
                    return;
                }

                self.upload_procedure(3);

                // self.__getSync() block
                // self.send([self.command.GET_SYNC,self.command.EOC], 2, function (reply) { // 2 byte reply expected, INSYNC then OK
                //     console.log("RAW REPLY to GET_SYNC", reply )

                //     if (reply[0] == self.command.INSYNC ) { // INSYNC = 0x12  or decimal 18
                        
                //         console.log('INSYNC - APJ - Serial interface initialized on the MCU side');

                //         // proceed to next step
                //        // self.upload_procedure(2);
                //     } 

                //     if (reply[1] == self.command.OK ) { // second byte is ok

                //         console.log('OK - APJ - Serial interface initialized on the MCU side');
                //         helper.interval.remove('apj_initialize_mcu');
                //         self.upload_procedure(2);
                //     }
                // });


                // if (self.verify_response(self.command.ACK, data)) {// first byte..?
                //     self.retrieve(data[1] + 1 + 1, function (data) { // data[1] = number of bytes that will follow [– 1 except current and ACKs]
                //         console.log('APJ - Bootloader version: ' + (parseInt(data[0].toString(16)) / 10).toFixed(1)); // convert dec to hex, hex to dec and add floating point

                //         self.useExtendedErase = (data[7] == self.command.extended_erase);

                //         // proceed to next step
                //         self.upload_procedure(3);
                //     });
                // }

            });
            break;
        case 3:
            // get ID (device signature)
            //get info INFO_BOARD_ID is a 3 byte send .. uploader.GET_DEVICE + INFO_BOARD_ID + uploader.EOC
            // get 'board_type'  which is an 'int' ( 4 bytes )
            self.send([self.command.GET_DEVICE, self.command.INFO_BOARD_ID , self.command.EOC], 4, function (data) { // 0x01 ^ 0xFF

                var val = jspack.Unpack("<I", data);//struct.unpack("<I", data)  
                if ( val == undefined) return;
                //return val[0]
                
                console.log("INFO_BOARD_ID",data,val[0]);

                if ( val[0] > 2000) { 
                    console.log("INVALID INFO_BOARD_ID, restarting...");
                    self.upload_procedure(1);
                    return;
                }

                // this.board_ids todo
                var board_id = val[0];
                var board_name = getKeyByValue(self.board_ids,board_id);

                //if (self.board_ids.entries().includes(board_id)) {
                if (board_name) {
                    console.log(board_name+" detected with ID="+board_id);
                }

                // // see APJ_BOARD_ID in sources, and hwdef.dat file/s
                // if ( val[0] == 9) {  /// pixhawk1 
                //     console.log("pixhawk 1 detected with ID=9");
                // }
                // if ( val[0] == 139) {  /// pixhawk1 
                //     console.log("H743 style Board detected with ID=139");
                // }

                self.upload_procedure(4);

                // if (self.verify_response(self.status.ACK, data)) {
                //     self.retrieve(data[1] + 1 + 1, function (data) { // data[1] = number of bytes that will follow [– 1 (N = 1 for APJ), except for current byte and ACKs]
                //         var signature = (data[0] << 8) | data[1];
                //         console.log('APJ - Signature: 0x' + signature.toString(16)); // signature in hex representation

                //         if (self.verify_chip_signature(signature)) {
                //             // proceed to next step
                //             self.upload_procedure(4);
                //         } else {
                //             // disconnect
                //             self.upload_procedure(99);
                //         }
                //     });
                // }
            });
            break;

        case 4:
            // get INFO_BOARD_REV
            //get info INFO_BOARD_REV is a 3 byte send .. uploader.GET_DEVICE + INFO_BOARD_REV + uploader.EOC
            // get 'board_rev'  which is an 'int' ( 4 bytes )
            self.send([self.command.GET_DEVICE, self.command.INFO_BOARD_REV , self.command.EOC], 4, function (data) { // 0x01 ^ 0xFF

                var val = jspack.Unpack("<I", data);//struct.unpack("<I", data)  
                if ( val == undefined) return;
                //return val[0]
                
                console.log("INFO_BOARD_REV",data,val[0]);

                if ( val[0] > 100) { 
                    console.log("INVALID INFO_BOARD_REV, restarting...");
                    self.upload_procedure(1);
                    return;
                }
                self.upload_procedure(44);
            });
            break;  
        case 44:
                // get INFO_FLASH_SIZE
                //get info INFO_FLASH_SIZE is a 3 byte send .. uploader.GET_DEVICE + INFO_FLASH_SIZE + uploader.EOC
                // get 'board_rev'  which is an 'int' ( 4 bytes )
                self.send([self.command.GET_DEVICE, self.command.INFO_FLASH_SIZE , self.command.EOC], 4, function (data) { // 0x01 ^ 0xFF
    
                    var val = jspack.Unpack("<I", data);//struct.unpack("<I", data)  
                    if ( val == undefined) return;
                    //return val[0]

                    var fw_maxsize = val[0];
                    
                    console.log("INFO_FLASH_SIZE",data,val[0]);

                    console.log("  flash size: " ,fw_maxsize);

                    if (fw_maxsize < 1032192 ) { //fw.property('image_size')){ todo properly get "file size" of data from downloaded binary blob
                        console.log("Firmware image is too large for this board");
                    }
    
                    // if ( val[0] > 100) { 
                    //     console.log("INVALID INFO_FLASH_SIZE, restarting...");
                    //     self.upload_procedure(1);
                    //     return;
                    // }
                    self.upload_procedure(48);
                });
                break;  
                
        //self.__erase("Erase  ")
        //# send the CHIP_ERASE command and wait for the bootloader to become ready
        case 48:
            // erase memory

            //if (self.options.erase_chip) {
                var message = 'Executing chip erase' ;
                console.log(message);
                $('span.progressLabel').text(message + ' ...');

                // weirdly, the erase command doesn't immediately send back any bytes as a response, but when it finally does it should be INSYNC then OK 
                // so, we pray for 2 bytes in the best-case.  ( could be 20 secs)

                //BUZZ ToDO properly handle erase timeout here..?  do we need to?

                self.send([self.command.CHIP_ERASE, self.command.EOC], 2, function (reply) { //

                    if (reply.length != 2 ) { 
                        console.log("weird chip erase response, not right length");
                    }

                    var insync = reply[0];
                    var ok = reply[1];

                    if (( insync == self.command.INSYNC) && ( ok == self.command.OK)) {
                        console.log('Erasing: done');
                        // proceed to next step
                        //self.upload_procedure(49); don't go straight there, wait 20 sec and go from interval.
                    }

                    // failed
                    //self.upload_procedure(99);

                });

                helper.interval.add('erase_timeout', function () {

                        console.log('APJ erase timer hit... moving on ...');
                        
                        // protocol got stuck, clear timer and disconnect
                        helper.interval.remove('erase_timeout');

                        self.upload_procedure(49);

                        //break;
                }, 10000); 
            //} 

            break;

        // __program_multi  ?
        case 49:

            var message = 'Writing data' ;
            console.log(message);
            $('span.progressLabel').text(message + ' ...');

            var program_multi = async function (_data) {  //_data should be a block of no longer than PROG_MULTI_MAX

                // a prog_multi sends a variable amount of data, but defines how much its sending in advance, and expects INSYNC and OK at the end
                var multi_len = self.command.PROG_MULTI_MAX; // assume this, but it may be less.

                //var _data = [1,2,3,4,5];
                // we send PROG_MULTI, then 'length' of block to expect, then actual data block, then EOC
                //var pkt = [self.command.PROG_MULTI, multi_len, _data , self.command.EOC].flat(); //causes _data to be expanded in-line

                var tmppkt = new Uint8Array(_data.byteLength + 3);
                tmppkt.set([self.command.PROG_MULTI, multi_len],0);
                tmppkt.set(new Uint8Array(_data),2);
                tmppkt.set([self.command.EOC],_data.byteLength +2);
                
                var a = Array.from(tmppkt); // convert Uint8Array -> Array

                self.send(a, 2, function (reply) { // response should be INSYNC and oK

                    if (reply.length != 2 ) { 
                        console.log("weird chip response, not right length");
                    }

                    //console.log("writing",reply);

                    var insync = reply[0];
                    var ok = reply[1];

                    if (( insync == self.command.INSYNC) && ( ok == self.command.OK)) {
                        //console.log('multi: progress');
                        // proceed to next step
                        //self.upload_procedure(5);
                    } else {
                        // failed
                        console.log('multi: failed');
                        self.upload_procedure(99);
                    }

                });

                await sleep(10);//ms wait a bit for a response before moving on, or the next self.send() callback will overwrite this one b4 its executes
            }

            var program_multi_main = async function () { 

                // split self.hex into chunks no bigger than we can handle
                var i,j, temporary, chunk = self.command.PROG_MULTI_MAX;
                for (i = 0,j = self.hex.data.byteLength; i < j; i += chunk) {
                    temporary = self.hex.data.slice(i, i + chunk);
                    // do whatever
                    await program_multi(temporary);
                    // let gui
                    var message = 'Writing data '+i ;
                    console.log(message);
                    $('span.progressLabel').text(message + ' ...');
                }
                
            }

            var DOIT = async function () {
                await program_multi_main();

                self.upload_procedure(6);
            }

            DOIT();

            break;


        case 6:
            // verify
            console.log('Verifying data ...');
            $('span.progressLabel').text('Verifying ...');

           // console.log('Writing data ...');

            var verify_multi = async function () {  //_data should be a block of no longer than PROG_MULTI_MAX

                // a prog_multi sends a variable amount of data, but defines how much its sending in advance, and expects INSYNC and OK at the end
                //var multi_len = self.command.PROG_MULTI_MAX; // assume this, but it may be less.

                //var _data = [1,2,3,4,5];
                // we send GET_CRC,  then EOC, and expect 4 bytes ( as an int) CRC reply AND THEN also INSYNC and OK ( 6 bytes total)
                self.send([self.command.GET_CRC , self.command.EOC], 4, function (reply) { // response should be INSYNC and oK

                    if (reply.length != 4 ) { 
                        console.log("verify,weird chip response, not right length");
                    }

                    var val = jspack.Unpack("<I", reply); // just slice bytes at offsets: 0,1,2,3
                    if ( val == undefined) return;

                    var crc_val = val[0];
                    
                    console.log("GET_CRC",crc_val);
                    console.log("Verifying",reply);

                    // var insync = reply[4]; // after 4byte crc as Int
                    // var ok = reply[5];     // 

                    // if (( insync == self.command.INSYNC) && ( ok == self.command.OK)) {
                    //     console.log('Verify multi: done');
                    //     // proceed to next step
                    //     //self.upload_procedure(5);
                    // } else {
                    //     // failed
                    //     self.upload_procedure(99);
                    // }

                });

                await sleep(100);//ms wait a bit for a response before moving on,
            }
   

            var DOIT2 = async function () {
                await verify_multi();

                await sleep(1000);//ms 
                
                self.upload_procedure(7);
            }

            DOIT2();

            break;
        case 7:
            // go
            // memory address = 4 bytes, 1st high byte, 4th low byte, 5th byte = checksum XOR(byte 1, byte 2, byte 3, byte 4)
            console.log('Sending reboot command.');

            self.send([self.command.REBOOT, self.command.EOC], 0, function (reply) { 
                //console.log("sent ok"); never triggered as ardupilot bootloader doesn't "ack" the reboot
            });

            // let gui know
            var message = 'Success, probably.' ;
            console.log(message);
            $('span.progressLabel').text(message);

            self.upload_procedure(99);
            break;
        case 99:
            // disconnect
            helper.interval.remove('APJ_timeout'); // stop APJ timeout timer (everything is finished now)

            // close connection
            serial.disconnect(function (result) {

                // unlocking connect button
                GUI.connect_lock = false;

                // unlock some UI elements TODO needs rework
                $('select[name="release"]').prop('disabled', false);

                // handle timing
                var timeSpent = new Date().getTime() - self.upload_time_start;

                console.log('Script finished after: ' + (timeSpent / 1000) + ' seconds');

                // this [hopefully] turns OFF flash-on-connect after an attempt to prevent a re-flash loop
                $('.flash_on_connect').click();

                if (self.callback) self.callback();
            });
            break;
    }
};

// initialize object
var APJ = new APJ_protocol();

//var hex = 0;
//APJ.connect('/dev/ttACM0',115200 , hex, {} );