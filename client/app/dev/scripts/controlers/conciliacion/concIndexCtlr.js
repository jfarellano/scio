angular.module('app')
    .controller('ConcIndexCtlr', ['$scope', '$state', '$window','Conciliacion', 'screenSize' , function($scope, $state, $window, Conciliacion, screenSize){
        //Working controller
        $scope.data = Conciliacion.index();
        $scope.state = Conciliacion.state();

        $scope.getIndex = function(){
            return Conciliacion.getIndex();
        }

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
            Conciliacion.setIndex(false);
            window.location = '#/app/conciliacion/' + id;
        }
        $scope.click = function(){
            console.log('Hizo click');
        }

        $scope.mobile = screenSize.on('xs, sm', function(isMatch){
            $scope.mobile = isMatch;
        });

        angular.element($window).on('resize', function () {
            $window.location.reload();
        });
        
    }]);