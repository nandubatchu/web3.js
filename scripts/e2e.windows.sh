#!/usr/bin/env bash

# This script installs Web3 from virtual registry in a Windows 10 / Node 12 env
# and runs some simple Web3 calls

# Exit immediately on error
set -o errexit

# Virtual publish
./scripts/e2e.npm.publish.sh

mkdir windows_test
cp scripts/js/basic_usage.js windows_test/basic_usage.js

cd windows_test
npm init --yes
npm install web3@e2e --save --registry http://localhost:4873

node ./basic_usage.js

echo "Completed basic_usage.js"

exit 0
