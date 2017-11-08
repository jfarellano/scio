angular.module('app')
.controller('ResultConcCtrl', ['$scope', '$state', 'Conciliacion', '$window', 'screenSize', '$mdDialog', 'URL', 'Session', '$compile', 'Audiencias', 'IP',function($scope, $state,Conciliacion, window, screenSize, $mdDialog, URL, Session, $compile, Audiencias, IP){
    $scope.Session =  Session
    Conciliacion.show($state.params.id).then(function (request) {
        $scope.conc = request.data.solicitude;
        if($scope.conc.state != 'iniciar_audiencia'){
            window.location = '#/app/conciliacion/' + $scope.conc.id
        }
    },function (request) {
        $scope.conc = {}
        console.log(request.data)
    })

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
    		{text: 'Acta de acuerdo', value: 'acuerdo'},
    		{text: 'Acta de acuerdo parcial', value: 'acuerdo'}
    ]
    $scope.constancias = [
		{text: 'Constancia de no acuerdo', value: 'no_acuerdo'},
		{text: 'Constancia de no acuerdo por inasistencia', value: 'no_acuerdo_inasistencia'}
	]

	$scope.conclution = function(){
		if ($scope.resultType.result == 'acta') {
			return $scope.actas
		}else{
			return $scope.constancias
		}
	}

    $scope.resultType = {}

    $scope.endSolicitude = function(){
        $scope.conc.state = 'cerrada'
        if ($scope.acuerdo.ac == 'acuerdo') {
            Conciliacion.get.acuerdo($scope.conc.conciliation.id).then(function(response){
                alertify.success('Se genero exitosamente el documento de acuerdo')
            }, function(response){
                alertify.error('Hubo un error generando el documento de acuerdo')
                console.log(response.data)
            })
            $scope.results.forEach(function(res){
            	$scope.addResult(res.description)
            })
        }else if($scope.acuerdo.ac == 'no_acuerdo'){
            Conciliacion.get.no_acuerdo($scope.conc.conciliation.id).then(function(response){
                alertify.success('Se genero exitosamente el documento de no acuerdo')
            }, function(response){
                alertify.error('Hubo un error generando el documento de no acuerdo')
                console.log(response.data)
            })
        }else if($scope.acuerdo.ac == 'no_acuerdo_inasistencia'){
            Conciliacion.get.no_acuerdo_inasistencia($scope.conc.conciliation.id).then(function(response){
                alertify.success('Se genero exitosamente el documento de no acuerdo por inasistencia')
            }, function(response){
                alertify.error('Hubo un error generando el documento de no acuerdo por inasistencia')
                console.log(response.data)
            })
        }
        Conciliacion.update.conciliator_solicitude($scope.conc.id, $scope.conc).then(function(response){
            window.location = '#/app/dashboard'
        })
    }

    $scope.edit = false

    //results
    $scope.showResult = function(ev) {
        $mdDialog.show({
            //change to results
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

    $scope.results = []
    $scope.add_result = function(){
    	$scope.results.push({description: $scope.description})
        $scope.description = ''
    }

    $scope.deleteResult = function(id){
    	$scope.results.splice(id, 1)
    }
}]);