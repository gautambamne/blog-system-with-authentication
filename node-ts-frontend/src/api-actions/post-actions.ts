import axiosInstance from "@/lib/axios-interceptor";
import { ApiError } from "next/dist/server/api-utils";

export const PostActions = {
    // Protected routes (authentication required)
    createPost: async (data: ICreatePostData): Promise<IPost> => {
        try {
            const response = await axiosInstance.post<ApiResponse<IPost>>('/posts', data);
            if (response.data.data) {
                return response.data.data;
            } else {
                throw response.data.apiError;
            }
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw error;
        }
    },

    updatePost: async (postId: string, data: IUpdatePostData): Promise<IPost> => {
        try {
            const response = await axiosInstance.put<ApiResponse<IPost>>(`/posts/${postId}`, data);
            if (response.data.data) {
                return response.data.data;
            } else {
                throw response.data.apiError;
            }
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw error;
        }
    },

    getMyPosts: async (page: number = 1, limit: number = 10): Promise<IMyPostsResponse> => {
        try {
            const response = await axiosInstance.get<ApiResponse<IMyPostsResponse>>(
                `/posts/me/my-posts?page=${page}&limit=${limit}`
            );
            if (response.data.data) {
                return response.data.data;
            } else {
                throw response.data.apiError;
            }
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw error;
        }
    },

    deletePost: async (postId: string): Promise<{ message: string }> => {
        try {
            const response = await axiosInstance.delete<ApiResponse<null>>(`/posts/${postId}`);
            if (response.data.data !== undefined) {
                return { message: "Post deleted successfully" };
            } else {
                throw response.data.apiError;
            }
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw error;
        }
    },

    // Non-authenticated public routes
    getAllPosts: async (page: number = 1, limit: number = 10): Promise<IPostsResponse> => {
        try {
            const response = await axiosInstance.get<ApiResponse<IPostsResponse>>(
                `/posts?page=${page}&limit=${limit}`
            );
            if (response.data.data) {
                return response.data.data;
            } else {
                throw response.data.apiError;
            }
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw error;
        }
    },

    searchPosts: async (query: string, page: number = 1, limit: number = 10): Promise<ISearchPostsResponse> => {
        try {
            const response = await axiosInstance.get<ApiResponse<ISearchPostsResponse>>(
                `/posts/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
            );
            if (response.data.data) {
                return response.data.data;
            } else {
                throw response.data.apiError;
            }
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw error;
        }
    },

    getPostById: async (postId: string): Promise<IPost> => {
        try {
            const response = await axiosInstance.get<ApiResponse<IPost>>(`/posts/${postId}`);
            if (response.data.data) {
                return response.data.data;
            } else {
                throw response.data.apiError;
            }
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw error;
        }
    },

    getPostsByUserId: async (userId: string, page: number = 1, limit: number = 10): Promise<IPostsResponse> => {
        try {
            const response = await axiosInstance.get<ApiResponse<IPostsResponse>>(
                `/posts/user/${userId}?page=${page}&limit=${limit}`
            );
            if (response.data.data) {
                return response.data.data;
            } else {
                throw response.data.apiError;
            }
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw error;
        }
    }
}