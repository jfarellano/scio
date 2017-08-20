angular.module('app')
.controller('ConcCreateCtlr', ['$scope', '$q','$timeout', 'WizardHandler','Conciliacion' , function($scope, $q, $timeout, WizardHandler, Conciliacion){

    $scope.data = Conciliacion.index();
    $scope.state = Conciliacion.state();

    $scope.getIndex = function(){
        return Conciliacion.getIndex();
    }

    console.log('Esta');


    //Wizard
    $scope.canExit = false;
    $scope.stepActive = true;

    $scope.finished = function() {
        alert("Wizard finished :)");
    };
    $scope.logStep = function() {
        console.log("Step continued");
    };
    $scope.goBack = function() {
        WizardHandler.wizard().goTo(0);
    };
    $scope.exitWithAPromise = function() {
        var d = $q.defer();
        $timeout(function() {
            d.resolve(true);
        }, 1000);
        return d.promise;
    };
    $scope.exitToggle = function() {
        $scope.canExit = !$scope.canExit;
    };
    $scope.stepToggle = function() {
        $scope.stepActive = !$scope.stepActive;
    }
    $scope.exitValidation = function() {
        return $scope.canExit;
    };
}]);