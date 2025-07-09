import React, { useState } from 'react';
import { TrendingUp, Users, MapPin, X, ExternalLink } from 'lucide-react';

interface TrendingDestination {
  id: number;
  name: string;
  country: string;
  image: string;
  travelers: string;
  growth: string;
}

interface SuggestedTraveler {
  id: number;
  name: string;
  region: string;
  avatar: string;
  followers: string;
  isFollowing: boolean;
}

interface TrendingSidebarProps {
  onUserClick?: (userId: number) => void;
  onDestinationClick?: (destination: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const TrendingSidebar: React.FC<TrendingSidebarProps> = ({ onUserClick, onDestinationClick, isOpen, onClose }) => {
  const trendingDestinations: TrendingDestination[] = [
    {
      id: 1,
      name: 'Santorini',
      country: 'Greece',
      image: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=150',
      travelers: '1.2k travelers',
      growth: '+15%'
    },
    {
      id: 2,
      name: 'Bali',
      country: 'Indonesia',
      image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=150',
      travelers: '2.1k travelers',
      growth: '+23%'
    },
    {
      id: 3,
      name: 'Tokyo',
      country: 'Japan',
      image: 'https://images.pexels.com/photos/2341290/pexels-photo-2341290.jpeg?auto=compress&cs=tinysrgb&w=150',
      travelers: '1.8k travelers',
      growth: '+8%'
    },
    {
      id: 4,
      name: 'Iceland',
      country: 'Reykjavik',
      image: 'https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=150',
      travelers: '956 travelers',
      growth: '+31%'
    }
  ];

  const suggestedTravelers: SuggestedTraveler[] = [
    {
      id: 5,
      name: 'travel_lisa',
      region: 'Europe Explorer',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      followers: '12.5k',
      isFollowing: false
    },
    {
      id: 6,
      name: 'mike_adventures',
      region: 'Asia Specialist',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      followers: '8.9k',
      isFollowing: false
    },
    {
      id: 7,
      name: 'wanderlust_sam',
      region: 'Americas Guide',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
      followers: '15.2k',
      isFollowing: true
    }
  ];

  const [followStates, setFollowStates] = useState<{[key: number]: boolean}>(
    suggestedTravelers.reduce((acc, traveler) => {
      acc[traveler.id] = traveler.isFollowing;
      return acc;
    }, {} as {[key: number]: boolean})
  );

  const handleUserClick = (userId: number) => {
    if (onUserClick) {
      onUserClick(userId);
    }
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleFollowToggle = (userId: number) => {
    setFollowStates(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleDestinationClick = (destination: TrendingDestination) => {
    if (onDestinationClick) {
      onDestinationClick(destination.name);
    }
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed right-0 top-14 sm:top-16 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-80 bg-white border-l border-gray-200 overflow-y-auto z-30">
        <div className="p-6 space-y-6">
          {/* Trending Destinations */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <h3 className="font-semibold text-gray-900">Trending Destinations</h3>
              </div>
              <button 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                aria-label="View all trending destinations"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {trendingDestinations.map((destination) => (
                <button
                  key={destination.id}
                  onClick={() => handleDestinationClick(destination)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all group"
                  aria-label={`View ${destination.name}, ${destination.country}`}
                >
                  <div className="relative">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {destination.growth}
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {destination.name}
                    </h4>
                    <p className="text-sm text-gray-500">{destination.country}</p>
                    <p className="text-xs text-gray-400">{destination.travelers}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Suggested Travelers */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-gray-900">Suggested Travelers</h3>
              </div>
              <button 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                aria-label="View all suggested travelers"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {suggestedTravelers.map((traveler) => (
                <div key={traveler.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                  <button
                    onClick={() => handleUserClick(traveler.id)}
                    className="flex items-center space-x-3 flex-1"
                    aria-label={`View ${traveler.name}'s profile`}
                  >
                    <img
                      src={traveler.avatar}
                      alt={traveler.name}
                      className="w-10 h-10 rounded-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {traveler.name}
                      </h4>
                      <p className="text-sm text-gray-500">{traveler.region}</p>
                      <p className="text-xs text-gray-400">{traveler.followers} followers</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleUserClick(traveler.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollowToggle(traveler.id);
                    }}
                    className={`px-4 py-2 text-sm rounded-full transition-all transform hover:scale-105 shadow-sm ${
                      followStates[traveler.id]
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                    aria-label={`Follow ${traveler.name}`}
                  >
                    {followStates[traveler.id] ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Travel Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">💡 Travel Tip</h3>
            <p className="text-sm text-gray-700 mb-3">
              Book flights on Tuesday afternoons for the best deals. Airlines often release discounts then!
            </p>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
              More Tips →
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed right-0 top-14 sm:top-16 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-80 bg-white border-l border-gray-200 overflow-y-auto z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Trending</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            aria-label="Close trending sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Trending Destinations */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold text-gray-900">Trending Destinations</h3>
            </div>
            <div className="space-y-3">
              {trendingDestinations.map((destination) => (
                <button
                  key={destination.id}
                  onClick={() => handleDestinationClick(destination)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="relative">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {destination.growth}
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-gray-900">{destination.name}</h4>
                    <p className="text-sm text-gray-500">{destination.country}</p>
                    <p className="text-xs text-gray-400">{destination.travelers}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Suggested Travelers */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Users className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900">Suggested Travelers</h3>
            </div>
            <div className="space-y-3">
              {suggestedTravelers.map((traveler) => (
                <div key={traveler.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <button
                    onClick={() => handleUserClick(traveler.id)}
                    className="flex items-center space-x-3 flex-1"
                  >
                    <img
                      src={traveler.avatar}
                      alt={traveler.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900">{traveler.name}</h4>
                      <p className="text-sm text-gray-500">{traveler.region}</p>
                      <p className="text-xs text-gray-400">{traveler.followers} followers</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleUserClick(traveler.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollowToggle(traveler.id);
                    }}
                    className={`px-4 py-2 text-sm rounded-full transition-colors ${
                      followStates[traveler.id]
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {followStates[traveler.id] ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};