angular.module('app')
    .factory('Conciliacion', ['$http', function ConciliacionFactory($http) {
        //Panel shared logic
        var state = true;
        var index = true;    
        var success = false;

        var ip = 'http://192.168.1.81:3000'

        //Retun function 
        return{
            index: function(){
                if (state){
                    return $http.get(ip + '/solicitudes');
                }else{
                    return archive;
                }
            },
            show: function(id){
                if(state){
                    return $http.get(ip + '/solicitudes/'+id);
                }else{
                    return archive[id];
                }
            },
            create: function (conc) {
                return $http.post(ip + '/solicitudes',{solicitude: conc})
            },
            create_success: function(){
                return success;
            },
            state: function(){
                return  state;
            },
            setState: function(val){
                state = val;
            },
            getIndex: function(){
                return index;
            },
            setIndex: function(info){
                index = info;
            }
    }
}]);