document.addEventListener("DOMContentLoaded", () => {
  const loadUserPreferences = window.loadUserPreferences;
  const getUrlParams = window.getUrlParams;
  const apiService = window.apiService;
  const extractGenres = window.extractGenres;
  const setUrlParams = window.setUrlParams;
  const saveUserPreferences = window.saveUserPreferences;
  const createBookCard = window.createBookCard;
  const createPagination = window.createPagination;
  const wishlistService = window.wishlistService;
  const showError = window.showError;
  const booksContainer = document.getElementById("books-container");
  const searchInput = document.getElementById("search-input");
  const genreFilter = document.getElementById("genre-filter");
  const paginationContainer = document.getElementById("pagination");

  let books = [];
  let allGenres = [];
  let currentPage = 1;
  let totalPages = 1;
  let searchTimeout;

  const preferences = loadUserPreferences();
  const urlParams = getUrlParams();
  const initialSearch = urlParams.search || preferences.search || "";
  const initialGenre = urlParams.genre || preferences.genre || "";
  const initialPage = Number.parseInt(urlParams.page) || 1;

  searchInput.value = initialSearch;
  currentPage = initialPage;
  init();

  async function init() {
    try {
      booksContainer.innerHTML = '<div class="loading">Loading books...</div>';

      const params = { page: currentPage };
      if (initialSearch) {
        params.search = initialSearch;
      }

      const response = await apiService.getBooks(params);
      books = response.results;
      totalPages = Math.ceil(response.count / 32); 

      allGenres = extractGenres(books);
      populateGenreFilter(allGenres, initialGenre);

      if (initialGenre) {
        filterBooksByGenre(initialGenre);
      } else {
        renderBooks(books);
      }

      
      setupEventListeners();

      
      setUrlParams({
        search: initialSearch,
        genre: initialGenre,
        page: currentPage,
      });

     
      saveUserPreferences({
        search: initialSearch,
        genre: initialGenre,
      });
    } catch (error) {
      console.error("Initialization error:", error);
      showError(
        "Failed to load books. Please try again later.",
        booksContainer
      );
    }
  }

  
  function setupEventListeners() {
    
    searchInput.addEventListener("input", () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(async () => {
        const searchTerm = searchInput.value.trim();
        currentPage = 1;

        try {
          booksContainer.innerHTML =
            '<div class="loading">Searching books...</div>';
          const params = { search: searchTerm, page: 1 };
          const response = await apiService.getBooks(params);
          books = response.results;
          totalPages = Math.ceil(response.count / 32);

          
          if (genreFilter.value) {
            filterBooksByGenre(genreFilter.value);
          } else {
            renderBooks(books);
          }

          
          setUrlParams({
            search: searchTerm,
            genre: genreFilter.value,
            page: currentPage,
          });

          saveUserPreferences({
            search: searchTerm,
            genre: genreFilter.value,
          });
        } catch (error) {
          console.error("Search error:", error);
          showError(
            "Failed to search books. Please try again later.",
            booksContainer
          );
        }
      }, 500);
    });

    
    genreFilter.addEventListener("change", () => {
      const selectedGenre = genreFilter.value;
      currentPage = 1;

      if (selectedGenre) {
        filterBooksByGenre(selectedGenre);
      } else {
        renderBooks(books);
      }

      
      setUrlParams({
        search: searchInput.value,
        genre: selectedGenre,
        page: currentPage,
      });

      saveUserPreferences({
        search: searchInput.value,
        genre: selectedGenre,
      });
    });

    
    window.addEventListener("wishlist-updated", () => {
      
      const wishlistBtns = document.querySelectorAll(".wishlist-btn");
      wishlistBtns.forEach((btn) => {
        const bookId = Number.parseInt(btn.dataset.id);
        const isInWishlist = wishlistService.isInWishlist(bookId);
        btn.classList.toggle("active", isInWishlist);
        btn.querySelector("i").className = isInWishlist
          ? "fas fa-heart"
          : "far fa-heart";
      });
    });

    
  }

  /**
   * Filter books by genre
   * @param {string} genre - Genre to filter by
   */
  function filterBooksByGenre(genre) {
    const filteredBooks = books.filter(
      (book) => book.subjects && book.subjects.includes(genre)
    );

    renderBooks(filteredBooks.length > 0 ? filteredBooks : []);
  }

  /**
   * Populate genre filter dropdown
   * @param {Array} genres - Array of genres
   * @param {string} selectedGenre - Initially selected genre
   */
  function populateGenreFilter(genres, selectedGenre) {
    genreFilter.innerHTML = '<option value="">All Genres</option>';

    genres.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre;
      option.textContent = genre;
      option.selected = genre === selectedGenre;
      genreFilter.appendChild(option);
    });
  }

  /**
   * Render books to the DOM
   * @param {Array} booksToRender - Books to render
   */
  function renderBooks(booksToRender) {
     booksContainer.innerHTML = "";

    if (booksToRender.length === 0) {
      booksContainer.innerHTML = `
        <div class="no-results">
          <p>No books found matching your criteria.</p>
          <button class="btn" id="clear-filters">Clear Filters</button>
        </div>
      `;

      const clearFiltersBtn = document.getElementById("clear-filters");
      clearFiltersBtn.addEventListener("click", () => {
        searchInput.value = "";
        genreFilter.value = "";
        currentPage = 1;
        init();
      });

      
      paginationContainer.innerHTML = "";
      return;
    }

    
    booksToRender.forEach((book) => {
      const bookCard = createBookCard(book);
      booksContainer.appendChild(bookCard);
    });

    
    renderPagination(totalPages);
  }

  /**
   * Render pagination controls
   * @param {number} totalPages - Total number of pages
   */
  function renderPagination(totalPages) {
    paginationContainer.innerHTML = "";

    if (totalPages <= 1) {
      return;
    }

    const pagination = createPagination(
      currentPage,
      totalPages,
      async (page) => {
        try {
          currentPage = page;
          booksContainer.innerHTML =
            '<div class="loading">Loading books...</div>';

          
          const params = { page };
          if (searchInput.value) {
            params.search = searchInput.value;
          }

          const response = await apiService.getBooks(params);
          books = response.results;

          
          if (genreFilter.value) {
            filterBooksByGenre(genreFilter.value);
          } else {
            renderBooks(books);
          }

          
          setUrlParams({
            search: searchInput.value,
            genre: genreFilter.value,
            page,
          });

          
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
          console.error("Pagination error:", error);
          showError(
            "Failed to load books. Please try again later.",
            booksContainer
          );
        }
      }
    );

    paginationContainer.appendChild(pagination);
  }
});

// Export for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = {};
}
