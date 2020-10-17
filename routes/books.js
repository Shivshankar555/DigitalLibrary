var express = require("express");
var router = express.Router();
var Book = require("../models/book");


// INDEX --> show all the books in the list
router.get("/books",function(req,res){
    // get all the books from the DB
    Book.find({},(err,books)=>{
        if(err){
            console.log(err);
        }else{
             res.render("book/index",{books:books});
        }
    });
});


// CREATE --> add new book to the list
router.post("/books",isLoggedIn,(req,res)=>{
    // get data from form and add to the DB
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newbook = {name: name,image: image,description: description,author:author};
    // create new book and save to DB
    Book.create(newbook,(err,book)=>{
        if(err){
            console.log(err);
        }else{
        // redirect again to home page
            res.redirect("/books");
        }
    });
   
   
});

// NEW --> show form to add new book to the existing list.
router.get("/new/books",isLoggedIn,(req,res)=>{
    res.render("book/new");
});

// SHOW --> show more info about the selected book
router.get("/books/:id",(req,res)=>{

    Book.findById(req.params.id).populate("comments").exec((err,foundBook)=>{
        if(err){
            console.log(err);
        }else{
            console.log(foundBook);
            // render show template with the foundBook
            res.render("book/show",{book:foundBook});
        }
    });
    
});

// EDIT EXISTING BOOK ROUTE
router.get("/books/:id/edit",checkBookOwenership,(req,res)=>{
    Book.findById(req.params.id,(err,foundBook)=>{
       res.render("book/edit",{book:foundBook});
      });

});

// UPDATE EXISTING bOOK ROUTE
router.put("/books/:id",checkBookOwenership,(req,res)=>{
   Book.findByIdAndUpdate(req.params.id,req.body.book,(err,updatedBook)=>{
    if(err){
        res.redirect("/books")
    }else{
        res.redirect("/books/"+ req.params.id);
    }
   });
});

// deleting a particular book

router.delete("/books/:id",checkBookOwenership,(req,res)=>{
    Book.findByIdAndDelete(req.params.id,(err)=>{
        if(err){
            res.redirect("/books");
        }else{
            res.redirect("/books");
        }
    });
});

function checkBookOwenership(req, res, next) {
    if(req.isAuthenticated()){
           Book.findById(req.params.id,(err, foundBook)=>{
              if(err){
                  req.flash("error","Book not found.");
                  res.redirect("back");
              }  else {
                  // does user own the campground?
                  console.log(foundBook);
                  console.log(foundBook.author);
               if(foundBook.author.id.equals(req.user._id)) {
                   next();
               } else {
                   req.flash("error","permission denied!");
                   res.redirect("back");
               }
              }
           });
       } else {
           req.flash("error","please login first!");
           res.redirect("back");
       }
     }
   



function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please login first!");
    res.redirect("/login");
}


module.exports = router;