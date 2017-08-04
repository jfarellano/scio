angular.module('app')
    .controller('ConcIndexCtlr', ['$scope', '$state', 'Conciliacion' , function($scope, $state,Conciliacion){
        //Working controller
        $scope.data = Conciliacion.index();

        $scope.toShow = function(id){
            window.location = '#/app/conciliacion/' + id;
        }
    }]);