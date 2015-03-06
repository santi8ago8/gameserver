var express = require('express');
var router = express.Router();
var config = require('../config');

/* GET home page. */
router.get('/', function (req, res) {
    if (!req.session.isLoged)
        req.session.isLoged = false;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.render('index', {title: 'Login Server', scripts: config.getScripts()});
});

module.exports = router;
