# always enable php 7.3
sudo amazon-linux-extras enable lamp-mariadb10.2-php7.2
sudo amazon-linux-extras disable lamp-mariadb10.2-php7.2
sudo amazon-linux-extras enable php7.4
sudo amazon-linux-extras disable php7.4

# control apache2
echo "Restart HTTPD"
sudo service httpd stop
sudo service httpd start

# control mysqld
echo "Restart mysqld"
sudo service mariadb stop
sudo service mariadb start

# control memcached
echo "Restart memcached"
#sudo service memcached stop
#sudo service memcached start

# start up
echo "Start up complete!";