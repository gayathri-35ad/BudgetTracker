import './Sidebar.css';
import {
    LayoutDashboard,
    Receipt,
    Wallet,
    Calendar,
    Target,
    Tv,
    BarChart3,
    User,
    Moon,
    Sun
} from 'lucide-react';

const Sidebar = ({ currentPage, setCurrentPage, theme, toggleTheme }) => {
    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Expenses', icon: <Receipt size={20} /> },
        { name: 'Income', icon: <Wallet size={20} /> },
        { name: 'Budget Management', icon: <Calendar size={20} /> },
        { name: 'Savings Goals', icon: <Target size={20} /> },
        { name: 'Subscriptions', icon: <Tv size={20} /> },
        { name: 'Reports', icon: <BarChart3 size={20} /> },
        { name: 'Profile', icon: <User size={20} /> },
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
                    {theme === 'light' ? (
                        <>
                            <Moon size={16} />
                            <span>Dark Mode</span>
                        </>
                    ) : (
                        <>
                            <Sun size={16} />
                            <span>Light Mode</span>
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
