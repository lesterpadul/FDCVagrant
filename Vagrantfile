Vagrant.configure("2") do |config|   
  # ssh
  config.ssh.forward_agent = true
  config.ssh.username = "vagrant"
  config.ssh.password = "vagrant"
  config.ssh.insert_key = false
  config.vm.network "private_network", ip: "192.168.33.11"
  
  # disable update
  config.vm.box_check_update = false
  
  # newnc machine
  config.vm.define "ncv2" do |nc2|
    # box
    nc2.vm.box = "fdc.ncv2"
    nc2.vm.box_url = "ncv2.box"
    
    # run newnc setup
    nc2.vm.provision :shell, :path => "./provision/startup_cnf.sh", privileged: true, run: "always"
    nc2.vm.provision :shell, :path => "./provision/startup_cnf_node.sh", privileged: false, run: "always"
    
    # virtual machine informtaion
    nc2.vm.provider "virtualbox" do |v|
      v.name = "nc2-machine"
      v.memory = 2048
      v.cpus = 2
    end
  end
  
  # newphpunit
  config.vm.define "ncphp7v2" do |nc2|
    # box
    nc2.vm.box = "ncphp7v2"
    nc2.vm.box_url = "ncphp7v2.box"

    # run newnc setup
    config.vm.synced_folder "./workspace", "/var/www"
    config.vm.synced_folder "./conf/vhost", "/etc/httpd/conf.d"

    nc2.vm.provision :shell, :path => "./provision/startup_cnf.sh", privileged: true, run: "always"
    nc2.vm.provision :shell, :path => "./provision/startup_cnf_node.sh", privileged: true, run: "always"
    
    # virtual machine informtaion
    nc2.vm.provider "virtualbox" do |v|
      v.name = "ncphp7-machine"
      v.memory = 2048
      v.cpus = 2
    end
  end
end