frontEnd.factory("configurarAPI", function ($http, $cookies, $location, config, $rootScope) {
  var consultaConfiguracoes = function(produto) {
    return $http.get(config.urlAPI + 'configurar/' + produto);
  }

  var consultaDetalhe = function(produto) {
    return $http.get(config.urlAPI + 'produto/' + produto);
  }

  var consultaAdicionais = function(produto) {
    return $http.get(config.urlAPI + 'adicionais/' + produto);
  }

  var consultaCep = function(cep) {
    return $http.get(config.urlAPI + 'cep/' + cep);
  }

  var consultaSku = function(propriedades) {
    return $http.post(config.urlAPI + 'produtosku', propriedades);
  }

  var adicionarCarrinho = function(produto) {
    return $http.post(config.urlAPI + 'carrinho', produto);
  }

  return {
    configuracoes: consultaConfiguracoes,
    detalhe: consultaDetalhe,
    adicionais: consultaAdicionais,
    sku: consultaSku,
    consultaCep: consultaCep,
    adicionarCarrinho: adicionarCarrinho
  };
});
