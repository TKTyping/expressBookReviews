const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();





public_users.post("/register", (req,res) => {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
const username = req.body.username;
 const password = req.body.password;
 if (username && password) {
   if (!isValid(username)) {
     users.push({"username":username,"password":password});
     return res.status(200).json({message: "User successfully registred. Now you can login"});
   } else {
     return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
//   eturn res.status(300).json({message: "Yet to be implemented"});
return res.status(200).send(JSON.stringify(books,null,4));
});

// Function to get the list of books using Promise callbacks

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    // Write your code here  
    // return res.status(300).json({message: "Yet to be implemented"});
    
    const isbn = req.params.isbn;
    
    if (books.hasOwnProperty(isbn)) {
      return res.status(200).json(books[isbn]);
    } else {
      return res.status(404).json({ message: "Book not found for the given ISBN" });
    }
  });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    // Write your code here  
    // return res.status(300).json({message: "Yet to be implemented"});
    
    const author = req.params.author;
    const matchingBooks = [];
    console.log(author);
  
    // Iterate through the books array and check if the author matches
    Object.keys(books).forEach(isbn => {
      if (books[isbn].author === author) {
        matchingBooks.push(books[isbn]);
      }
    });
  
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "Books not found for the given author" });
    }
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
const title = req.params.title;
    const matchingBooks = [];
  
    // Iterate through the books array and check if the author matches
    Object.keys(books).forEach(isbn => {
      if (books[isbn].title === title) {
        matchingBooks.push(books[isbn]);
      }
    });
  
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "Books not found for the given title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
    const isbn = req.params.isbn;
    const reviews = [];
    
    if (books.hasOwnProperty(isbn)) {
      return res.status(200).json(books[isbn]);
    } else {
      return res.status(404).json({ message: "Book not found for the given ISBN" });
    }
});

module.exports.general = public_users;
