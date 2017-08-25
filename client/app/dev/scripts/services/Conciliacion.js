angular.module('app')
    .factory('Conciliacion', ['$http', function ConciliacionFactory($http) {
        //Panel shared logic
        var state = true;
        var index = true;    
        var success = false;

        //Retun function 
        return{
            index: function(){
                if (state){
                    return $http.get('http://192.168.1.77:3000/solicitudes');
                }else{
                    return archive;
                }
            },
            show: function(id){
                if(state){
                    return $http.get('http://192.168.1.77:3000/solicitudes/'+id);
                }else{
                    return archive[id];
                }
            },
            create: function (conc) {
                return $http.post('http://192.168.1.77:3000/solicitudes',{solicitude: conc})
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