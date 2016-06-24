echo "Restart HTTPD"
sudo service httpd stop
sudo service httpd start

echo "Starting NodeJSv2"
cd /var/www/NativeCamp-NJSv2 && forever start signaling.json

echo "Starting NodeJS Broadcast"
cd /var/www/NativeCamp-NJSBroadcast && forever --append start server.js