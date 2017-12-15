angular.module('app')
.controller('loginCtrl', ['$scope', '$window', 'Session',function($scope, $window, Session){
    $scope.user = {
        email: '',
        password: ''
    }
    $scope.error = false

    $scope.login = function(){
    	Session.login($scope.user).then(function(response){
            var user = response.data.token.user
    		Session.setToken(response.data.token.secret,user.role,user.id, user.name + ' ' + user.first_lastname + ' ' + user.second_lastname, user.email)
    		window.location = '#/app/dashboard';
    	},function(response){
            $scope.error = true
            console.log(response.data)
    		console.log('No autorizado')
            $scope.message = "Credenciales invalidas, porfavor rectifique"
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