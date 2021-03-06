angular.module('app')
.controller('ConcShowCtlr', ['$scope', '$state', 'Conciliacion', '$window', 'screenSize', '$mdDialog', 'URL', 'Session', '$compile', 'uiCalendarConfig', 'Audiencias', 'IP', '$document', 'COL', 'Participations',function($scope, $state,Conciliacion, window, screenSize, $mdDialog, URL, Session, $compile, uiCalendarConfig, Audiencias, IP, $document, COL, Participations){
    $scope.Session =  Session
    Conciliacion.show($state.params.id).then(function (request) {
        $scope.conc = request.data.solicitude;
        //console.log($scope.conc);
        Audiencias.get.solicitude($scope.conc.id).then(function(response){
            $scope.audiences = response.data.audiences
            if($scope.audiences.length > 0) {
                $scope.courrentAudience = $scope.audiences[$scope.audiences.length - 1];
                var start = new Date($scope.courrentAudience.start)
                var end = new Date($scope.courrentAudience.end)
                $scope.audience_date = dateToEs(start) + " hasta el " + dateToEs(end)
            }
        })
        Conciliacion.get.fundamentals($scope.conc.conciliation.id).then(function(response){
            $scope.fundamentals = response.data.fundamentals
        })
        Conciliacion.get.documents($scope.conc.conciliation.id).then(function(response){
            $scope.documents = response.data.documents
        }, function(response){
            console.log(response.data)
        })
        if($scope.conc.state == 'aceptada' || $scope.conc.state == 'denegada_por_conciliador'){
            Session.getConciliators().then(function(response){
                $scope.conciliators = response.data.users
            },function(response){
                console.log(response.data)
            })
        }
        if ($scope.conc.state == 'iniciar_audiencia' && (Session.getRole() == 'conciliator' || Session.getRole() == 'conciliator_in_equity')) {
            window.location = '#/app/audiencia/conciliacion/' + $scope.conc.id
        }
        if ($scope.conc.state == 'audiencia_suspendida' && (Session.getRole() == 'conciliator' || Session.getRole() == 'conciliator_in_equity')) {
            window.location = '#/app/audiencia/result/' + $scope.conc.id
        }
        Conciliacion.get.proof($scope.conc.id).then(function(response){
            $scope.proofs = response.data.proofs
        })
    },function (request) {
        $scope.conc = {}
        console.log(request.data)
    })
    $scope.showArchive = function(url){
        window.open(IP + url, '_blank');
    }
    $scope.getNotification = function(conv){
        Conciliacion.get.notification($scope.conc.conciliation.id, conv.involved.id).then(function(response){
            $scope.showDocument(response.data.document)
            $scope.reFetchConc()
        }, function(response){
            alertify.error('Hubo un error generando este documento')
            console.log(response.data);
        })
    }
    var dateToEs = function(fecha){
        var months = { "0": "Enero", "1": "Febrero", "2": "Marzo", "3": "Abril", "4": "Mayo", "5": "Junio", "6": "Juilo", "7": "Agosto", "8": "Septiembre", "9": "Octubre", "10": "Noviembre", "11": "Diciembre"}
        return fecha.getDate() + " de " + months[fecha.getMonth()] + ", " + fecha.getFullYear() + ". A las " + fecha.getHours() + ":" + getMins(fecha) + " horas"
    }
    var getMins = function (date){
        return (date.getMinutes()<10?'0':'') + date.getMinutes()
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
    $scope.cancel = function(){
        $mdDialog.cancel()
        $scope.edit = false
        $scope.verified = false
        $scope.verify_click = false
        $scope.resetInvolucrado()
    }
    $scope.showDocument = function(doc){
        window.open(IP +'/'+ doc.url, '_blank');
    }
    $scope.getUserName = function(user){
        return user.name + ' ' + user.first_lastname + ' ' + user.second_lastname
    }
    $scope.reFetchConc = function(){
        $('#loader-container').fadeIn('fast');
        Conciliacion.show($state.params.id).then(function (request) {
            $scope.conc = request.data.solicitude;
            $('#loader-container').fadeOut('slow');
            if($scope.conc.state == 'aceptada'){
                Session.getConciliators().then(function(response){
                    $scope.conciliators = response.data.users
                },function(response){
                    console.log(response.data)
                })
            }
            Audiencias.get.solicitude($scope.conc.id).then(function(response){
                $scope.audiences = response.data.audiences
                if($scope.audiences.length > 0) {
                    $scope.courrentAudience = $scope.audiences[$scope.audiences.length - 1];
                    var start = new Date($scope.courrentAudience.start)
                    var end = new Date($scope.courrentAudience.end)
                    $scope.audience_date = dateToEs(start) + " hasta el " + dateToEs(end)
                }
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
    $scope.getDocument = function(){
        Conciliacion.get.solicitude_document($scope.conc.conciliation.id).then(function(response){
            var data = response.data.document
            $scope.reFetchConc()
            alertify.success('Exito generando documento')
            window.open(IP +'/'+ data.url, '_blank')
        }, function(response){
            alertify.error('Error generando documento')
            console.log(response.data)
        })
    }
    $scope.cuantia = function(value){
        if(value == -1){
            return 'Indeterminada'
        }else{
            return '$ ' + $scope.decimal(value)
        }
    }
    $scope.programAudience = function(){
        if(!$scope.program){
            var eve = uiCalendarConfig.calendars.programCalendar.fullCalendar('clientEvents')
            var prog = eve[eve.length - 1]
            var sDate = prog.start._d
            var sHH = sDate.getHours()
            var sMM = sDate.getMinutes()
            var eDate = prog.end._d
            var eHH = eDate.getHours()
            var eMM = eDate.getMinutes()
            var aud = {
                date: sDate.sendFormat(),
                starting_hour: (sHH>9 ? '' : '0') + sHH + ':' + (sMM>9 ? '' : '0') + sMM,
                ending_hour: (eHH>9 ? '' : '0') + eHH + ':' + (eMM>9 ? '' : '0') + eMM
            }
            Audiencias.create.audience($scope.conc.id, {audience: aud}).then(function(response){
                $mdDialog.show(
                  $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Audiencia programada')
                    .textContent('La audiencia se programo exitosamente.')
                    .ariaLabel('Programacion exitosa')
                    .ok('Continuar')
                );
                $scope.conc.state = 'programada'
                Conciliacion.update.conciliator_solicitude($scope.conc.id, $scope.conc).then(function(response){
                    $scope.reFetchConc()
                }, function(response){
                    console.log('Edit fallo')
                })
            }, function(response){
                $mdDialog.show(
                  $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('No hay salas disponibles')
                    .textContent('Lo sentimos no hay salas disponibles en el periodo de tiempo que selecciono. Seleccione otro horario.')
                    .ariaLabel('Programacion invalida')
                    .ok('Volver a programar')
                );
                console.log(response.data)
            })
        }
    }
    $scope.toAudience = function(){
        $scope.conc.state = 'iniciar_audiencia'
        Conciliacion.update.conciliator_solicitude($scope.conc.id, $scope.conc).then(function(response){
            window.location = '#/app/audiencia/conciliacion/' + $scope.conc.id
        }, function(response){
            console.log(response.data)
        })
    }
    $scope.coordAccept = function(response){
        $scope.conc.state = response
        Conciliacion.update.coordinator_solicitude($scope.conc.id, $scope.conc).then(function(response){
            $scope.reFetchConc()
        }, function(response){
            console.log(response.data)
        })
    }
    $scope.conAccept = function(response){
        $scope.conc.state = response
        Conciliacion.update.conciliator_solicitude($scope.conc.id, $scope.conc).then(function(response){
            $scope.reFetchConc()
        }, function(response){
            console.log(response.data)
        })
    }
    $scope.setConciliator = function(conciliator){
        //console.log('Entro en asigancion')
        Conciliacion.update.set_conciliator($scope.conc.id, conciliator.id).then(function(response){
            $scope.reFetchConc()
        }, function(response){
            console.log(response.data)
        })
    }
    $scope.getState = function(){
        try {
            return $scope.conc.state.toUpperCase().replaceAll('_', ' ')
        } catch (e) {
            return ""
        }
    }
    String.prototype.replaceAll = function(str1, str2, ignore){
        return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
    }
    $scope.decimal = function(num){
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
    $scope.showAudience = function(audience, ev){
        $scope.audience = audience
        $mdDialog.show({
            templateUrl: URL.dev.template + '/forms/showAudience.html',
            scope: $scope,
            preserveScope: true,
            targetEvent: ev,
            fullscreen: $scope.customFullscreen,
            clickOutsideToClose:true
        });
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
//CALENDAR
    Audiencias.get.user_audiences().then(function(response){
        var audiencias = response.data.audiences
        audiencias.forEach(function(aud){
            var a = {
                title: Session.getName(),
                start: new Date(aud.start),
                end: new Date(aud.end),
                allDay: false,
                editable: false,
                stick: true
            }
            $scope.audiencias.push(a)
        })
    }, function(response){console.log(response.data)})
    $scope.eventsF = function (start, end, timezone, callback) {
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
      callback(events);
    };
    $scope.program = true
    $scope.uiConfig = {
        programCalendar:{
            height: 450,
            editable: true,
            eventOverlap: false,
            defaultView: 'agendaWeek',
            timezone: 'local',
            allDaySlot: false,
            dayNames: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
            dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vier', 'Sab'],
            buttonText:{
                today: 'Hoy'
            },
            header: {
                left: 'Calendario de audiencias',
                center: '',
                right: 'today prev,next'
            },
            dayClick: function(date, allDay, jsEvent, view){
                //console.log('Click')
                var selectDate = new Date(date.format())
                var endDate = new Date(selectDate.setHours(selectDate.getHours() + 1) + 60*60*1000)
                if($scope.program){
                    $scope.newEvent = {
                        title: 'Nueva audiencia',
                        start: selectDate,
                        end: endDate,
                        allDay:false,
                        editable: true,
                        eventDurationEditable: true,
                        stick: true,
                        _itsUTC: false
                    }
                    $scope.audiencias.push($scope.newEvent)
                    //console.log($scope.audiencias)
                    //console.log(uiCalendarConfig.calendars.programCalendar.fullCalendar('clientEvents'))
                    $scope.program = false
                }
            },
            eventDragStop: function(){

            },
            eventRender: function( event, element, view ) {
                element.attr({'tooltip': event.title, 'tooltip-append-to-body': true});
                $compile(element)($scope);
            },
            eventResizeStop: function(){
                //console.log(uiCalendarConfig.calendars.programCalendar.fullCalendar('clientEvents'))
            }
        }
    }
    $scope.resetEvent = function(){
        $scope.audiencias.splice($scope.audiencias.length - 1, 1)
        $scope.program = true;
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
    $scope.edit = false
    $scope.verified = false
    $scope.verify_click = false
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
                }
            }, function(response){
                $('#loader-container').fadeOut('slow');
                console.log(response.data)
            })
        }else{
            Participations.get.juridical({nit:$scope.involucrado.involved.juridical.nit}).then(function(response){
                $('#loader-container').fadeOut('slow');
                if (response.status != 204) {
                    $scope.involucrado.involved = response.data.involved
                    $scope.verified = true
                    $scope.edit = true
                }
            }, function(response){
                $('#loader-container').fadeOut('slow');
                console.log(response.data)
            })
        }
    }
    $scope.involucrado = {
        involved: {}
    }
    $scope.resetInvolucrado = function(){
        $scope.involucrado = {involved: {}}
    }
    $scope.getButtonLable = function(){
        $('#loader-container').fadeOut('slow');
        if($scope.edit || $scope.verified){
            return 'Guardar'
        }else{
            return 'Agregar'
        }
    }
    $scope.showVerification = function(){
        return $scope.edit || $scope.verified
    }
    $scope.save = function(answer) {
      $mdDialog.hide(answer);
    };
    Date.prototype.formatDate = function(){
        return ("0" + this.getDate()).slice(-2) +
        "/" +  ("0" + (this.getMonth() + 1)).slice(-2) +
        "/" +  this.getFullYear();
    }
//PROFESSIONS
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
//Involved
    $scope.showInvolved = function(ev, type){
        $('#loader-container').fadeIn('fast');
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
        $scope.cancel()
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
    $scope.add_involved = function(type){
        $scope.involucrado.participation_type = type;
        Conciliacion.create.involved($scope.conc.id, type, $scope.involucrado).then(function(response){
            var involucrado = response.data.involved
            if($scope.involucrado.involved.nature == 'natural'){
                try{
                    $scope.involucrado.involved.natural.origin_country = $scope.involucrado.involved.natural.origin_country.title
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
                        $scope.reFetchConc()
                        alertify.success("Exito agregando involucrado")
                        $scope.cancel()
                    }, function(response){
                        Conciliacion.delete.involved(involucrado.involved.id).then(function(response){
                            $scope.showConvocante()
                            alertify.error("Error agregando involucrado, recuerde que no puede tener las credenciales de algun participante de la solicitud")
                        }, function(response){
                            $scope.showConvocante()
                            ErrorHandler.errorDisplay(response.data.errors)
                        })
                    })
                }catch(err){
                    Conciliacion.delete.involved(involucrado.id).then(function(response){
                        $scope.showConvocante()
                        alertify.error("Error agregando involucrado, recuerde que no puede tener las credenciales de algun participante de la solicitud")
                    }, function(response){
                        $scope.showConvocante()
                        ErrorHandler.errorDisplay(response.data.errors)
                    })
                }
            }else{
                Conciliacion.create.juridical($scope.conc.id, response.data.involved.id, $scope.involucrado.involved).then(function(response){
                    $scope.reFetchConc()
                    $scope.cancel()
                    alertify.success("Exito agregando involucrado")
                },function(response){
                    Conciliacion.delete.involved(involucrado.id).then(function(response){
                        $scope.showConvocante()
                        alertify.error("Error agregando involucrado, recuerde que no puede tener las credenciales de algun participante de la solicitud")
                    }, function(response){
                        $scope.showConvocante()
                        ErrorHandler.errorDisplay(response.data.errors)
                    })
                })
            }
        },function(response){
            $scope.showConvocante()
            ErrorHandler.errorDisplay(response.data.errors)
        })
    }
    $scope.edit_involved = function(type){
        Conciliacion.update.involved($scope.conc.id, $scope.involucrado.involved.id, $scope.involucrado).then(function(response){
            if($scope.involucrado.involved.nature == 'natural'){
                $scope.involucrado.involved.natural.birthdate = $scope.involucrado.involved.natural.birthdate.formatDate()
                Conciliacion.update.natural($scope.conc.id, $scope.involucrado.involved.id, $scope.involucrado.involved.natural.id , $scope.involucrado.involved).then(function(response){
                    alertify.success("Edicion exitosa de involucrado")
                    if ($scope.verified) {
                        Conciliacion.update.associate_involved($scope.conc.id, $scope.involucrado.involved.id, type).then(function(response){
                            alertify.success("Exito agregando involucrado")
                            $scope.reFetchConc()
                            $scope.cancel()
                        }, function(response){
                            ErrorHandler.errorDisplay(response.data.errors)
                        })
                    }
                    $scope.reFetchConc()
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
                            $scope.reFetchConc()
                        }, function(response){
                            ErrorHandler.errorDisplay(response.data.errors)
                        })
                    }
                    $scope.reFetchConc()
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
    Date.prototype.sendFormat = function() {
      var mm = this.getMonth() + 1; // getMonth() is zero-based
      var dd = this.getDate();
      return [(dd>9 ? '' : '0') + dd,'/',(mm>9 ? '' : '0') + mm,'/',this.getFullYear()].join('');
    };

    $scope.audiencias = []
    $scope.events = [$scope.audiencias]
//CONSTANTS
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
    $scope.involvedType = function(type){
        if(type == 'natural'){
            return 'Persona'
        }else{
            return 'Organización'
        }
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
    Conciliacion.get.constant('involved_nature').then(function(response){
        $scope.convtype = response.data.constants
    })
}]);
