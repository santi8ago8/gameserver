var path = require('path');
var chalk = require('chalk');

module.exports = function (grunt) {
    // Do grunt-related things in here

    require('time-grunt')(grunt);
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-nodemon');

    var jsFiles = require('./config').getMinified();//minified.
    var jsToMinimize = require('./config').getEngineScripts(); // to minify
    var pathJsFiles = path.join('./public', require('./config').getProdPath()); //prod js path.

    var gruntConfig = {
        uglify: {
            toProd: {
                files: {

                }
            }
        },
        nodemon: {
            dev: {
                script: 'bin/www',
                options: {
                    callback: function (nodemon) {
                        nodemon.on('start', function () {
                            setTimeout(function () {
                                livereloadserver(grunt).restart();
                            }, 400);
                        })
                    }
                }
            }
        },
        'node-inspector': {
            dev: {}
        }


    };
    gruntConfig.uglify.toProd.files[pathJsFiles] = jsToMinimize;

    grunt.initConfig(gruntConfig);

    grunt.registerTask('livereloadserver', function () {
        livereloadserver(grunt);
    });

    grunt.registerTask('addMinifiedFiles', function () {
        var result = '';
        jsFiles.forEach(function (f) {
            result += (grunt.file.read(('.' + f)).toString('utf8') + '\n');
        });

        result += (grunt.file.read(pathJsFiles).toString('utf8') + '\n');
        result = result.split('# sourceMappingURL=').join(' ');
        grunt.file.write(pathJsFiles, result, {encoding: 'utf8'});
        grunt.log.ok('Change var env = \'dev\'; to \'prod\' to serve js production files. ' + chalk.red('file: ./config.js'));

    });

    grunt.registerTask('addPublicPrefix', function () {
        for (var i = 0; i < jsToMinimize.length; i++) {
            jsToMinimize[i] = path.join('./public/', jsToMinimize[i]);
        }
        grunt.log.ok(chalk.blue(jsToMinimize.length) + ' files with public prefix')
    });

    grunt.registerTask('debug', function () {
        //grunt.loadNpmTasks('grunt-node-inspector');
        //grunt.task.run('node-inspector');

        var done = this.async();
        grunt.util.spawn({
                cmd: 'node',
                args: ['--debug', 'bin/www'],
                opts: {
                    //cwd: current working directory
                }
            },
            function (error, result, code) {
                if (error) {
                    grunt.log.write(result);
                    grunt.fail.fatal(error);
                }
                done();
            });
        grunt.log.writeln('Node process started');
        grunt.util.spawn({
                cmd: 'node-inspector',
                args: ['&'],
                opts: {
                    //cwd: current working directory
                }
            },
            function (error, result, code) {
                if (error) {
                    grunt.log.write(result);
                    grunt.fail.fatal(error);
                }
                done();
            });
        var url = 'http://127.0.0.1:8080/debug?port=5858';
        grunt.log.writeln('Inspector started: ' + chalk.green(url));
        setTimeout(function () {
            require("open")(url);
        }, 500)
    });

    grunt.registerTask('jsProd', ['addPublicPrefix', 'uglify:toProd', 'addMinifiedFiles']);
    grunt.registerTask('serve', ['livereloadserver', 'nodemon:dev']);


};


var http = require('http').Server();
var io = require('socket.io')(http);
var once = true;

function livereloadserver(grunt) {
    if (once) {
        once = false;

        io.on('connection', function (socket) {
        });

        var port = 6868;
        http.listen(port, function () {
            grunt.log.ok('Live reload server listening on *: ' + chalk.green(port));
        });
    }
    return {
        restart: function () {
            io.emit('restart');
        }
    }
}