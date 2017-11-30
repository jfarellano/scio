angular.module('app')
.controller('UsersCtlr', ['$scope', '$state', '$window','Admin', 'Session', '$mdDialog', 'URL', 'Conciliacion', 'COL', 'IP', function($scope, $state, $window, Admin, Session, $mdDialog, URL, Conciliacion, COL, IP){
		$('#loader-container').fadeIn('fast');
		$scope.IP = IP
		Admin.index.users(1).then(function(response){
			$('#loader-container').fadeOut('slow');
			$scope.users = response.data.users
			console.log($scope.users)
			$scope.users.forEach(function(user){
				if(user.birthdate != null){
					user.birthdate = new Date(user.birthdate)
				}
			})
		}, function(response){
			console.log(response.data)
		})

		$scope.image = function(user){
			if(user.profile_picture != null){
				return IP + user.profile_picture
			}else{
				return '/assets/images/circ.png'
			}
		}

		Conciliacion.get.constant('role').then(function(response){
			$scope.roles = response.data.constants
		})
		$scope.reFetch = function(){
			Admin.index.users().then(function(response){
				$scope.users = response.data.users
				$scope.users.forEach(function(user){
					if(user.birthdate != null){
						user.birthdate = new Date(user.birthdate)
					}
				})
			})
		}
		$scope.indice = 1
		$scope.morePages = true
		$scope.indexChange = function(acction){
			$('#loader-container').fadeIn('fast');
			if(acction){
				if($scope.indice != 1){
					$scope.indice = $scope.indice - 1
					Admin.index.users($scope.indice).then(function(response){
					$('#loader-container').fadeOut('slow');
						$scope.users = response.data.users
						$scope.users.forEach(function(user){
							if(user.birthdate != null){
								user.birthdate = new Date(user.birthdate)
							}
						})
					}, function(response){
						console.log(response.data)
					})
					$scope.morePages = true
				}
			}else{
				if ($scope.morePages) {
					$scope.indice = $scope.indice + 1
					Admin.index.users($scope.indice).then(function(response){
					$('#loader-container').fadeOut('slow');
						$scope.users = response.data.users
						$scope.users.forEach(function(user){
							if(user.birthdate != null){
								user.birthdate = new Date(user.birthdate)
							}
						})
						if ($scope.users.length == 0) {
							$scope.morePages = false
						}
					}, function(response){
						console.log(response.data)
					})
				}
			}
		}

		$scope.user = {}
		var originaluser = angular.copy($scope.user)
		$scope.resetUser = function(){
			$scope.user = angular.copy(originaluser);
			$scope.user.birthdate = null
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
				$scope.edit = false;
				$scope.reFetch()
				$scope.resetUser()
			}, function(response){
				$scope.edit = false;
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
	    	Conciliacion.get.constant_child(COL ,'department').then(function(response){
	            $scope.departments = response.data.constants
	            var r2 = $scope.departments.filter(function(d){
	                return d.value == $scope.user.department
	            })
	            Conciliacion.get.constant_child(r2[0].id, 'city').then(function(response){
	                $scope.cities = response.data.constants
	            })
	        })
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

	    Conciliacion.get.constant('city').then(function(response){
	        var all_cities = response.data.constants.sort(function (a, b) {
	            if(a.value < b.value){
	                return -1
	            }else if(a.value > b.value){
	                return 1
	            }
	            return 0
	        })
	        $scope.all_cities = []
	        $.each(all_cities, function(i, el){
	            if ($scope.uniqueCity(el)){
	                $scope.all_cities.push(el);
	            }
	        })
	    }, function(response){
	    	console.log(response.data)
	    })
	    $scope.uniqueCity = function(ele){
        var a = $scope.all_cities.filter(function(elem){
            return ele.value == elem.value
        })
        return a.length == 0
    }

	    Conciliacion.get.constant('country').then(function(response){
			$scope.countries = response.data.constants
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