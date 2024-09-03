import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './admin-dash';
import WorkerDashboard from './worker-dash';
import WorkerRegistration from './WorkerRegistration';
import TaskManagement from './TaskManagement';
import Navbar from './Navbar';

function App() {
    return (
        <Router>
            <div>
                <Navbar />
                <Routes>
                    <Route path="/admin" component={AdminDashboard} />
                    <Route path="/worker" component={WorkerDashboard} />
                    <Route path="/register" component={WorkerRegistration} />
                    <Route path="/tasks" component={TaskManagement} />
                    {/* Add more routes as needed */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
