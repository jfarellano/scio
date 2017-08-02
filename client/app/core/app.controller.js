(function () {
    'use strict';

    angular.module('app')
        .controller('AppCtrl', [ '$scope', '$rootScope', '$document', 'appConfig', '$state', '$mdSidenav', '$mdComponentRegistry', AppCtrl]) // overall control
        .controller('SidenavRightCtrl', ['$scope', '$mdSidenav', SidenavRightCtrl])
    
    function AppCtrl($scope, $rootScope, $document, appConfig, $state, $mdSidenav, $mdComponentRegistry) {

        $scope.pageTransitionOpts = appConfig.pageTransitionOpts;
        $scope.app = appConfig.app;
        $scope.color = appConfig.color;

        // Checks if the given state is the current state
        $scope.is = function(name) {
            return $state.is(name);
        }

        // Checks if the given state/child states are present
        $scope.includes = function(name) {
            return $state.includes(name);
        }


        // 
        $rootScope.$on("$stateChangeSuccess", function (event, currentRoute, previousRoute) {
            $document.duScrollTo(0, 0);
        });


        // for mdSideNav right
        $scope.toggleRight = buildToggler('right');
        $scope.isOpenRight = function() {
            if ( !$mdComponentRegistry.get('right') ) return;

            return $mdSidenav('right').isOpen();
        };

        function buildToggler(navID) {
            return function() {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID).toggle();
            }
        }
    }


    function SidenavRightCtrl ($scope, $mdSidenav) {
        $scope.close = function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav('right').close()
        };
    }

})(); 