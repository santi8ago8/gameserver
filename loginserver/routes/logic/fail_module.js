/**
 * Created by santi8ago8 on 25/02/15.
 */

var EventEmitter = require('events').EventEmitter;
var util = require('util');

function FailModule() {

    var self = this;
    self.run = function (cb) {
        try {
            cb();
        }
        catch (ex) {
            this.emit('error', ex);
        }
        return self;
    };

}

util.inherits(FailModule, EventEmitter);


var failVar = new FailModule();

//test emmiter:
failVar.on('error', function (ex) {
    console.log('error', ex);
});
/*
failVar.run(function () {
    throw  new Error("no anda :(")
});*/

module.exports.Fail = failVar;