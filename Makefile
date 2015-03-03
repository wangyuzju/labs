install_node_module:
	cd labs && npm install

dev:
	DEBUG=labs supervisor labs/bin/www

start:
	pm2 start labs/bin/www --name "labs"

stop:
	pm2 delete labs

test_push:
	git add -A
	git commit -m "test github hooks"
	git push

update:
	git reset --hard
	git pull

prod_update: update install_node_module
	pm2 restart "labs"
