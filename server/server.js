// server/server.js
const express = require('express');
const Web3 = require('web3');
const path = require('path');
const fs = require('fs');

// Initialize Express.js
const app = express();
app.use(express.json());

// Connect to local Ethereum node
const web3 = new Web3('http://localhost:8545'); // Or the URL of your Ethereum node

// Load Truffle artifacts
const contractPath = path.join(__dirname, '../build/contracts/TaskAllocation.json');
const { abi, networks } = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

// Get the deployed contract address (replace with your actual address if needed)
const networkId = '5777'; // Replace with your network ID if not using Ganache
const contractAddress = networks[networkId].address;
const taskAllocation = new web3.eth.Contract(abi, contractAddress);

// Define API routes
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

app.get('/worker-tasks', async (req, res) => {
    const { workerId } = req.query; // Assuming worker ID is passed as query parameter
    try {
        // Example logic to fetch tasks for a specific worker
        // Modify this based on your smart contract functions
        const tasks = await taskAllocation.methods.getWorkerTasks(workerId).call();
        res.json(tasks);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

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
});

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

// 3. checkStatus API
app.get('/checkStatus', async (req, res) => {
    try {
        const tasks = await taskAllocation.methods.getAllTasks().call();
        const status = tasks.map(task => ({
            task_id: task.taskId,
            worker_id: task.workerId || null,
            status: task.isCompleted
        }));
        res.json({ tasks: status });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// 4. checkWallet API
app.get('/checkWallet', async (req, res) => {
    const { worker_id } = req.query;
    try {
        // Fetch the worker's wallet address (this assumes you have a method to get worker details)
        const worker = await taskAllocation.methods.getWorker(worker_id).call();
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
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
