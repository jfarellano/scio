angular.module('app')
    .controller('DashCtrl', ['$scope', 'URL', function($scope, URL){
        //Dashboard controller important for future tasks
        $scope.info = "Juan";
        $scope.roundLogo = URL.image + '/round_logo.png';
    }]);