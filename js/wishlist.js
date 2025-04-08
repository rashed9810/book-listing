class WishlistService {
  constructor() {
    this.storageKey = "gutendex_wishlist";
  }

  /**
   * Load wishlist from localStorage
   * @returns {Array} - Array of book objects
   */
  getWishlist() {
    const storedWishlist = localStorage.getItem(this.storageKey);
    return storedWishlist ? JSON.parse(storedWishlist) : [];
  }

  /**
   * Save wishlist to localStorage
   * @param {Array} wishlist - Array of book objects
   */
  saveWishlist(wishlist) {
    localStorage.setItem(this.storageKey, JSON.stringify(wishlist));
    
    window.dispatchEvent(new CustomEvent("wishlist-updated"));
  }

  /**
   * Add a book to the wishlist
   * @param {Object} book - Book object to add
   */
  addToWishlist(book) {
    if (!this.isInWishlist(book.id)) {
      const wishlist = this.getWishlist();
      wishlist.push(book);
      this.saveWishlist(wishlist);
    }
  }

  /**
   * Remove a book from the wishlist
   * @param {number} bookId - Book ID to remove
   */
  removeFromWishlist(bookId) {
    const wishlist = this.getWishlist();
    const updatedWishlist = wishlist.filter((book) => book.id !== bookId);
    this.saveWishlist(updatedWishlist);
  }

  /**
   * Toggle a book's wishlist status
   * @param {Object} book - Book object to toggle
   * @returns {boolean} - New wishlist status
   */
  toggleWishlist(book) {
    if (this.isInWishlist(book.id)) {
      this.removeFromWishlist(book.id);
      return false;
    } else {
      this.addToWishlist(book);
      return true;
    }
  }

  /**
   * Check if a book is in the wishlist
   * @param {number} bookId - Book ID to check
   * @returns {boolean} - True if book is in wishlist
   */
  isInWishlist(bookId) {
    const wishlist = this.getWishlist();
    return wishlist.some((book) => book.id === bookId);
  }

  /**
   * Get the count of books in the wishlist
   * @returns {number} - Number of books in wishlist
   */
  getWishlistCount() {
    return this.getWishlist().length;
  }
}

const wishlistService = new WishlistService();

window.wishlistService = wishlistService;

// Export for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = { WishlistService, wishlistService };
}
