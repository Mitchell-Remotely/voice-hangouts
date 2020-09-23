sudo cd '/home/AzureUser/voice-hangouts/'
sudo git reset --hard origin/master
sudo git pull
sudo chmod 777 ./startupProd.sh
sudo npm install
sudo npm run build
sudo rsync -a public/ /var/www/html/
sudo npm run start-prod