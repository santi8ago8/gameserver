/**
 * Created by santi8ago8 on 09/03/15.
 */

let request = require('superagent');
var Plugin = require('./../plugin').Plugin;
import PlayerClass from '../engine/player.js';
let _ = require('lodash');

class Player extends Plugin {
    constructor() {
        super();
        this.on('connection', this.connected);
    }

    enabled(gs) {
        this.logger.info('Player plugin enabled');
        this.gs = gs;
        this.on('s:syncTransform', this.syncTransform.bind(this));
        this.on('s:sync', this.syncVars.bind(this));

    }

    emitConnected(socket, p) {

        let player = new PlayerClass({
            _id: p._id.toString(),
            token: p.token,
            socket: socket,
            data: {
                username: p.username,
                _id: p._id.toString(),
                health: 100
            },
            t: {
                pos: {x: 0, y: 0, z: 0},
                rot: 0
            }
        });
        socket.player = player;
        this.gs._players.push(player);
        this.gs.triggerPlugin('player:enter', player);

        socket.emit('player', player.data);
        this.gs._io.to('lobby').emit('onlinePlayer', player.data);

        _.filter(this.gs._players, (el)=> {
            return player._id != el._id;
        }).forEach((el)=> {
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

    syncTransform(t) {
        //this.logger.info(t);
        let p = _.find(this.gs._players, {_id: t._id});
        p.t = t;

        _.filter(this.gs._players, (p)=> {
            return p._id != t._id;
        }).forEach((p)=> {
            p.socket.emit('syncTransformClient', t);
        });
    }

    connected(socket) {
        this.logger.info('connectedddd!!!');
        socket.on('login', (data)=> {
            request
                .post(this.gs._config.loginServerUrl + this.gs._config.loginServerUrlCheckToken)
                .send({token: data.token})
                .end((err, resp)=> {
                    if (err) this.gs.logger.error(err);
                    else {
                        //body.username
                        let body = resp.body;
                        this.gs._db.Player.findOne({username: body.username}, {/*TODO: projection*/})
                            .exec((err, resp)=> {
                                if (!resp) {
                                    let p = new this.gs._db.Player({
                                        username: body.username,
                                        token: data.token,
                                        meta: {}
                                    }).save((err, player)=> {

                                            this.emitConnected(socket, player.toObject());
                                        })
                                } else {
                                    this.emitConnected(socket, resp.toObject());
                                }

                            })
                    }
                });
        });
        socket.on('disconnect', ()=> {

            if (socket.player) {
                _.remove(this.gs._players, {_id: socket.player._id});
                //emit disconnect, client.
                this.gs._io.emit('deonline', {_id: socket.player._id});
            }

            socket = null;
        });
    }

    syncVars(data, player) {
        data.sender = player._id;

        _.forEach(this.gs._players, (p)=> {
            if (p._id != player._id) {
                //this.logger.debug('to', p._id);
                p.socket.emit('sync', data);
            }
        });
    }

    syncHealth(player) {
        var data = {
            sender: player._id,
            els: [
                {n: 'health', b: 'PlayerUI', v: player.data.health}
            ]
        };
        this.gs._io.emit('sync', data);
        if (player.data.health <= 0) {
            this.gs._io.emit('die', {_id: player._id});
            setTimeout(()=> {
                this.gs._io.emit('respawn', {_id: player._id});
                player.data.health = 100;
                this.syncHealth(player);
            }, 5000);
        }
    }

}


Player.version = 0.1;

module.exports.Player = Player;