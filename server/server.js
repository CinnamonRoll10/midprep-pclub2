// server/server.js
const express = require('express');
const Web3 = require('web3');
const path = require('path');
const fs = require('fs');

// Initialize Express.js
const app = express();
app.use(express.json());

// Connect to local Ethereum node
const web3 = new Web3('http://127.0.0.1:7545'); // Or the URL of your Ethereum node

// Load Truffle artifacts
const contractPath = path.join(__dirname, '../build/contracts/TaskAllocation.json');
const { abi, networks } = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

// Get the deployed contract address (replace with your actual address if needed)
const networkId = '5777'; // Replace with your network ID if not using Ganache
const contractAddress = networks[networkId].address;
const taskAllocation = new web3.eth.Contract(abi, contractAddress);

// Define API routes

// All Workers API
app.get('/workers', async (req, res) => {
    try {
        const workerCount = await taskAllocationContract.methods.totalWorkers().call();
        let workers = [];

        for (let i = 0; i < workerCount; i++) {
            const workerDetails = await taskAllocationContract.methods.getWorkerDetails(i).call();
            workers.push({
                workerId: i,
                ...workerDetails
            });
        }

        res.json(workers);
    } catch (error) {
        console.error('Error fetching workers:', error);
        res.status(500).send('Internal Server Error');
    }
});

// All Tasks API
app.get('/tasks', async (req, res) => {
    try {
        const taskCount = await taskAllocationContract.methods.totalTasks().call();
        let tasks = [];

        for (let i = 0; i < taskCount; i++) {
            const taskDetails = await taskAllocationContract.methods.getTaskDetails(i).call();
            tasks.push({
                taskId: i,
                ...taskDetails
            });
        }

        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).send('Internal Server Error');
    }
});

// On-Chain Costs Overview API
app.get('/onchain-costs', async (req, res) => {
    try {
        const pastEvents = await taskAllocationContract.getPastEvents('allEvents', {
            fromBlock: 0,
            toBlock: 'latest'
        });

        let totalGasUsed = 0;
        let totalEtherSpent = 0;

        for (const event of pastEvents) {
            const transaction = await web3.eth.getTransactionReceipt(event.transactionHash);
            totalGasUsed += transaction.gasUsed;
            const gasPrice = await web3.eth.getGasPrice(); // Alternatively, use transaction.gasPrice if available
            totalEtherSpent += transaction.gasUsed * gasPrice;
        }

        const onchainCosts = {
            totalGasUsed,
            totalEtherSpent: web3.utils.fromWei(totalEtherSpent.toString(), 'ether')
        };

        res.json(onchainCosts);
    } catch (error) {
        console.error('Error fetching on-chain costs:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Transaction Statistics API
app.get('/transaction-stats', async (req, res) => {
    try {
        const pastEvents = await taskAllocationContract.getPastEvents('allEvents', {
            fromBlock: 0,
            toBlock: 'latest'
        });

        const transactionCount = pastEvents.length;
        const gasPrices = [];

        for (const event of pastEvents) {
            const transaction = await web3.eth.getTransaction(event.transactionHash);
            gasPrices.push({
                transactionHash: event.transactionHash,
                gasPrice: web3.utils.fromWei(transaction.gasPrice, 'gwei') // Convert gas price from Wei to Gwei
            });
        }

        const transactionStats = {
            transactionCount,
            gasPrices
        };

        res.json(transactionStats);
    } catch (error) {
        console.error('Error fetching transaction statistics:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Task Stats API
app.get('/task-stats', async (req, res) => {
    try {
        const taskCount = await taskAllocationContract.methods.totalTasks().call();
        let tasksByStatus = { pending: 0, completed: 0, inProgress: 0 };

        for (let i = 0; i < taskCount; i++) {
            const taskDetails = await taskAllocationContract.methods.getTaskDetails(i).call();
            tasksByStatus[taskDetails.status]++;
        }

        const taskStats = {
            totalTasks: taskCount,
            tasksByStatus,
        };

        res.json(taskStats);
    } catch (error) {
        console.error('Error fetching task stats:', error);
        res.status(500).send('Internal Server Error');
    }
});
// 3. Worker-Specific APIs (Worker UI)
// Specific Worker Tasks API
// Updated Task API
app.get('/worker/tasks', async (req, res) => {
    const { workerId } = req.query; // Retrieve workerId from query parameters

    try {
        const taskIds = await taskAllocationContract.methods.getWorkerTasks(workerId).call();
        let tasks = [];

        for (const taskId of taskIds) {
            const taskDetails = await taskAllocationContract.methods.getTaskDetails(taskId).call();
            tasks.push({
                taskId,
                ...taskDetails
            });
        }

        res.json(tasks);
    } catch (error) {
        console.error(`Error fetching tasks for worker ${workerId}:`, error);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/tasks', async (req, res) => {
    try {
        const tasks = await taskAllocation.methods.getAllTasks().call();
        res.json(tasks);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/registerWorker', async (req, res) => {
    const { availableHours, expertiseLevel, minHourlyWage } = req.body;
    try {
        const accounts = await web3.eth.getAccounts();
        await taskAllocation.methods.registerWorker(availableHours, expertiseLevel, minHourlyWage)
            .send({ from: accounts[0] });
        res.status(200).send('Worker registered successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/*
// Fetch worker's payment info (example logic, needs to be adjusted based on your contract)
app.get('/worker-payments', async (req, res) => {
    const { workerId } = req.query; // Assuming worker ID is passed as query parameter
    try {
        // Example logic to fetch payments for a specific worker
        // Modify this based on your smart contract functions
        const payments = await taskAllocation.methods.getWorkerPayments(workerId).call();
        res.json(payments);
    } catch (error) {
        res.status(500).send(error.message);
    }
});*/
/*
// Fetch worker's registration status (example logic, needs to be adjusted based on your contract)
app.get('/worker-status', async (req, res) => {
    const { workerId } = req.query; // Assuming worker ID is passed as query parameter
    try {
        // Example logic to fetch a worker's registration status
        // Modify this based on your smart contract functions
        const status = await taskAllocation.methods.getWorkerStatus(workerId).call();
        res.json(status);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
*/
app.post('/addTask', async (req, res) => {
    const { time, expertise, dependencies, wage, deadline, divisible } = req.body;
    try {
        const accounts = await web3.eth.getAccounts();
        await taskAllocation.methods.addTask(time, expertise, dependencies, wage, deadline, divisible)
            .send({ from: accounts[0] });
        res.status(200).send('Task added successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// 2. addWorker API
app.post('/addWorker', async (req, res) => {
    const { hours, expertise, min_wage, wallet } = req.body;
    try {
        const accounts = await web3.eth.getAccounts();
        await taskAllocation.methods.registerWorker(hours, expertise, min_wage)
            .send({ from: accounts[0] });
        res.status(200).send('Worker registered successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// 4. checkWallet API
app.get('/checkWallet', async (req, res) => {
    const { worker_id } = req.query;
    try {
        // Fetch the worker's wallet address (this assumes you have a method to get worker details)
        const worker = await taskAllocation.methods.getWorkerDetails(worker_id).call();
        const walletAddress = worker.wallet;

        // Fetch the balance of the worker's wallet
        const balance = await web3.eth.getBalance(walletAddress);
        res.json({ wallet: walletAddress, balance: web3.utils.fromWei(balance, 'ether') });
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// Other API endpoints...

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
