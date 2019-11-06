// variables 

var PORT                    = 3000,
    https                   = "mongodb://localhost:27017/gallery";

// importing modules
var express                 = require('express'),
    app                     = express(),
    bodyParser              = require('body-parser'),
    mongoose                = require('mongoose'),
    passport                = require('passport'),
    passportLocalMongoose   = require('passport-local-mongoose'),
    LocalStrategy           = require('passport-local');

// importing routes
var postRoutes              = require('./routes/post'),
    commentRoute            = require('./routes/comment'),
    authenticationRoutes    = require('./routes/authentication')

// importing models class
var post                    = require('./models/post.js'),
    Comment                 = require('./models/comment.js'),
    User                    = require('./models/user.js')


// malware addition
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


// connecting to the database (note: the database must be turned on before connecting)
mongoose.connect(https, {useUnifiedTopology: true}, function(err, res){
    if(err){
        console.log(err);
    }
    else{
        console.log("connected to the Mongo Database");
    }
});


//===============================================================================================//
//
//                                              Routes
//
//===============================================================================================//   

app.use(postRoutes);
app.use(commentRoute);
app.use(authenticationRoutes);



// ==============================================================================================//

app.listen(PORT, function(){
    console.log("Server started at port: ", PORT);
});

