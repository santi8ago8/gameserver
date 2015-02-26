var io,
    util = require('util');

function init() {
    io.on('connection', function (socket) {
        createEvents(socket);
    })
}
var comments = [];
function createEvents(socket) {


    socket.on('session_data', function () {
        socket.emit('session_data', {count: socket.session.count, comments: comments});
    });


    socket.on('comment', function (data) {

        if (!socket.session.color) {
            socket.session.color = util.format(
                'rgb(%s,%s,%s)',
                parseInt(Math.random() * 255),
                parseInt(Math.random() * 255),
                parseInt(Math.random() * 255));
        }
        data.color = socket.session.color;
        comments.push(data);

        //important save session.
        socket.session.save();
        io.emit('comment', data);
    });
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