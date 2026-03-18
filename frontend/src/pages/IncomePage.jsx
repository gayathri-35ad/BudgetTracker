import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import './AddTransaction.css'; // Reusing expense styles for consistency

const IncomePage = () => {
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        source: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    useEffect(() => {
        fetchIncomes();
    }, []);

    const fetchIncomes = async () => {
        try {
            const res = await api.get('income/');
            setIncomes(res.data);
        } catch (err) {
            console.error('Failed to fetch income');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('income/', formData);
            setIncomes([res.data, ...incomes]);
            setFormData({
                source: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                notes: ''
            });
            alert('Income added successfully!');
        } catch (err) {
            alert('Failed to add income');
        }
    };

    return (
        <div className="add-transaction-container">
            <div className="page-header">
                <h1 className="page-title">Income Management</h1>
                <p className="page-subtitle">Track your earnings and salary deposits.</p>
            </div>

            <div className="dashboard-grid">
                <div className="grid-left">
                    <Card title="Add New Income">
                        <form onSubmit={handleSubmit} className="transaction-form">
                            <Input
                                label="Source / Salary"
                                placeholder="e.g. Monthly Salary"
                                value={formData.source}
                                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                required
                            />
                            <div className="form-row">
                                <Input
                                    label="Amount"
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <Input
                                label="Notes"
                                placeholder="Additional details..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                            <Button type="submit" className="w-full">Save Income</Button>
                        </form>
                    </Card>
                </div>

                <div className="grid-right">
                    <Card title="Recent Income History">
                        {loading ? (
                            <p>Loading...</p>
                        ) : incomes.length === 0 ? (
                            <p>No income records found.</p>
                        ) : (
                            <div className="recent-list">
                                {incomes.slice(0, 5).map(inc => (
                                    <div key={inc.id} className="list-item">
                                        <div className="list-item-info">
                                            <span className="list-item-title">{inc.source}</span>
                                            <span className="list-item-date">{inc.date}</span>
                                        </div>
                                        <span className="list-item-amount success">+₹{inc.amount}</span>
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

export default IncomePage;
