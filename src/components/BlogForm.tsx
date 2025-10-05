import React, { useState, useEffect } from 'react';
import { Blog, CreateBlogData, UpdateBlogData } from '../services/blogService';

interface BlogFormProps {
  blog?: Blog;
  onSave: (blogData: CreateBlogData | UpdateBlogData, featuredImageFile?: File) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function BlogForm({ blog, onSave, onCancel, isLoading = false }: BlogFormProps) {
  const [formData, setFormData] = useState<CreateBlogData>({
    title: '',
    excerpt: '',
    content: '',
    tags: [],
    featuredImage: '',
    images: [],
    isPublished: true,
    isFeatured: false,
    metaDescription: '',
    slug: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [imageInput, setImageInput] = useState({ url: '', alt: '', caption: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string>('');

  useEffect(() => {
    if (blog) {
      const initialFormData: CreateBlogData = {
        title: blog.title || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        tags: blog.tags || [],
        featuredImage: blog.featuredImage || '',
        images: blog.images || [],
        isPublished: blog.isPublished ?? true,
        isFeatured: blog.isFeatured ?? false,
        metaDescription: blog.metaDescription || '',
        slug: blog.slug || ''
      };
      setFormData(initialFormData);
      setFeaturedImagePreview(blog.featuredImage || '');
      setFeaturedImageFile(null);
    } else {
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        tags: [],
        featuredImage: '',
        images: [],
        isPublished: true,
        isFeatured: false,
        metaDescription: '',
        slug: ''
      });
      setFeaturedImagePreview('');
      setFeaturedImageFile(null);
    }
    setErrors({});
  }, [blog]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (name === 'title' && (!blog || !formData.slug?.trim())) {
        setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
      }
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags ?? []), tagInput.trim().toLowerCase()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags ?? []).filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddImage = () => {
    if (imageInput.url.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images ?? []), {
          url: imageInput.url.trim(),
          alt: imageInput.alt.trim(),
          caption: imageInput.caption.trim(),
          order: (prev.images?.length ?? 0)
        }]
      }));
      setImageInput({ url: '', alt: '', caption: '' });
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images ?? []).filter((_, i) => i !== index)
    }));
  };

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFeaturedImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setFeaturedImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFeaturedImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';

    const hasNewFile = !!featuredImageFile;
    const hasImageUrl = !!formData.featuredImage?.trim();
    const hasExistingImage = !!(blog && blog.featuredImage);

    if (!hasNewFile && !hasImageUrl && !hasExistingImage) {
      newErrors.featuredImage = 'Featured image is required';
    }

    if (!formData.slug?.trim()) newErrors.slug = 'Slug is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const isValid = validateForm();
    if (!isValid) {
      alert('Please fix the form errors before submitting');
      return;
    }

    try {
      const submitData = {
        ...formData,
        featuredImage: featuredImageFile ? '' : formData.featuredImage
      };

      await onSave(submitData, featuredImageFile ?? undefined);
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Error saving blog: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600 }}>
          {blog ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>
        <p style={{ color: '#6b7280' }}>
          {blog ? 'Update your blog post details' : 'Fill in the details to create a new blog post'}
        </p>
      </div>

      {Object.keys(errors).length > 0 && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600 }}>
            Please fix the following errors:
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {Object.entries(errors).map(([field, error]) => (
              <li key={field} style={{ fontSize: '12px', marginBottom: '4px' }}>
                {field.charAt(0).toUpperCase() + field.slice(1)}: {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        {/* Your input fields remain exactly the same as before */}
        {/* ... full form content unchanged ... */}
      </form>
    </div>
  );
}
