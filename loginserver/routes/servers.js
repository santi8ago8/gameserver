/**
 * Created by santi8ago8 on 25/02/15.
 */
var express = require('express');
var router = express.Router();
var serverList = require('./logic/server_list').Servers;
var fail = require('./logic/fail_module').Fail;

/* GET servers listing. */
router.get('/', function (req, res) {
    res.json(serverList.listPublic());
});

/* PUT a server/update. */
router.put('/register', function (req, res) {

    fail.run(function () {
        res.json(serverList.add(req.body));
    });

});

module.exports = router;
