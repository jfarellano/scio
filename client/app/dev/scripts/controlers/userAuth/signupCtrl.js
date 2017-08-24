angular.module('app')
.controller('SignupCtrl', ['$scope', '$window', 'URL', function($scope, $window, URL){
    $scope.user = {
        first_first_name: '',
        second_first_name: '',
        first_last_name: '',
        second_last_name: '',
        email: '',
        phone: '',
        id_type: '',
        id_numeber: '',
        id_expedition_city: '',
        id_expedition_date: '',
        genero: '',
        resident_department: '',
        resident_city: '',
        direccion: '',
        estrato: '',
        //Lawyer
        lawyer_id: '',
        experience_years: '',
        univercity_name: '',
        univercity_title: '',
        study_level: ''
    };
    $scope.lawyer = false;
    $scope.department = '';
    $scope.idType = ['cc', 'pasaporte'];
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
    $scope.abogado = false;
    $scope.logo = URL.image + '/logo.png';
    $scope.register = function(){
        $window.location = '#/iniciosecion'
    }

    //Validation
    original = angular.copy($scope.user);
    $scope.canSubmit = function() {
        return $scope.signupForm.$valid && !angular.equals($scope.user, original);
    };    
    $scope.submitForm = function() {
        $scope.showInfoOnSubmit = true;
        $window.location = '#/iniciosecion'
        return $scope.revert();
    }; 
}]);