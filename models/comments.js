var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    name: String,
    comments: String
});

module.exports = mongoose.model("Comments", commentSchema );