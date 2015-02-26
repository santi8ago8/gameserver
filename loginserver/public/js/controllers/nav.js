app.controller('NavCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.buttons = [
        {text: 'index', href: '#!/'},
        {text: 'about', href: '#!/about'},
        {text: '404', href: '#!/not_found'}
    ];
}]);