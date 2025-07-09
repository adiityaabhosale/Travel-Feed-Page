import React, { useState } from 'react';
import { Filter, MapPin, Hash, Calendar, Users, ChevronDown, Search, X } from 'lucide-react';

interface SearchFiltersProps {
  onFilterChange: (filters: any) => void;
  isLoading?: boolean;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ onFilterChange, isLoading = false }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState({
    destinations: 'All Destinations',
    categories: 'All Categories',
    dateRange: 'Date Range',
    contributors: 'All Contributors'
  });
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const popularTags = [
    'Adventure', 'Luxury', 'Culture', 'Food', 'Nature', 
    'Photography', 'Beach', 'Mountains', 'City', 'Wildlife'
  ];

  const destinations = [
    'All Destinations', 'Europe', 'Asia', 'North America', 
    'South America', 'Africa', 'Oceania', 'Antarctica'
  ];

  const categories = [
    'All Categories', 'Adventure', 'Culture', 'Food & Drink',
    'Nature', 'Photography', 'Luxury', 'Budget', 'Solo Travel', 'Family'
  ];

  const dateRanges = [
    'Date Range', 'Last Week', 'Last Month', 'Last 3 Months',
    'Last 6 Months', 'Last Year', 'Custom Range'
  ];

  const contributors = [
    'All Contributors', 'Verified Users', 'Top Contributors',
    'Local Guides', 'Photography Experts', 'Food Bloggers'
  ];

  const handleFilterSelect = (filterType: string, value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    setActiveDropdown(null);
    onFilterChange({ ...newFilters, search: searchValue });
  };

  const handleTagClick = (tag: string) => {
    setSearchValue(tag);
    onFilterChange({ ...filters, search: tag });
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onFilterChange({ ...filters, search: value });
  };

  const clearSearch = () => {
    setSearchValue('');
    onFilterChange({ ...filters, search: '' });
  };

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const FilterDropdown = ({ 
    type, 
    icon: Icon, 
    options, 
    currentValue 
  }: { 
    type: string; 
    icon: React.ComponentType<any>; 
    options: string[]; 
    currentValue: string;
  }) => (
    <div className="relative">
      <button
        onClick={() => toggleDropdown(type)}
        className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base w-full sm:w-auto justify-between sm:justify-start"
        aria-label={`Filter by ${type}`}
        aria-expanded={activeDropdown === type}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className="truncate">{currentValue}</span>
        <ChevronDown className={`h-4 w-4 transition-transform flex-shrink-0 ${
          activeDropdown === type ? 'rotate-180' : ''
        }`} />
      </button>
      
      {activeDropdown === type && (
        <div className="absolute top-full left-0 right-0 sm:right-auto sm:w-64 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-30 max-h-64 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleFilterSelect(type, option)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                currentValue === option ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
      {/* Main Search */}
      <div className="relative mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search destinations, experiences, or travelers"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            aria-label="Search destinations and experiences"
          />
          {searchValue && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Filter Toggle Button - Mobile */}
      <div className="flex items-center justify-between mb-4 sm:hidden">
        <h3 className="font-medium text-gray-900">Filters</h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          aria-label="Toggle filters"
        >
          <Filter className="h-4 w-4" />
          <span className="text-sm">Filters</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filter Buttons */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 ${
        showFilters ? 'block' : 'hidden sm:grid'
      }`}>
        <FilterDropdown
          type="destinations"
          icon={MapPin}
          options={destinations}
          currentValue={filters.destinations}
        />
        <FilterDropdown
          type="categories"
          icon={Hash}
          options={categories}
          currentValue={filters.categories}
        />
        <FilterDropdown
          type="dateRange"
          icon={Calendar}
          options={dateRanges}
          currentValue={filters.dateRange}
        />
        <FilterDropdown
          type="contributors"
          icon={Users}
          options={contributors}
          currentValue={filters.contributors}
        />
      </div>

      {/* Popular Tags */}
      <div className={`${showFilters ? 'block' : 'hidden sm:block'}`}>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Tags</h4>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              aria-label={`Filter by ${tag}`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {(filters.destinations !== 'All Destinations' || 
        filters.categories !== 'All Categories' || 
        filters.dateRange !== 'Date Range' || 
        filters.contributors !== 'All Contributors' ||
        searchValue) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">Active Filters</h4>
            <button
              onClick={() => {
                setFilters({
                  destinations: 'All Destinations',
                  categories: 'All Categories',
                  dateRange: 'Date Range',
                  contributors: 'All Contributors'
                });
                setSearchValue('');
                onFilterChange({});
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchValue && (
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Search: {searchValue}
                <button
                  onClick={clearSearch}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  aria-label="Remove search filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {Object.entries(filters).map(([key, value]) => {
              if (value.includes('All') || value.includes('Range')) return null;
              return (
                <span key={key} className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                  {value}
                  <button
                    onClick={() => handleFilterSelect(key, key === 'destinations' ? 'All Destinations' : 
                      key === 'categories' ? 'All Categories' :
                      key === 'dateRange' ? 'Date Range' : 'All Contributors')}
                    className="ml-2 text-gray-600 hover:text-gray-800"
                    aria-label={`Remove ${key} filter`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
};