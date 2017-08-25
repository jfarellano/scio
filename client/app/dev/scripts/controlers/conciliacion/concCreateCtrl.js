angular.module('app')
.controller('ConcCreateCtlr', ['$scope', '$q','$timeout', 'WizardHandler','Conciliacion', '$http', function($scope, $q, $timeout, WizardHandler, Conciliacion, $http){

    $scope.solicitude = {
      solicitude_type:'conciliation',
      case_number: '1',
      conciliation:{
        applicant: '',
        service_goal:'',
        conflict_time:'',
        definable:true,
        area:'',
        topic:'',
        pretensions:[],
        facts:[]
      },
      solicitude_participations:[]
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

    $scope.convtype = ['natural', 'juridical']

    $scope.area_topic = {
        'CIVIL Y COMERCIAL':['BIENES', 'COMPETENCIA DESLEAL', 'CONSUMO', 'CONTRATOS'],
        'CONTENCIOSO ADMINISTRATIVO': ['CONTROVERCIAS CONTRACTUALES', 'EJECUTIVO', 'NULIDAD Y RESTABLECIMIENTO DE DERECHO']
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
    $scope.gender = ['Masculino', 'Femenino'];
    $scope.numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];
    $scope.level = ['Pregrado', 'Diplomado', 'Especialización', 'Maestria', 'Doctorado'];
    $scope.firstN = function(str, n){
        return str.substring(0, n);
    }

    $scope.hecho_pretension = {text: ''};

    //Logic
    //Convocante
    $scope.convocante = false;
    $scope.switch_convocante = function(){
        $scope.convocante = !$scope.convocante;
    }
    $scope.new_convocante = function (){
        $scope.switch_convocante();
        WizardHandler.wizard().goTo(3);
    }
    $scope.add_convocante = function(){
        $scope.involucrado.participation_type = 'convocante';
        $scope.solicitude.solicitude_participations.push(angular.copy($scope.involucrado));
        $scope.involucrado = {
            participation_type: '',
            involved: {
                nature: ''
            }
        };
        $scope.switch_convocante();
    }
    $scope.cancel_convocante = function () {
        $scope.involucrado = {
            participation_type: '',
            naturaleza: ''
        };
        $scope.switch_convocante();
    };
    //Convocado
    $scope.convocado = false;
    $scope.switch_convocado = function(){
        $scope.convocado = !$scope.convocado;
    }
    $scope.new_convocado = function(){
        $scope.switch_convocado();
        WizardHandler.wizard().goTo(4);
    }
    $scope.add_convocado = function(){
        $scope.involucrado.participation_type = 'convocado';
        $scope.solicitude.solicitude_participations.push(angular.copy($scope.involucrado));
        $scope.involucrado = {
            participation_type: '',
            involved: {
                nature: ''
            }
        };
        $scope.switch_convocado();
    }
    $scope.cancel_convocado = function () {
        $scope.involucrado = {
            participation_type: '',
            involved: {
                nature: ''
            }
        };
        $scope.switch_convocado();
    };
    //Hechos_pretensiones
    $scope.hechos = false;
    $scope.pretensiones = false;
    $scope.switch_hp = function(type){
        if(type == 1){
            $scope.hechos = !$scope.hechos;
        }else{
            $scope.pretensiones = !$scope.pretensiones;
        }
    }
    $scope.new_hp = function(type){
       if(type == 1){
            $scope.switch_hp(1);
            WizardHandler.wizard().goTo(5);
        }
        else{
            $scope.switch_hp(2);
            WizardHandler.wizard().goTo(6);
        }
    }
    $scope.add_hp = function(type){
        if(type == 1){
            $scope.solicitude.conciliation.facts.push(angular.copy($scope.hecho_pretension.text));
            $scope.switch_hp(1);
        }
        else{
            $scope.solicitude.conciliation.pretensions.push(angular.copy($scope.hecho_pretension.text));
            $scope.switch_hp(2);
        }
        $scope.hecho_pretension.text = '';
    }
    $scope.cancel_hp = function (type) {
        if(type == 1){
            $scope.switch_hp(1);
        }
        else{
            $scope.switch_hp(2);
        }
        $scope.hecho_pretension.text = '';
    };
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
        Conciliacion.create($scope.solicitude).then(function(respuesta){
        console.log(respuesta.data)
        window.location = '#/app/conciliacion';
    },function(respuesta){
        console.log(respuesta.data)
    });
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