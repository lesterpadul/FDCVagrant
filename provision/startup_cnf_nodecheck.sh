[ ! -d "/var/www/nativecamp_njsv2" ] && tar -zxvf /var/www/nativecamp_njsv2.tar.gz --directory /var/www 
[ -d "/var/www/nativecamp_njsv2" ] && echo "node server exists"