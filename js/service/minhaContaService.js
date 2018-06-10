frontEnd.factory("minhaContaAPI", function ($http, $cookies, $location, config, $rootScope) {
  var consultaConta = function() {
    var token = $cookies.get('24hs-token');
    return $http.get(config.urlAPIEscrita + 'minhaConta', {
      headers: {'token': token}
    });
  }

  var consultaPreCadastro = function(token) {
    return $http.get(config.urlAPIEscrita + 'minhaConta/pre-cadastro/' + token);
  }

  var salvarMeusDados = function(dados) {
    return $http.put(config.urlAPIEscrita + 'minhaConta/meus-dados/', dados);
  }

  var consultaCep = function(cep) {
    return $http.get(config.urlAPI + 'cep/' + cep);
  }

  var salvarEndereco = function(end){
    var token = $cookies.get('24hs-token');
    return $http.post(config.urlAPIEscrita + 'consumidorEndereco', end, {
      headers: {'token': token}
    });
  }

  var salvarTelefone = function(tel){
    var token = $cookies.get('24hs-token');
    return $http.post(config.urlAPIEscrita + 'consumidorTelefone', tel, {
      headers: {'token': token}
    });
  }

  var novaCredencial = function(cred){
    var token = $cookies.get('24hs-token');
    return $http.post(config.urlAPIEscrita + 'minhaConta/credencial', cred, {
      headers: {'token': token}
    });
  }

  return {
    consultar: consultaConta,
    consultarPreCadastro: consultaPreCadastro,
    consultaCep: consultaCep,
    salvarEndereco: salvarEndereco,
    salvarTelefone: salvarTelefone,
    salvarMeusDados: salvarMeusDados,
    novaCredencial: novaCredencial
  };
});
