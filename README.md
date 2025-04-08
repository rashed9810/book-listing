# Book Listing App

A responsive web application that allows users to browse, search, and wishlist books from the Gutendex API, as well as manage custom fonts for reading.

## Features

- **Book Listings**: Display books from the Gutendex API with cover images, titles, authors, and genres
- **Search Functionality**: Search books by title in real-time
- **Genre Filtering**: Filter books by genre/topic using a dropdown
- **Wishlist**: Add/remove books to/from a wishlist stored in localStorage
- **Pagination**: Navigate through the book listings with pagination controls
- **Responsive Design**: Works well on both desktop and mobile devices
- **User Preferences**: Saves search and filter preferences in localStorage
- **Font Management**: Upload, preview, and organize custom fonts
- **Font Groups**: Create and manage groups of fonts for different reading preferences
- **Font Preview**: Preview text with uploaded fonts before using them

## Technologies Used

- HTML5
- CSS3 (with custom variables and responsive design)
- Vanilla JavaScript (ES6+)
- Gutendex API (https://gutendex.com/)
- Font Awesome for icons
- Web Font API for font handling
- LocalStorage API for data persistence
- Jest for unit testing

## Project Structure

```
book-listing-app/
├── css/
│   ├── styles.css
│   └── fonts.css
├── js/
│   ├── api.js
│   ├── book-details.js
│   ├── config.js
│   ├── fonts.js
│   ├── main.js
│   ├── mobile-menu.js
│   ├── utils.js
│   ├── wishlist.js
│   └── wishlist-page.js
├── __tests__/
│   ├── api.service.test.js
│   ├── book-details.test.js
│   ├── dom.test.js
│   ├── main.test.js
│   ├── utils.test.js
│   ├── wishlist-page.test.js
│   └── wishlist.service.test.js
├── book-details.html
├── fonts.html
├── index.html
├── wishlist.html
└── README.md
```

## Setup and Usage

1. Clone the repository:

   ```
   git clone https://github.com/rashed9810/book-listing.git
   ```

2. Open the project folder:

   ```
   cd book-listing
   ```

3. Open `index.html` in your browser or use a local server:

   ```
   # Using Python's built-in server
   python -m http.server

   # Or using Node's http-server (requires installation)
   npx http-server
   ```

4. To run tests (after installing dependencies):
   ```
   npm install
   npm test
   ```

## Pages

- **Home Page**: Displays the book listings with search, filter, and pagination
- **Book Details Page**: Shows detailed information about a specific book
- **Wishlist Page**: Displays all books added to the wishlist
- **Fonts Page**: Allows users to upload, preview, and manage custom fonts and font groups

## API Integration

The app uses the Gutendex API (https://gutendex.com/) to fetch book data:

- `/books` endpoint for book listings
- `/books?ids={id}` for specific book details
- Search and pagination parameters are supported

## Font Management Features

- **Font Upload**: Upload custom font files (.ttf, .otf, .woff, .woff2) with metadata
- **Font Preview**: Preview uploaded fonts with sample text before using them
- **Font Filtering**: Filter fonts by category or search by name
- **Font Groups**: Create and manage groups of fonts for different reading preferences
- **Local Storage**: All fonts and font groups are stored in the browser's localStorage

## Future Improvements

- Add more advanced search options (author, genre)
- Implement book recommendations
- Add user accounts for persistent wishlists and font collections
- Improve accessibility features
- Add more unit and integration tests
- Add font application to book reading view
- Support for more font formats and font metadata
- Cloud storage for fonts and font groups

## License

[MIT License](LICENSE)
