import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import './AddTransaction.css';

const AddExpense = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        amount: '',
        category: 'OT',
        date: new Date().toISOString().split('T')[0],
        description: '',
        payment_method: 'CA'
    });

    const categories = [
        { id: 'FO', name: 'Food', icon: '🍔' },
        { id: 'TR', name: 'Travel', icon: '🚗' },
        { id: 'SH', name: 'Shopping', icon: '🛍️' },
        { id: 'EN', name: 'Entertainment', icon: '🎬' },
        { id: 'HE', name: 'Health', icon: '🏥' },
        { id: 'ED', name: 'Education', icon: '📚' },
        { id: 'OT', name: 'Others', icon: '📦' },
    ];

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const res = await api.get('expenses/');
            setExpenses(res.data);
        } catch (err) {
            console.error('Failed to fetch expenses');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('expenses/', formData);
            setExpenses([res.data, ...expenses]);
            setFormData({
                amount: '',
                category: 'OT',
                date: new Date().toISOString().split('T')[0],
                description: '',
                payment_method: 'CA'
            });
            alert('Expense recorded successfully!');
        } catch (err) {
            alert('Failed to save expense');
        }
    };

    return (
        <div className="add-transaction-container">
            <div className="page-header">
                <h1 className="page-title">Expense Management</h1>
                <p className="page-subtitle">Track your spending history.</p>
            </div>

            <div className="dashboard-grid">
                <div className="grid-left">
                    <Card title="Add New Expense">
                        <form onSubmit={handleSubmit} className="transaction-form">
                            <div className="amount-input-group">
                                <label>Amount</label>
                                <div className="amount-input-wrapper">
                                    <span className="currency">₹</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="category-selection">
                                <label className="form-label">Category</label>
                                <div className="category-grid">
                                    {categories.map(cat => (
                                        <div
                                            key={cat.id}
                                            className={`category-item ${formData.category === cat.id ? 'active' : ''}`}
                                            onClick={() => setFormData({ ...formData, category: cat.id })}
                                        >
                                            <span className="cat-icon">{cat.icon}</span>
                                            <span className="cat-name">{cat.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-row">
                                <Input
                                    label="Date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                                <div className="form-group">
                                    <label className="form-label">Payment Method</label>
                                    <select
                                        className="form-input"
                                        value={formData.payment_method}
                                        onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                                    >
                                        <option value="CA">Cash</option>
                                        <option value="CC">Credit Card</option>
                                        <option value="DC">Debit Card</option>
                                        <option value="UP">UPI</option>
                                        <option value="NB">Net Banking</option>
                                    </select>
                                </div>
                            </div>

                            <Input
                                label="Description"
                                placeholder="What was this for?"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />

                            <Button type="submit" className="w-full">Save Expense</Button>
                        </form>
                    </Card>
                </div>

                <div className="grid-right">
                    <Card title="Recent Spending History">
                        {loading ? (
                            <p>Loading expenses...</p>
                        ) : expenses.length === 0 ? (
                            <p>No expenses found.</p>
                        ) : (
                            <div className="recent-list">
                                {expenses.slice(0, 5).map(exp => (
                                    <div key={exp.id} className="list-item">
                                        <div className="list-item-info">
                                            <span className="list-item-title">{exp.description || exp.category}</span>
                                            <span className="list-item-date">{exp.date} ({exp.get_category_display})</span>
                                        </div>
                                        <span className="list-item-amount danger">-₹{exp.amount}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AddExpense;

