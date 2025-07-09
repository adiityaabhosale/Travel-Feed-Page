import React, { useState, useRef } from 'react';
import { X, Camera, MapPin, Calendar, Globe, Users, Heart, MessageCircle, Share2, Settings, Edit3, Upload, Check, AlertCircle } from 'lucide-react';
import { User, Post } from '../types';

interface ProfileModalProps {
  user: User;
  userPosts: Post[];
  onClose: () => void;
  onEditProfile?: (updatedUser: Partial<User>) => void;
  onFollowUser?: (userId: number) => void;
  isCurrentUser?: boolean;
  isFollowing?: boolean;
  onPostClick?: (postId: number) => void;
  onLike?: (postId: number) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  userPosts,
  onClose,
  onEditProfile,
  onFollowUser,
  isCurrentUser = false,
  isFollowing = false,
  onPostClick,
  onLike
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'stats'>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [coverImage, setCoverImage] = useState('https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=1200');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleEditSave = () => {
    if (onEditProfile) {
      onEditProfile(editedUser);
    }
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setUploadError('Image size must be less than 5MB');
        return;
      }
      
      setIsUploading(true);
      setUploadError('');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'avatar') {
          setEditedUser(prev => ({ ...prev, avatar: result }));
        } else {
          setCoverImage(result);
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = userPosts.reduce((sum, post) => sum + post.comments.length, 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with Cover Image */}
        <div className="relative h-48 sm:h-64 bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all"
            aria-label="Close profile"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Edit Cover Button */}
          {isCurrentUser && (
            <button
              onClick={() => coverInputRef.current?.click()}
              disabled={isUploading}
              className="absolute top-4 left-4 flex items-center space-x-2 px-3 py-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-all disabled:opacity-50"
              aria-label="Edit cover photo"
            >
              <Camera className="h-4 w-4" />
              <span className="text-sm hidden sm:inline">Edit Cover</span>
            </button>
          )}

          {/* Profile Picture */}
          <div className="absolute -bottom-12 left-4 sm:left-8">
            <div className="relative">
              <img
                src={editedUser.avatar}
                alt={editedUser.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white object-cover shadow-lg"
              />
              {isCurrentUser && isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all disabled:opacity-50"
                  aria-label="Change profile picture"
                >
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-16 sm:pt-20 px-4 sm:px-8 pb-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
                    className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none w-full"
                    placeholder="Your name"
                  />
                  <input
                    type="text"
                    value={editedUser.username}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, username: e.target.value }))}
                    className="text-gray-600 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                    placeholder="@username"
                  />
                  <textarea
                    value={editedUser.bio || ''}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, bio: e.target.value }))}
                    className="text-gray-700 bg-transparent border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 w-full resize-none"
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                  <input
                    type="text"
                    value={editedUser.location || ''}
                    onChange={(e) => setEditedUser(prev => ({ ...prev, location: e.target.value }))}
                    className="text-gray-600 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
                    placeholder="Your location"
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{editedUser.name}</h1>
                  <p className="text-gray-600 mb-3">{editedUser.username}</p>
                  {editedUser.bio && (
                    <p className="text-gray-700 mb-3 leading-relaxed">{editedUser.bio}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    {editedUser.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{editedUser.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {formatDate(editedUser.joinedDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Globe className="h-4 w-4" />
                      <span>{userPosts.length > 0 ? `${userPosts.length} countries visited` : 'New traveler'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {isCurrentUser ? (
                isEditing ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEditSave}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Check className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span className="hidden sm:inline">Edit Profile</span>
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                      <Settings className="h-5 w-5" />
                    </button>
                  </div>
                )
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => onFollowUser?.(user.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isFollowing
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    <span>{isFollowing ? 'Following' : 'Follow'}</span>
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                    <MessageCircle className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6 mt-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{editedUser.postsCount}</div>
              <div className="text-sm text-gray-500">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{editedUser.followersCount.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{editedUser.followingCount}</div>
              <div className="text-sm text-gray-500">Following</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalLikes.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Likes</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-4 sm:px-8">
          {[
            { id: 'posts', label: 'Posts', count: userPosts.length },
            { id: 'about', label: 'About', count: null },
            { id: 'stats', label: 'Stats', count: null }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {uploadError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-red-700 text-sm">{uploadError}</span>
            </div>
          )}

          {activeTab === 'posts' && (
            <div>
              {userPosts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-gray-600">
                    {isCurrentUser ? 'Share your first travel experience!' : `${user.name} hasn't shared any posts yet.`}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                      onClick={() => onPostClick?.(post.id)}
                    >
                      <div className="relative">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <h4 className="text-white font-semibold text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {post.title}
                          </h4>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Heart className="h-4 w-4" />
                              <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="h-4 w-4" />
                              <span>{post.comments.length}</span>
                            </div>
                          </div>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About {user.name}</h3>
                <p className="text-gray-700 leading-relaxed">
                  {user.bio || 'No bio available yet.'}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Travel Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{user.location || 'Location not specified'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Member since {formatDate(user.joinedDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <span>{userPosts.length} travel posts shared</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Recent Destinations</h4>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(userPosts.map(post => post.location))).slice(0, 6).map((location, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                    >
                      {location}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{userPosts.length}</div>
                  <div className="text-sm text-blue-600">Total Posts</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{totalLikes}</div>
                  <div className="text-sm text-red-600">Total Likes</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{totalComments}</div>
                  <div className="text-sm text-green-600">Total Comments</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Array.from(new Set(userPosts.map(post => post.location))).length}
                  </div>
                  <div className="text-sm text-purple-600">Countries</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Engagement Over Time</h4>
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="text-gray-500">
                    📊 Analytics dashboard coming soon
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Top Performing Posts</h4>
                <div className="space-y-3">
                  {userPosts
                    .sort((a, b) => b.likes - a.likes)
                    .slice(0, 3)
                    .map((post) => (
                      <div
                        key={post.id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => onPostClick?.(post.id)}
                      >
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 line-clamp-1">{post.title}</h5>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{post.likes} likes</span>
                            <span>{post.comments.length} comments</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 'avatar')}
          className="hidden"
        />
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 'cover')}
          className="hidden"
        />
      </div>
    </div>
  );
};