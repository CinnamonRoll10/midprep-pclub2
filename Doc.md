### Comprehensive Documentation for API Endpoints and Usage in React Components

This document explains the API endpoints provided by your Node.js backend and details how these endpoints are used in the React.js frontend components, specifically focusing on `AdminDashboard.js` and `WorkerDashboard.js`.

---

## **Backend API Endpoints**

### **1. All Workers API**

**Endpoint:** `GET /workers`

**Description:** 
Fetches a list of all registered workers from the smart contract.

**Code:**
```javascript
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
```

**Explanation:**
- Retrieves the total number of workers.
- Iterates through each worker, fetching details using the `getWorkerDetails` method from the smart contract.
- Responds with a JSON array containing worker information.


**Method:** POST
**URL:** /registerWorker
**Description:** Registers a new worker with specified attributes.
**Request Body:**

**json**
```
{
  "availableHours": "number of available hours per week",
  "expertiseLevel": "expertise level of the worker",
  "minHourlyWage": "minimum hourly wage in Wei"
}
```
Response:
Success: 200 OK with message Worker registered successfully
Error: 500 Internal Server Error with error message

### **2. All Tasks API**

**Endpoint:** `GET /tasks`

**Description:** 
Fetches a list of all tasks from the smart contract.

**Code:**
```javascript
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
```

**Explanation:**
- Retrieves the total number of tasks.
- Iterates through each task, fetching details using the `getTaskDetails` method from the smart contract.
- Responds with a JSON array containing task information.

Success: 200 OK with an array of task objects:
**json**
```
[
  {
    "taskId": "ID of the task",
    "time": "required time for the task in hours",
    "expertise": "expertise level required for the task",
    "dependencies": "list of task IDs that this task depends on",
    "wage": "hourly wage for the task in Wei",
    "deadline": "deadline for the task in Unix timestamp",
    "divisible": "boolean indicating if the task can be divided",
    "status": "current status of the task"
  }
]
```
Error: 500 Internal Server Error with error message

### **3. On-Chain Costs Overview API**

**Endpoint:** `GET /onchain-costs`

**Description:** 
Calculates and returns the total gas used and Ether spent on transactions.

**Code:**
```javascript
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
            const gasPrice = await web3.eth.getGasPrice();
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
```

**Explanation:**
- Fetches all past events from the smart contract.
- Calculates the total gas used and Ether spent by iterating through each transaction receipt.
- Responds with a JSON object containing the total gas used and Ether spent.

**json**
```
{
  "totalGasUsed": "total gas used",
  "totalEtherSpent": "total ether spent in Ether"
}
```

Error: 500 Internal Server Error with error message
### **4. Transaction Statistics API**

**Endpoint:** `GET /transaction-stats`

**Description:** 
Fetches statistics about transactions, including the total number of transactions and gas prices.

**Code:**
```javascript
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
                gasPrice: web3.utils.fromWei(transaction.gasPrice, 'gwei')
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
```

**Explanation:**
- Fetches all past events to get transaction details.
- Calculates the total number of transactions and collects gas prices.
- Responds with a JSON object containing transaction count and gas prices.

**json**
```
{
  "transactionCount": "total number of transactions",
  "gasPrices": [
    {
      "transactionHash": "transaction hash",
      "gasPrice": "gas price in Gwei"
    }
  ]
}
```

### **5. Task Stats API**

**Endpoint:** `GET /task-stats`

**Description:** 
Fetches statistics about tasks, including the number of tasks by status.

**Code:**
```javascript
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
```


**Explanation:**
- Retrieves the total number of tasks.
- Counts the number of tasks by their status (pending, completed, in progress).
- Responds with a JSON object containing the total number of tasks and the breakdown by status.

**json**
```
{
  "totalTasks": "total number of tasks",
  "tasksByStatus": {
    "pending": "number of pending tasks",
    "completed": "number of completed tasks",
    "inProgress": "number of tasks in progress"
  }
}
```


### **6. Worker-Specific APIs**

**Endpoint:** `GET /worker/tasks`

**Description:** 
Fetches tasks assigned to a specific worker.

**Code:**
```javascript
app.get('/worker/tasks', async (req, res) => {
    const { workerId } = req.query;

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
```

**Explanation:**
- Retrieves tasks assigned to a worker using their ID.
- Collects details for each task assigned to the worker.
- Responds with a JSON array of tasks.

**json**
```
[
  {
    "taskId": "ID of the task",
    "time": "required time for the task in hours",
    "expertise": "expertise level required for the task",
    "dependencies": "list of task IDs that this task depends on",
    "wage": "hourly wage for the task in Wei",
    "deadline": "deadline for the task in Unix timestamp",
    "divisible": "boolean indicating if the task can be divided",
    "status": "current status of the task"
  }
]
```


**7. Add Task API**

**Endpoint:** `POST /addTask`

**Description:** 
Allows the admin to add a new task.

**Code:**
```javascript
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
```

**Explanation:**
- Receives task details from the request body.
- Sends a transaction to the smart contract to add the new task.
- Responds with a success message or an error if something goes wrong.

**json**
```
{
  "time": "required time for the task in hours",
  "expertise": "expertise level required for the task",
  "dependencies": "list of task IDs that this task depends on",
  "wage": "hourly wage for the task in Wei",
  "deadline": "deadline for the task in Unix timestamp",
  "divisible": "boolean indicating if the task can be divided"
}
```

**8. Add Worker API**

**Endpoint:** `POST /addWorker`

**Description:** 
Allows the admin to register a new worker.

**Code:**
```javascript
app.post('/addWorker', async (req, res) => {
    const { hours, expertise, min_wage } = req.body;
    try {
        const accounts = await web3.eth.getAccounts();
        await taskAllocation.methods.registerWorker(hours, expertise, min_wage)
            .send({ from: accounts[0] });
        res.status(200).send('Worker registered successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});
```

**Explanation:**
- Receives worker details from the request body.
- Sends a transaction to the smart contract to register the new worker.
- Responds with a success message or an error if something goes wrong.

```
{
  "hours": "number of available hours per week",
  "expertise": "expertise level of the worker",
  "min_wage": "minimum hourly wage in Wei",
  "wallet": "wallet address of the worker"
}
```


### **9. Check Wallet API**

**Endpoint:** `GET /checkWallet`

**Description:** 
Fetches and returns the balance of a worker's wallet.

**Code:**
```javascript
app.get('/checkWallet', async (req, res) => {
    const { worker_id } = req.query;
    try {
        const worker = await taskAllocationContract.methods.getWorkerDetails(worker_id).call();
        const walletAddress = worker.wallet;
        const balance = await web3.eth.getBalance(walletAddress);
        res.json({ wallet: walletAddress, balance: web3.utils.fromWei(balance, 'ether') });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
```

**Explanation:**
- Retrieves the worker's wallet address from the smart contract using their worker ID.
- Fetches the balance of the wallet.
- Responds with a JSON object containing the wallet address and balance in Ether.

**json**
```
{
  "wallet": "The Ethereum wallet address associated with the worker.",
  "balance": "The balance of the wallet in Ether (ETH)."
}
```

#### **AdminDashboard.js**

**Description:**
The `AdminDashboard` component interacts with the various API endpoints to display data and statistics relevant to the admin.

**Explanation:**
- Uses `axios` to fetch data from the backend APIs on component mount.
- Displays lists of workers and tasks.
- Shows on-chain costs and transaction statistics.

#### **WorkerDashboard.js**

**Description:**
The `WorkerDashboard` component retrieves and displays tasks assigned to a specific worker.

**Explanation:**
- Fetches tasks assigned to a specific worker using their worker ID.
- Renders a list of tasks and wallet details.

### **Common Features**

**Data Handling:**
- Uses `axios` to handle API requests and responses.
- Applies asynchronous operations with `async/await` to manage API calls.

**Styling:**
- Ensure consistent and responsive styling by integrating CSS or a CSS framework.

---
