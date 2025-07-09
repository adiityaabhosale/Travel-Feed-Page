import React from 'react';
import { Home, Compass, MapPin, Bookmark, Users, PlusCircle, Calendar, BarChart3, X } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isOpen, onClose }) => {
  const menuItems = [
    { id: 'feed', label: 'Home', icon: Home, description: 'Your personalized feed' },
    { id: 'explore', label: 'Explore', icon: Compass, description: 'Discover new places' },
    { id: 'trips', label: 'My Trips', icon: MapPin, description: 'Your travel posts' },
    { id: 'saved', label: 'Saved Posts', icon: Bookmark, description: 'Bookmarked content' },
    { id: 'groups', label: 'Travel Groups', icon: Users, description: 'Connect with travelers' },
    { id: 'bookings', label: 'Bookings', icon: Calendar, description: 'Manage your trips' },
  ];

  const handleItemClick = (itemId: string) => {
    onViewChange(itemId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-14 sm:top-16 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto z-30">
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all group ${
                      currentView === item.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    aria-label={`${item.label} - ${item.description}`}
                  >
                    <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                      currentView === item.id ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                    <div className="flex-1 text-left">
                      <span className="font-medium text-sm">{item.label}</span>
                      <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
            <button
              onClick={() => handleItemClick('create')}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <PlusCircle className="h-5 w-5" />
              <span className="font-medium">Create Post</span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <p>© 2024 Global Voyage</p>
              <div className="flex space-x-3">
                <button className="hover:text-gray-700 transition-colors">Privacy</button>
                <button className="hover:text-gray-700 transition-colors">Terms</button>
                <button className="hover:text-gray-700 transition-colors">Help</button>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed left-0 top-14 sm:top-16 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-80 bg-white border-r border-gray-200 overflow-y-auto z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-4 rounded-lg transition-all ${
                      currentView === item.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`h-6 w-6 ${
                      currentView === item.id ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                    <div className="flex-1 text-left">
                      <span className="font-medium">{item.label}</span>
                      <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => handleItemClick('create')}
              className="w-full flex items-center space-x-3 px-4 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
            >
              <PlusCircle className="h-6 w-6" />
              <span className="font-medium">Create New Post</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};