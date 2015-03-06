/**
 * Basic config
 */
var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngAria', 'ngMaterial'])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider
            .when('/', {
                templateUrl: '/html/main.html',
                controller: 'MainCtrl'
            })
            .when('/profile', {
                templateUrl: '/html/profile.html',
                controller:'ProfileCtrl'
            })
            .when('/about', {
                templateUrl: '/html/about.html',
                controller: 'AboutCtrl'
            })
            .when('/login', {
                templateUrl: '/html/login.html',
                controller: 'LoginCtrl'
            })
            .otherwise({
                redirectTo: '/404'
            })

    }])
    .run(['$rootScope', 'scopeApply', '$location', function ($rootScope, scopeApply, $location) {
        $rootScope.app = {};
        $rootScope.app.isLoged = false;
        //connect to socket.io
        $rootScope.app.io = io();
        $rootScope.app.io.ngEmit = function (ev, dat) {
            $rootScope.app.io.emit(ev, angular.copy(dat));
        };

        // Custom $off function to un-register the listener.
        $rootScope.$off = function (name, listener) {
            var namedListeners = this.$$listeners[name];
            if (namedListeners) {
                // Loop through the array of named listeners and remove them from the array.
                for (var i = 0; i < namedListeners.length; i++) {
                    if (namedListeners[i] === listener) {
                        return namedListeners.splice(i, 1);
                    }
                }
            }
        };

        $rootScope.app.login = function (data) {
            scopeApply.apply($rootScope, function () {
                $rootScope.app.isLoged = data.isLoged;
                if (!data.isLoged) {
                    $location.url('/login');
                }
                else {
                    $location.url('/');
                }
            })
        };

        $rootScope.app.io.on('login', $rootScope.app.login);

        $rootScope.$on('$destroy', function () {
            $rootScope.app.io.off('login', $rootScope.app.login);
        })
    }])
    .service('scopeApply', [function () {
        this.apply = function (scope, fn) {
            var phase = scope.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                scope.$apply(fn);
            }
        }
    }]);