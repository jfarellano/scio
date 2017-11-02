angular.module('app')
    .controller('ConcIndexCtlr', ['$scope', '$state', '$window','Conciliacion', 'screenSize', 'Session', '$mdDialog',function($scope, $state, $window, Conciliacion, screenSize, Session, $mdDialog){
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
                console.log(response.data)
                $scope.data = response.data.conciliations;
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
            if ($scope.data[id].solicitude_participations.length == 0) {
                return 'Conciliacion'
            }
            var c = $scope.data[id].solicitude_participations.filter(i => i.participation_type == 'convocante');
            var info = ''
            if(c[0].involved.nature == 'natural'){
                info = c[0].involved.natural.first_name + ' ' + c[0].involved.natural.first_lastname
            }else{
                info = c[0].involved.juridical.name
            }
            
            if (c.length > 1) {
                info = info + ' y otros.'
            }
            return info + ' Convocante';
        }

        $scope.getConvoNames = function(id) {
            if ($scope.data[id].solicitude_participations.length == 0) {
                return ''
            }
            var c = $scope.data[id].solicitude_participations.filter(i => i.participation_type == 'convocado');
            var info = ''
            if(c.length == 0){
                return ''
            }
            if(c[0].involved.nature == 'natural'){
                info = c[0].involved.natural.first_name + ' ' + c[0].involved.natural.first_lastname
            }else{
                info = c[0].involved.juridical.name
            }
            
            if (c.length > 1) {
                info = info + ' y otros.'
            }
            return info + ' Convocado';
        }

        $scope.openCreate = function(ev){
            if (Session.getRole() != 'conciliator_in_equity') {
                var solicitude = { "user_id":Session.getUserID(),"solicitude_type":"conciliacion", "payment_amount": 0}
                Conciliacion.create.solicitude(solicitude).then(function(response){
                    console.log(response.data)
                    window.location = '#/app/create/conciliacion/' + response.data.solicitude.id    
                },function(response){
                    console.log("Entro 2")
                    console.log(response.data)
                })
            }else{
                $scope.showConfirm(ev)
            }              
        }

        $scope.showConfirm = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Que tipo de conciliacion quiere iniciar?')
                .textContent('Puede elegir ente conciliacion en derecho o conciliacion en equidad')
                .ariaLabel('Tipo de conciliacion')
                .targetEvent(ev)
                .ok('Conciliación en equidad')
                .cancel('Conciliación en derecho');
            $mdDialog.show(confirm).then(function() {
                var solicitude = { "user_id":Session.getUserID(),"solicitude_type":"conciliacion_en_equidad", "payment_amount": 0}
                Conciliacion.create.solicitude(solicitude).then(function(response){
                    console.log(response.data)
                    window.location = '#/app/create/conciliacion_equidad/' + response.data.solicitude.id
                },function(response){
                    console.log("Entro 2")
                    console.log(response.data)
                })
            }, function() {
                var solicitude = { "user_id":Session.getUserID(),"solicitude_type":"conciliacion", "payment_amount": 0}
                Conciliacion.create.solicitude(solicitude).then(function(response){
                    console.log(response.data)
                    window.location = '#/app/create/conciliacion/' + response.data.solicitude.id
                },function(response){
                    console.log("Entro 2")
                    console.log(response.data)
                })
            });
        };

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
                if (conc.solicitude_type != 'conciliacion_en_equidad') {
                    window.location = '#/app/create/conciliacion/' + conc.id
                }else{
                    window.location = '#/app/create/conciliacion_equidad/' + conc.id
                }
            }else{
                window.location = '#/app/conciliacion/' + conc.id
            }
        }

        $scope.mobile = screenSize.on('xs, sm', function(isMatch){
            $scope.mobile = isMatch;
        });

        // angular.element($window).on('resize', function () {
        //     $window.location.reload();
        // });
        
    }]);