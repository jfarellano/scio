angular.module('app')
.controller('AudConcCtrl', ['$scope', '$state', 'Conciliacion', '$window', 'screenSize', '$mdDialog', 'URL', 'Session', '$compile', 'Audiencias', 'IP', 'COL', 'Participations',function($scope, $state,Conciliacion, window, screenSize, $mdDialog, URL, Session, $compile, Audiencias, IP, COL, Participations){
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
            console.log($scope.audience)
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

    $scope.cuantia = function(value){
        if(value == -1){
            return 'Indeterminada'
        }else{
            return '$ ' + value
        }
    }

    $scope.getARName = function(app){
        if(app != null) return app.first_name + ' ' + app.first_lastname + ' ' + app.second_lastname
    }

    $scope.saveComment = function(){
        Audiencias.update.audience($scope.audience.id, $scope.audience).then(function(response){
            alertify.success('Exito guardando comentarios')
        }, function(response){
            alertify.error('Error guardando comentarios')
            console.log(response.data)
        })
    }
    $scope.saveAssist = function(){
        console.log($scope.audience.attendances)
        Audiencias.create.assistance($scope.audience.id, $scope.audience).then(function(response){
            alertify.success('Se guardo exitosamente la lista de asistencia')
        }, function(response){
            alertify.error('Hubo un error guardando la lista de asistencia')
            console.log(response.data)
        })
    }

    $scope.showResults = function(ev){
        window.location = '#/app/audiencia/result/' + $scope.conc.id
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
        $scope.conc.state = 'cerrada'
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
    $scope.showArchive = function(url){
        window.open(IP + url, '_blank');
    }

    $scope.showProof = function(proof, ev){
        $scope.part = proof
        $mdDialog.show({
            templateUrl: URL.dev.template + '/forms/showproof.html',
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
        $scope.edit = false
        $scope.verified = false
        $scope.global = false
        $mdDialog.cancel()
        $scope.resetInvolucrado()
    }
    $scope.save = function(answer) {
      $mdDialog.hide(answer);
    };

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

    //results
    $scope.showPretension = function(ev) {
        $('#loader-container').fadeIn('fast');
        $mdDialog.show({
            //change to results
            templateUrl: URL.dev.template + '/forms/pretension.html',
            scope: $scope,        
            preserveScope: true,
            targetEvent: ev,
            escapeToClose: false
        }).then(function(answer) {
            if($scope.edit){
                $scope.edit_hp(2)
            }else{
                $scope.add_hp(2)
            }
        }, function() {
        });
    };
    $scope.editPretension = function(pret, ev){
        $('#loader-container').fadeIn('fast');
        $scope.hecho_pretension = pret
        $scope.edit = true
        $scope.showPretension(ev)
    }

        $scope.add_hp = function(type){

        if(type == 1){
            Conciliacion.create.fact($scope.conc.id, $scope.conc.conciliation.id, $scope.hecho_pretension).then(function(response){
                $scope.hecho_pretension.description = '';
                $scope.reFetchConc()
            },function(response){
                $scope.hecho_pretension.description = ''
                console.log(response.data)
            })
        }
        else if (type == 2){
            Conciliacion.create.pret($scope.conc.id, $scope.conc.conciliation.id, $scope.hecho_pretension).then(function(response){
                $scope.hecho_pretension.description = '';
                $scope.reFetchConc()
            },function(response){
                $scope.hecho_pretension = ''
                console.log(response.data)
            })
        }else{
            Conciliacion.create.fundamentals($scope.conc.conciliation.id, $scope.hecho_pretension).then(function(response){
                $scope.hecho_pretension.description = '';
                $scope.reFetchConc()
            },function(response){
                $scope.hecho_pretension = ''
                console.log(response.data)
            })
        }
    }
    $scope.edit_hp = function(type){
        if(type == 1){
            Conciliacion.update.fact($scope.conc.id, $scope.conc.conciliation.id, $scope.hecho_pretension.id , $scope.hecho_pretension).then(function(response){
                $scope.hecho_pretension.description = '';
                $scope.edit = false
                $scope.reFetchConc()
            },function(response){
                $scope.edit = false
                $scope.hecho_pretension.description = ''
                console.log(response.data)
            })
        }else if(type == 2){
            Conciliacion.update.pret($scope.conc.id, $scope.conc.conciliation.id, $scope.hecho_pretension.id, $scope.hecho_pretension).then(function(response){
                $scope.hecho_pretension.description = '';
                $scope.edit = false
                $scope.reFetchConc()
            },function(response){
                $scope.edit = false
                $scope.hecho_pretension = ''
                console.log(response.data)
            })
        }else{
            Conciliacion.update.fundamentals($scope.hecho_pretension.id, $scope.hecho_pretension).then(function(response){
                $scope.hecho_pretension.description = '';
                $scope.edit = false
                $scope.reFetchConc()
            },function(response){
                $scope.edit = false
                $scope.hecho_pretension = ''
                console.log(response.data)
            })
        }
    }

    $scope.resetInvolucrado = function(){
        $scope.involucrado = {
            involved: {
                country: 'COLOMBIA'
            }
        }
    }
    $scope.findAssignee = function(){
        Participations.get.assignee({identifier_type: $scope.involucrado.involved.assignee.identifier_type, identifier: $scope.involucrado.involved.assignee.identifier}).then(function(response){
            console.log(response)
            if (response.status != 204) {
                $scope.involucrado.involved.assignee = response.data.assignee
                $scope.getAssigneeCity()
                $scope.verified = true
                $scope.edit = true
                $scope.getProfession($scope.involucrado.involved.assignee.id, 'assignee')
            }
        }, function(response){
            console.log(response.data)
        })
    }
    $scope.findRepresentative = function(){
        Participations.get.representative({identifier_type: $scope.involucrado.involved.representative.identifier_type, identifier: $scope.involucrado.involved.representative.identifier}).then(function(response){
            if (response.status != 204) {
                $scope.involucrado.involved.representative = response.data.representative
                $scope.getRepCities()
                $scope.verified = true
                $scope.edit = true
                $scope.getProfession($scope.involucrado.involved.representative.id, 'representative')
            }
        }, function(response){
            console.log(response.data)
        })
    }
    $scope.apoderadoEdition = function(inv){
        return inv.involved.assignee != null
    }
    $scope.representanteEdition = function(inv){
        return inv.involved.representative != null
    }
    $scope.getID = function(ele){
        if($scope.esNatural(ele)){
            return ele.involved.natural.identifier_type + ': ' + ele.involved.natural.identifier
        }else{
            return 'Nit: ' + ele.involved.juridical.nit
        }
    }
    $scope.getApoderadoText = function(inv){
        if(inv.assignee == null){
            return 'Agregar apoderado'
        }else{
            return 'Editar apoderado'
        }
    }
    $scope.getRepresentanteText = function(inv){
        if(inv.representative == null){
            return 'Agregar representante'
        }else{
            return 'Editar representante'
        }
    }
    Conciliacion.get.constant('identifier_type').then(function(response){
        $scope.idType = response.data.constants
    }) 
    Conciliacion.get.constant('country').then(function(response){
        $scope.countries = response.data.constants
    }) 
    Conciliacion.get.constant_child(COL ,'department').then(function(response){
        $scope.departments = response.data.constants
        var r2 = $scope.departments.filter(function(d){
            return d.value == $scope.involucrado.department
        })
        if(r2.length > 0){
            Conciliacion.get.constant_child(r2[0].id, 'city').then(function(response){
                $scope.cities = response.data.constants
            })
        }
    })
    $scope.getAssigneeCity = function(){
        var r = $scope.departments.filter(function(a) {
            return a.value == $scope.involucrado.involved.assignee.department
        })
        Conciliacion.get.constant_child(r[0].id, 'city').then(function(response){
            $scope.city = response.data.constants
        })
    }

    $scope.getRepCities = function(){
        var r = $scope.departments.filter(function(a) {
            return a.value == $scope.involucrado.involved.representative.department
        })
        Conciliacion.get.constant_child(r[0].id, 'city').then(function(response){
            $scope.cities = response.data.constants
        })
    }
    Conciliacion.get.constant('gender').then(function(response){
        $scope.gender = response.data.constants
    }) 
    Conciliacion.get.constant('scholarly_level').then(function(response){
        $scope.level = response.data.constants
    })
    Conciliacion.get.constant('strata').then(function(response){
        $scope.estratos = response.data.constants
    })
    Conciliacion.get.constant('profession_name').then(function(response){
        $scope.profession_name = response.data.constants
    })
    Conciliacion.get.constant('profession_institution').then(function(response){
        $scope.profession_institution = response.data.constants
    })
    Conciliacion.get.constant('type_of_public_entity').then(function(response){
        $scope.public_type = response.data.constants
    })
    Conciliacion.get.constant('city').then(function(response){
        var all_cities = response.data.constants.sort(function (a, b) {
            if(a.value < b.value){
                return -1
            }else if(a.value > b.value){
                return 1
            }
            return 0
        })
        $scope.all_cities = []
        $.each(all_cities, function(i, el){
            if ($scope.uniqueCity(el)){
                $scope.all_cities.push(el);
            }
        })
    })

    $scope.uniqueCity = function(ele){
        var a = $scope.all_cities.filter(function(elem){
            return ele.value == elem.value
        })
        return a.length == 0
    }

    $scope.firstN = function(str, n){
        var s = str.substring(0, n)
        if(str.length <= n){
            return  s
        }else{
            return s + ' ...'
        }
    }

    $scope.hecho_pretension = {description: ''}
    $scope.getButtonLable = function(){
        $('#loader-container').fadeOut('slow');
        if($scope.edit || $scope.verified){
            return 'Guardar'
        }else{
            return 'Agregar'
        }
    }

    $scope.toIndex = function(){
        window.location = '#/app/conciliacion'
    }

    $scope.showVerification = function(){
        return $scope.edit || $scope.verified
    }
    $scope.getPostulants = function(){
        var arr = [{value: 'involucrado'}]
        if ($scope.involucrado.involved.assignee != null) {
            arr.push({value: 'apoderado'})
        }
        if ($scope.involucrado.involved.representative !=null) {
            arr.push({value: 'representante'})
        }
        $scope.postulants = arr
    }
    $scope.postulants = [{value: 'involucrado'}]
    $scope.reFreshAssistance = function(invID, type, entityID){
        Audiencias.create.assistance($scope.audience.id, {attendances:[{involved_id: invID, type: type, entity_id: entityID, attendance: false}]}).then(function(response){
            alertify.success('Listado de asistencia actualizado')
        }, function(response){
            console.log(response.data)
            alertify.error('Error actualizado asistencia')
        })
    }
//APODERADOS
    $scope.showApoderado = function(inv, ev, edit) {
        $('#loader-container').fadeIn('fast');
        $scope.involucrado = inv
        $scope.edit = edit
        if(edit){
            $scope.getProfession($scope.involucrado.involved.assignee.id, 'assignee')
            var r2 = $scope.departments.filter(function(d){
                return d.value == $scope.involucrado.involved.assignee.department
            })
            Conciliacion.get.constant_child(r2[0].id, 'city').then(function(response){
                $scope.city = response.data.constants
            }, function(response){
                console.log(response.data)
            })
        }else{
            $scope.getProfession(null, 'assignee')
        }
        $mdDialog.show({
            templateUrl: URL.dev.template + '/forms/apoderado.html',
            scope: $scope,        
            preserveScope: true,
            targetEvent: ev,
            escapeToClose: false
        }).then(function(answer) {
            if($scope.edit){
                $scope.edit_apoderado()
            }else{
                $scope.add_apoderado()
            }
        }, function() {
            $scope.edit = false
            $scope.verified = false
            $scope.reFetchConc()
        });
    };
    $scope.add_apoderado = function(){
        Conciliacion.create.assignee(null, null, $scope.involucrado.involved.assignee).then(function(response){
            var assignee = response.data.assignee
            $scope.professions.forEach(function(proff){
                proff.name = proff.name.title
                Conciliacion.create.profession(assignee.id, 'assignee', proff).then(function(response){
                    alertify.success('Exito agregando profesión')
                }, function(response){
                    $scope.profession = {}
                    alertify.error('Error agregando profesión')
                    console.log(response.data)
                })
                Conciliacion.create.assignee_relation({solicitude_id: $scope.conc.id, involved_id: $scope.involucrado.involved.id, assignee_id: assignee.id}).then(function(response){
                    alertify.success("Apoderado creado con exito")
                    $scope.reFreshAssistance($scope.involucrado.involved.id, 'assignee', assignee.id)
                    $scope.resetInvolucrado()
                    $scope.reFetchConc()
                }, function(response){
                    $scope.resetInvolucrado()
                    console.log(response.data)
                    alertify.error("Error relacionando apoderado intente de nuevo")
                })
            })
            Conciliacion.create.assignee_relation({solicitude_id: $scope.conc.id, involved_id: $scope.involucrado.involved.id, assignee_id: assignee.id }).then(function(response){
                alertify.success("Apoderado agregado con exito")
                $scope.resetInvolucrado()
                $scope.reFetchConc()
            }, function(response){
                console.log(response.data)
                alertify.error("Error agregando al apoderado")
                $scope.resetInvolucrado()
                $scope.reFetchConc()
            })
        },function(response){
            alertify.error("Error creando apoderado revise la informacion del apoderado")
            $scope.resetInvolucrado()
            console.log(response.data)
        })
    }
    $scope.edit_apoderado = function(){
        console.log('ENTROOO')
        Conciliacion.update.assignee($scope.conc.id, $scope.involucrado.involved.id, $scope.involucrado.involved.assignee.id, $scope.involucrado.involved.assignee).then(function(response){
            if ($scope.verified) {
                Conciliacion.create.assignee_relation({solicitude_id: $scope.conc.id, involved_id: $scope.involucrado.involved.id, assignee_id: $scope.involucrado.involved.assignee.id }).then(function(response){
                    alertify.success("Apoderado editado con exito")
                    $scope.reFreshAssistance($scope.involucrado.involved.id, 'assignee', $scope.involucrado.involved.assignee.id)
                    $scope.resetInvolucrado()
                    $scope.reFetchConc()
                    $scope.verified = false
                }, function(response){
                    console.log(response.data)
                    alertify.error("Error agregando al apoderado")
                    $scope.resetInvolucrado()
                    $scope.reFetchConc()
                })
            }else{
                alertify.success("apoderado editado con exito")
                $scope.resetInvolucrado()
                $scope.reFetchConc()
            }
        },function(response){
            alertify.error("Error en la edición del apoderado")
            $scope.resetInvolucrado()
            console.log(response.data)
        })
    }
    $scope.replace_apoderado = function(){
        Conciliacion.delete.assignee({solicitude_id: $scope.conc.id, involved_id: $scope.involucrado.involved.id}).then(function(response){
            alertify.success("Restauración de apoderado exitosa")
            $scope.reFreshAssistance($scope.involucrado.involved.id, 'assignee', null)
            $scope.reFetchConc()
            $scope.resetInvolucrado()
            $scope.cancel()
        }, function(response){
            alertify.error("Error restaurando del apoderado")
            $scope.resetInvolucrado()
            console.log(response)
        })
    }
//REPRESENTANTE
    $scope.showRepresentante = function(inv, ev, edit) {
        $('#loader-container').fadeIn('fast');
        $scope.involucrado = inv
        $scope.edit = edit
        if(edit){
            $scope.getProfession($scope.involucrado.involved.representative.id, 'representative')
        }else{
            $scope.getProfession(null, 'representative')
        }
        $mdDialog.show({
            templateUrl: URL.dev.template + '/forms/representante.html',
            scope: $scope,        
            preserveScope: true,
            targetEvent: ev,
            escapeToClose: false
        }).then(function(answer) {
            if($scope.edit){
                $scope.edit_representante()
            }else{
                $scope.add_representante()
            }
        }, function() {
            $scope.edit = false
            $scope.verified = false
            $scope.reFetchConc()
        });
    };
    $scope.add_representante = function(){
        Conciliacion.create.representative(null, null, $scope.involucrado.involved.representative).then(function(response){
            var representative = response.data.representative
            $scope.professions.forEach(function(proff){
                proff.name = proff.name.title
                Conciliacion.create.profession(representative.id, 'representative', proff).then(function(response){
                    alertify.success('Exito agregando profesión')
                }, function(response){
                    $scope.profession = {}
                    alertify.error('Error agregando profesión')
                    console.log(response.data)
                })
            })
            Conciliacion.create.representative_relation({solicitude_id: $scope.conc.id, involved_id: $scope.involucrado.involved.id, representative_id: representative.id}).then(function(response){
                alertify.success("Representante creado con exito")
                $scope.reFreshAssistance($scope.involucrado.involved.id, 'representative', representative.id)
                $scope.resetInvolucrado()
                $scope.reFetchConc()
            }, function(response){
                console.log(response.data)
                $scope.resetInvolucrado()
                alertify.error("Error relacionando al representante intente de nuevo")
            })
        },function(response){
            alertify.error("Error creando al representante, revise los datos")
            console.log(response.data)
        })
        $scope.reFetchConc()
    }
    $scope.edit_representante = function(){
        Conciliacion.update.representative($scope.conc.id, $scope.involucrado.involved.id, $scope.involucrado.involved.representative.id, $scope.involucrado.involved.representative).then(function(response){
            if ($scope.verified) {
                Conciliacion.create.representative_relation({solicitude_id: $scope.conc.id, involved_id: $scope.involucrado.involved.id, representative_id: $scope.involucrado.involved.representative.id }).then(function(response){
                    alertify.success("Representante editado con exito")
                    $scope.reFreshAssistance($scope.involucrado.involved.id, 'representative', $scope.involucrado.involved.representative.id)
                    $scope.resetInvolucrado()
                    $scope.reFetchConc()
                    $scope.verified = false
                }, function(response){
                    console.log(response.data)
                    alertify.error("Error agregando al representante")
                    $scope.resetInvolucrado()
                    $scope.reFetchConc()
                })
            }else{
                alertify.success("Representante editado con exito")
                $scope.resetInvolucrado()
                $scope.reFetchConc()
            }
        },function(response){
            alertify.error("Error editado al representante")
            console.log(response.data)
        })
    }
    $scope.replace_representante = function(){
        //console.log({solicitude_id: $scope.conc.id, involved_id: $scope.involucrado.involved.id})
        Conciliacion.delete.representative({solicitude_id: $scope.conc.id, involved_id: $scope.involucrado.involved.id}).then(function(response){
            alertify.success("Restauración de apoderado exitosa")
            $scope.reFetchConc()
            $scope.reFreshAssistance($scope.involucrado.involved.id, 'representative', null)
            $scope.resetInvolucrado()
            $scope.cancel()
        }, function(response){
            alertify.error("Error restaurando del apoderado")
            $scope.resetInvolucrado()
            console.log(response)
        })
    }
    $scope.showForm = function(){
        return true
    }
//POSTULANTE
    $scope.postulant = {}
    $scope.showPostulant = function(inv, ev) {
        $scope.involucrado = inv
        $scope.getPostulants()
        //$('#loader-container').fadeIn('fast');
        $mdDialog.show({
            templateUrl: URL.dev.template + '/forms/postulante.html',
            scope: $scope,        
            preserveScope: true,
            targetEvent: ev,
            escapeToClose: false
        }).then(function(answer) {
            Conciliacion.update.set_postulant($scope.conc.id, $scope.involucrado.involved.id, $scope.postulant.type).then(function(response){
                alertify.success('Exito agregando postulante')
                $scope.resetInvolucrado()
                $scope.reFetchConc()
            }, function(response){
                alertify.error('Error agregando postulante')
                $scope.resetInvolucrado()
                console.log(response.data)
            })
        }, function() {
        });
    };
//PROFESIONES
    $scope.profession = {}

    $scope.addProfession = function(id, type){
        if ($scope.edit || $scope.verified ) {
            $scope.profession.name = $scope.profession.name.title
            Conciliacion.create.profession(id, type, $scope.profession).then(function(response){
                alertify.success('Exito agregando profesión')
                $scope.getProfession(id, type)
                $scope.profession = {}
            }, function(response){
                $scope.profession = {}
                alertify.error('Error agregando profesión')
                console.log(response.data)
            })
        }else{
            $scope.professions.push($scope.profession)
            $scope.profession = {}
        }
    }
    $scope.deleteProfession = function(id, type, usrID){
        if ($scope.edit || $scope.verified) {
            Conciliacion.delete.profession($scope.professions[id].id).then(function(response){
                alertify.success('Exito eliminando profesión')
                $scope.getProfession(usrID, type)
            }, function(response){
                console.log(response.data)
                alertify.error('Error eliminando profesión')
            })
        }else{
            $scope.professions.splice(id, 1)
        }
    }
    $scope.getProfession = function(id, type){
        if ($scope.edit || $scope.verified ) {
            Conciliacion.get.profession(id, type).then(function(response){
                $scope.professions = response.data.professions
            }, function(response){
                console.log(response.data)
            })
        }else{
            $scope.professions = []
        }
    }


    // selected = null,
    // previous = null;
    // $scope.tabs = $scope.conc.documentos;
    // $scope.selectedIndex = 0;
    // $scope.$watch('selectedIndex', function(current, old){
    //     previous = selected;
    //     selected = $scope.tabs[current];
    // });
}]);