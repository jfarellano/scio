angular.module('app')
.factory('User', ['$http', 'base64', 'URL', function UserFactory($http, base64, URL) {
  return {
    create: function(account){
      var data = angular.copy(account);
      data.role = "user";
      data.password = base64.encodex(data.password, 7);
      data.password_confirmation = base64.encodex(data.password_confirmation, 7);
      return $http({method: 'POST', url: URL.LINK + '/users', data: data });
    },
    restore: function (user) {
      return $http({method: 'POST', url: URL.LINK + '/password_resets', data: {email: user.email}});
    },
    restorePass: function (token, recover) {
      var data = angular.copy(recover);
      data.password = base64.encodex(data.password, 7);
      data.password_confirmation = base64.encodex(data.password_confirmation, 7);
      return $http({method: 'PUT', url: URL.LINK + '/password_resets/' + token, data: data});
    },
    index: function(token, target, state){
      return $http({method: 'GET', url: URL.LINK + '/users?target=' + target + '&state=' + state,
                    headers: { 'token': token }});
    },
    search: function(token, query, target){
      params = {query: query};
      return $http({method: 'GET', url: URL.LINK +  '/users?target=' + target,
                    params: params, headers: { 'token': token }});
    },
    update: function(token, user){
      return $http({method: 'PUT', url: URL.LINK + '/user', data: user, headers: { 'token': token }});
    },
    updatePassword: function (token, user) {
      var data = angular.copy(user);
      data.password = base64.encodex(data.password, 7);
      data.password_confirmation = base64.encodex(data.password_confirmation, 7);
      data.current_password = base64.encodex(data.current_password, 7);
      return $http({method: 'PUT', url: URL.LINK + '/user/update_password', data: data, headers: { 'token': token }})
    },
    updatePrivate: function (token, user) {
      var data = angular.copy(user);
      data.current_password = base64.encodex(data.current_password, 7);
      return $http({method: 'PUT', url: URL.LINK + '/user/update_private', data: data, headers: { 'token': token }})
    },
    updateEmail: function (token, user) {
      var data = angular.copy(user);
      data.email_new = data.email;
      data.current_password = base64.encodex(data.current_password, 7);
      return $http({method: 'PUT', url: URL.LINK + '/user/update_email', data: data, headers: { 'token': token }})
    },
    show: function(token){
      return $http({method: 'GET', url: URL.LINK + '/user', headers: { 'token': token }});
    },
    createPqr: function(token, pqr) {
      return $http({method: 'POST', url: URL.LINK + '/pqrs', data: pqr, headers: { 'token': token }});
    },
    createAdmin: function(token, admin, permissions){
      return $http({method: 'POST', url: URL.LINK + '/user/create_admin', data: {user: admin, permissions: permissions},
                    headers: { 'token': token }});
    },
    deleteAdmin: function(token, admin){
      return $http({method: 'DELETE', url: URL.LINK + '/users/' + admin.id, headers: { 'token': token }})
    },
    deleteUser: function(token, user){
      return $http({method: 'DELETE', url: URL.LINK + '/users/' + user.id, headers: { 'token': token, 'delete': 'user' }})
    },
    activate: function(token, seller){
      return $http({method: 'PUT', url: URL.LINK + '/users/' + seller.id + '/activate', headers: { 'token': token }})
    },
    desactivate: function(token, seller){
      return $http({method: 'PUT', url: URL.LINK + '/users/' + seller.id + '/desactivate', headers: { 'token': token }})
    }
  }
}]);
