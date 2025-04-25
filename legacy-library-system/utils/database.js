// database.js - Legacy database operations

var fs = require('fs');
var path = require('path');

var DATA_DIR = path.join(__dirname, '../data');
var BOOKS_FILE = path.join(DATA_DIR, 'books.json');
var USERS_FILE = path.join(DATA_DIR, 'users.json');
var LOANS_FILE = path.join(DATA_DIR, 'loans.json');

// Global cache to avoid reading files multiple times
var g_booksCache = null;
var g_usersCache = null;
var g_loansCache = null;

/**
 * Get all books from database
 */
function getBooks(callback) {
  if (g_booksCache) {
    return callback(null, g_booksCache);
  }
  
  fs.readFile(BOOKS_FILE, 'utf8', function(err, data) {
    if (err) {
      if (err.code === 'ENOENT') {
        g_booksCache = [];
        return callback(null, []);
      }
      return callback(err);
    }
    
    try {
      g_booksCache = JSON.parse(data);
      callback(null, g_booksCache);
    } catch (e) {
      callback(new Error('Invalid JSON in books database'));
    }
  });
}

/**
 * Add new book to database
 */
function addBook(book, callback) {
  getBooks(function(err, books) {
    if (err) {
      return callback(err);
    }
    
    // Generate ID if not provided
    if (!book.id) {
      book.id = Date.now().toString();
    }
    
    // Check if book with this ID already exists
    for (var i = 0; i < books.length; i++) {
      if (books[i].id === book.id) {
        return callback(new Error('Book with this ID already exists'));
      }
    }
    
    books.push(book);
    
    // Write updated books back to file
    fs.writeFile(BOOKS_FILE, JSON.stringify(books, null, 2), function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, book);
    });
  });
}

/**
 * Get users from database
 */
function getUsers(callback) {
  if (g_usersCache) {
    return callback(null, g_usersCache);
  }
  
  fs.readFile(USERS_FILE, 'utf8', function(err, data) {
    if (err) {
      if (err.code === 'ENOENT') {
        g_usersCache = [];
        return callback(null, []);
      }
      return callback(err);
    }
    
    try {
      g_usersCache = JSON.parse(data);
      callback(null, g_usersCache);
    } catch (e) {
      callback(new Error('Invalid JSON in users database'));
    }
  });
}

/**
 * Process a book loan
 */
function processLoan(userId, bookId, callback) {
  getUsers(function(err, users) {
    if (err) return callback(err);
    
    var userFound = false;
    for (var i = 0; i < users.length; i++) {
      if (users[i].id === userId) {
        userFound = true;
        break;
      }
    }
    
    if (!userFound) {
      return callback(new Error('User not found'));
    }
    
    getBooks(function(err, books) {
      if (err) return callback(err);
      
      var bookFound = false;
      var bookObj = null;
      
      for (var i = 0; i < books.length; i++) {
        if (books[i].id === bookId) {
          bookFound = true;
          bookObj = books[i];
          break;
        }
      }
      
      if (!bookFound) {
        return callback(new Error('Book not found'));
      }
      
      if (bookObj.available === false) {
        return callback(new Error('Book is not available'));
      }
      
      // Get existing loans
      fs.readFile(LOANS_FILE, 'utf8', function(err, data) {
        var loans = [];
        
        if (!err) {
          try {
            loans = JSON.parse(data);
          } catch (e) {
            return callback(new Error('Invalid JSON in loans database'));
          }
        } else if (err.code !== 'ENOENT') {
          return callback(err);
        }
        
        // Create new loan
        var loan = {
          id: Date.now().toString(),
          userId: userId,
          bookId: bookId,
          loanDate: new Date().toISOString(),
          returnDate: null
        };
        
        loans.push(loan);
        
        // Update book availability
        bookObj.available = false;
        
        // Write updated loans to file
        fs.writeFile(LOANS_FILE, JSON.stringify(loans, null, 2), function(err) {
          if (err) return callback(err);
          
          // Update books file
          fs.writeFile(BOOKS_FILE, JSON.stringify(books, null, 2), function(err) {
            if (err) return callback(err);
            
            g_booksCache = books;
            callback(null, loan);
          });
        });
      });
    });
  });
}

exports.getBooks = getBooks;
exports.addBook = addBook;
exports.getUsers = getUsers;
exports.processLoan = processLoan;