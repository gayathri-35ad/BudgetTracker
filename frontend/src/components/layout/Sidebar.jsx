import React from 'react';
import './Sidebar.css';

const Sidebar = ({ currentPage, setCurrentPage, theme, toggleTheme }) => {
    const menuItems = [
        { name: 'Dashboard', icon: '📊' },
        { name: 'Expenses', icon: '💸' },
        { name: 'Income', icon: '💰' },
        { name: 'Budget Management', icon: '📅' },
        { name: 'Savings Goals', icon: '🚀' },
        { name: 'Subscriptions', icon: '📺' },
        { name: 'Reports', icon: '📈' },
        { name: 'Profile', icon: '👤' },
    ];

    return (
        <aside className="sidebar">
            <div className="logo">
                <span className="logo-icon">💎</span>
                <span className="sidebar-title">SmartBudget</span>
            </div>
            <nav className="sidebar-nav">
                {menuItems.map(item => (
                    <div
                        key={item.name}
                        className={`nav-item ${currentPage === item.name ? 'active' : ''}`}
                        onClick={() => setCurrentPage(item.name)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-text">{item.name}</span>
                    </div>
                ))}
            </nav>
            <div className="sidebar-footer">
                <button className="theme-toggle" onClick={toggleTheme}>
                    <span>{theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
