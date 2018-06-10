frontEnd.factory("detalheAPI", function ($http, $cookies, $location, config, $rootScope) {
  var consultaDetalhe = function(produto) {
    return $http.get(config.urlAPI + 'produto/' + produto);
  }

  var consultaClientes = function() {
    return $http.get(config.urlAPI + 'consumidor/');
  }

  var consultaDepoimentos = function() {
    return $http.get(config.urlAPI + 'consumidordepoimento/');
  }

  return {
    consultar: consultaDetalhe,
    clientes: consultaClientes,
    depoimentos: consultaDepoimentos
  };
});
