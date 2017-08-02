angular.module('app')
    .controller('ConcIndexCtlr', ['$scope', function($scope){
        //Working controller
        $scope.data = [
            {
                name: 'Juan Paco Pedro',
                state: 'En progreso',
                days: 8
            },
            {
                name: 'Jesus Marin',
                state: 'Programado',
                days: 19
            },
            {
                name: 'Isabela Melendez',
                state: 'Por programar',
                days: 30
            },
            {
                name: 'Rita Geronimo',
                state: 'Por programar',
                days: 45
            },
            {
                name: 'Ramon Alzate',
                state: 'Programado',
                days: 60
            },
            {
                name: 'Juan Dias',
                state: 'Por Programar',
                days: 80
            },
        ]
    }]);