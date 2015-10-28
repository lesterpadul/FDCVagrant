echo "transferring my.cnf file"
cat /vagrant/conf/my.cnf
cp /vagrant/conf/my.cnf /etc/my.cnf
sudo service mysqld restart

echo "transferring phpmyadmin config.inc.php file"
cat /vagrant/conf/config.inc.php
cp /vagrant/conf/config.inc.php /etc/phpMyAdmin/config.inc.php
sudo service httpd restart