echo "Transferring my.cnf file"
cat /vagrant/conf/mysql/my.cnf
cp /vagrant/conf/mysql/my.cnf /etc/my.cnf
sudo service mysqld restart

echo "Transferring vhost configuration"
cat /vagrant/conf/vhost/vhost.conf
cp /vagrant/conf/vhost/vhost.conf /etc/httpd/conf.d/vhost_ssl.conf

echo "Transferring vhost_ssl configuration"
sudo yum -y install mod_ssl
cat /vagrant/conf/vhost/vhost_ssl.conf
cp /vagrant/conf/vhost/vhost_ssl.conf /etc/httpd/conf.d/vhost_ssl.conf