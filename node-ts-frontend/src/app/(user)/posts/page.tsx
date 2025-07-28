'use client';
import React from 'react';
import CreatePostForm from './_components/create-post-from';

export default function PostsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your posts
          </p>
        </div>
        
        <CreatePostForm />
      </div>
    </div>
  );
}
