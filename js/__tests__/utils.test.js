/**
 * Tests for utility functions
 */

// Import the utility functions
const utils = require('../utils');

describe('Utility Functions', () => {
  describe('extractGenres', () => {
    it('should extract unique genres from books', () => {
      const books = [
        { subjects: ['Fiction', 'Adventure'] },
        { subjects: ['Fiction', 'Romance'] },
        { subjects: ['Non-fiction'] }
      ];
      
      const result = utils.extractGenres(books);
      
      expect(result).toEqual(['Adventure', 'Fiction', 'Non-fiction', 'Romance']);
    });
    
    it('should handle books with no subjects', () => {
      const books = [
        { subjects: ['Fiction'] },
        { },
        { subjects: null }
      ];
      
      const result = utils.extractGenres(books);
      
      expect(result).toEqual(['Fiction']);
    });
    
    it('should return empty array for empty books array', () => {
      const result = utils.extractGenres([]);
      
      expect(result).toEqual([]);
    });
  });
  
  describe('getUrlParams', () => {
    it('should parse URL parameters', () => {
      // Mock window.location.search
      Object.defineProperty(window, 'location', {
        value: { search: '?search=test&page=2&genre=Fiction' }
      });
      
      const result = utils.getUrlParams();
      
      expect(result).toEqual({
        search: 'test',
        page: '2',
        genre: 'Fiction'
      });
    });
    
    it('should return empty object for no parameters', () => {
      Object.defineProperty(window, 'location', {
        value: { search: '' }
      });
      
      const result = utils.getUrlParams();
      
      expect(result).toEqual({});
    });
  });
  
  describe('setUrlParams', () => {
    let pushStateSpy;
    
    beforeEach(() => {
      // Mock window.history.pushState
      pushStateSpy = jest.spyOn(window.history, 'pushState').mockImplementation(() => {});
      
      // Mock window.location
      Object.defineProperty(window, 'location', {
        value: { 
          href: 'http://localhost:3000',
          pathname: '/',
          search: ''
        },
        writable: true
      });
    });
    
    afterEach(() => {
      pushStateSpy.mockRestore();
    });
    
    it('should set URL parameters', () => {
      utils.setUrlParams({
        search: 'test',
        page: 2,
        genre: 'Fiction'
      });
      
      expect(pushStateSpy).toHaveBeenCalled();
      // Check that the URL in the second argument contains our parameters
      const url = pushStateSpy.mock.calls[0][2];
      expect(url).toContain('search=test');
      expect(url).toContain('page=2');
      expect(url).toContain('genre=Fiction');
    });
    
    it('should skip empty or falsy parameters', () => {
      utils.setUrlParams({
        search: 'test',
        page: 0,
        genre: '',
        author: null
      });
      
      expect(pushStateSpy).toHaveBeenCalled();
      const url = pushStateSpy.mock.calls[0][2];
      expect(url).toContain('search=test');
      expect(url).not.toContain('genre=');
      expect(url).not.toContain('author=');
    });
  });
  
  describe('saveUserPreferences', () => {
    it('should save preferences to localStorage', () => {
      const preferences = {
        search: 'test',
        genre: 'Fiction'
      };
      
      utils.saveUserPreferences(preferences);
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'user_preferences',
        JSON.stringify(preferences)
      );
    });
  });
  
  describe('loadUserPreferences', () => {
    it('should load preferences from localStorage', () => {
      const preferences = {
        search: 'test',
        genre: 'Fiction'
      };
      
      localStorage.getItem.mockImplementationOnce(() => JSON.stringify(preferences));
      
      const result = utils.loadUserPreferences();
      
      expect(localStorage.getItem).toHaveBeenCalledWith('user_preferences');
      expect(result).toEqual(preferences);
    });
    
    it('should return empty object if no preferences', () => {
      localStorage.getItem.mockImplementationOnce(() => null);
      
      const result = utils.loadUserPreferences();
      
      expect(result).toEqual({});
    });
  });
  
  describe('showError', () => {
    it('should display error message in container', () => {
      const container = {
        innerHTML: '',
        querySelector: jest.fn().mockReturnValue({
          addEventListener: jest.fn()
        })
      };
      
      utils.showError('Test error message', container);
      
      expect(container.innerHTML).toContain('Test error message');
      expect(container.innerHTML).toContain('retry-btn');
    });
    
    it('should add event listener to retry button', () => {
      const mockAddEventListener = jest.fn();
      const container = {
        innerHTML: '',
        querySelector: jest.fn().mockReturnValue({
          addEventListener: mockAddEventListener
        })
      };
      
      utils.showError('Test error message', container);
      
      expect(container.querySelector).toHaveBeenCalledWith('.retry-btn');
      expect(mockAddEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });
  });
});
