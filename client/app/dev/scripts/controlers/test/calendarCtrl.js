angular.module('app')
.controller('calendarCtrl', ['$scope', '$compile', 'uiCalendarConfig', function($scope,$compile,uiCalendarConfig){

    $scope.program = true

	$scope.changeView = function(view, calendar) {
    	uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
	};

    $scope.Audienias = [
		{type: 'Audiencia', title: 'Audiencia Juanchito Salas', start: new Date('2017-09-20T07:00:00.000Z'), end: new Date('2017-09-20T08:00:00.000Z'), allDay: false, editable: false},
		{type: 'Audiencia', title: 'Audiencia Eduardo Macias', start: new Date('2017-09-20T09:00:00.000Z'), end: new Date('2017-09-20T12:00:00.000Z'), allDay: false, editable: false},
		{type: 'Audiencia', title: 'Audiencia Javier Gomez', start: new Date('2017-09-22T07:00:00.000Z'), end: new Date('2017-09-22T08:00:00.000Z'), allDay: false, editable: false},
        {
            "id": 1,
            "type": "conciliacion",
            "title": "usuario",
            "start": new Date('2017-09-24 11:31:00:000'),
            "end": new Date('2017-09-24 11:59:00:000'),
            "room_name": "room1",
            allDay: false, 
            editable: false
        }
	]

    $scope.events = [$scope.Audienias]

    $scope.uiConfig = {
            calendar:{
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
                        _itsUTC: false
                    }
                    $scope.Audienias.push($scope.newEvent)
                    $scope.program = false
                }
            },
            eventDragStop: function(){
                console.log(uiCalendarConfig.calendars.calendar.fullCalendar('clientEvents'))
            },
            eventResizeStop: function(){
                console.log(uiCalendarConfig.calendars.calendar.fullCalendar('clientEvents'))
            }
        }
    }    
}])