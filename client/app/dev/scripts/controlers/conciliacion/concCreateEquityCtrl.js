angular.module('app')
.controller('ConcCreateEquityCtlr', ['$scope', '$q','$timeout', 'WizardHandler','Conciliacion', '$http', '$mdDialog', 'URL', '$state', 'Upload', '$window', 'IP', 'COL', 'Participations', 'Audiencias',function($scope, $q, $timeout, WizardHandler, Conciliacion, $http, $mdDialog, URL, $state, Upload, $window, IP, COL, Participations, Audiencias){
    var step = {'info': 0, 'convocantes': 1, 'convocados': 2, 'hechos': 3, 'pretensiones': 4, 'por_pagar': 5}
    $scope.cuantia = {indeterminada: false}
    Conciliacion.get.solicitude($state.params.id).then(function(response){
        if(!response.data.solicitude.state.includes('incompleta')){
            window.location = '#/app/conciliacion'
        }
        $scope.solicitude = response.data.solicitude
        if ($scope.solicitude.conciliation.payment_amount == -1) {
            $scope.cuantia.indeterminada = true
        }else{
            $scope.cuantia.indeterminada = false
        }
        Conciliacion.get.proof($scope.solicitude.conciliation.id).then(function(response){
            //console.log(response.data.proofs)
            $scope.proofs = response.data.proofs
        })
        Conciliacion.get.fundamentals($scope.solicitude.conciliation.id).then(function(response){
            //console.log(response.data)
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
        $scope.hecho_pretension.description = ''
        $scope.hecho_pretension.department = null
        $scope.hecho_pretension.city = null
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
        Conciliacion.get.constant_child(COL ,'department').then(function(response){
            $scope.departments = response.data.constants
            var r2 = $scope.departments.filter(function(d){
                return d.value == $scope.involucrado.department
            })
            Conciliacion.get.constant_child(r2[0].id, 'city').then(function(response){
                $scope.cities = response.data.constants
            })
        })
        $scope.showConvocante(ev)
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
            if($scope.edit){
                $scope.edit_convocado()
            }else{
                $scope.add_convocado()
            }
        }, function() {
            console.log('Evento cancelado')
        });
    };
    $scope.editConvocado = function(inv, ev){
        $('#loader-container').fadeIn('fast');
        $scope.involucrado = inv
        if($scope.involucrado.involved.natural != null){
            $scope.involucrado.involved.natural.birthdate = new Date($scope.involucrado.involved.natural.birthdate)
            $scope.getProfession(inv.involved.id, 'involved')
        }
        Conciliacion.get.constant_child(COL ,'department').then(function(response){
            $scope.departments = response.data.constants
            var r2 = $scope.departments.filter(function(d){
                return d.value == $scope.involucrado.department
            })
            Conciliacion.get.constant_child(r2[0].id, 'city').then(function(response){
                $scope.cities = response.data.constants
            })
        })
        $scope.edit = true
        $scope.showConvocado(ev)
    }
    //Apoderado
    $scope.showApoderado = function(inv, ev, edit) {
        $('#loader-container').fadeIn('fast');
        $scope.involucrado = inv
        $scope.edit = edit
        if(edit){
            // $scope.studies = inv.involved.assignee.studies
            var r2 = $scope.departments.filter(function(d){
                return d.value == $scope.involucrado.involved.assignee.department
            })
            Conciliacion.get.constant_child(r2[0].id, 'city').then(function(response){
                $scope.city = response.data.constants
            }, function(response){
                console.log(response.data)
            })
        }else{
            // $scope.studies = []
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
            $scope.getSolicitude()
        });
    };
    //Representante
    $scope.showRepresentante = function(inv, ev, edit) {
        $('#loader-container').fadeIn('fast');
        $scope.involucrado = inv
        $scope.edit = edit
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
    //fundamental
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
    $scope.editFundamental = function(pret, ev){
        $('#loader-container').fadeIn('fast');
        $scope.hecho_pretension = pret
        $scope.edit = true
        $scope.showPretension(ev)
    }
    //proof
    $scope.proof = {}
    $scope.showProofCreate = function(ev) {
        $('#loader-container').fadeIn('fast');
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
                $scope.proof = {}
                console.log(response.data)
                $('#loader-container').fadeOut('slow');
                alertify.error('Error subiendo la prueba')
            })
        }, function() {
            $scope.proof = {}
        });
    };

    //profesion
    $scope.profession = {}

    $scope.addProfession = function(id, type){
        if ($scope.edit) {
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
    $scope.deleteProfession = function(id, type){
        if ($scope.edit) {
            Conciliacion.delete.profession($scope.professions[id].id).then(function(response){
                alertify.success('Exito eliminando profesión')
                $scope.getProfession($scope.involucrado.involved.id, type)
            }, function(response){
                console.log(response.data)
                alertify.error('Error eliminando profesión')
            })
        }else{
            $scope.professions.splice(id, 1)
        }
    }
    $scope.getProfession = function(id, type){
        if ($scope.edit) {
            Conciliacion.get.profession(id, type).then(function(response){
                console.log(response.data)
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
        Conciliacion.create.assignee($scope.solicitude.id, $scope.involucrado.id, $scope.involucrado.involved.assignee).then(function(response){
            alertify.success("Apoderado agregado con exito")
            // $scope.studies.forEach(function(elem){
            //     Conciliacion.create.study($scope.solicitude.id, $scope.involucrado.id, response.data.assignee.id, elem).then(function(response){
            //         console.log(response.data)
            //         alertify.success("Estudio agregado con exito")
            //     },function(response){
            //         alertify.error("Error agregando estudio")
            //         console.log(response.data)
            //     })
            // })
            $scope.resetInvolucrado()
            $scope.getSolicitude()
        },function(response){
            alertify.error("Error agregando apoderado")
            $scope.resetInvolucrado()
            console.log(response.data)
        })
    }
    $scope.edit_apoderado = function(){
        Conciliacion.update.assignee($scope.solicitude.id, $scope.involucrado.id, $scope.involucrado.involved.assignee.id, $scope.involucrado.involved.assignee).then(function(response){
            alertify.success("Edicion de apoderado exitosa")
            $scope.resetInvolucrado()
        },function(response){
            alertify.error("Error en la edición del apoderado")
            $scope.resetInvolucrado()
            console.log(response.data)
        })
    }
    //Rrepresentante
    $scope.add_representante = function(){
        Conciliacion.create.representative($scope.solicitude.id, $scope.involucrado.id, $scope.involucrado.involved.representative).then(function(response){
            console.log(response.data)
            alertify.success("Representante agregado con exito")
            $scope.resetInvolucrado()
            $scope.getSolicitude()
        },function(response){
            alertify.error("Error agregando al representante")
            console.log(response.data)
        })
        $scope.getSolicitude()
    }
    $scope.edit_representante = function(){
        Conciliacion.update.representative($scope.solicitude.id, $scope.involucrado.id, $scope.involucrado.involved.representative.id, $scope.involucrado.involved.representative).then(function(response){
            console.log(response.data)
            alertify.success("Representante editado con exito")
            $scope.resetInvolucrado()
            $scope.getSolicitude()
        },function(response){
            alertify.error("Error editado al representante")
            console.log(response.data)
        })
    }
    //Convocante
    $scope.add_convocante = function(){
        $scope.involucrado.participation_type = 'convocante';
        Conciliacion.create.involved($scope.solicitude.id, 'convocante', $scope.involucrado).then(function(response){
            var involucrado = response.data.involved
            if($scope.involucrado.involved.nature == 'natural'){
                Conciliacion.create.natural($scope.solicitude.id, response.data.involved.id, $scope.involucrado.involved).then(function(response){
                    $scope.professions.forEach(function(proff){
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
            alertify.error("Error agregando convocante")
        })
    }
    $scope.edit_convocante = function(){
        $scope.involucrado.involved.natural.birthdate = $scope.involucrado.involved.natural.birthdate.formatDate()
        Conciliacion.update.involved($scope.solicitude.id, $scope.involucrado.id, $scope.involucrado).then(function(response){
            if($scope.involucrado.involved.nature == 'natural'){
                Conciliacion.update.natural($scope.solicitude.id, $scope.involucrado.id, $scope.involucrado.involved.natural.id , $scope.involucrado.involved).then(function(response){
                    alertify.success("Edicion exitosa de convocante")
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
                Conciliacion.update.juridical($scope.solicitude.id, $scope.involucrado.id, $scope.involucrado.involved.juridical.id ,$scope.involucrado.involved).then(function(response){
                    $scope.getSolicitude()
                    alertify.success("Edicion exitosa de convocante")
                    $scope.resetInvolucrado()
                    $scope.edit = false
                }, function(response){
                    alertify.error("Error en la edicion de convocante")
                    console.log(response.data)
                    $scope.resetInvolucrado()
                    $scope.edit = false
                })
            }
        })
    }
    //Convocado
    $scope.add_convocado = function(){
        $scope.involucrado.participation_type = 'convocado';
        Conciliacion.create.involved($scope.solicitude.id, 'convocado', $scope.involucrado).then(function(response){
            var involucrado = response.data.involved
            if($scope.involucrado.involved.nature == 'natural'){
                Conciliacion.create.natural($scope.solicitude.id, response.data.involved.id, $scope.involucrado.involved).then(function(response){
                    $scope.professions.forEach(function(proff){
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
                    console.log(response.data)
                    $scope.resetInvolucrado()
                })
            }else{
                Conciliacion.create.juridical($scope.solicitude.id, response.data.involved.id, $scope.involucrado.involved).then(function(response){
                    $scope.getSolicitude()
                    if($scope.involucrado.apoderado){
                        Conciliacion.create.assignee($scope.solicitude.id, response.data.involved.id, $scope.involucrado).then(function(response){
                            console.log(response.data)
                            $scope.resetInvolucrado()
                        },function(response){
                            console.log(response.data)
                        })
                    }else{
                        $scope.resetInvolucrado()
                    }
                },function(response){
                    console.log(response.data)
                    $scope.resetInvolucrado()
                })
            }
        })
    }
    $scope.edit_convocado = function(){
        $scope.involucrado.involved.natural.birthdate = $scope.involucrado.involved.natural.birthdate.formatDate()
        Conciliacion.update.involved($scope.solicitude.id, $scope.involucrado.id, $scope.involucrado).then(function(response){
            if($scope.involucrado.involved.nature == 'natural'){
                Conciliacion.update.natural($scope.solicitude.id, $scope.involucrado.id, $scope.involucrado.involved.natural.id , $scope.involucrado.involved).then(function(response){
                    $scope.getSolicitude()
                    $scope.resetInvolucrado()
                    $scope.edit = false
                }, function(response){
                    console.log(response.data)
                    $scope.resetInvolucrado()
                    $scope.edit = false
                })
            }else{
                Conciliacion.update.juridical($scope.solicitude.id, $scope.involucrado.id, $scope.involucrado.involved.juridical.id ,$scope.involucrado.involved).then(function(response){
                    $scope.getSolicitude()
                    $scope.resetInvolucrado()
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
                $scope.hecho_pretension.description = '';
                $scope.getSolicitude()
            },function(response){
                $scope.hecho_pretension.description = ''
                console.log(response.data)
            })
        }
        else if (type == 2){
            Conciliacion.create.pret($scope.solicitude.id, $scope.solicitude.conciliation.id, $scope.hecho_pretension).then(function(response){
                $scope.hecho_pretension.description = '';
                $scope.getSolicitude()
            },function(response){
                $scope.hecho_pretension = ''
                console.log(response.data)
            })
        }else{
            Conciliacion.create.fundamentals($scope.solicitude.conciliation.id, $scope.hecho_pretension).then(function(response){
                $scope.hecho_pretension.description = '';
                $scope.getSolicitude()
            },function(response){
                $scope.hecho_pretension = ''
                console.log(response.data)
            })
        }
    }
    $scope.edit_hp = function(type){
        if(type == 1){
            Conciliacion.update.fact($scope.solicitude.id, $scope.solicitude.conciliation.id, $scope.hecho_pretension.id , $scope.hecho_pretension).then(function(response){
                $scope.hecho_pretension.description = '';
                $scope.edit = false
                $scope.getSolicitude()
            },function(response){
                $scope.edit = false
                $scope.hecho_pretension.description = ''
                console.log(response.data)
            })
        }else if(type == 2){
            Conciliacion.update.pret($scope.solicitude.id, $scope.solicitude.conciliation.id, $scope.hecho_pretension.id, $scope.hecho_pretension).then(function(response){
                $scope.hecho_pretension.description = '';
                $scope.edit = false
                $scope.getSolicitude()
            },function(response){
                $scope.edit = false
                $scope.hecho_pretension = ''
                console.log(response.data)
            })
        }else{
            Conciliacion.update.fundamentals($scope.hecho_pretension.id, $scope.hecho_pretension).then(function(response){
                $scope.hecho_pretension.description = '';
                $scope.edit = false
                $scope.getSolicitude()
            },function(response){
                $scope.edit = false
                $scope.hecho_pretension = ''
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

    $scope.showProof = function(proof){
        console.log("Enreo")
        console.log(proof)
        $window.open(IP + proof.url, '_blank');
    }

    $scope.uploadFiles = function(files){
        for(var i = 0; i < files.length; i++){
            $('#loader-container').fadeIn('fast');
            Conciliacion.create.proof($scope.solicitude.id, files[i]).then(function(response){
                alertify.success('Prueba añadida correctamente')
                $('#loader-container').fadeOut('slow');
                $scope.getProof()
                $scope.getSolicitude()
            }, function(response){
                console.log(response.data)
                $('#loader-container').fadeOut('slow');
                alertify.error('Error subiendo la prueba')
            })
        }
    }
//FinCRUDS

//Validations
    $scope.convocantes_validation = function(){
        return $scope.convocantes().length != 0;
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
        $scope.solicitude.state = 'iniciar_audiencia'
        Conciliacion.update.conciliator_solicitude($scope.solicitude.id, $scope.solicitude).then(function(response){
            Audiencias.create.audience($scope.solicitude.id, {audience:{}}).then(function(response){
                alertify.success('A la audiencia')
                $scope.getSolicitude()
            window.location = '#/app/audiencia/conciliacion/' + $scope.solicitude.id
            }, function(response){
                console.log(response.data)
            })
        },function(response){console.log(response.data)})
    };
    $scope.nextStep = function(state) {
        if($scope.solicitude.state == 'incompleta'){
            $scope.solicitude.state = 'incompleta/' + state
            $scope.solicitude.conciliation.definable = true
            if($scope.cuantia.indeterminada){
                $scope.solicitude.conciliation.payment_amount = -1
            }
            Conciliacion.update.solicitude($scope.solicitude.id, $scope.solicitude).then(function(response){
                Conciliacion.create.conciliation($scope.solicitude.id, $scope.solicitude).then(function(response){
                    console.log(response.data)
                    $scope.getSolicitude()
                },function(response){
                    console.log(response.data)
                    $scope.solicitude.state = 'incompleta'
                    Conciliacion.update.solicitude($scope.solicitude.id, $scope.solicitude).then(function(response){
                        WizardHandler.wizard.goTo(0)
                    },function(response){
                        WizardHandler.wizard.goTo(0)
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
    $scope.findInvolved = function(){
        if($scope.involucrado.involved.nature == 'natural'){
            console.log('Entro2')
            Participations.get.natural($scope.involucrado.involved.natural.identifier_type, $scope.involucrado.involved.natural.identifier).then(function(response){
                console.log(response.data)
                $scope.involucrado.involved.natural = response.data.natural
                $scope.edit = true
            }, function(response){
                console.log(response.data)
            })
        }else{
            console.log('Entro')
            Participations.get.juridical($scope.involucrado.involved.juridical.nit).then(function(response){
                $scope.involucrado.involved.juridical = response.data.juridical
                $scope.edit = true
            }, function(response){
                console.log(response.data)
            })
        }
    }
    // $scope.study = {university: '', level: '', title: ''}
    // var original_study = angular.copy($scope.study)
    $scope.getARName = function(app){
        return app.first_name + ' ' + app.first_lastname + ' ' + app.second_lastname
    }
    // $scope.resetStudy = function(){
    //     $scope.study = angular.copy(original_study);
    //     $scope.newStudies.$setPristine();
    //     $scope.newStudies.$setUntouched();
    //     return;
    // }
    $scope.getSolicitude = function(){
        $('#loader-container').fadeIn('fast');
        Conciliacion.get.solicitude($state.params.id).then(function(response){
            $('#loader-container').fadeOut('slow');
            $scope.solicitude = response.data.solicitude
            Conciliacion.get.proof($scope.solicitude.id).then(function(response){
                $scope.proofs = response.data.proofs
            })
            Conciliacion.get.fundamentals($scope.solicitude.conciliation.id).then(function(response){
                //console.log(response.data)
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
        return $scope.solicitude.solicitude_participations.filter(i => $scope.esConvocante(i));
    }
    $scope.getConvocados = function(){
        return $scope.solicitude.solicitude_participations.filter(i => !$scope.esConvocante(i));
    }
    $scope.convocantes = function(){
        return $scope.solicitude.solicitude_participations.filter(i => i.participation_type == 'convocante');
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
            participation_type: '',
            involved: {
                country: 'COLOMBIA',
                nature: ''
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
    Conciliacion.get.constant_child(2304, 'conciliation_area').then(function(response){
        $scope.area = response.data.constants
        var r1 = $scope.area.filter(function(a) {
            return a.value == $scope.solicitude.conciliation.area
        })
        Conciliacion.get.constant_child(r1[0].id, 'conciliation_topic').then(function(response){
            $scope.topic = response.data.constants
            var r2 = $scope.topic.filter(function(t){
                return t.value == $scope.solicitude.conciliation.topic
            })
        })
    })
    
    $scope.$watch('solicitude.conciliation.area', function(){
        var r = $scope.area.filter(function(a) {
            return a.value == $scope.solicitude.conciliation.area
        })
        Conciliacion.get.constant_child(r[0].id, 'conciliation_topic').then(function(response){
            $scope.topic = response.data.constants
        })
    })

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
            console.log(response.data)
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
        Conciliacion.get.constant_child(r2[0].id, 'city').then(function(response){
            $scope.cities = response.data.constants
        })
    })

    $scope.getRepCities = function(){
        var r = $scope.departments.filter(function(a) {
            return a.value == $scope.involucrado.involved.representative.department
        })
        Conciliacion.get.constant_child(r[0].id, 'city').then(function(response){
            $scope.cities = response.data.constants
        })
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
        var r = $scope.departments.filter(function(a) {
            return a.value == $scope.involucrado.involved.department
        })
        Conciliacion.get.constant_child(r[0].id, 'city').then(function(response){
            $scope.cities = response.data.constants
        })
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

    $scope.involvedType = function(type){
        if(type == 'natural'){
            return 'Persona'
        }else{
            return 'Organización'
        }
    }

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
        if($scope.edit){
            return 'Guardar'
        }else{
            return 'Agregar'
        }
    }

    $scope.toIndex = function(){
        window.location = '#/app/conciliacion'
    }
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