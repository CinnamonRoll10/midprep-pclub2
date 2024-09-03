import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav>
            <ul>
                <li><Link to="/admin">Admin Dashboard</Link></li>
                <li><Link to="/worker">Worker Dashboard</Link></li>
                <li><Link to="/register">Worker Registration</Link></li>
                <li><Link to="/tasks">Manage Tasks</Link></li>
                {/* Add more navigation links as needed */}
            </ul>
        </nav>
    );
}

export default Navbar;
