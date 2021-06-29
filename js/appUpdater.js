//'use strict';

var appUpdater = appUpdater || {};

appUpdater.checkRelease = function (currVersion) {
    var modalStart;
    $.get('https://api.github.com/repos/davidbuzz/ardu-configurator/releases', function (releaseData) {
        GUI.log('Loaded [configurator] release information from GitHub.');
        //Git return sorted list, 0 - last release

        let newVersion; 
        let newPrerelase;
        if ( releaseData[0] == undefined) {  
            releaseData = Array({}); 
            releaseData[0].tag_name = 'no releases found'; 
            newPrerelase = false;
            GUI.log('no releases available.');
        }

        newVersion = releaseData[0].tag_name;
        newPrerelase = releaseData[0].prerelease;
        let releaseHeader = releaseData[0].name;
        let releaseBody = releaseData[0].body;

        //GUI.log('current released version is:'+newVersion+" "+newPrerelase);

        // beta/pre-release
        if (newPrerelase == true && semver.gt(newVersion, currVersion)) {
            //GUI.log(newVersion, chrome.runtime.getManifest().version);
            //GUI.log(currVersion);

            $('h1.modal__title').html("New BETA Configurator version available -->  "+newVersion);
            $('div.modal__text').html("Release Notes:<br>"+releaseHeader+"<br>"+releaseBody);

            GUI.log('New BETA version available! -->'+newVersion);
            modalStart = new jBox('Modal', {
                width: 600,
                height: 400,
                animation: false,
                closeOnClick: false,
                closeOnEsc: true,
                content: $('#appUpdateNotification')
            }).open();  // buzz todo we probably shouldn't bug users with beta's as much as releases?
        }

        // release version
        if (newPrerelase == false && semver.gt(newVersion, currVersion)) {
            //GUI.log(newVersion, chrome.runtime.getManifest().version);
            //GUI.log(currVersion);

            $('h1.modal__title').html("New RELEASE Configurator version available -->  "+newVersion);
            $('div.modal__text').html("Release Notes:<br>"+releaseHeader+"<br>"+releaseBody);


            GUI.log('New RELEASE version available! -->'+newVersion);
            modalStart = new jBox('Modal', {
                width: 400,
                height: 200,
                animation: false,
                closeOnClick: false,
                closeOnEsc: true,
                content: $('#appUpdateNotification')
            }).open();
        }
    });

    $('#update-notification-close').on('click', function () {
        modalStart.close();
    });
    $('#update-notification-download').on('click', function () {
        modalStart.close();
    });
};
