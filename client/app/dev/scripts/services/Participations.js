angular.module('app')
.factory('Participations', ['$http', 'IP', 'Session',function ConciliacionFactory($http, IP, Session) {
	return{
		get:{
			juridical: function(id){
				return $http.get(IP + '/solicitudes/20200202/involveds/928398283/juridicals/nit/'+id, {headers: Session.getHeaders()})
			},
			natural: function(idType, id){
				console.log(idType)
				console.log(IP + '/solicitudes/1/involveds/1/naturals/'+idType+'/'+id)
				return $http.get(IP + '/solicitudes/1/involveds/1/naturals/'+idType+'/'+id, {headers: Session.getHeaders()})
			}
		}
	}        
}]);