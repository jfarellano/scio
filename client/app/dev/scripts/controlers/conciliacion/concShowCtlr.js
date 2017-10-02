angular.module('app')
.controller('ConcShowCtlr', ['$scope', '$state', 'Conciliacion', '$window', 'screenSize', '$mdDialog', 'URL', 'Session', '$compile', 'uiCalendarConfig', 'Audiencias', 'IP',function($scope, $state,Conciliacion, window, screenSize, $mdDialog, URL, Session, $compile, uiCalendarConfig, Audiencias, IP){

    console.log(Session.getRole())
    $scope.Session =  Session
    Conciliacion.show($state.params.id).then(function (request) {
        $scope.conc = request.data.solicitude;
        console.log($scope.conc)
        if($scope.conc.state == 'aceptada'){
            Session.getConciliators().then(function(response){
                $scope.conciliators = response.data.users.filter(function(con){
                    return con.role == 'conciliator'
                })
            },function(response){
                console.log(response.data)
            })
        }
        Conciliacion.get.proof($scope.conc.id).then(function(response){
            $scope.proofs = response.data.proofs
        })
    },function (request) {
        $scope.conc = {}
        console.log(request.data)
    })

    $scope.showProof = function(proof){
        window.open(IP + proof.url, '_blank');
    }

    $scope.getUserName = function(user){
        return user.name + ' ' + user.first_lastname + ' ' + user.second_lastname
    }

    $scope.reFetchConc = function(){
        Conciliacion.show($state.params.id).then(function (request) {
            $scope.conc = request.data.solicitude;
            if($scope.conc.state == 'aceptada'){
                Session.getConciliators().then(function(response){
                    $scope.conciliators = response.data.users
                },function(response){
                    console.log(response.data)
                })
            }
        },function (request) {
            $scope.conc = {}
        })
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
        Conciliacion.update.set_conciliator($scope.conc.id, conciliator.id).then(function(response){
            $scope.reFetchConc()
        }, function(response){
            console.log(response.data)
        })
    }

    $scope.getState = function(){
        return $scope.conc.state.toUpperCase().replaceAll('_', ' ')
    }
    String.prototype.replaceAll = function(str1, str2, ignore){
        return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
    } 

    $scope.showParticipant = function(part, ev){
        $scope.part = part
        console.log(part)
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

//CALENDAR
    

    Audiencias.get.user_audiences(Session.getUserID()).then(function(response){
        var audiencias = response.data.audiences
        console.log(audiencias)
        audiencias.forEach(function(aud){
            var a = {
                title: aud.title,
                start: new Date(aud.start),
                end: new Date(aud.end),
                allDay: false, 
                editable: false
            }
            $scope.audiencias.push(a)
        })
    }, function(response){console.log(response.data)})
    $scope.program = true
    $scope.uiConfig = {
        programCalendar:{
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
                console.log('Click')
                var selectDate = new Date(date.format())
                var endDate = new Date(selectDate.setHours(selectDate.getHours() + 1) + 60*60*1000)
                if($scope.program){
                    console.log('Entro')
                    $scope.newEvent = {
                        title: 'Nueva audiencia',
                        start: selectDate,
                        end: endDate,
                        allDay:false,
                        editable: true,
                        eventDurationEditable: true,
                        _itsUTC: false
                    }
                    $scope.audiencias.push($scope.newEvent)
                    console.log($scope.audiencias)
                    console.log(uiCalendarConfig.calendars.programCalendar.fullCalendar('clientEvents'))
                    $scope.program = false
                    //uiCalendarConfig.calendars.programCalendar.fullCalendar('refetchEvents')
                }
            },
            eventDragStop: function(){
                
            },
            eventResizeStop: function(){
                console.log(uiCalendarConfig.calendars.programCalendar.fullCalendar('clientEvents'))
            }
        }
    }

    Date.prototype.sendFormat = function() {
      var mm = this.getMonth() + 1; // getMonth() is zero-based
      var dd = this.getDate();
      return [(dd>9 ? '' : '0') + dd,'/',(mm>9 ? '' : '0') + mm,'/',this.getFullYear()].join('');
    };

    $scope.audiencias = []
    $scope.events = [$scope.audiencias]

    // selected = null,
    // previous = null;
    // $scope.tabs = $scope.conc.documentos;
    // $scope.selectedIndex = 0;
    // $scope.$watch('selectedIndex', function(current, old){
    //     previous = selected;
    //     selected = $scope.tabs[current];
    // });
}]);