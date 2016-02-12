'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by santi8ago8 on 09/03/15.
 */

var EventEmitter3 = require("./../../sharedcode/eventemitter3").EventEmitter3;
var Logger = require('./engine/logger').Logger;

var Plugin = function (_EventEmitter) {
    _inherits(Plugin, _EventEmitter);

    function Plugin() {
        _classCallCheck(this, Plugin);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Plugin).call(this));

        _this.logger = new Logger(_this.constructor.name);
        _this.on('enabled', _this.enabled);
        return _this;
    }

    _createClass(Plugin, [{
        key: 'enabled',
        value: function enabled() {}
    }]);

    return Plugin;
}(EventEmitter3);

Plugin.version = 0.1;

module.exports.Plugin = Plugin;
//# sourceMappingURL=plugin.js.map