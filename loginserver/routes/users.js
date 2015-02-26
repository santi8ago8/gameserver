var express = require('express');
var router = express.Router();
var fail = require('./logic/fail_module');


/* GET users listing. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.put('/register', function (req, res) {

});

router.put('/login', function (req, res) {


    //return token!
});

router.put('/check_token', function (req, res) {
    //check here (only for game server use)

});

module.exports = router;
