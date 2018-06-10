frontEnd.factory("carrinhoItemAPI", function ($http, $cookies, $location, config, $rootScope) {
  var consultaItem = function(carrinhoitemid) {
    return $http.get(config.urlAPI + 'carrinhoitem/' + carrinhoitemid);
  }

  var removeItem = function(carrinhoitemid) {
    return $http.delete(config.urlAPI + 'carrinhoitem/' + carrinhoitemid);
  }

  var duplicaItem = function(carrinhoitemid) {
    return $http.get(config.urlAPI + 'carrinhoitem/duplicar/' + carrinhoitemid);
  }

  return {
    consultar: consultaItem,
    remover: removeItem,
    duplicar: duplicaItem
  };
});
