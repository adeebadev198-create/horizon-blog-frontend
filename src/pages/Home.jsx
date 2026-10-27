import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoginModal from '../components/LoginModal';

const CATEGORIES = ['All', 'Destination', 'Culinary', 'Lifestyle', 'Tips & Hacks'];

const Home = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch blogs from backend API
  useEffect(() => {
    fetch('https://blog-comment-jade.vercel.app/api/posts')
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setBlogs(data);
        } else {
          setBlogs([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching blogs:', err);
        setBlogs([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter blogs
  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory =
      activeCategory === 'All' ||
      (blog.category && blog.category.toLowerCase() === activeCategory.toLowerCase());

    const matchesSearch =
      !searchQuery.trim() ||
      blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#f9f9f9] text-gray-900 min-h-screen font-sans">
      {/* Navbar */}
      <Navbar
        onSignInClick={() => setIsLoginOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* Hero Section */}
      <div className="relative w-full h-[75vh] min-h-[500px] bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2073&auto=format&fit=crop"
          alt="Hiking"
          className="w-full h-full object-cover object-bottom"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

        {/* Hero Content */}
        <div className="absolute bottom-12 left-6 md:left-16 text-white max-w-2xl">
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider border border-white/20">
            Destination
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold mt-4 mb-3 tracking-tight leading-tight">
            Exploring the Wonders of Hiking
          </h1>
          <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-6 font-normal">
            An iconic landmark, this post unveils the secrets that make this destination a traveler's paradise.
          </p>

          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
              alt="Author"
              className="w-10 h-10 rounded-full object-cover border border-white/40"
            />
            <div>
              <p className="font-medium text-sm text-white">Theodore Reginald</p>
              <p className="text-xs text-gray-300">24 Jan 2024 • 10 mins read</p>
            </div>
          </div>

          {/* Slider Dots */}
          <div className="flex gap-2 mt-6">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Blog Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Blog</h2>
        <p className="text-gray-500 text-sm mb-8">
          Here, we share travel tips, destination guides, and stories that inspire your next adventure.
        </p>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-black text-white'
                  : 'bg-gray-200/70 text-gray-700 hover:bg-gray-300/80 hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Blog Grid */}
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Loading blogs...</div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-sm bg-white rounded-xl border border-gray-200 p-8">
            No blogs found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => {
              const targetSlug = blog.slug || blog._id;
              const postDate = blog.createdAt
                ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : '';

              return (
                <Link
                  to={`/blog/${targetSlug}`}
                  key={blog._id}
                  className="group block bg-white rounded-xl overflow-hidden border border-gray-200/80 hover:border-gray-300 shadow-sm hover:shadow-md transition duration-300"
                >
                  {/* Image with hover scale */}
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                      src={
                        blog.image ||
                        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop'
                      }
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-semibold text-gray-800">
                      {blog.category || 'General'}
                    </span>
                  </div>

                  {/* Text Content */}
                  <div className="p-5">
                    <h3 className="font-serif text-xl font-bold text-gray-900 group-hover:text-gray-600 transition mb-2">
                      {blog.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-400 mt-4 pt-3 border-t border-gray-100">
                      <span>By {blog.author?.name || 'Admin'}</span>
                      {postDate && <span>{postDate}</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;