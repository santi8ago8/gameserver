var EventEmitter3 = require("./../../sharedcode/eventemitter3").EventEmitter3;
var extend = require('util-extend');
var request = require('superagent');
var fail = require('./../../sharedcode/failmodule').Fail;
var DBEngine = require('./../../sharedcode/dbengine').DBEngine;
var uuid = require('node-uuid');
var bodyParser = require('body-parser');
var Logger = require('./engine/logger').Logger;

class GameServer extends EventEmitter3 {
    constructor(config) {
        super();

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

    connectLoginServer() {
        request
            .put(this._config.loginServerUrl + this._config.loginServerUrlRegister)
            .send(this._config)
            .end((err, res)=> {
                if (err) fail.emit('error', err);
                else {
                    let body = res.body;
                    if (body.result == 'added' || body.result == 'updated') {
                        this.emit('create')
                    }
                }
            });
    }

    createServer() {
        this.emitpre('create', (err) => {
            if (err) {
                fail.emit('error', err);
            } else {
                var app = this._app = require('express')();
                app.use(bodyParser.json());
                app.use(bodyParser.urlencoded({extended: false}));
                var http = require('http').Server(app);
                this._server = http;

                app.get('/', (req, res) => {
                    res.json({
                        port: this._config.port,
                        ip: this._config.ip
                    });
                });
                app.put('/ping', (req, res) => {
                    req.body.open = this.open;
                    res.json(req.body);
                });

                app.put('/server/start', (req, res)=>this.start(req, res));
                app.put('/server/stop', (req, res)=>this.stop(req, res));


                http.listen(this._config.port, () => {
                    this.logger.info('listening on *:' + this._config.port);
                    this.connectLoginServer();
                });


                //require('./engine.player').Player
                require('./engine/socket').Sockets(this);

            }
        });

    }

    start(req, res) {
        var result = {started: true};
        if (req.body.serverPassword == this._config.serverPassword) {
            this.emitpre('start', (err)=> {
                if (err) {
                    fail.emit('error', err);
                }
                else {
                    this.open = true;
                    this.logger.info('started!');
                    //create socket server.

                    this.emit('start');
                }
            });


        } else {

            result.started = false;
        }
        res.json(result);
    }

    stop(req, res) {
        var result = {stopped: true};
        if (req.body.serverPassword == this._config.serverPassword) {
            this.emitpre('stop', (err)=> {
                if (err) {
                    fail.emit('error', err);
                }
                else {
                    this.open = false;
                    this.logger.info('stopped!');
                    //stop socket server, disconnect users.

                    this.emit('stop');
                }
            });
        } else {

            result.stopped = false;
        }
        res.json(result);
    }

    connectDB() {
        var dbengine = new DBEngine(this._config.dbUrl);
        this._db = {};
        var userPlayer = dbengine.mongoose.Schema({
            username: {type: String, required: true},
            token: {type: String},
            name: {type: String, required: true},
            meta: {type: dbengine.mongoose.Schema.Types.Mixed}
        });

        this._db.Player = dbengine.mongoose.model(this._config.dbCollectionName, userPlayer);
    }

    registerPlugin(pluginInstance) {
        this._plugins.push(pluginInstance);
        pluginInstance.emit('enabled', this);
        this.logger.info(pluginInstance.constructor.name + ' ' + pluginInstance.constructor.version + ' enabled');
    }

}

module.exports.GameServer = GameServer;