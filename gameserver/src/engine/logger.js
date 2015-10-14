/**
 * Created by santi8ago8 on 09/03/15.
 */


var colors = require('colors/safe');
var debug = require('debug');
var moment = require('moment');


class Logger {
    constructor(name) {
        this.name = name;
        this.deb = debug('gs:' + name);
    }


    info(msg) {
        this.deb(this.addTemplate(msg, colors.green('info')));
    }


    warn(msg) {
        this.deb(this.addTemplate(msg, colors.yellow('warn')));

    }

    debug(msg) {
        this.deb(this.addTemplate(msg, colors.blue('debu')));

    }

    error(msg, stack = true) {
        if (stack) {
            msg = msg + " " + new Error().stack;
        }
        this.deb(this.addTemplate(msg, colors.red('erro')));

    }

    addTemplate(msg, type) {
        var m = new moment().format('HH:mm');
        return `[${m}] [${type}] ${msg}`;
    }

}

module.exports.Logger = Logger;