import React, { useState } from 'react';
import { Search, Plus, User, Bell, Menu, Home, Compass, Calendar, BarChart3, X, Globe } from 'lucide-react';

interface HeaderProps {
  onCreatePost: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onShowNotifications: () => void;
  onShowProfile: () => void;
  notificationCount: number;
  currentView: string;
  onViewChange: (view: string) => void;
  onToggleSidebar: () => void;
  onToggleRightSidebar: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onCreatePost, 
  onSearch, 
  searchQuery, 
  onShowNotifications,
  onShowProfile,
  notificationCount,
  currentView,
  onViewChange,
  onToggleSidebar,
  onToggleRightSidebar,
  isLoading
}) => {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const navItems = [
    { id: 'feed', label: 'Home', icon: Home },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GV</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 hidden sm:block">
              Global Voyage
            </h1>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden xl:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  disabled={isLoading}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all disabled:opacity-50 ${
                    currentView === item.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  aria-label={item.label}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-xs sm:max-w-md lg:max-w-lg mx-4">
            <div className={`relative transition-all ${searchFocused ? 'scale-105' : ''}`}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                aria-label="Search destinations and experiences"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearch('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full"
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Create Post Button */}
            <button
              onClick={onCreatePost}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 sm:px-4 py-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
              aria-label="Create new post"
            >
              <Plus className="h-4 w-4" />
              <span className="font-medium hidden sm:inline text-sm">Share</span>
            </button>
            
            {/* Notifications */}
            <button 
              onClick={onShowNotifications}
              disabled={isLoading}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all disabled:opacity-50"
              aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount} unread)` : ''}`}
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
            
            {/* Profile Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                disabled={isLoading}
                className="flex items-center space-x-2 p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all disabled:opacity-50"
                aria-label="Profile menu"
              >
                <User className="h-5 w-5" />
                <span className="hidden lg:inline text-sm font-medium">Profile</span>
                <svg className="h-4 w-4 hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => {
                      onShowProfile();
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>View Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      onViewChange('trips');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Trips
                  </button>
                  <button
                    onClick={() => {
                      onViewChange('saved');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Saved Posts
                  </button>
                  <hr className="my-1" />
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="hidden xl:flex items-center space-x-2 relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                disabled={isLoading}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
                aria-label="Language selector"
              >
                <Globe className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">EN</span>
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showLanguageMenu && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setShowLanguageMenu(false);
                        // Handle language change
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Sidebar Toggle - Mobile */}
            <button
              onClick={onToggleRightSidebar}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all lg:hidden"
              aria-label="Toggle trending sidebar"
            >
              <BarChart3 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Click outside to close menus */}
      {(showProfileMenu || showLanguageMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowProfileMenu(false);
            setShowLanguageMenu(false);
          }}
        />
      )}
    </header>
  );
};