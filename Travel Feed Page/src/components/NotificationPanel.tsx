import React, { useState } from 'react';
import { X, Bell, Heart, MessageCircle, UserPlus, Shield, Flag, Check, CheckCheck } from 'lucide-react';
import { Notification } from '../types';

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (notificationId: number) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="h-5 w-5 text-green-500" />;
      case 'admin':
        return <Shield className="h-5 w-5 text-purple-500" />;
      case 'report':
        return <Flag className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (date: Date) => {
    if (!date || !(date instanceof Date)) return 'Unknown time';
    
    const now = new Date();
    const diffInMinutes = Math.round((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.round(diffInMinutes / 60)}h ago`;
    return `${Math.round(diffInMinutes / 1440)}d ago`;
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0 || isMarkingAllRead) return;
    
    setIsMarkingAllRead(true);
    try {
      await onMarkAllAsRead();
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  const handleMarkAsRead = (notificationId: number) => {
    onMarkAsRead(notificationId);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-4 sm:pt-16 px-2 sm:px-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] sm:max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
            aria-label="Close notifications"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-gray-100 flex-shrink-0">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            aria-label="Show all notifications"
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              filter === 'unread'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            aria-label="Show unread notifications"
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <div className="p-4 border-b border-gray-100 flex-shrink-0">
            <button
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAllRead}
              className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-50"
              aria-label="Mark all notifications as read"
            >
              {isMarkingAllRead ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span>Marking as read...</span>
                </>
              ) : (
                <>
                  <CheckCheck className="h-4 w-4" />
                  <span>Mark all as read</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
              </h3>
              <p className="text-gray-500">
                {filter === 'unread' 
                  ? 'You\'re all caught up!' 
                  : 'Notifications will appear here when you have activity.'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer group ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleMarkAsRead(notification.id);
                    }
                  }}
                  aria-label={`Notification: ${notification.message}`}
                >
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm break-words ${
                        !notification.read ? 'font-medium text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500">
                          {formatDate(notification.createdAt)}
                        </p>
                        {!notification.read && (
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 text-blue-600 hover:text-blue-700 transition-all"
                              aria-label="Mark as read"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-100 text-center flex-shrink-0">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
              View All Activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
};