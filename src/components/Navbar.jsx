import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onSignInClick, searchQuery, onSearchChange }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="absolute top-0 left-0 w-full z-40 flex items-center justify-between px-6 md:px-12 py-6 text-white bg-gradient-to-b from-black/70 to-transparent">
      {/* Logo & Links */}
      <div className="flex items-center gap-10">
        <Link to="/" className="text-2xl font-bold tracking-wider font-serif">
          Horizon
        </Link>
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-200">
          <Link to="/" className="hover:text-white transition">All</Link>
          <a href="#destination" className="hover:text-white transition">Destination</a>
          <a href="#culinary" className="hover:text-white transition">Culinary</a>
          <a href="#lifestyle" className="hover:text-white transition">Lifestyle</a>
          <a href="#tips" className="hover:text-white transition">Tips & Hacks</a>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4 text-sm">
        {/* Search */}
        <div className="hidden sm:flex items-center bg-white/20 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/20">
          <input
            type="text"
            value={searchQuery || ''}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search blogs..."
            className="bg-transparent text-xs text-white placeholder-gray-300 focus:outline-none w-32 md:w-44"
          />
          <svg className="w-3.5 h-3.5 text-gray-200 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {token ? (
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-xs bg-white/20 hover:bg-white/30 text-white px-3.5 py-1.5 rounded-md font-medium transition"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-300 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span
              onClick={onSignInClick}
              className="cursor-pointer hover:text-gray-200 transition font-medium text-xs md:text-sm"
            >
              Log In
            </span>
            <Link
              to="/register"
              className="bg-white text-black px-4 py-1.5 rounded-md text-xs md:text-sm font-semibold hover:bg-gray-100 transition shadow-sm"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;