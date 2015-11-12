/**
 * Created by santi8ago8 on 11/11/15.
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var request = require('superagent');
var Plugin = require('./../plugin').Plugin;
var _ = require('lodash');

var Attack = (function (_Plugin) {
    _inherits(Attack, _Plugin);

    function Attack() {
        _classCallCheck(this, Attack);

        _get(Object.getPrototypeOf(Attack.prototype), 'constructor', this).call(this);
    }

    _createClass(Attack, [{
        key: 'enabled',
        value: function enabled(gs) {
            this.logger.info('Attack plugin enabled');
            this.gs = gs;
            this.on('s:hit', this.hit.bind(this));
        }
    }, {
        key: 'hit',
        value: function hit(data, socket) {
            //this.logger.info('hit', data);

            var to = _.find(this.gs._players, { _id: data.to });
            var from = _.find(this.gs._players, { _id: data.sender });

            to.health -= Math.floor(Math.random() * 10);

            if (to.health < 0) {
                to.health = 0;
                //TODO: dieeeee...
            }

            this.gs.plugins.Player.syncHealth(to);
        }
    }]);

    return Attack;
})(Plugin);

Attack.version = 0.1;

module.exports.Attack = Attack;
//# sourceMappingURL=attack.js.map