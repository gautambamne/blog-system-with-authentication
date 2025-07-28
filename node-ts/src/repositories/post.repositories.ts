import type { Types } from "mongoose";
import { Post } from "../models/post.model";

interface IPostCreateSchema {
    title: string;
    description: string;
    content: string;
    user: Types.ObjectId | string;
}

export const PostRepository = {

    createPost: async (postData: IPostCreateSchema, projection?: any) => {
        const post = new Post(postData);
        const newPost = await post.save();
        if (projection) {
            return await Post.findById(newPost._id, projection).populate('user', 'name username');
        }
        return await Post.findById(newPost._id).populate('user', 'name username');
    },

    findPostById: async (id: string, projection?: any) => {
        const post = await Post.findById(
            id,
            projection
        ).populate('user', 'name username');
        return post;
    },

    findPostsByUserId: async (userId: string, projection?: any, limit?: number, skip?: number) => {
        const query = Post.find(
            { user: userId },
            projection
        ).populate('user', 'name username');
        
        if (skip) query.skip(skip);
        if (limit) query.limit(limit);
        
        return await query.exec();
    },

    findAllPosts: async (projection?: any, limit?: number, skip?: number, sortBy?: any) => {
        const query = Post.find(
            {},
            projection
        ).populate('user', 'name username');
        
        if (skip) query.skip(skip);
        if (limit) query.limit(limit);
        if (sortBy) query.sort(sortBy);
        else query.sort({ createdAt: -1 }); // Default sort by newest first
        
        return await query.exec();
    },

    updatePostById: async (
        id: string,
        updateData: Partial<IPostCreateSchema>,
        projection?: any
    ) => {
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            updateData,
            { new: true, projection }
        ).populate('user', 'name username');
        return updatedPost;
    },

    deletePostById: async (id: string): Promise<Boolean> => {
        const deletedPost = await Post.findByIdAndDelete(id);
        return !!deletedPost;
    },

    deletePostsByUserId: async (userId: string): Promise<number> => {
        const result = await Post.deleteMany({ user: userId });
        return result.deletedCount || 0;
    },

    countPostsByUserId: async (userId: string): Promise<number> => {
        return await Post.countDocuments({ user: userId });
    },

    countAllPosts: async (): Promise<number> => {
        return await Post.countDocuments({});
    },

    searchPosts: async (
        searchTerm: string, 
        projection?: any, 
        limit?: number, 
        skip?: number
    ) => {
        const searchRegex = new RegExp(searchTerm, 'i');
        const query = Post.find(
            {
                $or: [
                    { title: searchRegex },
                    { description: searchRegex },
                    { content: searchRegex }
                ]
            },
            projection
        ).populate('user', 'name username');
        
        if (skip) query.skip(skip);
        if (limit) query.limit(limit);
        query.sort({ createdAt: -1 });
        
        return await query.exec();
    }

};