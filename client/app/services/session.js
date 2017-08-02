angular.module('app')
.factory('Session', ['$http', '$localStorage', 'base64', 'URL', '$rootScope', function SessionFactory($http, $localStorage, base64, URL, $rootScope) {
  return {
    login: function(user){
      var password = base64.encodex(user.password, 7);
      return $http({method: 'POST', url: URL.LINK + '/sessions', data: {email: user.email, password: password}})
    },
    isAuth: function(){
      try{
        return $localStorage.auth.token !== null;
      }catch(err){
        $localStorage.auth = {
          token: null,
          role: null,
          full_name: null,
          permissions: null
        }
        return false;
      }
    },
    setToken: function(token, role, full_name, permissions){
      $localStorage.auth = {
        token: token,
        role: role,
        full_name: full_name,
        permissions: permissions
      }
    },
    logout: function(){
      var token = this.getToken();
      $http({method: 'DELETE', url: URL.LINK + '/sessions', headers: {token: token}}).success(function(data){
      }).error(function (data) {
      });
      $localStorage.auth = {
        token: null,
        role: null,
        full_name: null
      }
      $rootScope.$broadcast('sessionDestroyed');
    },
    getToken: function(){
      return this.isAuth() ? $localStorage.auth.token : false;
    },
    getRole: function(){
      return this.isAuth() ? $localStorage.auth.role : false;
    },
    getFullname: function(){
      return this.isAuth() ? $localStorage.auth.full_name : false;
    },
    getPermissions: function(){
      return this.isAuth() ? $localStorage.auth.permissions : false;
    }
  }
}]);
