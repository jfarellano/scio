(function () {
    'use strict';

    angular.module('app.email')
        .factory('EmailService', ['$q', '$http', '$log', EmailService]);

    function EmailService ($q, $http, $log) {
        function getEmails() {
            var deferred = $q.defer();
            $http.get('data/email/inbox.json')
                .success(function(data) {
                    deferred.resolve(data)
                    $log.info('Email data loaded')
                }).error(function(msg, status) {
                    deferred.reject(status)
                    $log.error(msg, status)
                });
            return deferred.promise;
        }

        return {
            getEmails: getEmails
        }
    }
})(); 