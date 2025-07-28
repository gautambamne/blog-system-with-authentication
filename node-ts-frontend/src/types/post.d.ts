interface IPost {
  _id: string;
  title: string;
  description: string;
  content: string;
  user: IUser;
  createdAt: string;
  updatedAt: string;
}

interface ICreatePostData {
  title: string;
  description: string;
  content: string;
}

interface IUpdatePostData {
  title?: string;
  description?: string;
  content?: string;
}

interface IPaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface IPostsResponse {
  posts: IPost[];
  pagination: IPaginationInfo;
}

interface IMyPostsResponse {
  posts: IPost[];
  pagination: IPaginationInfo;
}

interface ISearchPostsResponse {
  posts: IPost[];
  searchQuery: string;
  pagination: {
    currentPage: number;
    limit: number;
    resultsCount: number;
  };
}