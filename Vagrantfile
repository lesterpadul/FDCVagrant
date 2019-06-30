VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # box information
  config.vm.box = ""
  config.vm.box_url = "" 
  config.vm.network "private_network", ip: "192.168.33.10"  
  
  # setup vagrant username and password
  config.ssh.username = "vagrant"
  config.ssh.password = "vagrant"

  # synced folder
  config.vm.synced_folder "./workspace", "/var/www", create: true, owner: "apache", group: "apache", mount_options: ["dmode=775,fmode=664"]
  config.vm.synced_folder "./conf/vhost", "/etc/httpd/conf.d", create: true, owner: "apache", group: "apache", mount_options: ["dmode=775,fmode=664"]

  # nc
  config.vm.define "nc" do |nc|
    # run php unit setup
    nc.vm.provision :shell, :path => "./provision/startup_cnf.sh", privileged: true, run: "always"
    nc.vm.provision :shell, :path => "./commands/general/triggerNodeServers.sh", run: "always"

    # virtual machine information
    nc.vm.provider "virtualbox" do |v|
      v.name = "nc-machine"
    end
  end
end