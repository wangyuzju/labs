init:
	cd labs && npm install


dev:
	DEBUG=labs supervisor labs/bin/www
