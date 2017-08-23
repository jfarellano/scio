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

    $scope.convovantes = function(){
        return solicitude.conciliation.involucrados.filter(i => i.rol == 'Convocante');
    }
    $scope.convocados = function(){
        return solicitude.conciliation.involucrados.filter(i => i.rol == 'Convocado');
    }

    $scope.applicant= ['LAS DOS PARTES', 'SOLO UNA DE LAS PARTES', 'MEDIANTE APODERADO']
    $scope.service_goal = ['RESOLVER DE MANERA ALTERNATIVA EL CONFLICTO', 'CUMPLIR CONFLICTO DE PROCEDIBILIDAD']

    $scope.involucrado = {
        rol: '',
        naturaleza: ''
    }

    $scope.persona = {
        rol:'',
        naturaleza: 'pesona',
        first_first_name: '',
        second_first_name: '',
        first_last_name: '',
        second_last_name: '',
        email: '',
        phone: '',
        origin_country: '',
        birth_date: '',
        id_type: '',
        id_numeber: '',
        id_expedition_city: '',
        id_expedition_date: '',
        genero: '',
        resident_department: '',
        resident_city: '',
        direccion: '',
        estrato: '',
        study_level: ''
    }
    $scope.convtype = ['Persona', 'Organizacion']
    $scope.organization = {
        rol: '',
        naturaleza: 'Organizacion',
        organization_type: '',
        public_entity_type: '',
        id_type: '',
        id_numeber: '',
        name: '',
        economic_sector: '',
        origin_country: '',
        resident_department: '',
        resident_city: '',
        direccion: '',
        email: '',
        phone: ''
    }

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