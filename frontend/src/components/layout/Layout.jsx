import React from 'react';
import './Layout.css';
import Sidebar from './Sidebar';

const Layout = ({ children, currentPage, setCurrentPage, user, theme, toggleTheme }) => {
    const displayName = user?.first_name ? `${user.first_name} ${user.last_name || ''}` : (user?.username || 'User');
    const initials = user?.first_name ? `${user.first_name[0]}${user.last_name ? user.last_name[0] : ''}` : (user?.username || '?').substring(0, 2).toUpperCase();

    return (
        <div className="layout-container">
            <Sidebar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                theme={theme}
                toggleTheme={toggleTheme}
            />

            <div className="main-content">
                <header className="main-header">
                    <div className="search-bar">
                        <input type="text" placeholder="Search for transactions..." />
                    </div>
                    <div
                        className="user-profile-header"
                        onClick={() => setCurrentPage('Profile')}
                        style={{ cursor: 'pointer' }}
                    >
                        <span className="user-name">{displayName}</span>
                        <div className="avatar">{initials}</div>
                    </div>
                </header>
                <main className="page-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
