var express         = require('express'),
    router          = express.Router(),
    post            = require('../models/post'),
    Comment         = require('../models/comment'),
    middleware      = require('../middleware/index');

//---------------------------------------------------------------------------------------//
//
//                                      Routes
//
//---------------------------------------------------------------------------------------//

// add new commnet to the post
router.get('/show/:id/comments/new', middleware.isLoggedIn, function(req, res){
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

// Route to edit comment
router.get('/show/:id/comments/:comment_id/edit', middleware.commentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, commentdata){
        if(err){
            res.redirect("back");
        }
        else{
            res.render("comment/editcomment", {post_id:req.params.id, comment:commentdata});
        }
    });
    
});

//Route to update comment
router.put('/show/:id/comments/:comment_id', middleware.commentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedcomment){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect('/show/' + req.params.id);
        }
    });
});

// Route to delete Comment
router.delete('/show/:id/comments/:comment_id', middleware.commentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }
        else{
            console.log("comment deleted");
            res.redirect("/show/" + req.params.id);
        }
    });
});



module.exports = router;  