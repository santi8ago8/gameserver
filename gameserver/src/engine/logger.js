/**
 * Created by santi8ago8 on 09/03/15.
 */

import _ from 'lodash';
var colors = require('colors/safe');
var debug = require('debug');
var moment = require('moment');
var process = require('process');
var log = process.env.DEBUG;
log = (typeof log === 'string' && log.indexOf('gs:') != -1);


class Logger {
    constructor(name) {
        this.name = name;
        this.deb = debug('gs:' + name);
    }

    _process(type, args) {
        if (!log)
            return;
        var els = [this.addTemplate(type)];

        _.forEach(args, (it)=> {
            els.push(it);
        });

        console.log.apply(this, els);
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
        return `${m} ${type.substr(0,1).toUpperCase()}:${this.name} >`;
    }

}

module.exports.Logger = Logger;