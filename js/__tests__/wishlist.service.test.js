/**
 * Tests for WishlistService
 */

// Import the WishlistService class
const WishlistService = require('../wishlist').WishlistService;

describe('WishlistService', () => {
  let wishlistService;
  let mockWishlist;
  
  beforeEach(() => {
    // Create a new instance before each test
    wishlistService = new WishlistService();
    
    // Mock data
    mockWishlist = [
      { id: 1, title: 'Book 1' },
      { id: 2, title: 'Book 2' }
    ];
    
    // Reset localStorage mock
    localStorage.clear();
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
    
    // Mock localStorage.getItem to return our mock wishlist
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'gutendex_wishlist') {
        return JSON.stringify(mockWishlist);
      }
      return null;
    });
    
    // Reset window.dispatchEvent mock
    window.dispatchEvent.mockClear();
  });
  
  describe('getWishlist', () => {
    it('should retrieve wishlist from localStorage', () => {
      const result = wishlistService.getWishlist();
      
      expect(localStorage.getItem).toHaveBeenCalledWith('gutendex_wishlist');
      expect(result).toEqual(mockWishlist);
    });
    
    it('should return empty array if no wishlist in localStorage', () => {
      localStorage.getItem.mockImplementationOnce(() => null);
      
      const result = wishlistService.getWishlist();
      
      expect(result).toEqual([]);
    });
  });
  
  describe('saveWishlist', () => {
    it('should save wishlist to localStorage', () => {
      const newWishlist = [{ id: 3, title: 'Book 3' }];
      
      wishlistService.saveWishlist(newWishlist);
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'gutendex_wishlist',
        JSON.stringify(newWishlist)
      );
    });
    
    it('should dispatch wishlist-updated event', () => {
      wishlistService.saveWishlist([]);
      
      expect(window.dispatchEvent).toHaveBeenCalled();
      const event = window.dispatchEvent.mock.calls[0][0];
      expect(event.type).toBe('wishlist-updated');
    });
  });
  
  describe('addToWishlist', () => {
    it('should add a book to the wishlist', () => {
      const newBook = { id: 3, title: 'Book 3' };
      
      wishlistService.addToWishlist(newBook);
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'gutendex_wishlist',
        JSON.stringify([...mockWishlist, newBook])
      );
    });
    
    it('should not add a book if it already exists in wishlist', () => {
      const existingBook = { id: 1, title: 'Book 1' };
      
      wishlistService.addToWishlist(existingBook);
      
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });
  
  describe('removeFromWishlist', () => {
    it('should remove a book from the wishlist', () => {
      wishlistService.removeFromWishlist(1);
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'gutendex_wishlist',
        JSON.stringify([{ id: 2, title: 'Book 2' }])
      );
    });
  });
  
  describe('toggleWishlist', () => {
    it('should add a book if not in wishlist', () => {
      const newBook = { id: 3, title: 'Book 3' };
      
      const result = wishlistService.toggleWishlist(newBook);
      
      expect(result).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'gutendex_wishlist',
        JSON.stringify([...mockWishlist, newBook])
      );
    });
    
    it('should remove a book if already in wishlist', () => {
      const existingBook = { id: 1, title: 'Book 1' };
      
      const result = wishlistService.toggleWishlist(existingBook);
      
      expect(result).toBe(false);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'gutendex_wishlist',
        JSON.stringify([{ id: 2, title: 'Book 2' }])
      );
    });
  });
  
  describe('isInWishlist', () => {
    it('should return true if book is in wishlist', () => {
      const result = wishlistService.isInWishlist(1);
      
      expect(result).toBe(true);
    });
    
    it('should return false if book is not in wishlist', () => {
      const result = wishlistService.isInWishlist(999);
      
      expect(result).toBe(false);
    });
  });
  
  describe('getWishlistCount', () => {
    it('should return the number of books in wishlist', () => {
      const result = wishlistService.getWishlistCount();
      
      expect(result).toBe(2);
    });
  });
});
