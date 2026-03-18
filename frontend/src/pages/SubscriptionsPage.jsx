import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import './Features.css';

const SubscriptionsPage = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const res = await api.get('subscriptions/');
                setSubscriptions(res.data);
            } catch (err) {
                console.error('Failed to fetch subscriptions');
            } finally {
                setLoading(false);
            }
        };
        fetchSubscriptions();
    }, []);

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        service_name: '',
        cost: '',
        renewal_date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('subscriptions/', formData);

            // Deduct first month immediately by logging it as an expense
            try {
                await api.post('expenses/', {
                    amount: formData.cost,
                    category: 'OT', // Others or Bills
                    description: `Subscription Start: ${formData.service_name}`,
                    date: new Date().toISOString().split('T')[0],
                    payment_method: 'NB'
                });
            } catch (expenseErr) {
                console.warn('Failed to deduct initial subscription cost', expenseErr);
            }

            setSubscriptions([res.data, ...subscriptions]);
            setShowForm(false);
            setFormData({
                service_name: '',
                cost: '',
                renewal_date: new Date().toISOString().split('T')[0]
            });
            alert('Subscription added!');
        } catch (err) {
            console.error('Subscription error details:', err.response?.data);
            alert('Failed to add subscription: ' + JSON.stringify(err.response?.data || 'Unknown error'));
        }
    };

    const handleDeleteSubscription = async (id) => {
        if (!window.confirm('Are you sure you want to delete this subscription?')) return;
        try {
            await api.delete(`subscriptions/${id}/`);
            setSubscriptions(subscriptions.filter(s => s.id !== id));
        } catch (err) {
            alert('Failed to delete subscription');
        }
    };

    const totalCost = subscriptions.reduce((sum, s) => sum + parseFloat(s.cost || 0), 0);

    return (
        <div className="feature-container">
            <div className="page-header">
                <h1 className="page-title">Subscriptions</h1>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Add Subscription'}
                </Button>
            </div>

            {showForm && (
                <Card title="Add New Subscription" className="mb-4" style={{ marginBottom: '2rem' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Input
                            label="Service Name"
                            placeholder="e.g. Netflix, Spotify"
                            value={formData.service_name}
                            onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                            required
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <Input
                                label="Monthly Cost (₹)"
                                type="number"
                                placeholder="0.00"
                                value={formData.cost}
                                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                required
                            />
                            <Input
                                label="Next Renewal Date"
                                type="date"
                                value={formData.renewal_date}
                                onChange={(e) => setFormData({ ...formData, renewal_date: e.target.value })}
                                required
                            />
                        </div>
                        <Button type="submit">Save Subscription</Button>
                    </form>
                </Card>
            )}

            {loading ? (
                <p>Loading subscriptions...</p>
            ) : (
                <>
                    <div className="feature-grid">
                        {subscriptions.map(s => (
                            <Card key={s.id}>
                                <div className="subscription-item-card">
                                    <div className="s-header">
                                        <span className="s-icon-box">📺</span>
                                        <div>
                                            <h4>{s.service_name}</h4>
                                            <p className="s-date">Next renewal: {s.renewal_date}</p>
                                        </div>
                                    </div>
                                    <div className="s-footer">
                                        <span className="s-price">₹{s.cost}/mo</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                                            onClick={() => handleDeleteSubscription(s.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <Card title="Monthly Commitment" subtitle="Upcoming Renewals">
                        <div className="renewal-alert">
                            <p>Total subscription cost this month: <strong>₹{totalCost.toFixed(2)}</strong></p>
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
};

export default SubscriptionsPage;

