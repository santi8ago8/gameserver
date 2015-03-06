/**
 * Created by santi8ago8 on 06/03/15.
 */



app.controller('LoginCtrl', ['$scope', '$rootScope', 'scopeApply', function ($scope, $rootScope, scopeApply) {


    $scope.send = function () {
        $rootScope.app.io.ngEmit('login', $scope.user);
        $scope.loging = false;
    };

    $scope.incorrect = function () {
        scopeApply.apply($scope, function () {
            $scope.loging = true;
        })
    };

    $rootScope.app.io.on('login_incorrect', $scope.incorrect);
    //$rootScope.app.io.on('comment', $scope.newComment);

    $scope.$on('$destroy', function (event, _) {
        // $rootScope.app.io.off('session_data', $scope.initData);
        $rootScope.app.io.off('login_incorrect', $scope.incorrect);
        // $rootScope.app.io.off('comment', $scope.newComment);
    });

}
]);