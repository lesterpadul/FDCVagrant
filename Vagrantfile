Vagrant.configure("2") do |config|
  # box
  config.vm.box = "fdc.nc2"
  config.vm.box_url = ""
  
  # synced folders
  config.vm.synced_folder "./workspace", "/var/www", create: true, owner: "apache", group: "apache", mount_options: ["dmode=775,fmode=664"]
  config.vm.synced_folder "./conf/vhost", "/etc/httpd/conf.d", create: true, owner: "apache", group: "apache", mount_options: ["dmode=775,fmode=664"]
    
  # ssh
  config.ssh.forward_agent = true
  config.ssh.username = "vagrant"
  config.ssh.password = "vagrant"
  config.ssh.insert_key = false
  config.vm.network "private_network", ip: "192.168.33.11"
  
  # disable update
  config.vm.box_check_update = false
  
  # newnc machine
  config.vm.define "nc2" do |nc2|
    # run newnc setup
    nc2.vm.provision :shell, :path => "./provision/startup_cnf.sh", privileged: true, run: "always"
    nc2.vm.provision :shell, :path => "./provision/startup_cnf_node.sh", privileged: false, run: "always"

    # virtual machine informtaion
    nc2.vm.provider "virtualbox" do |v|
      v.name = "nc2-machine"
    end
  end
  
  # newphpunit
  config.vm.define "phpunit2" do |phpunit2|
    # run phpunitnew setup

    phpunit2.vm.provision :shell, :path => "./provision/startup_cnf.sh", privileged: true, run: "always"

    # virtual machine information
    phpunit2.vm.provider "virtualbox" do |v|
      v.name = "phpunit2-machine"
    end
  end
end