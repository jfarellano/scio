angular.module('app')
.factory('Admin', ['$http', 'IP', 'Session',function ConciliacionFactory($http, IP, Session) {
	return{
		index:{
			rooms: function(){
				return $http.get(IP + '/rooms', {headers: Session.getHeaders()})
			},
			users: function(){
				return $http.get(IP + '/admin/users', {headers: Session.getHeaders()})
			}
		},
		create:{
			room: function(room){
				return $http.post(IP + '/rooms', room, {headers: Session.getHeaders()})
			},
			user: function(user){
				return $http.post(IP + '/admin/users', user, {headers: Session.getHeaders()})
			}
		},
		update:{
			user: function(userID, user){
				return $http.put(IP + '/admin/users/' + userID, user, {headers: Session.getHeaders()})
			}
		},
		delete:{
			user: function(userID){
				return $http.delete(IP + '/admin/users/'+userID, {headers: Session.getHeaders()})
			}
		}
	}        
}]);