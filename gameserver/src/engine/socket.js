/**
 * Created by santi8ago8 on 06/03/15.
 */

let request = require('superagent');

module.exports.Sockets = (gameServer)=> {

    var io = gameServer._io = require('socket.io')(gameServer._server);

    gameServer._io.on('connection', function (socket) {
        console.log('a user connected');

        socket.on('hello', (name)=> {
            console.log(name);
            setInterval(()=> {
                console.log("emit hello");
                socket.emit('helloempty');
                //TODO. rem
                socket.emit("hello", {greet: `Hello ${name}`});
            }, 1000);

        });

        socket.on('login', (data)=> {
            if (data.playerList) {
                //go to login server.
                request
                    .post(gameServer._config.loginServerUrl + gameServer._config.loginServerUrlCheckToken)
                    .send({token: data.token})
                    .end((err, resp)=> {
                        if (err) gameServer.logger.error(err);
                        else {
                            //body.username
                            let body = data.body;
                            gameServer._db.Player.find({owner: body.username}, {/*TODO: projection*/})
                                .exec((err, resp)=> {
                                    socket.emit('playerList', resp);
                                })
                        }
                    });

            } else if (data.playerId) {
                //TODO: find the player in the db, check if player is online.

            }
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
    })
};