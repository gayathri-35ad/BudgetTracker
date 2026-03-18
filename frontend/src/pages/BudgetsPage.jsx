import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import './Features.css';

const BudgetsPage = () => {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const res = await api.get('budgets/');
                setBudgets(res.data);
            } catch (err) {
                console.error('Failed to fetch budgets');
            } finally {
                setLoading(false);
            }
        };
        fetchBudgets();
    }, []);

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        monthly_limit: '',
        month: new Date().toISOString().split('T')[0] // default to today so start of month can be extracted
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Ensure month is set to start of month to match logic if necessary, or let backend handle
            const dateObj = new Date(formData.month);
            const formattedMonth = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-01`;

            const payload = {
                monthly_limit: formData.monthly_limit,
                month: formattedMonth
            };

            const res = await api.post('budgets/', payload);
            setBudgets([res.data, ...budgets]);
            setShowForm(false);
            setFormData({
                monthly_limit: '',
                month: new Date().toISOString().split('T')[0]
            });
            alert('Budget added!');
        } catch (err) {
            alert('Failed to add budget. Note: You can only have one budget per month.');
        }
    };

    return (
        <div className="feature-container">
            <div className="page-header">
                <h1 className="page-title">Budget Management</h1>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Set New Budget'}
                </Button>
            </div>

            {showForm && (
                <Card title="Set Monthly Budget Limit" className="mb-4" style={{ marginBottom: '2rem' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <Input
                                label="Monthly Limit (₹)"
                                type="number"
                                placeholder="0.00"
                                value={formData.monthly_limit}
                                onChange={(e) => setFormData({ ...formData, monthly_limit: e.target.value })}
                                required
                            />
                            <Input
                                label="Month (Select any date in desired month)"
                                type="date"
                                value={formData.month}
                                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                                required
                            />
                        </div>
                        <Button type="submit">Save Budget</Button>
                    </form>
                </Card>
            )}

            {loading ? (
                <p>Loading budgets...</p>
            ) : budgets.length === 0 ? (
                <Card>
                    <p style={{ textAlign: 'center', padding: '2rem' }}>No budgets set yet. Start by setting a monthly limit for a category!</p>
                </Card>
            ) : (
                <div className="feature-grid">
                    {budgets.map(b => (
                        <Card key={b.id} title={`Budget for ${new Date(b.month).toLocaleString('default', { month: 'long', year: 'numeric' })}`}>
                            <div className="budget-detail">
                                <div className="budget-numbers" style={{ justifyContent: 'center' }}>
                                    <span className="limit-amount" style={{ fontSize: '1.5rem', color: 'var(--text)' }}>
                                        Monthly Limit: ₹{b.monthly_limit}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BudgetsPage;

