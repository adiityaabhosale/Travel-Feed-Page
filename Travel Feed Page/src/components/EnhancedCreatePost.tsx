import React, { useState, useRef } from 'react';
import { X, Upload, MapPin, Hash, Camera, Image, Globe, Users, Loader2, AlertCircle } from 'lucide-react';
import { Post } from '../types';

interface EnhancedCreatePostProps {
  onClose: () => void;
  onSubmit: (post: Omit<Post, 'id' | 'user' | 'createdAt' | 'isLiked'>) => void;
  isLoading?: boolean;
}

export const EnhancedCreatePost: React.FC<EnhancedCreatePostProps> = ({ onClose, onSubmit, isLoading = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState('public');
  const [category, setCategory] = useState('adventure');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 10MB' }));
        return;
      }
      
      setErrors(prev => ({ ...prev, image: '' }));
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setImage(result);
      };
      reader.readAsDataURL(file);
    } else {
      setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (!location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting || isLoading) return;

    setIsSubmitting(true);

    try {
      const newPost = {
        title: title.trim() || 'Travel Experience',
        description: description.trim(),
        location: location.trim(),
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        image: image || 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800',
        likes: 0,
        comments: [],
      };

      await onSubmit(newPost);
      
      // Reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setTags('');
      setImage('');
      setImagePreview(null);
      setErrors({});
      
    } catch (error) {
      console.error('Error creating post:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to create post. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const postingTips = [
    { icon: '📸', text: 'Use high-quality photos', detail: 'Clear, well-lit images get more engagement' },
    { icon: '📍', text: 'Add location details', detail: 'Help others discover amazing places' },
    { icon: '#️⃣', text: 'Include relevant hashtags', detail: 'Use 3-5 tags for better discoverability' },
    { icon: '✍️', text: 'Be descriptive', detail: 'Share your experience and emotions' }
  ];

  const recentActivity = [
    {
      user: 'Sarah Chen',
      action: 'posted a new travel story',
      time: '2 hours ago',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=50'
    },
    {
      user: 'Mike Wilson',
      action: 'shared a photo from Bali',
      time: '4 hours ago',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=50'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Create New Post</h2>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting || isLoading}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all disabled:opacity-50"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Error Display */}
              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <span className="text-red-700 text-sm">{errors.submit}</span>
                </div>
              )}

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Photo
                </label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-blue-400 bg-blue-50' 
                      : errors.image
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 sm:h-64 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImage('');
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        disabled={isSubmitting || isLoading}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Camera className="h-12 sm:h-16 w-12 sm:w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4 text-sm sm:text-lg">Drag photos here or click to upload</p>
                      <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          disabled={isSubmitting || isLoading}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors font-medium text-sm sm:text-base"
                        >
                          <Image className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                          Select from Gallery
                        </label>
                        <button
                          type="button"
                          disabled={isSubmitting || isLoading}
                          className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium disabled:opacity-50 text-sm sm:text-base"
                        >
                          <Camera className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                          Take Photo
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {errors.image && (
                  <p className="mt-2 text-sm text-red-600">{errors.image}</p>
                )}
              </div>

              {/* Title (Optional) */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting || isLoading}
                  placeholder="Give your post a title..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:bg-gray-50"
                  maxLength={100}
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">{title.length}/100 characters</p>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Share your travel story *
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isSubmitting || isLoading}
                    placeholder="Share your travel story..."
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm sm:text-lg disabled:opacity-50 disabled:bg-gray-50 ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">{description.length} characters</p>
                </div>

                {/* Location */}
                <div className="relative">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      disabled={isSubmitting || isLoading}
                      placeholder="Add location"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:bg-gray-50 ${
                        errors.location ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                    />
                  </div>
                  {errors.location && (
                    <p className="mt-2 text-sm text-red-600">{errors.location}</p>
                  )}
                </div>

                {/* Tags */}
                <div className="relative">
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      disabled={isSubmitting || isLoading}
                      placeholder="Add tags (e.g., travel, adventure, beach)"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:bg-gray-50"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Separate tags with commas</p>
                </div>

                {/* Privacy and Category */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Privacy
                    </label>
                    <select
                      value={privacy}
                      onChange={(e) => setPrivacy(e.target.value)}
                      disabled={isSubmitting || isLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:bg-gray-50"
                      aria-label="Privacy setting"
                    >
                      <option value="public">🌍 Public</option>
                      <option value="friends">👥 Friends Only</option>
                      <option value="private">🔒 Private</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      disabled={isSubmitting || isLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:bg-gray-50"
                      aria-label="Post category"
                    >
                      <option value="adventure">🏔️ Adventure</option>
                      <option value="culture">🏛️ Culture</option>
                      <option value="food">🍜 Food</option>
                      <option value="nature">🌿 Nature</option>
                      <option value="photography">📸 Photography</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-4 space-y-3 sm:space-y-0">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting || isLoading}
                  className="w-full sm:w-auto px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                  <button
                    type="button"
                    disabled={isSubmitting || isLoading}
                    className="w-full sm:w-auto px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    disabled={!description.trim() || !location.trim() || isSubmitting || isLoading}
                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center space-x-2"
                  >
                    {isSubmitting || isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Posting...</span>
                      </>
                    ) : (
                      <span>Post</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:block w-80 bg-gray-50 border-l border-gray-200 p-6 space-y-6 overflow-y-auto">
          {/* Posting Tips */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Posting Tips</h3>
            <div className="space-y-3">
              {postingTips.map((tip, index) => (
                <div key={index} className="p-3 bg-white rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-start space-x-3">
                    <span className="text-xl flex-shrink-0">{tip.icon}</span>
                    <div>
                      <span className="text-sm font-medium text-gray-700 block">{tip.text}</span>
                      <span className="text-xs text-gray-500">{tip.detail}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg hover:shadow-sm transition-shadow">
                  <img
                    src={activity.avatar}
                    alt={activity.user}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};