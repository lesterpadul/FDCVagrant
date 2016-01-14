echo "Restart HTTPD"
sudo service httpd stop
sudo service httpd start

echo "Starting NodeJS"
cd /var/www/nativecamp-njs && nohup supervisor server.js