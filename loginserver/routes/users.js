var express = require('express');
var router = express.Router();
var fail = require('./logic/fail_module').Fail;
var Users = require('./logic/user_service').Users;

/* GET users listing. */
router.get('/', function (req, res) {
    Users.count(function (resp) {
        res.json({count: resp});
    });
});

router.put('/register', function (req, res) {
    Users.register(req.body, function (resp) {
        res.json(resp);
    })
});


router.put('/change_password', function (req, res) {
    Users.change_password(req.body, function (resp) {
        res.json(resp)
    });
});

router.put('/login', function (req, res) {
    Users.login(req.body, function (resp) {
        res.json(resp);
    });
    //return token!
});

router.post('/check_token', function (req, res) {
    //check here (only for game server use)
    Users.check_token(req.body, function (resp) {
        res.json(resp);

    })

});

//TODO: change token! on logout!.

module.exports = router;
