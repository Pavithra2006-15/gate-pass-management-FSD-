import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const FacultyDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [pendingPasses, setPendingPasses] = useState([]);
  const [allPasses, setAllPasses] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [remarks, setRemarks] = useState({});
  const [filters, setFilters] = useState({ date: '', status: '' });

  useEffect(() => {
    fetchPendingPasses();
    fetchAllPasses();
  }, []);

  const fetchPendingPasses = async () => {
    try {
      const { data } = await api.get('/gatepass/pending');
      setPendingPasses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch pending passes:', error);
      setPendingPasses([]);
    }
  };

  const fetchAllPasses = async () => {
    try {
      const { data } = await api.get('/gatepass/faculty-history');
      setAllPasses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      setAllPasses([]);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/gatepass/approve/${id}`, { remarks: remarks[id] || '' });
      fetchPendingPasses();
      fetchAllPasses();
      alert('Gate pass approved!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to approve');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/gatepass/reject/${id}`, { remarks: remarks[id] || '' });
      fetchPendingPasses();
      fetchAllPasses();
      alert('Gate pass rejected');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reject');
    }
  };

  // Spring Boot returns 'student' not 'studentId'
  const getStudent = (pass) => pass.student || pass.studentId || {};

  const filteredPasses = allPasses.filter(pass => {
    if (filters.date && new Date(pass.date).toDateString() !== new Date(filters.date).toDateString()) return false;
    if (filters.status && pass.status !== filters.status) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-black border-r border-gray-800 z-40 flex flex-col">
        <div className="px-6 py-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-red-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">GP</span>
            </div>
            <div>
              <p className="text-white font-black text-lg leading-none">GatePass</p>
              <p className="text-yellow-400 text-xs font-semibold">Faculty Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
            { id: 'pending', label: 'Pending Requests', icon: '⏳' },
            { id: 'history', label: 'History', icon: '📋' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-yellow-400 to-red-600 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.id === 'pending' && pendingPasses.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingPasses.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user.name}</p>
              <p className="text-gray-500 text-xs">{user.department}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-black border-b border-gray-800 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-bold text-white">
              {activeTab === 'pending' ? '⏳ Pending Requests' : '📋 History'}
            </h1>
            <p className="text-gray-500 text-xs mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </header>

        {/* Stats */}
        <div className="px-8 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-3xl font-black text-yellow-400 mt-1">{pendingPasses.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-400/10 rounded-xl flex items-center justify-center text-2xl">⏳</div>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Approved</p>
                <p className="text-3xl font-black text-green-400 mt-1">{allPasses.filter(p => p.status === 'approved').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-400/10 rounded-xl flex items-center justify-center text-2xl">✅</div>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Rejected</p>
                <p className="text-3xl font-black text-red-400 mt-1">{allPasses.filter(p => p.status === 'rejected').length}</p>
              </div>
              <div className="w-12 h-12 bg-red-400/10 rounded-xl flex items-center justify-center text-2xl">❌</div>
            </div>
          </div>
        </div>

        <main className="flex-1 p-8">
          {/* Pending Tab */}
          {activeTab === 'pending' && (
            <div>
              {pendingPasses.length === 0 ? (
                <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800">
                  <div className="text-6xl mb-4">✅</div>
                  <p className="text-gray-400 text-lg">No pending requests</p>
                  <p className="text-gray-600 text-sm mt-2">All gate pass requests have been reviewed</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPasses.map((pass) => {
                    const student = getStudent(pass);
                    const passId = pass.id || pass._id;
                    return (
                      <div key={passId} className="bg-gray-900 border border-yellow-400/20 rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-red-600 rounded-full flex items-center justify-center text-white font-black text-lg">
                              {student.name ? student.name.charAt(0) : '?'}
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-lg">{student.name || 'Unknown'}</h3>
                              <p className="text-gray-400 text-sm">{student.department || ''} • {student.email || ''}</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-xs font-bold">
                            PENDING
                          </span>
                        </div>

                        <div className="bg-gray-800 rounded-xl p-4 mb-4">
                          <p className="text-white font-medium mb-3">{pass.reason}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 mb-1">Date</p>
                              <p className="text-white font-medium">{pass.date ? new Date(pass.date).toLocaleDateString() : '-'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">Out Time</p>
                              <p className="text-white font-medium">{pass.outTime}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">Return Time</p>
                              <p className="text-white font-medium">{pass.expectedReturnTime}</p>
                            </div>
                            {pass.destination && (
                              <div>
                                <p className="text-gray-500 mb-1">Destination</p>
                                <p className="text-white font-medium">{pass.destination}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mb-4">
                          <textarea
                            value={remarks[passId] || ''}
                            onChange={(e) => setRemarks({ ...remarks, [passId]: e.target.value })}
                            rows="2"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-500 placeholder-gray-500 text-sm"
                            placeholder="Add remarks (optional for approval, recommended for rejection)..."
                          />
                        </div>

                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleApprove(passId)}
                            className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-bold"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleReject(passId)}
                            className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-bold"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Gate Pass History</h2>
                <div className="flex space-x-3">
                  <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                    className="px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 text-sm"
                  />
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 text-sm"
                  >
                    <option value="">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Student</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Reason</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Time</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredPasses.map((pass) => {
                      const student = getStudent(pass);
                      return (
                        <tr key={pass.id || pass._id} className="hover:bg-gray-800/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {student.name ? student.name.charAt(0) : '?'}
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">{student.name || '-'}</p>
                                <p className="text-gray-500 text-xs">{student.department || ''}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">{pass.reason}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {pass.date ? new Date(pass.date).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {pass.outTime} - {pass.expectedReturnTime}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              pass.status === 'approved' ? 'bg-green-900/50 text-green-400' :
                              pass.status === 'rejected' ? 'bg-red-900/50 text-red-400' :
                              'bg-yellow-900/50 text-yellow-400'
                            }`}>
                              {pass.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">{pass.remarks || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredPasses.length === 0 && (
                  <div className="text-center py-12 text-gray-600">No records found</div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FacultyDashboard;
