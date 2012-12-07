SH = sh
NODE = node
NPM = npm

deploy:
	git pull origin master \
	&& $(NPM) install .
	
.PHONY: deploy