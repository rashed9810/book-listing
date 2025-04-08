
/**
 * Extract unique genres from books
 * @param {Array} books - Array of book objects
 * @returns {Array} - Array of unique genres
 */
function extractGenres(books) {
  const genreSet = new Set();

  books.forEach((book) => {
    if (book.subjects && Array.isArray(book.subjects)) {
      book.subjects.forEach((subject) => {
        genreSet.add(subject);
      });
    }
  });

  return Array.from(genreSet).sort();
}

/**
 * Get URL parameters as an object
 * @returns {Object} - Object with URL parameters
 */
function getUrlParams() {
  const params = {};
  const searchParams = new URLSearchParams(window.location.search);

  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }

  return params;
}

/**
 * Set URL parameters without page reload
 * @param {Object} params - Parameters to set
 */
function setUrlParams(params) {
  const url = new URL(window.location);

  
  url.search = "";

  
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }

  
  window.history.pushState({}, "", url);
}

/**
 * Create a book card element
 * @param {Object} book - Book data
 * @returns {HTMLElement} - Book card element
 */
function createBookCard(book) {
  const card = document.createElement("div");
  card.className = "book-card";
  card.dataset.id = book.id;

  
  const coverUrl =
    book.formats["image/jpeg"] || "/placeholder.svg?height=300&width=200";

  
  const authorName =
    book.authors.length > 0 ? book.authors[0].name : "Unknown Author";

  
  const genres = book.subjects ? book.subjects.slice(0, 3) : [];

  
  card.innerHTML = `
    <a href="book-details.html?id=${book.id}" class="book-cover">
      <img src="${coverUrl}" alt="${book.title}" loading="lazy">
    </a>
    <button class="wishlist-btn ${
      wishlistService.isInWishlist(book.id) ? "active" : ""
    }" data-id="${book.id}">
      <i class="${
        wishlistService.isInWishlist(book.id) ? "fas fa-heart" : "far fa-heart"
      }"></i>
    </button>
    <div class="book-info">
      <h3 class="book-title">${book.title}</h3>
      <p class="book-author">by ${authorName}</p>
      <div class="book-genres">
        ${genres
          .map((genre) => `<span class="genre-tag">${genre}</span>`)
          .join("")}
      </div>
      <p class="book-id">ID: ${book.id}</p>
    </div>
  `;

  
  const wishlistBtn = card.querySelector(".wishlist-btn");
  wishlistBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const bookId = Number.parseInt(wishlistBtn.dataset.id);
    const isInWishlist = wishlistService.toggleWishlist(bookId);

    
    wishlistBtn.classList.toggle("active", isInWishlist);
    wishlistBtn.querySelector("i").className = isInWishlist
      ? "fas fa-heart"
      : "far fa-heart";

    
    card.style.animation = "none";
    card.offsetHeight; 
    card.style.animation = "fadeIn 0.3s ease-out";
  });

  return card;
}

/**
 * Create pagination controls
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {Function} onPageChange - Callback for page change
 * @returns {HTMLElement} - Pagination element
 */
function createPagination(currentPage, totalPages, onPageChange) {
  const pagination = document.createElement("div");
  pagination.className = "pagination";

  
  const prevBtn = document.createElement("button");
  prevBtn.className = `page-btn ${currentPage === 1 ? "disabled" : ""}`;
  prevBtn.textContent = "Previous";
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  });

  
  const nextBtn = document.createElement("button");
  nextBtn.className = `page-btn ${
    currentPage === totalPages ? "disabled" : ""
  }`;
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  });

  
  pagination.appendChild(prevBtn);

  
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  
  if (startPage > 1) {
    const firstPageBtn = document.createElement("button");
    firstPageBtn.className = "page-btn";
    firstPageBtn.textContent = "1";
    firstPageBtn.addEventListener("click", () => onPageChange(1));
    pagination.appendChild(firstPageBtn);

    
    if (startPage > 2) {
      const ellipsis = document.createElement("span");
      ellipsis.className = "page-ellipsis";
      ellipsis.textContent = "...";
      pagination.appendChild(ellipsis);
    }
  }

  
  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.className = `page-btn ${i === currentPage ? "active" : ""}`;
    pageBtn.textContent = i.toString();
    pageBtn.addEventListener("click", () => onPageChange(i));
    pagination.appendChild(pageBtn);
  }

  
  if (endPage < totalPages) {
    
    if (endPage < totalPages - 1) {
      const ellipsis = document.createElement("span");
      ellipsis.className = "page-ellipsis";
      ellipsis.textContent = "...";
      pagination.appendChild(ellipsis);
    }

    const lastPageBtn = document.createElement("button");
    lastPageBtn.className = "page-btn";
    lastPageBtn.textContent = totalPages.toString();
    lastPageBtn.addEventListener("click", () => onPageChange(totalPages));
    pagination.appendChild(lastPageBtn);
  }

  pagination.appendChild(nextBtn);

  return pagination;
}

/**
 * Save user preferences to localStorage
 * @param {Object} preferences - User preferences object
 */
function saveUserPreferences(preferences) {
  localStorage.setItem("user_preferences", JSON.stringify(preferences));
}

/**
 * Load user preferences from localStorage
 * @returns {Object} - User preferences object
 */
function loadUserPreferences() {
  const preferences = localStorage.getItem("user_preferences");
  return preferences ? JSON.parse(preferences) : {};
}

/**
 * Display error message
 * @param {string} message - Error message to display
 * @param {HTMLElement} container - Container to display error in
 */
function showError(message, container) {
  container.innerHTML = `
    <div class="error">
      <p>${message}</p>
      <button class="btn retry-btn">Retry</button>
    </div>
  `;

  const retryBtn = container.querySelector(".retry-btn");
  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      window.location.reload();
    });
  }
}

// Make utility functions available globally
window.extractGenres = extractGenres;
window.getUrlParams = getUrlParams;
window.setUrlParams = setUrlParams;
window.createBookCard = createBookCard;
window.createPagination = createPagination;
window.saveUserPreferences = saveUserPreferences;
window.loadUserPreferences = loadUserPreferences;
window.showError = showError;

// Export for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    extractGenres,
    getUrlParams,
    setUrlParams,
    createBookCard,
    createPagination,
    saveUserPreferences,
    loadUserPreferences,
    showError,
  };
}
