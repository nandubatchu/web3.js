#!/usr/bin/env node

// This script runs some simple Web3 calls.
// Useful for validating the published version in different OS environments.
const Web3 = require('web3');
const util = require('util');
const log = console.log;

async function delay(secs=0){
  return new Promise(resolve => setTimeout(() => resolve(), secs * 1000))
}

async function main(){
  let web3;
  let block;

  // Providers
  log();
  log('>>>>>>');
  log('HTTP:MAINNET getBlock');
  log('>>>>>>');

  // Http
  web3 = new Web3('https://mainnet.infura.io/v3/1d13168ffb894ad2827f2152620bd27c');
  block = await web3.eth.getBlock('latest');
  log(util.inspect(block));

  log();
  log('>>>>>>');
  log('WS:MAINNET getBlock');
  log('>>>>>>');

  // WebSockets
  // Infura connection is super flaky and drops connections a lot.
  // We try 10 times...
  web3 = new Web3('wss://mainnet.infura.io/ws/v3/1d13168ffb894ad2827f2152620bd27c');

  let i = 0;
  while(true){
    await delay(1);
    try {
      block = await web3.eth.getBlock('latest');
      log(util.inspect(block));
      break;
    } catch(err){
      i++;
      if (i === 10){
        web3.currentProvider.disconnect();
        throw new Error('Failed to connect to Infura over websockets after 10 tries');
      }
    }
  }
  web3.currentProvider.disconnect();

  // Accounts
  web3 = new Web3();

  log();
  log('>>>>>>');
  log('eth.accounts.createAccount');
  log('>>>>>>');

  const account = web3.eth.accounts.create();
  log(util.inspect(account));

  log();
  log('>>>>>>');
  log('eth.accounts.hashMessage');
  log('>>>>>>');

  const hash = web3.eth.accounts.hashMessage('Hello World');
  log(util.inspect(hash));
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    log(err);
    process.exit(1)
  });