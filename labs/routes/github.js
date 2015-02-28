var fs = require('fs');
var path = require('path');
var querystring = require('querystring');

var express = require('express');
var router = express.Router();
var mime = require('mime');
var request = require('request');

var utils = require('../lib/utils');
var config = require('../config');

/**
 * github api 相关
 */
router.get('/oauth_callback', function(req, res, next){
    console.log(req.url);
    console.log(req.query);

    var code = req.query.code;
    if(!code){ return res.json({errCode: 22001, msg: "no code param specified"}) }

    delete req.query.code;
    var redirectParam = req.query;
    /**
     * 调用 github api 获取 access_token
     * @see [Github OAuth 文档]{@link https://developer.github.com/v3/oauth/}
     */
    var options = {
        uri: 'https://github.com/login/oauth/access_token',
        method: 'POST',
        form: {
            client_id: 'bfaa94b476a91ae70830',
            client_secret: '1f73d55a0e545916c9b41b3b3ce3ec6f13caaa8f',
            code: code
        },
        headers: {
            'Accept': 'application/json'
        }
    };

    request(options, function(err, response, body){
        if(!err && response.statusCode == 200){
            try{
                var data = JSON.parse(body);
                if(data.access_token){
                    redirectParam.access_token = data.access_token;
                    res.redirect(302, config.github.redirect_url + '?' + querystring.stringify(redirectParam));
                }else{
                    res.json({errorCode: 22001, data: data});
                }
            }catch (e){
                return res.json({errorCode: 22001, msg: "github response not valid json!"});
            }
        }else{
            return res.json({errorCode: 220001, msg: "gen access_token failed" + err});
        }
    });


});


router.get('/', function(req, res, next){
    res.json({
        code: 22000,
        msg: 'github'
    });
});



function PostCode(codestring) {
    // Build the post string from an object
    var post_data = querystring.stringify({
        'compilation_level' : 'ADVANCED_OPTIMIZATIONS',
        'output_format': 'json',
        'output_info': 'compiled_code',
        'warning_level' : 'QUIET',
        'js_code' : codestring
    });

    // An object of options to indicate where to post to
    var post_options = {
        host: 'closure-compiler.appspot.com',
        port: '80',
        path: '/compile',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length
        }
    };

    // Set up the request
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();

}


module.exports = router;
