echo "Restart HTTPD"
sudo service httpd stop
sudo service httpd start

echo "Starting NodeJSv2"
cd /var/www/NativeCamp-NJSv2 && node server.js > /dev/null &

echo "Starting NodeJS Broadcast"
cd /var/www/NativeCamp-NJSBroadcast && node server.js > /dev/null &