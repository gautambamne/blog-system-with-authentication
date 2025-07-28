import { Router } from "express";
import { 
    createPost, 
    getAllPosts, 
    getPostById, 
    getPostsByUserId, 
    getMyPosts, 
    updatePost, 
    deletePost, 
    searchPosts 
} from "../controllers/post.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

const PostRouter = Router();

// Public routes (no authentication required)
PostRouter.get("/posts", getAllPosts);                    // GET /posts - Get all posts with pagination
PostRouter.get("/posts/search", searchPosts);             // GET /posts/search?q=query - Search posts
PostRouter.get("/posts/:id", getPostById);                // GET /posts/:id - Get single post by ID
PostRouter.get("/posts/user/:userId", getPostsByUserId);  // GET /posts/user/:userId - Get posts by user ID

// Protected routes (authentication required)
PostRouter.post("/posts", AuthMiddleware, createPost);                    // POST /posts - Create new post
PostRouter.get("/posts/me/my-posts", AuthMiddleware, getMyPosts);         // GET /posts/me/my-posts - Get current user's posts
PostRouter.put("/posts/:id", AuthMiddleware, updatePost);                 // PUT /posts/:id - Update post by ID
PostRouter.delete("/posts/:id", AuthMiddleware, deletePost);              // DELETE /posts/:id - Delete post by ID

export default PostRouter;