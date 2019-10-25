var PORT = 3000;
var https = "mongodb://localhost:27017/gallery";
var dummy_data = [
    {name: "Erza", image:"http://www.babyzuzu.com/wp-content/uploads/2019/03/Baby-Born-Low-Key-Photography.jpg"},
    {name: "John", image:"https://render.fineartamerica.com/images/rendered/default/print/6.000/8.000/break/images/artworkimages/medium/1/beautiful-sensual-portrait-of-a-couple-black-and-white-awen-fine-art-prints.jpg"},
    {name:"" , image:"https://render.fineartamerica.com/images/rendered/default/poster/8/10/break/images/artworkimages/medium/1/romantic-sensual-portrait-of-man-and-woman-embracing-black-and-w-awen-fine-art-prints.jpg"},
    {name:"", image:"https://i.pinimg.com/originals/d4/91/44/d49144e6f4638f1ca39a0effe0c6371d.jpg"}
];

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// connecting the css to html
app.use(express.static(__dirname + '/public'));

// connecting to the database (note: the database must be turned on before connecting)
mongoose.connect(https, function(err, res){
    if(err){
        console.log(err);
    }
    else{
        console.log("connected to the Mongo Database");
    }
});

// -------------------------- Schema ----------------------------

var icolllectionSchema = new mongoose.Schema({
    name: String,
    message: String,
    image: String

});

var icommentSchema = new mongoose.Schema({
    name: String,
    comment: String
});

var postCommnetSchema = new mongoose.Schema({
    postid: Object,
    commnetid: Object
});

var Icollection = mongoose.model("icollection", icolllectionSchema);
var Icomment = mongoose.model("icomment", icommentSchema);
var postComment = mongoose.model('postComments', postCommnetSchema);

// -------------------------- Routes ----------------------------

// route to open to the home page
app.get('/', function(req,res){
    Icollection.find({}, function(err, Icollection){
        if (err){
            console.log(err);
        }else{
            res.render("index", {images:Icollection})
        }
    });
});

// route to show individual post
app.get("/show/:id", function(req, res){
    
    Icollection.findById(req.params.id, function(err, post){
        if(err){
            console.log(err);
        }
        else{
            res.render("show", {post:post});
        }
    });
});

// route for creating new image postin the collection
app.post('/newimage', function(req,res){
    var name = req.body.name;
    var message = req.body.message;
    var image = req.body.image;
    var newimage = {name:name, message:message, image:image};
    Icollection.create(newimage, function(err, newdata){
       if(err){
           console.log(err);
       }
       else{
            console.log('new image added to the collection.');
            console.log(newdata)
            res.redirect("/");
       }
    });

});

// Route to update the post

// Route to delete the post


// Routes for adding comments in a post
app.post('/comments', function(req, res){
    var postid = req.body.postid;
    var commentor = req.body.username;
    var comment = req.body.comment;
    var newcomment = {name:commentor, comment:comment};
    Icomment.create(newcomment, function(err, ncomment){
        if (err){
            console.log(err);
        }
        else{
            
            console.log('comment added to post with id:', postid);

            // create a link between comment and post table
            var comid = ncomment.id
            var pcomment = { postid:postid, commnetid:comid };
            postComment.create(pcomment, function(err, npostcomment){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("brance created");
                }
            });

            // think of a way to redirect back to the same post
        }
        
    })
});

// Route to delete Comment


// --------------------------------------------------------------

app.listen(PORT, function(){
    console.log("Server started at port: ", PORT);
});


/*

1. think of a way to authenticate user
2. think of a way to upload file/image


*/

