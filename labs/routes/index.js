var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


router.post('/github_hook', function(req, res){
    // github hooks 发送的 post 请求使用的是 applicaiton/json 的 Content Type，因此仅需要读取 req.body 对象即可
    console.log(req.body);

    res.json({code: 22000});
});

module.exports = router;
