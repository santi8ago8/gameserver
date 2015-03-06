/**
 * Created by santi8ago8 on 06/03/15.
 */


app.controller('ProfileCtrl', ['$scope', '$rootScope', 'scopeApply', function ($scope, $rootScope, scopeApply) {

    $scope.user = {};

    $scope.send = function () {
        if ($scope.user.newPassword == $scope.user.confPassword) {
            $rootScope.app.io.ngEmit('change_password', $scope.user);
        } else {
            $scope.loging = true;
        }
        $scope.changed = 0;
    };

    $scope.change_s = function (data) {
        scopeApply.apply($scope, function () {
            $scope.changed = data.changed;
        });
    };

    $rootScope.app.io.on('change_password', $scope.change_s);

    $scope.$on('$destroy', function (event, _) {
        $rootScope.app.io.off('change_password', $scope.change_s);
    });

}
]);