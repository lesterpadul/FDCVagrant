echo "Restart HTTPD"
sudo service httpd stop
sudo service httpd start

echo "Starting NodeJS"
cd /vagrant/workspace/nativecamp-njs && node server.js > /dev/null &