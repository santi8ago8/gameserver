'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by santi8ago8 on 11/11/15.
 */

var request = require('superagent');
var Plugin = require('./../plugin').Plugin;
var _ = require('lodash');

var Attack = function (_Plugin) {
    _inherits(Attack, _Plugin);

    function Attack() {
        _classCallCheck(this, Attack);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Attack).call(this));
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
            var multiply = 1;
            if (data.skill) {
                multiply = data.skill;
            }

            if (to && from) {

                to.data.health -= Math.floor(1 + Math.random() * 10 * multiply);

                if (to.data.health < 0) {
                    to.data.health = 0;
                    //TODO: dieeeee...
                }

                this.gs.plugins.Player.syncHealth(to);
            }
        }
    }]);

    return Attack;
}(Plugin);

Attack.version = 0.1;

module.exports.Attack = Attack;
//# sourceMappingURL=attack.js.map