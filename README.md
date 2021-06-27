# ARDUPILOT Configurator

ARDUPILOT Configurator is a crossplatform configuration tool for the [ARDUPILOT](https://github.com/ArduPilot/ardupilot) flight control system.

It runs as an app within Google Chrome and allows you to configure the ARDUPILOT software running on any supported ARDUPILOT target.

Various types of aircraft are supported by the tool and by ARDUPILOT, e.g. quadcopters, hexacopters, octocopters and fixed-wing aircraft.

![pic1](https://github.com/davidbuzz/ardu-configurator/blob/master/configurator1.png?raw=true)
![pic2](https://github.com/davidbuzz/ardu-configurator/blob/master/configurator2.png?raw=true)
![pic3](https://github.com/davidbuzz/ardu-configurator/blob/master/configurator3.png?raw=true)
![pic4](https://github.com/davidbuzz/ardu-configurator/blob/master/configurator4.png?raw=true)
![pic5](https://github.com/davidbuzz/ardu-configurator/blob/master/configurator5.png?raw=true)
![pic6](https://github.com/davidbuzz/ardu-configurator/blob/master/configurator6.png?raw=true)


## Installation

Depending on target operating system, _ARDUPILOT Configurator_ is distributed as _standalone_ application or Chrome App.

### Windows

1. Visit [release page](https://github.com/davidbuzz/ardu-configurator/releases)
1. Download Configurator for Windows platform (win32 or win64 is present)
1. Extract ZIP archive
1. Run ARDUPILOT Configurator app from unpacked folder
1. Configurator is not signed, so you have to allow Windows to run untrusted application. There might be a monit for it during first run 

### Linux

1. Visit [release page](https://github.com/davidbuzz/ardu-configurator/releases)
1. Download Configurator for Linux platform (linux32 and linux64 are present)
1. Extract tar.gz archive
1. Make the ARDUPILOT-configurator file executable (chmod +x ARDUPILOT-configurator)
1. Run ARDUPILOT Configurator app from unpacked folder

### Mac

1. Visit [release page](https://github.com/davidbuzz/ardu-configurator/releases)
1. Download Configurator for Mac platform
1. Extract ZIP archive
1. Run ARDUPILOT Configurator
1. Configurator is not signed, so you have to allow Mac to run untrusted application. There might be a monit for it during first run 

### ChromeOS

**ARDUPILOT Configurator** form ChromeOS is available in [Chrome Web Store](https://chrome.google.com/webstore/detail/ARDUPILOT-configurator/fmaidjmgkdkpafmbnmigkpdnpdhopgel)

### Building and running ARDUPILOT Configurator locally (for development or Linux users)

For local development, **node.js** build system is used.

1. Install node.js
1. From project folder run `npm install`
1. To build the JS and CSS files and start the configurator:
    - With NW.js: Run `npm start`.
    - With Chrome: Run `npm run gulp`. Then open `chrome://extensions`, enable
    the `Developer mode`, click on the `Load unpacked extension...` button and select the `ARDUPILOT-configurator` directory.

Other tasks are also defined in `gulpfile.js`. To run a task, use `./node_modules/gulp/bin/gulp.js task-name`. Available ones are:

- **build**: Generate JS and CSS output files used by the configurator from their sources. It must be run whenever changes are made to any `.js` or `.css` files in order to have those changes appear
in the configurator. If new files are added, they must be included in `gulpfile.js`. See the comments at the top of `gulpfile.js` to learn how to do so. See also the `watch` task.
- **watch**: Watch JS and CSS sources for changes and run the `build` task whenever they're edited.
- **dist**: Create a distribution of the app (valid for packaging both as a Chrome app or a NW.js app)
in the `./dist/` directory.
- **release**: Create NW.js apps for each supported platform (win32, osx64 and linux64) in the `./apps`
directory. Running this task on macOS or Linux requires Wine, since it's needed to set the icon
for the Windows app. If you don't have Wine installed you can create a release by running the **release-only-linux** task.

Quick start ( Devs use linux , so other platforms YMMV):
'npm run dev' to run it from the source folder without bundling any resources, great for debug and code hacking. Its also the only way the code runs right this instant., sorry, we haven't got any release ready yet. 'npm start' is very similar, but uses a 'bundled' main.html

Bundling/releasing not working properly just now, but when it's working it will run like this:
'npm run gulp dist' to bundle it.
'npm run gulp release' to make win32/win64/osx/linux32/linux64 packages.

## BUGs?  absolutely.

See [BUGS page](https://github.com/davidbuzz/ardu-configurator/blob/master/BUGS.md)


## Different MAP providers? 

See [MAPS page](https://github.com/davidbuzz/ardu-configurator/blob/master/MAPS.md)


## Notes

### WebGL

Make sure Settings -> System -> "User hardware acceleration when available" is checked to achieve the best performance

### Linux users

1. Dont forget to add your user into dialout group "sudo usermod -aG dialout YOUR_USERNAME" for serial access
2. If you have 3D model animation problems, enable "Override software rendering list" in Chrome flags chrome://flags/#ignore-gpu-blacklist

## Support

GitHub issue tracker is reserved for bugs and other technical problems. If you do not know how to setup
everything, hardware is not working or have any other _support_ problem, please consult:

* [discuss user forums thread](https://discuss.ardupilot.org/)

* [developer chat](https://ardupilot.org/dev/docs/ardupilot-discord-server.html)

## Issue trackers

For ARDUPILOT configurator issues raise them here

https://github.com/davidbuzz/ardu-configurator/issues

For ARDUPILOT firmware issues raise them here

https://github.com/ArduPilot/ardupilot/issues

## Developers

We accept clean and reasonable patches or PRs, submit them!

## Credits - happy to correct these credits if they are wrong or incomplete.

ctn -  author and maintainer ofof stuff from which this project was forked.
Hydra - author and maintainer of stuff from which this project was forked.
Konstantin Sharlaimov/DigitalEntity - author and maintainer of stuff from which this project was forked.
Paweł Spychalski - author and maintainer of stuff from which this project was forked.