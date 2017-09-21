angular.module('app')
.controller('ConcShowCtlr', ['$scope', '$state', 'Conciliacion', '$window', 'screenSize', '$mdDialog', 'URL', function($scope, $state,Conciliacion, window, screenSize, $mdDialog, URL){

    Conciliacion.show($state.params.id).then(function (request) {
        $scope.conc = request.data.solicitude;
    },function (request) {
        $scope.conc = {}
    })

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

    // $scope.roomSchedule = []
    // Conciliacion.get.rooms().then(function(response){
    //     $scope.rooms = response.data.rooms
    //     $scope.rooms.forEach(function(room){
    //         var roomHours = {room_id: room.id, audiences: []}
    //         var availableHours = ['7:00':{'available': true}, '8:00':{'available': true}, '9:00':{'available': true}, '10:00':{'available': true}, '11:00':{'available': true}, '12:00':{'available': true}, '13:00':{'available': true}, '14:00':{'available': true},'15:00':{'available': true},'15:00':{'available': true},'16:00':{'available': true},'17:00':{'available': true},'18:00':{'available': true},'19:00':{'available': true},'20:00':{'available': true},'21:00':{'available': true},'22:00':{'available': true}]
    //         Conciliacion.get.audiences_room(room.id).then(function(response){
    //             var audiences = response.data.audiences
    //             audiences.forEach(function(aud){
    //                 availableHours[aud.hour].available = false
    //             })
    //             roomHours.audiences = availableHours
    //             $scope.roomSchedule.push(roomHours)
    //         })
    //     })
    // })

    // $scope.getRoomsSchedule = function(){
    //     $scope.roomSchedule = []
    //     Conciliacion.get.rooms().then(function(response){
    //         $scope.rooms = response.data.rooms
    //         $scope.rooms.forEach(function(room){
    //             var roomHours = {room_id: room.id, audiences: []}
    //             var availableHours = ['7:00':{'available': true}, '8:00':{'available': true}, '9:00':{'available': true}, '10:00':{'available': true}, '11:00':{'available': true}, '12:00':{'available': true}, '13:00':{'available': true}, '14:00':{'available': true},'15:00':{'available': true},'15:00':{'available': true},'16:00':{'available': true},'17:00':{'available': true},'18:00':{'available': true},'19:00':{'available': true},'20:00':{'available': true},'21:00':{'available': true},'22:00':{'available': true}]
    //             Conciliacion.get.audiences_room(room.id).then(function(response){
    //                 var audiences = response.data.audiences
    //                 audiences.forEach(function(aud){
    //                     availableHours[aud.hour].available = false
    //                 })
    //                 roomHours.audiences = availableHours
    //                 $scope.roomSchedule.push(roomHours)
    //             })
    //         })
    //     })
    // }

    // selected = null,
    // previous = null;
    // $scope.tabs = $scope.conc.documentos;
    // $scope.selectedIndex = 0;
    // $scope.$watch('selectedIndex', function(current, old){
    //     previous = selected;
    //     selected = $scope.tabs[current];
    // });
}]);