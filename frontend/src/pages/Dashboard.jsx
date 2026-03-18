import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import './Dashboard.css';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('analytics/summary/');
                setData(res.data);
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="dashboard-loading">Loading your financial summary...</div>;
    if (!data) return <div className="dashboard-error">Error loading data. Please try again.</div>;

    const summaryCards = [
        { title: 'Total Balance', amount: `₹${Number(data.balance).toLocaleString()}`, color: data.balance >= 0 ? 'var(--primary)' : 'var(--danger)' },
        { title: 'Total Income', amount: `₹${Number(data.total_income).toLocaleString()}`, color: 'var(--success)' },
        { title: 'Total Expenses', amount: `₹${Number(data.total_expenses).toLocaleString()}`, color: 'var(--danger)' },
    ];

    const handleDownloadReport = () => {
        if (!data) return;

        // Prepare CSV content
        const headers = ["Category", "Description", "Amount", "Date"];
        const rows = data.recent_transactions.map(t => [
            t.category,
            t.description || "N/A",
            t.amount,
            t.date
        ]);

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "--- FINANCIAL SUMMARY ---\n";
        csvContent += `Total Income,₹${data.total_income}\n`;
        csvContent += `Total Expenses,₹${data.total_expenses}\n`;
        csvContent += `Balance,₹${data.balance}\n\n`;

        csvContent += "--- BUDGET HEALTH ---\n";
        csvContent += `Limit,₹${data.budget_status.limit}\n`;
        csvContent += `Used,₹${data.budget_status.used}\n`;
        csvContent += `Usage,${data.budget_status.usage_percent.toFixed(1)}%\n\n`;

        csvContent += "--- RECENT TRANSACTIONS ---\n";
        csvContent += headers.join(",") + "\n";
        rows.forEach(row => {
            csvContent += row.join(",") + "\n";
        });

        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `SmartBudget_Report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="page-title">Financial Overview</h1>
                <div className="header-actions">
                    <Button variant="outline" onClick={handleDownloadReport}>Download Report</Button>
                    <Button>+ Add Transaction</Button>
                </div>
            </div>

            <div className="summary-grid">
                {summaryCards.map(item => (
                    <Card key={item.title} className="summary-card">
                        <div className="summary-item">
                            <span className="summary-title">{item.title}</span>
                            <h2 className="summary-amount" style={{ color: item.color }}>{item.amount}</h2>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="grid-left">
                    <Card title="Recent Transactions" subtitle="Your latest spending activity">
                        <table className="transactions-table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recent_transactions.map((t, idx) => (
                                    <tr key={idx}>
                                        <td><span className="badge">{t.category}</span></td>
                                        <td>{t.description || 'No description'}</td>
                                        <td className="text-danger">-₹{t.amount}</td>
                                        <td>{t.date}</td>
                                    </tr>
                                ))}
                                {data.recent_transactions.length === 0 && (
                                    <tr><td colSpan="4" style={{ textAlign: 'center' }}>No recent expenses.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </Card>
                </div>

                <div className="grid-right">
                    <Card title="Budget Health" subtitle="Current Month">
                        <div className="budget-item">
                            <div className="budget-info">
                                <span>Monthly Spending Progress</span>
                                <span>₹{data.budget_status.used} / ₹{data.budget_status.limit}</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${Math.min(data.budget_status.usage_percent, 100)}%`,
                                        backgroundColor: data.budget_status.usage_percent > 100 ? 'var(--danger)' : 'var(--success)'
                                    }}
                                ></div>
                            </div>
                            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                                {data.budget_status.usage_percent.toFixed(1)}% of your budget used
                            </p>
                        </div>
                    </Card>

                    <Card title="AI Insights" className="insight-card">
                        <div className="insight-item">
                            <span className="insight-icon">💡</span>
                            <p>{data.insight}</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

