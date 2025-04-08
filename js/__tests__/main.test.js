/**
 * Tests for main.js
 */

// Mock DOM elements and functions
document.addEventListener = jest.fn((event, callback) => {
  if (event === 'DOMContentLoaded') {
    callback();
  }
});

// Mock DOM elements
document.getElementById = jest.fn(id => {
  const elements = {
    'books-container': {
      innerHTML: '',
      appendChild: jest.fn()
    },
    'search-input': {
      value: '',
      addEventListener: jest.fn()
    },
    'genre-filter': {
      value: '',
      innerHTML: '',
      appendChild: jest.fn(),
      addEventListener: jest.fn()
    },
    'pagination': {
      innerHTML: '',
      appendChild: jest.fn()
    }
  };
  return elements[id] || null;
});

document.querySelector = jest.fn(() => ({
  addEventListener: jest.fn()
}));

document.querySelectorAll = jest.fn(() => []);

// Mock global functions
window.loadUserPreferences = jest.fn(() => ({}));
window.getUrlParams = jest.fn(() => ({}));
window.apiService = {
  getBooks: jest.fn(() => Promise.resolve({
    count: 32,
    results: [{ id: 1, title: 'Test Book' }]
  }))
};
window.extractGenres = jest.fn(() => ['Fiction', 'Adventure']);
window.setUrlParams = jest.fn();
window.saveUserPreferences = jest.fn();
window.createBookCard = jest.fn(() => document.createElement('div'));
window.createPagination = jest.fn(() => document.createElement('div'));
window.wishlistService = {
  isInWishlist: jest.fn(),
  toggleWishlist: jest.fn()
};
window.showError = jest.fn();

// Import main.js (this will execute the code)
require('../main');

describe('Main Page', () => {
  it('should initialize the application on DOMContentLoaded', () => {
    expect(document.addEventListener).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));
  });
  
  it('should load user preferences', () => {
    expect(window.loadUserPreferences).toHaveBeenCalled();
  });
  
  it('should get URL parameters', () => {
    expect(window.getUrlParams).toHaveBeenCalled();
  });
  
  it('should fetch books from API', () => {
    expect(window.apiService.getBooks).toHaveBeenCalled();
  });
  
  it('should set up event listeners for search input', () => {
    const searchInput = document.getElementById('search-input');
    expect(searchInput.addEventListener).toHaveBeenCalledWith('input', expect.any(Function));
  });
  
  it('should set up event listeners for genre filter', () => {
    const genreFilter = document.getElementById('genre-filter');
    expect(genreFilter.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
  
  it('should set up event listeners for wishlist updates', () => {
    expect(window.addEventListener).toHaveBeenCalledWith('wishlist-updated', expect.any(Function));
  });
  
  it('should set up event listeners for mobile menu toggle', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    expect(mobileMenuToggle.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
  });
});
