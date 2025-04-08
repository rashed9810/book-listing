document.addEventListener("DOMContentLoaded", () => {
  
  const getUrlParams = window.getUrlParams;
  const showError = window.showError;

  const apiService = window.apiService;

  const wishlistService = window.wishlistService;

  const bookDetailsContainer = document.getElementById("book-details");

  const urlParams = getUrlParams();
  const bookId = Number.parseInt(urlParams.id);

  if (bookId) {
    init(bookId);
  } else {
    showError("No book ID provided.", bookDetailsContainer);
  }

  /**
   * Initialize the book details page
   * @param {number} id - Book ID
   */
  async function init(id) {
    try {
      bookDetailsContainer.innerHTML =
        '<div class="loading">Loading book details...</div>';

      const book = await apiService.getBookById(id);

      renderBookDetails(book);

      setupEventListeners(book);
    } catch (error) {
      console.error("Book details initialization error:", error);
      showError(
        "Failed to load book details. Please try again later.",
        bookDetailsContainer
      );
    }
  }

  /**
   * Render book details
   * @param {Object} book - Book object
   */
  function renderBookDetails(book) {
    const coverUrl = book.formats["image/jpeg"] || "/images/placeholder.svg";

    const authorName =
      book.authors.length > 0 ? book.authors[0].name : "Unknown Author";

    
    bookDetailsContainer.innerHTML = `
      <div class="book-details">
        <div class="book-details-header">
          <div class="book-details-cover">
            <img src="${coverUrl}" alt="${book.title}">
          </div>
          <div class="book-details-info">
            <h1 class="book-details-title">${book.title}</h1>
            <p class="book-details-author">by ${authorName}</p>
            <div class="book-details-meta">
              <p class="book-details-id">ID: ${book.id}</p>
              <div class="book-details-genres">
                ${
                  (book.subjects &&
                    book.subjects
                      .map(
                        (subject) =>
                          `<span class="book-details-genre">${subject}</span>`
                      )
                      .join("")) ||
                  ""
                }
              </div>
            </div>
            <div class="book-details-actions">
              <button class="btn wishlist-btn-large ${
                wishlistService.isInWishlist(book.id) ? "active" : ""
              }" data-id="${book.id}">
                <i class="${
                  wishlistService.isInWishlist(book.id)
                    ? "fas fa-heart"
                    : "far fa-heart"
                }"></i>
                ${
                  wishlistService.isInWishlist(book.id)
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"
                }
              </button>
              <a href="index.html" class="btn btn-secondary">Back to Books</a>
            </div>
          </div>
        </div>
        <div class="book-details-content">
          <div class="book-details-description">
            <h2>About this book</h2>
            <p>This is a classic work of literature available through Project Gutenberg.</p>
          </div>
          <div class="book-details-links">
            <h3>Download Options</h3>
            <div class="download-links">
              ${Object.entries(book.formats)
                .filter(([format]) => !format.includes("image"))
                .map(([format, url]) => {
                  const formatName = format
                    .replace("application/", "")
                    .replace("text/", "")
                    .toUpperCase();
                  return `<a href="${url}" class="download-link" target="_blank">${formatName}</a>`;
                })
                .join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Set up event listeners
   * @param {Object} book - Book object
   */
  function setupEventListeners(book) {
    const wishlistBtn = bookDetailsContainer.querySelector(
      ".wishlist-btn-large"
    );
    if (wishlistBtn) {
      wishlistBtn.addEventListener("click", () => {
        const isInWishlist = wishlistService.toggleWishlist(book);

        wishlistBtn.classList.toggle("active", isInWishlist);
        wishlistBtn.innerHTML = `
          <i class="${isInWishlist ? "fas fa-heart" : "far fa-heart"}"></i>
          ${isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        `;
      });
    }
  }
});


if (typeof module !== "undefined" && module.exports) {
  module.exports = {};
}
