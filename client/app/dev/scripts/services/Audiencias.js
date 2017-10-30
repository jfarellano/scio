angular.module('app')
.factory('Audiencias', ['$http', 'IP', 'Session',function ConciliacionFactory($http, IP, Session) {
	return{
		get:{
			user_audiences: function(){
				return $http.get(IP + '/user/my_audiences', {headers: Session.getHeaders()})
			},
			solicitude: function(solID){
				return $http.get(IP + '/solicitudes/'+solID+'/audiences', {headers: Session.getHeaders()})
			}
		},
		create:{
			audience: function(solID, audience){
				return $http.post(IP + '/conciliator/solicitudes/'+solID+'/audiences', audience, {headers: Session.getHeaders()})
			},
			assistance: function(audienceID, ids){
				return $http.post(IP + '/conciliator/audiences/'+audienceID+'/set_assistance', {involveds: ids}, {headers: Session.getHeaders()} )
			},
			assistance_document: function(concID, audID){
				return $http.get(IP + '/conciliation/'+concID+'/documents/audience/'+audID+'/assistance_constancy_new_date', {headers: Session.getHeaders()})
			}
		},
		update:{
			audience: function(audienceID, audience){
				return $http.put(IP + '/conciliator/audiences/'+audienceID, audience, {headers: Session.getHeaders()})
			}
		}
	}        
}]);