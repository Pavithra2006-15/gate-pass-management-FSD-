import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [gatePasses, setGatePasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    date: '',
    outTime: '',
    expectedReturnTime: '',
    destination: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGatePasses();
  }, []);

  const fetchGatePasses = async () => {
    try {
      const { data } = await api.get('/gatepass/my');
      // Handle both array and object responses
      const passes = Array.isArray(data) ? data : [];
      setGatePasses(passes);
    } catch (error) {
      console.error(error);
      setGatePasses([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/gatepass/apply', formData);
      setShowForm(false);
      setFormData({ reason: '', date: '', outTime: '', expectedReturnTime: '', destination: '' });
      fetchGatePasses();
      alert('Gate pass request submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to apply');
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🎓</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Student Portal</h1>
                <p className="text-xs text-gray-500">Gate Pass Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.department}</p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-gray-500 text-sm mb-1">Total Requests</p>
            <p className="text-3xl font-bold text-gray-900">{gatePasses.length}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-6 shadow-sm border border-green-200">
            <p className="text-green-700 text-sm mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-700">{gatePasses.filter(p => p.status === 'approved').length}</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-6 shadow-sm border border-yellow-200">
            <p className="text-yellow-700 text-sm mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-700">{gatePasses.filter(p => p.status === 'pending').length}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-6 shadow-sm border border-red-200">
            <p className="text-red-700 text-sm mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-700">{gatePasses.filter(p => p.status === 'rejected').length}</p>
          </div>
        </div>

        {/* Apply Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 font-medium"
          >
            {showForm ? '✕ Cancel' : '+ Apply for Gate Pass'}
          </button>
        </div>

        {/* Application Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">New Gate Pass Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter reason for gate pass"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter destination"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Out Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.outTime}
                    onChange={(e) => setFormData({ ...formData, outTime: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Return Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.expectedReturnTime}
                    onChange={(e) => setFormData({ ...formData, expectedReturnTime: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        )}

        {/* Gate Pass History */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">My Gate Pass History</h2>
          
          {gatePasses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-500">No gate passes found</p>
              <p className="text-sm text-gray-400 mt-2">Apply for your first gate pass to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {gatePasses.map((pass) => (
                <div key={pass.id || pass._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(pass.status)}`}>
                          {pass.status ? pass.status.toUpperCase() : 'PENDING'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {pass.createdAt ? new Date(pass.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium mb-2">{pass.reason}</p>
                    </div>
                    {pass.status === 'approved' && pass.qrCode && (
                      <img src={pass.qrCode} alt="QR Code" className="w-24 h-24 border-2 border-gray-300 rounded-lg" />
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Date</p>
                      <p className="font-medium text-gray-900">{pass.date ? new Date(pass.date).toLocaleDateString() : '-'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Time</p>
                      <p className="font-medium text-gray-900">{pass.outTime} - {pass.expectedReturnTime}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Exit Time</p>
                      <p className="font-medium text-gray-900">
                        {pass.exitTime ? new Date(pass.exitTime).toLocaleTimeString() : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Entry Time</p>
                      <p className="font-medium text-gray-900">
                        {pass.entryTime ? new Date(pass.entryTime).toLocaleTimeString() : '-'}
                      </p>
                    </div>
                  </div>

                  {pass.destination && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-500">Destination: <span className="text-gray-900 font-medium">{pass.destination}</span></p>
                    </div>
                  )}

                  {pass.remarks && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-500">Remarks: <span className="text-gray-900">{pass.remarks}</span></p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;