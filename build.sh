#!/bin/bash

rm -rf dist && mkdir dist
npx babel  ./ --out-dir dist --ignore node_modules
cp package.json dist
cp -R server/resources dist/server/resources
# cp -R node_modules dist/node_modules
cd dist && npm install 
