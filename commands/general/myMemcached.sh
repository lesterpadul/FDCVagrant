# fetch latest epel release
sudo rpm -Uvh http://mirrors.kernel.org/fedora-epel/6/x86_64/epel-release-6-8.noarch.rpm

# update yum
sudo yum -y update

# install memcached
sudo yum -y install memcached

# install development tools; including pecl
sudo yum -y groupinstall "Development Tools"

# install memcached and other dependencies
sudo yum -y install zlib-devel libmemcached-devel php-pear php-pecl-memcached

# install memcached via pecl
sudo pecl -y install -f memcached-1.0.0

# restart memcached
sudo service memcached restart

# restart apache
sudo service httpd restart