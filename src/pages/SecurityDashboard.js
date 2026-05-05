import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const SecurityDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [gatePassId, setGatePassId] = useState('');
  const [verifiedPass, setVerifiedPass] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('verify');
  const [todayPasses, setTodayPasses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodayPasses();
  }, []);

  const fetchTodayPasses = async () => {
    try {
      const { data } = await api.get('/gatepass/approved-today');
      const passes = Array.isArray(data) ? data : [];
      setTodayPasses(passes);
    } catch (error) {
      console.error(error);
      setTodayPasses([]);
    }
  };

  const handleVerify = async () => {
    if (!gatePassId.trim()) {
      setError('Please enter a Gate Pass ID');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/gatepass/verify', { gatePassId: parseInt(gatePassId) });
      setVerifiedPass(data.gatePass);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
      setVerifiedPass(null);
    }
    setLoading(false);
  };

  const handleExit = async () => {
    try {
      const id = verifiedPass.id || verifiedPass._id;
      await api.put(`/gatepass/exit/${id}`);
      alert('✅ Exit time recorded successfully!');
      setVerifiedPass(null);
      setGatePassId('');
      fetchTodayPasses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record exit');
    }
  };

  const handleEntry = async () => {
    try {
      const id = verifiedPass.id || verifiedPass._id;
      await api.put(`/gatepass/entry/${id}`);
      alert('✅ Entry time recorded successfully!');
      setVerifiedPass(null);
      setGatePassId('');
      fetchTodayPasses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record entry');
    }
  };

  const getStudent = (pass) => pass.student || pass.studentId || {};

  const stats = {
    total: todayPasses.length,
    exited: todayPasses.filter(p => p.exitTime).length,
    returned: todayPasses.filter(p => p.entryTime).length,
    outside: todayPasses.filter(p => p.exitTime && !p.entryTime).length,
  };

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
              <p className="text-yellow-400 text-xs font-semibold">Security Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
            { id: 'verify', label: 'Verify Pass', icon: '🔍' },
            { id: 'today', label: "Today's Passes", icon: '📋' },
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
              <p className="text-gray-500 text-xs">Security</p>
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
        <header className="bg-black border-b border-gray-800 px-8 py-4 sticky top-0 z-30">
          <h1 className="text-xl font-bold text-white">
            {activeTab === 'verify' ? '🔍 Verify Gate Pass' : "📋 Today's Passes"}
          </h1>
          <p className="text-gray-500 text-xs mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        {/* Stats */}
        <div className="px-8 pt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Today's Passes", value: stats.total, color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: '📋' },
            { label: 'Exited', value: stats.exited, color: 'text-orange-400', bg: 'bg-orange-400/10', icon: '🚪' },
            { label: 'Outside', value: stats.outside, color: 'text-red-400', bg: 'bg-red-400/10', icon: '⚠️' },
            { label: 'Returned', value: stats.returned, color: 'text-green-400', bg: 'bg-green-400/10', icon: '🏠' },
          ].map((s, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs mb-1">{s.label}</p>
                  <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                </div>
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center text-xl`}>
                  {s.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <main className="flex-1 p-8">
          {/* Verify Tab */}
          {activeTab === 'verify' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-2">Verify Gate Pass</h2>
                <p className="text-gray-400 text-sm mb-6">Enter the Gate Pass ID to verify and record exit/entry</p>

                <div className="flex space-x-3">
                  <input
                    type="number"
                    placeholder="Enter Gate Pass ID (e.g. 1, 2, 3...)"
                    value={gatePassId}
                    onChange={(e) => setGatePassId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-500 placeholder-gray-500"
                  />
                  <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-red-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {loading ? '...' : 'Verify'}
                  </button>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-900/30 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    ❌ {error}
                  </div>
                )}
              </div>

              {/* Verified Pass Result */}
              {verifiedPass && (
                <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <h3 className="text-green-400 font-bold text-lg">Valid Gate Pass</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { label: 'Student Name', value: getStudent(verifiedPass).name },
                      { label: 'Department', value: getStudent(verifiedPass).department },
                      { label: 'Email', value: getStudent(verifiedPass).email },
                      { label: 'Date', value: verifiedPass.date ? new Date(verifiedPass.date).toLocaleDateString() : '-' },
                      { label: 'Out Time', value: verifiedPass.outTime },
                      { label: 'Return Time', value: verifiedPass.expectedReturnTime },
                      { label: 'Destination', value: verifiedPass.destination || 'Not specified' },
                      { label: 'Status', value: verifiedPass.status?.toUpperCase() },
                    ].map((item, i) => (
                      <div key={i} className="bg-gray-800 rounded-xl p-3">
                        <p className="text-gray-500 text-xs mb-1">{item.label}</p>
                        <p className="text-white text-sm font-medium">{item.value || '-'}</p>
                      </div>
                    ))}
                  </div>

                  {verifiedPass.reason && (
                    <div className="bg-gray-800 rounded-xl p-3 mb-6">
                      <p className="text-gray-500 text-xs mb-1">Reason</p>
                      <p className="text-white text-sm">{verifiedPass.reason}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-800 rounded-xl p-3 text-center">
                      <p className="text-gray-500 text-xs mb-1">Exit Time</p>
                      <p className="text-orange-400 font-medium text-sm">
                        {verifiedPass.exitTime ? new Date(verifiedPass.exitTime).toLocaleTimeString() : 'Not recorded'}
                      </p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-3 text-center">
                      <p className="text-gray-500 text-xs mb-1">Entry Time</p>
                      <p className="text-green-400 font-medium text-sm">
                        {verifiedPass.entryTime ? new Date(verifiedPass.entryTime).toLocaleTimeString() : 'Not recorded'}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleExit}
                      disabled={!!verifiedPass.exitTime}
                      className="flex-1 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      🚪 Record Exit
                    </button>
                    <button
                      onClick={handleEntry}
                      disabled={!verifiedPass.exitTime || !!verifiedPass.entryTime}
                      className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      🏠 Record Entry
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Today's Passes Tab */}
          {activeTab === 'today' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Today's Approved Passes</h2>
                <button
                  onClick={fetchTodayPasses}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 text-sm"
                >
                  🔄 Refresh
                </button>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Student</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Reason</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Time</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Exit</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Entry</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {todayPasses.map((pass) => {
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
                            {pass.outTime} - {pass.expectedReturnTime}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {pass.exitTime
                              ? <span className="text-orange-400">{new Date(pass.exitTime).toLocaleTimeString()}</span>
                              : <span className="text-gray-600">-</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {pass.entryTime
                              ? <span className="text-green-400">{new Date(pass.entryTime).toLocaleTimeString()}</span>
                              : <span className="text-gray-600">-</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              pass.status === 'completed' ? 'bg-green-900/50 text-green-400' :
                              pass.exitTime ? 'bg-orange-900/50 text-orange-400' :
                              'bg-yellow-900/50 text-yellow-400'
                            }`}>
                              {pass.status === 'completed' ? 'Returned' :
                               pass.exitTime ? 'Outside' : 'Approved'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {todayPasses.length === 0 && (
                  <div className="text-center py-16 text-gray-600">No approved passes for today</div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SecurityDashboard;
