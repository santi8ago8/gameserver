"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * Created by santi8ago8 on 09/03/15.
 */

var colors = require("colors/safe");
var debug = require("debug");
var moment = require("moment");

var Logger = (function () {
    function Logger(name) {
        _classCallCheck(this, Logger);

        this.name = name;
        this.deb = debug("gs:" + name);
    }

    _prototypeProperties(Logger, null, {
        info: {
            value: function info(msg) {
                this.deb(this.addTemplate(msg, colors.green("info")));
            },
            writable: true,
            configurable: true
        },
        warn: {
            value: function warn(msg) {
                this.deb(this.addTemplate(msg, colors.yellow("warn")));
            },
            writable: true,
            configurable: true
        },
        debug: {
            value: function debug(msg) {
                this.deb(this.addTemplate(msg, colors.blue("debu")));
            },
            writable: true,
            configurable: true
        },
        error: {
            value: function error(msg) {
                var stack = arguments[1] === undefined ? true : arguments[1];

                if (stack) {
                    msg = msg + " " + new Error().stack;
                }
                this.deb(this.addTemplate(msg, colors.red("erro")));
            },
            writable: true,
            configurable: true
        },
        addTemplate: {
            value: function addTemplate(msg, type) {
                var m = new moment().format("HH:mm");
                return "[" + m + "] [" + type + "] " + msg;
            },
            writable: true,
            configurable: true
        }
    });

    return Logger;
})();

module.exports.Logger = Logger;
//# sourceMappingURL=logger.js.map