var env = 'dev'; //(dev|prod)

var engineScripts = [
    '/js/socket.io.js',
    '/js/app.js',
    '/js/controllers/main.js',
    '/js/controllers/nav.js',
    '/js/controllers/about.js'
];
var developScripts = [
    '/js/livereload.io.js'
];

var scripts = {
    dev: [
        '/bower_components/hammerjs/hammer.js',
        '/bower_components/angular/angular.js',
        '/bower_components/angular-animate/angular-animate.js',
        '/bower_components/angular-aria/angular-aria.js',
        '/bower_components/angular-route/angular-route.js',
        '/bower_components/angular-material/angular-material.js'
    ],
    prod: ['/js/allScripts.js'], //al scripts inside here.
    minified: [ //minified scripts
        '/bower_components/hammerjs/hammer.min.js',
        '/bower_components/angular/angular.min.js',
        '/bower_components/angular-animate/angular-animate.min.js',
        '/bower_components/angular-aria/angular-aria.min.js',
        '/bower_components/angular-route/angular-route.min.js',
        '/bower_components/angular-material/angular-material.min.js'
        //automatically minified all scripts in js public directory.
    ]
};
for (var i = 0; i < engineScripts.length; i++) {
    var s = engineScripts[i];
    scripts.dev.push(s);
}
for (var i = 0; i < developScripts.length; i++) {
    var s = developScripts[i];
    scripts.dev.push(s);
}

module.exports.setEnv = function (enviroment) {
    env = enviroment;
};

module.exports.getScripts = function () {
    return scripts[env];
};
module.exports.getMinified = function () {
    return scripts['minified'];
};
module.exports.getProdPath = function () {
    return scripts['prod'][0]
};
module.exports.getEngineScripts = function () {
    return engineScripts;
};