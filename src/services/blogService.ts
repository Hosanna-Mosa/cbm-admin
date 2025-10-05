const API_BASE_URL = 'http://localhost:8000/api';

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  tags: string[];
  featuredImage: string;
  images: Array<{
    url: string;
    alt?: string;
    caption?: string;
    order: number;
  }>;
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  metaDescription?: string;
  readingTime?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogData {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  featuredImage: string;
  images?: Array<{
    url: string;
    alt?: string;
    caption?: string;
    order?: number;
  }>;
  isPublished?: boolean;
  isFeatured?: boolean;
  metaDescription?: string;
  slug?: string;
}

export interface UpdateBlogData extends Partial<CreateBlogData> {
  // No _id required here since it's passed separately to updateBlog function
}

export interface BlogListResponse {
  success: boolean;
  data: {
    blogs: Blog[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface BlogResponse {
  success: boolean;
  data: Blog;
  message?: string;
}

class BlogService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}/blogs${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Blog service error:', error);
      throw error;
    }
  }

  // Get all blogs with pagination and filtering
  async getBlogs(params: {
    page?: number;
    limit?: number;
    featured?: boolean;
    tag?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    includeUnpublished?: boolean;
  } = {}): Promise<BlogListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.featured !== undefined) searchParams.append('featured', params.featured.toString());
    if (params.tag) searchParams.append('tag', params.tag);
    if (params.search) searchParams.append('search', params.search);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
    if (params.includeUnpublished) searchParams.append('includeUnpublished', 'true');

    const queryString = searchParams.toString();
    return this.request<BlogListResponse>(`?${queryString}`);
  }

  // Get single blog by ID
  async getBlogById(id: string): Promise<BlogResponse> {
    return this.request<BlogResponse>(`/${id}`);
  }

  // Get featured blogs
  async getFeaturedBlogs(limit: number = 5): Promise<BlogResponse> {
    return this.request<BlogResponse>(`/featured?limit=${limit}`);
  }

  // Get blogs by tag
  async getBlogsByTag(tag: string, page: number = 1, limit: number = 10): Promise<BlogListResponse> {
    return this.request<BlogListResponse>(`/tag/${encodeURIComponent(tag)}?page=${page}&limit=${limit}`);
  }

  // Search blogs
  async searchBlogs(query: string, page: number = 1, limit: number = 10): Promise<BlogListResponse> {
    return this.request<BlogListResponse>(`/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  }

  // Get all tags
  async getAllTags(): Promise<{ success: boolean; data: string[] }> {
    return this.request<{ success: boolean; data: string[] }>('/tags');
  }

  // Create new blog
  async createBlog(blogData: CreateBlogData, featuredImageFile?: File): Promise<BlogResponse> {
    if (featuredImageFile) {
      const formData = new FormData();
      Object.entries(blogData).forEach(([key, value]) => {
        if (key === 'images' && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (key === 'tags' && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      });
      formData.append('featuredImageFile', featuredImageFile);
      
      return this.request<BlogResponse>('', {
        method: 'POST',
        body: formData,
        headers: {} // Remove Content-Type header to let browser set it with boundary
      });
    } else {
      return this.request<BlogResponse>('', {
        method: 'POST',
        body: JSON.stringify(blogData),
      });
    }
  }

  // Update blog
  async updateBlog(id: string, blogData: Partial<CreateBlogData>, featuredImageFile?: File): Promise<BlogResponse> {
    if (featuredImageFile) {
      const formData = new FormData();
      Object.entries(blogData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'images' && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (key === 'tags' && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value as string);
          }
        }
      });
      formData.append('featuredImageFile', featuredImageFile);
      
      return this.request<BlogResponse>(`/${id}`, {
        method: 'PUT',
        body: formData,
        headers: {} // Remove Content-Type header to let browser set it with boundary
      });
    } else {
      return this.request<BlogResponse>(`/${id}`, {
        method: 'PUT',
        body: JSON.stringify(blogData),
      });
    }
  }

  // Delete blog
  async deleteBlog(id: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/${id}`, {
      method: 'DELETE',
    });
  }

  // Get all blogs for admin (including unpublished)
  async getAllBlogsForAdmin(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'all' | 'published' | 'draft';
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<BlogListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.status && params.status !== 'all') {
      searchParams.append('isPublished', params.status === 'published' ? 'true' : 'false');
    }
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const queryString = searchParams.toString();
    return this.request<BlogListResponse>(`/admin?${queryString}`);
  }
}

export const blogService = new BlogService();


