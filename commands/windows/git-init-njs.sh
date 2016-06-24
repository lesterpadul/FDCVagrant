@ECHO OFF

clear
ECHO ADDING NODEJS LESSON
cd "$(dirname "${BASH_SOURCE[0]}")/../../workspace"
pwd

# create directory
rm -rf NativeCamp-NJSv2
mkdir NativeCamp-NJSv2
cd NativeCamp-NJSv2

# initialize git
git init
git remote add origin "https://github.com/VJSOL/Nativecamp-NodeJSv2.git"
git fetch origin master
git reset --hard FETCH_HEAD

ECHO ADDING NODEJS BROADCAST
cd "$(dirname "${BASH_SOURCE[0]}")/../../workspace"
pwd

# create directory
rm -rf NativeCamp-NJSBroadcast
mkdir NativeCamp-NJSBroadcast
cd NativeCamp-NJSBroadcast

# initialize git
git init
git remote add origin "https://github.com/VJSOL/Nativecamp-NodeJSBroadcast.git"
git fetch origin master
git reset --hard FETCH_HEAD