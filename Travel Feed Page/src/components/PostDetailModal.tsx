import React, { useState, useRef, useEffect } from 'react';
import { X, Heart, MessageCircle, Share2, MapPin, Badge, Send, Loader2, AlertCircle } from 'lucide-react';
import { Post } from '../types';

interface PostDetailModalProps {
  post: Post;
  onClose: () => void;
  onLike: (postId: number) => void;
  onAddComment: (postId: number, comment: string) => void;
  isLoading?: boolean;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  onClose,
  onLike,
  onAddComment,
  isLoading = false,
}) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState('');
  const commentInputRef = useRef<HTMLInputElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-focus comment input on desktop
    if (window.innerWidth >= 768 && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when new comments are added
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [post.comments.length]);

  const handleLike = async () => {
    if (isLiking || isLoading) return;
    
    setIsLiking(true);
    try {
      await onLike(post.id);
    } catch (error) {
      setError('Failed to like post. Please try again.');
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
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
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.log('Share failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting || isLoading) return;

    setIsSubmitting(true);
    setError('');
    
    try {
      await onAddComment(post.id, commentText.trim());
      setCommentText('');
    } catch (error) {
      setError('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    if (!date || !(date instanceof Date)) return 'Unknown date';
    
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  const formatCommentDate = (date: Date) => {
    if (!date || !(date instanceof Date)) return 'Unknown date';
    
    const now = new Date();
    const diffInMinutes = Math.round((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.round(diffInMinutes / 60)}h ago`;
    return `${Math.round(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="flex-1 bg-black flex items-center justify-center relative">
          <img
            src={post.image}
            alt={post.title}
            className="max-w-full max-h-full object-contain"
            loading="lazy"
          />
          
          {/* Mobile close button */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all lg:hidden disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-96 flex flex-col max-h-[50vh] lg:max-h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <img
                src={post.user.avatar}
                alt={post.user.name}
                className="w-8 h-8 rounded-full object-cover"
                loading="lazy"
              />
              <div>
                <div className="flex items-center space-x-1">
                  <span className="font-semibold text-sm">{post.user.name}</span>
                  {post.user.verified && (
                    <Badge className="h-3 w-3 text-blue-500 fill-current" />
                  )}
                </div>
                <span className="text-xs text-gray-500">{post.user.username}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all hidden lg:block disabled:opacity-50"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Post Content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-4 space-y-3">
              <h2 className="text-lg font-bold text-gray-900">{post.title}</h2>
              
              <p className="text-gray-700 leading-relaxed">{post.description}</p>
              
              <div className="flex items-center space-x-2 text-gray-500">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-medium">{post.location}</span>
              </div>
              
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-xs text-gray-500 pt-2">
                {formatDate(post.createdAt)}
              </div>
            </div>

            {/* Comments */}
            <div className="border-t border-gray-100">
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Comments ({post.comments.length})
                </h3>
                
                {error && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                )}
                
                <div className="space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
                  {post.comments.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No comments yet</p>
                      <p className="text-gray-400 text-xs">Be the first to share your thoughts!</p>
                    </div>
                  ) : (
                    post.comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <img
                          src={comment.user.avatar}
                          alt={comment.user.name}
                          className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              {comment.user.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatCommentDate(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1 break-words">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={commentsEndRef} />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-100 p-4 space-y-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  disabled={isLiking || isLoading}
                  className={`flex items-center space-x-1 transition-all disabled:opacity-50 ${
                    post.isLiked
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-gray-500 hover:text-red-500'
                  }`}
                  aria-label={post.isLiked ? 'Unlike post' : 'Like post'}
                >
                  <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''} ${isLiking ? 'animate-pulse' : ''}`} />
                  <span className="text-sm font-medium">{post.likes.toLocaleString()}</span>
                </button>
                
                <div className="flex items-center space-x-1 text-gray-500">
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">{post.comments.length}</span>
                </div>
              </div>
              
              <button 
                onClick={handleShare}
                disabled={isSharing || isLoading}
                className="text-gray-500 hover:text-blue-500 transition-colors disabled:opacity-50"
                aria-label="Share post"
              >
                <Share2 className={`h-5 w-5 ${isSharing ? 'animate-pulse' : ''}`} />
              </button>
            </div>

            {/* Add Comment */}
            <form onSubmit={handleSubmitComment} className="flex space-x-2">
              <input
                ref={commentInputRef}
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                disabled={isSubmitting || isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50 disabled:bg-gray-50"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!commentText.trim() || isSubmitting || isLoading}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
                aria-label="Send comment"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
            
            {commentText.length > 0 && (
              <p className="text-xs text-gray-500 text-right">
                {commentText.length}/500 characters
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};