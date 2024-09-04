// src/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [onChainCosts, setOnChainCosts] = useState(null);
    const [transactionStats, setTransactionStats] = useState(null);
    const [taskStats, setTaskStats] = useState(null); // State for task stats

    useEffect(() => {
        const fetchData = async () => {
            try {
                const costsResponse = await axios.get('/onchain-costs');
                setOnChainCosts(costsResponse.data);

                const statsResponse = await axios.get('/transaction-stats');
                setTransactionStats(statsResponse.data);

                const taskStatsResponse = await axios.get('/task-stats'); // Fetch task stats
                setTaskStats(taskStatsResponse.data);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Admin Dashboard</h1>

            <section>
                <h2>On-Chain Costs Overview</h2>
                {onChainCosts ? (
                    <div>
                        <p>Total Gas Used: {onChainCosts.totalGasUsed}</p>
                        <p>Total Ether Spent: {onChainCosts.totalEtherSpent} ETH</p>
                    </div>
                ) : (
                    <p>Loading on-chain costs...</p>
                )}
            </section>

            <section>
                <h2>Transaction Statistics</h2>
                {transactionStats ? (
                    <div>
                        <p>Total Transactions: {transactionStats.transactionCount}</p>
                        <ul>
                            {transactionStats.gasPrices.map((tx) => (
                                <li key={tx.transactionHash}>
                                    Transaction Hash: {tx.transactionHash} - Gas Price: {tx.gasPrice} Gwei
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>Loading transaction statistics...</p>
                )}
            </section>

            <section>
                <h2>Task Statistics</h2>
                {taskStats ? (
                    <div>
                        <p>Total Tasks: {taskStats.totalTasks}</p>
                        <p>Pending Tasks: {taskStats.tasksByStatus.pending}</p>
                        <p>Completed Tasks: {taskStats.tasksByStatus.completed}</p>
                        <p>In Progress Tasks: {taskStats.tasksByStatus.inProgress}</p>
                    </div>
                ) : (
                    <p>Loading task statistics...</p>
                )}
            </section>
        </div>
    );
};

export default AdminDashboard;
