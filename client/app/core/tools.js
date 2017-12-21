angular.module('app')
.constant('URL', {
    image: '/assets/images',
    dev_folder: '/app/dev',
    dev: {
        template: '/app/dev/templates',
        forms: '/app/dev/templates'
    }
});
angular.module('app')
.constant('IP', 'http://ec2-13-59-205-73.us-east-2.compute.amazonaws.com:4000');
// .constant('IP', 'http://localhost:4000');
angular.module('app')
.constant('COL', 52);