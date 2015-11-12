/**
 * Created by santi8ago8 on 09/03/15.
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var colors = require('colors/safe');
var debug = require('debug');
var moment = require('moment');
var process = require('process');
var log = process.env.DEBUG;
log = typeof log === 'string' && log.indexOf('gs:') != -1;

var Logger = (function () {
    function Logger(name) {
        _classCallCheck(this, Logger);

        this.name = name;
        this.deb = debug('gs:' + name);
    }

    _createClass(Logger, [{
        key: '_process',
        value: function _process(type, args) {
            if (!log) return;
            var els = [this.addTemplate(type)];

            _lodash2['default'].forEach(args, function (it) {
                els.push(it);
            });

            console.log.apply(this, els);
        }
    }, {
        key: 'info',
        value: function info(msg) {
            this._process('info', arguments);
        }
    }, {
        key: 'warn',
        value: function warn(msg) {
            //this.deb(this.addTemplate(msg, colors.yellow('warn')));
            this._process('warn', arguments);
        }
    }, {
        key: 'debug',
        value: function debug(msg) {
            //this.deb(this.addTemplate(msg, colors.blue('debu')));
            this._process('debu', arguments);
        }
    }, {
        key: 'error',
        value: function error(msg) {
            var stack = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

            if (stack) {
                msg = msg + " " + new Error().stack;
            }
            this.deb(this.addTemplate(msg, colors.red('erro')));
        }
    }, {
        key: 'addTemplate',
        value: function addTemplate(type) {
            var m = new moment().format('HH:mm');
            return '[' + m + '] [' + type + ']';
        }
    }]);

    return Logger;
})();

module.exports.Logger = Logger;
//# sourceMappingURL=logger.js.map