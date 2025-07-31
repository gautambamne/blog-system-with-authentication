"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { PostActions } from "@/api-actions/post-actions";
import { ArrowLeft, CalendarDays } from "lucide-react";

interface IPost {
  title: string;
  description: string;
  content: string;
  createdAt: string | Date;
  user: {
    name?: string;
  };
}

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
    <div className="container mx-auto max-w-4xl py-10 px-4">
      <Skeleton className="mb-6 h-9 w-36" />
      <Card className="overflow-hidden">
        <CardHeader className="p-6 md:p-8">
          <header>
            <Skeleton className="mb-4 h-10 w-3/4" />
            <Skeleton className="mb-6 h-6 w-full" />
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
        <CardContent className="space-y-4 px-6 pb-8 md:px-8">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-[80%]" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function PostPage({ params }: { params: { postId: string } }) {
  const { postId } = params;
  const router = useRouter();

  const [post, setPost] = useState<IPost | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", content: "" });
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const data = await PostActions.getPostById(postId);
        setPost(data);
        setFormData({
          title: data.title,
          description: data.description,
          content: data.content,
        });
      } catch (error) {
        console.error("Error fetching post:", error);
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setIsDirty(true);
  };

  const handleUpdatePost = async () => {
    if (!isDirty || isUpdating) return;

    setIsUpdating(true);
    try {
      await PostActions.updatePost(postId, formData);
      router.push("/");
    } catch (error) {
      console.error("Failed to update post:", error);
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <PostPageSkeleton />;
  }

  if (!post) {
    return (
      <div className="flex h-screen items-center justify-center">
        Post not found
      </div>
    );
  }

  const author = post.user;

  return (
    <div className="container mx-auto max-w-4xl py-10 px-4">
      <div className="mb-6 flex items-center justify-between">
        <Button asChild variant="ghost">
          <Link href="/">
            <ArrowLeft className="mr-2 size-4" />
            Back to Home
          </Link>
        </Button>
        <Button onClick={handleUpdatePost} disabled={!isDirty || isUpdating}>
          {isUpdating ? "Updating..." : "Update Post"}
        </Button>
      </div>
      <Card className="overflow-hidden">
        <CardHeader className="p-6 md:p-8">
          <header>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Post Title"
              className="h-auto border-x-0 border-t-0 border-b-2 border-dashed border-muted bg-transparent px-1 pb-2 text-3xl font-extrabold tracking-tight focus-visible:border-solid focus-visible:border-primary focus-visible:ring-0 md:text-4xl"
            />
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Post Description"
              className="mt-4 resize-none border-x-0 border-t-0 border-b border-dashed border-muted bg-transparent px-1 pb-2 text-lg text-muted-foreground focus-visible:border-solid focus-visible:border-primary focus-visible:ring-0"
            />
            <Separator className="my-8" />
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${author?.name || "A"}`}
                  alt={author?.name || "Author"}
                />
                <AvatarFallback className="text-xl">
                  {author?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold">
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
        <CardContent className="px-6 pb-8 md:px-8">
          <Textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your post content here..."
            className="prose prose-lg h-50 max-w-none resize-none rounded-md border bg-transparent p-4 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/40 dark:prose-invert"
          />
        </CardContent>
      </Card>
    </div>
  );
}