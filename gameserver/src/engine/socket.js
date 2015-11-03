/**
 * Created by santi8ago8 on 06/03/15.
 */
let _ = require('lodash');
let pending = [];

module.exports.Sockets = (gameServer)=> {

    var io = gameServer._io = require('socket.io')(gameServer._server);

    gameServer._io.on('connection', function (socket) {

        gameServer.triggerPlugin('connection', socket);

        socket.on('hello', (name)=> {
            console.log(name);
            setInterval(()=> {
                console.log("emit hello");
                socket.emit('helloempty');
                //TODO. rem
                socket.emit("hello", {greet: `Hello ${name}`});
            }, 1000);

        });

        socket.on("c", (commands)=> {
            _.forEach(commands, (c)=> {
                pending.push(c);
            })
        });

    });
    gameServer._io.use(function (socket, next) {
        console.log('a user connected middleware');
        //TODO: check max players.
        if (gameServer.open) {
            next();
            socket.emit('login');
        }
        else { 
            next(new Error('Game server close'));
        }
    });

    setInterval(()=> {
        _.forEach(pending, (c)=> {
            gameServer.triggerPlugin("s:" + c.c, c.d);
        });
        pending = [];
    }, 1000 / 60);
};

