// variables 

var PORT = 3000;
var https = "mongodb://localhost:27017/gallery";

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer');
var path = require('path');

// importing models from post and comment class
var post = require('./models/post.js');
var Comment = require('./models/comment.js')

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// connecting the css to html
app.use(express.static(__dirname + '/public'));


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
    // var image = fs.readFileSync(req.file.path);
    // var encoded_image = image.toString('base64');
    // var image = req.body.image;
    // var newimage = {
    //     name:name, 
    //     message:message, 
    //     image: new Buffer(encoded_image, 'base64') 
    // };
    // post.create(newimage, function(err, newdata){
    //    if(err){
    //        console.log(err);
    //    }
    //    else{
    //         console.log('new image added to the collection.');
    //         console.log(newdata)
    //         res.redirect("/");
    //    }
    // });

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


// --------------------------------------------------------------

app.listen(PORT, function(){
    console.log("Server started at port: ", PORT);
});


/*

1. think of a way to authenticate user


*/

