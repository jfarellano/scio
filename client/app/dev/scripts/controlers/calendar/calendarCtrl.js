angular.module('app')
.controller('calendarCtrl', ['$scope', '$compile', 'uiCalendarConfig', 'Session', 'Audiencias',function($scope,$compile,uiCalendarConfig, Session, Audiencias){

    $scope.program = true

	$scope.changeView = function(view, calendar) {
    	uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
	};

    $scope.Audiencias = []
    Audiencias.get.user_audiences().then(function(response){
        var audiencias = response.data.audiences
        audiencias.forEach(function(aud){
            //console.log(aud)
            var a = {
                title: Session.getName(),
                start: new Date(aud.start),
                end: new Date(aud.end),
                allDay: false,
                editable: false,
                stick: true
            }
            $scope.Audiencias.push(a)
        })
        //console.log($scope.Audiencias)
    }, function(response){console.log(response.data)})

    $scope.uiConfig = {
            calendar:{
            height: 450,
            editable: false,
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
                right: 'today prev,next',
                today: 'Hoy'
            }
        }
    }

    $scope.events = [$scope.Audiencias]
}])
