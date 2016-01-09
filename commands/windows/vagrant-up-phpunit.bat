@ECHO OFF

ECHO INITIATING VAGRANT UP

CD ../../

vagrant halt && vagrant up phpunit

CD commands/windows

sh vagrant-ssh-phpunit.sh

PAUSE