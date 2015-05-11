//var path = require('path');

var dev = {
    path: {
        upload: __dirname + "/../uploads",
        runtime: __dirname + '/../runtime'
    },
    github: {
        redirect_url: "http://blog.hellofe.com"
    }
};

var prod = {
};


var config = dev;


module.exports = config;
