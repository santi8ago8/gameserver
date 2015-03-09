"use strict";

/**
 * Created by santi8ago8 on 06/03/15.
 */
module.exports.Sockets = function (gameServer) {
    var io = gameServer._io = require("socket.io")(gameServer._server);

    gameServer._io.on("connection", function (socket) {
        console.log("a user connected");
    });
    gameServer._io.use(function (socket, next) {
        console.log("a user connected middleware");
        if (gameServer.open) next();else {
            next(new Error("Game server close"));
        }
    });
};
//# sourceMappingURL=socket.js.map