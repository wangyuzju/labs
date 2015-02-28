var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var utils = require('./utils');
var conf = require('../config.js');

var kit = utils.kit;
var Promise = utils.Promise;

var PID_OUTPUT = conf.path.runtime + '/proxy_pid';


/**
 * 进程管理
 * TODO  将子进程 pid 写入文件中存储起来，防止 fork 模式下的子进程无法正常退出
 */
var PM = function(){

};


PM.prototype._start = function () {
    this.stop();

    var child = this.child = spawn('node', ['process/proxy.js']);
    this.pid = child.pid

    // 假设不考虑子进程无法退出的情况
    child.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });
    child.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });
    child.on('close', function (code) {
        console.log('child process exited with code ' + code);
    });
};


PM.prototype.start = function(){
    return Promise.resolve().bind(this)
        .then(this.startupClearPid)
        .then(this._start)
        .then(this.savePid);
};

PM.prototype.savePid = function(){
    var pid = this.child.pid;
    if (pid) {
        return kit.writeFile(PID_OUTPUT, pid);
    }
};

/**
 * kill 未正常退出的子进程
 * @returns {*}
 */
PM.prototype.startupClearPid = function(){
    var self = this;

    return new Promise(function(resolve, reject){
        if(self._cleared){
            return resolve();
        }

        kit.readFile(PID_OUTPUT, 'utf-8').then(function(data){
            if(!data){ return resolve(); }
            console.log('killing...' + data);
            utils.kill(data).then(resolve).catch(function(err){
                console.log('killing failed!', err);
                reject('killing failed ...' + err);
            });
        });
    });
};

/**
 * 根据记录的 pid，终止子进程
 */
PM.prototype.stop = function(){
    // TODO this.pid ;
    this.child && this.child.kill();
};


/**
 * 绑定子进程的输入输出事件，捕获有用信息
 */
PM.prototype.captureOutput = function(){
    if (!this.child){
        return;
    }

};



PM.prototype.bind = function(){
};


module.exports = PM;
