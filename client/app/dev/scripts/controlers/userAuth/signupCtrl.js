angular.module('app')
.controller('SignupCtrl', ['$scope', '$window', 'URL', 'Session', '$mdDialog', 'Conciliacion',function($scope, $window, URL, Session, $mdDialog, Conciliacion){
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
        professional_card: '',
        experience_years: '',
        univercity_name: '',
        univercity_title: '',
        study_level: ''
    }
    $scope.lawyer = false
    $scope.department = ''
    $scope.abogado = false;
    $scope.logo = URL.image + '/logo.png';
    $scope.register = function(){
        $window.location = '#/iniciosesion'
    }

    $scope.error = false
    //Validation
    original = angular.copy($scope.user);
    $scope.canSubmit = function() {
        return $scope.signupForm.$valid && !angular.equals($scope.user, original);
    };
    Conciliacion.get.constant('gender').then(function(response){
        //console.log(response.data)
        $scope.gender = response.data.constants
    })  
    $scope.submitForm = function() {
        Session.signUp($scope.user).then(function(response){
            $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Registro exitoso')
                .textContent('Su registro ha sido exitoso. Por favor incie sesión a continuación.')
                .ariaLabel('Registro exitoso')
                .ok('Continuar')
            $window.location = '#/iniciosesion'
            alertify.log("Registro exitoso")
        },function(response){
            $scope.error = true
            console.log(response.data)
            console.log('Datos invalidos')
            alertify.error("Error en el registro.")
        })
    }; 
}]);