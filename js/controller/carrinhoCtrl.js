frontEnd.controller("carrinhoCtrl", function ($scope, $cookies, $location, $route, $routeParams, $window, config, carrinhoAPI, carrinhoItemAPI) {
  var consultaCarrinho = function() {
    let carrinhoId = $cookies.get('24hs-carrinhoId');
    carrinhoAPI.consultar(carrinhoId).then((result) => {
      if (result.data.length == 0){
        $cookies.remove('24hs-carrinhoId');
        $cookies.remove('24hs-cepEntrega');
        $cookies.remove('24hs-codEntrega');
        $scope.carrinho = null;
      }
      else {
        $scope.carrinho = result.data[0];
      }
    }).catch((error) => {
      console.log(error);
    });
  };
  consultaCarrinho();

  $scope.goFinalizar = () => {
    location.href = '/#/carrinho/finalizar/';
  };

  $scope.goHome = () => {
    location.href = '/#/';
  };

  $scope.removerItem = function(carrinhoitemid){
    carrinhoItemAPI.remover(carrinhoitemid).then((result) => {
      $route.reload();
    }).catch((error) => {
      console.log(error);
    });
  };

  $scope.duplicarItem = function(carrinhoitemid){
    carrinhoItemAPI.duplicar(carrinhoitemid).then((result) => {
      $route.reload();
    }).catch((error) => {
      console.log(error);
    });
  };

});
