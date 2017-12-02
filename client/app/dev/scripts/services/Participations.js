angular.module('app')
.factory('Participations', ['$http', 'IP', 'Session',function ConciliacionFactory($http, IP, Session) {
	return{
		get:{
			juridical: function(id){
				return $http.post(IP + '/juridicals/show_by_identifier',id, {headers: Session.getHeaders()})
			},
			natural: function(id){
				return $http.post(IP + '/naturals/show_by_identifier', id,{headers: Session.getHeaders()})
			},
			assignee: function(id){
				return $http.post(IP + '/assignees/show_by_identifier', id,{headers: Session.getHeaders()})
			},
			representative: function(id){
				return $http.post(IP + '/representatives/show_by_identifier', id,{headers: Session.getHeaders()})
			}
		}
	}        
}]);