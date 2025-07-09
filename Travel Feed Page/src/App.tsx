import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TrendingSidebar } from './components/TrendingSidebar';
import { SearchFilters } from './components/SearchFilters';
import { EnhancedPostCard } from './components/EnhancedPostCard';
import { EnhancedCreatePost } from './components/EnhancedCreatePost';
import { PostDetailModal } from './components/PostDetailModal';
import { NotificationPanel } from './components/NotificationPanel';
import { ProfileModal } from './components/ProfileModal';
import { mockPosts, mockUsers, mockNotifications } from './data/mockData';
import { Post, ViewMode, Notification, User } from './types';

function App() {
  // Helper function to convert date strings back to Date objects
  const reviveDates = (data: any): any => {
    if (data === null || data === undefined) return data;
    
    if (typeof data === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(data)) {
      return new Date(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(reviveDates);
    }
    
    if (typeof data === 'object') {
      const result: any = {};
      for (const key in data) {
        if (key === 'createdAt' || key === 'joinedDate') {
          result[key] = new Date(data[key]);
        } else {
          result[key] = reviveDates(data[key]);
        }
      }
      return result;
    }
    
    return data;
  };

  // Load data from localStorage or use mock data
  const [posts, setPosts] = useState<Post[]>(() => {
    const savedPosts = localStorage.getItem('travelPosts');
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts);
      return reviveDates(parsedPosts);
    }
    return mockPosts;
  });
  
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('travelUsers');
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers);
      return reviveDates(parsedUsers);
    }
    return mockUsers;
  });
  
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const savedNotifications = localStorage.getItem('travelNotifications');
    if (savedNotifications) {
      const parsedNotifications = JSON.parse(savedNotifications);
      return reviveDates(parsedNotifications);
    }
    return mockNotifications;
  });
  
  const [savedPostIds, setSavedPostIds] = useState<Set<number>>(() => {
    const savedIds = localStorage.getItem('savedPostIds');
    return savedIds ? new Set(JSON.parse(savedIds)) : new Set();
  });

  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);
  const [currentView, setCurrentView] = useState<ViewMode>('feed');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [exploreLoading, setExploreLoading] = useState(false);
  
  // Current user (for demo purposes, using the first user)
  const currentUser = users[0];

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('travelPosts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('travelUsers', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('travelNotifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('savedPostIds', JSON.stringify(Array.from(savedPostIds)));
  }, [savedPostIds]);

  useEffect(() => {
    let postsToFilter = posts;
    
    // Filter based on current view
    if (currentView === 'trips') {
      postsToFilter = posts.filter(post => post.user.id === currentUser.id);
    } else if (currentView === 'saved') {
      postsToFilter = posts.filter(post => savedPostIds.has(post.id));
    }
    
    // Apply search filter
    if (searchQuery.trim() === '') {
      setFilteredPosts(postsToFilter);
    } else {
      const filtered = postsToFilter.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts, currentView, savedPostIds, currentUser.id]);

  const handleCreatePost = () => {
    setCurrentView('create');
    setSidebarOpen(false);
    setRightSidebarOpen(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleShowNotifications = () => {
    setCurrentView('notifications');
    setSidebarOpen(false);
    setRightSidebarOpen(false);
  };

  const handleShowProfile = () => {
    setCurrentView('profile');
    setSidebarOpen(false);
    setRightSidebarOpen(false);
  };

  const handleUserClick = (userId: number) => {
    const clickedUser = users.find(u => u.id === userId);
    if (clickedUser) {
      setSelectedUser(clickedUser);
      setCurrentView('profile');
      setSidebarOpen(false);
      setRightSidebarOpen(false);
    }
  };

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleViewChange = (view: string) => {
    setCurrentView(view as ViewMode);
    setSearchQuery(''); // Clear search when changing views
    setSidebarOpen(false);
    setRightSidebarOpen(false);
  };

  const handleLike = async (postId: number) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );

    // Add notification for like
    const post = posts.find(p => p.id === postId);
    if (post && !post.isLiked) {
      const newNotification: Notification = {
        id: Math.max(...notifications.map(n => n.id)) + 1,
        type: 'like',
        message: `${currentUser.name} liked your post "${post.title}"`,
        createdAt: new Date(),
        read: false,
        postId: postId,
        userId: currentUser.id,
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
    
    setIsLoading(false);
  };

  const handleComment = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setCurrentView('detail');
      setSidebarOpen(false);
      setRightSidebarOpen(false);
    }
  };

  const handlePostClick = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setCurrentView('detail');
      setSidebarOpen(false);
      setRightSidebarOpen(false);
    }
  };

  const handleReport = async (postId: number) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isReported: true,
              reportCount: (post.reportCount || 0) + 1
            }
          : post
      )
    );
    
    setIsLoading(false);
  };

  const handleSave = async (postId: number) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setSavedPostIds(prev => {
      const newSavedIds = new Set(prev);
      if (newSavedIds.has(postId)) {
        newSavedIds.delete(postId);
      } else {
        newSavedIds.add(postId);
      }
      return newSavedIds;
    });
    
    setIsLoading(false);
  };

  const handleAddPost = async (newPost: Omit<Post, 'id' | 'user' | 'createdAt' | 'isLiked'>) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const post: Post = {
      ...newPost,
      id: Math.max(...posts.map(p => p.id)) + 1,
      user: currentUser,
      createdAt: new Date(),
      isLiked: false,
    };
    setPosts(prevPosts => [post, ...prevPosts]);
    
    // Update user's post count
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === currentUser.id
          ? { ...user, postsCount: user.postsCount + 1 }
          : user
      )
    );
    
    setCurrentView('feed');
    setIsLoading(false);
  };

  const handleAddComment = async (postId: number, commentText: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: Math.max(...post.comments.map(c => c.id), 0) + 1,
                  user: currentUser,
                  text: commentText,
                  createdAt: new Date(),
                  likes: 0,
                }
              ]
            }
          : post
      )
    );
    
    // Add notification for comment
    const post = posts.find(p => p.id === postId);
    if (post) {
      const newNotification: Notification = {
        id: Math.max(...notifications.map(n => n.id)) + 1,
        type: 'comment',
        message: `${currentUser.name} commented on your post "${post.title}"`,
        createdAt: new Date(),
        read: false,
        postId: postId,
        userId: currentUser.id,
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
    
    // Update selected post if it's currently being viewed
    if (selectedPost && selectedPost.id === postId) {
      const updatedPost = posts.find(p => p.id === postId);
      if (updatedPost) {
        setSelectedPost(updatedPost);
      }
    }
    
    setIsLoading(false);
  };

  const handleEditProfile = (updatedUser: Partial<User>) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === currentUser.id ? { ...user, ...updatedUser } : user
      )
    );
  };

  const handleFollowUser = (userId: number) => {
    // Implement follow functionality
    console.log('Following user:', userId);
  };

  const handleMarkNotificationAsRead = (notificationId: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleCloseModal = () => {
    setCurrentView('feed');
    setSelectedPost(null);
    setSelectedUser(null);
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setRightSidebarOpen(false);
  };

  const handleToggleRightSidebar = () => {
    setRightSidebarOpen(!rightSidebarOpen);
    setSidebarOpen(false);
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const getViewTitle = () => {
    switch (currentView) {
      case 'trips':
        return 'My Trips';
      case 'saved':
        return 'Saved Posts';
      case 'explore':
        return 'Explore';
      case 'bookings':
        return 'My Bookings';
      case 'reports':
        return 'Analytics';
      case 'groups':
        return 'Travel Groups';
      default:
        return 'Travel Feed';
    }
  };

  const getEmptyStateContent = () => {
    if (currentView === 'trips') {
      return {
        icon: '✈️',
        title: 'No trips shared yet',
        description: 'Start sharing your amazing travel experiences!',
        actionText: 'Share Your First Trip',
        action: handleCreatePost
      };
    } else if (currentView === 'saved') {
      return {
        icon: '🔖',
        title: 'No saved posts yet',
        description: 'Save posts you love by clicking the bookmark icon',
        actionText: 'Explore Posts',
        action: () => setCurrentView('explore')
      };
    } else if (currentView === 'bookings') {
      return {
        icon: '📅',
        title: 'No bookings yet',
        description: 'Book your next adventure and track your trips here',
        actionText: 'Explore Destinations',
        action: () => setCurrentView('explore')
      };
    } else if (currentView === 'groups') {
      return {
        icon: '👥',
        title: 'No travel groups joined',
        description: 'Connect with fellow travelers and join exciting groups',
        actionText: 'Find Groups',
        action: () => setCurrentView('explore')
      };
    } else if (currentView === 'reports') {
      return {
        icon: '📊',
        title: 'No analytics data',
        description: 'Start posting to see your travel analytics and insights',
        actionText: 'Create Your First Post',
        action: handleCreatePost
      };
    } else {
      return {
        icon: '✈️',
        title: 'No travel stories yet',
        description: 'Be the first to share your amazing travel experience!',
        actionText: 'Share Your Journey',
        action: handleCreatePost
      };
    }
  };

  const renderMainContent = () => {
    if (currentView === 'explore') {
      const handleExploreFilterChange = async (filters: any) => {
        setExploreLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let filtered = posts;
        
        // Apply search filter
        if (filters.search && filters.search.trim()) {
          const searchTerm = filters.search.toLowerCase();
          filtered = filtered.filter(post =>
            post.title.toLowerCase().includes(searchTerm) ||
            post.description.toLowerCase().includes(searchTerm) ||
            post.location.toLowerCase().includes(searchTerm) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
          );
        }
        
        // Apply destination filter
        if (filters.destinations && filters.destinations !== 'All Destinations') {
          filtered = filtered.filter(post => 
            post.location.toLowerCase().includes(filters.destinations.toLowerCase())
          );
        }
        
        // Apply category filter
        if (filters.categories && filters.categories !== 'All Categories') {
          filtered = filtered.filter(post =>
            post.tags.some(tag => tag.toLowerCase().includes(filters.categories.toLowerCase()))
          );
        }
        
        setFilteredPosts(filtered);
        setExploreLoading(false);
      };
      
      return (
        <div className="space-y-4 sm:space-y-6">
          <SearchFilters onFilterChange={handleExploreFilterChange} isLoading={exploreLoading} />
          
          {/* View Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Explore</h2>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                <option>Most Recent</option>
                <option>Most Popular</option>
                <option>Trending</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewLayout('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewLayout === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="Grid view"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewLayout('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewLayout === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="List view"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Posts Grid/List */}
          {exploreLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">Filtering posts...</span>
              </div>
            </div>
          ) : (
            <div className={
              viewLayout === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6' 
                : 'space-y-4 sm:space-y-6'
            }>
              {filteredPosts.map((post) => (
                <EnhancedPostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onClick={handlePostClick}
                  onReport={handleReport}
                  onUserClick={handleUserClick}
                  onSave={handleSave}
                  layout={viewLayout}
                  isSaved={savedPostIds.has(post.id)}
                  isLoading={isLoading}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    // Default view (feed, trips, saved, etc.)
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{getViewTitle()}</h2>
          {(currentView === 'trips' || currentView === 'saved') && (
            <div className="text-sm text-gray-500">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
            </div>
          )}
        </div>

        {searchQuery && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">
              Showing results for "<span className="font-semibold">{searchQuery}</span>"
              {filteredPosts.length === 0 && " - No posts found"}
            </p>
            {filteredPosts.length > 0 && (
              <p className="text-blue-600 text-sm mt-1">
                Found {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

        {filteredPosts.length === 0 && searchQuery ? (
          <div className="text-center py-12">
            <div className="w-16 sm:w-24 h-16 sm:h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl sm:text-4xl">🔍</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600 mb-4 px-4">
              Try adjusting your search terms or browse all posts
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Clear search
            </button>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 sm:w-24 h-16 sm:h-24 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-2xl sm:text-4xl text-white">{getEmptyStateContent().icon}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{getEmptyStateContent().title}</h3>
            <p className="text-gray-600 mb-4 px-4">{getEmptyStateContent().description}</p>
            <button
              onClick={getEmptyStateContent().action}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg font-medium"
            >
              {getEmptyStateContent().actionText}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredPosts.map((post) => (
              <EnhancedPostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onClick={handlePostClick}
                onReport={handleReport}
                onUserClick={handleUserClick}
                onSave={handleSave}
                isSaved={savedPostIds.has(post.id)}
                isLoading={isLoading}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onCreatePost={handleCreatePost}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onShowNotifications={handleShowNotifications}
        onShowProfile={handleShowProfile}
        notificationCount={unreadNotificationCount}
        currentView={currentView}
        onViewChange={handleViewChange}
        onToggleSidebar={handleToggleSidebar}
        onToggleRightSidebar={handleToggleRightSidebar}
        isLoading={isLoading}
      />

      <div className="flex relative">
        {/* Sidebar */}
        <Sidebar 
          currentView={currentView} 
          onViewChange={handleViewChange}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-64'
        } ${
          rightSidebarOpen ? 'lg:mr-80' : 'lg:mr-80'
        } px-4 sm:px-6 py-4 sm:py-8`}>
          {renderMainContent()}
        </main>

        {/* Right Sidebar */}
        <TrendingSidebar 
          onUserClick={handleUserClick}
          onDestinationClick={(destination) => {
            setSearchQuery(destination);
            setCurrentView('explore');
          }}
          isOpen={rightSidebarOpen}
          onClose={() => setRightSidebarOpen(false)}
        />
      </div>

      {/* Overlay for mobile sidebars */}
      {(sidebarOpen || rightSidebarOpen) && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => {
            setSidebarOpen(false);
            setRightSidebarOpen(false);
          }}
        />
      )}

      {/* Modals */}
      {currentView === 'create' && (
        <EnhancedCreatePost
          onClose={handleCloseModal}
          onSubmit={handleAddPost}
          isLoading={isLoading}
        />
      )}

      {currentView === 'detail' && selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={handleCloseModal}
          onLike={handleLike}
          onAddComment={handleAddComment}
          isLoading={isLoading}
        />
      )}

      {currentView === 'notifications' && (
        <NotificationPanel
          notifications={notifications}
          onClose={handleCloseModal}
          onMarkAsRead={handleMarkNotificationAsRead}
          onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        />
      )}

      {currentView === 'profile' && (
        <ProfileModal
          user={selectedUser || currentUser}
          userPosts={posts.filter(post => post.user.id === (selectedUser?.id || currentUser.id))}
          onClose={handleCloseModal}
          onEditProfile={handleEditProfile}
          onFollowUser={handleFollowUser}
          isCurrentUser={!selectedUser || selectedUser.id === currentUser.id}
          isFollowing={false}
          onPostClick={handlePostClick}
          onLike={handleLike}
        />
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-700 font-medium">Loading...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;