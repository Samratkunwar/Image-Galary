var express             = require('express'),
    router              = express.Router(),
    post                = require('../models/post'),
    multer              = require('multer');
    path                = require('path');

//===============================================================================================//
//
//                           Creating a virtual link for image storage
//
//===============================================================================================//    


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

//===============================================================================================//
//
//                                                 Routes
//
//===============================================================================================//   

// route to open to the home page
router.get('/', function(req,res){
    post.find({}, function(err, post){
        if (err){
            console.log(err);
        }else{
            
            res.render("index", {images:post})
        }
    });
});

// route to show individual post
router.get("/show/:id", function(req, res){
    
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
router.post('/newimage', function(req,res){

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


module.exports =  router;