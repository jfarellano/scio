angular.module('app')
.controller('loginCtrl', ['$scope', '$window', 'Session',function($scope, $window, Session){
    $scope.user = {
        email: '',
        password: ''
    }
    $scope.error = false

    $scope.login = function(){
    	Session.login($scope.user).then(function(response){
    		Session.setToken(response.data.token.secret, 0, response.data.token.user_id)
    		window.location = '#/app/dashboard';
    	},function(response){
    		$scope.message = response.data.single_authentication
            $scope.error = true
    		console.log('No autorizado')
    	})
    }
   
}]);


angular.module('app').directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});