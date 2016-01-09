echo "Transferring phpmyadmin config.inc.php file"
cat /vagrant/conf/phpmyadmin/config.inc.php
cp /vagrant/conf/phpmyadmin/config.inc.php /etc/phpMyAdmin/config.inc.php

echo "Upgrade PHP from 5.3 to 5.6"
rpm -Uvh /vagrant/conf/rpm/epel-release-6-8.noarch.rpm 
rpm -Uvh /vagrant/conf/rpm/remi-release-6.rpm
cp /vagrant/conf/box.phpunit/remi.repo /etc/yum.repos.d/remi.repo
yum update -y
php --version

echo "Install php-xdebug"
yum -y install php-devel
yum -y install php-pear
yum -y install gcc gcc-c++ autoconf automake
pecl install Xdebug

echo "Transferring php php.ini file"
cat /vagrant/conf/box.phpunit/php.ini
cp /vagrant/conf/box.phpunit/php.ini /etc/php.ini