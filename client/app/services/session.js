angular.module('app')
.factory('Session', ['$http', '$localStorage', '$sessionStorage', 'IP', '$rootScope', function SessionFactory($http, $localStorage, $sessionStorage, IP, $rootScope) {
  return {
    login: function(user){
      return $http({method: 'POST', url: IP + '/sessions', data: {single: user}})
    },
    isAuth: function(){
      try{
        return $localStorage.auth.token != null;
      }catch(err){
        $localStorage.auth = {
          token: null,
          role: null
        }
        return false;
      }
    },
    signUp: function(info){
      return $http.post(IP + '/users', info)
    },
    setToken: function(token, role){
      $localStorage.auth = {
        token: token,
        role: role
      }
    },
    logout: function(){
      var token = this.getToken();
      $http({method: 'DELETE', url: IP + '/sessions/1', headers: {token: token}}).success(function(data){
      }).error(function (data) {
      });
      $localStorage.auth = {
        token: null,
        role: null
      }
      $rootScope.$broadcast('sessionDestroyed');
    },
    getToken: function(){
      return this.isAuth() ? $localStorage.auth.token : false;
    },
    getRole: function(){
      return this.isAuth() ? $localStorage.auth.role : false;
    }
  }
}]);
