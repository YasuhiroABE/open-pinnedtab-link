
DATE = $(shell date +%y%m%d.%H%M)
OUTPUT = archives/open-pinnedtab-link.$(DATE).zip

$(OUTPUT): manifest.json options.html
	touch $(OUTPUT)
	test -f $(OUTPUT) && rm $(OUTPUT)
	zip $(OUTPUT) css/*.css icons/*  manifest.json  scripts/*.js options.html _locales/*/messages.json
