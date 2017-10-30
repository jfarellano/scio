angular.module('app')
.controller('AudConcCtrl', ['$scope', '$state', 'Conciliacion', '$window', 'screenSize', '$mdDialog', 'URL', 'Session', '$compile', 'Audiencias', 'IP',function($scope, $state,Conciliacion, window, screenSize, $mdDialog, URL, Session, $compile, Audiencias, IP){
    $scope.Session =  Session
    $scope.asistencia = true
    Conciliacion.show($state.params.id).then(function (request) {
        $scope.conc = request.data.solicitude;
        if($scope.conc.state != 'iniciar_audiencia'){
        
        //if($scope.conc.state != 'iniciar_audiencia' || Session.getRole() != 'conciliator' || Session.getRole() != 'conciliator_in_equity'){
            //console.log('cambio aca')
            window.location = '#/app/conciliacion/' + $scope.conc.id
        }
        Conciliacion.get.proof($scope.conc.id).then(function(response){
            $scope.proofs = response.data.proofs
        })
        Audiencias.get.solicitude($scope.conc.id).then(function(response){
            var auds = response.data.audiences
            $scope.audience = auds[auds.length - 1]
            $scope.audience.involveds.forEach(function(inv){
                $scope.conc.solicitude_participations.filter(function(part){
                    return part.id == inv.id
                })[0].assist = true
                $scope.asistencia = false
            })
           
        })
        Conciliacion.get.documents($scope.conc.conciliation.id).then(function(response){
            $scope.documents = response.data.documents
        }, function(response){
            console.log(response.data)
        })
    },function (request) {
        $scope.conc = {}
        console.log(request.data)
    })



    $scope.saveComment = function(){
        Audiencias.update.audience($scope.audience.id, $scope.audience).then(function(response){
            alertify.success('Exito guardando comentarios')
        }, function(response){
            alertify.error('Error guardando comentarios')
            console.log(response.data)
        })
    }

    $scope.saveAssist = function(){
        var ids = []
        $scope.conc.solicitude_participations.forEach(function(part){
            if(part.assist){
                ids.push(part.id)
            }
        })
        Audiencias.create.assistance($scope.audience.id, ids).then(function(response){
            alertify.success('Se guardo exitosamente la lista de asistencia')
            Audiencias.create.assistance_document($scope.conc.conciliation.id, $scope.audience.id).then(function(response){
                alertify.success('Exito generando docuemnto de asistencia')
                $scope.asistencia = false
                $scope.reFetchConc()
            }, function(response){
                alertify.error('Error generando docuemnto de asistencia')
                console.log(response.data)
            })
        }, function(response){
            alertify.error('Hubo un error guardando la lista de asistencia')
            console.log(response.data)
        })
    }

    $scope.showResults = function(ev){
        $mdDialog.show({
            templateUrl: URL.dev.template + '/audiencia/results.html',
            scope: $scope,        
            preserveScope: true,
            targetEvent: ev,
            fullscreen: $scope.customFullscreen
        }).then(function(answer) {
            $scope.addResults()
        }, function() {
            console.log('Evento cancelado')
        });
    }

    $scope.showDocument = function(doc){
        window.open(IP +'/'+ doc.url, '_blank');
    }

    $scope.addResult = function(acuerdo){
        Conciliacion.create.results($scope.conc.conciliation.id, $scope.description).then(function(response){
            alertify.success('Resultados guardados con exito')
            $scope.endSolicitude(acuerdo)
        }, function(response){
            console.log(response.data)
            alertify.error('Error guardando los resultados')
        })
    }

    $scope.endSolicitude = function(acuerdo){
        $scope.conc.state = 'cerrar_conciliacion'
        if (acuerdo == 'acuerdo') {
            Conciliacion.get.acuerdo($scope.conc.conciliation.id).then(function(response){
                alertify.success('Se genero exitosamente el documento de acuerdo')
            }, function(response){
                alertify.error('Hubo un error generando el documento de acuerdo')
                console.log(response.data)
            })
        }else if(acuerdo == 'no_acuerdo'){
            Conciliacion.get.no_acuerdo($scope.conc.conciliation.id).then(function(response){
                alertify.success('Se genero exitosamente el documento de no acuerdo')
            }, function(response){
                alertify.error('Hubo un error generando el documento de no acuerdo')
                console.log(response.data)
            })
        }else if(acuerdo == 'no_acuerdo_inasistencia'){
            Conciliacion.get.no_acuerdo_inasistencia($scope.conc.conciliation.id).then(function(response){
                alertify.success('Se genero exitosamente el documento de no acuerdo por inasistencia')
            }, function(response){
                alertify.error('Hubo un error generando el documento de no acuerdo por inasistencia')
                console.log(response.data)
            })
        }
        Conciliacion.update.conciliator_solicitude($scope.conc.id, $scope.conc).then(function(response){
            window.location = '#/app/dashboard'
        })
    }

    $scope.buildError = function(){
        alertify.error('funcion en construccion')
    }

    $scope.showProof = function(proof){
        window.open(IP + proof.url, '_blank');
    }

    $scope.reprogram = function(){
        $scope.conc.state = 'programar_audiencia'
        Conciliacion.update.conciliator_solicitude($scope.conc.id, $scope.conc).then(function(response){
            window.location = '#/app/conciliacion/' + $scope.conc.id
        })
    }

    $scope.reFetchConc = function(){
        Conciliacion.show($state.params.id).then(function (request) {
            $scope.conc = request.data.solicitude;
            if($scope.conc.state != 'iniciar_audiencia'){

            //if($scope.conc.state != 'iniciar_audiencia' || Session.getRole() != 'conciliator' || Session.getRole() != 'conciliator_in_equity'){
                //console.log('Entro aca')
                window.location = '#/app/conciliacion/' + $scope.conc.id
            }
            Conciliacion.get.proof($scope.conc.id).then(function(response){
                $scope.proofs = response.data.proofs
            })
            Audiencias.get.solicitude($scope.conc.id).then(function(response){
                var auds = response.data.audiences
                $scope.audience = auds[auds.length - 1]
                $scope.audience.involveds.forEach(function(inv){
                    $scope.conc.solicitude_participations.filter(function(part){
                        return part.id == inv.id
                    })[0].assist = true
                })
               
            })
            Conciliacion.get.documents($scope.conc.conciliation.id).then(function(response){
                $scope.documents = response.data.documents
            }, function(response){
                console.log(response.data)
            })
        },function (request) {
            $scope.conc = {}
        })
    }

    $scope.cancel = function(){
        $mdDialog.cancel()
    }

    $scope.getState = function(){
        return $scope.conc.state.toUpperCase().replaceAll('_', ' ')
    }
    String.prototype.replaceAll = function(str1, str2, ignore){
        return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
    } 

    $scope.showParticipant = function(part, ev){
        $scope.part = part
        $mdDialog.show({
            templateUrl: URL.dev.template + '/forms/showParticipant.html',
            scope: $scope,        
            preserveScope: true,
            targetEvent: ev,
            fullscreen: $scope.customFullscreen,
            clickOutsideToClose:true
        }).then(function(answer) {
            console.log('Guardado con exito.')
        }, function() {
            console.log('Evento cancelado')
        });
    }

    $scope.esConvocante = function(p){
        return p.participation_type == 'convocante'
    }

    $scope.esNatural = function(p){
        return p.involved.nature == 'natural'
    }

    $scope.getConvocantes = function(){
        return $scope.conc.solicitude_participations.filter(i => $scope.esConvocante(i));
    }

    $scope.getConvocados = function(){
        return $scope.conc.solicitude_participations.filter(i => !$scope.esConvocante(i));
    }
    $scope.apoderado = function(inv){
        return inv.involved.assignee != null
    }
    $scope.representante = function(inv){
        return inv.involved.representative != null
    }

    $scope.getName = function(ele) {
        if($scope.esNatural(ele)){
            return ele.involved.natural.first_name + ' ' + ele.involved.natural.first_lastname
        }else{
            return ele.involved.juridical.name
        }
    }

    $scope.getID = function(ele){
        if($scope.esNatural(ele)){
            return ele.involved.natural.identifier_type + ': ' + ele.involved.natural.identifier
        }else{
            return 'Nit: ' + ele.involved.juridical.nit
        }
    }

    $scope.getIcon = function(ele){
        if($scope.esNatural(ele)){
            return 'perm_identity'
        }else{
            return 'account_balance'
        }
    }

    $scope.switchIndex = function(){
        Conciliacion.setIndex(true);
        window.location = '#/app/conciliacion';
    }
    $scope.mobile = screenSize.on('xs, sm', function(isMatch){
        $scope.mobile = isMatch;
    });

    // selected = null,
    // previous = null;
    // $scope.tabs = $scope.conc.documentos;
    // $scope.selectedIndex = 0;
    // $scope.$watch('selectedIndex', function(current, old){
    //     previous = selected;
    //     selected = $scope.tabs[current];
    // });
}]);