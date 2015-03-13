"use strict";

/**
 * Created by santi8ago8 on 06/03/15.
 */

var needle = require("needle");

module.exports.Sockets = function (gameServer) {
    var io = gameServer._io = require("socket.io")(gameServer._server);

    gameServer._io.on("connection", function (socket) {
        console.log("a user connected");

        socket.on("login", function (data) {
            if (data.playerList) {
                //go to login server.
                needle.post(gameServer._config.loginServerUrl + gameServer._config.loginServerUrlCheckToken, { token: data.token }, function (err, resp, body) {
                    if (err) gameServer.logger.error(err);else {
                        //body.username
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
//find the player in the db.
//# sourceMappingURL=socket.js.map