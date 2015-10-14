"use strict";

/**
 * Created by santi8ago8 on 06/03/15.
 */

var request = require("superagent");

module.exports.Sockets = function (gameServer) {

    var io = gameServer._io = require("socket.io")(gameServer._server);

    gameServer._io.on("connection", function (socket) {
        console.log("a user connected");

        socket.on("hello", function (name) {
            console.log(name);
            setInterval(function () {
                console.log("emit hello");
                socket.emit("helloempty");
                //TODO. rem
                socket.emit("hello", { greet: "Hello " + name });
            }, 1000);
        });

        socket.on("login", function (data) {
            if (data.playerList) {
                //go to login server.
                request.post(gameServer._config.loginServerUrl + gameServer._config.loginServerUrlCheckToken).send({ token: data.token }).end(function (err, resp) {
                    if (err) gameServer.logger.error(err);else {
                        //body.username
                        var body = data.body;
                        gameServer._db.Player.find({ owner: body.username }, {}).exec(function (err, resp) {
                            socket.emit("playerList", resp);
                        });
                    }
                });
            } else if (data.playerId) {}
        });
    });
    gameServer._io.use(function (socket, next) {
        console.log("a user connected middleware");
        //TODO: check max players.
        if (gameServer.open) {
            next();
            socket.emit("login");
        } else {
            next(new Error("Game server close"));
        }
    });
};
/*TODO: projection*/
//TODO: find the player in the db, check if player is online.
//# sourceMappingURL=socket.js.map