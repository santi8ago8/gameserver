app.controller('MainCtrl', ['$scope', '$rootScope', 'scopeApply', '$mdToast', function ($scope, $rootScope, scopeApply, $mdToast) {

    $scope.servers = [];

    $scope.servers_s = function (data) {
        scopeApply.apply($scope, function () {
            $scope.servers = data;
            $scope.pingAll();
        });

    };

    $scope.ping = function (s) {
        $rootScope.app.io.emit('ping', {ip: s.ip, port: s.port});
    };

    $scope.ping_s = function (s) {
        scopeApply.apply($scope, function () {
            for (var i = 0; i < $scope.servers.length; i++) {
                var server = $scope.servers[i];
                if (server.ip == s.ip && server.port == s.port) {
                    server.ping = s.ping;
                    server.open = s.open;
                }
            }
        })
    };

    $scope.pingAll = function () {
        $scope.servers.forEach(function (s) {
            $scope.ping(s);
        })
    };

    $scope.startOrStop = function (s, a) {
        s.action = a;
        $rootScope.app.io.emit('startOrStop', s);
    };

    $scope.toast = function (data) {
        console.log(JSON.stringify(data));
        var t = $mdToast.simple()
            .content(JSON.stringify(data))
            .hideDelay(3000)
            .action('OK')
            .position('left bottom');
        $mdToast.show(t).then(function () {

        });
    };

    $rootScope.app.io.on('servers', $scope.servers_s);
    $rootScope.app.io.on('ping', $scope.ping_s);
    $rootScope.app.io.on('event', $scope.toast);

    $scope.$on('$destroy', function (event, _) {
        $rootScope.app.io.off('servers', $scope.servers_s);
        $rootScope.app.io.off('ping', $scope.ping_s);
        $rootScope.app.io.off('event', $scope.toast);
    });

    $rootScope.app.io.emit('servers');
}
])
;