/**
 * Created by santi8ago8 on 09/03/15.
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var colors = require('colors/safe');
var debug = require('debug');
var moment = require('moment');

var Logger = (function () {
    function Logger(name) {
        _classCallCheck(this, Logger);

        this.name = name;
        this.deb = debug('gs:' + name);
    }

    _createClass(Logger, [{
        key: 'info',
        value: function info(msg) {
            this.deb(this.addTemplate(msg, colors.green('info')));
        }
    }, {
        key: 'warn',
        value: function warn(msg) {
            this.deb(this.addTemplate(msg, colors.yellow('warn')));
        }
    }, {
        key: 'debug',
        value: function debug(msg) {
            this.deb(this.addTemplate(msg, colors.blue('debu')));
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
        value: function addTemplate(msg, type) {
            var m = new moment().format('HH:mm');
            return '[' + m + '] [' + type + '] ' + msg;
        }
    }]);

    return Logger;
})();

module.exports.Logger = Logger;
//# sourceMappingURL=logger.js.map