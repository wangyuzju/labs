var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


router.get('/github_hook', function(req, res){
    console.log(req.params);
    res.end({code: 22000});
});

module.exports = router;
