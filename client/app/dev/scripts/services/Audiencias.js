angular.module('app')
.factory('Audiencias', ['$http', 'IP', function ConciliacionFactory($http, IP) {
	return{
		get:{
			user_audiences: function(usrID){
				return $http.get(IP + '/users/'+usrID+'/audiences')
			}
		},
		create:{
			audience: function(solID, audience){
				return $http.post(IP + '/solicitudes/'+solID+'/audiences', audience)
			}
		}
	}        
}]);