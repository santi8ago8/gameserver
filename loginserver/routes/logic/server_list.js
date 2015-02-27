/**
 * Created by santi8ago8 on 25/02/15.
 */

var Validator = require('jsonschema').Validator;
var v = new Validator();
var EventEmitter3 = require('./../../../sharedcode/eventemitter3').EventEmitter3;
var util = require('util');

//server list!

var list = [];

var schemaServer = {
    id: '/Server',
    type: 'object',
    properties: {
        name: {type: 'string', required: true},
        location: {type: 'string', required: true},
        description: {type: 'string', required: true},
        ip: {type: 'string', required: true},
        port: {type: 'number', required: true},
        protocol: {type: 'string', required: true}
    }
};

function ServerList(password) {
    EventEmitter3.prototype.constructor.apply(this, arguments);
    var self = this;
    self.password = password;
    self.list = list;
    self.add = function (data) {
        var validation = v.validate(data, schemaServer);
        var result;
        if (validation.errors.length > 0) {
            result = validation.toString();
        }
        else if (data.password == self.password) {
            var repeated = false;
            var index = -1;
            self.list.forEach(function (it, ind) {
                if (data.ip == it.ip && data.port == it.port) {
                    repeated = true;
                    index = ind;
                }
            });
            delete data.password;
            if (!repeated) {
                self.list.push(data);
                result = 'added';
            }
            else {
                self.list[index] = data;
                result = 'updated';
            }
        }
        else {
            result = 'incorrect_password';
        }

        return {result: result};
    };
}

util.inherits(ServerList, EventEmitter3);

var password = 'fad4a46b-dbdd-4ade-a62e-c071bf75e476-10aec1ba-895d-4ce2-a81a-6a0f6bd792c0';
var varServerList = new ServerList(password);

module.exports = varServerList;