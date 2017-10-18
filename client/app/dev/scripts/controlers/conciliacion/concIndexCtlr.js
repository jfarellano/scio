angular.module('app')
    .controller('ConcIndexCtlr', ['$scope', '$state', '$window','Conciliacion', 'screenSize', 'Session',function($scope, $state, $window, Conciliacion, screenSize, Session){
        console.log(Session.getRole())
        if(Session.getRole() == 'coordinator' || Session.getRole() == 'admin'){
            Conciliacion.coordinator_index().then(function(response){
                $scope.data = response.data.solicitudes;
            }, function(response){
                $scope.data = []
                console.log(response.data)
            })
        }else{
            Conciliacion.index().then(function(response) {
                $scope.data = response.data.solicitudes;
            },function(response){
                $scope.data = [];
                console.log(response.data)
            })
        }

        $scope.Session =  Session

        $scope.getState = function(conc){
            return conc.state.toUpperCase().replaceAll('_', ' ')
        }
        String.prototype.replaceAll = function(str1, str2, ignore){
            return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
        }

        $scope.state = Conciliacion.state();

        $scope.getConvNames = function(id) {
            if ($scope.data[id].solicitude_participations == null) {
                return 'Conciliacion'
            }
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
            var solicitude = { "user_id":"1","solicitude_type":"conciliacion", "payment_amount": 0}
            console.log(solicitude)
            Conciliacion.create.solicitude(solicitude).then(function(response){
                console.log(response.data)
                console.log("Entro")
                window.location = '#/app/create/conciliacion/' + response.data.solicitude.id    
            },function(response){
                console.log("Entro 2")
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
        $scope.toShow = function(conc){
            Conciliacion.setIndex(false)
            if(conc.state.includes('incompleta')){
                window.location = '#/app/create/conciliacion/' + conc.id
            }else{
                window.location = '#/app/conciliacion/' + conc.id
            }
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