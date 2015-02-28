var fs = require('fs');
var path = require('path');

var express = require('express');
var router = express.Router();
var mime = require('mime');
var mkdirp = require('mkdirp');

var utils = require('../lib/utils');
var config = require('../config');
var PM = require('../lib/pm');

var pm = new PM();

router.get('/start', function(req, res, next){
    pm.start().then(function(pid){
        res.end("start pm successd");
    }).catch(function(err){
        res.end("start pm failed:" + err);
    });
});











module.exports = router;
