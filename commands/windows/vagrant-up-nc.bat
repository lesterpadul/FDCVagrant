@ECHO OFF

ECHO INITIATING VAGRANT UP

CD ../../

vagrant halt && vagrant up nc

CD commands/windows

sh vagrant-ssh-nc.sh

PAUSE