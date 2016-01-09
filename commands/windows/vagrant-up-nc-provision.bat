@ECHO OFF

ECHO INITIATING VAGRANT UP WITH PROVISION

CD ../../

vagrant halt && vagrant up nc --provision

CD commands/windows

sh vagrant-ssh-nc.sh

PAUSE