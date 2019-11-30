# control apache2
echo "Restart HTTPD"
sudo service httpd stop
sudo service httpd start

# control mysqld
echo "Restart mysqld"
sudo service mysqld stop
sudo service mysqld start

# control memcached
echo "Restart memcached"
sudo service memcached stop
sudo service memcached start

# start up
echo "Start up complete!";