# Midprep-pclub2
### This guide will walk you through setting up and running your     decentralized application (DApp). The DApp includes:

* React.js for the frontend user interface.
* Node.js backend for handling API requests and interacting with the blockchain.
* Truffle for smart contract development and deployment.
* MetaMask for Ethereum wallet integration.
* Infura to connect to the Ethereum Rinkeby test network.

#### PREREQUISITES

##### 1. Setting Up the Frontend (React.js)
* Clone the Repository

```
git clone <repository-url>
cd <repository-directory>
```
* Navigate to the Client Directory

```
cd client
```
Install Dependencies
```
npm install
```

```
npm install react-router-dom
```
* Configure MetaMask

Ensure MetaMask is installed in your browser.
Switch to the Rinkeby test network in MetaMask.
Connect your MetaMask wallet with some Rinkeby test ETH.
Update Environment Variables

Create a .env file in the root of the client directory.
Add the Infura project URL:

```
REACT_APP_INFURA_URL=https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID
REACT_APP_CONTRACT_ADDRESS=deployed_contract_address_here
```
Replace your_infura_project_id_here and deployed_contract_address_here with your actual Infura Project ID and deployed contract address.
##### 2. Setting Up the Backend (Node.js)
Navigate to the Server Directory

```
cd ../server
```

Install Dependencies

```
npm install
```
* Configure Infura and Web3
```
npm install web3
```

```
npm install axios
```

Ensure web3 is configured with the Infura URL. Update server.js:
javascript

```
const Web3 = require('web3');
const web3 = new Web3('https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID');
```
Start the Server
```
node server.js
```
The server should now be running on http://localhost:3002.
3. Setting Up Truffle
Install Truffle Globally

```
npm install -g truffle
```
Navigate to the Truffle Project Directory

```
cd <truffle-project-directory>
```
Install Project Dependencies
```
npm install
```
Update Truffle Configuration

Ensure your truffle-config.js is correctly configured for Rinkeby:
javascript
```
const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraKey = "YOUR_INFURA_PROJECT_ID";
const mnemonic = "YOUR_METAMASK_MNEMONIC";

module.exports = {
  networks: {
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
      network_id: 4,
      gas: 5500000,
      gasPrice: 10000000000,
    }
  },
  compilers: {
    solc: {
      version: "0.8.19",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};
```
* Migrate Contracts

```truffle migrate --network rinkeby```

