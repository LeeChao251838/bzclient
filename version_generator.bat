@echo off
set APP_DIR=%~dp0
::set APP_ROOT=%APP_DIR%..\
set APP_VERSION="1.0.8"
node "%APP_DIR%/version_generator.js" -v "%APP_VERSION%" -u http://tdhdown.hy51v.com/remote-assets-newlbszmj/ -s "%APP_DIR%/build1/jsb-binary/" -d "%APP_DIR%/assets/"



pause