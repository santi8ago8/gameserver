"use strict";

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/**
 * Created by santi8ago8 on 09/03/15.
 */

var EventEmitter3 = require("./../../sharedcode/eventemitter3").EventEmitter3;
var Logger = require("./engine/logger").Logger;

var Plugin = (function (EventEmitter3) {
    function Plugin() {
        _classCallCheck(this, Plugin);

        _get(Object.getPrototypeOf(Plugin.prototype), "constructor", this).call(this);
        this.logger = new Logger(this.constructor.name);
    }

    _inherits(Plugin, EventEmitter3);

    return Plugin;
})(EventEmitter3);

Plugin.version = 0.1;

module.exports.Plugin = Plugin;
//# sourceMappingURL=plugin.js.map