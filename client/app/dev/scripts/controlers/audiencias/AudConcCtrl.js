angular.module('app')
.controller('AudConcCtrl', ['$scope', '$state', 'Conciliacion', '$window', 'screenSize', '$mdDialog', 'URL', 'Session', '$compile', 'Audiencias', 'IP', 'COL', 'Participations',function($scope, $state,Conciliacion, window, screenSize, $mdDialog, URL, Session, $compile, Audiencias, IP, COL, Participations){
//Getters
    Conciliacion.show($state.params.id).then(function (request) {
        $scope.conc = request.data.solicitude;
        if($scope.conc.state != 'iniciar_audiencia'){
        //revisar logica
        //if($scope.conc.state != 'iniciar_audiencia' || Session.getRole() != 'conciliator' || Session.getRole() != 'conciliator_in_equity'){
            //console.log('cambio aca')
            window.location = '#/app/conciliacion/' + $scope.conc.id
        }
        Conciliacion.get.proof($scope.conc.id).then(function(response){
            $scope.proofs = response.data.proofs
        })
        Conciliacion.get.fundamentals($scope.conc.conciliation.id).then(function(response){
            $scope.fundamentals = response.data.fundamentals
        })
        Audiencias.get.solicitude($scope.conc.id).then(function(response){
            var auds = response.data.audiences
            $scope.audience = auds[auds.length - 1]
            console.log($scope.audience)
        }, function(response){
            console.log(response.data);
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
//Defaults
    $scope.cuantia = function(value){
        if(value == -1){
            return 'Indeterminada'
        }else{
            return '$ ' + $scope.decimal(value)
        }
    }
    $scope.Session =  Session
    $scope.asistencia = false
    String.prototype.replaceAll = function(str1, str2, ignore){
        return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
    }
    $scope.switchIndex = function(){
        Conciliacion.setIndex(true);
        window.location = '#/app/conciliacion';
    }
    $scope.mobile = screenSize.on('xs, sm', function(isMatch){
        $scope.mobile = isMatch;
    });
//Comments
    $scope.saveComment = function(){
        Audiencias.update.audience($scope.audience.id, $scope.audience).then(function(response){
            alertify.success('Exito guardando comentarios')
            $scope.asistencia = true
        }, function(response){
            alertify.error('Error guardando comentarios')
            console.log(response.data)
        })
    }
//Assist
    $scope.saveAssist = function(){
        var att = $scope.audience.attendances.convocante.concat($scope.audience.attendances.convocado)
        console.log($scope.audience.attendances);
        Audiencias.create.assistance($scope.audience.id, {attendances: att}).then(function(response){
            alertify.success('Se guardo exitosamente la lista de asistencia')
        }, function(response){
            alertify.error('Hubo un error guardando la lista de asistencia')
            console.log(response.data)
        })
    }
    $scope.reFreshAssistance = function(invID, type, entityID){
        Audiencias.create.assistance($scope.audience.id, {attendances:[{involved_id: invID, type: type, entity_id: entityID, attendance: false}]}).then(function(response){
            alertify.success('Listado de asistencia actualizado')
        }, function(response){
            console.log(response.data)
            alertify.error('Error actualizado asistencia')
        })
    }
//Involved
    $scope.showInvolved = function(ev, type){
        $('#loader-container').fadeIn('fast');
        $scope.involucrado.participation_type = type;
        if(!$scope.edit) $scope.getProfession(null, 'involved');
        $mdDialog.show({
            templateUrl: URL.dev.template + '/forms/involucrado.html',
            scope: $scope,
            preserveScope: true,
            targetEvent: ev,
            escapeToClose: false
        }).then(function(answer) {
            if($scope.edit) $scope.edit_involved(type);
            else $scope.add_involved(type);
        }, function() {
            $scope.cancel()
        });
    }
    $scope.editInvolved = function(inv, ev, type){
        $('#loader-container').fadeIn('fast');
        $scope.involucrado = inv
        $scope.edit = true
        $scope.verify_click = true
        if($scope.involucrado.involved.natural != null){
            $scope.involucrado.involved.natural.birthdate = new Date($scope.involucrado.involved.natural.birthdate)
            $scope.getProfession(inv.involved.id, 'involved')
        }
        try {
            Conciliacion.get.constant_child(COL ,'department').then(function(response){
                $scope.departments = response.data.constants
                var r2 = $scope.departments.filter(function(d){
                    return d.value == $scope.involucrado.department
                })
                Conciliacion.get.constant_child(r2[0].id, 'city').then(function(response){
                    $scope.cities = response.data.constants
                })
            })
        } catch (e) {}
        $scope.showInvolved(ev, type)
    }
    $scope.completeInvolved = function(ev, inv){
        $scope.tempInv = inv
        $scope.showInvolved(ev, 'convocado')
    }
    $scope.add_involved = function(type){
        Conciliacion.create.involved($scope.conc.id, $scope.involucrado.participation_type, $scope.involucrado).then(function(response){
            var involucrado = response.data.involved
            if($scope.involucrado.involved.nature == 'natural'){
                try{
                    try {
                        $scope.involucrado.involved.natural.origin_country = $scope.involucrado.involved.natural.origin_country.title
                    } catch (e) {
                        $scope.involucrado.involved.natural.origin_country = null
                    }
                    Conciliacion.create.natural($scope.conc.id, response.data.involved.id, $scope.involucrado.involved).then(function(response){
                        $scope.professions.forEach(function(proff){
                            proff.name = proff.name.title
                            Conciliacion.create.profession(involucrado.id, 'involved', proff).then(function(response){
                                alertify.success('Exito agregando profesión')
                            }, function(response){
                                $scope.profession = {}
                                ErrorHandler.errorDisplay(response.data.errors)
                            })
                        })
                        $scope.getSolicitude()
                        alertify.success("Exito agregando involucrado")
                        $scope.cancel()
                    }, function(response){
                        Conciliacion.delete.involved(involucrado.involved.id).then(function(response){
                            $scope.showInvolved(null , type)
                            console.log('wqeweqeewqq');
                            alertify.error("Error agregando involucrado, recuerde que no puede tener las credenciales de algun participante de la solicitud")
                        }, function(response){
                            $scope.showInvolved(null , type)
                            ErrorHandler.errorDisplay(response.data.errors)
                        })
                    })
                }catch(err){
                    Conciliacion.delete.involved(involucrado.id).then(function(response){
                        $scope.showInvolved(null , type)
                        console.log('zazazazazaz');
                        alertify.error("Error agregando involucrado, recuerde que no puede tener las credenciales de algun participante de la solicitud")
                    }, function(response){
                        $scope.showInvolved(null , type)
                        ErrorHandler.errorDisplay(response.data.errors)
                    })
                }
            }else{
                Conciliacion.create.juridical($scope.conc.id, response.data.involved.id, $scope.involucrado.involved).then(function(response){
                    $scope.getSolicitude()
                    $scope.cancel()
                    alertify.success("Exito agregando involucrado")
                },function(response){
                    Conciliacion.delete.involved(involucrado.id).then(function(response){
                        $scope.showInvolved(null , type)
                        alertify.error("Error agregando involucrado, recuerde que no puede tener las credenciales de algun participante de la solicitud")
                    }, function(response){
                        $scope.showInvolved(null , type)
                        ErrorHandler.errorDisplay(response.data.errors)
                    })
                })
            }
        },function(response){
            console.log(response.data);
            $scope.showInvolved(null , type)
            ErrorHandler.errorDisplay(response.data.errors)
        })
    }
    $scope.edit_involved = function(type){
        Conciliacion.update.involved($scope.conc.id, $scope.involucrado.involved.id, $scope.involucrado).then(function(response){
            if($scope.involucrado.involved.nature == 'natural'){
                $scope.involucrado.involved.natural.birthdate = $scope.involucrado.involved.natural.birthdate.formatDate()
                Conciliacion.update.natural($scope.conc.id, $scope.involucrado.involved.id, $scope.involucrado.involved.natural.id , $scope.involucrado.involved).then(function(response){
                    alertify.success("Edicion exitosa de convocante")
                    if ($scope.verified) {
                        Conciliacion.update.associate_involved($scope.conc.id, $scope.involucrado.involved.id, type).then(function(response){
                            alertify.success("Exito agregando involucrado")
                            $scope.getSolicitude()
                            $scope.cancel()
                        }, function(response){
                            ErrorHandler.errorDisplay(response.data.errors)
                        })
                    }
                    $scope.getSolicitude()
                    $scope.cancel()
                }, function(response){
                    $scope.cancel()
                    ErrorHandler.errorDisplay(response.data.errors)
                })
            }else{
                Conciliacion.update.juridical($scope.conc.id, $scope.involucrado.involved.id, $scope.involucrado.involved.juridical.id ,$scope.involucrado.involved).then(function(response){
                    alertify.success("Edicion exitosa de convocante")
                    if ($scope.verified) {
                        Conciliacion.update.associate_involved($scope.conc.id, $scope.involucrado.involved.id, type).then(function(response){
                            alertify.success("Exito agregando involucrado")
                            $scope.cancel()
                            $scope.getSolicitude()
                        }, function(response){
                            ErrorHandler.errorDisplay(response.data.errors)
                        })
                    }
                    $scope.getSolicitude()
                    $scope.cancel()
                }, function(response){
                    $scope.cancel()
                    ErrorHandler.errorDisplay(response.data.errors)
                })
            }
        }, function(response){
            $scope.cancel()
            ErrorHandler.errorDisplay(response.data.errors)
        })
    }
    $scope.resetInvolucrado = function(){
        $scope.involucrado = {
            involved: {}
        }
    }
    $scope.findInvolved = function(){
        $('#loader-container').fadeIn('fast');
        $scope.verify_click = true
        if($scope.involucrado.involved.nature == 'natural'){
            Participations.get.natural({identifier_type: $scope.involucrado.involved.natural.identifier_type, identifier: $scope.involucrado.involved.natural.identifier}).then(function(response){
                $('#loader-container').fadeOut('slow');
                if (response.status != 204) {
                    $scope.involucrado.involved = response.data.involved
                    $scope.involucrado.involved.natural.birthdate = new Date($scope.involucrado.involved.natural.birthdate)
                    $scope.verified = true
                    $scope.edit = true
                    $scope.getProfession($scope.involucrado.involved.id, 'involved')
                }else{
                    $scope.edit = true
                    $scope.involucrado = $scope.tempInv
                }
            }, function(response){
                $('#loader-container').fadeOut('slow');
                ErrorHandler.errorDisplay(response.data.errors)
            })
        }else{
            Participations.get.juridical({nit:$scope.involucrado.involved.juridical.nit}).then(function(response){
                $('#loader-container').fadeOut('slow');
                if (response.status != 204) {
                    $scope.involucrado.involved = response.data.involved
                    $scope.verified = true
                    $scope.edit = true
                }else{
                    $scope.involucrado = $scope.tempInv
                    $scope.edit = true
                }
            }, function(response){
                $('#loader-container').fadeOut('slow');
                ErrorHandler.errorDisplay(response.data.errors)
            })
        }
    }
//APODERADOS
    $scope.findAssignee = function(){
        $('#loader-container').fadeIn('fast');
        $scope.verify_click = true
        Participations.get.assignee({identifier_type: $scope.involucrado.involved.assignee.identifier_type, identifier: $scope.involucrado.involved.assignee.identifier}).then(function(response){
            $('#loader-container').fadeOut('slow');
            if (response.status != 204) {
                $scope.involucrado.involved.assignee = response.data.assignee
                $scope.getAssigneeCity()
                $scope.verified = true
                $scope.edit = true
                $scope.getProfession($scope.involucrado.involved.assignee.id, 'assignee')
            }
        }, function(response){
            $('#loader-container').fadeOut('slow');
            console.log(response.data)
        })
    }
    $scope.apoderadoEdition = function(inv){
        return inv.involved.assignee != null
    }
    $scope.apoderado = function(inv){
        return inv.involved.assignee != null
    }
    $scope.showApoderado = function(inv, ev, edit) {
        $('#loader-container').fadeIn('fast');
        $scope.involucrado = inv
        $scope.edit = edit
        if(edit){
            $scope.getProfession($scope.involucrado.involved.assignee.id, 'assignee')
            $scope.getAssigneeCity()
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
            $scope.verify_click = false
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
            })
            Conciliacion.create.assignee_relation({solicitude_id: $scope.conc.id, involved_id: $scope.involucrado.involved.id, assignee_id: assignee.id }).then(function(response){
                alertify.success("Apoderado agregado con exito")
                $scope.reFreshAssistance($scope.involucrado.involved.id, 'assignee', assignee.id)
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
        Conciliacion.update.assignee($scope.conc.id, $scope.involucrado.involved.id, $scope.involucrado.involved.assignee.id, $scope.involucrado.involved.assignee).then(function(response){
            if ($scope.verified) {
                Conciliacion.create.assignee_relation({solicitude_id: $scope.conc.id, involved_id: $scope.involucrado.involved.id, assignee_id: $scope.involucrado.involved.assignee.id }).then(function(response){
                    alertify.success("Apoderado editado con exito")
                    $scope.reFreshAssistance($scope.involucrado.involved.id, 'assignee', $scope.involucrado.involved.assignee.id)
                    $scope.resetInvolucrado()
                    $scope.reFetchConc()
                    $scope.verified = false
                    $scope.verify_click = false
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
    $scope.findRepresentative = function(){
        $('#loader-container').fadeIn('fast');
        $scope.verify_click = true
        Participations.get.representative({identifier_type: $scope.involucrado.involved.representative.identifier_type, identifier: $scope.involucrado.involved.representative.identifier}).then(function(response){
            $('#loader-container').fadeOut('slow');
            if (response.status != 204) {
                $scope.involucrado.involved.representative = response.data.representative
                $scope.getRepCities()
                $scope.verified = true
                $scope.edit = true
                $scope.getProfession($scope.involucrado.involved.representative.id, 'representative')
            }
        }, function(response){
            $('#loader-container').fadeOut('slow');
            console.log(response.data)
        })
    }
    $scope.representanteEdition = function(inv){
        return inv.involved.representative != null
    }
    $scope.representante = function(inv){
        return inv.involved.representative != null
    }
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
            $scope.verify_click = false
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
                    $scope.verify_click = false
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
//Methods
    $scope.toComment = function(){$scope.asistencia = false}
    $scope.showResults = function(ev){
        Conciliacion.get.valid($scope.conc.id, {party: 'all', validations: ['validate_juridicals_have_assignee_or_representative']}).then(function(response){
            var a = response.data
            console.log(a);
            if(a.valid){
                $scope.saveAssist()
                Conciliacion.get.valid_audience($scope.audience.id).then(function(response){
                    var b = response.draft_all
                    if(a.valid){
                        window.location = '#/app/audiencia/result/' + $scope.conc.id
                    }else{
                        a.errors.forEach(function(elem){
                            alertify.error(elem)
                        })
                    }
                })
            }else{
                a.errors.forEach(function(elem){
                    alertify.error(elem)
                })
            }
        }, function(response){
            console.log(response.data);
        })
    }
    $scope.showDocument = function(doc){
        window.open(IP +'/'+ doc.url, '_blank');
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
    $scope.showParticipant = function(part, ev){
        $scope.part = part
        if(!$scope.esConvocante(part)){
            Participations.get.valid(part.involved.id).then(function(response){
                if(response.data){
                    $scope.update = true
                }else{
                    $scope.update = false
                }
            }, function(response){
                console.log(response.data);
            })
        }
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
    $scope.showContent = function(){
        return true
    }
    $scope.cancel = function(){
        $scope.edit = false
        $scope.verified = false
        $scope.verify_click =false
        $scope.global = false
        $mdDialog.cancel()
        $scope.resetInvolucrado()
    }
    $scope.save = function(answer) {
      $mdDialog.hide(answer);
    };
    $scope.showForm = function(){
        return true
    }
    $scope.toIndex = function(){
        window.location = '#/app/conciliacion'
    }
    $scope.showVerification = function(){
        return $scope.edit || $scope.verified
    }
    $scope.decimal = function(num){
        try {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        } catch (e) {
            return null
        }
    }
//VariableGetters
    $scope.getARName = function(app){
        if(app != null) return app.first_name + ' ' + app.first_lastname + ' ' + app.second_lastname
    }
    $scope.getState = function(){
        try {
            return $scope.conc.state.toUpperCase().replaceAll('_', ' ')
        } catch (e) {
            return 'Estado'
        }
    }
    $scope.esConvocante = function(p){
        return p.participation_type == 'convocante'
    }
    $scope.esNatural = function(p){
        return p.involved.nature == 'natural'
    }
    $scope.getConvocantes = function(){
        try {
            return $scope.conc.solicitude_participations.filter(i => $scope.esConvocante(i));
        } catch (e) {
            return []
        }
    }
    $scope.getConvocados = function(){
        try {
            return $scope.conc.solicitude_participations.filter(i => !$scope.esConvocante(i));
        } catch (e) {
            return []
        }
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
    $scope.firstN = function(str, n){
        var s = str.substring(0, n)
        if(str.length <= n){
            return  s
        }else{
            return s + ' ...'
        }
    }
    $scope.getButtonLable = function(){
        $('#loader-container').fadeOut('slow');
        if($scope.edit || $scope.verified){
            return 'Guardar'
        }else{
            return 'Agregar'
        }
    }
    $scope.create = false
    $scope.dont_know = {value: false}
//VariableFetchers
    $scope.getAssigneeCity = function(){
        try {
            var r = $scope.departments.filter(function(a) {
                return a.value == $scope.involucrado.involved.assignee.department
            })
            Conciliacion.get.constant_child(r[0].id, 'city').then(function(response){
                $scope.city = response.data.constants
            })
        } catch (e) {
            $scope.city = []
        }
    }
    $scope.getRepCities = function(){
        var r = $scope.departments.filter(function(a) {
            return a.value == $scope.involucrado.involved.representative.department
        })
        Conciliacion.get.constant_child(r[0].id, 'city').then(function(response){
            $scope.cities = response.data.constants
        })
    }
    Conciliacion.get.constant('identifier_type').then(function(response){
        $scope.idType = response.data.constants
    })
    Conciliacion.get.constant('country').then(function(response){
        $scope.countries = response.data.constants
    })
    Conciliacion.get.constant_child(COL ,'department').then(function(response){
        try {
            $scope.departments = response.data.constants
            var r2 = $scope.departments.filter(function(d){
                return d.value == $scope.involucrado.department
            })
            if(r2.length > 0){
                Conciliacion.get.constant_child(r2[0].id, 'city').then(function(response){
                    $scope.cities = response.data.constants
                })
            }
        } catch (e) {}
    })
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
    Conciliacion.get.constant('involved_nature').then(function(response){
        $scope.convtype = response.data.constants
    })
    Conciliacion.get.constant('organization_type').then(function(response){
        $scope.org_type = response.data.constants
    })
    Conciliacion.get.constant('economic_sector').then(function(response){
        $scope.economic_sector = response.data.constants
    })
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
    $scope.involvedType = function(type){
        if(type == 'natural') return 'Persona';
        else return 'Organización';
    }
    $scope.$watch('involucrado.involved.department', function(){
        if($scope.departments != null){
            var r = $scope.departments.filter(function(a) {
                return a.value == $scope.involucrado.involved.department
            })
            if (r.length > 0) {
                Conciliacion.get.constant_child(r[0].id, 'city').then(function(response){
                    $scope.cities = response.data.constants
                })
            }
        }
    })
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
}]);
