var express = require('express');
const path = require('path');
var uploadDir = path.join( 'public/images/')
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.json());

var User = require('../schemas/user');
var DLNews = require('../schemas/DLNews')
var image_list = [];

var url = "http://192.168.0.130:3000"

/* GET home page. */
router.get('/', function(req, res, next) {
	res.redirect('/login');
});


router.get('/login',function (req,res) {
	res.render('login',{title:'title'})
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

		image_list.push(url +"/images/" + req.body.name);
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
		time: new Date().Format("yyyy-MM-dd")
	})
	console.log(dl);
	dl.save(function(err){
		if (err) {
			console.log(err);
		}
		image_list = [];
		res.send(200);
	});
})

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


router.get('/news',function (req,res) {
	var query_doc ={news_path: req.query.key};
	console.log(query_doc);
	DLNews.find(query_doc,function (err,doc) {
		if (err) {
			console.log(err);
			return res.send(404);
		}
		console.log(doc[0].content);

		res.render('news',{content: doc[0].content })
	})

})





//DLINKERS 客户端
router.get('/getDlNews',function (req,res) {
	DLNews.find({},function (err,docs) {
		if (err) {
			console.log(err);
			return res.send(404);
		}

		res.json({'code':200,"newslist": docs})
	})
})


module.exports = router;
