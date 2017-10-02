angular.module('app')
.controller('calendarCtrl', ['$scope', '$compile', 'uiCalendarConfig', 'Session', 'Audiencias',function($scope,$compile,uiCalendarConfig, Session, Audiencias){

    $scope.program = true

	$scope.changeView = function(view, calendar) {
    	uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
	};

    


    $scope.Audiencias = []
    Audiencias.get.user_audiences(Session.getUserID()).then(function(response){
        var audiencias = response.data.audiences
        audiencias.forEach(function(aud){
            var a = {
                title: aud.title,
                start: new Date(aud.start),
                end: new Date(aud.end),
                allDay: false, 
                editable: false
            }
            $scope.Audiencias.push(a)
        })
    }, function(response){console.log(response.data)})

    $scope.uiConfig = {
            calendar:{
            height: 450,
            editable: false,
            eventOverlap: false,
            defaultView: 'agendaWeek',
            timezone: 'local',
            allDaySlot: false,
            header: {
                left: 'Calendario de audiencias',
                center: '',
                right: 'today prev,next'
            }
        }
    }    

    $scope.events = [$scope.Audiencias]
}])