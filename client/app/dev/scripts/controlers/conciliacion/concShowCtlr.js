angular.module('app')
.controller('ConcShowCtlr', ['$scope', '$state', 'Conciliacion', function($scope, $state,Conciliacion){
        $scope.conc = Conciliacion.show($state.params.id);
 }]);