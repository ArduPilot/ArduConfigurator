# sudo apt install icnsutils
png2icns ARDUPILOT.icns 512.png 256.png 128.png
cp ARDUPILOT.icns ..

# sudo apt install imagemagick
convert -resize x16 -gravity center -crop 16x16+0+0 512.png -flatten -colors 256 -background transparent ./ARDUPILOT.ico
cp ARDUPILOT.ico ..
