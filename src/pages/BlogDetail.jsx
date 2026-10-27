import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch post by slug from backend
    fetch(`https://blog-comment-jade.vercel.app/api/posts/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found by slug directly');
        return res.json();
      })
      .then((data) => {
        if (data && (data.title || data._id)) {
          setPost(data);
        } else {
          fallbackFetch();
        }
      })
      .catch(() => {
        fallbackFetch();
      })
      .finally(() => setLoading(false));

    function fallbackFetch() {
      fetch('https://blog-comment-jade.vercel.app/api/posts')
        .then((r) => r.json())
        .then((all) => {
          if (Array.isArray(all)) {
            const match = all.find((p) => p.slug === slug || p._id === slug);
            if (match) setPost(match);
          }
        })
        .catch(() => {});
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold mb-3 font-serif">Post Not Found</h2>
        <button
          onClick={() => navigate('/')}
          className="text-sm font-semibold text-black underline"
        >
          ← Back to Journal
        </button>
      </div>
    );
  }

  const postDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-6 pt-10">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-black mb-8 inline-flex items-center gap-1.5 transition"
        >
          ← Back to Journal
        </button>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight mb-4">
          {post.title}
        </h1>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs font-medium text-gray-500 pb-6 border-b border-gray-100 mb-8">
          <span>Author: <strong className="text-gray-800">{post.author?.name || 'Admin'}</strong></span>
          <span>•</span>
          <span>{postDate || 'Recent'}</span>
          {post.category && (
            <>
              <span>•</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-semibold uppercase text-[10px]">
                {post.category}
              </span>
            </>
          )}
        </div>

        {/* Main Image */}
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-auto max-h-[500px] object-cover rounded-xl mb-10 shadow-sm"
          />
        )}

        {/* Content (HTML Render) */}
        <div
          className="magazine-content text-base sm:text-lg leading-relaxed text-gray-800 max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
};

export default BlogDetail;