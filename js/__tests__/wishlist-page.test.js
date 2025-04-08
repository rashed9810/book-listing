/**
 * Tests for wishlist-page.js
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
    'wishlist-container': {
      innerHTML: '',
      appendChild: jest.fn()
    },
    'wishlist-count': {
      textContent: ''
    },
    'empty-wishlist': {
      style: {
        display: 'none'
      }
    }
  };
  return elements[id] || null;
});

// Mock global functions
window.wishlistService = {
  getWishlist: jest.fn(() => [
    { id: 1, title: 'Book 1' },
    { id: 2, title: 'Book 2' }
  ])
};
window.showError = jest.fn();
window.createBookCard = jest.fn(() => document.createElement('div'));

// Import wishlist-page.js (this will execute the code)
require('../wishlist-page');

describe('Wishlist Page', () => {
  it('should initialize the page on DOMContentLoaded', () => {
    expect(document.addEventListener).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));
  });
  
  it('should get wishlist from wishlistService', () => {
    expect(window.wishlistService.getWishlist).toHaveBeenCalled();
  });
  
  it('should update wishlist count', () => {
    const wishlistCount = document.getElementById('wishlist-count');
    expect(wishlistCount.textContent).toBe('2 books saved');
  });
  
  it('should hide empty wishlist message when books exist', () => {
    const emptyWishlist = document.getElementById('empty-wishlist');
    expect(emptyWishlist.style.display).toBe('none');
  });
  
  it('should create book cards for each book in wishlist', () => {
    expect(window.createBookCard).toHaveBeenCalledTimes(2);
    
    const wishlistContainer = document.getElementById('wishlist-container');
    expect(wishlistContainer.appendChild).toHaveBeenCalledTimes(2);
  });
  
  it('should show empty wishlist message when no books', () => {
    // Reset mocks
    window.wishlistService.getWishlist.mockClear();
    document.getElementById.mockClear();
    
    // Mock empty wishlist
    window.wishlistService.getWishlist.mockReturnValueOnce([]);
    
    // Re-execute the code
    document.addEventListener.mock.calls[0][1]();
    
    const emptyWishlist = document.getElementById('empty-wishlist');
    expect(emptyWishlist.style.display).toBe('block');
  });
  
  it('should set up event listener for wishlist updates', () => {
    expect(window.addEventListener).toHaveBeenCalledWith('wishlist-updated', expect.any(Function));
  });
  
  it('should handle errors', () => {
    // Reset mocks
    window.wishlistService.getWishlist.mockClear();
    window.showError.mockClear();
    
    // Mock error
    window.wishlistService.getWishlist.mockImplementationOnce(() => {
      throw new Error('Test error');
    });
    
    // Re-execute the code
    document.addEventListener.mock.calls[0][1]();
    
    expect(window.showError).toHaveBeenCalledWith(
      'Failed to load wishlist. Please try again later.',
      document.getElementById('wishlist-container')
    );
  });
});
