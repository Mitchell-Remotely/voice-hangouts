sudo git reset --hard origin/master
sudo git pull
sudo chmod 777 ./startup.sh
sudo npm run build
sudo rsync -a /public ~/var/www/html/index.html
sudo npm run start