echo "Transferring phpmyadmin config.inc.php file"
cat /vagrant/conf/phpmyadmin/config.inc.php
cp /vagrant/conf/phpmyadmin/config.inc.php /etc/phpMyAdmin/config.inc.php

echo "Transferring php php.ini file"
cat /vagrant/conf/box.nc/php.ini
cp /vagrant/conf/box.nc/php.ini /etc/php.ini