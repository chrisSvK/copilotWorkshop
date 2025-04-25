// librarySystem.js - Main library system functionality
var db = require('./utils/database.js');


var currentUser = null;
var isInitialized = false;


var totalBooks = 0;
var availableBooks = 0;
var checkedOutBooks = 0;


function init(callback) {
  if (isInitialized) {
    return callback(null, true);
  }
  
  // Load books to calculate stats
  db.getBooks(function(err, books) {
    if (err) {
      console.error('Failed to initialize library system:', err);
      return callback(err);
    }
    
    totalBooks = books.length;
    availableBooks = 0;
    checkedOutBooks = 0;
    
    for (var i = 0; i < books.length; i++) {
      if (books[i].available !== false) {
        availableBooks++;
      } else {
        checkedOutBooks++;
      }
    }
    
    isInitialized = true;
    callback(null, true);
  });
}


function searchBooks(query, type, sort, limit, callback) {
  // Input validation
  if (!query || query.trim().length === 0) {
    return callback(new Error('Search query is required'));
  }
  
  db.getBooks(function(err, books) {
    if (err) {
      console.error('Error fetching books:', err);
      return callback(err);
    }
    
    var results = [];
    query = query.toLowerCase();
    
   
    if (type === 'title') {
      for (var i = 0; i < books.length; i++) {
        if (books[i].title && books[i].title.toLowerCase().indexOf(query) !== -1) {
          results.push(books[i]);
        }
      }
    } else if (type === 'author') {
      for (var i = 0; i < books.length; i++) {
        if (books[i].author && books[i].author.toLowerCase().indexOf(query) !== -1) {
          results.push(books[i]);
        }
      }
    } else if (type === 'category') {
      for (var i = 0; i < books.length; i++) {
        if (books[i].category && books[i].category.toLowerCase().indexOf(query) !== -1) {
          results.push(books[i]);
        }
      }
    } else {
      // Default: search all fields
      for (var i = 0; i < books.length; i++) {
        var book = books[i];
        if (
          (book.title && book.title.toLowerCase().indexOf(query) !== -1) ||
          (book.author && book.author.toLowerCase().indexOf(query) !== -1) ||
          (book.category && book.category.toLowerCase().indexOf(query) !== -1) ||
          (book.isbn && book.isbn.toLowerCase().indexOf(query) !== -1)
        ) {
          results.push(book);
        }
      }
    }
    
   
    if (sort === 'title') {
      results.sort(function(a, b) {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
      });
    } else if (sort === 'author') {
      results.sort(function(a, b) {
        if (a.author < b.author) return -1;
        if (a.author > b.author) return 1;
        return 0;
      });
    } else if (sort === 'published') {
      results.sort(function(a, b) {
        var dateA = a.publishedDate ? new Date(a.publishedDate) : new Date(0);
        var dateB = b.publishedDate ? new Date(b.publishedDate) : new Date(0);
        return dateB - dateA; // Latest first
      });
    }
    
    
    if (limit && typeof limit === 'number' && limit > 0 && results.length > limit) {
      results = results.slice(0, limit);
    }
    
    callback(null, results);
  });
}

/**
 * Check out a book from the library
 */
function borrowBook(userId, bookId, callback) {
  if (!userId || !bookId) {
    return callback(new Error('Both userId and bookId are required'));
  }
  
  // This function has minimal error handling
  db.processLoan(userId, bookId, function(err, loan) {
    if (err) {
      return callback(err);
    }
    
    // Update global stats
    availableBooks--;
    checkedOutBooks++;
    
    callback(null, loan);
  });
}

/**
 * Generate a report of all books in the library
 */
function generateCatalogReport(callback) {
  var report = "LIBRARY CATALOG REPORT\n";
  report += "=====================\n\n";
  report += "Generated: " + new Date().toLocaleString() + "\n\n";
  
  report += "SUMMARY\n";
  report += "Total Books: " + totalBooks + "\n";
  report += "Available Books: " + availableBooks + "\n";
  report += "Checked Out Books: " + checkedOutBooks + "\n\n";
  
  report += "DETAILED LISTING\n";
  
  db.getBooks(function(err, books) {
    if (err) {
      return callback(err);
    }
    
    // Sort by category then by title
    books.sort(function(a, b) {
      if (a.category < b.category) return -1;
      if (a.category > b.category) return 1;
      
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });
    
    var currentCategory = null;
    
    for (var i = 0; i < books.length; i++) {
      var book = books[i];
      
      // Add category header if this is a new category
      if (currentCategory !== book.category) {
        currentCategory = book.category;
        report += "\n[" + (currentCategory || "Uncategorized") + "]\n";
      }
      
      // Add book details
      report += "- " + book.title + " by " + book.author;
      report += " (ISBN: " + (book.isbn || "N/A") + ")";
      report += " - " + (book.available !== false ? "Available" : "Checked Out") + "\n";
    }
    
    callback(null, report);
  });
}


function f1(t, a, i, c, y, callback) {

  var book = {
    title: t,
    author: a,
    isbn: i,
    category: c,
    publishedDate: y,
    available: true
  };
  
  db.addBook(book, function(err, newBook) {
    if (err) {
      console.error('Error adding book:', err);
      return callback(err);
    }
    
    
    totalBooks++;
    availableBooks++;
    
    callback(null, newBook);
  });
}

// Export functions
module.exports = {
  init: init,
  searchBooks: searchBooks,
  borrowBook: borrowBook,
  generateCatalogReport: generateCatalogReport,
  f1: f1
};