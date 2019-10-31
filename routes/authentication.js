var express             = require('express'),
    router              = express.Router(),
    User                = require('../models/user'),
    passport            = require('passport');

//===============================================================================================//
//
//                                      Routes
//
//===============================================================================================//   

// route for login
router.get('/login', function(req, res){
    res.render('login');
});

router.post('/login', passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }) , function(req, res){
    
});

//route for registering a new user
router.get('/register', function(req,res){
    res.render('register');
});

router.post('/register', function(req, res){
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
router.get('/logout', function(req,res){
    req.logout();
    res.redirect("/");
});

//===============================================================================================//
//
//                           Functions
//
//===============================================================================================//   

// Authentication function
function AuthenticateUser(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
};

module.exports = router;