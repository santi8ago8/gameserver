/**
 * Created by santi8ago8 on 09/03/15.
 */

var EventEmitter3 = require("./../../sharedcode/eventemitter3").EventEmitter3;
var Logger = require('./engine/logger').Logger;


class Plugin extends EventEmitter3 {
    constructor() {
        super();
        this.logger = new Logger(this.constructor.name);
    }

}

Plugin.version = 0.1;

module.exports.Plugin = Plugin;