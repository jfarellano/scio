angular.module('app')
.factory('Participations', ['$http', 'IP', 'Session',function ConciliacionFactory($http, IP, Session) {
	return{
		get:{
			juridical: function(id){
				return $http.post(IP + '/involveds/1/juridicals/show_by_identifier',id, {headers: Session.getHeaders()})
			},
			natural: function(id){
				return $http.post(IP + '/involveds/1/naturals/show_by_identifier', id,{headers: Session.getHeaders()})
			}
		}
	}        
}]);