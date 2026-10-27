import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RichTextEditor from '../components/RichTextEditor';
import { Trash2, Edit, CheckCircle2, X, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  // --- TOAST STATE ---
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // --- EDIT MODAL STATES ---
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState('');
  const [updating, setUpdating] = useState(false);

  // --- DELETE MODAL STATES ---
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      navigate('/');
    } else {
      setUser(loggedInUser);
    }
    fetchPosts();
  }, [navigate]);

  const fetchPosts = () => {
    fetch('https://blog-comment-jade.vercel.app/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.log(err));
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // --- DELETE FUNCTIONS ---
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleActualDelete = async () => {
    try {
      const res = await fetch(`https://blog-comment-jade.vercel.app/api/posts/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(posts.filter(p => p._id !== deleteId));
        showToast('Blog deleted successfully!', 'success');
      } else {
        showToast('Delete failed', 'error');
      }
    } catch (err) {
      console.log(err);
    }
    setIsDeleteOpen(false);
    setDeleteId(null);
  };

  // --- EDIT FUNCTIONS ---
  const openEditModal = (post) => {
    setEditId(post._id);
    setEditTitle(post.title);
    setEditCategory(post.category || 'Destination');
    setEditContent(post.content);
    setEditImage(post.image || '');
    setIsEditOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await fetch(`https://blog-comment-jade.vercel.app/api/posts/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          category: editCategory,
          content: editContent,
          image: editImage
        }),
      });

      if (res.ok) {
        const updatedList = posts.map(p =>
          p._id === editId ? { ...p, title: editTitle, category: editCategory, content: editContent, image: editImage } : p
        );
        setPosts(updatedList);
        setIsEditOpen(false);
        showToast('Blog Updated Successfully!', 'success');
      } else {
        showToast('Update failed', 'error');
      }
    } catch (err) {
      console.log(err);
    }
    setUpdating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans relative">

      {/* --- TOAST NOTIFICATION --- */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border animate-in slide-in-from-top-2 ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-semibold text-sm">{toast.message}</span>
          <button onClick={() => setToast({ show: false })} className="ml-4 opacity-50 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
          <h1 className="text-2xl font-bold tracking-widest text-gray-900">Horizon</h1>
        </div>
        <div className="flex-1 py-6 px-4 space-y-1">
          <Link to="/dashboard" className="flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-xl font-medium shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Dashboard
          </Link>
          <Link to="/add-blog" className="flex items-center gap-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 px-4 py-3 rounded-xl transition font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Add New Blog
          </Link>
        </div>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full bg-red-50 text-red-600 hover:bg-red-100 px-4 py-3 rounded-xl transition font-semibold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-10 shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'Administrator'}</p>
            </div>
            <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        <div className="p-10 flex-1 overflow-y-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Total Blogs</p>
                <h3 className="text-3xl font-bold text-gray-900">{posts.length}</h3>
              </div>
              <div className="w-12 h-12 bg-gray-50 text-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Published</p>
                <h3 className="text-3xl font-bold text-gray-900">{posts.length}</h3>
              </div>
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Drafts</p>
                <h3 className="text-3xl font-bold text-gray-900">0</h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Recent Blogs</h3>
              <Link to="/add-blog" className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition">
                + Add Blog
              </Link>
            </div>

            {posts.length === 0 ? (
              <div className="p-16 text-center flex flex-col items-center">
                <h4 className="text-xl font-bold text-gray-800 mb-2">No blogs yet</h4>
                <p className="text-gray-500 mb-6">Start by creating your first blog post.</p>
                <Link to="/add-blog" className="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition">
                  Add Your First Blog
                </Link>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                    <th className="p-4 font-semibold">Title</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="p-4 font-medium text-gray-800">{post.title}</td>
                      <td className="p-4">
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                          {post.category || 'General'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 text-sm">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEditModal(post)} className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => openDeleteModal(post._id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* --- PREMIUM EDIT MODAL --- */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative my-8">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Edit Publication</h2>
                <p className="text-xs text-gray-500 mt-1">Update your article details and content.</p>
              </div>
              <button onClick={() => setIsEditOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdate} className="p-8 space-y-6">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Article Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 block w-full p-3 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 block w-full p-3 transition"
                  >
                    <option value="Destination">Destination</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Culinary">Culinary</option>
                    <option value="Tips & Hacks">Tips & Hacks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                  <input
                    type="text"
                    value={editImage}
                    onChange={e => setEditImage(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 block w-full p-3 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Article Content</label>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <RichTextEditor value={editContent} onChange={setEditContent} />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsEditOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={updating} className="px-6 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition">
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center relative">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Blog?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone. This will permanently delete the blog post.</p>

            <div className="flex gap-3">
              <button onClick={() => setIsDeleteOpen(false)} className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleActualDelete} className="w-full bg-red-500 text-white py-2.5 rounded-xl font-semibold hover:bg-red-600 transition">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;