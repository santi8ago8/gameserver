var io,
    util = require('util');
var SHA256 = require("crypto-js/sha256");
var db = require('./logic/db_init');
var fail = require('./logic/fail_module').Fail;
var Servers = require('./logic/server_list').Servers;
var needle = require('needle');
function init() {
    io.on('connection', function (socket) {
        createEvents(socket);
    })
}

function createEvents(socket) {
    socket.on('login', function (user) {
        //check!
        user.password = SHA256(user.password).toString();
        db.Admin.count(user).exec(function (err, count) {
            if (err) {
                fail.emit('error', err);
            }
            else {
                if (count == 1) {
                    socket.session.isLoged = true;
                    socket.session.username = user.username;
                } else {
                    socket.session.isLoged = false;
                    socket.emit('login_incorrect');
                }
                socket.session.save();
                emitLogin();
            }
        });


    });
    socket.on('delogin', function (data) {
        socket.session.isLoged = false;
        delete socket.session.username;
        socket.session.save();
        emitLogin();
    });
    socket.on('change_password', function (data) {
        //SHA!
        data.password = SHA256(data.password).toString();
        data.newPassword = SHA256(data.newPassword).toString();
        if (socket.session.isLoged) {
            db.Admin.update({
                username: socket.session.username,
                password: data.password
            }, {
                $set: {password: data.newPassword}
            }, {multi: false}).exec(function (err, numAff) {
                if (err)
                    fail.emit('error', err);
                else {
                    if (numAff == 1) {
                        socket.emit('change_password', {changed: true});
                    } else {
                        socket.emit('change_password', {changed: false});
                    }
                }
            })
        }
    });
    socket.on('servers', function (data) {
        if (socket.session.isLoged) {
            socket.emit('servers', Servers.list);
        }
    });
    socket.on('ping', function (server) {
        if (socket.session.isLoged) {
            var data = {date: new Date().getTime()};
            needle.put('http://' + server.ip + ':' + server.port + '/ping', data,
                function (err, resp, body) {
                    if (err)
                        fail.emit('error', err);
                    else {
                        var newTime = new Date().getTime();
                        var ping = (newTime - body.date);
                        server.ping = ping;
                        socket.emit('ping', server);
                    }

                })
        }
    });

    function emitLogin() {
        socket.emit('login', {isLoged: socket.session.isLoged});
    }

    emitLogin();


}


module.exports = function (server, cookieParser, session) {
    io = require('socket.io')(server);

    io.use(function (socket, next) {
        var req = socket.handshake;
        var res = {};
        cookieParser(req, res, function (err) {
            if (err) return next(err);
            session(req, res, next);
        });
    });
    io.use(function (socket, next) {
        socket.session = socket.handshake.session;
        next();
    });

    init();
};