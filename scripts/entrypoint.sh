#!/bin/sh

ROOT_DIR=/usr/share/nginx/html
echo "Applying env constants to production JS."
for file in $ROOT_DIR/assets/*.*.js $ROOT_DIR/index.html
do
  echo "Processing $file ...";

  sed -i 's|API_HOST_NAME|'${API_HOST_NAME}'|g' $file
done

nginx -g 'daemon off;'