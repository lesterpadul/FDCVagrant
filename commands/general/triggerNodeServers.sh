echo "Killing Ports"
sudo fuser -k 3000/tcp
sudo fuser -k 3001/tcp

echo "Starting NodeJSv2"
cd /var/www/NativeCamp-NJSv2 && nohup node server.js > /dev/null 2>&1 &

echo "Starting NodeJS Broadcast"
cd /var/www/NativeCamp-NJSBroadcast && nohup node server.js > /dev/null 2>&1 &