import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';

function AdminDashboard() {
    const [taskData, setTaskData] = useState({});
    const [workerData, setWorkerData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const taskResponse = await axios.get('http://localhost:3000/task-stats');
                const workerResponse = await axios.get('http://localhost:3000/worker-stats');
                
                setTaskData(taskResponse.data);
                setWorkerData(workerResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <div>
                <h2>Task Overview</h2>
                <Bar data={taskData} />
            </div>
            <div>
                <h2>Worker Overview</h2>
                <Line data={workerData} />
            </div>
        </div>
    );
}

export default AdminDashboard;
