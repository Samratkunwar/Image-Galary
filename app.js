// variables 

var PORT = 3000;
var https = "mongodb://localhost:27017/gallery";

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer');
var path = require('path');
var passport = require('passport');
var passportLocalMongoose = require('passport-local-mongoose');
var LocalStrategy = require('passport-local');

// importing models class
var post = require('./models/post.js');
var Comment = require('./models/comment.js')
var User = require('./models/user.js')

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


// connecting the css to html
app.use(express.static(__dirname + '/public'));

// passport configuration
app.use(require("express-session")({
    secret: "You are entering the path of the dragon",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Extracting the current logged in user 
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// setting up a virtual storage
var Storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({
    storage: Storage,
    limits: {fileSize: 1000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('image');

function checkFileType(file, cb){
    const fileType = /jpg|jpeg|png|gif/;
    const extname = fileType.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileType.test(file.mimetype);

    if (mimetype && extname){
        return cb(null, true);
    }
    else{
        cb("Error: Images Only!");
    }
};

// connecting to the database (note: the database must be turned on before connecting)
mongoose.connect(https, {useUnifiedTopology: true}, function(err, res){
    if(err){
        console.log(err);
    }
    else{
        console.log("connected to the Mongo Database");
    }
});


// -------------------------- Routes ----------------------------

//==================== Routes For Posts ======================

// route to open to the home page
app.get('/', function(req,res){
    post.find({}, function(err, post){
        if (err){
            console.log(err);
        }else{
            
            res.render("index", {images:post})
        }
    });
});

// route to show individual post
app.get("/show/:id", function(req, res){
    
    post.findById(req.params.id).populate("comments").exec(function(err, post){
        if(err){
            console.log(err);
        }
        else{
            console.log(post);
            res.render("show", {post:post});
        }
    });
});

// route for creating new image postin the collection
app.post('/newimage', function(req,res){

    upload(req, res, function(err){
        if(err){
            post.find({}, function(error, post){
                if(error) {
                    console.log(error);
                }
                else{
                    res.render("index", {images:post, msg:err})
                }
            })
        }
        else{
            if (req.file == undefined){
                post.find({}, function(error, post){
                    if(error) {
                        console.log(error);
                    }
                    else{
                        res.render("index", {images:post, msg: "Error: No File Selected! "})
                    }
                })
            }
            else{
               
                var name = req.body.name;
                var message = req.body.message;
                var newimage = {
                    name: name,
                    message: message,
                    image: req.file.filename
                }
                post.create(newimage, function(err, newdata){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log(newdata)
                        console.log('new image added to the collection.');
                        res.redirect("/");
                    }
                });
            }
            
        }
    });

});

// Route to update the post

// Route to delete the post

//==================== Routes For Comments ===================

// Routes for adding comments in a post

app.post("/show/:id/comments", function(req, res){
    post.findById(req.params.id, function(err, postData){
        if(err){
            console.log(err);
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                if (err){
                    console.log(err);
                }
                else{
                    postData.comments.push(comment);
                    postData.save();
                    res.redirect('/show/' + postData._id);
                }
            });
        }
    });

});



// Route to delete Comment

// ======================================= Routes for user authentication =================================

// route for login
app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }) , function(req, res){
    
});

//route for registering a new user
app.get('/register', function(req,res){
    res.render('register');
});

app.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        else{
            passport.authenticate("local")(req, res, function(){
                console.log("user registration success!");
                console.log(user);
                res.redirect('/');
            });
        }
    });
});

//route for logout
app.get('/logout', function(req,res){
    req.logout();
    res.redirect("/");
});

// --------------------------------------------------------------

app.listen(PORT, function(){
    console.log("Server started at port: ", PORT);
});


// Authentication function
function AuthenticateUser(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
};

