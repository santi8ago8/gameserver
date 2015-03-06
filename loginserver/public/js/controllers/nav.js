app.controller('NavCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.buttons = [
        {text: 'index', href: '#!/'},
        {text: 'about', href: '#!/about'},
        {text: 'profile', href: '#!/profile'}
    ];
    $scope.delogin = function () {
        $rootScope.app.io.emit('delogin');
    }
}]);