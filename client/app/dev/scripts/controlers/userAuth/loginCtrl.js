angular.module('app')
.controller('loginCtrl', ['$scope', '$window', 'Session',function($scope, $window, Session){
    $scope.user = {
        email: '',
        password: ''
    }
    $scope.error = false

    $scope.login = function(){
    	Session.login($scope.user).then(function(response){
    		Session.setToken(response.data.token.secret, 0)
    		window.location = '#/app/dashboard';
    	},function(response){
    		$scope.message = response.data.single_authentication
            $scope.error = true
    		console.log('No autorizado')
    	})
    }
   
}]);