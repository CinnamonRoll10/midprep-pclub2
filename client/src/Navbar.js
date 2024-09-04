import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './navbar.css';

function Navbar() {
    const { isAuthenticated, logout } = useAuth();

    return (
        <nav className="navbar">
            <ul>
                {isAuthenticated && <li><Link to="/admin">Admin Dashboard</Link></li>}
                <li><Link to="/worker">Worker Dashboard</Link></li>
                <li><Link to="/register">Worker Registration</Link></li>
                <li><Link to="/tasks">Manage Tasks</Link></li>
                {isAuthenticated ? (
                    <li><button onClick={logout}>Logout</button></li>
                ) : (
                    <li><Link to="/login">Admin Login</Link></li>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
