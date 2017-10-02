angular.module('app')
.factory('Admin', ['$http', 'IP', 'Session',function ConciliacionFactory($http, IP, Session) {
	console.log('Existo')
	return{
		index:{
			rooms: function(){
				return $http.get(IP + '/rooms', {headers: Session.getHeaders()})
			},
			users: function(){
				return $http.get(IP + '/users', {headers: Session.getHeaders()})
			}
		},
		create:{
			room: function(room){
				return $http.post(IP + '/rooms', room, {headers: Session.getHeaders()})
			},
			user: function(user){
				return $http.post(IP + '/admin/users', user, {headers: Session.getHeaders()})
			}
		}
	}        
}]);