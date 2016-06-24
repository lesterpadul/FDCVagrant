echo "Transferring my.cnf file"
cat /vagrant/conf/mysql/my.cnf
cp /vagrant/conf/mysql/my.cnf /etc/my.cnf
sudo service mysqld restart

echo "Re-installing NODEJS"
cd /usr/src
sudo wget http://nodejs.org/dist/v0.10.4/node-v0.10.4.tar.gz
sudo tar zxf node-v0.10.4.tar.gz
cd node-v0.10.4
sudo ./configure
sudo make
sudo make install

echo "Upgrading NODEJS"
sudo npm cache clean -f
sudo npm install -g n
sudo n stable

echo "Updating NODEJS NPM pacakges"
cd /var/www/NativeCamp-NJSv2
sudo npm install --verbose --no-bin-links

echo "Installing Forever "
cd /var/www/NativeCamp-NJSBroadcast
sudo npm install forever --verbose --global