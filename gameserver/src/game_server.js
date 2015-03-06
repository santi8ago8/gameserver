var EventEmitter3 = require("./../../sharedcode/eventemitter3").EventEmitter3;
var extend = require('util-extend');
var needle = require('needle');
var fail = require('./../../sharedcode/failmodule');
var DBEngine = require('./../../sharedcode/dbengine').DBEngine;
var uuid = require('node-uuid');
var bodyParser = require('body-parser');

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
        this._config = extend(this._config, config);
        this._players = [];
        this.connectDB();
        this.createServer();
    }

    connectLoginServer() {
        needle.put(
            this._config.loginServerUrl + this._config.loginServerUrlRegister,
            this._config, {json: true}, (err, resp, body)=> {
                if (err)
                    fail.emit('error', err);
                else {
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

                app.get('/', (req, res) => {
                    res.json({
                        port: this._config.port,
                        ip: this._config.ip
                    });
                });
                app.put('/ping', (req, res) => {
                    res.json(req.body);
                });

                app.put('/server/start', (req, res)=>this.start(req, res));
                app.put('/server/stop', (req, res)=>this.stop(req, res));

                http.listen(this._config.port, () => {
                    console.log('listening on *:' + this._config.port + '\n' + this._config.serverPassword);
                    this.connectLoginServer();
                });
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
                    console.log('started!');
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
                    console.log('stopped!');
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
        var userSchema = dbengine.mongoose.Schema({
            username: {type: String, required: true},
            token: {type: String},
            name: {type: String, required: true},
            meta: {type: dbengine.mongoose.Schema.Types.Mixed}
        });

        this._db.User = dbengine.mongoose.model(this._config.dbCollectionName, userSchema);
    }
}

new GameServer();