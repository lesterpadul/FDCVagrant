Vagrant.configure("2") do |config|   
    # ssh
    config.ssh.forward_agent = true
    config.ssh.username = "vagrant"
    config.ssh.password = "vagrant"
    config.ssh.insert_key = false
    config.vm.network "private_network", ip: "192.168.33.11"

    # disable update
    config.vm.box_check_update = false

    # run newnc setup
    config.vm.synced_folder "./workspace", "/var/www"
    config.vm.synced_folder "./conf/vhost/", "/etc/httpd/conf.d/"
    
    # php7
    config.vm.define "nc7" do |nc7|
        # box info
        nc7.vm.box = "nc7.box"
        nc7.vm.box_url = "nc7vbox.box"

        # provision
        nc7.vm.provision :shell, :path => "./provision/startup_cnf.sh", privileged: true, run: "always"
        nc7.vm.provision :shell, :path => "./provision/startup_cnf_nodecheck.sh",privileged: false,  run: "always"
        nc7.vm.provision :shell, :path => "./provision/startup_cnf_node.sh",privileged: false,  run: "always"
        
        # virtual machine information
        nc7.vm.provider "virtualbox" do |v|
            v.name = "nc7-machine"
            v.memory = 2048
            v.cpus = 2
        end
    end
end
