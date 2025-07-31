"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { PostActions } from "@/api-actions/post-actions";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function formatDate(input?: string | Date | number): string {
  if (!input) return "Just now";
  const date = new Date(input);
  if (isNaN(date.getTime())) return "Just now";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}



function PostPageSkeleton() {
  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <Skeleton className="h-9 w-36 mb-6" />
      <Card className="overflow-hidden">
        <CardHeader className="p-6 md:p-8">
          <header>
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-full mb-6" />
            <Separator />
            <div className="flex items-center space-x-4 pt-6">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </header>
        </CardHeader>
        <CardContent className="px-6 md:px-8 pb-8 space-y-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-[80%]" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = React.use(params);
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        try {
          const data = await PostActions.getPostById(postId);
          setPost(data);
        } catch (error) {
          console.error("Error fetching post:", error);
          setPost(null);
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [postId]);

  if (loading) {
    return <PostPageSkeleton />;
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen">
        Post not found
      </div>
    );
  }

  const author = post.user;

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 size-4" />
          Back to Home
        </Link>
      </Button>
      <Card className="overflow-hidden">
        <CardHeader className="p-6 md:p-8">
          <header>
            <CardTitle className="text-3xl md:text-4xl font-extrabold mb-4">
              {post.title}
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mb-6">
              {post.description}
            </CardDescription>
            <Separator />
            <div className="flex items-center space-x-4 pt-6">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                    author?.name || "A"
                  }`}
                  alt={author?.name || "Author"}
                />
                <AvatarFallback className="text-xl">
                  {author?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">
                  {author?.name || "Unknown Author"}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="size-4" />
                  <time dateTime={String(post.createdAt)}>
                    {formatDate(post.createdAt)}
                  </time>
                </div>
              </div>
            </div>
          </header>
        </CardHeader>
        <CardContent className="px-6 md:px-8 pb-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>{post.content}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
