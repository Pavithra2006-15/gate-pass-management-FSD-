import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/analytics/dashboard');
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch stats');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (!stats) return <div className="error">Failed to load analytics</div>;

  return (
    <div className="analytics-dashboard">
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.totalPasses}</h3>
            <p>Total Passes</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats.todayPasses}</h3>
            <p>Today's Passes</p>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.weekPasses}</h3>
            <p>This Week</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h4>Status Distribution</h4>
          <div className="status-chart">
            {stats.statusStats.map((status) => (
              <div key={status._id} className={`status-bar ${status._id}`}>
                <span className="status-label">{status._id}</span>
                <div className="status-progress">
                  <div 
                    className="status-fill"
                    style={{ width: `${(status.count / stats.totalPasses) * 100}%` }}
                  ></div>
                </div>
                <span className="status-count">{status.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h4>Department Wise</h4>
          <div className="department-chart">
            {stats.departmentStats.map((dept) => (
              <div key={dept._id} className="dept-item">
                <span className="dept-name">{dept._id}</span>
                <span className="dept-count">{dept.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;