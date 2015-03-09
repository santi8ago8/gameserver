/**
 * Created by santi8ago8 on 09/03/15.
 */

var debug = typeof (process.env.DEBUG) == 'string' ? true : false;
var colors = require('colors/safe');
var moment = require('moment');


class Logger {
    constructor(name) {
        this.name = name;
    }


    info(msg) {
        if (debug) {
            console.log(this.addTemplate(msg, colors.green('info')));
        }
    }

    warn(msg) {
        if (debug) {
            console.log(this.addTemplate(msg, colors.yellow('warn')));
        }
    }

    debug(msg) {
        if (debug) {
            console.log(this.addTemplate(msg, colors.blue('debu')));
        }
    }

    error(msg, stack = true) {
        if (debug) {
            if (stack) {
                msg = msg + " " + new Error().stack;
            }
            console.log(this.addTemplate(msg, colors.red('erro')));
        }
    }

    addTemplate(msg, type) {
        var m = new moment().format('HH:mm');
        return `[${m}] [${type}] [${this.name}] ${msg}`;
    }

}

module.exports.Logger = Logger;