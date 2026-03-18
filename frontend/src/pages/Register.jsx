import React, { useState } from 'react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import api from '../services/api';


const Register = ({ onRegister, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('users/register/', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });
            // Auto login or redirect to login
            onSwitchToLogin();
            alert('Registration successful! Please login.');
        } catch (err) {
            const errorData = err.response?.data;
            let errorMessage = 'Registration failed. Please try again.';
            if (errorData) {
                errorMessage = Object.values(errorData).flat().join(' ');
            }
            setError(errorMessage);
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
                <Card title="Create Account" subtitle="Join SmartBudget and start your financial journey">
                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && <div className="auth-error-message">{error}</div>}
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="Jane Doe"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="jane@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>


                    <p className="auth-footer">
                        Already have an account? <span className="link" onClick={onSwitchToLogin}>Sign In</span>
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default Register;
