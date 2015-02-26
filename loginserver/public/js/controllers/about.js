app.controller('AboutCtrl', ['$scope', '$rootScope', '$interval', function ($scope, $rootScope, $interval) {

    $interval(function () {

        $scope.random = parseInt(Math.random()*10000);
    }, 60)
}]);