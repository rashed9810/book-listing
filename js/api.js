class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch books with optional parameters
   * @param {Object} params - Query parameters
   * @returns {Promise} - Promise with the API response
   */
  async getBooks(params = {}) {
    try {
      const queryParams = new URLSearchParams();

      // Add query parameters if provided
      for (const [key, value] of Object.entries(params)) {
        if (value) {
          queryParams.append(key, value);
        }
      }

      const url = `${this.baseUrl}/books${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  }

  /**
   * Fetch a single book by ID
   * @param {number} id - Book ID
   * @returns {Promise} - Promise with the book data
   */
  async getBookById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/books?ids=${id}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        return data.results[0];
      } else {
        throw new Error("Book not found");
      }
    } catch (error) {
      console.error(`Error fetching book with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Search books by title
   * @param {string} query - Search query
   * @param {number} page - Page number
   * @returns {Promise} - Promise with the search results
   */
  async searchBooks(query, page = 1) {
    return this.getBooks({ search: query, page });
  }
}

// Create a singleton instance using the global CONFIG from config.js
const apiService = new ApiService(CONFIG.API_BASE_URL);

// Make apiService available globally
window.apiService = apiService;

// Export for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ApiService, apiService };
}
