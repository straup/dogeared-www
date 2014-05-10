build:	js css

js:
	java -Xmx64m -jar lib/google-compiler/compiler-20100616.jar --js www/javascript/dogeared.js --js www/javascript/dogeared.network.js --js www/javascript/dogeared.appcache.js --js www/javascript/dogeared.feedback.js  --js www/javascript/dogeared.api.js --js www/javascript/dogeared.extruder.js --js www/javascript/dogeared.documents.js --js www/javascript/dogeared.document.js --js www/javascript/dogeared.highlights.js --js www/javascript/dogeared.cache.js --js www/javascript/dogeared.cache.documents.js --js www/javascript/dogeared.cache.highlights.js > www/javascript/dogeared.bundle.min.js

	cat www/javascript/jquery-1.8.2.min.js www/javascript/bootstrap.min.js www/javascript/store.min.js www/javascript/phpjs.htmlspecialchars.js www/javascript/md5.min.js > www/javascript/dogeared.dependencies.min.js

css:

	java -jar lib/yuicompressor/yuicompressor-2.4.7.jar --type css --charset utf8 -o www/css/dogeared.bootstrap.min.css www/css/dogeared.bootstrap.css 
	java -jar lib/yuicompressor/yuicompressor-2.4.7.jar --type css --charset utf8 -o www/css/dogeared.api.min.css www/css/dogeared.api.css

	cat www/css/bootstrap.min.css www/css/dogeared.bootstrap.min.css www/css/dogeared.api.min.css > www/css/dogeared.bundle.min.css

templates:
	php -q ./bin/compile-templates.php

secret:
	php -q ./bin/generate_secret.php
