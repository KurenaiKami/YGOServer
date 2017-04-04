var express = require('express');
const path = require('path');
var uploadDir = path.join( 'public/images/')
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.json());

var User = require('../schemas/user');
var DLNews = require('../schemas/DLNews')
var image_list = [];

/* GET home page. */
router.get('/', function(req, res, next) {
	res.redirect('/login');
});


router.get('/login',function (req,res) {
	res.render('login',{title:'121212'})
})

//登录后台
router.post('/login',function (req,res) {
	var query_doc ={username: req.body.name,password: req.body.password};

	User.count(query_doc,function (err,doc) {
		res.contentType('json');//返回的数据类型
		if (doc == 1)
		{
			 res.send(200)
		}
		else {
			 res.send(201)
		}
	})

})

router.get("/admin",function(req,res){
	res.render('index', { title: 'Express' });
})


router.post("/upload",function (req,res) {
	image_list = [];
	if (!req.files) {
		return res.status(400).send('No files were uploaded')
	}

	console.log(req.body);
	var sampleFile = req.files.file;
  var uploadPath = path.join(uploadDir, req.body.name);
	// Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function(err) {
    if (err)
      console.log(err);

		image_list.push("127.0.0.1:3000/images/" + req.body.name);
    res.send('File uploaded!');
  });

})


//编辑资讯
router.post('/dlnews',function(req,res){
	var dl = new DLNews({
		title: req.body.title,
		author: req.body.author,
		content: req.body.content,
		image_list: image_list,
		news_path: req.body.webpath,
	})
	console.log(dl);
	dl.save(function(err){
		if (err) {
			console.log(err);
		}
	});
	res.send(200);
})


router.get('/news',function (req,res) {
	var query_doc ={news_path: req.query.key};
	console.log(query_doc);
	console.log('***');
	DLNews.find(query_doc,function (err,doc) {
		if (err) {
			console.log(err);
			return res.send(404);
		}
		console.log(doc[0].content);

		res.render('news',{content: doc[0].content })
	})

})


module.exports = router;
