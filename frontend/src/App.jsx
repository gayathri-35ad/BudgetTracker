import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import Login from './pages/Login';
import Register from './pages/Register';

import SubscriptionsPage from './pages/SubscriptionsPage';
import BudgetsPage from './pages/BudgetsPage';
import SavingsPage from './pages/SavingsPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import IncomePage from './pages/IncomePage';

import api from './services/api';

function App() {

  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'

  React.useEffect(() => {
    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn]);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get('users/profile/');
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user profile', err);
    }
  };

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleLogin = () => setIsLoggedIn(true);
  const handleRegister = () => setIsLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
  };


  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard': return <Dashboard />;
      case 'Expenses': return <AddExpense />;
      case 'Income': return <IncomePage />;
      case 'Budget Management': return <BudgetsPage />;
      case 'Savings Goals': return <SavingsPage />;
      case 'Subscriptions': return <SubscriptionsPage />;
      case 'Reports': return <ReportsPage />;
      case 'Profile': return <ProfilePage onLogout={handleLogout} />;
      default: return <Dashboard />;
    }
  };


  if (!isLoggedIn) {
    if (authView === 'login') {
      return <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthView('register')} />;
    }
    return <Register onRegister={handleRegister} onSwitchToLogin={() => setAuthView('login')} />;
  }

  return (
    <Layout
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      user={user}
      theme={theme}
      toggleTheme={toggleTheme}
    >
      {renderPage()}
    </Layout>
  );
}

export default App;
