'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _player = require('../engine/player.js');

var _player2 = _interopRequireDefault(_player);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by santi8ago8 on 09/03/15.
 */

var request = require('superagent');
var Plugin = require('./../plugin').Plugin;

var _ = require('lodash');

var Player = function (_Plugin) {
    _inherits(Player, _Plugin);

    function Player() {
        _classCallCheck(this, Player);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Player).call(this));

        _this.on('connection', _this.connected);
        return _this;
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

            var player = new _player2.default({
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
            this.gs.triggerPlugin('player:enter', player);

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
            var _this2 = this;

            this.logger.info('connectedddd!!!');
            socket.on('login', function (data) {
                request.post(_this2.gs._config.loginServerUrl + _this2.gs._config.loginServerUrlCheckToken).send({ token: data.token }).end(function (err, resp) {
                    if (err) _this2.gs.logger.error(err);else {
                        (function () {
                            //body.username
                            var body = resp.body;
                            _this2.gs._db.Player.findOne({ username: body.username }, {/*TODO: projection*/}).exec(function (err, resp) {
                                if (!resp) {
                                    var p = new _this2.gs._db.Player({
                                        username: body.username,
                                        token: data.token,
                                        meta: {}
                                    }).save(function (err, player) {

                                        _this2.emitConnected(socket, player.toObject());
                                    });
                                } else {
                                    _this2.emitConnected(socket, resp.toObject());
                                }
                            });
                        })();
                    }
                });
            });
            socket.on('disconnect', function () {

                if (socket.player) {
                    _.remove(_this2.gs._players, { _id: socket.player._id });
                    //emit disconnect, client.
                    _this2.gs._io.emit('deonline', { _id: socket.player._id });
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
            var _this3 = this;

            var data = {
                sender: player._id,
                els: [{ n: 'health', b: 'PlayerUI', v: player.data.health }]
            };
            this.gs._io.emit('sync', data);
            if (player.data.health <= 0) {
                this.gs._io.emit('die', { _id: player._id });
                setTimeout(function () {
                    _this3.gs._io.emit('respawn', { _id: player._id });
                    player.data.health = 100;
                    _this3.syncHealth(player);
                }, 5000);
            }
        }
    }]);

    return Player;
}(Plugin);

Player.version = 0.1;

module.exports.Player = Player;
//# sourceMappingURL=player.js.map