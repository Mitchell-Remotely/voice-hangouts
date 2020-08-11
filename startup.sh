sudo certbot certonly --cert-name remotely-meeting-rooms.australiaeast.cloudapp.azure.com -d remotely-meeting-rooms.australiaeast.cloudapp.azure.com
sudo certbot renew --post-hook "apachectl graceful"
sudo cd '/home/AzureUser/voice-hangouts/'
sudo git reset --hard origin/master
sudo git pull
sudo chmod 777 ./startup.sh
sudo npm install
sudo npm run build
sudo rsync -a /home/AzureUser/voice-hangouts/public/ /var/www/html/
sudo npm run start