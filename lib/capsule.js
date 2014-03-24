'use strict';

var fs = require('fs');
var SSH = require('simple-ssh');
var _ = require('underscore');
var colors = require('colors');

var capsule = function() {};

capsule.prototype.init = function() {
    var targetFile = process.cwd() + '/capsule.json',
        sourceFile = __dirname + '/../templates/capsule.json';

    fs.writeFileSync(targetFile, fs.readFileSync(sourceFile));
};

capsule.prototype.connect = function(server) {
    var ssh = new SSH({
        host: server.host,
        port: server.port || 22,
        user: server.user,
        pass: server.password,
        baseDir: server.location
    });

    ssh.on('error', function(err) {
        var message = err.toString();
        console.log(message.red);
        ssh.end();
    });

    ssh.on('success', function() {
        console.log('Success');
    });

    return ssh;
};

capsule.prototype.parseConfig  = function(target){
    var config = require(process.cwd() + '/capsule.json');

    if (config[target] === undefined) {
        process.exit('Error uundefined server');
    }

    var params = {};
    params.server = config[target].server;
    params.git_server = config[target].repository;
    params.directory = _.now();
    params.full_path =  params.server.location + '/' +   params.directory;
    params.git_branch = config[target].repository.branch || 'master';

    return params;
};

capsule.prototype.deploy = function(target) {
    var params = this.parseConfig(target),
        ssh = this.connect(params.server),
        capsule = this;

    ssh
        .exec('mkdir', {
            args: [params.directory],
            out: console.log,
        })
        .exec('git clone', {
            args: [params.git_server.host, params.directory, '-b ' + params.git_branch],
            out: function(stdout) {
                if(stdout !== undefined) {
                    console.log(stdout);
                }
                capsule.simlink(params.server, params.full_path);
                capsule.setOwner(params.server, params.full_path);
            },
        })
        .start();
};

capsule.prototype.simlink = function(server, destination) {
    var ssh = this.connect(server);

    ssh
        .exec('ln -nfs', {
            args: [destination, server.simlink],
            out: console.log
        })
        .start();
};

capsule.prototype.setOwner = function(server, target) {
    var ssh = this.connect(server);

    ssh
        .exec('chown -R', {
            args: [server.user_group, target],
            out: console.log
        })
        .start();
}

capsule.prototype.rollback = function(target) {
    var params = this.parseConfig(target),
        ssh = this.connect(params.server),
        capsule = this;

    ssh
        .exec('ls', {
            out: function(lists) {
                var files = lists.split('\n');
                files = _.compact(files);
                files.sort(function(a, b) {
                    return a < b;
                });

                var current = (files[0]) ? params.server.location + '/' + files[0] : null,
                    prev = (files[1]) ? params.server.location + '/' +  files[1] : null;

                capsule.simlink(params.server, prev);
                capsule.deleteDir(params.server, current);
            }
        })
        .start();
};

capsule.prototype.deleteDir = function(server, target) {
    var ssh = this.connect(server);

    ssh
        .exec('rm -rf', {
            args: [target],
            out: console.log
        })
        .start();
};

module.exports.capsule = capsule;