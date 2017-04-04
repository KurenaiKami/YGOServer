var mongoose = require('mongoose');


var DLSchema = new mongoose.Schema({
	title:String,
	author: String,
  news_path: String,
  image_list:{
    type: Array,
    'default': []
  },
	content: String
})

module.exports = mongoose.model('dl_news', DLSchema);
