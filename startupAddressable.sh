sudo git reset --hard origin/addressables
sudo git pull
sudo chmod 777 ./startupAddressable.sh
sudo npm install
sudo npm run build-addressables
sudo rsync -a public/ /var/www/html/
sudo npm run start-addressable