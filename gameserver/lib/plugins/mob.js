'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by santi8ago8 on 15/11/15.
 */

var Plugin = require('./../plugin').Plugin;
var _ = require('lodash');
var uuid = require('node-uuid');

var Mob = function (_Plugin) {
    _inherits(Mob, _Plugin);

    function Mob() {
        _classCallCheck(this, Mob);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Mob).call(this));

        _this.coords = {
            x: { from: -440.1, to: 556.01 },
            y: { from: 81, to: 82 },
            z: { from: -438.1, to: 557.01 }
        };
        _this.types = [
        //{name: 'raptor', health: 24},
        { name: 'slime', health: 16 }, { name: 'wasp', health: 12 }];
        return _this;
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
}(Plugin);

Mob.version = 0.1;

module.exports.Mob = Mob;
//# sourceMappingURL=mob.js.map