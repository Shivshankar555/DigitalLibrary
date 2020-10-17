var express = require("express");
var router = express.Router({mergeParams: true});
var Book = require("../models/book");
var Comment = require("../models/comment");

// ====================
// COMMENTS ROUTES
// ====================

router.get("/books/:id/comments/new", isLoggedIn,(req, res)=>{
    // find campground by id
    Book.findById(req.params.id,(err, book)=>{
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {book: book});
        }
    })
});

router.post("/books/:id/comments",isLoggedIn,(req, res)=>{
   //lookup campground using ID
   Book.findById(req.params.id,(err, book)=>{
       if(err){
           console.log(err);
           res.redirect("/books");
       } else {
        Comment.create(req.body.comment,(err, comment)=>{
           if(err){
               req.flash("error","Something went wrong.");
               console.log(err);
           } else {
            //    add username and id to the comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
           //    save comment
               comment.save();
               book.comments.push(comment);
               book.save();
               console.log(comment);
               req.flash("Comment added successfully!");
               res.redirect('/books/' + book._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});

router.get("/books/:id/comments/:comment_id/edit",checkCommentOwenership,(req,res)=>{
    Comment.findById(req.params.comment_id,(err,foundComment)=>{
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit",{book_id:req.params.id,comment:foundComment});
        }
    })

});


router.put("/books/:id/comments/:comment_id",checkCommentOwenership,(req,res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,updatedComment)=>{
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/books/"+ req.params.id);
        }
    });
});

router.delete("/books/:id/comments/:comment_id",checkCommentOwenership,(req,res)=>{
   Comment.findByIdAndRemove(req.params.comment_id,(err)=>{
       if(err){
         res.redirect("back");
       }else{
        req.flash("success","Comment deleted.");
           res.redirect("/books/"+ req.params.id);
       }
     
   });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please login first!");
    res.redirect("/login");
}

function checkCommentOwenership(req, res, next) {
    if(req.isAuthenticated()){
           Comment.findById(req.params.comment_id,(err, foundComment)=>{
              if(err){
                  res.redirect("back");
              }  else {
                  // does user own the comment?
                  console.log(foundComment);
                  console.log(foundComment.author);
               if(foundComment.author.id.equals(req.user._id)) {
                   next();
               } else {
                   req.flash("error","permission denied.");
                   res.redirect("back");
               }
              }
           });
       } else {
           req.flash("error","permission denied.");
           res.redirect("back");
       }
     }
   

module.exports = router;
