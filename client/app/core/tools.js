angular.module('app')
.constant('URL', {
    image: '/assets/images',
    dev_folder: '/app/dev',
    dev: {
        template: '/app/dev/templates',
        forms: '/app/dev/templates'
    }
})
.constant('IP', 'http://ec2-13-59-205-73.us-east-2.compute.amazonaws.com:3000')