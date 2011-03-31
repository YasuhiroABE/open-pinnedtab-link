

../open-pinnedtab-link.zip: background.html manifest.json
	test -f ../open-pinnedtab-link.zip && rm ../open-pinnedtab-link.zip 
	zip ../open-pinnedtab-link.zip background.html  icons/*  manifest.json  scripts/*
