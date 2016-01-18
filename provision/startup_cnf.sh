echo "Restart HTTPD"
sudo service httpd stop
sudo service httpd start

echo "Starting NodeJS"
cd /vagrant/workspace/nativecamp-njs && node server.js &

echo "Enabling permissions"
cd /vagrant/workspace/ && chmod -R 777 user/webroot
cd /vagrant/workspace/ && chmod -R 777 teacher/webroot
cd /vagrant/workspace/ && chmod -R 777 admin/webroot
cd /vagrant/workspace/ && chmod -R 777 instructor/webroot
cd /vagrant/workspace/ && chmod -R 777 app/webroot