angular.module('app')
.factory('ErrorHandler',[function ErrorHandlerFactory() {
    return{
        errorDisplay: function(errors){
            for(i in errors){
                errors[i].forEach(function(info){
                    if(info != 'is invalid') alertify.error(info)
                })
            }
        }
    }
}]);
