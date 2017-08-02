(function () {
    'use strict';

    angular.module('app.form')
        .controller('InputCtrl', ['$scope', InputCtrl])
        .config(['$mdThemingProvider', inputDarkTheme])

        .controller('AutocompleteCtrl', ['$scope', '$timeout', '$q', '$log', AutocompleteCtrl])
        .controller('CheckboxCtrl', ['$scope', CheckboxCtrl])
        .controller('CheckboxCtrl2', ['$scope', CheckboxCtrl2])
        .controller('ChipsCtrl', ['$scope', ChipsCtrl])
        .controller('DatepickerCtrl', ['$scope', DatepickerCtrl])
        .controller('RadioCtrl', ['$scope', RadioCtrl])
        .controller('SelectCtrl', ['$scope', '$element', SelectCtrl])
        .controller('SliderCtrl', ['$scope', SliderCtrl])
        .controller('SwitchCtrl', ['$scope', SwitchCtrl])


    function InputCtrl ($scope) {
        $scope.user = {
            title: 'Developer',
            email: 'ipsum@lorem.com',
            firstName: '',
            lastName: '',
            company: 'Google',
            address: '1600 Amphitheatre Pkwy',
            city: 'Mountain View',
            state: 'CA',
            biography: 'Loves kittens, snowboarding, and can type at 130 WPM.\n\nAnd rumor has it she bouldered up Castle Craig!',
            postalCode: '94043'
        };
        $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
            'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
            'WY').split(' ').map(function(state) {
                return {abbrev: state};
            })
    }
    function inputDarkTheme ($mdThemingProvider) {
        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('blue')
            .dark();
    }


    function AutocompleteCtrl ($scope, $timeout, $q, $log) {
        var self = this;

        self.simulateQuery = false;
        self.isDisabled    = false;
        // list of `state` value/display objects
        self.states        = loadAll();
        self.querySearch   = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange   = searchTextChange;
        self.newState = newState;
        function newState(state) {
            alert("Sorry! You'll need to create a Constituion for " + state + " first!");
        }
        // ******************************
        // Internal methods
        // ******************************
        /**
         * Search for states... use $timeout to simulate
         * remote dataservice call.
         */
        function querySearch (query) {
            var results = query ? self.states.filter( createFilterFor(query) ) : self.states,
                    deferred;
            if (self.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }
        function searchTextChange(text) {
            $log.info('Text changed to ' + text);
        }
        function selectedItemChange(item) {
            $log.info('Item changed to ' + JSON.stringify(item));
        }
        /**
         * Build `states` list of key/value pairs
         */
        function loadAll() {
            var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
                            Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
                            Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
                            Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
                            North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
                            South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
                            Wisconsin, Wyoming';
            return allStates.split(/, +/g).map( function (state) {
                return {
                    value: state.toLowerCase(),
                    display: state
                };
            });
        }
        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(state) {
                return (state.value.indexOf(lowercaseQuery) === 0);
            };
        }
    }

    function CheckboxCtrl ($scope) {
        $scope.checkbox = {};
        $scope.checkbox.cb1 = true;
        $scope.checkbox.cb2 = false;
        $scope.checkbox.cb3 = false;
        $scope.checkbox.cb4 = false;
        $scope.checkbox.cb5 = false;        
        $scope.checkbox.cb6 = true;        
        $scope.checkbox.cb7 = true;        
        $scope.checkbox.cb8 = true;    
        $scope.items = [1,2,3,4,5];
        $scope.selected = [];
        $scope.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) list.splice(idx, 1);
            else list.push(item);
        };
        $scope.exists = function (item, list) {
            return list.indexOf(item) > -1;
        };        
    }
    function CheckboxCtrl2 ($scope) {
        $scope.items = [1,2,3,4,5];
        $scope.selected = [1];
        $scope.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(item);
            }
        };
        $scope.exists = function (item, list) {
            return list.indexOf(item) > -1;
        };
        $scope.isIndeterminate = function() {
            return ($scope.selected.length !== 0 &&
                    $scope.selected.length !== $scope.items.length);
        };
        $scope.isChecked = function() {
            return $scope.selected.length === $scope.items.length;
        };
        $scope.toggleAll = function() {
            if ($scope.selected.length === $scope.items.length) {
                $scope.selected = [];
            } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
                $scope.selected = $scope.items.slice(0);
            }
        };
    }

    function ChipsCtrl ($scope) {
        var self = this;

        self.readonly = false;

        // Lists of fruit names and Vegetable objects
        self.fruitNames = ['Apple', 'Banana', 'Orange'];
        self.roFruitNames = angular.copy(self.fruitNames);
        self.editableFruitNames = angular.copy(self.fruitNames);

        self.tags = [];
        self.vegObjs = [
            {
                'name' : 'Broccoli',
                'type' : 'Brassica'
            },
            {
                'name' : 'Cabbage',
                'type' : 'Brassica'
            },
            {
                'name' : 'Carrot',
                'type' : 'Umbelliferous'
            }
        ];

        self.newVeg = function(chip) {
            return {
                name: chip,
                type: 'unknown'
            };
        };
    }

    function DatepickerCtrl ($scope) {
        $scope.myDate = new Date();

        $scope.minDate = new Date(
                $scope.myDate.getFullYear(),
                $scope.myDate.getMonth() - 2,
                $scope.myDate.getDate());

        $scope.maxDate = new Date(
                $scope.myDate.getFullYear(),
                $scope.myDate.getMonth() + 2,
                $scope.myDate.getDate());
        
        $scope.onlyWeekendsPredicate = function(date) {
            var day = date.getDay();
            return day === 0 || day === 6;
        }       
    }

    function RadioCtrl ($scope) {
        $scope.radio = {
            group1 : 'Banana',
            group2 : '2',
            group3 : 'Primary'
        };
        $scope.radioData = [
            { label: 'Radio: disabled', value: '1', isDisabled: true },
            { label: 'Radio: disabled, Checked', value: '2', isDisabled: true }
        ];
        $scope.contacts = [{
            'id': 1,
            'fullName': 'Maria Guadalupe',
            'lastName': 'Guadalupe',
            'title': "CEO, Found"
        }, {
            'id': 2,
            'fullName': 'Gabriel García Marquéz',
            'lastName': 'Marquéz',
            'title': "VP Sales & Marketing"
        }, {
            'id': 3,
            'fullName': 'Miguel de Cervantes',
            'lastName': 'Cervantes',
            'title': "Manager, Operations"
        }, {
            'id': 4,
            'fullName': 'Pacorro de Castel',
            'lastName': 'Castel',
            'title': "Security"
        }];
        $scope.selectedIndex = 2;
        $scope.selectedUser = function() {
            var index = $scope.selectedIndex - 1;
            return $scope.contacts[index].lastName;
        }            
    }

    function SelectCtrl ($scope, $element) {
        // Basic
        this.userState = '';
        this.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
            'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
            'WY').split(' ').map(function (state) { return { abbrev: state }; });

        // Option group
        $scope.toppings = [
            { category: 'meat', name: 'Pepperoni' },
            { category: 'meat', name: 'Sausage' },
            { category: 'meat', name: 'Ground Beef' },
            { category: 'meat', name: 'Bacon' },
            { category: 'veg', name: 'Mushrooms' },
            { category: 'veg', name: 'Onion' },
            { category: 'veg', name: 'Green Pepper' },
            { category: 'veg', name: 'Green Olives' }
        ];
        $scope.selectedToppings = [];
        $scope.printSelectedToppings = function printSelectedToppings() {
            var numberOfToppings = this.selectedToppings.length;
            // If there is more than one topping, we add an 'and'
            // to be gramatically correct. If there are 3+ toppings
            // we also add an oxford comma.
            if (numberOfToppings > 1) {
                var needsOxfordComma = numberOfToppings > 2;
                var lastToppingConjunction = (needsOxfordComma ? ',' : '') + ' and ';
                var lastTopping = lastToppingConjunction +
                        this.selectedToppings[this.selectedToppings.length - 1];
                return this.selectedToppings.slice(0, -1).join(', ') + lastTopping;
            }
            return this.selectedToppings.join('');
        };


        // Select header
        $scope.vegetables = ['Corn' ,'Onions' ,'Kale' ,'Arugula' ,'Peas', 'Zucchini'];
        $scope.searchTerm;
        $scope.clearSearchTerm = function() {
            $scope.searchTerm = '';
        };
        // The md-select directive eats keydown events for some quick select
        // logic. Since we have a search input here, we don't need that logic.
        $element.find('input').on('keydown', function(ev) {
            ev.stopPropagation();
        });

        // Select text
        $scope.items = [1, 2, 3, 4, 5, 6, 7];
        $scope.selectedItem;
        $scope.getSelectedText = function() {
            if ($scope.selectedItem !== undefined) {
                return "You have selected: Item " + $scope.selectedItem;
            } else {
                return "Please select an item";
            }
        };
    }

    function SliderCtrl ($scope) {
        $scope.color = {
            red: 97,
            green: 211,
            blue: 140
        };
        $scope.rating1 = 3;
        $scope.rating2 = 2;
        $scope.rating3 = 4;
        $scope.disabled1 = 0;
        $scope.disabled2 = 70;
    }

    function SwitchCtrl($scope) {
        $scope.data = {
            cb1: true,
            cb2: false,
            cb4: true,
            color1: true,
            color2: true,
            color3: true
        };
        $scope.onChange = function(cbState){
            $scope.message = "The switch is now: " + cbState;
        };
    }
})(); 