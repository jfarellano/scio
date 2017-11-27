angular.module('app')
.controller('UsersCtlr', ['$scope', '$state', '$window','Admin', 'Session', '$mdDialog', 'URL', 'Conciliacion', 'COL', function($scope, $state, $window, Admin, Session, $mdDialog, URL, Conciliacion, COL){
		$('#loader-container').fadeIn('fast');
		Admin.index.users().then(function(response){
			$scope.users = response.data.users
			console.log($scope.users)
			$('#loader-container').fadeOut('slow');
		}, function(response){
			console.log(response.data)
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
				console.log(response.data)
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
	        		$scope.edit = false
		            $scope.create()
		        }
	        });
	    };
	    $scope.edit = false
	    $scope.editUser = function(user, ev){
	    	$scope.user = user
	    	console.log(user)
	    	$scope.edit = true;
	    	$scope.showUser(ev)
	    }

	    Conciliacion.get.constant('gender').then(function(response){
	        $scope.gender = response.data.constants
	    }) 

	    Conciliacion.get.constant_child(COL ,'department').then(function(response){
	        $scope.departments = response.data.constants
	        var r2 = $scope.departments.filter(function(d){
	            return d.value == $scope.user.department
	        })
	        if(r2.length > 0){
	            Conciliacion.get.constant_child(r2[0].id, 'city').then(function(response){
	                $scope.cities = response.data.constants
	            })
	        }
	    })

	    Conciliacion.get.constant('strata').then(function(response){
	        $scope.estratos = response.data.constants
	    })

	    $scope.getCities = function(){
	        var r = $scope.departments.filter(function(a) {
	            return a.value == $scope.user.department
	        })
	        Conciliacion.get.constant_child(r[0].id, 'city').then(function(response){
	            $scope.cities = response.data.constants
	        })
	    }
	    $scope.editU = function(){
	    	$scope.edit = false
	    	delete $scope.user.role
	    	Admin.update.user($scope.user.id, $scope.user).then(function(response){
	    		alertify.success('Exito editando usuario')
	    		console.log(response.data)
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