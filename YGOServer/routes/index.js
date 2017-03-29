var express = require('express');
var router = express.Router();

let bodyParser = require('body-parser');

router.use(bodyParser.json());

var User = require('../schemas/user');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.redirect('/login');
});


router.get('/login',function (req,res) {
	res.render('login',{title:''})
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

module.exports = router;
