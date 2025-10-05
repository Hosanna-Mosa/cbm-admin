import { useState, useEffect } from 'react';
import { blogService, Blog, CreateBlogData, UpdateBlogData } from '../services/blogService';
import BlogForm from '../components/BlogForm';

type ViewMode = 'list' | 'form' | 'view';
type FormMode = 'create' | 'edit';

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await blogService.getBlogs({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        sortBy: 'publishedAt',
        sortOrder: 'desc',
        includeUnpublished: true,
      });

      setBlogs(response.data.blogs);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, [currentPage, searchTerm]);

  // ✅ FIXED: Explicitly cast blogData as CreateBlogData for create
  const handleCreateBlog = async (
    blogData: CreateBlogData | UpdateBlogData,
    featuredImageFile?: File
  ) => {
    try {
      setFormLoading(true);
      await blogService.createBlog(blogData as CreateBlogData, featuredImageFile);
      setViewMode('list');
      await loadBlogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create blog');
    } finally {
      setFormLoading(false);
    }
  };

  // ✅ FIXED: Explicitly ensure blog ID exists and cast as UpdateBlogData
  const handleUpdateBlog = async (
    blogData: CreateBlogData | UpdateBlogData,
    featuredImageFile?: File
  ) => {
    try {
      setFormLoading(true);

      if (!selectedBlog?._id) {
        throw new Error('No blog selected for update');
      }

      console.log('Updating blog with ID:', selectedBlog._id);
      console.log('Update data:', blogData);

      await blogService.updateBlog(selectedBlog._id, blogData as UpdateBlogData, featuredImageFile);
      setViewMode('list');
      setSelectedBlog(null);
      await loadBlogs();
    } catch (err) {
      console.error('Update blog error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update blog');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      await blogService.deleteBlog(id);
      setShowDeleteConfirm(null);
      await loadBlogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete blog');
    }
  };

  const handleEditBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setFormMode('edit');
    setViewMode('form');
  };

  const handleViewBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setViewMode('view');
  };

  const handleNewBlog = () => {
    setSelectedBlog(null);
    setFormMode('create');
    setViewMode('form');
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedBlog(null);
    setError(null);
  };

  const getStatusColor = (isPublished: boolean) => {
    return isPublished ? '#10b981' : '#f59e0b';
  };

  const getStatusText = (isPublished: boolean) => {
    return isPublished ? 'Published' : 'Draft';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Show form view
  if (viewMode === 'form') {
    return (
      <BlogForm
        blog={formMode === 'edit' ? selectedBlog || undefined : undefined}
        onSave={formMode === 'create' ? handleCreateBlog : handleUpdateBlog}
        onCancel={handleCancel}
        isLoading={formLoading}
      />
    );
  }

  // Show blog detail view
  if (viewMode === 'view' && selectedBlog) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={handleCancel}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              marginBottom: '16px',
            }}
          >
            ← Back to Blogs
          </button>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: '700',
              margin: '0 0 8px 0',
            }}
          >
            {selectedBlog.title}
          </h1>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <span
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: `${getStatusColor(selectedBlog.isPublished)}20`,
                color: getStatusColor(selectedBlog.isPublished),
              }}
            >
              {getStatusText(selectedBlog.isPublished)}
            </span>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>
              {formatDate(selectedBlog.publishedAt)}
            </span>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>
              {selectedBlog.viewCount} views
            </span>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>
              {selectedBlog.readingTime} min read
            </span>
          </div>
          <p style={{ color: '#6b7280', fontSize: '16px', lineHeight: '1.6' }}>
            {selectedBlog.excerpt}
          </p>
        </div>

        {selectedBlog.featuredImage && (
          <div style={{ marginBottom: '24px' }}>
            <img
              src={selectedBlog.featuredImage}
              alt={selectedBlog.title}
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              whiteSpace: 'pre-wrap',
              lineHeight: '1.8',
              fontSize: '16px',
            }}
          >
            {selectedBlog.content}
          </div>
        </div>

        {selectedBlog.tags.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: '0 0 8px 0',
              }}
            >
              Tags
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {selectedBlog.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    fontSize: '12px',
                    borderRadius: '4px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => handleEditBlog(selectedBlog)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Edit Blog
          </button>
          <button
            onClick={() => setShowDeleteConfirm(selectedBlog._id)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Delete Blog
          </button>
        </div>
      </div>
    );
  }

  // ✅ (Rest of your table/list rendering remains identical — no changes needed)
  // 👇 Keep your blog list, pagination, and modal logic as is
  // (everything below stays the same as in your version)
  return (
    <>
      {/* ... unchanged list, table, pagination, and modal code ... */}
    </>
  );
}
