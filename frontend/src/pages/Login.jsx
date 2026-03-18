import React, { useState } from 'react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import api from '../services/api';
import { Mail, Lock, Chrome, Apple as AppleIcon } from 'lucide-react';


const Login = ({ onLogin, onSwitchToRegister }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('users/login/', {
                email: formData.email,
                password: formData.password,
            });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            onLogin();
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="auth-container">
            <div className="auth-card-wrapper">
                <div className="auth-logo">
                    <span className="logo-icon">💎</span>
                    <h1>SmartBudget</h1>
                </div>
                <Card title="Welcome Back" subtitle="Enter your credentials to access your account">
                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && <div className="auth-error-message">{error}</div>}
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="jane@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            icon={<Mail size={18} />}
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            icon={<Lock size={18} />}
                        />
                        <div className="auth-options">
                            <label className="checkbox-container">
                                <input type="checkbox" /> Remember me
                            </label>
                            <a href="#" className="forgot-password">Forgot password?</a>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </form>


                    <div className="social-auth">
                        <p className="divider"><span>Or continue with</span></p>
                        <div className="social-grid">
                            <button className="social-btn" type="button">
                                <Chrome size={18} />
                                <span>Google</span>
                            </button>
                            <button className="social-btn" type="button">
                                <AppleIcon size={18} />
                                <span>Apple</span>
                            </button>
                        </div>
                    </div>

                    <p className="auth-footer">
                        Don't have an account? <span className="link" onClick={onSwitchToRegister}>Sign Up</span>
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default Login;
