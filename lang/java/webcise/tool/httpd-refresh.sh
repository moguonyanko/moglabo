#!/bin/sh

#copy Apache conf file (for MacOSX) 
sudo cp -f ~/src/moglabo/lang/java/webcise/conf/httpd/*.conf /etc/apache2/other/

#config refrection
sudo apachectl restart
