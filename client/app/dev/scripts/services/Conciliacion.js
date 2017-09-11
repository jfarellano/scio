angular.module('app')
    .factory('Conciliacion', ['$http', 'IP', function ConciliacionFactory($http, IP) {
        //Panel shared logic
        var state = true;
        var index = true;    
        var success = false;

        //Retun function 
        return{
            //Conciliation routes
            index: function(){
                if (state){
                    return $http.get(IP + '/solicitudes/tipo/conciliacion');
                }else{
                    return archive;
                }
            },
            show: function(solID){
                if(state){
                    return $http.get(IP + '/solicitudes/' + solID);
                }else{
                    return archive[id];
                }
            },
            create:{
                solicitude:function(sol){
                    return $http.post(IP + '/solicitudes', sol)
                },
                conciliation:function(id, conc){
                    return $http.post(IP + '/solicitudes/' + id + '/conciliations', conc)
                },
                involved:function(id, type, inv){
                    return $http.post(IP + '/solicitudes/' + id + '/involveds/' + type, inv)
                },
                natural:function(solId, invId, nat){
                    return $http.post(IP + '/solicitudes/' + solId + '/involveds/' + invId + '/naturals', nat)
                },
                juridical:function(solID, invId,jur){
                    return $http.post(IP + '/solicitudes/' + solID + '/involveds/' + invId + '/juridicals', jur)
                },
                fact:function(solID, concID, fact){
                    return $http.post(IP + '/solicitudes/'+solID+'/conciliations/'+concID+'/facts', fact)
                },
                pret:function(solID, concID, pret){
                    return $http.post(IP + '/solicitudes/'+ solID +'/conciliations/'+concID+'/pretensions', pret)
                }
            },
            update:{
                solicitude:function(id, sol){
                    return $http.put(IP + '/solicitudes/' + id, sol)
                },
                natural:function(solID, invID, natID, nat){
                    return $http.put(IP+ '/solicitudes/' +solID+ '/involveds/' +invID+ '/naturals/'+ natID , nat)
                },
                juridical:function(solID, invID, jurID, jur){
                    return $http.put(IP+ '/solicitudes/' +solID+ '/involveds/' +invID+ '/juridicals/'+jurID , jur)
                },
                involved:function(solID, invID, inv){
                    return $http.put(IP+ '/solicitudes/' +solID+ '/involveds/' +invID, inv)
                },
                fact:function(solID, concID, factID, fact){
                    return $http.put(IP + '/solicitudes/' +solID+ '/conciliations/' +concID+ '/facts/' +factID, fact)
                },
                pret:function(solID, concID, pretID, pret){
                    return $http.put(IP + '/solicitudes/' +solID+ '/conciliations/' +concID+ '/pretensions/' +pretID, pret)
                }
            },
            get:{
                solicitude:function(id){
                    return $http.get(IP + '/solicitudes/' + id)
                }
            },

            //Logic helpers in conciliations
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