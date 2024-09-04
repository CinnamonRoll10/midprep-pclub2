import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css'; // Import the CSS file

function Navbar() {
    const [showLogin, setShowLogin] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (username === 'admin' && password === 'admin') {
            // Redirect to Admin Dashboard if credentials are correct
            window.location.href = '/admin';
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/admin">Admin Dashboard</Link></li>
                <li><Link to="/worker">Worker Dashboard</Link></li>
                <li><Link to="/register">Worker Registration</Link></li>
                <li><Link to="/tasks">Manage Tasks</Link></li>
                <li><button onClick={() => setShowLogin(!showLogin)}>
                    {showLogin ? 'Close Login' : 'Admin Login'}
                </button></li>
            </ul>
            {showLogin && (
                <div className="login-form">
                    <h2>Admin Login</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin}>Login</button>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
