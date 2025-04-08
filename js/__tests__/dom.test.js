/**
 * Tests for DOM manipulation functions
 */

// Import DOM testing utilities
const { screen, getByText, fireEvent } = require('@testing-library/dom');

// Import the utility functions
const utils = require('../utils');

describe('DOM Manipulation Functions', () => {
  describe('createBookCard', () => {
    beforeEach(() => {
      // Set up document body
      document.body.innerHTML = '<div id="container"></div>';
      
      // Mock wishlistService
      global.wishlistService = {
        isInWishlist: jest.fn().mockReturnValue(false),
        toggleWishlist: jest.fn().mockReturnValue(true)
      };
    });
    
    it('should create a book card with correct elements', () => {
      const book = {
        id: 1,
        title: 'Test Book',
        authors: [{ name: 'Test Author' }],
        subjects: ['Fiction', 'Adventure'],
        formats: {
          'image/jpeg': 'test-image.jpg'
        }
      };
      
      const card = utils.createBookCard(book);
      
      // Add card to the DOM for testing
      document.getElementById('container').appendChild(card);
      
      // Check that card contains expected elements
      expect(card.classList.contains('book-card')).toBe(true);
      expect(card.dataset.id).toBe('1');
      
      // Check title
      const title = card.querySelector('.book-title');
      expect(title.textContent).toBe('Test Book');
      
      // Check author
      const author = card.querySelector('.book-author');
      expect(author.textContent).toBe('by Test Author');
      
      // Check genres
      const genres = card.querySelectorAll('.genre-tag');
      expect(genres.length).toBe(2);
      expect(genres[0].textContent).toBe('Fiction');
      expect(genres[1].textContent).toBe('Adventure');
      
      // Check ID
      const id = card.querySelector('.book-id');
      expect(id.textContent).toBe('ID: 1');
      
      // Check wishlist button
      const wishlistBtn = card.querySelector('.wishlist-btn');
      expect(wishlistBtn).not.toBeNull();
      expect(wishlistBtn.classList.contains('active')).toBe(false);
    });
    
    it('should handle books with missing data', () => {
      const book = {
        id: 2,
        title: 'Incomplete Book',
        authors: [],
        formats: {}
      };
      
      const card = utils.createBookCard(book);
      document.getElementById('container').appendChild(card);
      
      // Check author defaults to "Unknown Author"
      const author = card.querySelector('.book-author');
      expect(author.textContent).toBe('by Unknown Author');
      
      // Check no genres are displayed
      const genres = card.querySelectorAll('.genre-tag');
      expect(genres.length).toBe(0);
    });
    
    it('should toggle wishlist status when button is clicked', () => {
      const book = {
        id: 1,
        title: 'Test Book',
        authors: [{ name: 'Test Author' }],
        formats: {}
      };
      
      const card = utils.createBookCard(book);
      document.getElementById('container').appendChild(card);
      
      const wishlistBtn = card.querySelector('.wishlist-btn');
      
      // Click the wishlist button
      fireEvent.click(wishlistBtn);
      
      // Check that toggleWishlist was called
      expect(wishlistService.toggleWishlist).toHaveBeenCalledWith(1);
      
      // Check that button class was updated
      expect(wishlistBtn.classList.contains('active')).toBe(true);
    });
  });
  
  describe('createPagination', () => {
    beforeEach(() => {
      // Set up document body
      document.body.innerHTML = '<div id="pagination-container"></div>';
    });
    
    it('should create pagination with correct buttons', () => {
      const onPageChange = jest.fn();
      
      const pagination = utils.createPagination(2, 5, onPageChange);
      document.getElementById('pagination-container').appendChild(pagination);
      
      // Check previous and next buttons
      const prevBtn = pagination.querySelector('.page-btn:first-child');
      const nextBtn = pagination.querySelector('.page-btn:last-child');
      
      expect(prevBtn.textContent).toBe('Previous');
      expect(prevBtn.disabled).toBe(false);
      
      expect(nextBtn.textContent).toBe('Next');
      expect(nextBtn.disabled).toBe(false);
      
      // Check page buttons
      const pageButtons = pagination.querySelectorAll('.page-btn:not(:first-child):not(:last-child)');
      expect(pageButtons.length).toBe(5); // 5 pages
      
      // Check current page is active
      const activePage = pagination.querySelector('.page-btn.active');
      expect(activePage.textContent).toBe('2');
    });
    
    it('should disable previous button on first page', () => {
      const pagination = utils.createPagination(1, 5, jest.fn());
      document.getElementById('pagination-container').appendChild(pagination);
      
      const prevBtn = pagination.querySelector('.page-btn:first-child');
      expect(prevBtn.disabled).toBe(true);
    });
    
    it('should disable next button on last page', () => {
      const pagination = utils.createPagination(5, 5, jest.fn());
      document.getElementById('pagination-container').appendChild(pagination);
      
      const nextBtn = pagination.querySelector('.page-btn:last-child');
      expect(nextBtn.disabled).toBe(true);
    });
    
    it('should call onPageChange when a page button is clicked', () => {
      const onPageChange = jest.fn();
      
      const pagination = utils.createPagination(2, 5, onPageChange);
      document.getElementById('pagination-container').appendChild(pagination);
      
      // Click page 3
      const page3Btn = Array.from(pagination.querySelectorAll('.page-btn')).find(btn => btn.textContent === '3');
      fireEvent.click(page3Btn);
      
      expect(onPageChange).toHaveBeenCalledWith(3);
    });
    
    it('should call onPageChange when next button is clicked', () => {
      const onPageChange = jest.fn();
      
      const pagination = utils.createPagination(2, 5, onPageChange);
      document.getElementById('pagination-container').appendChild(pagination);
      
      const nextBtn = pagination.querySelector('.page-btn:last-child');
      fireEvent.click(nextBtn);
      
      expect(onPageChange).toHaveBeenCalledWith(3);
    });
    
    it('should call onPageChange when previous button is clicked', () => {
      const onPageChange = jest.fn();
      
      const pagination = utils.createPagination(2, 5, onPageChange);
      document.getElementById('pagination-container').appendChild(pagination);
      
      const prevBtn = pagination.querySelector('.page-btn:first-child');
      fireEvent.click(prevBtn);
      
      expect(onPageChange).toHaveBeenCalledWith(1);
    });
  });
});
