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

//routes for landing page
router.get('/', function(req, res){
    res.render('landingpage');
});

// route to open to the home page
router.get('/index', function(req,res){
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

// route to add new post page
router.get('/newpost', isLoggedIn, function( req, res){
    res.render("newpost");
})

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
                var name = req.user.username;
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
                        res.redirect("/index");
                    }
                });
            }
            
        }
    });

});

// Route to direct user to update page
router.get('/show/:id/edit', function(req, res){
    
    post.findById(req.params.id).populate("comments").exec(function(err, post){
        if(err){
            console.log(err);
        }
        else{
            console.log(post);
            res.render("updatepost", {post:post});
        }
    });
    
});

// Route to update the posts
router.put('/show/:id', function(req, res){
 
    upload(req, res, function(err){
        if (err){
            console.log(err);
        }
        else{
            var name = '';
            var image = '';
            post.findById(req.params.id, function(err, selecteddata){
                if (err){
                    console.log(err);
                }
                else{
                    console.log('here');
                    name = selecteddata.name; 
                    if (req.file == undefined){
                        image = selecteddata.image;
                    }
                    else{
                        image = req.file.filename;
                    }
                    var message = req.body.message;
                    var updatedpost = {
                        name : name,
                        message : message,
                        image: image
                    };
                    post.findByIdAndUpdate(req.params.id, updatedpost, function(err, selectedpost){
                        if(err){
                            console.log(err);
                            res.redirect('/index');
                        }
                        else{
                            console.log(selectedpost);
                            res.redirect('/show/' + req.params.id);
                        }
                    });
                }
            });
        }

    });
});

// Route to delete the post



function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};

module.exports =  router;