angular.module('app')
.factory('Annexes', ['$http', 'URL', 'Upload', function AnnexesFactory($http, URL, Upload) {
  return {
    createContact: function(contact){
      return $http({method: 'POST', url: URL.LINK + '/contacts', data: contact });
    },
    errorMessage: function(errors){
      var message = "";
      var aux = "";
      for (var i = 0; i < errors.length; i++) {
        aux = (i + 1) + ") " + errors[i] + "<br/>";
        message = message + aux;
      }
      return message;
    },
    shipping: function () {
      return $http({ method: 'GET', url: URL.LINK + '/shippings' });
    },
    updateShipping: function(token, shipping){
      return $http({method: 'PUT', url: URL.LINK + '/shippings', data: {price: shipping}, headers: { 'token': token }})
    },
    banners: function () {
      return $http({ method: 'GET', url: URL.LINK + '/banners' });
    },
    uploadBanner: function(token, file, url){
      return Upload.upload({
        url: URL.LINK +'/banners',
        data: {'banner':{'image': file, 'url': url}},
        headers: {'token': token}
      });
    },
    deleteBanner:function(token, banner){
      return $http({method: 'DELETE', url: URL.LINK + '/banners/' + banner.id, headers: { 'token': token }})
    }
  }
}]);
