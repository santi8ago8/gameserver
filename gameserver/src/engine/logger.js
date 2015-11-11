/**
 * Created by santi8ago8 on 09/03/15.
 */

import _ from 'lodash';
var colors = require('colors/safe');
var debug = require('debug');
var moment = require('moment');


class Logger {
    constructor(name) {
        this.name = name;
        this.deb = debug('gs:' + name);
    }

    _process(type, args) {
        var els = [this.addTemplate(type)];

        _.forEach(args, (it)=> {
            els.push(it);
        });

        this.deb.apply(this, els);
    }

    info(msg) {
        this._process('info', arguments);
    }


    warn(msg) {
        //this.deb(this.addTemplate(msg, colors.yellow('warn')));
        this._process('warn', arguments);
    }

    debug(msg) {
        //this.deb(this.addTemplate(msg, colors.blue('debu')));
        this._process('debu', arguments);
    }

    error(msg, stack = true) {
        if (stack) {
            msg = msg + " " + new Error().stack;
        }
        this.deb(this.addTemplate(msg, colors.red('erro')));

    }

    addTemplate(type) {
        var m = new moment().format('HH:mm');
        return `[${m}] [${type}]`;
    }

}

module.exports.Logger = Logger;