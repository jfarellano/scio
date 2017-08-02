(function () {
    angular.module('app.layout')
        .controller('CustomizerCtrl', ['$scope', CustomizerCtrl])

    function CustomizerCtrl ($scope) {
        $scope.app.togglerIconVal = 'radio_button_checked';

        function resetMenu() {
            $scope.app.navBehind = false;
            $scope.app.navCollapsed = false;
            $scope.app.togglerIconVal = 'radio_button_checked';
        }


        // depend on google mateial icons
        $scope.toggleCollapsedNav = function() {
            if ($scope.app.navCollapsed) {
                $scope.app.navCollapsed = false
                $scope.app.togglerIconVal = 'radio_button_checked'
            } else {
                $scope.app.navCollapsed = true
                $scope.app.togglerIconVal = 'radio_button_unchecked'
            }
        }

        $scope.$watch('app.navCollapsed', function(newVal, oldVal) {
            if ($scope.app.navCollapsed) {
                $scope.app.togglerIconVal = 'radio_button_unchecked'
            } else {
                $scope.app.togglerIconVal = 'radio_button_checked'
            }

        });

    }

})();
