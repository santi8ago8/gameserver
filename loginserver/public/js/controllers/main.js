app.controller('MainCtrl', ['$scope', '$rootScope', 'scopeApply', '$http', function ($scope, $rootScope, scopeApply, $http) {

    $scope.servers = [];

    $scope.servers_s = function (data) {
        scopeApply.apply($scope, function () {
            $scope.servers = data;
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
                }
            }
        })
    };


    $rootScope.app.io.on('servers', $scope.servers_s);
    $rootScope.app.io.on('ping', $scope.ping_s);

    $scope.$on('$destroy', function (event, _) {
        $rootScope.app.io.off('servers', $scope.servers_s);
        $rootScope.app.io.off('ping', $scope.ping_s);
    });

    $rootScope.app.io.emit('servers');
}
])
;