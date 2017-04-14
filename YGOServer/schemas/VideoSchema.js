var mongoose = require('mongoose')

var VideoSchema = new mongoose.Schema({
  title: String,
  author:String,
  video: String,
  image: String,
})

module.exports = mongoose.model('videos', VideoSchema);
