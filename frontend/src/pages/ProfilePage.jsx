import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import './ProfilePage.css';

const ProfilePage = ({ onLogout }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', first_name: '', last_name: '', bio: '' });
    const [stats, setStats] = useState({ totalExpenses: 0, totalIncome: 0, balance: 0 });

    useEffect(() => {
        fetchProfile();
        fetchStats();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await api.get('users/profile/');
            setUser(res.data);
            setFormData({
                username: res.data.username || '',
                email: res.data.email || '',
                first_name: res.data.first_name || '',
                last_name: res.data.last_name || '',
                bio: res.data.bio || ''
            });
        } catch (err) {
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await api.get('analytics/summary/');
            setStats({
                totalExpenses: res.data.total_expenses || 0,
                totalIncome: res.data.total_income || 0,
                balance: res.data.balance || 0,
            });
        } catch (err) {
            // Stats are optional
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const res = await api.put('users/profile/', formData);
            setUser(res.data);
            setEditing(false);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    const displayName = user?.first_name ? `${user.first_name} ${user.last_name || ''}` : (user?.username || user?.email);
    const initials = user?.first_name ? `${user.first_name[0]}${user.last_name ? user.last_name[0] : ''}` : (user?.username || '?').substring(0, 2).toUpperCase();

    if (loading) return <div className="profile-loading">Loading your profile...</div>;

    return (
        <div className="profile-container">
            <div className="profile-hero-card">
                <div className="profile-hero-overlay"></div>
                <div className="profile-hero-content">
                    <div className="profile-master-avatar">{initials}</div>
                    <div className="profile-master-info">
                        <h1>{displayName}</h1>
                        <p className="profile-tagline">Explorer since {new Date(user?.date_joined || Date.now()).toLocaleDateString('default', { month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="profile-hero-actions">
                        {!editing && <Button onClick={() => setEditing(true)}>Edit Profile</Button>}
                        <Button variant="outline" onClick={onLogout} style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>Logout</Button>
                    </div>
                </div>
            </div>

            {error && <div className="profile-alert error">{error}</div>}
            {success && <div className="profile-alert success">{success}</div>}

            <div className="profile-main-grid">
                <div className="profile-column profile-sidebar">
                    <Card title="Financial Snapshot">
                        <div className="mini-stat-item">
                            <span className="mini-label">Monthly Income</span>
                            <span className="mini-value text-success">₹{Number(stats.totalIncome).toLocaleString()}</span>
                        </div>
                        <div className="mini-stat-divider"></div>
                        <div className="mini-stat-item">
                            <span className="mini-label">Monthly Expenses</span>
                            <span className="mini-value text-danger">₹{Number(stats.totalExpenses).toLocaleString()}</span>
                        </div>
                        <div className="mini-stat-divider"></div>
                        <div className="mini-stat-item">
                            <span className="mini-label">Net Balance</span>
                            <span className="mini-value" style={{ color: stats.balance >= 0 ? 'var(--primary)' : 'var(--danger)' }}>₹{Number(stats.balance).toLocaleString()}</span>
                        </div>
                    </Card>

                    <Card title="Settings" className="mt-4" style={{ marginTop: '1.5rem' }}>
                        <div className="settings-link-list">
                            <div className="settings-item active">Personal Information</div>
                            <div className="settings-item">Security & Privacy</div>
                            <div className="settings-item">Notifications</div>
                            <div className="settings-item">Preferences</div>
                        </div>
                    </Card>
                </div>

                <div className="profile-column profile-content">
                    {!editing ? (
                        <Card title="Personal Information">
                            <div className="info-display-grid">
                                <div className="info-block">
                                    <label>First Name</label>
                                    <p>{user?.first_name || 'Not set'}</p>
                                </div>
                                <div className="info-block">
                                    <label>Last Name</label>
                                    <p>{user?.last_name || 'Not set'}</p>
                                </div>
                                <div className="info-block">
                                    <label>Email Address</label>
                                    <p>{user?.email}</p>
                                </div>
                                <div className="info-block">
                                    <label>Username</label>
                                    <p>@{user?.username}</p>
                                </div>
                            </div>
                            <div className="info-bio-section mt-4" style={{ marginTop: '2rem' }}>
                                <label>Biography</label>
                                <p className="bio-text">{user?.bio || 'Tell us about yourself to complete your profile...'}</p>
                            </div>
                        </Card>
                    ) : (
                        <Card title="Edit Personal Information">
                            <form onSubmit={handleUpdate} className="profile-edit-form">
                                <div className="form-row">
                                    <Input
                                        label="First Name"
                                        placeholder="John"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    />
                                    <Input
                                        label="Last Name"
                                        placeholder="Doe"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    />
                                </div>
                                <Input
                                    label="Username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                                <Input
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                <div className="form-group">
                                    <label className="form-label">Biography</label>
                                    <textarea
                                        className="form-input"
                                        rows={4}
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>
                                <div className="profile-form-footer">
                                    <Button type="submit">Save Changes</Button>
                                    <Button variant="outline" type="button" onClick={() => setEditing(false)}>Cancel</Button>
                                </div>
                            </form>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
