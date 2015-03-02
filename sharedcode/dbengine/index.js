/**
 * Created by santi8ago8 on 28/02/15.
 */


var EventEmitter3 = require('./../eventemitter3').EventEmitter3;
var util = require('util');
var mongoose = require('mongoose');


//TODO: DO!

function DBEngine(url) {
    EventEmitter3.prototype.constructor.apply(this, arguments);
    var self = this;
    mongoose.connect(url);
    var db = this.dbInst = mongoose.connection;
    this.isReady = false;
    this.wait = [];
    this.mongoose = mongoose;

    db.on('error', console.log);
    db.on('open', function (err, database) {
        if (err)
            console.log(err);
        else {
            self.wait.forEach(function (cb) {
                cb(self.dbInst);
            });
        }
    })
}

util.inherits(DBEngine, EventEmitter3);

DBEngine.prototype.db = function (cb) {
    if (this.isReady) {
        cb(this.dbInst);
    }
    else {
        this.wait.push(cb);
    }
};

module.exports.DBEngine = DBEngine;