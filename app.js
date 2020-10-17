const express = require("express"),
      passport = require("passport"),
      path = require("path"),
      mongoose = require("mongoose"),
      LocalStrategy = require("passport-local"),
      methodOverride = require("method-override"),
      bodyParser = require('body-parser'),
      session = require("express-session"),
      flash = require("connect-flash"),
      Book = require("./models/book"),
      User = require("./models/user"),
      Comment =  require("./models/comment")
     
      


var bookRoutes = require("./routes/books");
    commentRoutes = require("./routes/comments");
    authRoutes = require("./routes/index");

      

// connection with DB
mongoose.connect("mongodb://localhost/book_store", 
{useNewUrlParser: true,
useUnifiedTopology: true});

// seedDB(); //seed the database

var app =express();

// PASSPORT AUTHENTICATION
app.use(session({
    secret: "I want to be a Web Developer",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
mongoose.set('useFindAndModify', false);

// to use public directory
app.use(express.static(path.join(__dirname, 'public')));

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());



app.use(bodyParser.urlencoded({
    extended: true
 }));
 
 app.use(bodyParser.json());

app.set("view engine","ejs");

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(bookRoutes);
app.use(commentRoutes);
app.use(authRoutes);




app.listen(8000,()=>{
    console.log("server is starting...")
})