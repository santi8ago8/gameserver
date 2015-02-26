/**
 * Created by santi8ago8 on 25/02/15.
 */
var express = require('express');
var router = express.Router();
var serverList = require('./server_list');
var fail = require('./logic/fail_module');

/* GET servers listing. */
router.get('/', function (req, res) {
    res.json(serverList.list);
});

/* PUT a server/update. */
router.put('/register', function (req, res) {

    fail.run(function () {
        res.json(serverList.add(req.body));
    });

});

module.exports = router;
