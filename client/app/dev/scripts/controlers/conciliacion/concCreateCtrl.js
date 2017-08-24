angular.module('app')
.controller('ConcCreateCtlr', ['$scope', '$q','$timeout', 'WizardHandler','Conciliacion' , function($scope, $q, $timeout, WizardHandler, Conciliacion){

    $scope.data = Conciliacion.index();
    $scope.state = Conciliacion.state();

    $scope.getIndex = function(){
        return Conciliacion.getIndex();
    }

    $scope.solicitude = {
        solicitude_type:"CONCILIACION",
        conciliation:{
            applicant: "",
            service_goal:"",
            conflict_time: "",
            definable:true,
            area:"",
            topic:"",
            facts:[],
            pretensions:[],
            involucrados: []
        }
    }

    $scope.convocantes = function(){
        return $scope.solicitude.conciliation.involucrados.filter(i => i.rol == 'Convocante');
    }
    $scope.convocados = function(){
        return $scope.solicitude.conciliation.involucrados.filter(i => i.rol == 'Convocado');
    }

    $scope.applicant= ['LAS DOS PARTES', 'SOLO UNA DE LAS PARTES', 'MEDIANTE APODERADO']
    $scope.service_goal = ['RESOLVER DE MANERA ALTERNATIVA EL CONFLICTO', 'CUMPLIR CONFLICTO DE PROCEDIBILIDAD']

    $scope.involucrado = {
        rol: '',
        naturaleza: ''
    }

    $scope.convtype = ['Persona', 'Organizacion']

    $scope.area_topic = {
        'CIVIL y COMERCIAL':['BIENES', 'COMPETENCIA DESLEAL', 'CONSUMO', 'CONTRATOS'],
        'CONTENCIOSO ADMINISTRATIVO': ['CONTROVERCIAS CONTRACTUALES', 'EJECUTIVO', 'NULIDAD Y RESTABLECIMIENTO DE DERECHO']
    };
    $scope.org_type = ['Privada', 'Publica']
    $scope.public_type = ['Organismo de control', 'Rama judicial', 'Rama legislativa', 'Rama ejecutiva']
    $scope.org_idtype = ['NIT', 'Numero de identificacion de sociedad extranjera'];
    $scope.economic_sector = ['Type1', 'Type2', 'Type3', 'Type4', 'Type5'];
    $scope.department = '';
    $scope.idType = ['cc', 'pasaporte'];
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
        $scope.involucrado.rol = 'Convocante';
        $scope.solicitude.conciliation.involucrados.push(angular.copy($scope.involucrado));
        $scope.involucrado = {
            rol: '',
            naturaleza: ''
        };
        $scope.switch_convocante();
    }
    $scope.cancel_convocante = function () {
        $scope.involucrado = {
            rol: '',
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
        $scope.involucrado.rol = 'Convocado';
        $scope.solicitude.conciliation.involucrados.push(angular.copy($scope.involucrado));
        $scope.involucrado = {
            rol: '',
            naturaleza: ''
        };
        $scope.switch_convocado();
    }
    $scope.cancel_convocado = function () {
        $scope.involucrado = {
            rol: '',
            naturaleza: ''
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