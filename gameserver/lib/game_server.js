'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter3 = require("./../../sharedcode/eventemitter3").EventEmitter3;
var extend = require('util-extend');
var request = require('superagent');
var fail = require('./../../sharedcode/failmodule').Fail;
var DBEngine = require('./../../sharedcode/dbengine').DBEngine;
var uuid = require('node-uuid');
var _ = require('lodash');
var bodyParser = require('body-parser');
var Logger = require('./engine/logger').Logger;

var GameServer = (function (_EventEmitter3) {
    _inherits(GameServer, _EventEmitter3);

    function GameServer(config) {
        _classCallCheck(this, GameServer);

        _get(Object.getPrototypeOf(GameServer.prototype), 'constructor', this).call(this);

        this._config = {
            name: 'gameserver 1',
            location: 'Argentina',
            description: 'Firs game server!',
            ip: '192.168.1.106',
            port: 3001,
            protocol: 'ws',
            loginServerUrl: 'http://127.0.0.1:3000',
            loginServerUrlRegister: '/servers/register',
            loginServerUrlCheckToken: '/users/check_token',
            password: 'fad4a46b-dbdd-4ade-a62e-c071bf75e476-10aec1ba-895d-4ce2-a81a-6a0f6bd792c0',
            serverPassword: uuid.v4() + uuid.v4() + uuid.v4(), //don't change!
            maxPlayers: 100,
            dbUrl: 'mongodb://localhost:27017/GameServer',
            dbCollectionName: 'GameServer3001'
        };
        this.open = false;
        this._config = extend(this._config, config);
        this._players = [];
        this._plugins = [];
        this.logger = new Logger(this.constructor.name);
        this.connectDB();
        this.createServer();
    }

    _createClass(GameServer, [{
        key: 'connectLoginServer',
        value: function connectLoginServer() {
            var _this = this;

            request.put(this._config.loginServerUrl + this._config.loginServerUrlRegister).send(this._config).end(function (err, res) {
                if (err) fail.emit('error', err);else {
                    var body = res.body;
                    if (body.result == 'added' || body.result == 'updated') {
                        _this.emit('create');
                    }
                }
            });
        }
    }, {
        key: 'createServer',
        value: function createServer() {
            var _this2 = this;

            this.emitpre('create', function (err) {
                if (err) {
                    fail.emit('error', err);
                } else {
                    var app = _this2._app = require('express')();
                    app.use(bodyParser.json());
                    app.use(bodyParser.urlencoded({ extended: false }));
                    var http = require('http').Server(app);
                    _this2._server = http;

                    app.get('/', function (req, res) {
                        res.json({
                            port: _this2._config.port,
                            ip: _this2._config.ip
                        });
                    });
                    app.put('/ping', function (req, res) {
                        req.body.open = _this2.open;
                        res.json(req.body);
                    });

                    app.put('/server/start', function (req, res) {
                        return _this2.start(req, res);
                    });
                    app.put('/server/stop', function (req, res) {
                        return _this2.stop(req, res);
                    });

                    http.listen(_this2._config.port, function () {
                        _this2.logger.info('listening on *:' + _this2._config.port);
                        _this2.connectLoginServer();
                    });

                    //require('./engine.player').Player
                    require('./engine/socket').Sockets(_this2);
                }
            });
        }
    }, {
        key: 'start',
        value: function start(req, res) {
            var _this3 = this;

            var result = { started: true };
            if (req.body.serverPassword == this._config.serverPassword) {
                this.emitpre('start', function (err) {
                    if (err) {
                        fail.emit('error', err);
                    } else {
                        _this3.open = true;
                        _this3.logger.info('started!');
                        //create socket server.

                        _this3.emit('start');
                    }
                });
            } else {

                result.started = false;
            }
            res.json(result);
        }
    }, {
        key: 'stop',
        value: function stop(req, res) {
            var _this4 = this;

            var result = { stopped: true };
            if (req.body.serverPassword == this._config.serverPassword) {
                this.emitpre('stop', function (err) {
                    if (err) {
                        fail.emit('error', err);
                    } else {
                        _this4.open = false;
                        _this4.logger.info('stopped!');
                        //stop socket server, disconnect users.

                        _this4.emit('stop');
                    }
                });
            } else {

                result.stopped = false;
            }
            res.json(result);
        }
    }, {
        key: 'connectDB',
        value: function connectDB() {
            var dbengine = new DBEngine(this._config.dbUrl);
            this._db = {};
            var userPlayer = dbengine.mongoose.Schema({
                username: { type: String, required: true },
                token: { type: String },
                meta: { type: dbengine.mongoose.Schema.Types.Mixed }
            });

            this._db.Player = dbengine.mongoose.model(this._config.dbCollectionName, userPlayer);
        }
    }, {
        key: 'triggerPlugin',
        value: function triggerPlugin(evName, d) {
            var args = arguments;
            //this.logger.debug(evName);
            _.forEach(this._plugins, function (p, i) {
                p.emit.apply(p, args);
            });
        }
    }, {
        key: 'registerPlugin',
        value: function registerPlugin(pluginInstance) {
            this._plugins.push(pluginInstance);
            pluginInstance.emit('enabled', this);
            this.logger.info(pluginInstance.constructor.name + ' ' + pluginInstance.constructor.version + ' enabled');
        }
    }]);

    return GameServer;
})(EventEmitter3);

module.exports.GameServer = GameServer;
//# sourceMappingURL=game_server.js.map