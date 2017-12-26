angular.module('app')
.controller('ConcCreateCtlr', ['$scope', '$q','$timeout', 'WizardHandler','Conciliacion', '$http', '$mdDialog', 'URL', '$state', 'Upload', '$window', 'IP', 'COL', 'Participations',function($scope, $q, $timeout, WizardHandler, Conciliacion, $http, $mdDialog, URL, $state, Upload, $window, IP, COL, Participations){
    var step = {'info': 0, 'convocantes': 1, 'convocados': 2, 'hechos': 3, 'pretensiones': 4, 'por_pagar': 5}
    $scope.cuantia = {indeterminada: false}
    Conciliacion.get.solicitude($state.params.id).then(function(response){
        if(!response.data.solicitude.state.includes('incompleta')){
            window.location = '#/app/conciliacion'
        }
        $scope.solicitude = response.data.solicitude
        console.log($scope.solicitude)
        if ($scope.solicitude.conciliation.payment_amount == -1) {
            $scope.cuantia.indeterminada = true
        }else{
            $scope.cuantia.indeterminada = false
        }
        Conciliacion.get.proof($scope.solicitude.conciliation.id).then(function(response){
            $scope.proofs = response.data.proofs
        })
        Conciliacion.get.fundamentals($scope.solicitude.conciliation.id).then(function(response){
            $scope.fundamentals = response.data.fundamentals
        })
        WizardHandler.wizard().goTo(step[$scope.solicitude.state.split('/')[1]])
    },function(response){
        window.location = '#/app/conciliacion'
        console.log(response)
    })
    Date.prototype.formatDate = function(){
        return ("0" + this.getDate()).slice(-2) +
        "/" +  ("0" + (this.getMonth() + 1)).slice(-2) +
        "/" +  this.getFullYear();
    }
//LOGIC
//Modals
    $scope.edit = false
    $scope.cancel = function() {
        $scope.edit = false
        $scope.verified = false
        $scope.global = false
        $scope.hecho_pretension = {}
        $scope.global_assignees = {}
        $scope.global_representatives = {}
        $mdDialog.cancel()
        $scope.resetInvolucrado()
    };
    $scope.save = function(answer) {
      $mdDialog.hide(answer);
    };
    //Convocante
    $scope.showConvocante = function(ev) {
        $('#loader-container').fadeIn('fast');
        if(!$scope.edit){
            $scope.getProfession(null, 'involved')
        }
        $mdDialog.show({
            templateUrl: URL.dev.template + '/forms/convocante.html',
            scope: $scope,
            preserveScope: true,
            targetEvent: ev,
            escapeToClose: false
        }).then(function(answer) {
            if($scope.edit){
                $scope.edit_convocante()
            }else{
                $scope.add_convocante()
            }
        }, function() {
            $scope.edit = false
            $scope.verified = false
        });
    };
    $scope.editConvocante = function(inv, ev){
        $('#loader-container').fadeIn('fast');
        $scope.edit = true
        $scope.involucrado = inv
        if($scope.involucrado.involved.natural != null){
            $scope.involucrado.involved.natural.birthdate = new Date($scope.involucrado.involved.natural.birthdate)
            $scope.getProfession(inv.involved.id, 'involved')
        }
        $scope.showConvocante(ev)
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
    }
    //Convocado
    $scope.showConvocado = function(ev) {
        $('#loader-container').fadeIn('fast');
        if(!$scope.edit){
            $scope.getProfession(null, 'involved')
        }
        $mdDialog.show({
            templateUrl: URL.dev.template + '/forms/convocado.html',
            scope: $scope,
            preserveScope: true,
            targetEvent: ev,
            escapeToClose: false
        }).then(function(answer) {
            if($scope.edit){
                $scope.edit_convocado()
            }else{
                $scope.add_convocado()
            }
        }, function() {});
    };
    $scope.editConvocado = function(inv, ev){
        $('#loader-container').fadeIn('fast');
        $scope.involucrado = inv
        if($scope.involucrado.involved.natural != null){
            $scope.involucrado.involved.natural.birthdate = new Date($scope.involucrado.involved.natural.birthdate)
            $scope.getProfession(inv.involved.id, 'involved')
        }
        $scope.edit = true
        $scope.showConvocado(ev)
        Conciliacion.get.constant_child(COL ,'department').then(function(response){
            $scope.departments = response.data.constants
            var r2 = $scope.departments.filter(function(d){
                return d.value == $scope.involucrado.department
            })
            Conciliacion.get.constant_child(r2[0].id, 'city').then(function(response){
                $scope.cities = response.data.constants
            })
        })
    }
    //Apoderado
    $scope.showGlobalAssignee = function(ev){
        var ind = WizardHandler.wizard().currentStepNumber()
        if (ind == 2) {
            //Convocantes
            $scope.involucrado.involved.assignee = $scope.getGlobalAR('convocante', 'assignee')
        }else{
            //Convocados
            $scope.involucrado.involved.assignee = $scope.getGlobalAR('convocado', 'assignee')
        }
        //console.log($scope.involucrado.involved.assignee)
        $scope.global = true
        $scope.showApoderado($scope.involucrado, ev, $scope.involucrado.involved.assignee != null)
    }
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
            if ($scope.globalAsociation.value) {
                $scope.relateGlobalAssignee()
            }else{
                if($scope.edit){
                    $scope.edit_apoderado()
                }else{
                    $scope.add_apoderado()
                }
            }
        }, function() {
            $scope.edit = false
            $scope.verified = false
            $scope.getSolicitude()
        });
    };
    //Representante
    $scope.showGlobalRepresentative = function(ev){
        var ind = WizardHandler.wizard().currentStepNumber()
        if(!$scope.global){
            if (ind == 2) {
                //Convocantes
                $scope.involucrado.involved.representative = $scope.getGlobalAR('convocante', 'representative')
            }else{
                //Convocados
                $scope.involucrado.involved.representative = $scope.getGlobalAR('convocado', 'representative')
            }
        }
        $scope.global = true
        $scope.showRepresentante($scope.involucrado, ev, $scope.involucrado.involved.representative != null)
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
            if ($scope.globalAsociation.value) {
                $scope.relateGlobalRepresentative()
            }else{
                if($scope.edit){
                    $scope.edit_representante()
                }else{
                    $scope.add_representante()
                }
            }
        }, function() {
            $scope.edit = false
            $scope.verified = false
            $scope.getSolicitude()
        });
    };
    //Hechos
    $scope.showHecho = function(ev) {
        $('#loader-container').fadeIn('fast');
        $mdDialog.show({
            templateUrl: URL.dev.template + '/forms/hecho.html',
            scope: $scope,
            preserveScope: true,
            targetEvent: ev,
            escapeToClose: false
        }).then(function(answer) {
            if($scope.edit){
                $scope.edit_hp(1)
            }else{
                $scope.add_hp(1)
            }
        }, function() {
        });
    };
    $scope.editHecho = function(hecho, ev){
        $('#loader-container').fadeIn('fast');
        $scope.hecho_pretension = hecho
        if ($scope.hecho_pretension != null) {
            var r = $scope.departments.filter(function(a) {
                return a.value == $scope.hecho_pretension.department
            })
            if (r[0] != null) {
                Conciliacion.get.constant_child(r[0].id, 'city').then(function(response){
                    $scope.cities = response.data.constants
                })
            }
        }
        $scope.edit = true
        $scope.showHecho(ev)
    }
    //Pretensiones
    $scope.showPretension = function(ev) {
        $('#loader-container').fadeIn('fast');
        $mdDialog.show({
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
    //Pruebas
    $scope.proof = {}
    $scope.proofTypes = [{value: 'Testimonio'}, {value: 'Archivo'}]
    $scope.showProofCreate = function(ev) {
        $('#loader-container').fadeIn('fast');
        $scope.proof.select = true
        $mdDialog.show({
            templateUrl: URL.dev.template + '/forms/proof.html',
            scope: $scope,
            preserveScope: true,
            targetEvent: ev,
            escapeToClose: false
        }).then(function(answer) {
            Conciliacion.create.proof($scope.solicitude.id, $scope.proof).then(function(response){
                alertify.success('Prueba añadida correctamente')
                $('#loader-container').fadeOut('slow');
                $scope.proof = {}
                $scope.getProof()
                $scope.getSolicitude()
            }, function(response){
                console.log(response.data)
                $scope.proof = {}
                $('#loader-container').fadeOut('slow');
                alertify.error('Error subiendo la prueba')
            })
        }, function() {
        });
    };
    $scope.selectProof = function(){
        $scope.proof.select = false
    }
    //Fundamentos
    $scope.showFundamental = function(ev) {
        $('#loader-container').fadeIn('fast');
        $mdDialog.show({
            templateUrl: URL.dev.template + '/forms/fundamental.html',
            scope: $scope,
            preserveScope: true,
            targetEvent: ev,
            escapeToClose: false
        }).then(function(answer) {
            if($scope.edit){
                $scope.edit_hp(3)
            }else{
                $scope.add_hp(3)
            }
        }, function() {
        });
    };
    //Postulante
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
            Conciliacion.update.set_postulant($scope.solicitude.id, $scope.involucrado.involved.id, $scope.postulant.type).then(function(response){
                alertify.success('Exito agregando postulante')
                $scope.resetInvolucrado()
                $scope.getSolicitude()
            }, function(response){
                alertify.error('Error agregando postulante')
                $scope.resetInvolucrado()
                console.log(response.data)
            })
        }, function() {
        });
    };
    $scope.editFundamental = function(pret, ev){
        $('#loader-container').fadeIn('fast');
        $scope.hecho_pretension = pret
        $scope.edit = true
        $scope.showFundamental(ev)
    }
    //profesion
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

//FinModal
//CRUDS
//Apoderado
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
            if (!$scope.global) {
                Conciliacion.create.assignee_relation({solicitude_id: $scope.solicitude.id, involved_id: $scope.involucrado.involved.id, assignee_id: assignee.id}).then(function(response){
                    alertify.success("Apoderado creado con exito")
                    $scope.resetInvolucrado()
                    $scope.getSolicitude()
                }, function(response){
                    $scope.resetInvolucrado()
                    console.log(response.data)
                    alertify.error("Error relacionando apoderado intente de nuevo")
                })
            }else{
                var ind = WizardHandler.wizard().currentStepNumber()
                if (ind == 2) {
                    //Convocantes
                    $scope.setGlobal('convocante', 'assignee', assignee.id)
                }else{
                    //Convocados
                    $scope.setGlobal('convocado', 'assignee', assignee.id)
                }
            }
        },function(response){
            alertify.error("Error creando apoderado revise la informacion del apoderado")
            $scope.resetInvolucrado()
            console.log(response.data)
        })
    }
    $scope.edit_apoderado = function(){
        Conciliacion.update.assignee($scope.solicitude.id, $scope.involucrado.involved.id, $scope.involucrado.involved.assignee.id, $scope.involucrado.involved.assignee).then(function(response){
            if ($scope.verified && !$scope.global) {
                Conciliacion.create.assignee_relation({solicitude_id: $scope.solicitude.id, involved_id: $scope.involucrado.involved.id, assignee_id: $scope.involucrado.involved.assignee.id }).then(function(response){
                    alertify.success("Apoderado editado con exito")
                    $scope.resetInvolucrado()
                    $scope.getSolicitude()
                }, function(response){
                    console.log(response.data)
                    alertify.error("Error agregando al apoderado")
                    $scope.resetInvolucrado()
                    $scope.getSolicitude()
                })
            }else if ($scope.verified && $scope.global) {
                var ind = WizardHandler.wizard().currentStepNumber()
                if (ind == 2) {
                    //Convocantes
                    $scope.setGlobal('convocante', 'assignee', $scope.involucrado.involved.assignee.id)
                }else{
                    //Convocados
                    $scope.setGlobal('convocado', 'assignee', $scope.involucrado.involved.assignee.id)
                }
            }else{
                alertify.success("apoderado editado con exito")
                $scope.resetInvolucrado()
                $scope.getSolicitude()
            }
        },function(response){
            alertify.error("Error en la edición del apoderado")
            $scope.resetInvolucrado()
            console.log(response.data)
        })
    }
    $scope.replace_apoderado = function(){
        if($scope.global){
            var ind = WizardHandler.wizard().currentStepNumber()
            var con = ''
            if (ind == 2) {
                //Convocantes
                con = 'convocante'
            }else{
                //Convocados
                con = 'convocado'
            }
            //function(solID, assigID, type)
            Conciliacion.delete.global_relation($scope.solicitude.id, 'assignee', con).then(function(response){
                alertify.success("Exito restaurando apoderado global")
                $scope.getSolicitude()
                $scope.resetInvolucrado()
                $scope.cancel()
            }, function(response){
                alertify.error("Error restaurando apoderado global")
                console.log(response.data)
                $scope.resetInvolucrado()
                console.log(response)
            })
        }else{
            Conciliacion.delete.assignee({solicitude_id: $scope.solicitude.id, involved_id: $scope.involucrado.involved.id}).then(function(response){
                alertify.success("Restauración de apoderado exitosa")
                $scope.getSolicitude()
                $scope.resetInvolucrado()
                $scope.cancel()
            }, function(response){
                alertify.error("Error restaurando del apoderado")
                $scope.resetInvolucrado()
                console.log(response)
            })
        }
    }
    $scope.relateGlobalAssignee = function(){
        var assignee = {}
        var ind = WizardHandler.wizard().currentStepNumber()
        if(ind == 2 ){
            //Convocante
            assignee = $scope.getGlobalAR('convocante', 'assignee')
        }else{
            //Convocado
            assignee = $scope.getGlobalAR('convocado', 'assignee')
        }
        Conciliacion.create.assignee_relation({solicitude_id: $scope.solicitude.id, involved_id: $scope.involucrado.involved.id, assignee_id: assignee.id }).then(function(response){
            alertify.success("Apoderado asociado con exito")
            $scope.resetInvolucrado()
            $scope.getSolicitude()
            $scope.globalAsociation.value = false
        }, function(response){
            console.log(response.data)
            alertify.error("Error agregando al apoderado")
            $scope.resetInvolucrado()
            $scope.getSolicitude()
            $scope.globalAsociation.value = false
        })
    }
    $scope.relateGlobalRepresentative = function(){
        var representative = {}
        var ind = WizardHandler.wizard().currentStepNumber()
        if(ind == 2 ){
            //Convocante
            representative = $scope.getGlobalAR('convocante', 'representative')
        }else{
            //Convocado
            representative = $scope.getGlobalAR('convocado', 'representative')
        }
        Conciliacion.create.representative_relation({solicitude_id: $scope.solicitude.id, involved_id: $scope.involucrado.involved.id, representative_id: representative.id }).then(function(response){
            alertify.success("Representante asociado con exito")
            $scope.resetInvolucrado()
            $scope.getSolicitude()
            $scope.globalAsociation.value = false
        }, function(response){
            console.log(response.data)
            alertify.error("Error agregando al representante")
            $scope.resetInvolucrado()
            $scope.getSolicitude()
            $scope.globalAsociation.value = false
        })
    }

//Rrepresentante
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
            if (!$scope.global) {
                Conciliacion.create.representative_relation({solicitude_id: $scope.solicitude.id, involved_id: $scope.involucrado.involved.id, representative_id: representative.id}).then(function(response){
                    alertify.success("Representante creado con exito")
                    $scope.resetInvolucrado()
                    $scope.getSolicitude()
                }, function(response){
                    console.log(response.data)
                    $scope.resetInvolucrado()
                    alertify.error("Error relacionando al representante intente de nuevo")
                })
            }else{
                var ind = WizardHandler.wizard().currentStepNumber()
                if (ind == 2) {
                    //Convocantes
                    $scope.setGlobal('convocante', 'representative', representative.id)
                }else{
                    //Convocados
                    $scope.setGlobal('convocado', 'representative', representative.id)
                }
            }
        },function(response){
            alertify.error("Error creando al representante, revise los datos")
            console.log(response.data)
        })
        $scope.getSolicitude()
    }
    $scope.edit_representante = function(){
        Conciliacion.update.representative($scope.solicitude.id, $scope.involucrado.involved.id, $scope.involucrado.involved.representative.id, $scope.involucrado.involved.representative).then(function(response){
            if ($scope.verified && !$scope.global) {
                Conciliacion.create.representative_relation({solicitude_id: $scope.solicitude.id, involved_id: $scope.involucrado.involved.id, representative_id: $scope.involucrado.involved.representative.id }).then(function(response){
                    alertify.success("Representante editado con exito")
                    $scope.resetInvolucrado()
                    $scope.getSolicitude()
                }, function(response){
                    console.log(response.data)
                    alertify.error("Error agregando al representante")
                    $scope.resetInvolucrado()
                    $scope.getSolicitude()
                })
            }else if ($scope.verified && $scope.global) {
                var ind = WizardHandler.wizard().currentStepNumber()
                if (ind == 2) {
                    //Convocantes
                    $scope.setGlobal('convocante', 'representative', $scope.involucrado.involved.representative.id)
                }else{
                    //Convocados
                    $scope.setGlobal('convocado', 'representative', $scope.involucrado.involved.representative.id)
                }
            }else{
                alertify.success("Representante editado con exito")
                $scope.resetInvolucrado()
                $scope.getSolicitude()
            }
        },function(response){
            alertify.error("Error editado al representante")
            console.log(response.data)
        })
    }
    $scope.replace_representante = function(){
        if($scope.global){
            //function(solID, assigID, type)
           var ind = WizardHandler.wizard().currentStepNumber()
            var con = ''
            if (ind == 2) {
                //Convocantes
                con = 'convocante'
            }else{
                //Convocados
                con = 'convocado'
            }
            //function(solID, assigID, type)
            Conciliacion.delete.global_relation($scope.solicitude.id, 'representative', con).then(function(response){
                alertify.success("Exito restaurando representante global")
                $scope.getSolicitude()
                $scope.resetInvolucrado()
                $scope.cancel()
            }, function(response){
                alertify.error("Error restaurando representante global")
                $scope.resetInvolucrado()
                console.log(response)
            })
        }else{
            Conciliacion.delete.representative({solicitude_id: $scope.solicitude.id, involved_id: $scope.involucrado.involved.id}).then(function(response){
                alertify.success("Restauración de apoderado exitosa")
                $scope.getSolicitude()
                $scope.resetInvolucrado()
                $scope.cancel()
            }, function(response){
                alertify.error("Error restaurando del apoderado")
                $scope.resetInvolucrado()
                console.log(response)
            })
        }
    }
//Convocante
    $scope.add_convocante = function(){
        $scope.involucrado.participation_type = 'convocante';
        Conciliacion.create.involved($scope.solicitude.id, 'convocante', $scope.involucrado).then(function(response){
            var involucrado = response.data.involved
            if($scope.involucrado.involved.nature == 'natural'){
                $scope.involucrado.involved.natural.identifier_expedition_city = $scope.involucrado.involved.natural.identifier_expedition_city.title
                $scope.involucrado.involved.natural.origin_country = $scope.involucrado.involved.natural.origin_country.title
                Conciliacion.create.natural($scope.solicitude.id, response.data.involved.id, $scope.involucrado.involved).then(function(response){
                    $scope.professions.forEach(function(proff){
                        proff.name = proff.name.title
                        Conciliacion.create.profession(involucrado.id, 'involved', proff).then(function(response){
                            alertify.success('Exito agregando profesión')
                        }, function(response){
                            $scope.profession = {}
                            alertify.error('Error agregando profesión')
                            console.log(response.data)
                        })
                    })
                    $scope.getSolicitude()
                    alertify.success("Exito agregando convocante")
                    $scope.resetInvolucrado()
                }, function(response){
                    alertify.error("Error agregando convocante, recuerde que no puede tener las credenciales de algun participante de la solicitud")
                    console.log(response.data)
                    $scope.resetInvolucrado()
                })
            }else{
                Conciliacion.create.juridical($scope.solicitude.id, response.data.involved.id, $scope.involucrado.involved).then(function(response){
                    $scope.getSolicitude()
                    alertify.success("Exito agregando convocante")
                    $scope.resetInvolucrado()
                },function(response){
                    alertify.error("Error agregando convocante, recuerde que no puede tener las credenciales de algun participante de la solicitud")
                    console.log(response.data)
                    $scope.resetInvolucrado()
                })
            }
        },function(response){
            console.log(response.data)
            $scope.resetInvolucrado()
            alertify.error("Error agregando convocante")
        })
    }
    $scope.edit_convocante = function(){
        console.log("Se ejecuto")
        Conciliacion.update.involved($scope.solicitude.id, $scope.involucrado.involved.id, $scope.involucrado).then(function(response){
            console.log("Entro")
            if($scope.involucrado.involved.nature == 'natural'){
                $scope.involucrado.involved.natural.birthdate = $scope.involucrado.involved.natural.birthdate.formatDate()
                Conciliacion.update.natural($scope.solicitude.id, $scope.involucrado.involved.id, $scope.involucrado.involved.natural.id , $scope.involucrado.involved).then(function(response){
                    console.log("Entro2")
                    alertify.success("Edicion exitosa de convocante")
                    if ($scope.verified) {
                        Conciliacion.update.associate_involved($scope.solicitude.id, $scope.involucrado.involved.id, 'convocante').then(function(response){
                            console.log("Entro3")
                            alertify.success("Exito agregando involucrado")
                            $scope.verified = false
                            $scope.getSolicitude()
                            $scope.resetInvolucrado()
                            $scope.edit = false
                        }, function(response){
                            console.log(response.data)
                            $scope.verified = false
                            $scope.getSolicitude()
                            $scope.resetInvolucrado()
                            $scope.edit = false
                            alertify.error("Error agregando involucrado")
                        })
                    }
                    $scope.getSolicitude()
                    $scope.resetInvolucrado()
                    $scope.edit = false
                }, function(response){
                    alertify.error("Error en la edicion de convocante")
                    console.log(response.data)
                    $scope.resetInvolucrado()
                    $scope.edit = false
                })
            }else{
                Conciliacion.update.juridical($scope.solicitude.id, $scope.involucrado.involved.id, $scope.involucrado.involved.juridical.id ,$scope.involucrado.involved).then(function(response){
                    alertify.success("Edicion exitosa de convocante")
                    if ($scope.verified) {
                        Conciliacion.update.associate_involved($scope.solicitude.id, $scope.involucrado.involved.id, 'convocante').then(function(response){
                            alertify.success("Exito agregando involucrado")
                            $scope.verified = false
                            $scope.getSolicitude()
                            $scope.resetInvolucrado()
                            $scope.edit = false
                        }, function(response){
                            console.log(response.data)
                            $scope.verified = false
                            $scope.getSolicitude()
                            $scope.resetInvolucrado()
                            $scope.edit = false
                            alertify.error("Error agregando involucrado")
                        })
                    }
                    $scope.getSolicitude()
                    $scope.resetInvolucrado()
                    $scope.edit = false
                }, function(response){
                    alertify.error("Error en la edicion de convocante")
                    console.log(response.data)
                    $scope.resetInvolucrado()
                    $scope.edit = false
                })
            }
        }, function(response){
            console.log(response.data)
        })
    }
    //Convocado
    $scope.add_convocado = function(){
        $scope.involucrado.participation_type = 'convocado';
        Conciliacion.create.involved($scope.solicitude.id, 'convocado', $scope.involucrado).then(function(response){
            var involucrado = response.data.involved
            if($scope.involucrado.involved.nature == 'natural'){
                $scope.involucrado.involved.natural.identifier_expedition_city = $scope.involucrado.involved.natural.identifier_expedition_city.title
                $scope.involucrado.involved.natural.origin_country = $scope.involucrado.involved.natural.origin_country.title
                Conciliacion.create.natural($scope.solicitude.id, response.data.involved.id, $scope.involucrado.involved).then(function(response){
                    $scope.professions.forEach(function(proff){
                        proff.name = proff.name.title
                        Conciliacion.create.profession(involucrado.id, 'involved', proff).then(function(response){
                            alertify.success('Exito agregando profesión')
                        }, function(response){
                            $scope.profession = {}
                            alertify.error('Error agregando profesión')
                            console.log(response.data)
                        })
                    })
                    alertify.success("Exito agregando convocante")
                    $scope.resetInvolucrado()
                    $scope.getSolicitude()
                }, function(response){
                    alertify.error('Error creando convocado, no puede tener las credenciales de algun participante de la solicitud')
                    console.log(response.data)
                    $scope.resetInvolucrado()
                })
            }else{
                Conciliacion.create.juridical($scope.solicitude.id, response.data.involved.id, $scope.involucrado.involved).then(function(response){
                    $scope.getSolicitude()
                    alertify.success("Exito agregando convocado")
                    $scope.resetInvolucrado()
                },function(response){
                    alertify.error('Error creando convocado')
                    console.log(response.data)
                    $scope.resetInvolucrado()
                })
            }
        }, function(response){
            console.log(response.data)
            alertify.error("Error creando involucrado")
        })
    }
    $scope.edit_convocado = function(){
        Conciliacion.update.involved($scope.solicitude.id, $scope.involucrado.involved.id, $scope.involucrado).then(function(response){
            if($scope.involucrado.involved.nature == 'natural'){
            $scope.involucrado.involved.natural.birthdate = $scope.involucrado.involved.natural.birthdate.formatDate()
                Conciliacion.update.natural($scope.solicitude.id, $scope.involucrado.involved.id, $scope.involucrado.involved.natural.id , $scope.involucrado.involved).then(function(response){
                    if ($scope.verified) {
                        Conciliacion.update.associate_involved($scope.solicitude.id, $scope.involucrado.involved.id, 'convocado').then(function(response){
                            alertify.success("Exito agregando involucrado")
                            $scope.verified = false
                            $scope.getSolicitude()
                            $scope.resetInvolucrado()
                            $scope.edit = false
                        }, function(response){
                            console.log(response.data)
                            $scope.verified = false
                            $scope.getSolicitude()
                            $scope.resetInvolucrado()
                            $scope.edit = false
                            alertify.error("Error agregando involucrado")
                        })
                    }
                    $scope.getSolicitude()
                    $scope.resetInvolucrado()
                    $scope.edit = false
                }, function(response){
                    console.log(response.data)
                    $scope.resetInvolucrado()
                    $scope.edit = false
                })
            }else{
                Conciliacion.update.juridical($scope.solicitude.id, $scope.involucrado.involved.id, $scope.involucrado.involved.juridical.id ,$scope.involucrado.involved).then(function(response){
                    if ($scope.verified) {
                        Conciliacion.update.associate_involved($scope.solicitude.id, $scope.involucrado.involved.id, 'convocado').then(function(response){
                            alertify.success("Exito agregando involucrado")
                            $scope.verified = false
                            $scope.getSolicitude()
                            $scope.resetInvolucrado()
                            $scope.edit = false
                        }, function(response){
                            console.log(response.data)
                            $scope.verified = false
                            $scope.getSolicitude()
                            $scope.resetInvolucrado()
                            $scope.edit = false
                            alertify.error("Error agregando involucrado")
                        })
                    }
                    $scope.edit = false
                }, function(response){
                    console.log(response.data)
                    $scope.resetInvolucrado()
                    $scope.edit = false
                })
            }
        })
    }
    //Hechos_pretensiones
    $scope.add_hp = function(type){

        if(type == 1){
            Conciliacion.create.fact($scope.solicitude.id, $scope.solicitude.conciliation.id, $scope.hecho_pretension).then(function(response){
                $scope.hecho_pretension = {}
                $scope.getSolicitude()
            },function(response){
                $scope.hecho_pretension = {}
                console.log(response.data)
            })
        }
        else if (type == 2){
            Conciliacion.create.pret($scope.solicitude.id, $scope.solicitude.conciliation.id, $scope.hecho_pretension).then(function(response){
                $scope.hecho_pretension = {}
                $scope.getSolicitude()
            },function(response){
                $scope.hecho_pretension = {}
                console.log(response.data)
            })
        }else{
            Conciliacion.create.fundamentals($scope.solicitude.conciliation.id, $scope.hecho_pretension).then(function(response){
                $scope.hecho_pretension = {}
                $scope.getSolicitude()
            },function(response){
                $scope.hecho_pretension = {}
                console.log(response.data)
            })
        }
    }
    $scope.edit_hp = function(type){
        if(type == 1){
            Conciliacion.update.fact($scope.solicitude.id, $scope.solicitude.conciliation.id, $scope.hecho_pretension.id , $scope.hecho_pretension).then(function(response){
                $scope.hecho_pretension = {}
                $scope.edit = false
                $scope.getSolicitude()
            },function(response){
                $scope.edit = false
                $scope.hecho_pretension = {}
                console.log(response.data)
            })
        }else if(type == 2){
            Conciliacion.update.pret($scope.solicitude.id, $scope.solicitude.conciliation.id, $scope.hecho_pretension.id, $scope.hecho_pretension).then(function(response){
                $scope.hecho_pretension = {}
                $scope.edit = false
                $scope.getSolicitude()
            },function(response){
                $scope.edit = false
                $scope.hecho_pretension = {}
                console.log(response.data)
            })
        }else{
            Conciliacion.update.fundamentals($scope.hecho_pretension.id, $scope.hecho_pretension).then(function(response){
                $scope.hecho_pretension = {}
                $scope.edit = false
                $scope.getSolicitude()
            },function(response){
                $scope.edit = false
                $scope.hecho_pretension = {}
                console.log(response.data)
            })
        }
    }

    //Pruebas

    $scope.getProof = function(){
        Conciliacion.get.proof($scope.solicitude.id).then(function(response){
            $scope.proofs = response.data.proofs
        })
    }

    $scope.showProof = function(proof, ev){
        if (proof.testimony == null) {
            $window.open(IP + proof.url, '_blank');
        }else{
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
    }
//FinCRUDS

//Validations
    $scope.convocantes_validation = function(){
        try{
            return $scope.convocantes().length != 0;
        }catch(err){}
    }
    $scope.convocados_validation = function(){
        return $scope.convocados().length != 0;
    }
    $scope.hechos_validation = function(){
        return $scope.solicitude.conciliation.facts.length != 0;
    }
    $scope.pretensiones_validation = function(){
        return $scope.solicitude.conciliation.pretensions.length != 0;
    }
//Wizard
    $scope.finished = function() {
        $scope.solicitude.state = 'enviada'
        Conciliacion.update.solicitude($scope.solicitude.id, $scope.solicitude).then(function(response){
            window.location = '#/app/conciliacion'
        },function(response){console.log(response.data)})
    };
    $scope.nextStep = function(state) {
        if($scope.solicitude.state == 'incompleta'){
            $scope.solicitude.state = 'incompleta/' + state
            console.log($scope.solicitude)
            if ($scope.solicitude.conciliation.definable == null) {
                $scope.solicitude.conciliation.definable = false
            }
            console.log($scope.solicitude)
            if($scope.cuantia.indeterminada){
                $scope.solicitude.conciliation.payment_amount = -1
            }
            Conciliacion.update.solicitude($scope.solicitude.id, $scope.solicitude).then(function(response){
                console.log($scope.solicitude)
                Conciliacion.create.conciliation($scope.solicitude.id, $scope.solicitude).then(function(response){
                    $scope.getSolicitude()
                },function(response){
                    console.log(response.data)
                    $scope.solicitude.state = 'incompleta'
                    Conciliacion.update.solicitude($scope.solicitude.id, $scope.solicitude).then(function(response){
                        WizardHandler.wizard().goTo(0)
                    },function(response){
                        WizardHandler.wizard().goTo(0)
                    })
                })
            },function(response){console.log(response.data)})
        }else{
            $scope.solicitude.state = 'incompleta/' + state
            Conciliacion.update.solicitude($scope.solicitude.id, $scope.solicitude).then(function(response){
                $scope.getSolicitude()
            },function(response){console.log(response.data)})
        }
    };
//FinLOGIC
//VARIABLES
    $scope.global = false
    $scope.getGlobalAR = function(con, type){
        var AR = {}
        if (type == 'assignee') {
            $scope.solicitude.global_assignees.forEach(function(ele){
                if (ele.participation_type == con) {
                    AR = ele
                }
            })
        }else if(type == 'representative'){
            $scope.solicitude.global_representatives.forEach(function(ele){
                if (ele.participation_type == con) {
                    AR = ele
                }
            })
        }
        if (AR.id == null) {
            return null
        }else{
            return AR
        }
    }
    $scope.globalAvailable = function(type){
        //return true
        var ind = WizardHandler.wizard().currentStepNumber()
        var available = false
        if ( ind == 2){
            if ($scope.getGlobalAR('convocante', type) != null) {
                available = $scope.getGlobalAR('convocante', type).id  != null//$scope.involucrado.involved.assignee.id
            }
        }else{
            if ($scope.getGlobalAR('convocado', type) != null) {
                    available = $scope.getGlobalAR('convocado', type).id  != null//$scope.involucrado.involved.assignee.id
            }
        }
        return !$scope.global && available && !$scope.edit
    }
    $scope.globalSelectAssignee = [{value: 'Usar apoderado independiente', response: false}, {value: 'Usar apoderado global', response: true}]
    $scope.globalSelectRepresentative = [{value: 'Usar representante legal independiente', response: false}, {value: 'Usar representante legal global', response: true}]
    $scope.globalAsociation = {value: false}
    $scope.showForm = function(type){
        var isGlobal = false
        var ind = WizardHandler.wizard().currentStepNumber()
        if(!$scope.global){
            if (ind == 2) {
                //Convocantes
                var global = $scope.getGlobalAR('convocante', type)
                if (type == 'assignee') {
                    if (global != null && $scope.involucrado.involved.assignee != null) {
                        isGlobal = global.id == $scope.involucrado.involved.assignee.id
                    }
                }else{
                    if (global != null && $scope.involucrado.involved.representative != null) {
                        isGlobal = global.id == $scope.involucrado.involved.representative.id
                    }
                }
            }else{
                //Convocados
                var global = $scope.getGlobalAR('convocado', type)
                if (type == 'assignee') {
                    if (global != null && $scope.involucrado.involved.assignee != null) {
                        isGlobal = global.id == $scope.involucrado.involved.assignee.id
                    }
                }else{
                    if (global != null && $scope.involucrado.involved.representative != null) {
                        isGlobal = global.id == $scope.involucrado.involved.representative.id
                    }
                }
            }
        }

        return $scope.global || (!isGlobal && !$scope.globalAsociation.value)
    }

    $scope.setGlobal = function(con, type, id){
        if (type == 'assignee') {
            Conciliacion.create.global_assignee($scope.solicitude.id, id, con).then(function(response){
                $scope.resetInvolucrado()
                $scope.getSolicitude()
                $scope.global = false
                alertify.success("Exito asociando apoderado global")
            }, function(response){
                console.log(response.data)
                $scope.global = false
                $scope.resetInvolucrado()
                $scope.getSolicitude()
                alertify.error("Error asociando apoderado global")
            })
        }else if (type == 'representative') {
            Conciliacion.create.global_representative($scope.solicitude.id, id, con).then(function(response){
                $scope.resetInvolucrado()
                $scope.global = false
                $scope.getSolicitude()
                alertify.success("Exito asociando representante global")
            }, function(response){
                alertify.error("Error asociando representante global")
                console.log(response.data)
                $scope.global = false
                $scope.resetInvolucrado()
                $scope.getSolicitude()
            })
        }
        $scope.edit = false
        $scope.verified = false
    }
    $scope.verified = false
    $scope.findInvolved = function(){
        if($scope.involucrado.involved.nature == 'natural'){
            Participations.get.natural({identifier_type: $scope.involucrado.involved.natural.identifier_type, identifier: $scope.involucrado.involved.natural.identifier}).then(function(response){
                if (response.status != 204) {
                    $scope.involucrado.involved = response.data.involved
                    $scope.involucrado.involved.natural.birthdate = new Date($scope.involucrado.involved.natural.birthdate)
                    $scope.verified = true
                    $scope.edit = true
                    $scope.getProfession($scope.involucrado.involved.id, 'involved')
                }
            }, function(response){
                console.log(response.data)
            })
        }else{
            Participations.get.juridical({nit:$scope.involucrado.involved.juridical.nit}).then(function(response){
                if (response.status != 204) {
                    $scope.involucrado.involved = response.data.involved
                    $scope.verified = true
                    $scope.edit = true
                }
            }, function(response){
                console.log(response.data)
            })
        }
    }
    $scope.findAssignee = function(){
        Participations.get.assignee({identifier_type: $scope.involucrado.involved.assignee.identifier_type, identifier: $scope.involucrado.involved.assignee.identifier}).then(function(response){
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

    $scope.getParticipantNameById = function(type, id){
        if (type == 'involved') {
            $scope.solicitude.solicitude_participations.forEach(function(inv){
                if (inv.id = id) {
                    return $scope.getName(inv)
                }
            })
        }else if (type == 'assignee') {
            $scope.solicitude.solicitude_participations.forEach(function(inv){
                if (inv.assignee != null) {
                    if(inv.assignee.id == id){
                        return $scope.getARName(inv.assignee)
                    }
                }
            })
        }else if (type == 'representative') {
            $scope.solicitude.solicitude_participations.forEach(function(inv){
                if (inv.representative != null) {
                    if(inv.representative.id == id){
                        return $scope.getARName(inv.representative)
                    }
                }
            })
        }
    }
    $scope.getARName = function(app){
        if(app != null) return app.first_name + ' ' + app.first_lastname + ' ' + app.second_lastname
    }
    $scope.getSolicitude = function(){
        $('#loader-container').fadeIn('fast');
        Conciliacion.get.solicitude($state.params.id).then(function(response){
            $('#loader-container').fadeOut('slow');
            $scope.solicitude = response.data.solicitude
            Conciliacion.get.proof($scope.solicitude.id).then(function(response){
                $scope.proofs = response.data.proofs
            })
            Conciliacion.get.fundamentals($scope.solicitude.conciliation.id).then(function(response){
                $scope.fundamentals = response.data.fundamentals
            })
        },function(response){
            window.location = '#/app/conciliacion'
            console.log(response)
        })
    }
    $scope.esConvocante = function(p){
        return p.participation_type == 'convocante'
    }
    $scope.getConvocantes = function(){
        if ($scope.solicitude != null) {
            return $scope.solicitude.solicitude_participations.filter(i => $scope.esConvocante(i));
        }
    }
    $scope.getConvocados = function(){
        if($scope.solicitude != null){
            return $scope.solicitude.solicitude_participations.filter(i => !$scope.esConvocante(i));
        }
    }
    $scope.convocantes = function(){
        if ($scope.solicitude != null) {
            return $scope.solicitude.solicitude_participations.filter(i => i.participation_type == 'convocante');
        }
    }
    $scope.convocados = function(){
        return $scope.solicitude.solicitude_participations.filter(i => i.participation_type == 'convocado');
    }
    $scope.esNatural = function(p){
        return p.involved.nature == 'natural'
    }
    $scope.getName = function(ele) {
        if($scope.esNatural(ele)){
            return ele.involved.natural.first_name + ' ' + ele.involved.natural.first_lastname
        }else{
            return ele.involved.juridical.name
        }
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
    $scope.getIcon = function(ele){
        if($scope.esNatural(ele)){
            return 'perm_identity'
        }else{
            return 'account_balance'
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
    $scope.getConstant = function(name){
        Conciliacion.get.constant(name).then(function(response){
            return response.data.constants
        })
    }
    Conciliacion.get.constant('conciliation_applicant').then(function(response){
        $scope.applicant = response.data.constants
    })
    Conciliacion.get.constant('conciliation_goal').then(function(response){
        $scope.service_goal = response.data.constants
    })
    $scope.involucrado = {
        participation_type: '',
        involved: {
            country: 'COLOMBIA',
            nature: ''
        }
    }
    $scope.resetInvolucrado = function(){
        $scope.involucrado = {
            involved: {
                country: 'COLOMBIA'
            }
        }
    }
    $scope.assignee = {}
    Conciliacion.get.constant('conciliation_period').then(function(response){
        $scope.conflict_time = response.data.constants
    })
    Conciliacion.get.constant('involved_nature').then(function(response){
        $scope.convtype = response.data.constants
    })
    Conciliacion.get.constant_child(1962, 'conciliation_area').then(function(response){
        $scope.area = response.data.constants
        var r1 = $scope.area.filter(function(a) {
            return a.value == $scope.solicitude.conciliation.area
        })
        Conciliacion.get.constant_child(r1[0].id, 'conciliation_topic').then(function(response){
            $scope.topic = response.data.constants
            var r2 = $scope.topic.filter(function(t){
                return t.value == $scope.solicitude.conciliation.topic
            })
            Conciliacion.get.constant_child(r2[0].id, 'conciliation_subtopic').then(function(response){
                $scope.subtopic = response.data.constants
            }, function(response){
                console.log(response.data)
            })
        })
    }, function(response){
        console.log(response.data)
    })

    Conciliacion.get.constant_child(2307, 'conciliation_area').then(function(response){
        $scope.areanot = response.data.constants
        if($scope.area != null){
            var r1 = $scope.area.filter(function(a) {
                return a.value == $scope.solicitude.conciliation.area
            })
            Conciliacion.get.constant_child(r1[0].id, 'conciliation_topic').then(function(response){
                $scope.topic = response.data.constants
                var r2 = $scope.topic.filter(function(t){
                    return t.value == $scope.solicitude.conciliation.topic
                })
            })
        }
    })

    $scope.getArea = function(){
        var r = $scope.area.filter(function(a) {
            return a.value == $scope.solicitude.conciliation.area
        })
        Conciliacion.get.constant_child(r[0].id, 'conciliation_topic').then(function(response){
            $scope.topic = response.data.constants
        }, function(response){
            console.log(response.data)
        })
    }

    $scope.getAreaNot = function(){
        var r = $scope.areanot.filter(function(a) {
            return a.value == $scope.solicitude.conciliation.area
        })
        Conciliacion.get.constant_child(r[0].id, 'conciliation_topic').then(function(response){
            $scope.topic = response.data.constants
        }, function(response){
            console.log(response.data)
        })
    }

    $scope.getAssigneeCity = function(){
        var r = $scope.departments.filter(function(a) {
            return a.value == $scope.involucrado.involved.assignee.department
        })
        Conciliacion.get.constant_child(r[0].id, 'city').then(function(response){
            $scope.city = response.data.constants
        })
    }

    $scope.subtopicValid = false

    $scope.getSubTopic = function(){
        var r = $scope.topic.filter(function(t){
            return t.value == $scope.solicitude.conciliation.topic
        })
        Conciliacion.get.constant_child(r[0].id, 'conciliation_subtopic').then(function(response){
            $scope.subtopicValid = true
            $scope.subtopic = response.data.constants
            if($scope.subtopic.length == 0){
                delete $scope.solicitude.conciliation.subtopic
                $scope.subtopicValid = false
            }
        },function(response){
            console.log(response.data)
        })
    }

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

    $scope.getRepCities = function(){
        var r = $scope.departments.filter(function(a) {
            return a.value == $scope.involucrado.involved.representative.department
        })
        Conciliacion.get.constant_child(r[0].id, 'city').then(function(response){
            $scope.cities = response.data.constants
        })
    }

    $scope.involvedType = function(type){
        if(type == 'natural'){
            return 'Persona'
        }else{
            return 'Organización'
        }
    }

    $scope.factCity = function(){
        var r = $scope.departments.filter(function(a) {
            return a.value == $scope.hecho_pretension.department
        })
        Conciliacion.get.constant_child(r[0].id, 'city').then(function(response){
            $scope.cities = response.data.constants
        })
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
        Conciliacion.setIndex(true);
        window.location = '#/app/conciliacion';
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
//FinVARIABLES
}]);
angular.module('app').directive('input', [function(){
    return {
        require: '?ngModel',
        link: function(scope, elem, attrs, ngModel){
            if(attrs.type == 'number'){
                ngModel.$formatters.push(function(value){
                    return parseFloat(value);
                });
            }
        }
    };
}]);
