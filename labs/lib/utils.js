var path = require('path');
var md5 = require("MD5");
var Promise = require("bluebird");
var fs = require("fs");
var mkdirp = require('mkdirp');
var kit = require('nokit');
var exec = require('child_process').exec;

var _ = {};

_.kit = kit;

_.Promise = Promise;

_.kill = function(pid){
    return new Promise(function(resolve, reject){
        exec("kill " + pid, function(err, stdout, stderr){
            if(err) {
                // Error: Command failed: /bin/sh: line 0: kill: (186012) - No such process
                resolve(err);
            }else{
                resolve(stdout);
            }
        });
    });
};

_.md5File = function(file){
    return new Promise(function(resolve, reject){
        fs.readFile(file, function(err, buf){
            if(err) reject(err)
            resolve(md5(buf));
        });
    });
};


_.mv = function(o, dest){
    return new Promise(function(resolve, reject){
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


//_.rm = Q.denodeify(fs.unlink);


_.rmdirp = function(dir, limit){

    return new Promise(function(resolve, reject){
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
