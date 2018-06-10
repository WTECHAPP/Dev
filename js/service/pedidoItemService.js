frontEnd.factory("pedidoItemAPI", function ($http, $cookies, $location, config, $rootScope) {
  var selecionaItem = function(itemskuid) {
    var token = $cookies.get('24hs-token');
    return $http.get(config.urlAPIEscrita + 'pedidoitem/' + itemskuid, {
      headers: {'token': token}
    });
  }

  return {
    selecionar: selecionaItem
  };
});
