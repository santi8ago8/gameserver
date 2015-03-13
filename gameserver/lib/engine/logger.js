"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * Created by santi8ago8 on 09/03/15.
 */

var debug = typeof process.env.DEBUG == "string" ? true : false;

var colors = require("colors/safe");
var moment = require("moment");

var Logger = (function () {
    function Logger(name) {
        _classCallCheck(this, Logger);

        this.name = name;
    }

    _prototypeProperties(Logger, null, {
        info: {
            value: function info(msg) {
                if (debug) {
                    console.log(this.addTemplate(msg, colors.green("info")));
                }
            },
            writable: true,
            configurable: true
        },
        warn: {
            value: function warn(msg) {
                if (debug) {
                    console.log(this.addTemplate(msg, colors.yellow("warn")));
                }
            },
            writable: true,
            configurable: true
        },
        debug: {
            value: (function (_debug) {
                var _debugWrapper = function debug(_x) {
                    return _debug.apply(this, arguments);
                };

                _debugWrapper.toString = function () {
                    return _debug.toString();
                };

                return _debugWrapper;
            })(function (msg) {
                if (debug) {
                    console.log(this.addTemplate(msg, colors.blue("debu")));
                }
            }),
            writable: true,
            configurable: true
        },
        error: {
            value: function error(msg) {
                var stack = arguments[1] === undefined ? true : arguments[1];

                if (debug) {
                    if (stack) {
                        msg = msg + " " + new Error().stack;
                    }
                    console.log(this.addTemplate(msg, colors.red("erro")));
                }
            },
            writable: true,
            configurable: true
        },
        addTemplate: {
            value: function addTemplate(msg, type) {
                var m = new moment().format("HH:mm");
                return "[" + m + "] [" + type + "] [" + this.name + "] " + msg;
            },
            writable: true,
            configurable: true
        }
    });

    return Logger;
})();

module.exports.Logger = Logger;
//# sourceMappingURL=logger.js.map