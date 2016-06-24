echo "Restart HTTPD"
sudo service httpd stop
sudo service httpd start

echo "Killing PORTS"
sudo fuser -k 3000/tcp
sudo fuser -k 3001/tcp

echo "Starting NodeJSv2"
nohup /var/www/NativeCamp-NJSv2 && node server.js > /dev/null &

echo "Starting NodeJS Broadcast"
nohup /var/www/NativeCamp-NJSBroadcast && node server.js > /dev/null &