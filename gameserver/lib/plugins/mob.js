/**
 * Created by santi8ago8 on 15/11/15.
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Plugin = require('./../plugin').Plugin;
var _ = require('lodash');
var uuid = require('node-uuid');

var Mob = (function (_Plugin) {
    _inherits(Mob, _Plugin);

    function Mob() {
        _classCallCheck(this, Mob);

        _get(Object.getPrototypeOf(Mob.prototype), 'constructor', this).call(this);
        this.coords = {
            x: { from: -440.1, to: 556.01 },
            y: { from: 81, to: 82 },
            z: { from: -438.1, to: 557.01 }
        };
        this.types = [
        //{name: 'raptor', health: 24},
        { name: 'slime', health: 16 }, { name: 'wasp', health: 12 }];
    }

    _createClass(Mob, [{
        key: 'enabled',
        value: function enabled(gs) {
            this.gs = gs;
            this.gs._mobs = [];
            setInterval(this.createMob.bind(this), 400);
            this.on('s:hitmob', this.hitMob.bind(this));
            this.on('player:enter', this.playerEnter.bind(this));
        }
    }, {
        key: 'createMob',
        value: function createMob() {
            if (this.gs._mobs.length < 45) {
                var mob = _.clone(_.sample(this.types));
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
    }, {
        key: 'playerEnter',
        value: function playerEnter(player) {
            _.forEach(this.gs._mobs, function (m) {
                player.socket.emit('mobcreate', m);
            });
        }
    }, {
        key: 'hitMob',
        value: function hitMob(data) {

            var to = _.find(this.gs._mobs, { _id: data.to });
            var from = _.find(this.gs._players, { _id: data.sender });
            if (to && from) {
                var multiply = 1;
                if (data.skill) {
                    multiply = data.skill;
                }
                var damage = parseInt(_.random(2, 7 * multiply));
                to.health -= damage;
                data.health = to.health;
                if (to.health <= 0) {
                    to.health = 0;
                    data.health = 0;
                }
                this.gs._io.emit('mobhit', data);
                if (to.health <= 0) {
                    this.gs._io.emit('mobkill', to);
                    _.remove(this.gs._mobs, { _id: to._id });
                }
                from.data.health -= Math.floor(1 + Math.random() * 3);

                this.gs.plugins.Player.syncHealth(from);
            }
        }
    }]);

    return Mob;
})(Plugin);

Mob.version = 0.1;

module.exports.Mob = Mob;
//# sourceMappingURL=mob.js.map