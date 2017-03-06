#!/bin/bash

rm -rf ./src/ngrx-registry

tsc --project tsconfig.lib.json 2> /dev/null

if [ $? -eq 0 ]
then
  echo "Compilation OK, publishing"
  cp README.md ./src/ngrx-registry
  cp lib/package.json ./src/ngrx-registry
  NPM_USER=$(npm whoami 2> /dev/null)
  if [ "${NPM_USER}" != "pavlovich" ]; then
    echo "You must be logged in as 'pavlovich' to publish. Use 'npm login'."
    exit
  fi

  set -ex

  npm publish --access public ./src/ngrx-registry

else
  echo "Compilation failed" >&2
fi
