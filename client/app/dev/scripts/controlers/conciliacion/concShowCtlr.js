angular.module('app')
.controller('ConcShowCtlr', ['$scope', '$state', 'Conciliacion', function($scope, $state,Conciliacion){
        $scope.conc = Conciliacion.show($state.params.id);
        selected = null,
        previous = null;
        $scope.tabs = $scope.conc.documentos;
        $scope.selectedIndex = 2;
        $scope.$watch('selectedIndex', function(current, old){
            previous = selected;
            selected = $scope.tabs[current];
        });
 }]);