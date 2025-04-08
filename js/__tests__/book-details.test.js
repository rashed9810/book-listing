/**
 * Tests for book-details.js
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
    'book-details': {
      innerHTML: '',
      querySelector: jest.fn(() => ({
        addEventListener: jest.fn()
      }))
    }
  };
  return elements[id] || null;
});

// Mock global functions
window.getUrlParams = jest.fn(() => ({ id: '1' }));
window.showError = jest.fn();
window.apiService = {
  getBookById: jest.fn(() => Promise.resolve({
    id: 1,
    title: 'Test Book',
    authors: [{ name: 'Test Author' }],
    subjects: ['Fiction', 'Adventure'],
    formats: {
      'image/jpeg': 'test-image.jpg',
      'application/epub+zip': 'test-book.epub',
      'text/html': 'test-book.html'
    }
  }))
};
window.wishlistService = {
  isInWishlist: jest.fn(() => false),
  toggleWishlist: jest.fn(() => true)
};

// Import book-details.js (this will execute the code)
require('../book-details');

describe('Book Details Page', () => {
  it('should initialize the page on DOMContentLoaded', () => {
    expect(document.addEventListener).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));
  });
  
  it('should get book ID from URL parameters', () => {
    expect(window.getUrlParams).toHaveBeenCalled();
  });
  
  it('should fetch book details from API', () => {
    expect(window.apiService.getBookById).toHaveBeenCalledWith(1);
  });
  
  it('should show error if no book ID provided', () => {
    // Reset mocks
    window.getUrlParams.mockClear();
    window.showError.mockClear();
    
    // Mock getUrlParams to return no ID
    window.getUrlParams.mockReturnValueOnce({});
    
    // Re-execute the code
    document.addEventListener.mock.calls[0][1]();
    
    expect(window.showError).toHaveBeenCalledWith(
      'No book ID provided.',
      document.getElementById('book-details')
    );
  });
  
  it('should handle API errors', async () => {
    // Reset mocks
    window.apiService.getBookById.mockClear();
    window.showError.mockClear();
    
    // Mock API error
    window.apiService.getBookById.mockRejectedValueOnce(new Error('API error'));
    
    // Re-execute the code
    await document.addEventListener.mock.calls[0][1]();
    
    expect(window.showError).toHaveBeenCalledWith(
      'Failed to load book details. Please try again later.',
      document.getElementById('book-details')
    );
  });
});
