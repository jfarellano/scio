angular.module('app')
.controller('ConcShowCtlr', ['$scope', '$state', 'Conciliacion', '$window', 'screenSize', function($scope, $state,Conciliacion, window, screenSize){

    Conciliacion.show($state.params.id).then(function (request) {
        $scope.conc = request.data.solicitude;
    },function (request) {
        $scope.conc = {}
    })

    $scope.getConvNames = function() {
        var c = $scope.conc.solicitude_participations.filter(i => i.participation_type == 'convocante');
        var s = ''
        c.forEach(function(element, i) {
            var info = ''
            if(element.involved.nature == 'natural'){
                info = element.involved.natural.first_name + ' ' + element.involved.natural.first_lastname
            }else{
                info = element.involved.juridical.name
            }
            if(i == 0){
                s = s + info
            }else{
                s = s + ', ' + info
            }
        });
        return s;
    }

    $scope.switchIndex = function(){
        Conciliacion.setIndex(true);
        window.location = '#/app/conciliacion';
    }
    $scope.mobile = screenSize.on('xs, sm', function(isMatch){
        $scope.mobile = isMatch;
    });

    // selected = null,
    // previous = null;
    // $scope.tabs = $scope.conc.documentos;
    // $scope.selectedIndex = 0;
    // $scope.$watch('selectedIndex', function(current, old){
    //     previous = selected;
    //     selected = $scope.tabs[current];
    // });
}]);