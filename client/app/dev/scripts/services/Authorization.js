angular.module('app')
    .factory('Authorization', ['$http', 'IP', function ConciliacionFactory($http, IP) {
        //Panel shared logic
        var state = true;
        var index = true;    
        var success = false;

        //Retun function 
        return{
            login:function(info){
                return $http.post(IP + '/sessions', info)
            },
            sign_up:function(info){
                return $http.post(IP + '/users', info)
            },
            sign_out:function(info){
                
            }
        }
}]);