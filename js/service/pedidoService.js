frontEnd.factory("pedidoAPI", function ($http, $cookies, $location, config, $rootScope) {
  var consultaPedido = function(pedidoId) {
    var token = $cookies.get('24hs-token');
    return $http.get(config.urlAPIEscrita + 'pedido/' + pedidoId, {
      headers: {'token': token}
    });
  }

  var consultaItensPedido = function(pedidoid) {
    return $http.get(config.urlAPI + 'pedidoItem/' + pedidoid);
  }

  var consultaStatusPedido = function(pedidoid) {
    return $http.get(config.urlAPI + 'pedido/status');
  }

  return {
    consultar: consultaPedido,
    consultarItens: consultaItensPedido,
    consultaStatus: consultaStatusPedido
  };
});
