echo "Restart HTTPD"
sudo service httpd stop
sudo service httpd start

echo "Starting NodeJS"
cd /vagrant/workspace/nativecamp-njs && node server.js
echo -ne '\n'

echo "Enabling permissions"
cd /vagrant/workspace/nativecamp && chmod -R 777 user/webroot && chmod -R 777 user/tmp
cd /vagrant/workspace/nativecamp && chmod -R 777 teacher/webroot && chmod -R 777 teacher/tmp
cd /vagrant/workspace/nativecamp && chmod -R 777 admin/webroot && chmod -R 777 admin/tmp
cd /vagrant/workspace/nativecamp && chmod -R 777 instructor/webroot && chmod -R 777 instructor/tmp
cd /vagrant/workspace/nativecamp && chmod -R 777 app/webroot && chmod -R 777 app/tmp