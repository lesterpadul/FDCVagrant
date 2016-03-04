VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  # box information
  config.vm.box = "fdc.local_2016_09_01"
  config.vm.box_url = "package.box" 

  # port forwarding
  config.vm.network "forwarded_port", guest: 80, host: 80 # for http
  config.vm.network "forwarded_port", guest: 443, host: 443 # for https
  config.vm.network "forwarded_port", guest: 8080, host: 8080 # for nodejs
  config.vm.network "forwarded_port", guest: 8082, host: 8082 # for nodejs
  config.vm.network "forwarded_port", guest: 8000, host: 8000 # for python
  config.vm.network "forwarded_port", guest: 4378, host: 4378 # for turn server
  config.vm.network "forwarded_port", guest: 5766, host: 5766 # for turn server
  
  config.vm.network "forwarded_port", guest: 3478, host: 3478 # for turn server
  config.vm.network "forwarded_port", guest: 5349, host: 5349 # for turn server

  # ssh key forwarding
  config.ssh.forward_agent = true

  # synced folder
  config.vm.synced_folder "./workspace", "/var/www", create: true, owner: "apache", group: "apache", mount_options: ["dmode=775,fmode=664"]
  config.vm.synced_folder "./conf/vhost", "/etc/httpd/conf.d", create: true, owner: "apache", group: "apache", mount_options: ["dmode=775,fmode=664"]

  # common setup
  config.vm.provision :shell, :path => "./provision/setup_cnf.sh", privileged: true, run: "once"

  # phpunit
  config.vm.define "phpunit" do |phpunit|
    # run phpunit setup
    phpunit.vm.provision :shell, :path => "./provision/setup_cnf_phpunit.sh", privileged: true, run: "once"
    phpunit.vm.provision :shell, :path => "./provision/startup_cnf.sh", privileged: true, run: "always"

    # virtual machine information
    phpunit.vm.provider "virtualbox" do |v|
      v.name = "phpunit-machine"
    end
  end

  # nc
  config.vm.define "nc" do |nc|
    # run php unit setup
    nc.vm.provision :shell, :path => "./provision/setup_cnf_nc.sh", privileged: true, run: "once"
    nc.vm.provision :shell, :path => "./provision/startup_cnf.sh", privileged: true, run: "always"

    # virtual machine information
    nc.vm.provider "virtualbox" do |v|
      v.name = "nc-machine"
    end
  end

end