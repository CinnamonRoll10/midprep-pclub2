import React, { useState } from 'react';
import { getTaskAllocationContract } from './TaskAllocation';

function WorkerRegistration() {
    const [availableHours, setAvailableHours] = useState('');
    const [expertiseLevel, setExpertiseLevel] = useState('');
    const [minHourlyWage, setMinHourlyWage] = useState('');

    const registerWorker = async () => {
        const contract = getTaskAllocationContract();
        try {
            // Get the accounts from web3
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            const account = accounts[0];

            // Send the transaction using the contract instance
            const tx = await contract.methods.registerWorker(
                availableHours,
                expertiseLevel,
                minHourlyWage
            ).send({ from: account });

            // Transaction is confirmed
            alert('Worker registered successfully!');
        } catch (error) {
            console.error("Error registering worker:", error);
        }
    };

    return (
        <div>
            <h2>Worker Registration</h2>
            <input
                type="number"
                placeholder="Available Hours"
                value={availableHours}
                onChange={(e) => setAvailableHours(e.target.value)}
            />
            <input
                type="number"
                placeholder="Expertise Level"
                value={expertiseLevel}
                onChange={(e) => setExpertiseLevel(e.target.value)}
            />
            <input
                type="number"
                placeholder="Min Hourly Wage"
                value={minHourlyWage}
                onChange={(e) => setMinHourlyWage(e.target.value)}
            />
            <button onClick={registerWorker}>Register Worker</button>
        </div>
    );
}

export default WorkerRegistration;
