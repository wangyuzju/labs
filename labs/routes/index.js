var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


router.post('/github_hook', function(req, res){
    console.log(req.params);
    console.log(req.body);
    
    res.json({code: 22000});
});

module.exports = router;
