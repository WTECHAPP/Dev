frontEnd.controller("pedidoCtrl", function ($scope, $location, $rootScope, $cookies, $routeParams, $window, config, pedidoAPI, carrinhoAPI) {
  var consultaPedido = function(pedidoId) {
    pedidoAPI.consultar(pedidoId).then((result) => {
      $scope.pedido = result.data[0];
    }).catch((error) => {
      console.log(error);
    });
  };
  consultaPedido($routeParams.pedidoId);

  var consultaItensPedido = function(pedidoid) {
    pedidoAPI.consultarItens(pedidoid).then((result) => {
      $scope.listaItens = result.data;
    }).catch((error) => {
      console.log(error);
    });
  };
  consultaItensPedido($routeParams.pedidoid);

  var consultaStatusPedido = function() {
    pedidoAPI.consultaStatus().then((result) => {
      $scope.listaStatus = result.data;
    }).catch((error) => {
      console.log(error);
    });
  };
  consultaStatusPedido();

  var finalizarCompra = function() {
    let carrinhoId = $cookies.get('24hs-carrinhoId');
    if(!carrinhoId) carrinhoId = 0;
    carrinhoAPI.finalizar(carrinhoId).then((result) => {
      console.log(result);
      $scope.detalhe = result.data;
      $scope.valorTotal = result.data.fatura.valorTotal;
    }).catch((error) => {
      if(error.status == 401) location.href = '/#/login'
      console.log(error);
    });
  };
  finalizarCompra();

  $scope.carregarArte = function(pedidoEntregaProdutoSkuId){
    $window.location.href="/#/pedidoitem/upload/" + pedidoEntregaProdutoSkuId;
  };
});
