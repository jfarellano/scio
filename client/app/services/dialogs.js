angular.module('app')
.factory('appDialog', ['$rootScope', '$mdDialog', '$mdToast', function DialogFactoty($rootScope, $mdDialog, $mdToast){
  var openDialog = false;
  return{
    hasOpenDialog: function(){
      return openDialog;
    },
    setOpenDialog: function(){
      openDialog = true;
    },
    closeCurrentDialog: function(){
      openDialog = false;
      $mdDialog.cancel();
    },
    openSignUp: function(ev){
      $mdDialog.show({
        controller: 'MaterialSignUpCtrl',
        controllerAs: 'mc',
        templateUrl: 'app/dialogs/signup-dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        onRemoving: function(){
          openDialog = false;
        }
      })
      openDialog = true;
      console.log(this.hasOpenDialog());
    },
    openSignIn: function(ev){
      $mdDialog.show({
        controller: 'MaterialLoginCtrl',
        controllerAs: 'mc',
        templateUrl: 'app/dialogs/signin-dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        onRemoving: function(){
          openDialog = false;
          console.log('asd');
        }
      })
      openDialog = true;
    },
    openPQR: function(ev){
      $mdDialog.show({
        controller: 'PQRCtrl',
        templateUrl: 'app/dialogs/pqr-dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        onRemoving: function(){
          openDialog = false;
        }
      })
      openDialog = true;
    },
    openOrder: function(ev, order){
      $mdDialog.show({
        controller: orderDialogCtrl,
        locals: {
          order: order
        },
        templateUrl: 'app/dialogs/order-dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        onRemoving: function(){
          openDialog = false;
        }
      })
      openDialog = true;

      function orderDialogCtrl($scope, appDialog, Order, Session, order){
        $scope.order = order;
        $scope.cancel = function(){
          appDialog.closeCurrentDialog();
        }

        $scope.cancelOrder = function(order) {
          appDialog.openConfirm('Confirmación', '¿Cancelar Pedido?', ev).then(function (res) {
            $('#loader-container').fadeIn('fast');
            if(res){
              Order.delete(Session.getToken(), order.id).success(function (data) {
                appDialog.closeCurrentDialog();
                appDialog.openAlert('Información', 'Pedido Cancelado Exitosamente.', ev);
                $rootScope.$broadcast('orderCanceled', order);
              });
            }
          });
        };
      }
    },
    openAdminCommission: function (ev, commission) {
      $mdDialog.show({
        controller: commissionDialogCtrl,
        locals: {
          commission: commission
        },
        templateUrl: 'app/dialogs/commission-dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        onRemoving: function(){
          openDialog = false;
        }
      })
      openDialog = true;

      function commissionDialogCtrl($scope, appDialog, Sale, Session, commission){
        $scope.commission = commission;
        $scope.cancel = function(){
          appDialog.closeCurrentDialog();
        }

        $scope.canUpdate = function(){
          return $scope.commission.state == 'pending';
        };

        $scope.updateState = function() {
          appDialog.openConfirm('Confirmación', '¿Pagar la Comision pendiente?', ev).then(function (res) {
            $('#loader-container').fadeIn('fast');
            if(res){
              Sale.pay(Session.getToken(), $scope.commission.id).success(function(data){
                $scope.commission.state = 'payed';
                $rootScope.$broadcast('commissionUpdated', $scope.commission);
              }).error(function(data){
                console.log(data);
              });
            }
          });
        };

        $scope.cancelOrder = function(order) {
          appDialog.openConfirm('Confirmación', '¿Cancelar Pedido?', ev).then(function (res) {
            $('#loader-container').fadeIn('fast');
            if(res){
              Order.delete(Session.getToken(), order.id).success(function (data) {
                appDialog.closeCurrentDialog();
                appDialog.openAlert('Información', 'Pedido Cancelado Exitosamente.', ev);
                $rootScope.$broadcast('orderCanceled', order);
              });
            }
          });
        };
      }
    },
    openAdminUser: function(ev, user, title){
      var tpml;
      if(title == "Vendedor"){
        tpml = 'app/dialogs/seller-dialog.tmpl.html';
      }else{
        tpml = 'app/dialogs/aShowUser-dialog.tmpl.html';
      }
      $mdDialog.show({
        controller: userDialogCtrl,
        locals: {
          user: user,
          title: title
        },
        templateUrl: tpml,
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        onRemoving: function(){
          openDialog = false;
        }
      })
      openDialog = true;

      function userDialogCtrl($scope, appDialog, User, Session, user, title, Annexes){
        $scope.user = user;
        $scope.user.birthday = new Date($scope.user.birthday);
        $scope.title = title;

        $scope.cancel = function(){
          appDialog.closeCurrentDialog();
        }

        $scope.changeState = function(action){
          $('#loader-container').fadeIn('fast');
          if(action == "activate"){
            User.activate(Session.getToken(), user).success(function (data) {
              user.state = "active";
              $('#loader-container').fadeOut('slow');
              appDialog.openAlert('Información', data.notice, null);
            });
          }else{
            User.desactivate(Session.getToken(), user).success(function (data) {
              user.state = "pending";
              $('#loader-container').fadeOut('slow');
              appDialog.openAlert('Información', data.notice, null);
            });
          }
        };

        $scope.deleteUser = function(){
          appDialog.openConfirm('Confirmación', '¿Eliminar Usuario?', null).then(function (res) {
            $('#loader-container').fadeIn('fast');
            if(res){
              User.deleteUser(Session.getToken(), user).success(function(data){
                $rootScope.$broadcast('userDestroyed', user);
              }).error(function(data){
                appDialog.closeCurrentDialog();
                var title   = data.errors.length > 1 ? "Errores" : "Error";
                var content = Annexes.errorMessage(data.errors);
                $('#loader-container').fadeOut('slow');
                appDialog.openAlert(title, content, $event);
              });
            }
          });
        }
      }
    },
    openSuAdmin: function(ev, admin){
      $mdDialog.show({
        controller: adminDialogCtrl,
        locals: {
          admin: admin
        },
        templateUrl: 'app/dialogs/suShowAdmin-dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        onRemoving: function(){
          openDialog = false;
        }
      })
      openDialog = true;

      function adminDialogCtrl($scope, appDialog, Session, User, admin, Annexes){
        $scope.admin = admin;
        $scope.permissions = [
          {
            module: 'Clientes',
            checked: false
          },
          {
            module: 'Vendedores',
            checked: false
          },
          {
            module: 'Ventas',
            checked: false
          },
          {
            module: 'Productos',
            checked: false
          },
          {
            module: 'PQR',
            checked: false
          },
          {
            module: 'Pedidos',
            checked: false
          }
        ];
        console.log(admin);
        angular.forEach($scope.admin.permissions, function(p, i) {
          $scope.permissions[p.code - 1].checked = true;
        });

        var original = angular.copy($scope.permissions);
        $scope.shouldShow = function(){
          return !angular.equals($scope.permissions, original);
        }

        $scope.deleteAdmin = function(){
          appDialog.openConfirm('Confirmación', '¿Eliminar Administrador?', null).then(function (res) {
            $('#loader-container').fadeIn('fast');
            if(res){
              User.deleteAdmin(Session.getToken(), admin).success(function(data){
                $rootScope.$broadcast('adminDestroyed', admin);
              }).error(function(data){
                appDialog.closeCurrentDialog();
                var title   = data.errors.length > 1 ? "Errores" : "Error";
                var content = Annexes.errorMessage(data.errors);
                $('#loader-container').fadeOut('slow');
                appDialog.openAlert(title, content, $event);
              });
            }
          });
        }

        $scope.cancel = function(){
          appDialog.closeCurrentDialog();
        }
      }
    },
    openAdminProductShow: function(ev, product, categories){
      $mdDialog.show({
        controller: productDialogCtrl,
        controllerAs: 'pc',
        locals: {
          product: product,
          categories: categories
        },
        templateUrl: 'app/dialogs/admin-product-dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        // disableParentScroll: false,
        // hasBackdrop: false,
        onRemoving: function(){
          openDialog = false;
        }
      })
      openDialog = true;

      function productDialogCtrl($scope, $timeout, appDialog, Session, Product, product, categories, Annexes){
        var pc = this;
        $scope.product = angular.copy(product);
        $scope.categories = categories;
        var original = angular.copy(product);
        $scope.form = {}
        $scope.labels = [
          {
              label: 'Sin Etiqueta'
          },
          {
              label: 'Combos'
          },
          {
              label: 'Nuevos'
          },
          {
              label: 'Ofertas'
          }
        ];

        $scope.deleteProduct = function(){
          appDialog.openConfirm('Confirmación', '¿Eliminar Producto?', null).then(function (res) {
            $('#loader-container').fadeIn('fast');
            if(res){
              Product.delete(Session.getToken(), product.id).success(function(data){
                $rootScope.$broadcast('productsChanged');
              }).error(function(data){
                appDialog.closeCurrentDialog();
                var title   = data.errors.length > 1 ? "Errores" : "Error";
                var content = Annexes.errorMessage(data.errors);
                $('#loader-container').fadeOut('slow');
                appDialog.openAlert(title, content, $event);
              });
            }
          });
        }

        $scope.cancel = function(){
          appDialog.closeCurrentDialog();
        }

        $scope.saveProduct = function(){
          if(!angular.equals(original, $scope.product) || $scope.picFile){
            appDialog.openConfirm('Confirmación', '¿Guardar Producto?', null).then(function (res) {
              $('#loader-container').fadeIn('fast');
              if(res){
                if($scope.picFile){
                    $scope.product.image = $scope.picFile;
                }else{
                  delete $scope.product['image']
                }
                if(!original.id){
                  Product.create(Session.getToken(), $scope.product).success(function(data){
                    $rootScope.$broadcast('productsChanged', data);
                  }).error(function(data){
                    appDialog.closeCurrentDialog();
                    var title   = data.errors.length > 1 ? "Errores" : "Error";
                    var content = Annexes.errorMessage(data.errors);
                    appDialog.openAlert(title, content, $event);
                  });
                }else{
                  Product.update(Session.getToken(), $scope.product).success(function(data){
                    $rootScope.$broadcast('productsChanged', data);
                  }).error(function(data){
                    appDialog.closeCurrentDialog();
                    var title   = data.errors.length > 1 ? "Errores" : "Error";
                    var content = Annexes.errorMessage(data.errors);
                    appDialog.openAlert(title, content, $event);
                  });
                }
              }
            });

          }else{
            appDialog.closeCurrentDialog();
          }

        }

        $scope.canSave = function(){
          if(appDialog.hasOpenDialog()){
            if($scope.productDetails.$valid && $scope.product.subcategories.length > 0){
              return $scope.picFile || $scope.product.image;
            }else{
                return false;
            }
          }else{
            return false;
          }

        }

        $scope.changeImage = function(){
          $timeout(function(){angular.element('#uploadProductImage').trigger('click')});
        }

        $scope.allSubcategories;
        setAllSubcategories();
        function setAllSubcategories(){
          $scope.allSubcategories = [];
          angular.forEach($scope.categories, function(value, key) {
            $scope.allSubcategories = $scope.allSubcategories.concat(value.subcategories);
          });
          $scope.allSubcategories = $scope.allSubcategories.map(function (hash) {
              hash._lowername = hash.name.toLowerCase();
              return hash;
          });
        }

        $scope.$watch('product.subcategories', function(current, old){
          if(!current){
            $scope.product.subcategories = [];
            current = [];
          }else{
            var last = current[current.length - 1];
            if (last)
              if(!last.id){
                $scope.product.subcategories.splice(current.length - 1, 1);
              }
          }
        }, true);

        $scope.selectedCat      = null;
        $scope.searchCatText    = '';
        $scope.querySearch = function(query) {
          var results = query ? $scope.allSubcategories.filter(createFilterFor(query) ) : $scope.allSubcategories;
          return results;
        }

        function createFilterFor(query) {
          var lowercaseQuery = angular.lowercase(query);

          return function filterFn(category) {
            var index = $scope.product.subcategories.length > 0 ? $scope.product.subcategories.findIndex(function(item){
              return item.id == category.id
            }) : -1;
            return (category._lowername.indexOf(lowercaseQuery) === 0) && index == -1;
          };
        }
      }
    },
    openAdminOrder: function(ev, order){
      $mdDialog.show({
        controller: orderDialogCtrl,
        controllerAs: 'oc',
        locals: {
          order: order
        },
        templateUrl: 'app/dialogs/admin-order-dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        onRemoving: function(){
          openDialog = false;
        }
      })
      openDialog = true;

      function orderDialogCtrl($scope, $filter, appDialog, Order, Session, order){
        var oc = this;
        $scope.order = order;
        $scope.filteredCommission = $filter("currency")($scope.order.total_commission, "$", 2);
        $scope.filteredState      = $filter("stateFilter")($scope.order.state);
        $scope.cancel = function(){
          appDialog.closeCurrentDialog();
        }

        var states = [
            {
              state: 'on_store'
            },
            {
              state: 'on_route'
            },
            {
              state: 'delivered'
            }
        ];

        var payTypes = [
          {
            value: "efectivo"
          },
          {
             value: "tarjeta"
          }
        ];

        var deliverTypes = [
          {
            value: "fuller"
          },
          {
            value: "contraentrega"
          }
        ];

        $scope.canUpdate = function(){
          return !angular.equals($scope.order.state, states[2].state);
        }

        $scope.canCancel = function(){
          return angular.equals($scope.order.state, states[1].state);
        }

        $scope.updateState = function(){
          deliverType = $scope.order.deliver_type;
          state = $scope.order.state;
          var u = true;
          switch (state) {
            case states[0].state:
              switch (deliverType) {
                case deliverTypes[0].value:
                  u = false;
                  break;
                case deliverTypes[1].value:
                  u = true;
                  break;
              }
              break;
            case states[1].state:
              u = false;
              break;
          }
          appDialog.openConfirm('Confirmación', '¿Cambiar Estado de Orden?', ev).then(function (res) {
            $('#loader-container').fadeIn('fast');
            if(res){
              if(u){
                Order.carry(Session.getToken(), $scope.order.id).success(function(data){
                  $scope.order.state = states[1].state;
                  $rootScope.$broadcast('orderUpdated', $scope.order);
                }).error(function(data){
                });
              }else{
                Order.deliver(Session.getToken(), order.id).success(function(data){
                  $scope.order.state = states[2].state;
                  $rootScope.$broadcast('orderUpdated', $scope.order);
                }).error(function(data){
                  console.log(data);
                });
              }
            }
          });
        }

        $scope.cancelOrder = function(order) {
          appDialog.openConfirm('Confirmación', '¿Cancelar Pedido?', ev).then(function (res) {
            $('#loader-container').fadeIn('fast');
            if(res){
              Order.delete(Session.getToken(), order.id).success(function (data) {
                appDialog.closeCurrentDialog();
                $rootScope.$broadcast('orderCanceled', order);
              });
            }
          });
        };
      }
    },
    openAdminPqr: function(ev, pqr){
      $mdDialog.show({
        controller: pqrDialogCtrl,
        controllerAs: 'pc',
        locals: {
          pqr: pqr
        },
        templateUrl: 'app/dialogs/admin-pqr-dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        onRemoving: function($scope){
          openDialog = false;
        }
      })
      openDialog = true;

      function pqrDialogCtrl($scope, Session, appDialog, Pqr, pqr){
        var pc = this;
        $scope.pqr = pqr;
        $scope.pqr.message = undefined;

        $scope.cancel = function(){
          appDialog.closeCurrentDialog();
        }

        $scope.sendResponse = function(){
          $('#loader-container').fadeIn('fast');
          Pqr.sendResponse(Session.getToken(), $scope.pqr).success(function (data) {
            $('#loader-container').fadeOut('slow');
            appDialog.closeCurrentDialog();
            appDialog.openAlert('Información', data.notice);
            $rootScope.$broadcast('pqrResolved', pqr);
          }).error(function(data){
            $('#loader-container').fadeOut('slow');
            appDialog.showError(data);
          });
        }

        $scope.canSubmit = function() {
          return appDialog.hasOpenDialog() ? $scope.pqrForm.$valid : false;
        };
      }
    },
    openAlert: function(title, content, ev){
      return $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title(title)
          .htmlContent(content)
          .ariaLabel('login-fail')
          .ok('Ok')
          .targetEvent(ev)
        );
    },
    openConfirm: function(title, content, ev){
      return $mdDialog.show(
        $mdDialog.confirm()
          .title(title)
          .textContent(content)
          .ariaLabel('Clean Cart')
          .targetEvent(ev)
          .ok('Si')
          .cancel('No')
        );
    },
    openPrompt: function(title, content, initialValue, okLabel, ev){
        return $mdDialog.show($mdDialog.prompt()
          .title(title)
          .textContent(content)
          .ariaLabel('prompt')
          .initialValue(initialValue)
          .targetEvent(ev)
          .ok(okLabel)
          .cancel('Cancel')
        );
    },
    showError: function(appDialog, data){
      appDialog.closeCurrentDialog();
      var title   = data.errors.length > 1 ? "Errores" : "Error";
      var content = Annexes.errorMessage(data.errors);
      appDialog.openAlert(title, content, $event);
    },
    showToast: function(content){
      var last = {
        bottom: false,
        top: true,
        left: false,
        right: true
      };

      var toastPosition = angular.extend({},last);

      function getToastPosition() {
        sanitizePosition();

        return Object.keys(toastPosition)
          .filter(function(pos) { return toastPosition[pos]; })
          .join(' ');
      };

      function sanitizePosition() {
        var current = toastPosition;

        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;

        last = angular.extend({},current);
      }

      var pinTo = getToastPosition();
      $mdToast.show(
        $mdToast.simple()
          .textContent(content)
          .position(pinTo)
          .hideDelay(600)
      );
    }
  }
}]);
