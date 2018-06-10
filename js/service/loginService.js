frontEnd.factory("loginAPI", function ($http, $cookies, $location, config, $rootScope) {
  var logar = function(credencial) {
    return $http.post(config.urlAPIEscrita + 'autenticar', credencial);
  };

  var preCadastro = function(cadastro) {
    return $http.post(config.urlAPIEscrita + 'pre-cadastro', cadastro);
  };

  return {
    logar: logar,
    preCadastro: preCadastro
  };
});
