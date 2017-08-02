(function() {
    'use strict';

    angular.module('app')
        .factory('appConfig', [appConfig])
        .config(['$mdThemingProvider', mdConfig])

    function appConfig() {
        var pageTransitionOpts = [
            {
                name: 'Fade up',
                "class": 'animate-fade-up'
            }, {
                name: 'Scale up',
                "class": 'ainmate-scale-up'
            }, {
                name: 'Slide in from right',
                "class": 'ainmate-slide-in-right'
            }, {
                name: 'Flip Y',
                "class": 'animate-flip-y'
            }
        ];
        var date = new Date();
        var year = date.getFullYear();
        var app = {
            brand: 'FLM',
            logo: 'agregar logo',
            user: 'Scio',
            year: 2017,
            pageTransition: pageTransitionOpts[0],          // 0, 1, 2, 3... and build your own
            layoutBoxed: false,                             // true, false
            navCollapsed: true,                            // true, false
            navBehind: true,                               // true, false
            fixedHeader: true,                              // true, false
            sidebarWidth: 'middle',                         // small, middle, large      
            theme: 'light',                                 // light, gray, dark
            colorOption: '24',                               // 11,12,13,14,15,16; 21,22,23,24,25,26; 31,32,33,34,35,36
            link: 'https://themeforest.net/item/material-design-angular-admin-app/17067522'
        };
        var color = {
            primary:    'rgba(33,150,243,.7)', // #2196F3
            success:    'rgba(102,187,106,.7)', // #66BB6A
            info:       'rgba(0,188,212,.7)', // #00BCD4
            infoAlt:    'rgba(126,87,194,.7)', // #7E57C2
            warning:    'rgba(255,202,40,.7)', // #FFCA28
            danger:     'rgba(233,75,59,.7)', // #E94B3B
            gray:       '#EF5350'
        };

        return {
            pageTransitionOpts: pageTransitionOpts,
            app: app,
            color: color
        }
    }

    function mdConfig($mdThemingProvider) {
        var cyanAlt = $mdThemingProvider.extendPalette('cyan', {
            'contrastLightColors': '500 600 700 800 900',
            'contrastStrongLightColors': '500 600 700 800 900'
        })
        var greenAlt = $mdThemingProvider.extendPalette('green', {
            'contrastLightColors': '400 500 600 700 800 900',
            'contrastStrongLightColors': '400 500 600 700 800 900'
        })        

        $mdThemingProvider
            .definePalette('cyanAlt', cyanAlt)
            .definePalette('greenAlt', greenAlt);


        $mdThemingProvider.theme('default')
            .primaryPalette('blue', {
                'default': '500'
            })
            .accentPalette('greenAlt', {
                'default': '400'
            })
            .warnPalette('red', {
                'default': '400'
            })
            .backgroundPalette('grey');
    }
})();