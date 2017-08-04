angular.module('app')
    .controller('DashCtrl', ['$scope', 'URL', '$state', function($scope, URL, $state){
        //Dashboard controller important for future tasks
        $scope.roundLogo = URL.image + '/round_logo.png';
        $scope.redirect = function(opc){
            switch(opc){
                case 1:
                    //Aula Virtual
                    break;
                case 2:
                    $state.go('app.conciliacion.index')
                    break;
                case 3:
                    //Insolvencia
                    break;
            }
        }
    }]);