import type { Request, Response } from 'express';
import { PostRepository } from '../repositories/post.repositories';
import asyncHandler from '../utils/async-handler';
import ApiError from '../advices/ApiError';
import ApiResponse from '../advices/ApiResponse';

// Create a new post
export const createPost = asyncHandler(async (req: Request, res: Response) => {
    const { title, description, content } = req.body;
    const userId = req.user._id;

    if (!title || !description || !content) {
        throw new ApiError(400, 'Title, description, and content are required');
    }

    const post = await PostRepository.createPost({
        title,
        description,
        content,
        user: userId
    });

    if (!post) {
        throw new ApiError(500, 'Failed to create post');
    }

    res.status(201).json(
        new ApiResponse(post)
    );
});

// Get all posts with pagination
export const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await PostRepository.findAllPosts(
        undefined, // projection
        limit,
        skip
    );

    const totalPosts = await PostRepository.countAllPosts();
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json(
        new ApiResponse({
            posts,
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        })
    );
});

// Get post by ID
export const getPostById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, 'Post ID is required');
    }

    const post = await PostRepository.findPostById(id);

    if (!post) {
        throw new ApiError(404, 'Post not found');
    }

    res.status(200).json(
        new ApiResponse(post)
    );
});

// Get posts by user ID
export const getPostsByUserId = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    
    if (!userId) {
        throw new ApiError(400, 'User ID is required');
    }
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await PostRepository.findPostsByUserId(
        userId,
        undefined, // projection
        limit,
        skip
    );

    const totalPosts = await PostRepository.countPostsByUserId(userId);
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json(
        new ApiResponse({
            posts,
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        })
    );
});

// Get current user's posts
export const getMyPosts = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const posts = await PostRepository.findPostsByUserId(
        userId,
        undefined, // projection
        limit,
        skip
    );

    const totalPosts = await PostRepository.countPostsByUserId(userId);
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json(
        new ApiResponse({
            posts,
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        })
    );
});

// Update post by ID
export const updatePost = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, content } = req.body;
    const userId = req.user._id;

    if (!id) {
        throw new ApiError(400, 'Post ID is required');
    }

    // Check if post exists
    const existingPost = await PostRepository.findPostById(id);
    if (!existingPost) {
        throw new ApiError(404, 'Post not found');
    }

    // Check if user owns the post
    if (existingPost.user._id.toString() !== userId.toString()) {
        throw new ApiError(403, 'You can only update your own posts');
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (content) updateData.content = content;

    if (Object.keys(updateData).length === 0) {
        throw new ApiError(400, 'At least one field (title, description, content) is required for update');
    }

    const updatedPost = await PostRepository.updatePostById(id, updateData);

    if (!updatedPost) {
        throw new ApiError(500, 'Failed to update post');
    }

    res.status(200).json(
        new ApiResponse(updatedPost)
    );
});

// Delete post by ID
export const deletePost = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user._id;

    if (!id) {
        throw new ApiError(400, 'Post ID is required');
    }

    // Check if post exists
    const existingPost = await PostRepository.findPostById(id);
    if (!existingPost) {
        throw new ApiError(404, 'Post not found');
    }

    // Check if user owns the post
    if (existingPost.user._id.toString() !== userId.toString()) {
        throw new ApiError(403, 'You can only delete your own posts');
    }

    const deleted = await PostRepository.deletePostById(id);

    if (!deleted) {
        throw new ApiError(500, 'Failed to delete post');
    }

    res.status(200).json(
        new ApiResponse(null)
    );
});

// Search posts
export const searchPosts = asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!q || typeof q !== 'string') {
        throw new ApiError(400, 'Search query is required');
    }

    const posts = await PostRepository.searchPosts(
        q,
        undefined, // projection
        limit,
        skip
    );

    res.status(200).json(
        new ApiResponse({
            posts,
            searchQuery: q,
            pagination: {
                currentPage: page,
                limit,
                resultsCount: posts.length
            }
        })
    );
});