/**
 * Created by santi8ago8 on 06/03/15.
 */
'use strict';

var _ = require('lodash');
var pending = [];

module.exports.Sockets = function (gameServer) {

    var io = gameServer._io = require('socket.io')(gameServer._server);

    gameServer._io.on('connection', function (socket) {

        gameServer.triggerPlugin('connection', socket);

        socket.on('hello', function (name) {
            console.log(name);
            setInterval(function () {
                console.log("emit hello");
                socket.emit('helloempty');
                //TODO. rem
                socket.emit("hello", { greet: 'Hello ' + name });
            }, 1000);
        });

        socket.on("c", function (commands) {
            _.forEach(commands, function (c) {
                pending.push(c);
            });
        });
    });
    gameServer._io.use(function (socket, next) {
        console.log('a user connected middleware');
        //TODO: check max players.
        if (gameServer.open) {
            next();
            socket.emit('login');
        } else {
            next(new Error('Game server close'));
        }
    });

    setInterval(function () {
        _.forEach(pending, function (c) {
            gameServer.triggerPlugin("s:" + c.c, c.d);
        });
        pending = [];
    }, 1000 / 60);
};
//# sourceMappingURL=socket.js.map