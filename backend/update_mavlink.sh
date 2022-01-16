cd /home/buzz/GCS/ardu-configurator/backend/
# we're effectively rebuilding the local_modules folder entirely with new generated content, so drop it:
rm -rf local_modules/
mkdir local_modules
 # make sure generated output is up-to-date as possible
echo "PREPPING GENERATED OUTPUT"
cd ~/GCS/mavlink/pymavlink/generator ; ./gen_js.sh > /dev/null ; cd - 
#we're gonna treat 'mavlink_ardupilotmega_v2.0' as a "local_module" and put it in the right spot that it matches the package.json of mavagent.
echo "INTEGRATING generated mavlink module as a local-module"
cp -rp ~/GCS/mavlink/pymavlink/generator/javascript/implementations/mavlink_ardupilotmega_v2.0 ./local_modules/
# is has its own local_modules 'jspack' and 'long' that it needs to be able to find and symlink to as well:
cp -rp ~/GCS/mavlink/pymavlink/generator/javascript/local_modules .
# this is just setting up the mavlink_ardupilotmega_v2.0 module with its own npm-install
echo "INSTALLING LOCAL MAVLINK DEPENDANCIES"
cd local_modules/mavlink_ardupilotmega_v2.0 ; rm local_modules ; ln -s ../../local_modules ; npm install 2>&1 | grep 'added'; cd -
# we now npm install mavagent itself.
echo "INSTALLING MAVAGENT DEPENDANCIES"
cd /home/buzz/GCS/ardu-configurator
npm install 
