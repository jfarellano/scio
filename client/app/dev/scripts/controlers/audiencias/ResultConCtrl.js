angular.module('app')
.controller('ResultConcCtrl', ['$scope', '$state', 'Conciliacion', '$window', 'screenSize', '$mdDialog', 'URL', 'Session', '$compile', 'Audiencias', 'IP', 'uiCalendarConfig',function($scope, $state,Conciliacion, window, screenSize, $mdDialog, URL, Session, $compile, Audiencias, IP, uiCalendarConfig){
    $scope.Session =  Session
    Conciliacion.show($state.params.id).then(function (request) {
        $scope.conc = request.data.solicitude;
        if(!($scope.conc.state == 'iniciar_audiencia' || $scope.conc.state == 'audiencia_suspendida')){
            window.location = '#/app/conciliacion/' + $scope.conc.id
        }
        Audiencias.get.solicitude($scope.conc.id).then(function(response){
            var auds = response.data.audiences
            $scope.audience = auds[auds.length - 1]
            console.log($scope.audience)
        })
    },function (request) {
        $scope.conc = {}
        console.log(request.data)
    })
    $scope.reFetch = function(){
        Conciliacion.show($state.params.id).then(function (request) {
            $scope.conc = request.data.solicitude;
            if(!($scope.conc.state == 'iniciar_audiencia' || $scope.conc.state == 'audiencia_suspendida')){
                window.location = '#/app/conciliacion/' + $scope.conc.id
            }
            Audiencias.get.solicitude($scope.conc.id).then(function(response){
                var auds = response.data.audiences
                $scope.audience = auds[auds.length - 1]
                console.log($scope.audience)
                Audiencias.get.guests($scope.audience.id).then(function(response){
                    $scope.invitados = response.data.guests
                })
            })
            Audiencias.get.user_audiences().then(function(response){
            var audiencias = response.data.audiences
            audiencias.forEach(function(aud){
                var a = {
                    title: Session.getName(),
                    start: new Date(aud.start),
                    end: new Date(aud.end),
                    allDay: false,
                    editable: false,
                    stick: true,
                    _itsUTC: true
                }
                $scope.audiencias.push(a)
            })
    }, function(response){console.log(response.data)})
        },function (request) {
            $scope.conc = {}
            console.log(request.data)
        })
    }

    $scope.addResult = function(description){
        Conciliacion.create.results($scope.conc.conciliation.id, description).then(function(response){
            alertify.success('Resultados guardados con exito')
            $scope.endSolicitude(acuerdo)
        }, function(response){
            console.log(response.data)
            alertify.error('Error guardando los resultados')
        })
    }

    $scope.aduerdo = {}

    $scope.resultTypes = [
    	{text: 'Acta', value: 'acta'},
    	{text: 'Constancia', value: 'constancia'}
    ]

    $scope.actas = [
		{text: 'Acta de acuerdo', value: 'total'},
		{text: 'Acta de acuerdo parcial', value: 'partial'}
    ]
    $scope.constancias = [
		{text: 'Constancia de no acuerdo', value: 'no_acuerdo'},
		{text: 'Constancia de no acuerdo por inasistencia', value: 'no_acuerdo_inasistencia'}
	]

    $scope.resutOptions = [
        {text:'Acuerdo', value: 1},
        {text:'No acuerdo', value: 2},
        {text:'Inasistencia', value: 3},
        {text:'Reprogramar', value: 4},
        {text: 'Otros', value: 5}
    ]

    $scope.resultOption = {}

    $scope.audienceResult = {}

	$scope.conclution = function(){
		if ($scope.resultType.result == 'acta') {
			return $scope.actas
		}else{
			return $scope.constancias
		}
	}

    $scope.resultType = {}

    $scope.suspendResult = [
        {text:'Aceptación de excusa', value: 1},
        {text:'No aceptación de excusa', value: 0}
    ]
    $scope.mc = {}
    $scope.acuerdo = {}
    $scope.endSolicitude = function(){
        if($scope.resultOption.result == 1){
            $scope.conc.state = 'cerrada'
            Conciliacion.update.conciliation($scope.conc.conciliation.id, $scope.mc).then(function(response){
                console.log(response.data)
            }, function(response){
                console.log(response.data)
            })
            Conciliacion.update.conciliator_solicitude($scope.conc.id, $scope.conc).then(function(response){
                Conciliacion.get.acta($scope.conc.conciliation.id, $scope.acuerdo.ac).then(function(response){
                    window.location = '#/app/dashboard'
                    alertify.success("Se cerro correctamente la solicitud")
                },function(response){
                    console.log(response.data);
                    alertify.error("Error cerrando la solicitud")
                })

            })
        }
        if($scope.resultOption.result == 2){
            //constancia
            $scope.conc.state = 'cerrada'
            Conciliacion.update.conciliation($scope.conc.conciliation.id, $scope.mc).then(function(response){
                console.log(response.data)
            }, function(response){
                console.log(response.data)
            })
            Conciliacion.update.conciliator_solicitude($scope.conc.id, $scope.conc).then(function(response){
                Conciliacion.get.constancia($scope.conc.conciliation.id).then(function(response){
                    window.location = '#/app/dashboard'
                    alertify.success("Se cerro correctamente la solicitud")
                },function(response){
                    console.log(response.data);
                    alertify.error("Error cerrando la solicitud")
                })
            })
        }
        if($scope.resultOption.result == 3){
            $scope.conc.state = 'audiencia_suspendida'
            Conciliacion.update.conciliator_solicitude($scope.conc.id, $scope.conc).then(function(response){
                Conciliacion.get.constancia_insasitencia($scope.conc.conciliation.id).then(function(response){
                    window.location = '#/app/dashboard'
                    alertify.success("Se reprogramo correctamente la solicitud")
                },function(response){
                    console.log(response.data);
                    alertify.error("Error reprogramando la solicitud, porfavor contacte soporte")
                })
                $scope.reFetch()
            },function(response){
                console.log(response.data)
            })
        }
        if($scope.resultOption.result == 4){
            //new Date
            $scope.programAudience()
        }
        if($scope.resultOption.result == 5){
            //otros
            $scope.conc.state = 'cerrada'
            Conciliacion.update.conciliation($scope.conc.conciliation.id, $scope.mc).then(function(response){
                console.log(response.data)
            }, function(response){
                console.log(response.data)
            })
            Conciliacion.update.conciliator_solicitude($scope.conc.id, $scope.conc).then(function(response){
                console.log(document_others[$scope.resultOption.others]);
                Conciliacion.get.constancia_otro($scope.conc.conciliation.id, document_others[$scope.resultOption.others]).then(function(response){
                    window.location = '#/app/dashboard'
                    alertify.success("Se cerro correctamente la solicitud")
                },function(response){
                    console.log(response.data);
                    alertify.error("Error cerrando la solicitud")
                })
            })
        }
    }

    var document_others = {
        'FALTA DE COMPETENCIA': 'lack_of_competition',
        'RETIRO DE LA SOLICITUD': 'withdrawal_of_request' ,
        'ACUERDO DE EXTRACONCILIACION': 'extraconciliation_agreement',
        'OTROS': 'others',
        'FALTA DE PAGO DEL SERVICIO': 'lack_of_payment_for_the_service',
        'DESISTIMIENTO DE UNA O AMBAS PARTES': 'withdrawal_of_the_parties',
        'ASUNTO NO CONCILIABLE': 'unreconcilable_matter'
    }

    $scope.endSuspention = function(){
        if($scope.resultOption.suspention == 1){
            //new Date
            $scope.resultOption.result = 4
            $scope.endSolicitude()
        }else{
            $scope.conc.state = 'cerrada'
            Conciliacion.update.conciliation($scope.conc.conciliation.id, $scope.mc).then(function(response){
                console.log(response.data)
            }, function(response){
                console.log(response.data)
            })
            Conciliacion.update.conciliator_solicitude($scope.conc.id, $scope.conc).then(function(response){
                Conciliacion.get.constancia_inasistencia_no_acuerdo($scope.conc.conciliation.id).then(function(response){
                    window.location = '#/app/dashboard'
                    alertify.success("Se cerro correctamente la solicitud")
                },function(response){
                    console.log(response.data);
                    alertify.error("Error cerrando la solicitud")
                })
            })
        }
    }

    $scope.edit = false

    //results
    $scope.showResult = function(ev) {
        $mdDialog.show({
            templateUrl: URL.dev.template + '/audiencia/result.html',
            scope: $scope,
            preserveScope: true,
            targetEvent: ev,
            escapeToClose: false
        }).then(function(answer) {
            $scope.add_result()
        }, function(answer) {
        	$scope.description = ''
        });
    };

    $scope.save = function(answer) {
      $mdDialog.hide(answer);
    };

    $scope.cancel = function() {
        $scope.edit = false
        $mdDialog.cancel()
    }

    $scope.results = []
    $scope.add_result = function(){
    	$scope.results.push({description: $scope.description})
        $scope.description = ''
    }

    $scope.deleteResult = function(id){
    	$scope.results.splice(id, 1)
    }

    Conciliacion.get.constant('conflict_scale').then(function(response){
        $scope.scale = response.data.constants
    })
    Conciliacion.get.constant('third_party').then(function(response){
        $scope.third = response.data.constants
    })
    Conciliacion.get.constant('signed_document').then(function(response){
        $scope.signed = response.data.constants
    })
    Conciliacion.get.constant('other_conciliation_constancy').then(function(response){
        console.log(response.data)
        $scope.others = response.data.constants
    }, function(response){
        console.log(response.data)
    })

    //CALENDAR
    Audiencias.get.user_audiences().then(function(response){
        var audiencias = response.data.audiences
        //console.log(audiencias)
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
        //console.log($scope.audiencias)
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
        programCalendarAudience:{
            height: 450,
            editable: true,
            eventOverlap: false,
            defaultView: 'agendaWeek',
            timezone: 'local',
            allDaySlot: false,
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
    Date.prototype.sendFormat = function() {
      var mm = this.getMonth() + 1; // getMonth() is zero-based
      var dd = this.getDate();
      return [(dd>9 ? '' : '0') + dd,'/',(mm>9 ? '' : '0') + mm,'/',this.getFullYear()].join('');
    };
    $scope.audiencias = []
    $scope.events = [$scope.audiencias]

    $scope.programAudience = function(){
        if(!$scope.program){
            var eve = uiCalendarConfig.calendars.programCalendarAudience.fullCalendar('clientEvents')
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
                console.log(response.data)
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
                    Conciliacion.get.constancia_nueva_fecha($scope.conc.conciliation.id).then(function(response){
                        window.location = '#/app/dashboard'
                        alertify.success("Se reprogramo correctamente la solicitud")
                    },function(response){
                        console.log(response.data);
                        alertify.error("Error reprogramando la solicitud porfavor contacte soporte")
                    })
                }, function(response){
                    console.log('Error en la edicion de solicitud')
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
//Invitados
    $scope.invitado = {}
    $scope.parte = [
        {value: 'convocante'},
        {value: 'convocado'}
    ]
    $scope.save = function(answer) {
      $mdDialog.hide(answer);
    };
    $scope.cancel = function() {
        $mdDialog.cancel()
    };
    $scope.showInvitado = function(ev) {
        $mdDialog.show({
            templateUrl: URL.dev.template + '/forms/invitado.html',
            scope: $scope,
            preserveScope: true,
            targetEvent: ev,
            escapeToClose: false
        }).then(function(answer) {
            $scope.add_invitado()
        }, function() {
            $scope.reFetch()
        });
    };
    $scope.add_invitado = function(){
        Audiencias.create.guest($scope.audience.id, $scope.invitado).then(function(response){
            alertify.success('Exito agregando invitado')
            $scope.invitado = {}
            $scope.reFetch()
        }, function(response){
            alertify.error('Error agregando invitado')
            console.log(response.data)
            $scope.invitado = {}
        })
    }
    $scope.delete_invitado = function(inv){
        Audiencias.delete.guest(inv.id).then(function(response){
            alertify.success('Exito eliminando invitado')
            $scope.invitado = {}
            $scope.reFetch()
        }, function(response){
            alertify.error('Error eliminando invitado')
            console.log(response.data)
            $scope.invitado = {}
        })
    }
    $scope.getName = function(inv){
        return inv.name + ' ' + inv.first_lastname + ' ' + inv.second_lastname
    }
    $scope.getID = function(ele){
        return ele.identifier_type + ': ' + ele.identifier
    }
    Conciliacion.get.constant('identifier_type').then(function(response){
        $scope.idType = response.data.constants
    })
    Conciliacion.get.constant('gender').then(function(response){
        $scope.gender = response.data.constants
    })
}]);
