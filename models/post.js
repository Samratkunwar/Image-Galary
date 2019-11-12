var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    name: String,
    message: String,
    image: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comments"
        }
    ]
});

module.exports = mongoose.model("Post", postSchema );