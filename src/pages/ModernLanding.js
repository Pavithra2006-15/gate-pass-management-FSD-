import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ModernLanding = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, passes: 0, institutions: 0 });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const animateCounter = (target, key) => {
      let current = 0;
      const increment = target / 80;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) { current = target; clearInterval(timer); }
        setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, 20);
    };
    animateCounter(5000, 'users');
    animateCounter(25000, 'passes');
    animateCounter(150, 'institutions');

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-red-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-black text-sm">GP</span>
              </div>
              <span className="text-xl font-black text-white tracking-tight">GatePass <span className="text-yellow-400">Pro</span></span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm font-medium">Features</a>
              <a href="#how" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm font-medium">How It Works</a>
              <a href="#security" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm font-medium">Security</a>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={() => navigate('/login')} className="px-5 py-2 text-white border border-gray-600 rounded-lg hover:border-yellow-400 hover:text-yellow-400 transition-all text-sm font-medium">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="px-5 py-2 bg-gradient-to-r from-yellow-400 to-red-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-yellow-500/30 transition-all transform hover:-translate-y-0.5">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-black flex items-center overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-full text-sm font-medium mb-8">
                🚀 Trusted by 150+ Educational Institutions
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
                Digital
                <span className="block bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                  Gate Pass
                </span>
                Management
              </h1>
              <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-lg">
                Streamline your institution's gate pass system with our modern, secure, and user-friendly platform. From application to approval — everything in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => navigate('/register')} className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-red-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-yellow-500/30 transition-all transform hover:-translate-y-1">
                  Get Started Free →
                </button>
                <button onClick={() => navigate('/login')} className="px-8 py-4 border-2 border-gray-700 text-gray-300 rounded-xl font-semibold text-lg hover:border-yellow-400 hover:text-yellow-400 transition-all">
                  Sign In
                </button>
              </div>
            </div>

            {/* Hero Visual - System Features */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-2xl">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-2 text-gray-500 text-xs">GatePass Pro System</span>
                  </div>
                  <div className="space-y-4">
                    {[
                      { icon: '🎓', role: 'Student', action: 'Apply for gate pass digitally', color: 'from-yellow-400 to-yellow-600' },
                      { icon: '👨🏫', role: 'Faculty', action: 'Approve or reject requests', color: 'from-orange-400 to-red-500' },
                      { icon: '🔒', role: 'Security', action: 'Scan QR & log exit/entry', color: 'from-red-500 to-red-700' },
                      { icon: '📊', role: 'Admin', action: 'Manage users & view analytics', color: 'from-yellow-500 to-red-600' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center space-x-4 bg-gray-800 rounded-xl px-4 py-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center text-xl flex-shrink-0`}>
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold">{item.role}</p>
                          <p className="text-gray-400 text-xs">{item.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3 text-center">
                      <p className="text-yellow-400 font-bold text-lg">Fast</p>
                      <p className="text-gray-500 text-xs">Approval</p>
                    </div>
                    <div className="bg-green-400/10 border border-green-400/20 rounded-lg p-3 text-center">
                      <p className="text-green-400 font-bold text-lg">Secure</p>
                      <p className="text-gray-500 text-xs">QR Codes</p>
                    </div>
                    <div className="bg-red-400/10 border border-red-400/20 rounded-lg p-3 text-center">
                      <p className="text-red-400 font-bold text-lg">Live</p>
                      <p className="text-gray-500 text-xs">Tracking</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-400 to-red-600">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { value: stats.users.toLocaleString() + '+', label: 'Active Users', icon: '👥' },
              { value: stats.passes.toLocaleString() + '+', label: 'Passes Processed', icon: '📋' },
              { value: stats.institutions + '+', label: 'Institutions', icon: '🏫' },
            ].map((stat, i) => (
              <div key={i} className="text-white">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-5xl font-black mb-2">{stat.value}</div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-yellow-400 font-semibold text-sm uppercase tracking-widest">Features</span>
            <h2 className="text-4xl font-black text-white mt-2 mb-4">Everything You Need</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Powerful tools for every role in your institution</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🎓', title: 'Student Portal', desc: 'Apply for gate passes, track status, and view QR codes instantly', color: 'from-yellow-400 to-yellow-600' },
              { icon: '👨🏫', title: 'Faculty Dashboard', desc: 'Review and approve requests from assigned students with one click', color: 'from-orange-400 to-red-500' },
              { icon: '🔒', title: 'Security Gate', desc: 'Scan QR codes, verify passes, and log exit/entry times', color: 'from-red-500 to-red-700' },
              { icon: '📊', title: 'Admin Control', desc: 'Full analytics, user management, and audit logs', color: 'from-yellow-500 to-red-600' },
            ].map((feature, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-yellow-400/50 transition-all duration-300 group hover:-translate-y-1">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-yellow-400 font-semibold text-sm uppercase tracking-widest">Process</span>
            <h2 className="text-4xl font-black text-white mt-2 mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Simple 4-step process from request to exit</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-yellow-400 to-red-600"></div>
            {[
              { step: '01', title: 'Apply', desc: 'Student submits gate pass request with reason and time', icon: '📝' },
              { step: '02', title: 'Review', desc: 'Faculty reviews and approves or rejects the request', icon: '👁️' },
              { step: '03', title: 'QR Code', desc: 'System auto-generates a secure QR code on approval', icon: '📱' },
              { step: '04', title: 'Verify', desc: 'Security scans QR and logs exit and entry times', icon: '✅' },
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-red-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-yellow-500/20">
                  {item.icon}
                </div>
                <div className="text-yellow-400 font-black text-sm mb-2">{item.step}</div>
                <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-yellow-400 font-semibold text-sm uppercase tracking-widest">Security</span>
              <h2 className="text-4xl font-black text-white mt-2 mb-6">Enterprise-Grade Security</h2>
              <p className="text-gray-400 text-lg mb-8">Your institution's data is protected with industry-leading security measures and compliance standards.</p>
              <div className="space-y-4">
                {[
                  { icon: '🔐', title: 'JWT Authentication', desc: 'Secure token-based authentication for all users' },
                  { icon: '🛡️', title: 'Role-Based Access', desc: 'Granular permissions for students, faculty, security, admin' },
                  { icon: '📱', title: 'QR Code Validation', desc: 'Tamper-proof QR codes with expiry validation' },
                  { icon: '🔒', title: 'Password Encryption', desc: 'bcrypt hashing for all stored passwords' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4 bg-gray-900 rounded-xl p-4 border border-gray-800">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-red-600 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
              <h3 className="text-white font-bold text-xl mb-6">User Roles</h3>
              <div className="space-y-4">
                {[
                  { role: 'Student', perms: ['Apply for gate pass', 'View pass history', 'Download QR code'], color: 'yellow' },
                  { role: 'Faculty', perms: ['View assigned students', 'Approve/Reject requests', 'View history'], color: 'orange' },
                  { role: 'Security', perms: ['Scan QR codes', 'Record exit/entry', 'Verify passes'], color: 'red' },
                  { role: 'Admin', perms: ['Manage all users', 'View analytics', 'Audit logs'], color: 'red' },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-800 rounded-xl p-4">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                      item.color === 'yellow' ? 'bg-yellow-400/20 text-yellow-400' :
                      item.color === 'orange' ? 'bg-orange-400/20 text-orange-400' :
                      'bg-red-400/20 text-red-400'
                    }`}>
                      {item.role}
                    </div>
                    <ul className="space-y-1">
                      {item.perms.map((p, j) => (
                        <li key={j} className="text-gray-400 text-sm flex items-center space-x-2">
                          <span className="text-yellow-400">✓</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-yellow-400 to-red-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl font-black text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/80 text-xl mb-10">Join hundreds of institutions already using GatePass Pro</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/register')} className="px-10 py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-900 transition-all transform hover:-translate-y-1 shadow-xl">
              Create Free Account
            </button>
            <button onClick={() => navigate('/login')} className="px-10 py-4 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-red-600 transition-all">
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-16 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-sm">GP</span>
                </div>
                <span className="text-white font-black text-lg">GatePass <span className="text-yellow-400">Pro</span></span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">Modern digital gate pass management for educational institutions.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Security', 'Pricing', 'Changelog'] },
              { title: 'Support', links: ['Documentation', 'Help Center', 'Contact Us', 'Status'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Privacy Policy'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-white font-bold mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j} className="text-gray-500 hover:text-yellow-400 cursor-pointer transition-colors text-sm">{link}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">© 2024 GatePass Pro. All rights reserved.</p>
            <p className="text-gray-600 text-sm mt-2 md:mt-0">Built for Educational Institutions 🏫</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernLanding;