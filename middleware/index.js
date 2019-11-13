var middlewareObj           = {},
    Comment                 = require('../models/comment'),
    post                    = require('../models/post');


//Middlewares

middlewareObj.postOwnership = function(req, res, next){
    if(req.isAuthenticated()){
            
        post.findById(req.params.id).populate("comments").exec(function(err, userspost){
            if(err){
                res.redirect("back");
            }
            else{
                if(userspost.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash('error', 'you are not authorized!');
                    res.redirect("back");
                }
            }
            });
    }
    else{
        res.redirect("back");
    }
};

middlewareObj.commentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        
        Comment.findById(req.params.comment_id, function(err, userscomment){
            if(err){
                res.redirect("back");
            }
            else{
                
                if(userscomment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    res.send("you are not authorized!");
                }
            }
        });
    }
    else{
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to be logged-in first!');
    res.redirect('/login');
};


module.exports = middlewareObj;