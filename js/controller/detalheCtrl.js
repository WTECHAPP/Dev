frontEnd.controller("detalheCtrl", function ($scope, $location, $routeParams, config, detalheAPI) {
  var consultaDetalhe = function(produto) {
    detalheAPI.consultar(produto).then((result) => {
      $scope.detalhe = result.data[0];
    }).catch((error) => {
      console.log(error);
    });
  };
  consultaDetalhe($routeParams.produto);

  var consultaCliente = function(produto) {
    detalheAPI.clientes().then((result) => {
      $scope.listClientes = result.data;
    }).catch((error) => {
      console.log(error);
    });
  };
  consultaCliente($routeParams.produto);

  var consultaDepoimentos = function(produto) {
    detalheAPI.depoimentos().then((result) => {
      $scope.listDepoimentos = result.data;
    }).catch((error) => {
      console.log(error);
    });
  };
  consultaDepoimentos($routeParams.produto);
});
