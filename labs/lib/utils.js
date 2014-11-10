var path = require('path');
var md5 = require("MD5");
var Q = require("q");
var fs = require("fs");
var mkdirp = require('mkdirp');

var _ = {};


_.Q = Q;


_.md5File = function(file){
    return Q.Promise(function(resolve, reject, notify){
        fs.readFile(file, function(err, buf){
            if(err) reject(err)
            resolve(md5(buf));
        });
    });
};


_.mv = function(o, dest){
    return Q.Promise(function(resolve, reject){
        var dir = path.dirname(dest);
        mkdirp(dir, function(err){
            if(err) return reject(err);

            fs.rename(o, dest, function(){
                if(err) return reject(err);
                resolve();
            });
        });
    });
};


_.rm = Q.denodeify(fs.unlink);


_.rmdirp = function(dir, limit){

    return Q.Promise(function(resolve, reject){
        var rmdir = function(d) {
            var files = fs.readdirSync(d);
            if (files.length) return resolve();

            fs.rmdir(d, function (err) {
                if (err) return reject(err);
                var parent = path.dirname(d);
                if (limit === undefined) {
                    rmdir(parent);
                } else if (limit === 0) {
                    return resolve();
                } else {
                    limit--;
                    rmdir(parent);
                }
            });
        };
        rmdir(dir);
    });
};

module.exports = _;
