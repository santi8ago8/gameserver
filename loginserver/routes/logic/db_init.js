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


module.exports = {
    User: User
};