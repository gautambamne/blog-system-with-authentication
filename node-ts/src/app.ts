import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import UserRouter from './router/auth.routes';
import PostRouter from './router/post.routes';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();
// Middlewares 

// cors middleware to allow cross-origin requests
app.use(cors({
    origin: [
        process.env.CORS_ORIGIN || 'http://localhost:3000' // Add any other allowed origins here
    ],
    credentials: true 
}));
// Parse JSON bodies
app.use(express.json({
    limit: '50kb' // Increase the limit for larger JSON payloads
}));
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'public' directory

app.use(express.static('public'));

// cookie parser middleware
app.use(cookieParser());

// controllers routes


// routes
app.use("/api/v1",(req, res , next) =>{
  console.log(req.baseUrl)
  next()
} ,UserRouter)
app.use("/api/v1" , PostRouter)

// error handling middleware
app.use(errorMiddleware);

export default app;