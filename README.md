# download cna content definitions and instances:
    create gitana.json
    create folder ./data
    npx cloudcms-util export -g ./gitana/gitana-cna.json -q cna:showcase cna:news cna:alert  -i -r --folder-path ./data

# upload to local docker:
    create gitana.json from local docker
    create folder ./data
    npx cloudcms-util import -g ./gitana/gitana.json -q cna:showcase cna:news cna:alert  -i -r --folder-path ./data
    there is a bug in the import that does not handle related nodes propertly. until it is fixed, copy ./data/related to ./data/nodes and run:
    npx cloudcms-util import -g ./gitana/gitana-local.json -n --folder-path ./data -v

# register custom module
