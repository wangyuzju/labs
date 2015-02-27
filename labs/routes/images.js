var fs = require('fs');
var path = require('path');

var express = require('express');
var router = express.Router();
var mime = require('mime');
var mkdirp = require('mkdirp');

var utils = require('../lib/utils');
var config = require('../config');


/* GET users listing. */
router.get('/', function(req, res) {
    res.render('image/index', { title: 'Express' });
});


// 将上传的图片存放到 /uploads/image 目录下面
router.post('/upload', function(req, res, next){
    var uploadFile = req.files && req.files.file;
    if(!uploadFile){res.json({code: 22001})}

    // 已经包含了 config 文件中的 upload_file_path
    var tmpFilePath = uploadFile.path;
    var ext = mime.extension(uploadFile.mimetype);

    var category = req.param('target') || 'test';

    utils.md5File(tmpFilePath).then(function(hash){
        var filename = hash;
        var pathPrefix = filename.slice(0,2) + '/' + filename.slice(2,4) + '/' + filename.slice(4,6);
        var outputPath = path.resolve(path.dirname(tmpFilePath), '../image/' + category, pathPrefix);
        var outputName = filename.slice(6) + '.' + ext;
        var publicLink = '/upload/image/' + category + '/' + pathPrefix + '/' + outputName;

        utils.mv(tmpFilePath, outputPath+'/'+outputName).then(function(){

            res.json({code: 22000, data: {
                id: hash,
                link: publicLink,
                category: category
            }});
        }).error(function(err){
            next(err);
        });
    });

});


router.get('/delete', function(req, res, next){
    var link = req.query.link;
    var realPath = config.path.upload + link.replace(/^\/upload/, '');

    utils.kit.unlink(realPath).then(function(){
        res.json({code: 22000});
        // 检查删除多余的文件目录
        return utils.rmdirp(path.dirname(realPath), 3).catch(function(err){
            console.log(err);
        });
    }).catch(function(err){
        // 文件不存在的错误码为34, 返回删除结果成功
        if(err.errno !== 34){
            res.json({code: 22001});
        }else{
            res.json({code: 22000});
        }
    }).done();
});

module.exports = router;

//router.param(function(name, fn){
//    if (fn instanceof RegExp) {
//        return function(req, res, next, val){
//            var captures;
//            if (captures = fn.exec(String(val))) {
//                req.params[name] = captures;
//                next();
//            } else {
//                next('route');
//            }
//        }
//    }
//});
//
//router.param('hash', /^\w+$/);
