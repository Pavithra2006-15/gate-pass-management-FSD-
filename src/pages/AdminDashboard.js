import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import NotificationBell from '../components/NotificationBell';
import AuditLogViewer from '../components/AuditLogViewer';
import api from '../utils/api';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [gatePasses, setGatePasses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filters, setFilters] = useState({ department: '', date: '', status: '' });
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchGatePasses();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) { console.error(error); }
  };

  const fetchGatePasses = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.department) params.append('department', filters.department);
      if (filters.date) params.append('date', filters.date);
      const { data } = await api.get(`/gatepass/all?${params}`);
      setGatePasses(Array.isArray(data) ? data : []);
    } catch (error) { console.error(error); }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete');
      }
    }
  };

  // Spring Boot returns 'student' not 'studentId', and 'id' not '_id'
  const getStudent = (pass) => pass.student || pass.studentId || {};
  const getId = (obj) => obj?.id || obj?._id;

  const getStudentStats = (studentId) => {
    const sp = gatePasses.filter(p => getId(getStudent(p)) === studentId);
    return {
      total: sp.length,
      approved: sp.filter(p => p.status === 'approved').length,
      rejected: sp.filter(p => p.status === 'rejected').length,
      pending: sp.filter(p => p.status === 'pending').length
    };
  };

  const filteredUsers = users.filter(u =>
    (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.department && u.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredPasses = gatePasses.filter(p => {
    if (filters.status && p.status !== filters.status) return false;
    if (selectedStudent && getId(getStudent(p)) !== selectedStudent) return false;
    return true;
  });

  const stats = {
    totalUsers: users.length,
    students: users.filter(u => u.role === 'student').length,
    faculty: users.filter(u => u.role === 'faculty').length,
    security: users.filter(u => u.role === 'security').length,
    totalPasses: gatePasses.length,
    approved: gatePasses.filter(p => p.status === 'approved').length,
    rejected: gatePasses.filter(p => p.status === 'rejected').length,
    pending: gatePasses.filter(p => p.status === 'pending').length
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'students', label: 'Students', icon: '🎓' },
    { id: 'passes', label: 'Gate Passes', icon: '📋' },
    { id: 'users', label: 'All Users', icon: '👥' },
    { id: 'audit', label: 'Audit Logs', icon: '🔍' },
  ];

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
              <p className="text-yellow-400 text-xs font-semibold">Pro Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {tabs.map((tab) => (
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
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-gray-500 text-xs">Administrator</p>
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
        <header className="bg-black border-b border-gray-800 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-bold text-white">
              {tabs.find(t => t.id === activeTab)?.icon} {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-gray-500 text-xs mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                  { label: 'Total Users', value: stats.totalUsers, icon: '👥', sub: `${stats.students} students`, gradient: 'from-yellow-400 to-yellow-600' },
                  { label: 'Total Passes', value: stats.totalPasses, icon: '📋', sub: 'All time', gradient: 'from-orange-400 to-red-500' },
                  { label: 'Approved', value: stats.approved, icon: '✅', sub: `${stats.totalPasses ? Math.round((stats.approved / stats.totalPasses) * 100) : 0}% rate`, gradient: 'from-green-500 to-green-700' },
                  { label: 'Pending', value: stats.pending, icon: '⏳', sub: 'Awaiting review', gradient: 'from-yellow-500 to-red-600' },
                ].map((card, i) => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-yellow-400/30 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center text-xl shadow-lg`}>
                        {card.icon}
                      </div>
                      <span className="text-gray-600 text-xs">Live</span>
                    </div>
                    <p className="text-4xl font-black text-white mb-1">{card.value}</p>
                    <p className="text-gray-400 font-medium text-sm">{card.label}</p>
                    <p className="text-gray-600 text-xs mt-1">{card.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-white font-bold text-lg mb-6">User Breakdown</h3>
                  <div className="space-y-4">
                    {[
                      { role: 'Students', count: stats.students, color: 'bg-yellow-400', pct: stats.totalUsers ? Math.round((stats.students / stats.totalUsers) * 100) : 0 },
                      { role: 'Faculty', count: stats.faculty, color: 'bg-orange-500', pct: stats.totalUsers ? Math.round((stats.faculty / stats.totalUsers) * 100) : 0 },
                      { role: 'Security', count: stats.security, color: 'bg-red-500', pct: stats.totalUsers ? Math.round((stats.security / stats.totalUsers) * 100) : 0 },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">{item.role}</span>
                          <span className="text-white font-semibold">{item.count}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.pct}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <h4 className="text-white font-bold mb-4">Pass Status</h4>
                    {[
                      { label: 'Approved', count: stats.approved, color: 'text-green-400' },
                      { label: 'Pending', count: stats.pending, color: 'text-yellow-400' },
                      { label: 'Rejected', count: stats.rejected, color: 'text-red-400' },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center mb-2">
                        <span className="text-gray-400 text-sm">{item.label}</span>
                        <span className={`font-bold text-lg ${item.color}`}>{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-bold text-lg">Recent Gate Passes</h3>
                    <button onClick={() => setActiveTab('passes')} className="text-yellow-400 text-sm hover:text-yellow-300">View all →</button>
                  </div>
                  <div className="space-y-3">
                    {gatePasses.slice(0, 6).map((pass) => {
                      const student = getStudent(pass);
                      return (
                        <div key={getId(pass)} className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {student?.name ? student.name.charAt(0) : '?'}
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">{student?.name || '-'}</p>
                              <p className="text-gray-500 text-xs">{student?.department || ''} • {pass.date ? new Date(pass.date).toLocaleDateString() : ''}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              pass.status === 'approved' ? 'bg-green-900/50 text-green-400' :
                              pass.status === 'rejected' ? 'bg-red-900/50 text-red-400' :
                              'bg-yellow-900/50 text-yellow-400'
                            }`}>
                              {pass.status}
                            </span>
                            <p className="text-gray-600 text-xs mt-1">{pass.outTime}</p>
                          </div>
                        </div>
                      );
                    })}
                    {gatePasses.length === 0 && (
                      <div className="text-center py-8 text-gray-600">No gate passes yet</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Student Management</h2>
                  <p className="text-gray-500 text-sm mt-1">{stats.students} students registered</p>
                </div>
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 placeholder-gray-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredUsers.filter(u => u.role === 'student').map((student) => {
                  const sid = getId(student);
                  const ss = getStudentStats(sid);
                  return (
                    <div
                      key={sid}
                      className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-yellow-400/40 transition-all cursor-pointer"
                      onClick={() => { setSelectedStudent(sid); setActiveTab('passes'); }}
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-red-600 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                          {student.name?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold truncate">{student.name}</h3>
                          <p className="text-gray-500 text-xs truncate">{student.email}</p>
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-lg px-3 py-2 mb-4">
                        <p className="text-gray-500 text-xs">Department</p>
                        <p className="text-white text-sm font-medium">{student.department || '-'}</p>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {[
                          { label: 'Total', value: ss.total, color: 'text-white' },
                          { label: 'Approved', value: ss.approved, color: 'text-green-400' },
                          { label: 'Pending', value: ss.pending, color: 'text-yellow-400' },
                          { label: 'Rejected', value: ss.rejected, color: 'text-red-400' },
                        ].map((s, i) => (
                          <div key={i} className="text-center">
                            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-gray-600 text-xs">{s.label}</p>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteUser(sid); }}
                        className="w-full py-2 bg-red-600/10 text-red-400 rounded-lg hover:bg-red-600/20 transition-colors text-sm font-medium"
                      >
                        Delete User
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Gate Passes Tab */}
          {activeTab === 'passes' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Gate Pass Records</h2>
                  <p className="text-gray-500 text-sm mt-1">{filteredPasses.length} records found</p>
                </div>
                <div className="flex space-x-3">
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 text-sm"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  {selectedStudent && (
                    <button onClick={() => setSelectedStudent(null)} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 text-sm">
                      Clear Filter ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Student</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Department</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Reason</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Time</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Exit/Entry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredPasses.map((pass) => {
                      const student = getStudent(pass);
                      return (
                        <tr key={getId(pass)} className="hover:bg-gray-800/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {student?.name ? student.name.charAt(0) : '?'}
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">{student?.name || '-'}</p>
                                <p className="text-gray-500 text-xs">{student?.email || ''}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{student?.department || '-'}</td>
                          <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">{pass.reason}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{pass.date ? new Date(pass.date).toLocaleDateString() : '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{pass.outTime} - {pass.expectedReturnTime}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              pass.status === 'approved' ? 'bg-green-900/50 text-green-400' :
                              pass.status === 'rejected' ? 'bg-red-900/50 text-red-400' :
                              'bg-yellow-900/50 text-yellow-400'
                            }`}>
                              {pass.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {pass.exitTime ? <p className="text-orange-400 text-xs">🚪 {new Date(pass.exitTime).toLocaleTimeString()}</p> : null}
                            {pass.entryTime ? <p className="text-green-400 text-xs">🏠 {new Date(pass.entryTime).toLocaleTimeString()}</p> : null}
                            {!pass.exitTime && !pass.entryTime && <span className="text-gray-600 text-xs">Not recorded</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredPasses.length === 0 && (
                  <div className="text-center py-16 text-gray-600">No gate passes found</div>
                )}
              </div>
            </div>
          )}

          {/* All Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">All Users</h2>
                  <p className="text-gray-500 text-sm mt-1">{users.length} total users</p>
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 placeholder-gray-500 text-sm"
                />
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">User</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Department</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Joined</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredUsers.map((u) => (
                      <tr key={getId(u)} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {u.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">{u.name}</p>
                              <p className="text-gray-500 text-xs">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            u.role === 'student' ? 'bg-yellow-900/50 text-yellow-400' :
                            u.role === 'faculty' ? 'bg-orange-900/50 text-orange-400' :
                            u.role === 'security' ? 'bg-red-900/50 text-red-400' :
                            'bg-gray-800 text-gray-400'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{u.department || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteUser(getId(u))}
                            className="px-3 py-1 bg-red-600/10 text-red-400 rounded-lg hover:bg-red-600/20 transition-colors text-xs font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Audit Logs Tab */}
          {activeTab === 'audit' && <AuditLogViewer />}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
