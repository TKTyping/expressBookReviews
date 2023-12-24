const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const axios = require('axios');


const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

// Route for getting the list of books
/* app.get('/', (req, res) => {
    getBooks()
      .then((response) => {
        res.status(200).send(JSON.stringify(response, null, 4));
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      });
  });

  function getBooks() {
    return new Promise((resolve, reject) => {
      // Assuming books API endpoint is /api/books
      axios.get('/')
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  } */



/* app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
// Authentication mechanism using both JWT and session

  // Check if a valid JWT is present in the request headers
  const token = req.headers.authorization;
  console.log("test", token);
  if(req.session.authorization) {
	token = req.session.authorization['accessToken'];
	jwt.verify(token, "access",(err,user)=>{
	    if(!err){
	        req.user = user;
	        next();
	    }
	    else{
	        return res.status(403).json({message: "User not authenticated"})
	    }
	 });
    }
  if (token) {
    jwt.verify(token, "access", (err, decoded) => {
      if (err) {
        // Invalid JWT, check for session-based authentication
        if (req.session && req.session.user) {
          // User is authenticated through the session, proceed to the next middleware or route handler
          next();
        } else {
          // User is not authenticated, send an authentication error
          res.status(401).json({ message: "Authentication required" });
        }
      } else {
        // Valid JWT, set user information in the request and proceed
        req.user = decoded;
        next();
      }
    });
  } else {
    // No JWT present, check for session-based authentication
    if (req.session && req.session.user) {
      // User is authenticated through the session, proceed to the next middleware or route handler
      next();
    } else {
      // User is not authenticated, send an authentication error
      res.status(401).json({ message: "Authentication required" });
    }
  }
}); */
app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if a valid JWT is present in the request headers
    const token = req.headers.authorization;
  
    if (req.session && req.session.user) {
      // User is authenticated through the session, proceed to the next middleware or route handler
      req.user = req.session.user;
      return next();
    }
  
    if (token) {
      // A JWT is present, verify it
      jwt.verify(token, "access", (err, decoded) => {
        if (err) {
          // Invalid JWT, send an authentication error
          return res.status(401).json({ message: "Authentication required" });
        } else {
          // Valid JWT, set user information in the request and proceed
          req.user = decoded;
          return next();
        }
      });
    } else {
      // No JWT or session present, send an authentication error
      return res.status(401).json({ message: "Authentication required" });
    }
  });
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
