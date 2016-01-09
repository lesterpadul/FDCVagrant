@ECHO OFF

ECHO INITIATING VAGRANT UP WITH PROVISION

CD ../../

vagrant halt && vagrant up phpunit --provision

CD commands/windows

sh vagrant-ssh-phpunit.sh

PAUSE