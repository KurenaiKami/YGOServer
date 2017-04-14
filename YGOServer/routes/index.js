var express = require('express');
const path = require('path');
var uploadDir = path.join( 'public/images/')
var uploadVideo = path.join( 'public/videos/')
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.json());

var User = require('../schemas/user');
var DLNews = require('../schemas/DLNews');
var Videos = require("../schemas/VideoSchema")

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
	res.render('index',{menu: 'news',newsdata:{}});
})

router.get('/video',function (req,res) {
	res.render('Video/VideoView.html',{})
})

router.get('/editnews',function (req,res) {
	res.render('index',{menu: "list",newsdata:{}})
})

router.get('/viewnews',function (req,res) {
	var query_doc = {_id: req.query.id};
	DLNews.find(query_doc,function (err,doc) {
		console.log(doc);
		if (err) {
			res.json(err);
		}
		else {
			res.render('index',{newsdata: doc[0],menu: "editor"})
		}

	})
})

router.get('/videolist',function (req,res) {
	res.render('Video/VideoGrid');
})

router.post("/upload",function (req,res) {
	if (!req.files) {
		return res.status(400).send('No files were uploaded')
	}
	var sampleFile = req.files.files;
	if (sampleFile.mimetype == 'video/mp4') {
		uppath = uploadVideo;
	}
	else {
		uppath = uploadDir;
	}
  var uploadPath = path.join(uppath, sampleFile.name);
	// Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function(err) {
    if (err)
		{
      console.log(err);
			res.send(404);
		}
    res.send("");
  });

})

//******************************************DL相关*************************************
//编辑资讯
router.post('/dlnews',function(req,res){
	var dl = new DLNews({
		title: req.body.title,
		author: req.body.author,
		content: req.body.content,
		image_list: req.body.image_list,
		news_path: req.body.webpath,
		time: new Date().Format("yyyy-MM-dd"),
		type: req.body.type,
	})
	console.log(dl);
	dl.save(function(err){
		if (err) {
			res.json({code: '201',error: err});
		}
		res.send(200);
	});
})

router.post('/changedlnews',function (req,res) {
	title = req.body.title;
	author = req.body.author;
	content = req.body.content;
	image_list = req.body.image_list;
	news_path = req.body.webpath;
	type = req.body.type;
	time = new Date().Format("yyyy-MM-dd");
	id = req.body.id;
	DLNews.update({_id: id},{"$set":{
		title: title,
		author: author,
		content: content,
		image_list: image_list,
		news_path: news_path,
		time: time,
		type: type
	} },function (err) {
		if (err) {
			res.json(err);
		}
		res.send(200);
	})

})

router.get('/removenews',function (req,res) {
	var query_doc = {_id: req.query.id};
	DLNews.findByIdAndRemove(query_doc,function (err) {
		if (err) {
			res.json(err);
		}
		else
		{
			res.render('index',{menu: "list",newsdata:{}} )
		}
	})
})


router.get('/removevideos',function (req,res) {
	Videos.findByIdAndRemove({_id: req.query.id},function (err) {
		if (err) {
			res.json(err);
		}
		else{
			res.render('Video/VideoGrid',{});
		}
	})
})

router.post('/video',function (req,res) {
	var video = new Videos({
		title: req.body.title,
		author: req.body.author,
		video: req.body.video,
		image: req.body.image
	});

	video.save(function (err) {
		if (err) {
			res.json(err);
		}
		else {
			res.send(200);
		}
	})

})



/////////////////////////////////////编辑相关///////////////////////////////////////

//查看数据
router.get('/getlist',function (req,res) {
	var page = req.query.id || 1;
	var query = DLNews.find({});
	limitpage = 10;
	query.skip((page - 1) * limitpage);
	query.limit(limitpage);
	query.exec(function (err,docs) {
		if (err) {
			res.json(err);
		}
		else {
			DLNews.find(function (err,result) {
				if (err) {
					res.json(err);
				}
				else {
					var  totalPages=0;
					if(result.length%limitpage==0)
					{
					    totalPages=result.length/limitpage;
					}
					else
					{
					    totalPages=parseInt(result.length/limitpage)+1;
					}
					data = {currentpage: parseInt(page), totalpage: totalPages ,newslist: docs}
					res.json(data);
				}

			})
		}
	})
})

router.get('/getvideolist',function (req,res) {
	var page = req.query.id || 1;
	var query = Videos.find({});
	limitpage = 10;
	query.skip((page - 1) * limitpage);
	query.limit(limitpage);
	query.exec(function (err,docs) {
		if (err) {
			res.json(err);
		}
		else {
			Videos.find(function (err,result) {
				if (err) {
					res.json(err);
				}
				else {
					var  totalPages=0;
					if(result.length%limitpage==0)
					{
					    totalPages=result.length/limitpage;
					}
					else
					{
					    totalPages=parseInt(result.length/limitpage)+1;
					}
					data = {currentpage: parseInt(page), totalpage: totalPages ,newslist: docs}
					res.json(data);
				}

			})
		}
	})
})


//tools
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

//查看页面
router.get('/news',function (req,res) {
	var query_doc ={news_path: req.query.key};
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
	console.log("*****************");
	DLNews.find({},function (err,docs) {
		if (err) {
			console.log(err);
			return res.send(404);
		}

		res.json({'code':200,"newslist": docs})
	})
})


module.exports = router;
