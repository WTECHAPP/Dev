frontEnd.factory("pesquisaAPI", function ($http, $cookies, $location, config, $rootScope) {
  var produtos = function(p) {
    return $http.get(config.urlAPI + 'produto/pesquisa/' + p);
  };

  return {
    produtos: produtos
  };
});
