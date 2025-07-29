'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  CalendarDays,
  Eye,
  MoreVertical,
} from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { PostActions } from '@/api-actions/post-actions';
import { toast } from 'sonner';


interface IPost {
  _id: string;
  title: string;
  description: string;
  content: string | null;
  createdAt: string | Date | number;
  user: {
    name: string;
  } | null; 
}

interface PostCardProps {
  post: IPost;
  onPostDelete ?: (postId: string) => void;
}

export default function PostCard({ post, onPostDelete }: PostCardProps) {
  const formatDate = (dateString: string | Date | number) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
      return 'Just now';
    }

    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getInitials = (name: string | null) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const truncateContent = (content?: string | null, maxLength: number = 150) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };


const handleDelete = async () => {
  const confirmed = window.confirm('Are you sure you want to delete this post?');
  if (!confirmed) return;

  try {
    await PostActions.deletePost(post._id);
    toast.success('Post deleted successfully');
    onPostDelete?.(post._id);
  } catch (error: any) {
    toast.error('Failed to delete post');
    console.error(error);
  }
};

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.user?.name || 'Unknown'}`}
                alt={post.user?.name || 'Unknown Author'}
              />
              <AvatarFallback className="bg-primary/10 text-xs">
                {getInitials(post.user?.name ?? null)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                {post.user?.name || 'Unknown Author'}
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <CalendarDays className="h-3 w-3 mr-1" />
                {formatDate(post.createdAt)}
              </div>
            </div>
          </div>

          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => console.log(`Edit ${post._id}`)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardTitle className="text-lg font-bold line-clamp-2 mt-3">
          {post.title}
        </CardTitle>

        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
          {post.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 flex-1">
        <div className="text-sm text-foreground/80 line-clamp-3">
          {truncateContent(post.content, 120)}
        </div>
      </CardContent>

      <CardFooter className="pt-3 flex-shrink-0">
        <Link href={`/posts/${post._id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full h-8">
            <Eye className="h-3 w-3 mr-1" />
            Read More
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
