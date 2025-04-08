
document.addEventListener("DOMContentLoaded", () => {
  
  const wishlistContainer = document.getElementById("wishlist-container");
  const wishlistCount = document.getElementById("wishlist-count");
  const emptyWishlist = document.getElementById("empty-wishlist");
  
  
  init();  
  
  
  function init() {
    try {
      
      const wishlistBooks = wishlistService.getWishlist();

      
      updateWishlistCount(wishlistBooks.length);

      
      if (wishlistBooks.length === 0) {
        emptyWishlist.style.display = "block";
        return;
      } else {
        emptyWishlist.style.display = "none";
      }

      
      renderWishlistBooks(wishlistBooks);

      
      setupEventListeners();
    } catch (error) {
      console.error("Wishlist initialization error:", error);
      showError(
        "Failed to load wishlist. Please try again later.",
        wishlistContainer
      );
    }
  }

  /**
   * Render wishlist books
   * @param {Array} books - Array of book objects
   */
  function renderWishlistBooks(books) {
    
    wishlistContainer.innerHTML = "";

    
    books.forEach((book) => {
      const bookCard = createBookCard(book);
      wishlistContainer.appendChild(bookCard);
    });
  }

  /**
   * Update wishlist count
   * @param {number} count - Number of books in wishlist
   */
  function updateWishlistCount(count) {
    wishlistCount.textContent = `${count} book${count !== 1 ? "s" : ""} saved`;
  }

  function setupEventListeners() {
    
    window.addEventListener("wishlist-updated", () => {
      
      const wishlistBooks = wishlistService.getWishlist();

      
      updateWishlistCount(wishlistBooks.length);

      
      if (wishlistBooks.length === 0) {
        emptyWishlist.style.display = "block";
        wishlistContainer.innerHTML = "";
      } else {
        emptyWishlist.style.display = "none";
        renderWishlistBooks(wishlistBooks);
      }
    });
  }
});

if (typeof module !== "undefined" && module.exports) {
  module.exports = {};
}
