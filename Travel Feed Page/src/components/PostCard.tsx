import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MapPin, Badge, Flag, MoreHorizontal } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onLike: (postId: number) => void;
  onComment: (postId: number) => void;
  onClick: (postId: number) => void;
  onReport?: (postId: number) => void;
  onUserClick?: (userId: number) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onLike, 
  onComment, 
  onClick, 
  onReport,
  onUserClick
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showMenu, setShowMenu] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    onLike(post.id);
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    onComment(post.id);
  };

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReport) {
      onReport(post.id);
    }
    setShowMenu(false);
  };

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUserClick) {
      onUserClick(post.user.id);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  return (
    <article className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group relative">
      {/* Menu button */}
      <div className="absolute top-2 right-2 z-10">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all"
          >
            <MoreHorizontal className="h-4 w-4 text-gray-600" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
              <button
                onClick={handleReport}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Flag className="h-4 w-4" />
                <span>Report Post</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 flex items-center space-x-3">
        <button onClick={handleUserClick} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <img
            src={post.user.avatar}
            alt={post.user.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
          />
          <div className="flex-1 text-left">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
              {post.user.verified && (
                <Badge className="h-4 w-4 text-blue-500 fill-current" />
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{post.user.username}</span>
              <span>•</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </button>
      </div>

      {/* Post Content */}
      <div onClick={() => onClick(post.id)}>
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-100">
          {!imageLoaded && (
            <div className="w-full h-80 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
          )}
          <img
            src={post.image}
            alt={post.title}
            className={`w-full h-80 object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Post Details */}
        <div className="p-4 space-y-3">
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h2>
          
          <p className="text-gray-600 line-clamp-3">{post.description}</p>
          
          <div className="flex items-center space-x-2 text-gray-500">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">{post.location}</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full font-medium hover:bg-blue-100 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-all ${
              isLiked
                ? 'text-red-500 hover:text-red-600'
                : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="font-medium">{likesCount.toLocaleString()}</span>
          </button>
          
          <button
            onClick={handleComment}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="font-medium">{post.comments.length}</span>
          </button>
        </div>
        
        <button className="text-gray-500 hover:text-blue-500 transition-colors">
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </article>
  );
};