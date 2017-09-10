
angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', 'URL',

        function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, URL) {
            $urlRouterProvider
                .otherwise('/iniciosecion');

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
        }
    ]);