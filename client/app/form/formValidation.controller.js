(function () {
    'use strict';

    angular.module('app.form.validation')
        .controller('FormConstraintsCtrl', ['$scope', FormConstraintsCtrl])
        .controller('MaterialLoginCtrl', ['$scope', MaterialLoginCtrl])
        .controller('MaterialSignUpCtrl', ['$scope', MaterialSignUpCtrl])
        .controller('MaterialResetCtrl', ['$scope', MaterialResetCtrl])

    function FormConstraintsCtrl($scope) {
        var original;

        $scope.form = {
            required: '',
            minlength: '',
            maxlength: '',
            length_rage: '',
            type_something: '',
            confirm_type: '',
            foo: '',
            email: '',
            url: '',
            num: '',
            minVal: '',
            maxVal: '',
            valRange: '',
            pattern: ''
        };

        original = angular.copy($scope.form);
        $scope.revert = function() {
            $scope.form = angular.copy(original);
            return $scope.form_constraints.$setPristine();
        };
        $scope.canRevert = function() {
            return !angular.equals($scope.form, original) || !$scope.form_constraints.$pristine;
        };
        $scope.canSubmit = function() {
            return $scope.form_constraints.$valid && !angular.equals($scope.form, original);
        };    
        $scope.submitForm = function() {
            $scope.showInfoOnSubmit = true;
            return $scope.revert();
        };           
    }

    function MaterialLoginCtrl ($scope) {
        var original;

        $scope.user = {
            email: '',
            passowrd: ''
        }   

        original = angular.copy($scope.user);
        // https://github.com/angular/material/issues/1903
        $scope.revert = function() {
            $scope.user = angular.copy(original);
            $scope.material_login_form.$setPristine();
            $scope.material_login_form.$setUntouched();
            return;
        };
        $scope.canRevert = function() {
            return !angular.equals($scope.user, original) || !$scope.material_login_form.$pristine;
        };
        $scope.canSubmit = function() {
            return $scope.material_login_form.$valid && !angular.equals($scope.user, original);
        };    
        $scope.submitForm = function() {
            $scope.showInfoOnSubmit = true;
            $scope.revert();
        };                 
    }

    function MaterialSignUpCtrl ($scope) {
        var original;

        $scope.user = {
            name: '',
            email: '',
            passowrd: ''
        }   

        original = angular.copy($scope.user);
        $scope.revert = function() {
            $scope.user = angular.copy(original);
            $scope.material_signup_form.$setPristine();
            $scope.material_signup_form.$setUntouched();
            return;
        };
        $scope.canRevert = function() {
            return !angular.equals($scope.user, original) || !$scope.material_signup_form.$pristine;
        };
        $scope.canSubmit = function() {
            return $scope.material_signup_form.$valid && !angular.equals($scope.user, original);
        };    
        $scope.submitForm = function() {
            $scope.showInfoOnSubmit = true;
            $scope.revert();
        };           
    }

    function MaterialResetCtrl ($scope) {
        var original;

        $scope.user = {
            email: ''
        }   

        original = angular.copy($scope.user);
        $scope.revert = function() {
            $scope.user = angular.copy(original);
            $scope.material_login_form.$setPristine();
            $scope.material_login_form.$setUntouched();
            return;
        };
        $scope.canRevert = function() {
            return !angular.equals($scope.user, original) || !$scope.material_login_form.$pristine;
        };
        $scope.canSubmit = function() {
            return $scope.material_login_form.$valid && !angular.equals($scope.user, original);
        };    
        $scope.submitForm = function() {
            $scope.showInfoOnSubmit = true;
            $scope.revert();
        };                 
    }
})(); 