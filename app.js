var PORT = 3000;
var https = "mongodb/localhost:27017/gallery";
var images = [
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

// -------------------------- Routes ----------------------------

app.get('/', function(req,res){
    res.render('home', {images:images});
})

app.post('/newimage', function(req,res){
    var name = req.body.name;
    var message = req.body.message;
    var image = req.body.image;
    var newimage = {name:name, message:message, image:image};
    images.push(newimage);
    console.log('new image added to the collection.');
    res.redirect("/");
});

// --------------------------------------------------------------

app.listen(PORT, function(){
    console.log("Server started at port: ", PORT);
});