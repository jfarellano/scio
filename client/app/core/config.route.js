
angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', 'URL',

        function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, URL) {
            $urlRouterProvider
                .otherwise('/app/dashboard');

            $stateProvider
                // Overall
                .state('app', {
                    url: '/app',
                    templateUrl: "app/app.html"
                })
                // Home
                .state('app.dashboard', {
                    url: '/dashboard',
                    templateUrl: "app/dev/templates/dashboard/dashboard.html"
                })

                //Conciliacion
                .state('app.conciliacion',{
                    url: '/conciliacion',
                    templateUrl: URL.dev.template + '/conciliacion/conciliacion.html'
                })
                .state('app.conciliacion.index',{
                    url: '/index',
                    templateUrl: URL.dev.template + '/conciliacion/index.html'
                })
                .state('app.conciliacion.show',{
                    url: '/conciliacion/:id',
                    templateUrl: URL.dev.template + '/conciliacion/show.html'
                })
               
                // Extra
                .state('404', {
                    url: '/404',
                    templateUrl: "app/page-extra/404.html"
                })
                .state('500', {
                    url: '/500',
                    templateUrl: "app/page-extra/500.html"
                })
                .state('signin', {
                    url: '/signin',
                    templateUrl: 'app/page-extra/signin.html'
                })
                .state('signup', {
                    url: '/signup',
                    templateUrl: 'app/page-extra/signup.html'
                })
                .state('forgot-password', {
                    url: '/forgot-password',
                    templateUrl: 'app/page-extra/forgot-password.html'
                })
                .state('confirm-email', {
                    url: '/confirm-email',
                    templateUrl: 'app/page-extra/confirm-email.html'
                })
                .state('lock-screen', {
                    url: '/lock-screen',
                    templateUrl: 'app/page-extra/lock-screen.html'
                })
                .state('maintenance', {
                    url: '/maintenance',
                    templateUrl: "app/page-extra/maintenance.html"
                })
            ;
        }
    ]);