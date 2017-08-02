(function ()
{
    'use strict';

    angular.module('app.email')
        .filter('to_trusted', ['$sce', function($sce){
            return function(text) {
                return $sce.trustAsHtml(text);
            };
        }])
        .controller('MailController', ['$scope', '$document', '$timeout', '$mdDialog', '$mdMedia', '$mdSidenav', 'EmailService', MailController]);

    function MailController($scope, $document, $timeout, $mdDialog, $mdMedia, $mdSidenav, EmailService) {

        // Data
        $scope.accounts = {
            'creapond'    : 'johndoe@creapond.com',
            'withinpixels': 'johndoe@withinpixels.com'
        };
        $scope.checked = [];
        $scope.colors = ['blue-bg', 'blue-grey-bg', 'orange-bg', 'pink-bg', 'purple-bg'];
        $scope.selectedAccount = 'creapond';
        $scope.selectedMail = {};
        $scope.toggleSidenav = toggleSidenav;

        $scope.responsiveReadPane = undefined;
        $scope.activeMailPaneIndex = 0;
        $scope.dynamicHeight = false;

        $scope.scrollPos = 0;
        // $scope.scrollEl = angular.element('#content');

        var getEmails = function() {
            EmailService.getEmails()
                .then(function(inbox) {
                    $scope.inbox = inbox.data
                    $scope.selectedMail = $scope.inbox[0];
                }, function(status) {
                    console.log(status)
                })
        }
        getEmails()


        // Methods
        $scope.checkAll = checkAll;
        $scope.closeReadPane = closeReadPane;
        $scope.composeDialog = composeDialog;
        $scope.isChecked = isChecked;
        $scope.replyDialog = replyDialog;
        $scope.selectMail = selectMail;
        $scope.toggleCheck = toggleCheck;

        //////////

        // Watch screen size to activate responsive read pane
        $scope.$watch(function ()
        {
            return $mdMedia('gt-md');
        }, function (current)
        {
            $scope.responsiveReadPane = !current;
        });

        // Watch screen size to activate dynamic height on tabs
        $scope.$watch(function ()
        {
            return $mdMedia('xs');
        }, function (current)
        {
            $scope.dynamicHeight = current;
        });




        function selectMail(mail) {
            $scope.selectedMail = mail;

            $timeout(function () {
                // If responsive read pane is
                // active, navigate to it
                if ( angular.isDefined($scope.responsiveReadPane) && $scope.responsiveReadPane )
                {
                    $scope.activeMailPaneIndex = 1;
                }

                // Store the current scrollPos
                // $scope.scrollPos = $scope.scrollEl.scrollTop();

                // Scroll to the top
                // $scope.scrollEl.scrollTop(0);
            });
        }

        /**
         * Close read pane
         */
        function closeReadPane()
        {
            if ( angular.isDefined($scope.responsiveReadPane) && $scope.responsiveReadPane )
            {
                $scope.activeMailPaneIndex = 0;

                $timeout(function ()
                {
                    $scope.scrollEl.scrollTop($scope.scrollPos);
                }, 650);
            }
        }

        /**
         * Toggle checked status of the mail
         *
         * @param mail
         * @param event
         */
        function toggleCheck(mail, event)
        {
            if ( event )
            {
                event.stopPropagation();
            }

            var idx = $scope.checked.indexOf(mail);

            if ( idx > -1 )
            {
                $scope.checked.splice(idx, 1);
            }
            else
            {
                $scope.checked.push(mail);
            }
        }

        /**
         * Return checked status of the mail
         *
         * @param mail
         * @returns {boolean}
         */
        function isChecked(mail)
        {
            return $scope.checked.indexOf(mail) > -1;
        }

        /**
         * Check all
         */
        function checkAll()
        {
            if ( $scope.allChecked )
            {
                $scope.checked = [];
                $scope.allChecked = false;
            }
            else
            {
                angular.forEach($scope.inbox, function (mail)
                {
                    if ( !isChecked(mail) )
                    {
                        toggleCheck(mail);
                    }
                });

                $scope.allChecked = true;
            }
        }

        /**
         * Open compose dialog
         *
         * @param ev
         */
        function composeDialog(ev)
        {
            $mdDialog.show({
                controller         : 'ComposeDialogController',
                controllerAs       : 'vm',
                locals             : {
                    selectedMail: undefined
                },
                templateUrl        : 'app/main/apps/mail/dialogs/compose/compose-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : ev,
                clickOutsideToClose: true
            });
        }

        /**
         * Open reply dialog
         *
         * @param ev
         */
        function replyDialog(ev)
        {
            $mdDialog.show({
                controller         : 'ComposeDialogController',
                controllerAs       : 'vm',
                locals             : {
                    selectedMail: $scope.selectedMail
                },
                templateUrl        : 'app/main/apps/mail/dialogs/compose/compose-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : ev,
                clickOutsideToClose: true
            });
        }

        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }
    }
})();