@ECHO OFF

ECHO SYNCHORNIZING GIT
echo.

cd ../../

git remote rm origin

git remote add origin https://github.com/lesterpadul/FDCVagrant.git

git fetch origin master

git reset --hard FETCH_HEAD

echo.
echo SYNCHORNIZING FINISHED

echo.
pause