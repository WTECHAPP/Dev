frontEnd.controller("finalizarCompraCtrl", function ($scope, $http, $rootScope, $cookies, $location, $routeParams, $window, config, carrinhoAPI) {

  $scope.bandeira = '';
  $scope.cep = '';

  var finalizarCompra = function() {
    let carrinhoId = $cookies.get('24hs-carrinhoId');
    if(!carrinhoId) carrinhoId = 0;
    carrinhoAPI.finalizar(carrinhoId).then((result) => {
      //console.log(result);
      $scope.cep = $cookies.get('24hs-cepEntrega');
      $scope.finalizar = result.data;
      $scope.valorTotal = result.data.fatura.valorTotal;
    }).catch((error) => {
      if(error.status == 401) location.href = '/#/login'
      console.log(error);
    });
  };
  finalizarCompra();

  $scope.selecionarEndereco = function(event) {
    $scope.carregando = true;
    var opcao = event.currentTarget;

    resetarEnderecos(opcao);

    setarEndereco(opcao);

    recalcularFrete($scope.finalizar.enderecoIdSelecionado, function(res){
      if (res.status == 200){
        $cookies.put('24hs-cepEntrega', res.data.cep);
        finalizarCompra();

        $scope.carregando = false;
      }
    });
  };

  $scope.cepEhValido = null;

  resetarEnderecos = function(opcao){
    var enderecos = opcao.parentNode.parentNode;
    var opcoes = enderecos.querySelectorAll("div.box-finalizar-compra");
    for (var i=0; i<opcoes.length; i++){
      opcoes[i].className = "box-finalizar-compra";
      var ativo = opcoes[i].querySelectorAll("div.check.active");
      if (ativo.length > 0) ativo[0].style.display = "none";
      var inativo = opcoes[i].querySelectorAll("div.check");
      if (inativo.length > 0) inativo[0].removeAttribute("style");
    }
  }

  setarEndereco = function(opcao){
    /*var ativo = opcao.querySelectorAll("div.check.active");
    ativo[0].removeAttribute("style");
    var inativo = opcao.querySelectorAll("div.check");
    inativo[0].style.display = "none";
    var box = opcao.querySelectorAll("div.box-finalizar-compra");
    box[0].className = "box-finalizar-compra selecionado";*/

    let consumidorEnderecoId = angular.element(opcao.querySelector('#hfEnderecoId'));
    $scope.finalizar.enderecoIdSelecionado = consumidorEnderecoId[0].value;
  }

  var recalcularFrete = function(enderecoId, callback){
    let carrinhoId = $cookies.get('24hs-carrinhoId');
    let codEntrega = $cookies.get('24hs-codEntrega');

    if((carrinhoId) && (codEntrega)){
      let recalc = {"carrinhoId": carrinhoId, "enderecoId": enderecoId, "codEntrega": codEntrega};

      carrinhoAPI.recalcularFrete(recalc).then((result) => {
        return callback(result);
      }).catch((error) => {
        return callback(error);
      });
    }
  }

  var consultaCep = function(cepDestino, callback){
    carrinhoAPI.consultaCep(cepDestino).then((result) => {
      return callback(result.data);
    }).catch((error) => {
      return callback(error);
    });
  };

  $scope.buscarEndereco = function(){
    var boxCep = angular.element(document.querySelector('#cepDestino'));
    var cepDestino = "" + boxCep[0].value.replace('-','');

    if (cepDestino.length == 8) {
      consultaCep(cepDestino, function(data){
        var boxLogradouro = angular.element(document.querySelector('#logradouroDestino'));
        var boxBairro = angular.element(document.querySelector('#bairroDestino'));
        var boxCidade = angular.element(document.querySelector('#cidadeDestino'));
        var boxUf = angular.element(document.querySelector('#ufDestino'));

        if (data != null && !data.hasOwnProperty("erro")){
          $scope.cepEhValido = true;

          boxLogradouro[0].value = data.logradouro;
          boxBairro[0].value = data.bairro;
          boxCidade[0].value = data.localidade;
          boxUf[0].value = data.uf;
        }
        else{
          $scope.cepEhValido = false;

          boxLogradouro[0].value = "";
          boxBairro[0].value = "";
          boxCidade[0].value = "";
          boxUf[0].value = "";
        }
      });
    }
  };

  $scope.salvarEndereco = function(){
    var boxCep = angular.element(document.querySelector('#cepDestino'));
    var boxNumero = angular.element(document.querySelector('#numeroDestino'));
    var boxComplemento = angular.element(document.querySelector('#complementoDestino'));
    var boxDestinatario = angular.element(document.querySelector('#nomeDestino'));
    var boxReferencia = angular.element(document.querySelector('#referenciaDestino'));

    var endereco = {
      "cep": "" + boxCep[0].value.replace('-',''),
      "numero": "" + boxNumero[0].value,
      "complemento": "" + boxComplemento[0].value,
      "destinatario": "" + boxDestinatario[0].value,
      "referencia": "" + boxReferencia[0].value
    };

    novoEndereco(endereco, function(status){
      if(status == 201){
        $window.location.reload();
      }
    });
  };

  var novoEndereco = function(endereco, callback){
    carrinhoAPI.salvarEndereco(endereco).then((result) => {
      return callback(result.status);
    }).catch((error) => {
      return callback(error);
    });
  };

  $scope.salvarTelefone = function(){
    var boxDDD = angular.element(document.querySelector('#ddd'));
    var boxTipo = angular.element(document.querySelector('#tipo'));
    var boxTefefone = angular.element(document.querySelector('#telefone'));

    var telefone = {
      "ddd": "" + boxDDD[0].value,
      "tipo": "" + boxTipo[0].value,
      "telefone": "" + boxTefefone[0].value
    };

    novoTelefone(telefone, function(status){
      if(status == 201){
        $window.location.reload();
      }
    });
  };

  var novoTelefone = function(telefone, callback){
    carrinhoAPI.salvarTelefone(telefone).then((result) => {
      return callback(result.status);
    }).catch((error) => {
      return callback(error);
    });
  };

  $scope.atualizarCadastro = function(){
    var boxNome = angular.element(document.querySelector('#nomeCliente'));
    var boxEmail = angular.element(document.querySelector('#emailCliente'));
    var boxRgIe = angular.element(document.querySelector('#rgIeCliente'));
    var boxNascimento = angular.element(document.querySelector('#nascimentoCliente'));
    var boxSexo = angular.element(document.querySelector('#sexoCliente'));

    var dtNasc = validarData(boxNascimento[0].value);

    if (dtNasc.length > 0) {
      var consumidor = {
        "nome": "" + boxNome[0].value,
        "email": "" + boxEmail[0].value,
        "rgIe": "" + boxRgIe[0].value,
        "dataNascimento": "" + dtNasc,
        "sexo": "" + boxSexo[0].value
      };

      atualizarDadosConsumidor(consumidor, function(res){
        if(res.status == 200){
          $window.location.reload();
        }
        console.log(res);
      });
    }
  };

  var atualizarDadosConsumidor = function(consumidor, callback){
    carrinhoAPI.atualizarConsumidor(consumidor).then((result) => {
      return callback(result);
    }).catch((error) => {
      return callback(error);
    });
  }

  var validarData = function(dtNascimento){
    var nasc = dtNascimento.split("/");
    return isNaN(Date.parse(nasc[2] + "-" + nasc[1] + "-" + nasc[0])) ? '' : nasc[2] + "-" + nasc[1] + "-" + nasc[0];
  };


  var sessaoPagSeguro = function(carrinhoid) {
    carrinhoAPI.consultaSessaoPag().then((result) => {
      PagSeguroDirectPayment.setSessionId(result.data.sessionId);
    }).catch((error) => {
      console.log(error);
    });
  };
  sessaoPagSeguro();

  $scope.bandeira = (bin) => {
    if(bin.length == 6) {
      PagSeguroDirectPayment.getBrand({
        cardBin: bin,
        success:  (res) => {
          // console.log('Success', res);
        },
        error:  (res) => {
          console.log('Error', res);
        },
        complete:  (res) => {
          $scope.bandeira = res.brand.name;
          console.log('Complete', res);
          geraParcelas();
        }
      });
    }

  }

  $scope.validaCartao = (cartao) => {

    let valid = true;
    if(cartao.numeroCartao.length < 8) {
      valid = false;
      $scope.error = 'Favor digite o número correto de seu cartão!'
    }

    if(cartao.codigoCartao.length < 3) {
      valid = false;
      $scope.error = 'Favor digite o CVV correto de seu cartão!'
    }

    if(cartao.mesCartao.length < 2) {
      valid = false;
      $scope.error = 'Favor digite o mês correto de seu cartão!'
    }

    if(cartao.anoCartao.length != 4) {
      valid = false;
      $scope.error = 'Favor digite o ano correto de seu cartão!'
    }

    if(cartao.parcelaCartao < 1) {
      valid = false;
      $scope.error = 'Favor digite o ano correto de seu cartão!'
    }
    if(valid){
      PagSeguroDirectPayment.createCardToken({
        cardNumber: cartao.numeroCartao,
        cvv: cartao.codigoCartao,
        expirationMonth: cartao.mesCartao,
        expirationYear: cartao.anoCartao,
        success:  (res) => {
          // console.log('Success', res);
        },
        error:  (res) => {
          $scope.error = 'Erro ao gerar dados do cartão!'
        },
        complete:  (res) => {
          console.log('Complete', res);
          $scope.tokenCartao = res.card.token;
          $scope.parcelaEscolhida = cartao.parcelaCartao;
          $scope.hash = PagSeguroDirectPayment.getSenderHash();

          let checkout = {};

          checkout.checkout = $scope.finalizar;
          checkout.tokenCartao = $scope.tokenCartao;
          checkout.parcela = $scope.parcelaEscolhida;
          checkout.valorParcela = $scope.parcelas.filter(x => x.quantity == $scope.parcelaEscolhida)[0].installmentAmount;
          checkout.hash = $scope.hash;

          $rootScope.dados = checkout;

          carrinhoAPI.efetuaPagamento(checkout).then((res) => {
            if(res.status == 200) {
              let carr = {};
              carr.carrinhoId = $scope.finalizar.fatura.carrinhoId;
              carr.consumidorId = $scope.finalizar.consumidor[0].consumidorId;
              carr.consumidorEnderecoId = $scope.finalizar.enderecoIdSelecionado;

              carrinhoAPI.gerarPedido(carr).then((res) => {
                if(res.status == 200) {
                  let pedidoId = res.data[0][0].pedidoId;

                  $cookies.remove('24hs-carrinhoId');
                  $cookies.remove('24hs-cepEntrega');
                  $cookies.remove('24hs-codEntrega');

                  //REMOVER CARRINHO DO BD!!!

                  location.href = '/#/pedido/' + pedidoId;
                }
              }).catch((error) => {
                console.log(error);
              });
            }
          }).catch((error) => {
            console.log(error);
          });



        }
      });
    }
  };

  let geraParcelas = () => {
    PagSeguroDirectPayment.getInstallments({
      amount: $scope.valorTotal,
      brand: $scope.bandeira,
      maxInstallmentNoInterest: 12,
      success:  (res) => {
        //  console.log('Success', res);
      },
      error:  (res) => {
        console.log('Success', res);
      },
      complete:  (res) => {
        // console.log('Complete', res);
        $scope.parcelas = res.installments[$scope.bandeira];
      }
    });
  };



});
