var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    name: String,
    message: String,
    image: String,
    comments: {}
});

module.exports = mongoose.model("Post", postSchema );