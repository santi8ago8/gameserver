app.controller('MainCtrl', ['$scope', '$rootScope', 'scopeApply', function ($scope, $rootScope, scopeApply) {

    $scope.comments = [];

    $scope.initData = function (data) {

        scopeApply.apply($scope, function () {
            $scope.count = data.count;
            $scope.comments = data.comments;
        })

    };
    $scope.sendComment = function () {
        if ($scope.nuevoComentario != '') {
            $rootScope.app.io.emit('comment', {comment: $scope.nuevoComentario});
            $scope.nuevoComentario = ''

        }
    };
    $scope.newComment = function (comment) {
        scopeApply.apply($scope, function () {
            $scope.comments.push(comment);
        })
    };

    $rootScope.app.io.on('session_data', $scope.initData);
    $rootScope.app.io.on('comment', $scope.newComment);

    $scope.$on('$destroy', function (event, _) {
        $rootScope.app.io.off('session_data', $scope.initData);
        $rootScope.app.io.off('comment', $scope.newComment);
    });

    $rootScope.app.io.emit('session_data');
}
]);