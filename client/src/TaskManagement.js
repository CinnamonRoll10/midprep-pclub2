import React, { useState } from 'react';
import { getTaskAllocationContract } from './utils'; // Adjust path as needed
import './TaskManagement.css'; // Import the CSS file

function TaskManagement() {
    const [timeRequired, setTimeRequired] = useState('');
    const [expertiseLevel, setExpertiseLevel] = useState('');
    const [hourlyWage, setHourlyWage] = useState('');
    const [deadline, setDeadline] = useState('');
    const [isDivisible, setIsDivisible] = useState(false);

    const addTask = async () => {
        const contract = getTaskAllocationContract();
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const tx = await contract.methods.addTask(
                timeRequired,
                expertiseLevel,
                hourlyWage,
                deadline,
                isDivisible
            ).send({ from: accounts[0] });
            await tx.wait();
            alert('Task added successfully!');
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    return (
        <div className="task-management-container">
            <h2>Add Task</h2>
            <input
                type="number"
                placeholder="Time Required"
                value={timeRequired}
                onChange={(e) => setTimeRequired(e.target.value)}
            />
            <input
                type="number"
                placeholder="Expertise Level"
                value={expertiseLevel}
                onChange={(e) => setExpertiseLevel(e.target.value)}
            />
            <input
                type="number"
                placeholder="Hourly Wage"
                value={hourlyWage}
                onChange={(e) => setHourlyWage(e.target.value)}
            />
            <input
                type="number"
                placeholder="Deadline (timestamp)"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
            />
            <label>
                Is Divisible
                <input
                    type="checkbox"
                    checked={isDivisible}
                    onChange={(e) => setIsDivisible(e.target.checked)}
                />
            </label>
            <button onClick={addTask}>Add Task</button>
        </div>
    );
}

export default TaskManagement;
