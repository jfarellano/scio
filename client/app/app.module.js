(function () {
    'use strict';

    angular.module('app', [
        // Angular modules
         'ui.router'
        ,'ngAnimate'
        ,'ngAria'
        ,'ngMessages'

        // 3rd Party Modules
        ,'oc.lazyLoad'
        ,'ngMaterial'
        ,'duScroll'

        ,'app.layout'
        ,'app.ui'
        ,'app.i18n'

        ,'app.chart'
        ,'app.table'
        ,'app.form'
        ,'app.form.validation'
        ,'app.page'

        // App
        ,'app.calendar'
        ,'app.task'
    ]);

})();






    

