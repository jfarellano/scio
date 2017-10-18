angular.module('app')
.controller('profileCtrl', ['$scope', '$window', 'URL', 'Session', '$mdDialog', 'IP',function($scope, $window, URL, Session, $mdDialog, IP){


    Session.show().then(function(response){
        $scope.user = response.data.user
    },function(response){
        console.log(response.data)
    })

    $scope.reFetch = function(){
        Session.show().then(function(response){
            $scope.user = response.data.user
        },function(response){
            console.log(response.data)
        })
    }

    $scope.getName = function(){
        return $scope.user.name + ' ' + $scope.user.first_lastname + ' ' + $scope.user.second_lastname
    }

    $scope.update = function(){
        delete $scope.user.profile_picture
        Session.update($scope.user).then(function(response){
            $scope.reFetch()
            alertify.success('Exito modificando usuario')
        }, function(response){
            $scope.reFetch()
            console.log(response.data)
            alertify.error('Error modificando usuario')
        })
    }

    $scope.lawyer = false
    $scope.department = ''
    $scope.abogado = false;
    $scope.logo = URL.image + '/logo.png';
    $scope.register = function(){
        $window.location = '#/iniciosecion'
    }

    $scope.getPic = function(){
        return IP  +'/'+  $scope.user.profile_picture
    }

    $scope.updatePicture = function(file){
        //$scope.user.profile_picture = file
        Session.updatePicture(file).then(function(response){
            alertify.success('Exito editando foto de perfil')
            $scope.reFetch()
        }, function(response){
            $scope.reFetch()
            alertify.error('Error editando foto de perfil')
            console.log(response.data)
        })
    }

    $scope.error = false
    //Validation
    original = angular.copy($scope.user);
    $scope.canSubmit = function() {
        return $scope.signupForm.$valid && !angular.equals($scope.user, original);
    };    

    $scope.cancel = function() {
        $mdDialog.cancel()
    };
    $scope.save = function(answer) {
      $mdDialog.hide(answer);
    };

    $scope.showUser = function(ev) {
        $mdDialog.show({
            templateUrl: URL.dev.template + '/user/userEdit.html',
            scope: $scope,        
            preserveScope: true,
            targetEvent: ev,
            escapeToClose: false
        }).then(function(answer) {
            $scope.update()
        });
    };
}]);