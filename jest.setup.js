import '@testing-library/jest-dom';
import 'whatwg-fetch';

const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});


window.dispatchEvent = jest.fn();

global.CONFIG = {
  API_BASE_URL: 'https://gutendex.com',
  BOOKS_PER_PAGE: 32,
  STORAGE_KEYS: {
    WISHLIST: 'gutendex_wishlist',
    PREFERENCES: 'gutendex_preferences',
  },
  DEFAULTS: {
    PLACEHOLDER_IMAGE: 'images/book-placeholder.jpg',
  }
};
