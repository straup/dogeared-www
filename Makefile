all: clean todo

clean:
	rm -f ./TODO.txt

js:
	java -Xmx64m -jar lib/google-compiler/compiler-20100616.jar --js www/javascript/dogeared.js --js www/javascript/dogeared.network.js --js www/javascript/dogeared.feedback.js  --js www/javascript/dogeared.api.js --js www/javascript/dogeared.documents.js --js www/javascript/dogeared.document.js --js www/javascript/dogeared.highlights.js --js www/javascript/dogeared.cache.js --js www/javascript/dogeared.cache.documents.js --js www/javascript/dogeared.cache.highlights.js > www/javascript/dogeared.bundle.min.js

	cat www/javascript/jquery-1.8.2.min.js www/javascript/bootstrap.min.js www/javascript/store.min.js www/javascript/phpjs.htmlspecialchars.js www/javascript/md5.min.js > www/javascript/dogeared.dependencies.min.js

todo: TODO.txt

TODO.txt:
	@echo "Generating TODO.txt file"
	@echo "# This file was generated automatically by grep-ing for 'TO DO' in the source code." > ./TODO.txt
	@echo "# This file is meant as a pointer to the actual details in the files themselves." >> TODO.txt
	@echo "# This file was created "`date` >> TODO.txt
	@echo "" >> TODO.txt
	@-grep -n -r -e "TO DO" www >> TODO.txt
	@-grep -n -r -e "TO DO" bin >> TODO.txt
	@-grep -n -r -e "TODO" www >> TODO.txt
	@-grep -n -r -e "TODO" bin >> TODO.txt

templates:
	php -q ./bin/compile-templates.php

secret:
	php -q ./bin/generate_secret.php
