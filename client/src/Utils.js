import Web3 from "web3";

const TASK_ALLOCATION_ADDRESS = "Your_Deployed_Contract_Address"; // Replace with your deployed contract address

export const getTaskAllocationContract = async () => {
    // Create a web3 instance and connect to MetaMask
    const web3 = new Web3(window.ethereum);

    // Request account access if needed (only if not already granted)
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Fetch the ABI from the public folder
    const response = await fetch('/TaskAllocation.json');
    const TaskAllocationAbi = await response.json();

    // Get the user's account (you might want to handle this asynchronously)
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0]; // Assuming the user has at least one account connected

    // Create a contract instance
    const taskAllocationContract = new web3.eth.Contract(
        TaskAllocationAbi,       // ABI from the JSON file
        TASK_ALLOCATION_ADDRESS,  // Address of the deployed contract
        { from: account }         // Default account for transactions
    );

    return taskAllocationContract;
};
