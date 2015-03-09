/**
 * Created by santi8ago8 on 25/02/15.
 */

var Validator = require('jsonschema').Validator;
var v = new Validator();
var EventEmitter3 = require('./../../../sharedcode/eventemitter3').EventEmitter3;
var util = require('util');
var config = require('./../../config.json');
var db = require('./db_init');
var fail = require('./fail_module');
var needle = require('needle');

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
        protocol: {type: 'string', required: true},
        maxPlayers: {type: 'number', required: true}
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
            //save in db.
            db.Servers.update(
                {ip: data.ip, port: data.port},
                data,
                {upsert: true}
            ).exec(function (err, rowsAff) {
                    if (err)
                        fail.emit('error', err);
                    else {
                        //only save!.
                        //TODO: debug!
                        self.startOrStop(data, 'start');

                    }
                })

        }
        else {
            result = 'incorrect_password';
        }

        return {result: result};
    };
    self.listPublic = function () {
        var list = [];
        for (var i = 0; i < self.list.length; i++) {
            var s = self.list[i];
            var o = {};
            for (var j in schemaServer.properties) {
                o[j] = s[j];
            }
            list.push(o);
        }
        return list;
    };

    self.startOrStop = function (server, action) {
        var url = 'http://' + server.ip + ':' + server.port + '/server/' + action;
        needle.put(url,
            {serverPassword: server.serverPassword},
            function (err, resp, body) {
                if (err) {
                    fail.emit('error', err);
                }
                else {
                    //TODO: debug!
                }

            })
    };

    db.Servers.find(function (err, resp) {
        if (err)
            fail.emit('error', err);
        else {
            for (var i = 0; i < resp.length; i++) {
                var server = resp[i];
                self.list.push(server.toObject());
            }
        }
    });
}

util.inherits(ServerList, EventEmitter3);

var password = config.registerServerPassword;
var varServerList = new ServerList(password);

module.exports.Servers = varServerList;