/**
 * Created by santi8ago8 on 09/03/15.
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _enginePlayerJs = require('../engine/player.js');

var _enginePlayerJs2 = _interopRequireDefault(_enginePlayerJs);

var request = require('superagent');
var Plugin = require('./../plugin').Plugin;

var _ = require('lodash');

var Player = (function (_Plugin) {
    _inherits(Player, _Plugin);

    function Player() {
        _classCallCheck(this, Player);

        _get(Object.getPrototypeOf(Player.prototype), 'constructor', this).call(this);
        this.on('connection', this.connected);
    }

    _createClass(Player, [{
        key: 'enabled',
        value: function enabled(gs) {
            this.logger.info('Player plugin enabled');
            this.gs = gs;
            this.on('s:syncTransform', this.syncTransform.bind(this));
            this.on('s:sync', this.syncVars.bind(this));
        }
    }, {
        key: 'emitConnected',
        value: function emitConnected(socket, p) {

            var player = new _enginePlayerJs2['default']({
                _id: p._id.toString(),
                token: p.token,
                socket: socket,
                data: {
                    username: p.username,
                    _id: p._id.toString(),
                    health: 100
                },
                t: {
                    pos: { x: 0, y: 0, z: 0 },
                    rot: 0
                }
            });
            socket.player = player;
            this.gs._players.push(player);

            socket.emit('player', player.data);
            this.gs._io.to('lobby').emit('onlinePlayer', player.data);

            _.filter(this.gs._players, function (el) {
                return player._id != el._id;
            }).forEach(function (el) {
                player.socket.emit('onlinePlayer', el.data);

                socket.emit('syncTransformClient', {
                    _id: el._id,
                    pos: el.t.pos,
                    rot: el.t.rot
                });
            });

            socket.join('lobby');

            this.syncHealth(player);
        }
    }, {
        key: 'syncTransform',
        value: function syncTransform(t) {
            //this.logger.info(t);
            var p = _.find(this.gs._players, { _id: t._id });
            p.t = t;

            _.filter(this.gs._players, function (p) {
                return p._id != t._id;
            }).forEach(function (p) {
                p.socket.emit('syncTransformClient', t);
            });
        }
    }, {
        key: 'connected',
        value: function connected(socket) {
            var _this = this;

            this.logger.info('connectedddd!!!');
            socket.on('login', function (data) {
                request.post(_this.gs._config.loginServerUrl + _this.gs._config.loginServerUrlCheckToken).send({ token: data.token }).end(function (err, resp) {
                    if (err) _this.gs.logger.error(err);else {
                        (function () {
                            //body.username
                            var body = resp.body;
                            _this.gs._db.Player.findOne({ username: body.username }, {/*TODO: projection*/}).exec(function (err, resp) {
                                if (!resp) {
                                    var p = new _this.gs._db.Player({
                                        username: body.username,
                                        token: data.token,
                                        meta: {}
                                    }).save(function (err, player) {

                                        _this.emitConnected(socket, player.toObject());
                                    });
                                } else {
                                    _this.emitConnected(socket, resp.toObject());
                                }
                            });
                        })();
                    }
                });
            });
            socket.on('disconnect', function () {

                if (socket.player) {
                    _.remove(_this.gs._players, { _id: socket.player._id });
                    //emit disconnect, client.
                    _this.gs._io.emit('deonline', { _id: socket.player._id });
                }

                socket = null;
            });
        }
    }, {
        key: 'syncVars',
        value: function syncVars(data, player) {
            data.sender = player._id;

            _.forEach(this.gs._players, function (p) {
                if (p._id != player._id) {
                    //this.logger.debug('to', p._id);
                    p.socket.emit('sync', data);
                }
            });
        }
    }, {
        key: 'syncHealth',
        value: function syncHealth(player) {
            var _this2 = this;

            var data = {
                sender: player._id,
                els: [{ n: 'health', b: 'PlayerUI', v: player.data.health }]
            };
            this.gs._io.emit('sync', data);
            if (player.data.health <= 0) {
                this.gs._io.emit('die', { _id: player._id });
                setTimeout(function () {
                    _this2.gs._io.emit('respawn', { _id: player._id });
                    player.data.health = 100;
                    _this2.syncHealth(player);
                }, 5000);
            }
        }
    }]);

    return Player;
})(Plugin);

Player.version = 0.1;

module.exports.Player = Player;
//# sourceMappingURL=player.js.map