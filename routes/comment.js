var express = require('express');
var router = express.Router();
var post = require('../models/post');
var Comment = require('../models/comment');

// add new commnet to the post
router.get('/show/:id/comments/new', isLoggedIn, function(req, res){
    post.findById(req.params.id, function(err, data){
        if (err){
            console.log(err);
        }
        else{
            res.render('comment/newcomment', {post: data});
        }
    });
});

// Routes for adding comments in a post

router.post("/show/:id/comments", function(req, res){
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
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    postData.comments.push(comment);
                    postData.save();
                    console.log(comment);
                    res.redirect('/show/' + postData._id);
                }
            });
        }
    });

});



// Route to delete Comment

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};

module.exports = router;  