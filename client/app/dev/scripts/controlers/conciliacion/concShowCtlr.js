angular.module('app')
.controller('ConcShowCtlr', ['$scope', '$state', 'Conciliacion', '$window', 'screenSize', function($scope, $state,Conciliacion, window, screenSize){
    $scope.conc = Conciliacion.show($state.params.id);

    $scope.switchIndex = function(){
        Conciliacion.setIndex(true);
        window.location = '#/app/conciliacion';
    }
    $scope.mobile = screenSize.on('xs, sm', function(isMatch){
        $scope.mobile = isMatch;
    });

    selected = null,
    previous = null;
    $scope.tabs = $scope.conc.documentos;
    $scope.selectedIndex = 0;
    $scope.$watch('selectedIndex', function(current, old){
        previous = selected;
        selected = $scope.tabs[current];
    });
}]);