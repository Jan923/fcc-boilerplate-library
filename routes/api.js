/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
let mongodb = require('mongodb');
let mongoose = require('mongoose');
let uri = process.env.MONGO_URI;

module.exports = function (app) {

  mongoose.connect('mongodb+srv://jong:' + process.env['PW'] + '@cluster0.9kfjt.mongodb.net/fcc-library?retryWrites=true&w=majority&appName=Cluster0')

const bookSchema = new mongoose.Schema({title: String, comments: [String]});
const book = mongoose.model('book', bookSchema);
  
  app.route('/api/books')
    .get( async (req, res) => {
      let arrayOfBooks = await book.find();
      let formattedResults = [];
      arrayOfBooks.forEach((el) => {formattedResults.push({ _id: el._id, title: el.title, commentcount: el.comments.length})});
      res.json(formattedResults)
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(async (req, res) => {
      let title = req.body.title;
      if(!title){res.json('missing required field title')}
      else {
        try {
        let newBook = new book({ title: title, comments: [] })
        let id = newBook._id;
        res.json({title: title, _id: id})
        let result = await newBook.save();
        //console.log(result);
        } catch (err) {res.json({error: 'could not save book'})}
      }
      //response will contain new book object including atleast _id and title
    })
    
    .delete(async (req, res) => {
      try {
        let result = await book.deleteMany();
        res.json('complete delete successful')
      } catch (err) {res.json({error: 'could not delete'})}
      
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      try {
      let foundBook = await book.findById(bookid);
      res.json({_id: bookid, title: foundBook.title, comments: foundBook.comments})
        } catch (err) {res.json('no book exists')}
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      try {
        if(!comment){res.json('missing required field comment')}
        else {
        let foundBook = await book.findById(bookid);
        foundBook.comments.push(comment);
        let result = await foundBook.save();
        res.json({_id: bookid, title: foundBook.title, comments: foundBook.comments})
        }
      } catch (err) {res.json('no book exists')}
      //json res format same as .get
    })
    
    .delete(async (req, res) => {
      let bookid = req.params.id;
      let foundBook = await book.findById(bookid);
      if (!foundBook) {res.json('no book exists'); return}
      try {
        let result = await book.deleteOne({_id: bookid});
        res.json('delete successful')
      } catch (err) {res.json({error: 'could not delete', _id: bookid})}
      //if successful response will be 'delete successful'
    });
  
};
