import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MapPin, Badge, Flag, MoreHorizontal, Bookmark, ExternalLink } from 'lucide-react';
import { Post } from '../types';

interface EnhancedPostCardProps {
  post: Post;
  onLike: (postId: number) => void;
  onComment: (postId: number) => void;
  onClick: (postId: number) => void;
  onReport?: (postId: number) => void;
  onUserClick?: (userId: number) => void;
  onSave?: (postId: number) => void;
  layout?: 'grid' | 'list';
  isSaved?: boolean;
  isLoading?: boolean;
}

export const EnhancedPostCard: React.FC<EnhancedPostCardProps> = ({ 
  post, 
  onLike, 
  onComment, 
  onClick, 
  onReport,
  onUserClick,
  onSave,
  layout = 'grid',
  isSaved = false,
  isLoading = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showMenu, setShowMenu] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking || isLoading) return;
    
    setIsLiking(true);
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    
    try {
      await onLike(post.id);
    } catch (error) {
      // Revert on error
      setIsLiked(isLiked);
      setLikesCount(likesCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaving || isLoading || !onSave) return;
    
    setIsSaving(true);
    try {
      await onSave(post.id);
    } finally {
      setIsSaving(false);
    }
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;
    onComment(post.id);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSharing) return;
    
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        // Show toast notification
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.log('Share failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReport && !isLoading) {
      onReport(post.id);
    }
    setShowMenu(false);
  };

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUserClick && !isLoading) {
      onUserClick(post.user.id);
    }
  };

  const formatDate = (date: Date) => {
    if (!date || !(date instanceof Date)) return 'Unknown date';
    
    const now = new Date();
    const diffInHours = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.round(diffInHours / 24)}d ago`;
  };

  if (layout === 'list') {
    return (
      <article className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="w-full sm:w-1/3 relative overflow-hidden bg-gray-100">
            {!imageLoaded && (
              <div className="w-full h-48 sm:h-48 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
            )}
            <img
              src={post.image}
              alt={post.title}
              className={`w-full h-48 sm:h-48 object-cover transition-all duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
            
            {/* Mobile overlay buttons */}
            <div className="absolute top-2 right-2 flex space-x-2 sm:hidden">
              <button
                onClick={handleSave}
                disabled={isSaving || isLoading}
                className={`p-2 backdrop-blur-sm rounded-full transition-all disabled:opacity-50 ${
                  isSaved ? 'bg-yellow-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white'
                }`}
                aria-label={isSaved ? 'Remove from saved' : 'Save post'}
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  disabled={isLoading}
                  className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all disabled:opacity-50"
                  aria-label="More options"
                >
                  <MoreHorizontal className="h-4 w-4 text-gray-600" />
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <button
                      onClick={handleReport}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors"
                    >
                      <Flag className="h-4 w-4" />
                      <span>Report Post</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-6">
            {/* User Info */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <button 
                onClick={handleUserClick} 
                disabled={isLoading}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity disabled:opacity-50"
                aria-label={`View ${post.user.name}'s profile`}
              >
                <img
                  src={post.user.avatar}
                  alt={post.user.name}
                  className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover ring-2 ring-gray-100"
                  loading="lazy"
                />
                <div className="text-left">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{post.user.name}</h3>
                    {post.user.verified && (
                      <Badge className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 fill-current" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                    <span>{post.user.username}</span>
                    <span>•</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </button>

              {/* Desktop menu */}
              <div className="relative hidden sm:block">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  disabled={isLoading}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all disabled:opacity-50"
                  aria-label="More options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <button
                      onClick={handleReport}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors"
                    >
                      <Flag className="h-4 w-4" />
                      <span>Report Post</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Post Details */}
            <div onClick={() => onClick(post.id)} className="space-y-2 sm:space-y-3 cursor-pointer">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {post.title}
              </h2>
              
              <p className="text-gray-600 line-clamp-2 sm:line-clamp-3 text-sm sm:text-base">{post.description}</p>
              
              <div className="flex items-center space-x-2 text-gray-500">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium truncate">{post.location}</span>
              </div>
              
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-600 text-xs sm:text-sm rounded-full font-medium hover:bg-blue-100 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 text-xs sm:text-sm rounded-full">
                    +{post.tags.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4 pt-3 sm:pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4 sm:space-x-6">
                <button
                  onClick={handleLike}
                  disabled={isLiking || isLoading}
                  className={`flex items-center space-x-1 sm:space-x-2 transition-all disabled:opacity-50 ${
                    isLiked
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-gray-500 hover:text-red-500'
                  }`}
                  aria-label={isLiked ? 'Unlike post' : 'Like post'}
                >
                  <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isLiked ? 'fill-current' : ''} ${isLiking ? 'animate-pulse' : ''}`} />
                  <span className="font-medium text-sm sm:text-base">{likesCount.toLocaleString()}</span>
                </button>
                
                <button
                  onClick={handleComment}
                  disabled={isLoading}
                  className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-blue-500 transition-colors disabled:opacity-50"
                  aria-label="Comment on post"
                >
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="font-medium text-sm sm:text-base">{post.comments.length}</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving || isLoading}
                  className={`p-2 rounded-full transition-all disabled:opacity-50 hidden sm:block ${
                    isSaved ? 'text-yellow-500 bg-yellow-50' : 'text-gray-500 hover:text-yellow-500 hover:bg-yellow-50'
                  }`}
                  aria-label={isSaved ? 'Remove from saved' : 'Save post'}
                >
                  <Bookmark className={`h-4 w-4 sm:h-5 sm:w-5 ${isSaved ? 'fill-current' : ''} ${isSaving ? 'animate-pulse' : ''}`} />
                </button>
                <button 
                  onClick={handleShare}
                  disabled={isSharing || isLoading}
                  className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all disabled:opacity-50"
                  aria-label="Share post"
                >
                  <Share2 className={`h-4 w-4 sm:h-5 sm:w-5 ${isSharing ? 'animate-pulse' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Click outside to close menu */}
        {showMenu && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
        )}
      </article>
    );
  }

  // Grid layout
  return (
    <article className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group relative h-full flex flex-col">
      {/* Menu button */}
      <div className="absolute top-2 right-2 z-10">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            disabled={isLoading}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all disabled:opacity-50"
            aria-label="More options"
          >
            <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
              <button
                onClick={handleReport}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors"
              >
                <Flag className="h-4 w-4" />
                <span>Report Post</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(post.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>View Details</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Save button */}
      <div className="absolute top-2 left-2 z-10">
        <button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className={`p-2 backdrop-blur-sm rounded-full transition-all disabled:opacity-50 ${
            isSaved ? 'bg-yellow-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white'
          }`}
          aria-label={isSaved ? 'Remove from saved' : 'Save post'}
        >
          <Bookmark className={`h-3 w-3 sm:h-4 sm:w-4 ${isSaved ? 'fill-current' : ''} ${isSaving ? 'animate-pulse' : ''}`} />
        </button>
      </div>

      {/* User Info */}
      <div className="p-3 sm:p-4 flex items-center space-x-3 flex-shrink-0">
        <button 
          onClick={handleUserClick} 
          disabled={isLoading}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity disabled:opacity-50"
          aria-label={`View ${post.user.name}'s profile`}
        >
          <img
            src={post.user.avatar}
            alt={post.user.name}
            className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover ring-2 ring-gray-100"
            loading="lazy"
          />
          <div className="flex-1 text-left">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{post.user.name}</h3>
              {post.user.verified && (
                <Badge className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 fill-current" />
              )}
            </div>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
              <span>{post.user.username}</span>
              <span>•</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </button>
      </div>

      {/* Post Content */}
      <div onClick={() => onClick(post.id)} className="flex-1 flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-100 flex-shrink-0">
          {!imageLoaded && (
            <div className="w-full h-48 sm:h-56 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
          )}
          <img
            src={post.image}
            alt={post.title}
            className={`w-full h-48 sm:h-56 object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Post Details */}
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1 flex flex-col">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
            {post.title}
          </h2>
          
          <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed flex-1">{post.description}</p>
          
          <div className="flex items-center space-x-2 text-gray-500 mt-auto">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium truncate">{post.location}</span>
          </div>
          
          <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
            {post.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-600 text-xs sm:text-sm rounded-full font-medium hover:bg-blue-100 transition-colors"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 2 && (
              <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 text-xs sm:text-sm rounded-full">
                +{post.tags.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4 flex items-center justify-between border-t border-gray-100 pt-3 flex-shrink-0">
        <div className="flex items-center space-x-4 sm:space-x-6">
          <button
            onClick={handleLike}
            disabled={isLiking || isLoading}
            className={`flex items-center space-x-1 sm:space-x-2 transition-all disabled:opacity-50 ${
              isLiked
                ? 'text-red-500 hover:text-red-600'
                : 'text-gray-500 hover:text-red-500'
            }`}
            aria-label={isLiked ? 'Unlike post' : 'Like post'}
          >
            <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isLiked ? 'fill-current' : ''} ${isLiking ? 'animate-pulse' : ''}`} />
            <span className="font-medium text-sm sm:text-base">{likesCount.toLocaleString()}</span>
          </button>
          
          <button
            onClick={handleComment}
            disabled={isLoading}
            className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-blue-500 transition-colors disabled:opacity-50"
            aria-label="Comment on post"
          >
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-medium text-sm sm:text-base">{post.comments.length}</span>
          </button>
        </div>
        
        <button 
          onClick={handleShare}
          disabled={isSharing || isLoading}
          className="text-gray-500 hover:text-blue-500 transition-colors disabled:opacity-50"
          aria-label="Share post"
        >
          <Share2 className={`h-4 w-4 sm:h-5 sm:w-5 ${isSharing ? 'animate-pulse' : ''}`} />
        </button>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowMenu(false)}
        />
      )}
    </article>
  );
};