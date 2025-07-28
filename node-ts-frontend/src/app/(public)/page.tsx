'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import useAuthStore from "../../../store/auth-store";
import { PostActions } from '@/api-actions/post-actions';
import PostCard from '@/components/base/post/post-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, Plus } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<IPaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const { user, isAuthenticated } = useAuthStore();

  const fetchPosts = async (page: number = 1, append: boolean = false) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const response = await PostActions.getAllPosts(page, 10);
      
      if (append) {
        setPosts(prev => [...prev, ...response.posts]);
      } else {
        setPosts(response.posts);
      }
      
      setPagination(response.pagination);
      setCurrentPage(page);
      
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts', {
        description: error?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLoadMore = () => {
    if (pagination?.hasNextPage) {
      fetchPosts(currentPage + 1, true);
    }
  };

  const handleRefresh = () => {
    fetchPosts(1, false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight">Welcome to Our Blog</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Discover amazing stories and insights from our community
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-[280px] w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Welcome to Our Blog</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Discover amazing stories and insights from our community
            </p>
            {pagination && (
              <p className="text-sm text-muted-foreground mt-1">
                Showing {posts.length} of {pagination.totalPosts} posts
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            {isAuthenticated && (
              <Link href="/posts">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Load More Button */}
            {pagination?.hasNextPage && (
              <div className="flex justify-center pt-8">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="min-w-[140px]"
                >
                  {isLoadingMore ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More Posts'
                  )}
                </Button>
              </div>
            )}

            {/* Pagination Info */}
            {pagination && (
              <div className="text-center text-sm text-muted-foreground pt-6">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to share something amazing with the community!
              </p>
              {isAuthenticated && (
                <Link href="/posts">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Post
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
