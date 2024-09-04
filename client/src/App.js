import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from './admin-dash';
import WorkerDashboard from './worker-dash';
import WorkerRegistration from './WorkerRegistration';
import TaskManagement from './TaskManagement';
import Navbar from './Navbar';
import AdminLogin from './AdminLogin';
import { AuthProvider, useAuth } from './AuthContext';

// Protect routes based on authentication
const ProtectedRoute = ({ element: Element }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Element /> : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div>
                    <Navbar />
                    <Routes>
                        {/* Default route */}
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/admin" element={<ProtectedRoute element={AdminDashboard} />} />
                        <Route path="/worker" element={<WorkerDashboard />} />
                        <Route path="/register" element={<WorkerRegistration />} />
                        <Route path="/tasks" element={<TaskManagement />} />
                        <Route path="/login" element={<AdminLogin />} />
                        {/* Add more routes as needed */}
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
