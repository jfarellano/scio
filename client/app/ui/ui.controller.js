(function () {
    'use strict';

    angular.module('app.ui')
        .controller('DemoDataCtrl', ['$scope', DemoDataCtrl])
        .controller('LoaderCtrl', ['$scope', '$rootScope', LoaderCtrl])
        .controller('MapDemoCtrl', ['$scope', '$http', '$interval', MapDemoCtrl])

    function DemoDataCtrl($scope) {
        var product_image_path = 'assets/images-demo/products/';

        $scope.products = [
            {
                name: 'Silver Watch',
                img: product_image_path + 'watch-silver.png',
                sash: 'sash-primary',
                sash_icon: 'star_rate',
                sash_text: 'Featured'
            }, {
                name: 'Black Watch',
                img: product_image_path + 'watch-black.png',
                sash: 'sash-info',
                sash_icon: 'card_giftcard',
                sash_text: 'Gift'
            }, {
                name: 'Red Watch',
                img: product_image_path + 'watch-edition-red.png',
                sash: 'sash-danger',
                sash_icon: 'flash_on',
                sash_text: 'Popular'
            }, {
                name: 'Blue Watch',
                img: product_image_path + 'watch-edition-blue.png',
                sash: '',
                sash_icon: 'info',
                sash_text: 'Featured'
            }, {
                name: 'Black Watch',
                img: product_image_path + 'watch-edition-black.png',
                sash: 'sash-danger',
                sash_icon: 'favorite',
                sash_text: 'Best Choice'
            }, {
                name: 'Sport Watch',
                img: product_image_path + 'watch-sport-blue.png',
                sash: 'sash-success',
                sash_icon: 'new_releases',
                sash_text: 'New'
            }, {
                name: 'Sport Watch',
                img: product_image_path + 'watch-sport-green.png',
                sash: 'sash-warning',
                sash_icon: 'money_off',
                sash_text: 'Free Shipping'
            }, {
                name: 'Sport Watch',
                img: product_image_path + 'watch-sport-white.png',
                sash: 'sash-white',
                sash_icon: 'star_rate',
                sash_text: 'Featured'
            }
        ]

        $scope.blogs = [
            {
                title: 'Dolor sit amet, consectetur adipisicing elit.',
                avatar: 'assets/images-demo/avatars/1.jpg',
                author: 'Jason Bourne',
                category: 'Web Design'
            }, {
                title: 'Repellat quo rerum iure dolor cumque',
                avatar: 'assets/images-demo/avatars/2.jpg',
                author: 'Bella Swan',
                category: 'Development'
            }, {
                title: 'Eligendi doloribus quam amet provident est recusandae ipsum voluptatem',
                avatar: 'assets/images-demo/avatars/3.jpg',
                author: 'Min Chan',
                category: 'Web Design'
            }, {
                title: 'Laudantium possimus quia ducimus, iusto, placeat',
                avatar: 'assets/images-demo/avatars/4.jpg',
                author: 'Sophia Doe',
                category: 'Marketing'
            }, {
                title: 'Enim eius nemo natus magnam sed dolor eveniet architecto molestiae',
                avatar: 'assets/images-demo/avatars/5.jpg',
                author: 'Luna Doe',
                category: 'Development'
            }
        ]

        $scope.testimonials = [
            {
                content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque ratione consequuntur ut placeat.',
                avatar: 'assets/images-demo/avatars/1.jpg',
                name: 'Jason Bourne',
                title: 'Senior PM'
            }, {
                content: 'Cum suscipit voluptatem modi repellat consequuntur aliquid nostrum, dolore pariatur consequatur nobis',
                avatar: 'assets/images-demo/avatars/2.jpg',
                name: 'Bella Swan',
                title: 'VP Product'                
            }, {
                content: 'Temporibus nesciunt quod magnam dicta ea, quae minima tempore eiciendis nisi ab, perferendis',
                avatar: 'assets/images-demo/avatars/3.jpg',
                name: 'Min Chan',
                title: 'Engineer Lead'                
            }
        ]

    }


    function LoaderCtrl($scope, $rootScope) {

        $scope.start = function() {
            $rootScope.$broadcast('preloader:active');
        }
        $scope.complete = function() {
            $rootScope.$broadcast('preloader:hide');
        }
    }

    function MapDemoCtrl($scope, $http, $interval) {
        var i, markers;

        markers = [];

        i = 0;

        while (i < 8) {
            markers[i] = new google.maps.Marker({
                title: "Marker: " + i
            });
            i++;
        }

        $scope.GenerateMapMarkers = function() {
            var d, lat, lng, loc, numMarkers;
            d = new Date();
            $scope.date = d.toLocaleString();
            numMarkers = Math.floor(Math.random() * 4) + 4;
            i = 0;
            while (i < numMarkers) {
                lat = 43.6600000 + (Math.random() / 100);
                lng = -79.4103000 + (Math.random() / 100);
                loc = new google.maps.LatLng(lat, lng);
                markers[i].setPosition(loc);
                markers[i].setMap($scope.map);
                i++;
            }
        };

        $interval($scope.GenerateMapMarkers, 2000);
    }
    
})(); 