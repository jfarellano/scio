angular.module('app')
.controller('RoomsCtlr', ['$scope', '$state', '$window','Admin', 'Session',function($scope, $state, $window, Admin, Session){
		$('#loader-container').fadeIn('fast');
		Admin.index.rooms().then(function(response){
			$scope.rooms = response.data.rooms
			$('#loader-container').fadeOut('slow');
		})

		$scope.reFetch = function(){
			Admin.index.rooms().then(function(response){
				$scope.rooms = response.data.rooms
			})
		}

		$scope.room = {name: null, description: null}
		var originalRoom = angular.copy($scope.room)
		$scope.resetRoom = function(){
			$scope.room = angular.copy(originalRoom);
	        $scope.salas.$setPristine();
	        $scope.salas.$setUntouched();
	        return;
		}

		$scope.deleteRoom = function(room){
			Admin.delete.room(room.id).then(function(response){
				alertify.success('Exito eliminando sala')
				$scope.reFetch()
			}, function(response){
				console.log(response.data)
				alertify.error('Error eliminando sala')
			})
		}

		$scope.create = function(){
			Admin.create.room({room: $scope.room}).then(function(response){
				alertify.success('Exito creando la sala')
				$scope.reFetch()
				$scope.resetRoom()
			}, function(response){
				alertify.error('Error creando la sala')
				console.log(response.data)
			})
		}

}])