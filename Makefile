

../open-pinnedtab-link.zip: background.html manifest.json
	touch ../open-pinnedtab-link.zip
	test -f ../open-pinnedtab-link.zip && rm ../open-pinnedtab-link.zip 
	zip ../open-pinnedtab-link.zip background.html  css/*.css icons/*  manifest.json  scripts/*.js options.html _locales/*/messages.json
