import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import './Features.css';

const SavingsPage = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const res = await api.get('goals/');
                setGoals(res.data);
            } catch (err) {
                console.error('Failed to fetch savings goals');
            } finally {
                setLoading(false);
            }
        };
        fetchGoals();
    }, []);

    const [showForm, setShowForm] = useState(false);
    const [addFundsId, setAddFundsId] = useState(null);
    const [addFundsAmount, setAddFundsAmount] = useState('');

    const [formData, setFormData] = useState({
        goal_name: '',
        target_amount: '',
        deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0]
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('goals/', formData);
            setGoals([res.data, ...goals]);
            setShowForm(false);
            setFormData({
                goal_name: '',
                target_amount: '',
                deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0]
            });
            alert('Savings goal added!');
        } catch (err) {
            alert('Failed to add goal');
        }
    };

    const handleAddFunds = async (goal) => {
        if (!addFundsAmount || isNaN(addFundsAmount)) return;
        try {
            const newAmount = parseFloat(goal.saved_amount || 0) + parseFloat(addFundsAmount);
            const res = await api.patch(`goals/${goal.id}/`, { saved_amount: newAmount });

            // Log this as an expense to deduct from main balance
            try {
                await api.post('expenses/', {
                    amount: addFundsAmount,
                    category: 'OT', // Others
                    description: `Transferred to Savings: ${goal.goal_name}`,
                    date: new Date().toISOString().split('T')[0],
                    payment_method: 'NB'
                });
            } catch (expenseErr) {
                console.warn('Failed to log expense for savings transfer', expenseErr);
            }

            setGoals(goals.map(g => g.id === goal.id ? res.data : g));
            setAddFundsId(null);
            setAddFundsAmount('');
        } catch (err) {
            alert('Failed to add funds');
        }
    };

    return (
        <div className="feature-container">
            <div className="page-header">
                <h1 className="page-title">Savings Goals</h1>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Add New Goal'}
                </Button>
            </div>

            {showForm && (
                <Card title="Create New Savings Goal" className="mb-4" style={{ marginBottom: '2rem' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Input
                            label="Goal Name"
                            placeholder="e.g. Vacation, Emergency Fund"
                            value={formData.goal_name}
                            onChange={(e) => setFormData({ ...formData, goal_name: e.target.value })}
                            required
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <Input
                                label="Target Amount (₹)"
                                type="number"
                                placeholder="0.00"
                                value={formData.target_amount}
                                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                                required
                            />
                            <Input
                                label="Target Date"
                                type="date"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                required
                            />
                        </div>
                        <Button type="submit">Save Goal</Button>
                    </form>
                </Card>
            )}

            {loading ? (
                <p>Loading goals...</p>
            ) : goals.length === 0 ? (
                <Card>
                    <p style={{ textAlign: 'center', padding: '2rem' }}>No savings goals found. Start saving for something special!</p>
                </Card>
            ) : (
                <div className="feature-grid">
                    {goals.map(goal => {
                        const percent = (goal.saved_amount / goal.target_amount) * 100;
                        return (
                            <Card key={goal.id} className="goal-card">
                                <div className="goal-content">
                                    <span className="goal-icon-large">🎯</span>
                                    <h3>{goal.goal_name}</h3>
                                    <div className="goal-progress">
                                        <div className="progress-info">
                                            <span>₹{goal.saved_amount}</span>
                                            <span>₹{goal.target_amount}</span>
                                        </div>
                                        <div className="progress-bar-large">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${Math.min(percent, 100)}%`, backgroundColor: 'var(--primary)' }}
                                            ></div>
                                        </div>
                                    </div>
                                    <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                        Target Date: {goal.deadline}
                                    </p>
                                    {addFundsId === goal.id ? (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Input
                                                type="number"
                                                placeholder="Amount"
                                                value={addFundsAmount}
                                                onChange={(e) => setAddFundsAmount(e.target.value)}
                                            />
                                            <Button size="sm" onClick={() => handleAddFunds(goal)}>Save</Button>
                                            <Button variant="outline" size="sm" onClick={() => { setAddFundsId(null); setAddFundsAmount(''); }}>X</Button>
                                        </div>
                                    ) : (
                                        <Button variant="outline" size="sm" className="w-full" onClick={() => setAddFundsId(goal.id)}>Add Funds</Button>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SavingsPage;

