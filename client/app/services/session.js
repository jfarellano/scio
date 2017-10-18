angular.module('app')
.factory('Session', ['$http', '$localStorage', '$sessionStorage', 'IP', '$rootScope', 'Upload',function SessionFactory($http, $localStorage, $sessionStorage, IP, $rootScope, Upload) {

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
          role: null,
          user_id: null,
          name: null,
          email: null
        }
        return false;
      }
    },
    signUp: function(info){
      return $http.post(IP + '/user', info)
    },
    setToken: function(token, role, user_id, name, email){
      $localStorage.auth = {
        token: token,
        role: role,
        user_id: user_id,
        name: name,
        email: email
      }
    },
    logout: function(){
      var token = this.getToken();
      $http({method: 'DELETE', url: IP + '/sessions/1', headers: {token: token}}).success(function(data){
      }).error(function (data) {
      });
      $localStorage.auth = {
        token: null,
        role: null,
        user_id: null,
        name: null,
        email: null
      }
      $rootScope.$broadcast('sessionDestroyed');
    },
    show: function(){
      return $http.get( IP + '/user', {headers: this.getHeaders()})
    },
    update: function(user){
      return $http.put(IP + '/user', user, {headers: this.getHeaders()})
    },
    updatePicture: function(usr){
      return  Upload.upload({method: 'PUT', url: IP + '/user', data: {profile_picture: usr}, headers: this.getHeaders()})
    },
    getToken: function(){
      return this.isAuth() ? $localStorage.auth.token : false;
    },
    getRole: function(){
      return this.isAuth() ? $localStorage.auth.role : false;
    },
    getUserID: function(){
      return this.isAuth() ? $localStorage.auth.user_id : false;
    },
    getName: function(){
      return this.isAuth() ? $localStorage.auth.name : false;
    },
    getEmail: function(){
      return this.isAuth() ? $localStorage.auth.email : false;
    },
    getConciliators: function(){
      return $http.get(IP + '/coordinator/users', {headers: this.getHeaders()})
    },
    getHeaders: function(){
      return {Authorization: 'Token token='+this.getToken()}
    }
  }
}]);
