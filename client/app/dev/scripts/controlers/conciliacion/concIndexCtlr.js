angular.module('app')
    .controller('ConcIndexCtlr', ['$scope', '$state', '$window','Conciliacion' , function($scope, $state, $window, Conciliacion){
        //Working controller
        $scope.data = Conciliacion.index();
        $scope.state = Conciliacion.state();

        $scope.switchState = function(stat){
            $('#loader-container').fadeIn('fast');
            if(stat === 1) {
                Conciliacion.setState(true);
            }else {
                Conciliacion.setState(false);
            }
            $scope.fetchData();
            setTimeout(function() {
                $('#loader-container').fadeOut('slow');
            }, 2000);
        }
        $scope.fetchData = function(){
            $scope.data = Conciliacion.index();
        }
        $scope.toShow = function(id){
            window.location = '#/app/conciliacion/' + id;
        }
        $scope.click = function(){
            console.log('Hizo click');
        }
    }]);