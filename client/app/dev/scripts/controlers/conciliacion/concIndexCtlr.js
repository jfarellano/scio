angular.module('app')
    .controller('ConcIndexCtlr', ['$scope', '$state', '$window','Conciliacion', 'screenSize', 'Session', '$mdDialog',function($scope, $state, $window, Conciliacion, screenSize, Session, $mdDialog){
        $scope.estado = 'activo'
        $scope.page = 1
        $scope.searchContent = {}   
        $scope.searchType = null
        $scope.moreAvailable = true
        $scope.types = [
            {text:'', value: ''},
            {text:'Fecha', value: 'date'},
            {text:'Involucrado', value: 'involved'},
            {text:'Numero de Caso', value: 'case_number'}
        ]
        $scope.fetchData = function(){
            if(Session.getRole() == 'coordinator' || Session.getRole() == 'admin'){
                var data = {page: $scope.page, filter_type: $scope.searchType, filter_content: $scope.searchContent}
                if($scope.estado == 'activo'){
                    Conciliacion.get.active_all(data).then(function(response){
                        $scope.data = response.data.solicitudes
                        if (response.data.solicitudes.length == 0 || response.data.solicitudes.length < 10) {
                            $scope.moreAvailable = false
                        }
                    })
                }else if($scope.estado == 'archivo'){
                    Conciliacion.get.archive_all(data).then(function(response){
                        $scope.data = response.data.solicitudes
                        if (response.data.solicitudes.length == 0 || response.data.solicitudes.length < 10) {
                            $scope.moreAvailable = false
                        }
                    })
                }else if ($scope.estado == 'borrador') {
                    Conciliacion.get.draft_all(data).then(function(response){
                        $scope.data = response.data.solicitudes
                        if (response.data.solicitudes.length == 0 || response.data.solicitudes.length < 10) {
                            $scope.moreAvailable = false
                        }
                    })
                }
            }else{
                var data = {page: $scope.page, filter_type: $scope.searchType, filter_content: $scope.searchContent}
                if($scope.estado == 'activo'){
                    Conciliacion.get.active(data).then(function(response){
                        $scope.data = response.data.conciliations
                        if (response.data.conciliations.length == 0 || response.data.conciliations.length < 10) {
                            $scope.moreAvailable = false
                        }
                    }, function(response){
                        console.log(response.data)
                    })
                }else if($scope.estado == 'archivo'){
                    Conciliacion.get.archive(data).then(function(response){
                        $scope.data = response.data.conciliations
                        if (response.data.conciliations.length == 0 || response.data.conciliations.length < 10) {
                            $scope.moreAvailable = false
                        }
                    })
                }else if ($scope.estado == 'borrador') {
                    Conciliacion.get.draft(data).then(function(response){
                        $scope.data = response.data.conciliations
                        if (response.data.conciliations.length == 0 || response.data.conciliations.length < 10) {
                            $scope.moreAvailable = false
                        }
                    })
                }
            }
        }

        $scope.fetchData()

        $scope.nextPage = function(){
            $scope.page = $scope.page + 1
            var data = {page: $scope.page, filter_type: $scope.searchType, filter_content: $scope.searchContent}
            if($scope.estado == 'activo'){
                Conciliacion.get.active(data).then(function(response){
                    $scope.data = $scope.data.concat(response.data.conciliations)
                    if (response.data.conciliations.length == 0 || response.data.conciliations.length < 10) {
                        $scope.moreAvailable = false
                    }
                })
            }else if($scope.estado == 'archivo'){
                Conciliacion.get.archive(data).then(function(response){
                    $scope.data = $scope.data.concat(response.data.conciliations)
                    if (response.data.conciliations.length == 0 || response.data.conciliations.length < 10) {
                        $scope.moreAvailable = false
                    }
                })
            }else if ($scope.estado == 'borrador') {
                Conciliacion.get.draft(data).then(function(response){
                    $scope.data = $scope.data.concat(response.data.conciliations)
                    if (response.data.conciliations.length == 0 || response.data.conciliations.length < 10) {
                        $scope.moreAvailable = false
                    }
                })
            }
        }

        $scope.indexType = function(type)   {
            $scope.estado = type
            $scope.page = 1
            $scope.moreAvailable = true
            $scope.busqueda = {}
            $scope.searchContent = {}
            $scope.searchType = null
            $scope.fetchData()
        }

        $scope.busqueda = {
            searchType: null,
            searchContent: {}
        }
        $scope.search = function(){
            $scope.page = 1
            $scope.moreAvailable = true
            $scope.searchType = $scope.busqueda.searchType
            if($scope.searchType == 'date'){
                $scope.searchContent.start = $scope.busqueda.searchContent.start
                $scope.searchContent.end = $scope.busqueda.searchContent.end
            }else{
                $scope.searchContent.value = $scope.busqueda.searchContent.value
            }
            $scope.fetchData()
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
                    console.log(response.data)
                })
            }else{
                $scope.showConfirm(ev)
            }              
        }

        $scope.showConfirm = function(ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('¿Que tipo de conciliación quiere iniciar?')
                .textContent('Escoja el tipo de coniliación que desea iniciar')
                .ariaLabel('Tipo de conciliacion')
                .targetEvent(ev)
                .ok('Conciliación en equidad')
                .cancel('Conciliación en derecho');
            $mdDialog.show(confirm).then(function() {
                var solicitude = { "user_id":Session.getUserID(),"solicitude_type":"conciliacion_en_equidad", "payment_amount": 0}
                Conciliacion.create.solicitude(solicitude).then(function(response){
                    window.location = '#/app/create/conciliacion_equidad/' + response.data.solicitude.id
                },function(response){
                    console.log(response.data)
                })
            }, function() {
                var solicitude = { "user_id":Session.getUserID(),"solicitude_type":"conciliacion", "payment_amount": 0}
                Conciliacion.create.solicitude(solicitude).then(function(response){
                    window.location = '#/app/create/conciliacion/' + response.data.solicitude.id
                },function(response){
                    console.log(response.data)
                })
            });
        };

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

        $scope.progress = function(conc){
            switch(conc.state){ 
                case 'incompleta':
                    return 0
                    break
                case 'incompleta/info':
                case 'incompleta/convocantes':
                case 'incompleta/convocados':
                case 'incompleta/hechos':
                case 'incompleta/pretensiones':
                    return 10
                    break
                case 'enviada':
                    return 20
                    break
                case 'aceptada':
                    return 30
                    break
                case 'pendiente_por_aceptacion_de_conciliador':
                case 'aceptada_por_conciliador':
                    return 50
                    break
                case 'programar_audiencia':
                    return 60
                    break
                case 'programada':
                    return 70
                    break
                case 'cerrada':
                    return 100
                    break
            }
        }

        $scope.mobile = screenSize.on('xs, sm', function(isMatch){
            $scope.mobile = isMatch;
        });    
    }]);