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
                    return $http.post(IP + '/involveds/' + invId + '/naturals', nat, {headers: Session.getHeaders()})
                },
                juridical:function(solID, invId,jur){
                    return $http.post(IP + '/involveds/' + invId + '/juridicals', jur,{headers: Session.getHeaders()})
                },
                fact:function(solID, concID, fact){
                    return $http.post(IP + '/conciliations/'+concID+'/facts', fact,{headers: Session.getHeaders()})
                },
                pret:function(solID, concID, pret){
                    return $http.post(IP + '/conciliations/'+concID+'/pretensions', pret, {headers: Session.getHeaders()})
                },
                assignee:function(solID, invID, assignee){
                    return $http.post(IP + '/assignees', assignee,{headers: Session.getHeaders()})
                },
                representative:function(solID, invID, rep){
                    return $http.post(IP + '/representatives', rep, {headers: Session.getHeaders()})
                },
                study:function(solID, invID, assigID, study){
                    return $http.post(IP + '/solicitudes/' +solID+ '/involveds/' +invID+ '/assignees/' +assigID+ '/studies', study,{headers: Session.getHeaders()})
                },
                proof: function(solID, file){
                    return Upload.upload({ url: IP + '/solicitudes/'+solID+'/proofs', data: {proof_data: file.file, name:file.name, description:file.description, testimony:file.testimony}, headers: Session.getHeaders()})
                },
                comment: function(){
                    return null
                },
                results: function(concID, results){
                    return $http.post(IP + '/conciliator/conciliations/'+concID+'/results', {result: {description:results}}, {headers: Session.getHeaders()})
                },
                profession: function(invID, type,proff){
                    return $http.post(IP + '/'+type+'/'+invID+'/professions', proff, {headers: Session.getHeaders()})
                },
                fundamentals: function(concID, fund){
                    return $http.post(IP + '/conciliations/'+concID+'/fundamentals', fund, {headers: Session.getHeaders()})
                },
                assignee_relation: function(assignee){
                    return $http.post(IP + '/solicitude_empowerments', assignee, {headers: Session.getHeaders()})
                },
                representative_relation: function(representative){
                    return $http.post(IP + '/solicitude_representations', representative, {headers: Session.getHeaders()})
                },
                global_assignee: function(solID, assigID, type){
                    return $http.get(IP + '/solicitudes/'+solID+'/assignees/'+assigID+'/'+type+'/set_global', {headers: Session.getHeaders()})
                },
                global_representative: function(solID, repID, type){
                    return $http.get(IP + '/solicitudes/'+solID+'/representatives/'+repID+'/'+type+'/set_global', {headers: Session.getHeaders()})
                }
            },
            update:{
                solicitude:function(id, sol){
                    return $http.put(IP + '/solicitudes/' + id, sol, {headers: Session.getHeaders()})
                },
                conciliation: function(id, conciliation){
                    return $http.put(IP + '/conciliations/' + id, {conciliation: conciliation}, {headers: Session.getHeaders()})
                },
                natural:function(solID, invID, natID, nat){
                    return $http.put(IP+ '/naturals/'+ natID , nat, {headers: Session.getHeaders()})
                },
                juridical:function(solID, invID, jurID, jur){
                    return $http.put(IP+ '/juridicals/'+jurID , jur,{headers: Session.getHeaders()})
                },
                involved:function(solID, invID, inv){
                    return $http.put(IP+ '/involveds/' +invID, inv, {headers: Session.getHeaders()})
                },
                fact:function(solID, concID, factID, fact){
                    return $http.put(IP + '/facts/' +factID, fact,{headers: Session.getHeaders()})
                },
                pret:function(solID, concID, pretID, pret){
                    return $http.put(IP + '/pretensions/' +pretID, pret, {headers: Session.getHeaders()})
                },
                assignee:function(solID, invID, assigID,assignee){
                    return $http.put(IP + '/assignees/' +assigID, assignee, {headers: Session.getHeaders()})
                },
                representative:function(solID, invID, repID, rep){
                    return $http.put(IP + '/representatives/' +repID, rep, {headers: Session.getHeaders()})
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
                    return $http.put(IP + '/professions/' + proffID, proff, {headers: Session.getHeaders()})
                },
                fundamentals: function(fundamentalID, fund){
                    return $http.put(IP + '/fundamentals/'+ fundamentalID, fund, {headers: Session.getHeaders()})
                },
                associate_involved: function(solID, invID, type){
                    return $http.get(IP + '/solicitudes/'+solID+'/relate_with/involveds/'+invID+ '/' + type, {headers: Session.getHeaders()})
                },
                set_postulant: function(solID, invID, type){
                    return $http.get(IP + '/solicitudes/'+solID+'/involved/'+invID+'/postulant/'+type, {headers: Session.getHeaders()})
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
                solicitude_document: function(concID){
                    return $http.get(IP + '/conciliation/'+concID+'/documents/conciliation_solicitude', {headers: Session.getHeaders()})
                },
                documents(concID){
                    return $http.get(IP + '/conciliation/'+concID+'/documents', {headers: Session.getHeaders()})
                },
                acta: function(concID, type){
                    return $http.get(IP + '/conciliation/'+concID+'/documents/conciliation_act/'+type, {headers: Session.getHeaders()})
                },
                constancia: function(concID){
                    return $http.get(IP + '/conciliation/'+concID+'/documents/conciliation_no_agreement_constance', {headers: Session.getHeaders()})
                },
                constancia_inasistencia_no_acuerdo: function(concID){
                    return $http.get(IP + '/conciliation/'+concID+'/documents/conciliation_no_agreement_by_unattendance_constance', {headers: Session.getHeaders()})
                },
                constancia_insasitencia: function(concID){
                    return $http.get(IP + '/conciliation/'+concID+'/documents/conciliation_unattendance_constance', {headers: Session.getHeaders()})
                },
                constancia_nueva_fecha: function (concID) {
                    return $http.get(IP + '/conciliation/'+concID+'/documents/conciliation_new_date_constance', {headers: Session.getHeaders()})
                },
                constancia_otro: function(concID, type){
                    return $http.get(IP + '/conciliation/'+concID+'/documents/conciliation_other_constance/'+ type, {headers: Session.getHeaders()})
                },
                notification: function(concID, invID){
                    return $http.get(IP + '/conciliation/'+concID+'/involved/'+invID+'/documents/conciliation_notification', {headers: Session.getHeaders()})
                },
                profession: function(ID, type){
                    return $http.get(IP + '/'+type+'/'+ID+'/professions', {headers: Session.getHeaders()})
                },
                fundamentals: function(concID){
                    return $http.get(IP + '/conciliations/'+concID+'/fundamentals', {headers: Session.getHeaders()})
                },
                active: function(data){
                    return $http.post(IP + '/conciliations/activas', data, {headers: Session.getHeaders()})
                },
                archive: function(data){
                    return $http.post(IP + '/conciliations/archivadas', data, {headers: Session.getHeaders()})
                },
                draft: function(data){
                    return $http.post(IP + '/conciliations/borradores', data, {headers: Session.getHeaders()})
                },
                active_all: function(data){
                    return $http.post(IP + '/coordinator/solicitudes/activas', data, {headers: Session.getHeaders()})
                },
                archive_all: function(data){
                    return $http.post(IP + '/coordinator/solicitudes/archivadas', data, {headers: Session.getHeaders()})
                },
                draft_all: function(data){
                    return $http.post(IP + '/coordinator/solicitudes/borradores', data, {headers: Session.getHeaders()})
                }
            },
            delete:{
                study:function(solID, invID, assigID, studyID){
                    return $http.delete(IP + '/solicitudes/' +solID+ '/involveds/' +invID+ '/assignees/' +assigID+ '/studies/' +studyID, {headers: Session.getHeaders()})
                },
                profession: function(proffID){
                    return $http.delete(IP + '/professions/' + proffID, {headers: Session.getHeaders()})
                },
                assignee: function(info){
                    return $http.post(IP + '/solicitude_empowerments/delete', info, {headers: Session.getHeaders()})
                },
                representative: function(info){
                    return $http.post(IP + '/solicitude_representations/delete', info, {headers: Session.getHeaders()})
                },
                global_relation: function(solID, type, con){
                    return $http.delete(IP + '/solicitudes/'+solID+'/'+type+'/'+con+'/destroy_global_relationship')
                },
                involved: function(invID){
                    return $http.delete(IP + '/involveds/'+ invID, {headers: Session.getHeaders()})
                },
                solicitude: function(solID){
                    return $http.delete(IP + '/solicitudes/' + solID, {headers: Session.getHeaders()})
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
