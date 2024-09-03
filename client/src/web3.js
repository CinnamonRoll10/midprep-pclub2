// src/web3.js
import Web3 from 'web3';

// Check if MetaMask is installed
let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
  try {
    // Request account access if needed
    window.ethereum.enable();
  } catch (error) {
    console.error("User denied account access");
  }
} else if (window.web3) { // Legacy dapp browsers
  web3 = new Web3(window.web3.currentProvider);
} else {
  // Fallback to Ganache
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
}

export default web3;
