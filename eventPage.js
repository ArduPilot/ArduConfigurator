/*
    If an id is also specified and a window with a matching id has been shown before, the remembered bounds of the window will be used instead.
*/
//'use strict';

function startApplication() {
    var applicationStartTime = new Date().getTime();

    chrome.app.window.create('main.html', {
        id: 'main-window',
        frame: 'chrome',
        innerBounds: {
            minWidth: 1024,
            minHeight: 550
        }
    }, function (createdWindow) {
        createdWindow.contentWindow.addEventListener('load', function () {
            createdWindow.contentWindow.catch_startup_time(applicationStartTime);
        });

        createdWindow.onClosed.addListener(function () {
            // automatically close the port when application closes
            // save connectionId in separate variable before createdWindow.contentWindow is destroyed
            var connectionType = createdWindow.contentWindow.Connection.connectionType; //'tcp','udp,'serial' etc
            var connectionId = createdWindow.contentWindow.Connection.connectionId,
                valid_connection = createdWindow.contentWindow.CONFIGURATOR.connectionValid,
                mincommand = createdWindow.contentWindow.MISC.mincommand;


            //if (connectionId && valid_connection) {
            if (connectionId || valid_connection) {

                
                if ( connectionType == 'serial' ) {
                        chrome.serial.disconnect(connectionId, function (result) {
                            console.log('SERIAL: Connection closed - Window.onClosed');
                            createdWindow.contentWindow.CONFIGURATOR.connectionValid = false;
                            createdWindow.contentWindow.Connection.connectionId = null; // no connection.
                        });
                }
                if ( connectionType == 'udp' ) {
                    // buzz todo - send event to backend
                    
                    console.log('UDP: Connection closed - Window.onClosed');
                    createdWindow.contentWindow.CONFIGURATOR.connectionValid = false;
                    createdWindow.contentWindow.Connection.connectionId = null; // no connection.
                }
                if ( connectionType == 'tcp' ) {
                    // buzz todo - send event to backend
                    console.log('TCP: Connection closed - Window.onClosed');
                    createdWindow.contentWindow.CONFIGURATOR.connectionValid = false;
                    createdWindow.contentWindow.Connection.connectionId = null; // no connection.
                }

            } //else if (connectionId) {
            //     chrome.serial.disconnect(connectionId, function (result) {
            //         console.log('SERIAL: Connection closed - ' + result);
            //         createdWindow.contentWindow.Connection.connectionId = null; // no connection.
            //     });
                
            // }
        });
    });
}

chrome.app.runtime.onLaunched.addListener(startApplication);

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == 'update') {
        var previousVersionArr = details.previousVersion.split('.'),
            currentVersionArr = chrome.runtime.getManifest().version.split('.');

        // only fire up notification sequence when one of the major version numbers changed
        if (currentVersionArr[0] > previousVersionArr[0] || currentVersionArr[1] > previousVersionArr[1]) {
            chrome.storage.local.get('update_notify', function (result) {
                if (result.update_notify === 'undefined' || result.update_notify) {
                    var manifest = chrome.runtime.getManifest();
                    var options = {
                        priority: 0,
                        type: 'basic',
                        title: manifest.name,
                        message: chrome.i18n.getMessage('notifications_app_just_updated_to_version', [manifest.version]),
                        iconUrl: '/images/icon_128.png',
                        buttons: [{'title': chrome.i18n.getMessage('notifications_click_here_to_start_app')}]
                    };

                    chrome.notifications.create('baseflight_update', options, function (notificationId) {
                        // empty
                    });
                }
            });
        }
    }
});

chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex) {
    if (notificationId == 'baseflight_update') {
        startApplication();
    }
});