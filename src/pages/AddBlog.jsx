import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RichTextEditor from '../components/RichTextEditor';

const AddBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Destination');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Image upload to backend (Cloudinary)
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('https://blog-comment-jade.vercel.app/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.imageUrl) {
        setImage(data.imageUrl);
      } else {
        setError(data.message || 'Image upload failed.');
      }
    } catch {
      setError('Failed to upload image. Please check your backend connection.');
    } finally {
      setUploading(false);
    }
  };

  // Submit Blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    if (!content.trim()) {
      setError('Content is required.');
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('https://blog-comment-jade.vercel.app/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title,
          category,
          image,
          content,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Blog posted successfully! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      } else {
        setError(data.message || 'Failed to post blog.');
      }
    } catch {
      setError('Server error. Could not post blog.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans text-gray-900 flex justify-center">
      <div className="w-full max-w-3xl">
        {/* Top Back Link */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="text-sm font-semibold text-gray-500 hover:text-black transition"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Card Form */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <h1 className="text-2xl font-bold font-serif mb-6 pb-3 border-b border-gray-100">
            Add New Blog
          </h1>

          {/* In-form Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* In-form Success Message */}
          {success && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Title Field */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              required
              className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Category Field */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black bg-white"
            >
              <option value="Destination">Destination</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Culinary">Culinary</option>
              <option value="Tips & Hacks">Tips & Hacks</option>
            </select>
          </div>

          {/* Cover Image Upload (Cloudinary) */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border border-gray-300 p-2.5 rounded-lg text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
            />
            {uploading && (
              <p className="text-xs text-blue-600 mt-2">Uploading image to Cloudinary...</p>
            )}
            {image && (
              <div className="mt-3">
                <img
                  src={image}
                  alt="Preview"
                  className="h-40 w-auto rounded-lg object-cover border border-gray-200 shadow-sm"
                />
              </div>
            )}
          </div>

          {/* Content (Rich Text Editor) */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Content
            </label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write blog content here..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || uploading}
            className="w-full bg-black text-white hover:bg-gray-800 py-3 rounded-lg font-semibold text-sm transition cursor-pointer disabled:bg-gray-400"
          >
            {submitting ? 'Publishing Post...' : 'Publish Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;