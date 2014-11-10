init:
	cd labs && npm install


dev:
	DEBUG=labs supervisor labs/bin/www

start:
	pm2 start labs/bin/www --name "labs"

stop:
	pm2 delete labs


prod_update:
	git pull
	pm2 restart "labs"
