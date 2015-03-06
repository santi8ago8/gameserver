/**
 * Created by santi8ago8 on 01/03/15.
 */

var DBEngine = require('./../../../sharedcode/dbengine').DBEngine;
var config = require('./../../config.json');


var dbengine = new DBEngine(config.DBUrl);

var userSchema = dbengine.mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    token: {type: String, required: true}
});

var User = dbengine.mongoose.model(config.CollectionUsers, userSchema);

var adminSchema = dbengine.mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true}
});

var Admin = dbengine.mongoose.model(config.CollectionAdmins, adminSchema);



var SHA256 = require("crypto-js/sha256");
var fail = require('./fail_module');

Admin.count(function (err, count) {
    if (err) {
        fail.emit('error', err)
    } else {
        if (count == 0) {
            new Admin({username: 'root', password: SHA256('root').toString()})
                .save(function (err, numAff) {
                    if (err)
                        fail.emit('error', err);
                    else {
                        console.log('Create first admin root (root) please change password');
                    }
                });
        }
    }
});

var serversSchema = dbengine.mongoose.Schema({
    name: {type: String, required: true},
    location: {type: String, required: true},
    description: {type: String, required: true},
    ip: {type: String, required: true},
    port: {type: Number, required: true},
    protocol: {type: String, required: true},
    serverPassword: {type: String, required: true}
});

var Servers = dbengine.mongoose.model(config.CollectionServers, serversSchema);

module.exports = {
    User: User,
    Admin: Admin,
    Servers:Servers
};