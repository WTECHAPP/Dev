frontEnd.factory("carrinhoAPI", function ($http, $cookies, $location, config, $rootScope) {
  var consultaCarrinho = function(carrinhoid) {
    return $http.get(config.urlAPI + 'carrinho/' + carrinhoid);
  }

  var finalizarCompra = function(carrinhoid) {
    return $http.get(config.urlAPI + 'carrinho/finalizar/' + carrinhoid);
  }

  var efetuaPagamento = function(checkout) {
    return $http.post(config.urlAPI + 'pagamento/checkout/', checkout);
  }

  var parcelarCompra = function(carrinhoid) {
    return $http.get(config.urlAPI + 'carrinho/parcelas/' + carrinhoid);
  }

  var consultaCep = function(cep) {
    return $http.get(config.urlAPI + 'cep/' + cep);
  }

  var salvarEndereco = function(end){
    var token = $cookies.get('24hs-token');
    return $http.post(config.urlAPIEscrita + 'consumidorEndereco/', end, {
      headers: {'token': token}
    });
  }

  var salvarTelefone = function(tel){
    var token = $cookies.get('24hs-token');
    return $http.post(config.urlAPIEscrita + 'consumidorTelefone/', tel, {
      headers: {'token': token}
    });
  }

  var consultarEnderecos = function(consumidorid) {
    return $http.get(config.urlAPI + 'consumidorEndereco/endPorConsumidor/' + consumidorid);
  }

  var atualizarDadosConsumidor = function(cons) {
    var token = $cookies.get('24hs-token');
    return $http.put(config.urlAPIEscrita + 'consumidor', cons, {
      headers: {'token': token}
    });
  }

  var consultaSessaoPag = function() {
    return $http.get(config.urlAPI + 'pagamento/sessao');
  }

  var gerarPedido = function(carr) {
    return $http.post(config.urlAPIEscrita + 'carrinho/gerar-pedido/', carr);
  }

  var recalcularFrete = function(obj){
    var token = $cookies.get('24hs-token');
    return $http.post(config.urlAPIEscrita + 'carrinho/recalcularFrete', obj, {
      headers: {'token': token}
    });
  }

  return {
    consultar: consultaCarrinho,
    finalizar: finalizarCompra,
    parcelar: parcelarCompra,
    consultaCep: consultaCep,
    salvarEndereco: salvarEndereco,
    consultarEnderecos: consultarEnderecos,
    atualizarConsumidor: atualizarDadosConsumidor,
    salvarTelefone: salvarTelefone,
    consultaSessaoPag: consultaSessaoPag,
    efetuaPagamento: efetuaPagamento,
    gerarPedido: gerarPedido,
    recalcularFrete: recalcularFrete
  };
});
