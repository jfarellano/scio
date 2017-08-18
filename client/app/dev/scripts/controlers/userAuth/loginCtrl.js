angular.module('app')
.controller('loginCtrl', ['$scope', '$window', function($scope, $window){
    $scope.user = {
        mail: '',
        pass: ''
    }
    $scope.login = function(){
        window.location = '#/app/dashboard';
    }
   
}]);