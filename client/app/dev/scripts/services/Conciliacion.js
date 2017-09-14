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
                },
                assignee:function(solID, invID, assignee){
                    return $http.post(IP + '/solicitudes/' +solID+ '/involveds/' +invID+ '/assignees', assignee)
                },
                representative:function(solID, invID, rep){
                    return $http.post(IP + '/solicitudes/' +solID+ '/involveds/' +invID+ '/representatives', rep)
                },
                study:function(solID, invID, assigID, study){
                    return $http.post(IP + '/solicitudes/' +solID+ '/involveds/' +invID+ '/assignees/' +assigID+ '/studies', study)
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
                },
                assignee:function(solID, invID, assigID,assignee){
                    return $http.put(IP + '/solicitudes/' +solID+ '/involveds/' +invID+ '/assignees/' +assigID, assignee)
                },
                representative:function(solID, invID, repID, rep){
                    return $http.put(IP + '/solicitudes/' +solID+ '/involveds/' +invID+ '/representatives/' +repID, rep)
                },
                study:function(solID, invID, assigID, studyID,study){
                    return $http.put(IP + '/solicitudes/' +solID+ '/involveds/' +invID+ '/assignees/' +assigID+ '/studies/' +studyID, study)
                }
            },
            get:{
                solicitude:function(id){
                    return $http.get(IP + '/solicitudes/' + id)
                }
            },
            delete:{
                study:function(solID, invID, assigID, studyID){
                    return $http.delete(IP + '/solicitudes/' +solID+ '/involveds/' +invID+ '/assignees/' +assigID+ '/studies/' +studyID)
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