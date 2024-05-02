const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (user)=>{ //returns boolean
    let filtered_users = users.filter((user)=> user.username === user);
    if(filtered_users){
        return true;
    }
    return false;
}
const authenticatedUser = (username,password)=>{ //returns boolean
    if(isValid(username)){
        let filtered_users = users.filter((user)=> (user.username===username)&&(user.password===password));
        if(filtered_users){
            return true;
        }
        return false;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    let user = req.body.username;
    let pass = req.body.password;
    if(!authenticatedUser(user,pass)){
        return res.status(403).json({message:"User not authenticated"})
    }

    let accessToken = jwt.sign({
        data: user
    },'shhhhh',{expiresIn:60*60})
    req.session.authorization = {
        accessToken
    }
    res.send("User logged in Successfully")
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.user.username; // The username is stored in the req.user object
  
    // Check if the book exists in the database
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
  
      // Check if the user already has a review for the book
      if (book.reviews.hasOwnProperty(username)) {
        // Modify the existing review
        book.reviews[username].review = review;
        return res.status(200).json({ message: "Review modified successfully" });
      } else {
        // Add a new review for the user
        book.reviews[username] = {
          username: username,
          review: review,
        };
        return res.status(200).json({ message: "Review added successfully" });
      }
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let ISBN = req.params.isbn;
    books[ISBN].reviews = {}
    return res.status(200).json({messsage:"Review has been deleted"})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;