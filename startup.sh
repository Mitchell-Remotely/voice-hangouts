sudo git reset --hard origin/master
sudo git pull
sudo chmod 777 ./startup.sh
sudo npm install
sudo npm run build
sudo rsync -a /home/AzureUser/voice-hangouts/public/ /var/www/html/
sudo npm run start