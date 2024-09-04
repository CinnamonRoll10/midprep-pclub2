import React, { useState } from 'react';
import { getTaskAllocationContract } from './utils'; // Adjust path as needed

function TaskAllocation() {
    const [taskId, setTaskId] = useState('');
    const [workerId, setWorkerId] = useState('');

    const allocateTask = async () => {
        const contract = await getTaskAllocationContract();
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const tx = await contract.methods.allocateTask(taskId, workerId).send({ from: accounts[0] });
            await tx.wait();
            alert('Task allocated successfully!');
        } catch (error) {
            console.error("Error allocating task:", error);
        }
    };

    return (
        <div>
            <h2>Allocate Task</h2>
            <input
                type="number"
                placeholder="Task ID"
                value={taskId}
                onChange={(e) => setTaskId(e.target.value)}
            />
            <input
                type="number"
                placeholder="Worker ID"
                value={workerId}
                onChange={(e) => setWorkerId(e.target.value)}
            />
            <button onClick={allocateTask}>Allocate Task</button>
        </div>
    );
}

export default TaskAllocation;
