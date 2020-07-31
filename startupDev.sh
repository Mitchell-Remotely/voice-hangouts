sudo git reset --hard origin/development
sudo git pull
sudo chmod 777 ./startup.sh
sudo npm install
sudo npm run build
sudo rsync -a public/ /var/www/html/
sudo npm run start