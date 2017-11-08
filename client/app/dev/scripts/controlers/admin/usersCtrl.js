angular.module('app')
.controller('UsersCtlr', ['$scope', '$state', '$window','Admin', 'Session', '$mdDialog', 'URL', 'Conciliacion', function($scope, $state, $window, Admin, Session, $mdDialog, URL, Conciliacion){
		$('#loader-container').fadeIn('fast');
		Admin.index.users().then(function(response){
			$scope.users = response.data.users
			$('#loader-container').fadeOut('slow');
		})

		Conciliacion.get.constant('role').then(function(response){
			$scope.roles = response.data.constants
		})
		$scope.reFetch = function(){
			Admin.index.users().then(function(response){
				$scope.users = response.data.users
			})
		}

		$scope.user = {name: null, email: null, password: null, first_lastname: null, second_lastname: null, phone: null, professional_card: null, role: null}
		var originaluser = angular.copy($scope.user)
		$scope.resetUser = function(){
			$scope.user = angular.copy(originaluser);
	        return;
		}

		$scope.delete = function(user){
			Admin.delete.user(user.id).then(function(response){
				alertify.success('Exito eliminando usuario')
				$scope.reFetch()
			}, function(response){
				alertify.error('Error eliminando usuario')
				console.log(response.data)
			})
		}

		$scope.create = function(){
			Admin.create.user($scope.user).then(function(response){
				alertify.success('Exito creando el usuario')
				$scope.reFetch()
				$scope.resetUser()
			}, function(response){
				alertify.error('Error creando el usuario')
				console.log(response.data)
			})
		}

        $scope.getName = function(user){
        	return user.name + ' ' + user.first_lastname + ' ' + user.second_lastname
        }

		$scope.cancel = function() {
	        $scope.resetUser()
	        $mdDialog.cancel()
	    };
	    $scope.save = function(answer) {
	      $mdDialog.hide(answer);
	    };

	    $scope.showUser = function(ev) {
	        $mdDialog.show({
	            templateUrl: URL.dev.template + '/admin/user.html',
	            scope: $scope,        
	            preserveScope: true,
	            targetEvent: ev,
	            escapeToClose: false
	        }).then(function(answer) {
	        	if($scope.edit){
	        		$scope.edit = false
	        		$scope.editU()
	        	}else{
		            $scope.create()
		        }
	        });
	    };
	    $scope.edit = false
	    $scope.editUser = function(user, ev){
	    	$scope.user = user
	    	$scope.edit = true;
	    	$scope.showUser(ev)
	    }

	    $scope.editU = function(){
	    	$scope.edit = false
	    	delete $scope.user.role
	    	Admin.update.user($scope.user.id, $scope.user).then(function(response){
	    		alertify.success('Exito editando usuario')
	    		$scope.edit = false
	    		$scope.resetUser()
	    		$scope.reFetch()
	    	}, function(response){
	    		$scope.edit = false
	    		$scope.resetUser()
	    		alertify.error('Hubo un error editando el usuario, intente de nuevo')
	    		console.log(response.data)
	    	})
	    }
}])