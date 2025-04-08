/**
 * Tests for ApiService
 */

// Import the ApiService class
const ApiService = require('../api').ApiService;

// Mock fetch
global.fetch = jest.fn();

describe('ApiService', () => {
  let apiService;
  
  beforeEach(() => {
    // Create a new instance before each test
    apiService = new ApiService('https://gutendex.com');
    
    // Reset fetch mock
    fetch.mockClear();
    
    // Mock successful fetch response
    fetch.mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          count: 32,
          results: [{ id: 1, title: 'Test Book' }]
        })
      })
    );
  });
  
  describe('getBooks', () => {
    it('should fetch books with no parameters', async () => {
      const result = await apiService.getBooks();
      
      expect(fetch).toHaveBeenCalledWith('https://gutendex.com/books');
      expect(result.results).toEqual([{ id: 1, title: 'Test Book' }]);
    });
    
    it('should fetch books with parameters', async () => {
      const result = await apiService.getBooks({ search: 'test', page: 2 });
      
      expect(fetch).toHaveBeenCalledWith('https://gutendex.com/books?search=test&page=2');
      expect(result.results).toEqual([{ id: 1, title: 'Test Book' }]);
    });
    
    it('should handle API errors', async () => {
      fetch.mockImplementationOnce(() => 
        Promise.resolve({
          ok: false,
          status: 500
        })
      );
      
      await expect(apiService.getBooks()).rejects.toThrow('API error: 500');
    });
    
    it('should handle network errors', async () => {
      fetch.mockImplementationOnce(() => 
        Promise.reject(new Error('Network error'))
      );
      
      await expect(apiService.getBooks()).rejects.toThrow('Network error');
    });
  });
  
  describe('getBookById', () => {
    it('should fetch a book by ID', async () => {
      const result = await apiService.getBookById(1);
      
      expect(fetch).toHaveBeenCalledWith('https://gutendex.com/books?ids=1');
      expect(result).toEqual({ id: 1, title: 'Test Book' });
    });
    
    it('should throw an error if book not found', async () => {
      fetch.mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            count: 0,
            results: []
          })
        })
      );
      
      await expect(apiService.getBookById(999)).rejects.toThrow('Book not found');
    });
  });
  
  describe('searchBooks', () => {
    it('should search books with query and page', async () => {
      await apiService.searchBooks('test', 2);
      
      expect(fetch).toHaveBeenCalledWith('https://gutendex.com/books?search=test&page=2');
    });
    
    it('should use default page 1 if not specified', async () => {
      await apiService.searchBooks('test');
      
      expect(fetch).toHaveBeenCalledWith('https://gutendex.com/books?search=test&page=1');
    });
  });
});
