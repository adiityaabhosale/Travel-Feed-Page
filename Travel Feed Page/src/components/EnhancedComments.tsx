import React, { useState } from 'react';
import { Heart, Reply, MoreHorizontal, Flag } from 'lucide-react';
import { Comment, User } from '../types';

interface EnhancedCommentsProps {
  comments: Comment[];
  currentUser: User;
  onAddComment: (text: string, parentId?: number) => void;
  onLikeComment: (commentId: number) => void;
}

export const EnhancedComments: React.FC<EnhancedCommentsProps> = ({
  comments,
  currentUser,
  onAddComment,
  onLikeComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState<Set<number>>(new Set());

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const handleSubmitReply = (e: React.FormEvent, parentId: number) => {
    e.preventDefault();
    if (replyText.trim()) {
      onAddComment(replyText.trim(), parentId);
      setReplyText('');
      setReplyingTo(null);
    }
  };

  const formatCommentDate = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.round((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.round(diffInMinutes / 60)}h`;
    return `${Math.round(diffInMinutes / 1440)}d`;
  };

  const toggleReplies = (commentId: number) => {
    const newShowReplies = new Set(showReplies);
    if (newShowReplies.has(commentId)) {
      newShowReplies.delete(commentId);
    } else {
      newShowReplies.add(commentId);
    }
    setShowReplies(newShowReplies);
  };

  return (
    <div className="space-y-4">
      {/* Comment Input */}
      <form onSubmit={handleSubmitComment} className="flex space-x-3">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <span className="text-lg">😊</span>
              </button>
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-3">
            {/* Main Comment */}
            <div className="flex space-x-3">
              <img
                src={comment.user.avatar}
                alt={comment.user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="bg-gray-50 rounded-2xl px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-gray-900">{comment.user.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{formatCommentDate(comment.createdAt)}</span>
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full">
                        <MoreHorizontal className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
                
                {/* Comment Actions */}
                <div className="flex items-center space-x-4 mt-2 ml-4">
                  <button
                    onClick={() => onLikeComment(comment.id)}
                    className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Heart className="h-3 w-3" />
                    <span>{comment.likes}</span>
                  </button>
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <Reply className="h-3 w-3" />
                    <span>Reply</span>
                  </button>
                  <button className="text-xs text-gray-500 hover:text-orange-500 transition-colors">
                    <Flag className="h-3 w-3" />
                  </button>
                </div>

                {/* Reply Input */}
                {replyingTo === comment.id && (
                  <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mt-3 ml-4">
                    <div className="flex space-x-2">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Reply to ${comment.user.name}...`}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-full focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={!replyText.trim()}
                        className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Reply
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Comments */}
      {comments.length > 5 && (
        <button className="w-full py-3 text-blue-600 hover:text-blue-700 font-medium text-sm border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
          Load More Comments
        </button>
      )}
    </div>
  );
};