export interface User {
  id: number;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  bio?: string;
  location?: string;
  joinedDate: Date;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

export interface Post {
  id: number;
  user: User;
  title: string;
  description: string;
  image: string;
  location: string;
  tags: string[];
  likes: number;
  comments: Comment[];
  createdAt: Date;
  isLiked: boolean;
  isReported?: boolean;
  reportCount?: number;
}

export interface Comment {
  id: number;
  user: User;
  text: string;
  createdAt: Date;
  likes: number;
  isReported?: boolean;
}

export interface Notification {
  id: number;
  type: 'like' | 'comment' | 'follow' | 'admin' | 'report';
  message: string;
  createdAt: Date;
  read: boolean;
  postId?: number;
  userId?: number;
}

export type ViewMode = 'feed' | 'create' | 'detail' | 'search' | 'notifications' | 'explore' | 'trips' | 'saved' | 'groups' | 'bookings' | 'reports' | 'profile';