
@echo off

echo Changing directory...
cd ..

echo Archiving...
asar pack ./minwind ./minwind.asar

echo Packaging...
electron-packager ./minwind minwind --platform=win32 --arch=x64 --electronVersion=2.0.0
electron-packager ./minwind minwind --platform=win32 --arch=ia32 --electronVersion=2.0.0

echo Packaging complete.

pause

