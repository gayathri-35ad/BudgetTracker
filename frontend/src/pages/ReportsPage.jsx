import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from '../components/common/Card';
import './Features.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const ReportsPage = () => {
    const [reportData, setReportData] = useState({ trends: [], categories: [] });
    const [loading, setLoading] = useState(true);

    const categoryMap = {
        'FO': 'Food',
        'TR': 'Travel',
        'SH': 'Shopping',
        'EN': 'Entertainment',
        'HE': 'Health',
        'ED': 'Education',
        'OT': 'Others'
    };

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const res = await api.get('analytics/trend/');
                setReportData(res.data);
            } catch (err) {
                console.error('Failed to fetch report data');
            } finally {
                setLoading(false);
            }
        };
        fetchReportData();
    }, []);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
        },
    };

    const trends = reportData.trends || [];
    const categories = reportData.categories || [];

    const barChartData = {
        labels: trends.map(d => new Date(d.month).toLocaleString('default', { month: 'short' })),
        datasets: [
            {
                label: 'Income (₹)',
                data: trends.map(d => parseFloat(d.income || 0)),
                backgroundColor: '#10b981',
            },
            {
                label: 'Expenses (₹)',
                data: trends.map(d => parseFloat(d.expenses || 0)),
                backgroundColor: '#ef4444',
            }
        ]
    };

    const lineChartData = {
        labels: barChartData.labels,
        datasets: [
            {
                label: 'Savings (₹)',
                data: trends.map(d => parseFloat(d.income || 0) - parseFloat(d.expenses || 0)),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.3,
                fill: true
            }
        ]
    };

    const pieData = {
        labels: categories.map(c => categoryMap[c.category] || c.category),
        datasets: [
            {
                data: categories.map(c => parseFloat(c.total || 0)),
                backgroundColor: ['#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#ef4444', '#6b7280'],
            }
        ]
    };

    return (
        <div className="feature-container">
            <div className="page-header">
                <h1 className="page-title">Financial Reports</h1>
            </div>

            <div className="reports-grid">
                <Card title="Income vs Expenses" subtitle="Trend">
                    {loading ? (
                        <p>Loading reports...</p>
                    ) : trends.length === 0 ? (
                        <p>No data available for trends.</p>
                    ) : (
                        <div className="chart-placeholder large" style={{ backgroundColor: 'transparent', height: '300px' }}>
                            <Bar options={chartOptions} data={barChartData} />
                        </div>
                    )}
                </Card>

                <div className="grid-split">
                    <Card title="Spending by Category" subtitle="Current Month Breakdown">
                        <div className="chart-placeholder" style={{ backgroundColor: 'transparent', height: '200px' }}>
                            {categories.length > 0 ? (
                                <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
                            ) : (
                                <p style={{ textAlign: 'center', paddingTop: '80px' }}>No category data</p>
                            )}
                        </div>
                    </Card>

                    <Card title="Monthly Savings" subtitle="Flow">
                        <div className="chart-placeholder" style={{ backgroundColor: 'transparent', height: '200px' }}>
                            {trends.length > 0 ? (
                                <Line options={chartOptions} data={lineChartData} />
                            ) : (
                                <p style={{ textAlign: 'center', paddingTop: '80px' }}>No trend data</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;


