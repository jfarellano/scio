angular.module('app')
.controller('loginCtrl', ['$scope', '$window', 'Session',function($scope, $window, Session){
    $scope.user = {
        email: '',
        password: ''
    }

    $scope.login = function(){
    	Session.login($scope.user).then(function(response){
    		Session.setToken(response.data.token.secret, 0)
    		window.location = '#/app/dashboard';
    	},function(response){
    		console.log(response.data)
    		console.log('No autorizado')
    	})
    }
   
}]);