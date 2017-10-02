(function () {
    'use strict';

    angular.module('app', [
        //Dev modules
        'matchMedia'//Este modulo sirve para ejecutar funciones segun el tamaño de la pantalla
        ,'ngStorage'
        ,'validation.match'
        ,'ngFileUpload'
        // Angular modules
        ,'ui.router'
        ,'ngAnimate'
        ,'ngAria'
        // ,'ngMessages'

        // 3rd Party Modules
        ,'oc.lazyLoad'
        ,'ngMaterial'
        ,'duScroll'

        ,'app.layout'
        ,'app.ui'
        ,'app.i18n'
    ]);

})();






    

