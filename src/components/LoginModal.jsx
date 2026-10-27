import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://blog-comment-jade.vercel.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and user details to localStorage
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        onClose();
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid email or password. Please try again.');
      }
    } catch {
      setError('Unable to reach the server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 md:p-10 relative border border-stone-200 transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors p-1.5 rounded-full hover:bg-gray-100"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="text-center mb-8">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-400 block mb-2">
            Horizon Journal
          </span>
          <h2 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Sign in to access your administrative editorial dashboard.
          </p>
        </div>

        {/* Inline Error Message */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-50/90 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2.5">
            <svg className="w-4 h-4 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="editor@horizon.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition bg-gray-50/50 hover:bg-white"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                Password
              </label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition bg-gray-50/50 hover:bg-white"
            />
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
                <span>Signing In...</span>
              </>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>

        {/* Footer Note */}
        <p className="mt-8 text-center text-xs text-gray-500">
          Need an account?{' '}
          <Link
            to="/register"
            onClick={onClose}
            className="text-black font-semibold hover:underline decoration-1 underline-offset-4"
          >
            Register as Admin
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;