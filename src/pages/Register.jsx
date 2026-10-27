import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('https://blog-comment-jade.vercel.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'admin' }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Admin account created successfully! Redirecting to home...');
        setTimeout(() => {
          navigate('/');
        }, 1800);
      } else {
        setError(data.message || 'Registration failed. Please check your credentials or use another email.');
      }
    } catch {
      setError('Network or server error. Please ensure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] relative overflow-hidden px-4 py-12">
      {/* Subtle Ambient Decorative Gradient Blurs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-stone-300/40 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-stone-400/25 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      {/* Main Centered Card with Subtle Glass Effect */}
      <div className="bg-white/90 backdrop-blur-md p-8 sm:p-11 rounded-3xl shadow-xl shadow-stone-200/50 w-full max-w-md relative z-10 border border-stone-200/80">
        {/* Editorial Brand Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-block font-serif text-2xl font-bold tracking-[0.2em] uppercase text-stone-900 mb-2 hover:opacity-80 transition"
          >
            Horizon
          </Link>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight">
            Create Admin Account
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-1.5 font-normal">
            Join the editorial team to author and manage journal entries.
          </p>
        </div>

        {/* Styled Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2.5 animate-in fade-in">
            <svg className="w-4 h-4 shrink-0 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Styled Success Alert */}
        {success && (
          <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2.5 animate-in fade-in">
            <svg className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="leading-relaxed">{success}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Adeeba Khan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition bg-stone-50/50 hover:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@horizon.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition bg-stone-50/50 hover:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full px-4 py-3 pr-10 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition bg-stone-50/50 hover:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-medium"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-black text-white hover:bg-stone-800 py-3.5 px-6 rounded-xl font-medium text-sm tracking-wide transition shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Registering Account...</span>
              </>
            ) : (
              'Create Admin Account'
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-500">
            Already registered?{' '}
            <Link to="/" className="text-black font-semibold hover:underline decoration-1 underline-offset-4">
              Return to Journal & Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;