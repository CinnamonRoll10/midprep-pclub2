import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import WorkerDashboard from './WorkerDashboard';
import WorkerRegistration from './WorkerRegistration';
import TaskManagement from './TaskManagement';
import Navbar from './Navbar';

function App() {
    return (
        <Router>
            <div>
                <Navbar />
                <Routes>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/worker" element={<WorkerDashboard />} />
                    <Route path="/register" element={<WorkerRegistration />} />
                    <Route path="/tasks" element={<TaskManagement />} />
                    {/* Add more routes as needed */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
