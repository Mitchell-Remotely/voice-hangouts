screen -r runner
sudo git reset --hard origin/master
sudo git pull
sudo npm install
sudo npm run build
sudo rsync -a /home/AzureUser/voice-hangouts/public/ /var/www/html/
sudo npm run start