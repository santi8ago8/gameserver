"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var EventEmitter3 = require("./../../sharedcode/eventemitter3").EventEmitter3;
var extend = require("util-extend");
var needle = require("needle");
var fail = require("./../../sharedcode/failmodule");
var DBEngine = require("./../../sharedcode/dbengine").DBEngine;
var uuid = require("node-uuid");
var bodyParser = require("body-parser");
var Logger = require("./engine/logger").Logger;

var GameServer = (function (EventEmitter3) {
    function GameServer(config) {
        _classCallCheck(this, GameServer);

        _get(Object.getPrototypeOf(GameServer.prototype), "constructor", this).call(this);

        this._config = {
            name: "gameserver 1",
            location: "Argentina",
            description: "Firs game server!",
            ip: "192.168.1.106",
            port: 3001,
            protocol: "ws",
            loginServerUrl: "http://127.0.0.1:3000",
            loginServerUrlRegister: "/servers/register",
            loginServerUrlCheckToken: "/users/check_token",
            password: "fad4a46b-dbdd-4ade-a62e-c071bf75e476-10aec1ba-895d-4ce2-a81a-6a0f6bd792c0",
            serverPassword: uuid.v4() + uuid.v4() + uuid.v4(), //don't change!
            maxPlayers: 100,
            dbUrl: "mongodb://localhost:27017/GameServer",
            dbCollectionName: "GameServer3001"
        };
        this.open = false;
        this._config = extend(this._config, config);
        this._players = [];
        this._plugins = [];
        this.logger = new Logger(this.constructor.name);
        this.connectDB();
        this.createServer();
    }

    _inherits(GameServer, EventEmitter3);

    _prototypeProperties(GameServer, null, {
        connectLoginServer: {
            value: function connectLoginServer() {
                var _this = this;

                needle.put(this._config.loginServerUrl + this._config.loginServerUrlRegister, this._config, { json: true }, function (err, resp, body) {
                    if (err) fail.emit("error", err);else {
                        if (body.result == "added" || body.result == "updated") {
                            _this.emit("create");
                        }
                    }
                });
            },
            writable: true,
            configurable: true
        },
        createServer: {
            value: function createServer() {
                var _this = this;

                this.emitpre("create", function (err) {
                    if (err) {
                        fail.emit("error", err);
                    } else {
                        var app = _this._app = require("express")();
                        app.use(bodyParser.json());
                        app.use(bodyParser.urlencoded({ extended: false }));
                        var http = require("http").Server(app);
                        _this._server = http;

                        app.get("/", function (req, res) {
                            res.json({
                                port: _this._config.port,
                                ip: _this._config.ip
                            });
                        });
                        app.put("/ping", function (req, res) {
                            req.body.open = _this.open;
                            res.json(req.body);
                        });

                        app.put("/server/start", function (req, res) {
                            return _this.start(req, res);
                        });
                        app.put("/server/stop", function (req, res) {
                            return _this.stop(req, res);
                        });

                        http.listen(_this._config.port, function () {
                            _this.logger.info("listening on *:" + _this._config.port);
                            _this.connectLoginServer();
                        });

                        //require('./engine.player').Player
                        require("./engine/socket").Sockets(_this);
                    }
                });
            },
            writable: true,
            configurable: true
        },
        start: {
            value: function start(req, res) {
                var _this = this;

                var result = { started: true };
                if (req.body.serverPassword == this._config.serverPassword) {
                    this.emitpre("start", function (err) {
                        if (err) {
                            fail.emit("error", err);
                        } else {
                            _this.open = true;
                            _this.logger.info("started!");
                            //create socket server.

                            _this.emit("start");
                        }
                    });
                } else {

                    result.started = false;
                }
                res.json(result);
            },
            writable: true,
            configurable: true
        },
        stop: {
            value: function stop(req, res) {
                var _this = this;

                var result = { stopped: true };
                if (req.body.serverPassword == this._config.serverPassword) {
                    this.emitpre("stop", function (err) {
                        if (err) {
                            fail.emit("error", err);
                        } else {
                            _this.open = false;
                            _this.logger.info("stopped!");
                            //stop socket server, disconnect users.

                            _this.emit("stop");
                        }
                    });
                } else {

                    result.stopped = false;
                }
                res.json(result);
            },
            writable: true,
            configurable: true
        },
        connectDB: {
            value: function connectDB() {
                var dbengine = new DBEngine(this._config.dbUrl);
                this._db = {};
                var userPlayer = dbengine.mongoose.Schema({
                    username: { type: String, required: true },
                    token: { type: String },
                    name: { type: String, required: true },
                    meta: { type: dbengine.mongoose.Schema.Types.Mixed }
                });

                this._db.Player = dbengine.mongoose.model(this._config.dbCollectionName, userPlayer);
            },
            writable: true,
            configurable: true
        },
        registerPlugin: {
            value: function registerPlugin(pluginInstance) {
                this._plugins.push(pluginInstance);
                pluginInstance.emit("enabled", this);
                this.logger.info(pluginInstance.constructor.name + " " + pluginInstance.constructor.version + " enabled");
            },
            writable: true,
            configurable: true
        }
    });

    return GameServer;
})(EventEmitter3);

module.exports.GameServer = GameServer;
//# sourceMappingURL=game_server.js.map