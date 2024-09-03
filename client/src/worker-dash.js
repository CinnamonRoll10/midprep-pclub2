import Web3 from 'web3';
import { useEffect, useState } from 'react';

const web3 = new Web3(window.ethereum);

function WorkerDashboard() {
    const [tasks, setTasks] = useState([]);
    const [payments, setPayments] = useState([]);
    const [status, setStatus] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Replace with actual contract calls
                const taskResponse = await fetch('/tasks');
                const paymentResponse = await web3.eth.call({/* Contract call to get payments */});
                const statusResponse = await web3.eth.call({/* Contract call to get registration status */});
                
                setTasks(taskResponse);
                setPayments(paymentResponse);
                setStatus(statusResponse);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Worker Dashboard</h1>
            <div>
                <h2>Assigned Tasks</h2>
                <ul>
                    {tasks.map(task => (
                        <li key={task.id}>{task.name} - Deadline: {new Date(task.deadline * 1000).toLocaleDateString()}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Payment Information</h2>
                <ul>
                    {payments.map(payment => (
                        <li key={payment.id}>Task ID: {payment.taskId}, Amount: {payment.amount}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Registration Status</h2>
                <p>Available Hours: {status.availableHours}</p>
                <p>Status: {status.isRegistered ? 'Registered' : 'Not Registered'}</p>
            </div>
        </div>
    );
}

export default WorkerDashboard;
