/**
 * Created by santi8ago8 on 15/11/15.
 */

var Plugin = require('./../plugin').Plugin;
let _ = require('lodash');
let uuid = require('node-uuid');

class Mob extends Plugin {
    constructor() {
        super();
        this.coords = {
            x: {from: -440.1, to: 556.01},
            y: {from: 81, to: 82},
            z: {from: -438.1, to: 557.01}
        };
        this.types = [
            //{name: 'raptor', health: 24},
            {name: 'slime', health: 16},
            {name: 'wasp', health: 12}
        ];
    }

    enabled(gs) {
        this.gs = gs;
        this.gs._mobs = [];
        setInterval(this.createMob.bind(this), 400);
        this.on('s:hitmob', this.hitMob.bind(this));
        this.on('player:enter', this.playerEnter.bind(this));
    }

    createMob() {
        if (this.gs._mobs.length < 45) {
            let mob = _.clone(_.sample(this.types));
            _.assign(mob, {
                _id: uuid.v4(),
                t: {
                    p: {
                        x: _.random(this.coords.x.from, this.coords.x.to),
                        y: _.random(this.coords.y.from, this.coords.y.to),
                        z: _.random(this.coords.z.from, this.coords.z.to)
                    }
                }
            });
            this.gs._mobs.push(mob);
            this.gs._io.emit('mobcreate', mob);
        }
    }

    playerEnter(player) {
        _.forEach(this.gs._mobs, (m)=> {
            player.socket.emit('mobcreate', m);
        });

    }

    hitMob(data) {

        let to = _.find(this.gs._mobs, {_id: data.to});
        let from = _.find(this.gs._players, {_id: data.sender});
        if (to && from) {
            let multiply = 1;
            if (data.skill) {
                multiply = data.skill;
            }
            let damage = parseInt(_.random(2, 7 * multiply));
            to.health -= damage;
            data.health = to.health;
            if (to.health <= 0) {
                to.health = 0;
                data.health = 0;
            }
            this.gs._io.emit('mobhit', data);
            if (to.health <= 0) {
                this.gs._io.emit('mobkill', to);
                _.remove(this.gs._mobs, {_id: to._id});
            }
            from.data.health -= Math.floor(1 + Math.random() * 3);

            this.gs.plugins.Player.syncHealth(from);
        }
    }
}

Mob.version = 0.1;

module.exports.Mob = Mob;