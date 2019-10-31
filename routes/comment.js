var express = require('express');
var router = express.Router();
var post = require('../models/post');
var Comment = require('../models/comment');


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
                    postData.comments.push(comment);
                    postData.save();
                    res.redirect('/show/' + postData._id);
                }
            });
        }
    });

});



// Route to delete Comment


module.exports = router;  