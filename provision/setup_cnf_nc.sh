echo "Transferring my.cnf file"
cat /vagrant/conf/my.cnf
cp /vagrant/conf/my.cnf /etc/my.cnf
sudo service mysqld restart

echo "Transferring phpmyadmin config.inc.php file"
cat /vagrant/conf/phpmyadmin/config.inc.php
cp /vagrant/conf/phpmyadmin/config.inc.php /etc/phpMyAdmin/config.inc.php

echo "Transferring vhost configuration"
cat /vagrant/conf/vhost.conf
cp /vagrant/conf/vhost.conf /etc/httpd/conf.d/vhost_ssl.conf

echo "Transferring vhost_ssl configuration"
sudo yum -y install mod_ssl
cat /vagrant/conf/vhost_ssl.conf
cp /vagrant/conf/vhost_ssl.conf /etc/httpd/conf.d/vhost_ssl.conf

echo "Transferring php php.ini file"
cat /vagrant/conf/box.nc/php.ini
cp /vagrant/conf/box.nc/php.ini /etc/php.ini