@ECHO OFF

clear

# pragma: update nativecamp signaling server
echo UPDATING NATIVECAMP SIGNALING
cd "$(dirname "${BASH_SOURCE[0]}")/../../workspace"
pwd

# move to directory
cd NativeCamp-NJSv2

# initialize git
git fetch origin master
git reset --hard FETCH_HEAD

# pragma: update nodejs broadcast server
echo UPDATING NODEJS BROADCAST
cd "$(dirname "${BASH_SOURCE[0]}")/../../workspace"
pwd

# move to directory
cd NativeCamp-NJSBroadcast

# initialize git
git fetch origin master
git reset --hard FETCH_HEAD

echo "NODEJS SERVERS UPDATED!!";
echo
echo