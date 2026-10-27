import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import BlogDetail from './pages/BlogDetail';
import AddBlog from './pages/AddBlog';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/add-blog" element={<AddBlog />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
export default App;