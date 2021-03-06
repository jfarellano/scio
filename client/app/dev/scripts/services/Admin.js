angular.module('app')
.factory('Admin', ['$http', 'IP', 'Session', 'Upload',function ConciliacionFactory($http, IP, Session, Upload) {
	return{
		index:{
			rooms: function(){
				return $http.get(IP + '/rooms', {headers: Session.getHeaders()})
			},
			users: function(index){
				return $http.post(IP + '/admin/users/index', {page: index},{headers: Session.getHeaders()})
			}
		},
		create:{
			room: function(room){
				return $http.post(IP + '/rooms', room, {headers: Session.getHeaders()})
			},
			user: function(user){
				//return $http.post(IP + '/admin/users', user, {headers: Session.getHeaders()})
				return  Upload.upload({method: 'POST', url: IP + '/admin/users',data: user , headers: Session.getHeaders()})
			}
		},
		update:{
			user: function(userID, user){
				return $http.put(IP + '/admin/users/' + userID, user, {headers: Session.getHeaders()})
			}, 
			room: function(roomID, room){
				return $http.put(IP + '/rooms/' + roomID, room, {headers: Session.getHeaders()})
			}
		},
		delete:{
			user: function(userID){
				return $http.delete(IP + '/admin/users/'+userID, {headers: Session.getHeaders()})
			},
			room: function(roomID){
				return $http.delete(IP + '/rooms/' + roomID)
			}
		}
	}        
}]);