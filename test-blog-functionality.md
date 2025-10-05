# Blog Functionality Test Guide

## Overview
This guide helps you test the complete blog functionality in the admin panel.

## Prerequisites
1. Backend server running on `http://localhost:5000`
2. Admin panel running on `http://localhost:3000` (or your configured port)
3. Database connected and accessible

## Test Steps

### 1. Access the Admin Panel
- Navigate to the admin panel
- Go to the "Blogs" section
- You should see the blog management interface

### 2. Test Blog Creation
1. Click "New Blog Post" button
2. Fill in the form:
   - **Title**: "Test Blog Post"
   - **Excerpt**: "This is a test blog post"
   - **Content**: "This is the full content of the test blog post..."
   - **Featured Image URL**: "https://via.placeholder.com/600x300"
   - **Tags**: Add tags like "test", "demo", "blog"
   - **Meta Description**: "Test meta description"
   - **Reading Time**: 5
   - **Published**: Check this box
   - **Featured**: Optional
3. Click "Create Blog Post"
4. Verify the blog appears in the list

### 3. Test Blog Viewing
1. Click "View" button on any blog post
2. Verify the blog detail view shows:
   - Title, excerpt, content
   - Featured image
   - Tags
   - Status, views, reading time
   - Published date
3. Click "Back to Blogs" to return to list

### 4. Test Blog Editing
1. Click "Edit" button on any blog post
2. Modify some fields (title, content, tags, etc.)
3. Click "Update Blog Post"
4. Verify changes are reflected in the list

### 5. Test Search and Filtering
1. Use the search box to search for blog titles
2. Use the status filter to show only published/draft posts
3. Verify filtering works correctly

### 6. Test Blog Deletion
1. Click "Delete" button on any blog post
2. Confirm deletion in the modal
3. Verify the blog is removed from the list

### 7. Test Pagination
1. Create multiple blog posts (if not already present)
2. Verify pagination controls appear when there are more than 10 posts
3. Test navigation between pages

## Expected Behavior

### Blog List View
- Shows all blog posts in a table format
- Displays title, excerpt, tags, status, views, published date
- Has search and filter functionality
- Shows stats cards (published, drafts, total views, total posts)
- Has pagination for large datasets

### Blog Form
- Auto-generates slug from title
- Validates required fields
- Supports adding/removing tags
- Supports adding/removing additional images
- Has proper error handling

### Blog Detail View
- Shows full blog content
- Displays all metadata
- Has edit and delete actions
- Responsive design

### Error Handling
- Shows error messages for failed operations
- Validates form inputs
- Handles network errors gracefully

## API Endpoints Used
- `GET /api/blogs` - List blogs
- `POST /api/blogs` - Create blog
- `GET /api/blogs/:id` - Get single blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog

## Troubleshooting

### Common Issues
1. **CORS errors**: Ensure backend has proper CORS configuration
2. **API connection**: Check if backend is running and accessible
3. **Database errors**: Verify database connection and schema
4. **Image loading**: Ensure image URLs are valid and accessible

### Debug Steps
1. Check browser console for errors
2. Check network tab for failed requests
3. Verify API responses in network tab
4. Check backend logs for server errors

## Success Criteria
- ✅ Can create new blog posts
- ✅ Can view blog post details
- ✅ Can edit existing blog posts
- ✅ Can delete blog posts
- ✅ Search and filtering work
- ✅ Pagination works
- ✅ Error handling works
- ✅ Form validation works
- ✅ UI is responsive and user-friendly













