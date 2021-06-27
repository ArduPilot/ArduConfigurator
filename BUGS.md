BUGS.md

## ARDUPILOT Configurator start minimized, what should I do?

You have to remove `C:\Users%Your_UserNname%\AppData\Local\ARDUPILOT-configurator` folder and all its content.

[https://www.youtube.com/watch?v=XMoULyiFDp4](https://www.youtube.com/watch?v=XMoULyiFDp4)

Alternatively, on Windows with PowerShell you can use `post_install_cleanup.ps1` script that will do the cleaning. (thank you James Cherrill)

## 3d model doesn't work in your browser / app screen comes up all white?

you have a crappy video card that doesn't support web-gl by default:
goto chrome://flags/#ignore-gpu-blacklist
and enable it .


