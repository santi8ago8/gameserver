"use strict";

/**
 * Created by santi8ago8 on 09/03/15.
 */

var GameServer = require("./game_server").GameServer;

var config = {
    name: "gameserver dev",
    location: "Argentina",
    description: "Firs game server!",
    ip: "192.168.1.109",
    port: 3001,
    loginServerUrl: "http://127.0.0.1:3000",
    loginServerUrlRegister: "/servers/register",
    loginServerUrlCheckToken: "/users/check_token",
    password: "fad4a46b-dbdd-4ade-a62e-c071bf75e476-10aec1ba-895d-4ce2-a81a-6a0f6bd792c0", //to login server.
    maxPlayers: 100,
    dbUrl: "mongodb://localhost:27017/GameServer",
    dbCollectionName: "GameServer3001"
};

var gameServer = new GameServer(config);

var ExamplePlug = require("./plugins/example").ExamplePlug;

gameServer.registerPlugin(new ExamplePlug());
//# sourceMappingURL=initializer.js.map