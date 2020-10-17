var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


router.get("/",(req,res)=>{
    res.render("home");
});

// ================
// AUTH ROUTE
// ================

// REGISTER ROUTE - show the signup form
router.get("/register",(req,res)=>{
    res.render("register");
});

// handle the signup request
router.post("/register",(req,res)=>{
    var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password,(err,user)=>{
        if(err){
            req.flash("error",err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,()=>{
            req.flash("success","Registered successfully!");
            res.redirect("/books");
        });
    });
});

// LOGIN ROUTE - show the login form
router.get("/login",(req,res)=>{
    res.render("login");
});

// handle login request
//app.post("/route",middleware,callback)
router.post("/login", passport.authenticate("local", {
    successRedirect: "/books",
    failureRedirect: "/login"
}),function(req, res){
});

// LOGOUT route
router.get("/logout",(req,res)=>{
    req.logOut();
    req.flash("success","Logged you out!");
    res.redirect("/books");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;