// src/WorkerDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const WorkerDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const workerId = queryParams.get('workerId'); // Extract workerId from query parameters

    useEffect(() => {
        const fetchTasks = async () => {
            if (!workerId) {
                setError('Worker ID is missing');
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`/worker/${workerId}/tasks`);
                setTasks(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setError('Failed to fetch tasks');
                setLoading(false);
            }
        };

        fetchTasks();
    }, [workerId]);

    return (
        <div>
            <h1>Worker Dashboard</h1>
            {loading ? (
                <p>Loading tasks...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div>
                    <h2>Tasks Assigned</h2>
                    {tasks.length > 0 ? (
                        <ul>
                            {tasks.map(task => (
                                <li key={task.taskId}>
                                    <p>Task ID: {task.taskId}</p>
                                    <p>Status: {task.status}</p>
                                    <p>Description: {task.description}</p>
                                    <p>Hourly Wage: {task.hourlyWage} ETH</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No tasks assigned.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default WorkerDashboard;
