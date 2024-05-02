const Axios = require("axios")
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

    const username = req.body.username;
    const password = req.body.password;
    if(username&&password){
        const present = users.filter((user)=> user.username === username)
        if(present.length===0){
            users.push({"username":req.body.username,"password":req.body.password});
            return res.status(201).json({message:"User " + req.body.username + " created successfully"})
        }
        else{
          return res.status(400).json({message:req.body.username + " already exists"})
        }
    }
    else if(!username && !password){
      return res.status(500).json({message:"Bad request"})
    }
    else if(!username || !password){
      return res.status(400).json({message:"Check username and password"})
    }  
  
   
});

function getBooks() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}

// Get the book list available in the shop
//public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
//  res.send(JSON.stringify(books));
//});
public_users.get('/', (req, res) => {
    const getBooks = () => {
        return new Promise((resolve,reject) => {
          setTimeout(() => {
            resolve(books);
          },1000);
        })
    }
    getBooks().then((books) => {
        res.send(JSON.stringify(books));
    }).catch((err) =>{
      res.status(500).json({error: "An error occured"});
    });  
});

// Get book details based on ISBN
//public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
//  const searchISBN = req.params.isbn;
  //return res.status(300).json({message: "Yet to be implemented"});
//  res.send(JSON.stringify(books[searchISBN]))
// });
public_users.get('/isbn/:isbn', (req, res) =>{
    const ISBN = req.params.isbn;
    const booksBasedOnIsbn = (ISBN) => {
        return new Promise((resolve,reject) =>{
          setTimeout(() =>{
            const book = books[ISBN];
            if(book){
              resolve(book);
            }else{
              reject(new Error("Book not found"));
            }},1000);
        });      
    }
    booksBasedOnIsbn(ISBN).then((book) =>{
      res.send(JSON.stringify(book));
    }).catch((err)=>{
      res.status(400).json({error:"Book not found"})
    });   
});
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   let searchBooks = {}
//   const searchAuthor = req.params.author;
//   let i=1;
//   for(let bookid in books){
//       if(books[bookid].author === searchAuthor ){
//         searchBooks[i++] = books[bookid];
//       }
//     }
//   res.send(JSON.stringify(searchBooks))
// });
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.author === author))
    .then((filteredBooks) => res.send(filteredBooks));
});

// Get all books based on title
//public_users.get('/title/:title',function (req, res) {
  //Write your code here
//   let searchBooks = {}
//   const searchTitle = req.params.title;
//   let i=1;
//   for(let bookid in books){
//       if(books[bookid].title === searchTitle ){
//         searchBooks[i++] = books[bookid];
//       }
//     }
//   res.send(JSON.stringify(searchBooks))
// });
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.title === title))
    .then((filteredBooks) => res.send(filteredBooks));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const searchReview = req.params.isbn;
  res.send(JSON.stringify(books[searchReview].reviews))
});

module.exports.general = public_users;