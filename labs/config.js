//var path = require('path');

var dev = {
    path: {
        upload: __dirname + "/../uploads",
        runtime: __dirname + '/../runtime'
    },
    github: {
        redirect_url: "http://127.0.0.1:4000"
    }
};

var prod = {
};


var config = dev;


module.exports = config;
