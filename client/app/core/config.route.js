
angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider',

        function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
            $urlRouterProvider
                .otherwise('/app/dashboard');

            $stateProvider
                // Overall
                .state('app', {
                    url: '/app',
                    templateUrl: "app/app.html"
                })
                .state('app2', {
                    url: '/app2',
                    templateUrl: "app/app2.html" // No app-sidebar, the rest is the same with app.html
                })

                // Home
                .state('app.dashboard', {
                    url: '/dashboard',
                    templateUrl: "app/dashboard/dashboard.html"
                })

                // UI
                .state('app.ui-buttons', {
                    url: '/ui/buttons',
                    templateUrl: 'app/ui/buttons.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'fontawesome' // for social icons
                            ]);
                        }]
                    }
                })
                .state('app.ui-typography', {
                    url: '/ui/typography',
                    templateUrl: 'app/ui/typography.html'
                })
                .state('app.ui-icons', {
                    url: '/ui/icons',
                    templateUrl: 'app/ui/icons.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'fontawesome',
                                "weather-icons"
                            ]);
                        }]
                    }
                })
                .state('app.ui-lists', {
                    url: '/ui/lists',
                    templateUrl: 'app/ui/lists.html'
                })
                .state('app.ui-components', {
                    url: '/ui/components',
                    templateUrl: 'app/ui/components.html'
                })
                .state('app.ui-boxes', {
                    url: '/ui/boxes',
                    templateUrl: 'app/ui/boxes.html'
                })
                .state('app.ui-icon-boxes', {
                    url: '/ui/icon-boxes',
                    templateUrl: 'app/ui/icon-boxes.html'
                })
                .state('app.ui-hover', {
                    url: '/ui/hover',
                    templateUrl: 'app/ui/hover.html'
                })
                .state('app.ui-cards', {
                    url: '/ui/cards',
                    templateUrl: 'app/ui/cards.html'
                })
                .state('app.ui-sash', {
                    url: '/ui/sash',
                    templateUrl: 'app/ui/sash.html'
                })
                .state('app.ui-testimonials', {
                    url: '/ui/testimonials',
                    templateUrl: 'app/ui/testimonials.html'
                })
                .state('app.ui-pricing-tables', {
                    url: '/ui/pricing-tables',
                    templateUrl: 'app/ui/pricing-tables.html'
                })
                .state('app.ui-call-to-actions', {
                    url: '/ui/call-to-actions',
                    templateUrl: 'app/ui/call-to-actions.html'
                })
                .state('app.ui-feature-callouts', {
                    url: '/ui/feature-callouts',
                    templateUrl: 'app/ui/feature-callouts.html'
                })
               .state('app.ui-timeline', {
                    url: '/ui/timeline',
                    templateUrl: 'app/ui/timeline.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'fontawesome' // for icons
                            ]);
                        }]
                    }
                })
                .state('app.ui-maps', {
                    url: '/ui/maps',
                    templateUrl: 'app/ui/maps.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'googlemap',
                            ]);
                        }]
                    }

                })
                .state('app.ui-grids', {
                    url: '/ui/grids',
                    templateUrl: 'app/ui/grids.html'
                })
                .state('app.ui-color', {
                    url: '/ui/color',
                    templateUrl: 'app/ui/color.html'
                })

                // Tables
                .state('app.table-static', {
                    url: '/table/static',
                    templateUrl: 'app/table/static.html'
                })
                .state('app.table-responsive', {
                    url: '/table/responsive',
                    templateUrl: 'app/table/responsive.html'
                })
                .state('app.table-data', {
                    url: '/table/data',
                    templateUrl: 'app/table/data.html'
                })

                // Form
                .state('app.form-elements', {
                    url: '/form/element/elements',
                    templateUrl: 'app/form/element/elements.html'
                })
                .state('app.form-autocomplete', {
                    url: '/form/element/autocomplete',
                    templateUrl: 'app/form/element/autocomplete.html'
                })
                .state('app.form-checkbox', {
                    url: '/form/element/checkbox',
                    templateUrl: 'app/form/element/checkbox.html'
                })
                .state('app.form-chips', {
                    url: '/form/element/chips',
                    templateUrl: 'app/form/element/chips.html'
                })
                .state('app.form-datepicker', {
                    url: '/form/element/datepicker',
                    templateUrl: 'app/form/element/datepicker.html'
                })
                .state('app.form-input', {
                    url: '/form/element/input',
                    templateUrl: 'app/form/element/input.html'
                })
                .state('app.form-radio-button', {
                    url: '/form/element/radio-button',
                    templateUrl: 'app/form/element/radio-button.html'
                })
                .state('app.form-select', {
                    url: '/form/element/select',
                    templateUrl: 'app/form/element/select.html'
                })
                .state('app.form-slider', {
                    url: '/form/element/slider',
                    templateUrl: 'app/form/element/slider.html'
                })
                .state('app.form-switch', {
                    url: '/form/element/switch',
                    templateUrl: 'app/form/element/switch.html'
                })

                .state('app.form-validation', {
                    url: '/form/validation',
                    templateUrl: 'app/form/validation.html'
                })
                .state('app.form-wizard', {
                    url: '/form/wizard',
                    templateUrl: 'app/form/wizard.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'angular-wizard'
                            ]);
                        }]
                    }
                })
                .state('app.form-editor', {
                    url: '/form/editor',
                    templateUrl: 'app/form/editor.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'fontawesome',
                                'textAngular'
                            ]);
                        }]
                    }
                })
                .state('app.form-layouts', {
                    url: '/form/layouts',
                    templateUrl: 'app/form/layouts.html'
                })


                // charts
                .state('app.chart-line', {
                    url: '/chart/line',
                    templateUrl: 'app/chart/line.html'
                })
                .state('app.chart-bar', {
                    url: '/chart/bar',
                    templateUrl: 'app/chart/bar.html'
                })
                .state('app.chart-pie', {
                    url: '/chart/pie',
                    templateUrl: 'app/chart/pie.html'
                })
                .state('app.chart-scatter', {
                    url: '/chart/scatter',
                    templateUrl: 'app/chart/scatter.html'
                })
                .state('app.chart-radar', {
                    url: '/chart/radar',
                    templateUrl: 'app/chart/radar.html'
                })
                .state('app.chart-funnel', {
                    url: '/chart/funnel',
                    templateUrl: 'app/chart/funnel.html'
                })
                .state('app.chart-gauge', {
                    url: '/chart/gauge',
                    templateUrl: 'app/chart/gauge.html'
                })
                .state('app.chart-more', {
                    url: '/chart/more',
                    templateUrl: 'app/chart/more.html'
                })


                // Page
                .state('app.page-profile', {
                    url: '/page/profile',
                    templateUrl: 'app/page/profile.html'
                })
                .state('app.page-faqs', {
                    url: '/page/faqs',
                    templateUrl: 'app/page/faqs.html'
                })
                .state('app.page-blog', {
                    url: '/page/blog',
                    templateUrl: 'app/page/blog.html'
                })
                .state('app.page-gallery', {
                    url: '/page/gallery',
                    templateUrl: 'app/page/gallery.html'
                })
                .state('app.page-portfolio', {
                    url: '/page/portfolio',
                    templateUrl: 'app/page/portfolio.html'
                })
                .state('app.page-about', {
                    url: '/page/about',
                    templateUrl: 'app/page/about.html'
                })
                .state('app.page-team', {
                    url: '/page/team',
                    templateUrl: 'app/page/team.html'
                })
                .state('app.page-services', {
                    url: '/page/services',
                    templateUrl: 'app/page/services.html'
                })
                .state('app.page-contact', {
                    url: '/page/contact',
                    templateUrl: 'app/page/contact.html'
                })
                .state('app.page-careers', {
                    url: '/page/careers',
                    templateUrl: 'app/page/careers.html'
                })
                .state('app.page-privacy', {
                    url: '/page/privacy',
                    templateUrl: 'app/page/privacy.html'
                })
                .state('app.page-terms', {
                    url: '/page/terms',
                    templateUrl: 'app/page/terms.html'
                })

                // Page Layout
                .state('app.page-layout-blank-full', {
                    url: '/pglayout/blank-full',
                    templateUrl: 'app/page-layout/blank-full.html'
                })
                .state('app.page-layout-blank-centered', {
                    url: '/pglayout/blank-centered',
                    templateUrl: 'app/page-layout/blank-centered.html'
                })
                .state('app.page-layout-blank-tabs', {
                    url: '/pglayout/blank-with-tabs',
                    templateUrl: 'app/page-layout/blank-with-tabs.html'
                })

                .state('blank', {
                    url: '/blank',
                    templateUrl: 'app/page-layout/blank.html'
                })

                .state('app2.page-layout-blank-full', {
                    url: '/pglayout/blank-full',
                    templateUrl: 'app/page-layout/blank-full.html'
                })
                .state('app2.page-layout-blank-centered', {
                    url: '/pglayout/blank-centered',
                    templateUrl: 'app/page-layout/blank-centered.html'
                })

                

                


                // eCommerce
                .state('app.ecommerce-products', {
                    url: '/ecommerce/products',
                    templateUrl: 'app/ecommerce/products.html'
                })
                .state('app.ecommerce-horizontal-products', {
                    url: '/ecommerce/horizontal-products',
                    templateUrl: 'app/ecommerce/horizontal-products.html'
                })
                .state('app.ecommerce-invoice', {
                    url: '/ecommerce/invoice',
                    templateUrl: 'app/ecommerce/invoice.html'
                })


                // App
                .state('app.app-calendar', {
                    url: '/app/calendar',
                    templateUrl: 'app/app/calendar/calendar.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'fullcalendar'
                            ]);
                        }]
                    }
                })                
                .state('app.app-task', {
                    url: '/app/task',
                    templateUrl: 'app/app/task/task.html'
                }) 

                // Email
                .state('app.email', {
                    url: '/email',
                    templateUrl: "app/email/email.html",
                    controller: 'MailController',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'email'
                            ]);
                        }]
                    }
                })
                .state('app.email.inbox', {
                    url: '/inbox',
                    templateUrl: 'app/email/inbox.html'
                })
                .state('app.email.detail', {
                    url: '/{id:[0-9]{1,4}}',
                    templateUrl: 'app/email/detail.html'
                })
                .state('app.email.compose', {
                    url: '/compose',
                    templateUrl: 'app/email/compose.html'
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