angular.module('app')
    .controller('ConcIndexCtlr', ['$scope', '$state', '$window','Conciliacion', 'screenSize', function($scope, $state, $window, Conciliacion, screenSize){
        Conciliacion.index().then(function(response) {
            $scope.data = response.data.solicitudes;
        },function(response){
            $scope.data = [];
            console.log(response.data)
        })

        $scope.state = Conciliacion.state();

        $scope.getConvNames = function(id) {
            var c = $scope.data[id].solicitude_participations.filter(i => i.participation_type == 'convocante');
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

        $scope.openCreate = function(){
            Conciliacion.create.solicitude({"solicitude":{ "user_id":"1","solicitude_type":"conciliacion"}}).then(function(response){
                console.log(response.data)
                window.location = '#/app/create/conciliacion/' + response.data.solicitude.id    
            },function(response){
                console.log('Entro aca')
                console.log(response.data)
            })  
        }

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

        // angular.element($window).on('resize', function () {
        //     $window.location.reload();
        // });
        
    }]);