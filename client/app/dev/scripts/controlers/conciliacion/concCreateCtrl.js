angular.module('app')
.controller('ConcCreateCtlr', ['$scope', '$q','$timeout', 'WizardHandler','Conciliacion', '$http', '$mdDialog', 'URL', '$state', function($scope, $q, $timeout, WizardHandler, Conciliacion, $http, $mdDialog, URL, $state){

    Conciliacion.get.solicitude($state.params.id).then(function(response){
        $scope.solicitude = response.data.solicitude
    },function(response){
        console.log(response)
    })

    $scope.getSolicitude = function(){
        Conciliacion.get.solicitude($state.params.id).then(function(response){
            $scope.solicitude = response.data.solicitude
        },function(response){
            console.log(response)
        })
    }

    $scope.convocantes = function(){
        return $scope.solicitude.solicitude_participations.filter(i => i.participation_type == 'convocante');
    }
    $scope.convocados = function(){
        return $scope.solicitude.solicitude_participations.filter(i => i.participation_type == 'convocado');
    }

    $scope.applicant= ['LAS DOS PARTES', 'SOLO UNA DE LAS PARTES', 'MEDIANTE APODERADO']
    $scope.service_goal = ["RESOLVER DE MANERA ALTERNATIVA EL CONFLICTO", "CUMPLIR REQUISITO DE PROCEDIBILIDAD"]

    $scope.involucrado = {
        participation_type: '',
        involved: {
            nature: ''
        }
    }

    $scope.conflict_time = ["DE 1 A 30 DÍAS (HASTA 1 MES)", "DE 31 DÍAS A 180 DÍAS (ENTRE 2 Y 6 MESES)", "SUPERIOR A 180 DÍAS (ENTRE 7 Y 12 MESES)", "SUPERIOR A 365 DÍAS (SUPERIOR A 1 AÑO)", "NO INFORMA"]

    $scope.convtype = ['natural', 'juridica']

    $scope.area_topic = {
        'CIVIL Y COMERCIAL':{ 'BIENES':['DONACIONES Y MODOS DE ADQUIRIR EL DOMINIO DISTINTOS DE LA COMPRAVENTA O LA SUCESIÓN POR CAUSA DE MUERTE'], 'COMPETENCIA DESLEAL':['ACTOS DE COMPARACIÓN', 'ACTOS DE CONFUSIÓN']}
    };
    $scope.org_type = ['Privada', 'Publica']
    $scope.public_type = ['Organismo de contparticipation_type', 'Rama judicial', 'Rama legislativa', 'Rama ejecutiva']
    $scope.org_idtype = ['NIT', 'Numero de identificacion de sociedad extranjera'];
    $scope.economic_sector = ['Type1', 'Type2', 'Type3', 'Type4', 'Type5'];
    $scope.department = '';
    $scope.idType = ['cedula', 'pasaporte'];
    $scope.countries = ['Pais1', 'Pais2', 'Pais3', 'Pais4'];
    $scope.departments = {
        'Amazonas': ['Leticia'],
        'Antioquia': ['Medellin', 'Envigado'],
        'Bolivar': ['Cartagena', 'Turbaco'],
        'Bogota': ['Bogota DC'],
        'Boyaca': ['Tunja']
    };
    $scope.gender = ['masculino', 'femenino'];
    $scope.numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];
    $scope.level = ['Pregrado', 'Diplomado', 'Especialización', 'Maestria', 'Doctorado'];
    $scope.firstN = function(str, n){
        return str.substring(0, n);
    }

    $scope.hecho_pretension = {text: ''};

    //Logic
    //Modals
    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.save = function(answer) {
      $mdDialog.hide(answer);
    };
    //Convocante
    $scope.showConvocante = function(ev) {
        $mdDialog.show({
            templateUrl: URL.dev.template + '/forms/convocante.html',
            scope: $scope,        
            preserveScope: true,
            targetEvent: ev,
            fullscreen: $scope.customFullscreen
        }).then(function(answer) {
            $scope.add_convocante();
            console.log('Guardado con exito.')
        }, function() {
            console.log('Evento cancelado')
        });
    };
    
    //Convocado
    $scope.showConvocado = function(ev) {
        $mdDialog.show({
            templateUrl: URL.dev.template + '/forms/convocado.html',
            scope: $scope,        
            preserveScope: true,
            targetEvent: ev,
            fullscreen: $scope.customFullscreen
        }).then(function(answer) {
            $scope.add_convocado();
            console.log('Guardado con exito.')
        }, function() {
            console.log('Evento cancelado')
        });
    };
    //Hechos
    $scope.showHecho = function(ev) {
        $mdDialog.show({
            templateUrl: URL.dev.template + '/forms/hecho.html',
            scope: $scope,        
            preserveScope: true,
            targetEvent: ev,
            fullscreen: $scope.customFullscreen
        }).then(function(answer) {
            $scope.add_hp(1)
            console.log('Guardado con exito.')
        }, function() {
            $scope.cancel_hp(1)
            console.log('Evento cancelado')
        });
    };
    //Pretensiones
    $scope.showPretension = function(ev) {
        $mdDialog.show({
            templateUrl: URL.dev.template + '/forms/pretension.html',
            scope: $scope,        
            preserveScope: true,
            targetEvent: ev,
            fullscreen: $scope.customFullscreen
        }).then(function(answer) {
            $scope.add_hp(2)
            console.log('Guardado con exito.')
        }, function() {
            $scope.cancel_hp(2)
            console.log('Evento cancelado')
        });
    };

    //FinModal
    $scope.resetInvolucrado = function(){
        $scope.involucrado = {
            participation_type: '',
            involved: {
                nature: ''
            }
        };
    }
    //Convocante
    $scope.add_convocante = function(){
        $scope.involucrado.participation_type = 'convocante';
        Conciliacion.create.involved($scope.solicitude.id, 'convocante', $scope.involucrado).then(function(response){
            if($scope.involucrado.involved.nature == 'natural'){
                Conciliacion.create.natural($scope.solicitude.id, response.data.involved.id, $scope.involucrado.involved).then(function(response){
                    $scope.getSolicitude()
                    $scope.resetInvolucrado()
                }, function(response){console.log(response.data)})
            }else{
                Conciliacion.create.juridical($scope.solicitude.id, response.data.involved.id, $scope.involucrado.involved).then(function(response){
                    $scope.getSolicitude()
                    $scope.resetInvolucrado()
                },function(response){
                    console.log(response.data)
                })
            }
        })
    }
    //Convocado
    $scope.add_convocado = function(){
        $scope.involucrado.participation_type = 'convocado';
        Conciliacion.create.involved($scope.solicitude.id, 'convocado', $scope.involucrado).then(function(response){
            if($scope.involucrado.involved.nature == 'natural'){
                Conciliacion.create.natural($scope.solicitude.id, response.data.involved.id, $scope.involucrado.involved).then(function(response){
                    $scope.getSolicitude()
                    $scope.resetInvolucrado()
                }, function(response){console.log(response.data)})
            }else{
                Conciliacion.create.juridical($scope.solicitude.id, response.data.involved.id, $scope.involucrado.involved).then(function(response){
                    $scope.getSolicitude()
                    $scope.resetInvolucrado()
                },function(response){
                    console.log(response.data)
                })
            }
        })
    }
    //Hechos_pretensiones
    $scope.add_hp = function(type){
        if(type == 1){
            Conciliacion.create.fact($scope.solicitude.id, $scope.solicitude.conciliation.id, {description: $scope.hecho_pretension.text}).then(function(response){
                console.log(response.data)
                $scope.hecho_pretension.text = '';
                $scope.getSolicitude()
            },function(response){
                console.log(response.data)
            })
        }
        else{
            Conciliacion.create.pret($scope.solicitude.id, $scope.solicitude.conciliation.id, {description: $scope.hecho_pretension.text}).then(function(response){
                console.log(response.data)
                $scope.hecho_pretension.text = '';
                $scope.getSolicitude()
            },function(response){
                console.log(response.data)
            })
        }
    }
    //Validations
    $scope.convocantes_validation = function(){
        return $scope.convocantes().length != 0;
    }
    $scope.convocados_validation = function(){
        return $scope.convocados().length != 0;
    }
    $scope.hechos_validation = function(){
        return $scope.solicitude.conciliation.facts.length != 0;
    }
    $scope.pretensiones_validation = function(){
        return $scope.solicitude.conciliation.pretensions.length != 0;
    }
    //Wizard
    $scope.canExit = false;
    $scope.stepActive = true;

    $scope.finished = function() {
        $scope.solicitude.state = 'Pagado'
        Conciliacion.update.solicitude($scope.solicitude.id, $scope.solicitude.conciliation.id, $scope.solicitude).then(function(response){
            window.location = '#/app/conciliacion';
        },function(response){})
    };
    $scope.nextStep = function(state) {
        if($scope.solicitude.state == 'incompleta'){
            $scope.solicitude.state = 'incompleta/' + state
            $scope.solicitude.conciliation.definable = true
            console.log($scope.solicitude.conciliation)
            Conciliacion.create.conciliation($scope.solicitude.id, $scope.solicitude).then(function(response){
                console.log(response.data)
                console.log($scope.solicitude)
                Conciliacion.update.solicitude($scope.solicitude.id, $scope.solicitude.conciliation.id, $scope.solicitude).then(function(response){
                    $scope.getSolicitude()
                },function(response){})
            },function(response){console.log(response.data)})
        }else{
            $scope.solicitude.state = 'incompleta/' + state
            Conciliacion.update.solicitude($scope.solicitude.id, $scope.solicitude.conciliation.id, $scope.solicitude).then(function(response){
                $scope.getSolicitude()
            },function(response){console.log(response.data)})
        }
    };
    $scope.goBack = function() {
        WizardHandler.wizard().goTo(0);
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