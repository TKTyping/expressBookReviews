const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user)=>{
	  return user.username === username
	});
	if(userswithsamename.length > 0){
	  return true;
	} else {
	  return false;
	}

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
	  return (user.username === username && user.password === password)
	});
	if(validusers.length > 0){
	  return true;
	} else {
	  return false;
	}

}

//only registered users can login
// 	2. {"username":"user2", "password":"password2"}

/* regd_users.post("/login", (req,res) => {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
    const username = req.body.username;
	const password = req.body.password;
	if (!username || !password) {
	    return res.status(404).json({message: "Error logging in"});
	}
	if (authenticatedUser(username,password)) {
	    let accessToken = jwt.sign({
	        data: password
	    }, 'access', { expiresIn: 60 * 60 });
	    req.session.authorization = {
	        accessToken,username
	    }
	    // return res.status(200).send("User successfully logged in");
        return res.json({ token: accessToken, message: "Login successful" });
	} else {
	    return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
}); */
regd_users.post("/login", (req, res) => {
    // Extract username and password from the request body
    const { username, password } = req.body;
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Error logging in. Username and password are required." });
    }
  
    // Perform authentication (replace this with your authentication logic)
    if (authenticatedUser(username, password)) {
      // Generate a JWT token
      const accessToken = jwt.sign({ username: username }, 'access', { expiresIn: '1h' });
  
      // Set the token in both session and response
      req.session.authorization = { accessToken, username };

      // Set the user information in the session
    req.session.user = { username: username };

      return res.json({ token: accessToken, message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid login. Check username and password." });
    }
  });
 

/* // Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Extract ISBN from the request parameters
    const isbn = req.params.isbn;    
  
    // Check if the user is authenticated (session-based authentication)
    if (req.session && req.session.user) {
      const username = req.session.user.username;
      const reviewText = req.query.review;
  
      // Find the book with the specified ISBN
    //   const bookIndex = books.findIndex((book) => book.isbn === isbn);
    
  
      if (isbn !== -1) {
        // Check if the user has already posted a review for the given ISBN
        console.log(books[isbn].reviews);
        const reviews = books[isbn].reviews;
        if(Object.keys(reviews).length === 0){
            console.log("no Reviews");
        }
        
        return res.status(201).json({ message: "Review added successfully" });
        
        
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    } else {
      // User is not authenticated, send an authentication error
      return res.status(401).json({ message: "Authentication required" });
    }
  }); */

  regd_users.put("/auth/review/:isbn", (req, res) => {
    // Extract ISBN from the request parameters
    const isbn = req.params.isbn;
  
    // Check if the user is authenticated (session-based authentication)
    if (req.session && req.session.user) {
      const username = req.session.user.username;
      const reviewText = req.body.review;
      console.log(reviewText);
  
      // Find the book with the specified ISBN
      const book = books[isbn];
  
      if (book) {
        // Check if the user has already posted a review for the given ISBN
        const existingReview = book.reviews[username];
  
        if (existingReview) {
          // If the user has already posted a review, modify the existing one
          books[isbn].reviews[username].text = reviewText;
          return res.status(200).json({
            message: "Review modified successfully",
            username: username,
            text: reviewText
          });
        } else {
          // If it's a new user or the same user posting a different review, add a new review
          const newReview = {
            username: username,
            text: reviewText
          };
          books[isbn].reviews[username] = newReview;
          return res.status(201).json({
            message: "Review added successfully",
            username: username,
            text: reviewText
          });
        }
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    } else {
      // User is not authenticated, send an authentication error
      return res.status(401).json({ message: "Authentication required" });
    }
  });

// Add a book review
// {"review": "This is a great book!", "isbn": "1"}
/* regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// Extract the username from the session
const username = req.session.username;
console.log(username);
const reviewText = req.query.review; // Extracting review from the query parameters
const isbn = req.params.isbn; // Extracting ISBN from the route parameters

let filteredBooks = books.filter((book) => book.isbn === isbn);

if (filteredBooks.length > 0) { // check if the book is available
    let existingReviewIndex = -1;

    // Check if the user has already posted a review for the given ISBN
    filteredBooks[0].reviews.forEach((existingReview, index) => {
      if (existingReview.username === username) {
        existingReviewIndex = index;
      }
    });

    if (existingReviewIndex !== -1) {
      // If the user has already posted a review, modify the existing one
      filteredBooks[0].reviews[existingReviewIndex].text = reviewText;
    } else {
      // If it's a new user or the same user posting a different review, add a new review
      const newReview = {
        username: username,
        text: reviewText
      };
      filteredBooks[0].reviews.push(newReview);
    }

    return res.status(200).json({ message: "Review added/modified successfully" });
  } else {
    return res.status(408).json({ message: "The ISBN is not valid" });
  }
}); */

// Updating book review
// {
//     "username": "john_doe",
//     "review": "This is a fantastic book! I highly recommend it.",
//     "isbn": "978-3-16-148410-0"
//   }
  
/* regd_users.put('/auth/addreview/', function (req, res) {
    // Write your code here
    // return res.status(300).json({message: "Yet to be implemented"});
  
    // const username = req.body.username; // Assuming username is stored in the session
    // Extract the username from the session
    const username = req.session.username;

    const reviewText = req.query.review; // Extracting review from the query parameters
    const isbn = req.query.isbn; // Extracting ISBN from the query parameters
  
    let filteredBooks = books.filter((book) => book.isbn === isbn);
  
    if (filteredBooks.length > 0) { // check if the book is available
      let existingReviewIndex = -1;
  
      // Check if the user has already posted a review for the given ISBN
      filteredBooks[0].reviews.forEach((existingReview, index) => {
        if (existingReview.username === username) {
          existingReviewIndex = index;
        }
      });
  
      if (existingReviewIndex !== -1) {
        // If the user has already posted a review, modify the existing one
        filteredBooks[0].reviews[existingReviewIndex].text = reviewText;
      } else {
        // If it's a new user or the same user posting a different review, add a new review
        const newReview = {
          username: username,
          text: reviewText
        };
        filteredBooks[0].reviews.push(newReview);
      }
  
      return res.status(200).json({ message: "Review added/modified successfully" });
    } else {
      return res.status(408).json({ message: "The ISBN is not valid" });
    }
  }); */

  /* regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Extract ISBN from the request parameters
    const isbn = req.params.isbn;
  
    // Check if the user is authenticated (session-based authentication)
    console.log(req.session);
    console.log(req.session.user);
    if (req.session && req.session.user) {
      const username = req.session.user.username;
  
      // Find the book with the specified ISBN
      const bookIndex = books.findIndex((book) => book.isbn === isbn);
  
      if (bookIndex !== -1) {
        // Filter out reviews that do not belong to the authenticated user
        books[bookIndex].reviews = books[bookIndex].reviews.filter((review) => review.username !== username);
  
        return res.status(200).json({ message: "Reviews deleted successfully" });
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    } else {
      // User is not authenticated, send an authentication error
      return res.status(401).json({ message: "Authentication required" });
    }
  }); */
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Extract ISBN from the request parameters
    const isbn = req.params.isbn;
  
    // Check if the user is authenticated (session-based authentication)
    if (req.session && req.session.user) {
      const username = req.session.user.username;
  
      // Find the book with the specified ISBN
      const book = books[isbn];
  
      if (book) {
        // Check if the user has posted a review for the given ISBN
        const existingReview = book.reviews[username];
  
        if (existingReview) {
          // If the user has posted a review, delete it
          delete books[isbn].reviews[username];
          return res.status(200).json({ message: "Review deleted successfully" });
        } else {
          return res.status(404).json({ message: "Review not found for the given user and ISBN" });
        }
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    } else {
      // User is not authenticated, send an authentication error
      return res.status(401).json({ message: "Authentication required" });
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
