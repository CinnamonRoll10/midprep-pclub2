import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
                <Switch>
                    <Route path="/admin" component={AdminDashboard} />
                    <Route path="/worker" component={WorkerDashboard} />
                    <Route path="/register" component={WorkerRegistration} />
                    <Route path="/tasks" component={TaskManagement} />
                    {/* Add more routes as needed */}
                </Switch>
            </div>
        </Router>
    );
}

export default App;
