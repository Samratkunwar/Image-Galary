var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    },
    text: String
});

module.exports = mongoose.model("Comments", commentSchema );