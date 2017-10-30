angular.module('app')
    .factory('Conciliacion',['$http', 'IP', 'Session', 'Upload',function ConciliacionFactory($http, IP, Session, Upload) {
        //Panel shared logic
        var state = true;
        var index = true;    
        var success = false;

        //Retun function 
        return{
            //Conciliation routes
            index: function(){
                if (state){
                    return $http.get(IP + '/conciliations', {headers: Session.getHeaders()});
                }else{
                    return archive;
                }
            },
            coordinator_index: function(){
                return $http.get(IP + '/coordinator/solicitudes', {headers: Session.getHeaders()})
            },
            show: function(solID){
                if(state){
                    return $http.get(IP + '/solicitudes/' + solID, {headers: Session.getHeaders()});
                }else{
                    return archive[id];
                }
            },
            create:{
                solicitude:function(sol){
                    return $http.post(IP + '/solicitudes',sol,{headers: Session.getHeaders()})
                },
                conciliation:function(id, conc){
                    return $http.post(IP + '/solicitudes/' + id + '/conciliations', conc,{headers: Session.getHeaders()})
                },
                involved:function(id, type, inv){
                    return $http.post(IP + '/solicitudes/' + id + '/involveds/' + type, inv,{headers: Session.getHeaders()})
                },
                natural:function(solId, invId, nat){
                    return $http.post(IP + '/solicitudes/' + solId + '/involveds/' + invId + '/naturals', nat, {headers: Session.getHeaders()})
                },
                juridical:function(solID, invId,jur){
                    return $http.post(IP + '/solicitudes/' + solID + '/involveds/' + invId + '/juridicals', jur,{headers: Session.getHeaders()})
                },
                fact:function(solID, concID, fact){
                    return $http.post(IP + '/conciliations/'+concID+'/facts', fact,{headers: Session.getHeaders()})
                },
                pret:function(solID, concID, pret){
                    return $http.post(IP + '/conciliations/'+concID+'/pretensions', pret, {headers: Session.getHeaders()})
                },
                assignee:function(solID, invID, assignee){
                    return $http.post(IP + '/solicitudes/' +solID+ '/involveds/' +invID+ '/assignees', assignee,{headers: Session.getHeaders()})
                },
                representative:function(solID, invID, rep){
                    return $http.post(IP + '/solicitudes/' +solID+ '/involveds/' +invID+ '/representatives', rep, {headers: Session.getHeaders()})
                },
                study:function(solID, invID, assigID, study){
                    return $http.post(IP + '/solicitudes/' +solID+ '/involveds/' +invID+ '/assignees/' +assigID+ '/studies', study,{headers: Session.getHeaders()})
                },
                proof: function(solID, file){
                    return Upload.upload({ url: IP + '/solicitudes/'+solID+'/proofs', data: {proof_data: file, name:file.name}, headers: Session.getHeaders()})
                },
                comment: function(){
                    return null
                },
                results: function(concID, results){
                    return $http.post(IP + '/conciliator/conciliations/'+concID+'/results', {result: {description:results}}, {headers: Session.getHeaders()})
                },
                profession: function(invID, proff){
                    return $http.post(IP + '/involved/'+invID+'/professions', proff, {headers: Session.getHeaders()})
                }
            },
            update:{
                solicitude:function(id, sol){
                    return $http.put(IP + '/solicitudes/' + id, sol, {headers: Session.getHeaders()})
                },
                natural:function(solID, invID, natID, nat){
                    return $http.put(IP+ '/solicitudes/' +solID+ '/involveds/' +invID+ '/naturals/'+ natID , nat, {headers: Session.getHeaders()})
                },
                juridical:function(solID, invID, jurID, jur){
                    return $http.put(IP+ '/solicitudes/' +solID+ '/involveds/' +invID+ '/juridicals/'+jurID , jur,{headers: Session.getHeaders()})
                },
                involved:function(solID, invID, inv){
                    return $http.put(IP+ '/solicitudes/' +solID+ '/involveds/' +invID, inv, {headers: Session.getHeaders()})
                },
                fact:function(solID, concID, factID, fact){
                    return $http.put(IP + '/facts/' +factID, fact,{headers: Session.getHeaders()})
                },
                pret:function(solID, concID, pretID, pret){
                    return $http.put(IP + '/pretensions/' +pretID, pret, {headers: Session.getHeaders()})
                },
                assignee:function(solID, invID, assigID,assignee){
                    return $http.put(IP + '/solicitudes/' +solID+ '/involveds/' +invID+ '/assignees/' +assigID, pret, {headers: Session.getHeaders()})
                },
                representative:function(solID, invID, repID, rep){
                    return $http.put(IP + '/solicitudes/' +solID+ '/involveds/' +invID+ '/representatives/' +repID, rep, {headers: Session.getHeaders()})
                },
                study:function(solID, invID, assigID, studyID,study){
                    return $http.put(IP + '/solicitudes/' +solID+ '/involveds/' +invID+ '/assignees/' +assigID+ '/studies/' +studyID, study,{headers: Session.getHeaders()})
                },
                coordinator_solicitude:function(solID, sol){
                    return $http.put(IP + '/coordinator/solicitudes/' + solID, sol, {headers: Session.getHeaders()})
                },
                set_conciliator: function(solID, conID){
                    return $http.get(IP + '/coordinator/users/'+conID+'/solicitudes/'+solID, {headers: Session.getHeaders()})
                },
                conciliator_solicitude: function(solID, sol){
                    return $http.put(IP + '/conciliator/solicitudes/' + solID, sol, {headers: Session.getHeaders()})
                },
                profession: function(proffID, proff){
                    return $http.post(IP + '/professions/' + proffID, proff, {headers: Session.getHeaders()})
                }
            },
            get:{
                solicitude:function(id){
                    return $http.get(IP + '/solicitudes/' + id, {headers: Session.getHeaders()})
                },
                constant:function(con){
                    return $http.get(IP + '/constants/' + con, {headers: Session.getHeaders()})
                },
                constant_child:function(id, con){
                    return $http.get(IP + '/constants/children/'+id+'/'+con, {headers: Session.getHeaders()})
                },
                rooms:function(){
                    return $http.get(IP + '/rooms', {headers: Session.getHeaders()})
                },
                audiences_room:function(id){
                    return $http.get(IP + '/rooms/'+id+'/audiences', {headers: Session.getHeaders()})
                },
                proof: function(solID){
                    return $http.get(IP + '/solicitudes/'+solID+'/proofs', {headers: Session.getHeaders()})
                },
                solicitude_document: function(solID){
                    return $http.get(IP + '/conciliation/'+solID+'/documents/resume', {headers: Session.getHeaders()})
                },
                user_notification: function(concID, invID, audID){
                    return $http.get(IP + '/conciliation/'+concID+'/documents/involved/'+invID+'/audience/'+audID+'/audience_notification', {headers: Session.getHeaders()})
                },
                documents(concID){
                    return $http.get(IP + '/conciliation/'+concID+'/documents', {headers: Session.getHeaders()})
                },
                acuerdo: function(concID){
                    return $http.get(IP + '/conciliation/'+concID+'/documents/act/total', {headers: Session.getHeaders()})
                },
                no_acuerdo: function(concID){
                    return $http.get(IP + '/conciliation/'+concID+'/documents/no_agreement_constancy', {headers: Session.getHeaders()})
                },
                no_acuerdo_inasistencia: function(concID){
                    return $http.get(IP + '/conciliation/'+concID+'/documents/no_agreement_constancy_due_to_no_assistance', {headers: Session.getHeaders()})
                },
                profession: function(invID){
                    return $http.get(IP + '/involved/'+invID+'/professions')
                }
            },
            delete:{
                study:function(solID, invID, assigID, studyID){
                    return $http.delete(IP + '/solicitudes/' +solID+ '/involveds/' +invID+ '/assignees/' +assigID+ '/studies/' +studyID, {headers: Session.getHeaders()})
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