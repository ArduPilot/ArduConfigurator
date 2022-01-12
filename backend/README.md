This 'backend' folder is for custom and/or local Node modules that are ONLY loaded by the Node 'main' instance prior to anything else happening, including NW/webpack/etc .

They are defined in package.json -> dependancies -> file: xxxx  and made-available to node by the 'npm install' command, along with standard Node things like 'nw' and 'gulp'.

hint: If you want the chrome front-end javacript engine to load your .js files, don't put them here.   They need to be defined in gulpfile.js -> sources.xxx  .. Which results in one of the following:
'npm run dev'  creates main.html from main.tmpl.html with all the <script> ....XXX.js</script> tags needed to get it loaded in teh front end "naked" / unbundled.
OR
'rpm run gulp build' makes a ./build/script.js that contains all of the .js files in one file and makes main.html from main.tmpl.html with only that one script tag, ie bundled. ... or something like that.



