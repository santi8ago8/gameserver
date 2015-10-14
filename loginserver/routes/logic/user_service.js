/**
 * Created by santi8ago8 on 26/02/15.
 */

var Validator = require('jsonschema').Validator;
var v = new Validator();
var EventEmitter3 = require('./../../../sharedcode/eventemitter3').EventEmitter3;
var util = require('util');
var config = require('./../../config.json');
var db = require('./db_init');
var SHA256 = require("crypto-js/sha256");
var uuid = require('node-uuid');
var fail = require('./fail_module');

var schemaUser = {
    id: '/User',
    type: 'object',
    properties: {
        username: {type: 'string', required: true},
        email: {type: 'string', required: true},
        password: {type: 'string', required: true}
    }
};

function UserService() {
    EventEmitter3.prototype.constructor.apply(this, arguments);


}
util.inherits(UserService, EventEmitter3);

UserService.prototype.register = function (newUser, cb) {
    var validation = v.validate(newUser, schemaUser);
    var result = {};
    var self = this;
    if (validation.errors.length > 0) {
        result.missingFields = true;
        cb(result);
    }
    else {

        db.User.find({$or: [
            {username: newUser.username},
            {email: newUser.email}
        ]}).exec(function (err, resp) {
            if (err)
                fail.emit(err);
            else {
                if (resp.length == 0) {

                    newUser.password = SHA256(newUser.password).toString();
                    newUser.token = uuid.v4() + uuid.v4() + uuid.v4() + uuid.v4() + uuid.v4();

                    self.emitpre('register', newUser, function (err, resultPre) {
                        if (err)
                            fail.emit(err);
                        else {
                            new db.User(resultPre).save(function (err, user_db, rowsAff) {
                                if (err)
                                    fail.emit(err);
                                else {
                                    self.emit('register', result);
                                    result.register = true;
                                    cb(result);
                                }
                            })
                        }

                    });

                }
                else {
                    for (var i = 0; i < resp.length; i++) {
                        var us = resp[i];
                        if (us.username == newUser.username) {
                            result.usernameRepeated = true;
                        }
                        if (us.email == newUser.email) {
                            result.emailRepeated = true;
                        }
                    }
                    cb(result);
                }
            }
        })
    }
};

UserService.prototype.count = function (cb) {
    db.User.count().exec(function (err, resp) {
        if (err)
            fail.emit('error', err);
        else {
            cb(resp);
        }
    })
};

UserService.prototype.change_password = function (user, cb) {
    var result = {
        changed_password: false
    };
    user.password = SHA256(user.password).toString();
    user.newPassword = SHA256(user.newPassword).toString();
    db.User.update(
        {username: user.username, password: user.password},
        {$set: {password: user.newPassword}},
        {},
        function (err, numAff, raw) {
            if (err)
                fail.emit('error', err);
            else {
                if (numAff == 1) {
                    result.changed_password = true;
                }
            }
            cb(result);
        });
};

UserService.prototype.login = function (user, cb) {
    user.password = SHA256(user.password);
    db.User.findOne(user, {token: true}, function (err, res) {
        if (err)
            fail.emit('error', err);
        else {
            console.log(res);
            if (res) {
                cb(res.toObject());
            } else {
                cb({login: false});
            }
        }
    })
};

UserService.prototype.check_token = function (user, cb) {
    db.User.findOne({token: user.token}, {username: true})
        .exec(function (err, res) {
            if (err)
                fail.emit('error', err);
            else {
                if (res) {
                    cb(res.toObject());
                } else {
                    cb({login: false});
                }
            }
        })
};


var varUserService = new UserService();

module.exports.Users = varUserService;