echo "transferring my.cnf file"
cat /vagrant/conf/my.cnf
cp /vagrant/conf/my.cnf /etc/my.cnf
sudo service mysqld restart

echo "transferring php php.ini file"
cat /vagrant/conf/php.ini
cp /vagrant/conf/php.ini /etc/php.ini

echo "transferring phpmyadmin config.inc.php file"
cat /vagrant/conf/phpmyadmin/config.inc.php
cp /vagrant/conf/phpmyadmin/config.inc.php /etc/phpMyAdmin/config.inc.php

echo "transferring ssl configuration"
sudo yum -y install mod_ssl
cat /vagrant/conf/vhost_ssl.conf
cp /vagrant/conf/vhost_ssl.conf /etc/httpd/conf.d/vhost_ssl.conf
sudo service httpd restart