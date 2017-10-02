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
                    templateUrl: URL.dev.template + '/conciliacion/index.html',
                    controller: 'ConcIndexCtlr'
                })
                .state('app.conciliacion.show',{
                    url: '/:id',
                    views:{
                        'show':{
                            templateUrl: URL.dev.template + '/conciliacion/show.html',
                            controller: 'ConcShowCtlr'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'fullcalendar'
                            ]);
                        }]
                    }
                })
                //Create
                .state('app.create', {
                    url: '/create',
                    templateUrl: URL.dev.template + '/create/conciliacion.html'
                })
                .state('app.create.conciliacion',{
                    url: '/conciliacion/:id',
                    views:{
                        'conciliacion':{
                            templateUrl: URL.dev.template + '/conciliacion/create.html',
                            resolve: {
                                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        'angular-wizard'
                                    ]);
                                }]
                            }
                        }
                    }
                })
                //Admin
                .state('app.admin', {
                    url: '/admin',
                    templateUrl: URL.dev.template + '/admin/admin.html'
                })

                .state('app.admin.rooms', {
                    url: '/salas',
                    templateUrl: URL.dev.template + '/admin/rooms.html'
                })
                .state('app.admin.users', {
                    url: '/usuarios',
                    templateUrl: URL.dev.template + '/admin/users.html'
                })
                //userAuth
                .state('registro', {
                    url: '/registro',
                    templateUrl: "app/dev/templates/userAuth/signup.html",
                    controller: 'SignupCtrl'
                })
                .state('iniciosecion', {
                    url: '/iniciosecion',
                    templateUrl: "app/dev/templates/userAuth/login.html",
                    controller: 'loginCtrl'
                })
                //Test
                .state('calendar', {
                    url: '/calendar',
                    templateUrl: URL.dev.template + '/test/calendar.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'fullcalendar'
                            ]);
                        }]
                    }
                })
        }
    ]);