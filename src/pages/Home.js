import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="landing-content">
        <h1>Digital Gate Pass Management System</h1>
        <p>Streamline gate pass requests and approvals for educational institutions</p>
        
        <div className="features">
          <div className="feature">
            <h3>🎓 Students</h3>
            <p>Apply for gate passes digitally</p>
          </div>
          <div className="feature">
            <h3>👨‍🏫 Faculty</h3>
            <p>Approve or reject requests</p>
          </div>
          <div className="feature">
            <h3>🔒 Security</h3>
            <p>Verify QR codes and log entry/exit</p>
          </div>
          <div className="feature">
            <h3>⚙️ Admin</h3>
            <p>Manage users and records</p>
          </div>
        </div>

        <div className="cta-buttons">
          <button onClick={() => navigate('/login')} className="btn-primary">Login</button>
          <button onClick={() => navigate('/register')} className="btn-secondary">Register</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
