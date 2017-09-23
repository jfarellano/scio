angular.module('app')
.controller('calendarCtrl', ['$scope', '$compile', 'uiCalendarConfig', function($scope,$compile,uiCalendarConfig){

	$scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        eventOverlap:false,
        defaultView: 'agendaWeek',
        header:{
          left: 'Calendario de audiencias',
          center: '',
          right: 'today prev,next'
        },
        eventClick: $scope.alertOnEventClick,
        dayClick: function(date, allDay, jsEvent, view){
	    	if($scope.program){
	    		$scope.newEvent = {
	    			title: 'Nueva audiencia',
	    			start: date,
	    			end: date,
	    			allDay:false,
	    			editable: true,
	    			eventDurationEditable: true
	    		}
	    		$scope.Audienias.push($scope.newEvent)
	    		$scope.program = false
	    	}
    	},
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };
    $scope.program = true

    $scope.alertOnResize = function(){
    	console.log('Resize')
    }

    $scope.alertOnEventClick = function(){
    	console.log('Event Click')
    }

    $scope.renderCalender = function(calendar) {
            if(calendar){
                calendar.fullCalendar('render');
            }
	};

	$scope.changeView = function(view, calendar) {
    	uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
	};

    /* Change View */
    $scope.renderCalender = function(calendar) {
        if(calendar){
            calendar.fullCalendar('render');
        }
	};
    $scope.eventRender = function() {
    	console.log('Render')
    }

    $scope.Audienias = [
		{type: 'Audiencia', title: 'Audiencia Juanchito Salas', start: new Date('2017-09-20T07:00:00.000Z'), end: new Date('2017-09-20T08:00:00.000Z'), allDay: false, editable: false},
		{type: 'Audiencia', title: 'Audiencia Eduardo Macias', start: new Date('2017-09-20T09:00:00.000Z'), end: new Date('2017-09-20T12:00:00.000Z'), allDay: false, editable: false},
		{type: 'Audiencia', title: 'Audiencia Javier Gomez', start: new Date('2017-09-22T07:00:00.000Z'), end: new Date('2017-09-22T08:00:00.000Z'), allDay: false, editable: false}
	]

    $scope.events = [$scope.Audienias]
    
    /* event source that contains custom events on the scope */
}])