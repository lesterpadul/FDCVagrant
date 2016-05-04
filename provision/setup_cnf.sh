echo "Transferring my.cnf file"
cat /vagrant/conf/mysql/my.cnf
cp /vagrant/conf/mysql/my.cnf /etc/my.cnf
sudo service mysqld restart

echo "Upgrading NODEJS"
sudo npm cache clean -f
sudo npm install -g n
sudo n stable