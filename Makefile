

../open-pinnedtab-link.zip: background.html manifest.json
	touch ../open-pinnedtab-link.zip
	test -f ../open-pinnedtab-link.zip && rm ../open-pinnedtab-link.zip 
	zip ../open-pinnedtab-link.zip background.html  icons/*  manifest.json  scripts/* options.html _locales/*/messages.json
