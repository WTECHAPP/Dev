frontEnd.controller("configurarCtrl", function ($scope, $location, $routeParams, $cookies, $window, config, configurarAPI) {
  var consultaConfiguracoes = function(produto) {
    configurarAPI.configuracoes(produto).then((result) => {
      $scope.listConfiguracoes = result.data;
    }).catch((error) => {
      console.log(error);
    });
  };
  consultaConfiguracoes($routeParams.produto);

  var consultaDetalhe = function(produto) {
    configurarAPI.detalhe(produto).then((result) => {
      $scope.listDetalhe = result.data[0];
    }).catch((error) => {
      console.log(error);
    });
  };
  consultaDetalhe($routeParams.produto);

  var consultaAdicionais = function(produto) {
    configurarAPI.adicionais(produto).then((result) => {
      $scope.listAdicionais = result.data;
    }).catch((error) => {
      console.log(error);
    });
  };
  consultaAdicionais($routeParams.produto);

  $scope.adicionarCarrinho = function() {
    if ($scope.cepEhValido && $scope.skuEhValido){
      let carrinhoId = $cookies.get('24hs-carrinhoId');
      if (!carrinhoId) carrinhoId = 0;
      // let carrinhoId = 0; // SOMENTE P/ EFEITO DE TESTES!!!
      let produto = prepararProduto(carrinhoId);
      //console.log(produto);
      configurarAPI.adicionarCarrinho(produto).then((result) => {
          carrinhoId = parseInt(result.data.carrinhoId);
          $cookies.put('24hs-carrinhoId', carrinhoId);
          $cookies.put('24hs-cepEntrega', produto.cepEntrega);
          $cookies.put('24hs-codEntrega', produto.codEntrega);
          $window.location.href = '/#/carrinho/';
      }).catch((error) => {
        console.log(produto);
        console.log(error);
      });
    }
  };

  var prepararProduto = function(carrinhoId) {
    let produto = {};

    var tabela = angular.element(document.querySelector('#tabela-frete'));
    var opcao = tabela[0].querySelectorAll("td.opt-sel");

    var sPreco = opcao[0].attributes['data-preco'].value;
    var preco = parseFloat(sPreco);
    var sQtde = opcao[0].attributes['data-qtde'].value;
    var qtde = parseFloat(sQtde);
    var sEntrega = opcao[0].attributes['data-previsao'].value;
    var entrega = sEntrega.replace('"', '').substring(0,10);
    var sCodigo = opcao[0].attributes['data-codigo'].value;
    var boxLabel = opcao[0].querySelectorAll("label.ng-binding");
    var sFrete = boxLabel[0].firstChild.data.replace(".", "").replace(",", ".").replace(/[^0-9\.]+/g, "");
    var frete = parseFloat(sFrete);

    var adicionais = CalcularAdicionais();

    var valorTT = Number((preco + frete + adicionais).toFixed(2));

    var boxCep = angular.element(document.querySelector('#cepDestino'));
    var cepDestino = "" + boxCep[0].value.replace('-','');

    //-------
    produto.carrinhoId = carrinhoId;
    produto.dataEntrega = entrega;
    produto.cepEntrega = cepDestino;
    produto.codEntrega = sCodigo;
    produto.valorCupomDesconto = 0;
    produto.valorFrete = frete;
    produto.valorTotal = valorTT;
    produto.itens = [];

    var itens = {};
    itens.produtoSkuId = $scope.skuId;
    itens.quantidade = qtde;
    itens.valorTotalItem = preco;
    produto.itens.push(itens);

    produto.itens[0].adicionais = [];
    produto.itens[0].adicionais = ListarAdicionais();

    return produto;
  };

  Date.prototype.addDays = function (d) { return new Date(this.valueOf() + (24 * 60 * 60 * 1000) * d); };

  $scope.buscarSku = function(event) {
    $scope.carregando = true;
    var propriedades = buscarPropriedades();
    if (propriedades != null){
      var boxCep = angular.element(document.querySelector('#cepDestino'));
      var cepDestino = "" + boxCep[0].value.replace('-','');
      var cepCarrinhoEntrega = $cookies.get('24hs-cepEntrega');

      if ((cepCarrinhoEntrega) && (cepCarrinhoEntrega != cepDestino)){
        var msg = angular.element(document.querySelector('#msgCepAlerta'));
        msg[0].innerHTML = "O CEP informado, não pode ser diferente do que está no carrinho!<br/>Caso deseje utilizar outro CEP, será necessário criar um novo pedido.";
        $scope.carregando = false;
      }
      else {
        if (cepDestino.length > 0) {
          consultaCep(cepDestino, function(p1){
            var endereco = p1;
            if (endereco != null && !endereco.hasOwnProperty("erro")){
              $scope.cepEhValido = true;

              propriedades.cepDestino = cepDestino;
              var codCarrinhoEntrega = $cookies.get('24hs-codEntrega');
              if (codCarrinhoEntrega) propriedades.codCarrinhoEntrega = codCarrinhoEntrega;
              else propriedades.codCarrinhoEntrega = "0";
              consultaFreteSku(propriedades, function(p2){
                //PREENCHE TABELA
                //---------------
                $scope.skuEhValido = true;
                $scope.skuId = p2[0].produtoskuid;
                //TITULO!!!
                var ordEntrega = p2[0].quantidades[0].frete.sort(function(a, b) {
                  var x = parseFloat(a.PrazoEntrega) - parseFloat(b.PrazoEntrega);
                  return x == 0 ? parseFloat(b.Valor.replace('.','').replace(',','.')) - parseFloat(a.Valor.replace('.','').replace(',','.')) : x;
                });

                $scope.tituloTabFrete = [];
                for (var i = 0; i < ordEntrega.length; i++){
                  $scope.tituloTabFrete.push(diaSemana(ordEntrega[i]));
                }

                //DADOS!!!
                var ordQtde = p2[0].quantidades.sort(function(a, b) {
                  return parseFloat(a.quantidade) - parseFloat(b.quantidade);
                });

                $scope.dataTabFrete = [];
                for (var i = 0; i < ordQtde.length; i++){
                  var ordEntrega = ordQtde[i].frete.sort(function(a, b) {
                    var x = parseFloat(a.PrazoEntrega) - parseFloat(b.PrazoEntrega);
                    //return x == 0 ? b.Valor - a.Valor : x;
                    return x == 0 ? parseFloat(b.Valor.replace('.','').replace(',','.')) - parseFloat(a.Valor.replace('.','').replace(',','.')) : x;
                  });

                  $scope.dataTabFrete.push(ordQtde[i]);
                }

                $scope.carregando = false;
              });
            }
            else{
              $scope.cepEhValido = false;
              $scope.carregando = false;
            }
          });
        }
        else {
          $scope.cepEhValido = null;
        }
      }
    }
  };

  $scope.cepEhValido = null;

  $scope.skuEhValido = null;

  $scope.carregando = false;

  $scope.parseFloat = function(value) {
    return parseFloat(value);
  }

  $scope.dateOnly= function(timestamp) {
    return new Date(timestamp);
  }

  var diaSemana = function(objEntrega) {
    var d = parseInt(objEntrega.PrazoEntrega);
    var hoje = new Date();
    var novaData = hoje.addDays(d);
    var dia = novaData.getDay();
    if (dia == 0) { //DOMINGO
      novaData = novaData.addDays(1);
      dia = novaData.getDay();
    }
    else if (dia == 6) { //SABADO
      novaData = novaData.addDays(2);
      dia = novaData.getDay();
    }

    var mes = novaData.getMonth();

    var semana = new Array(6);
    semana[0] = 'Domingo';
    semana[1] = 'Segunda-Feira';
    semana[2] = 'Terça-Feira';
    semana[3] = 'Quarta-Feia';
    semana[4] = 'Quinta-Feira';
    semana[5] = 'Sexta-Feira';
    semana[6] = 'Sábado';

    var mesDesc = new Array(12);
    mesDesc[0] = 'Jan';
    mesDesc[1] = 'Fev';
    mesDesc[2] = 'Mar';
    mesDesc[3] = 'Abr';
    mesDesc[4] = 'Mai';
    mesDesc[5] = 'Jun';
    mesDesc[6] = 'Jul';
    mesDesc[7] = 'Ago';
    mesDesc[8] = 'Set';
    mesDesc[9] = 'Out';
    mesDesc[10] = 'Nov';
    mesDesc[11] = 'Dez';

    obj = {
      "codigo": objEntrega.Codigo,
      "semana": d == 1 ? "Amanhã" : semana[dia],
      "dia": novaData.getDate(),
      "mes": mesDesc[novaData.getMonth()],
      "calendario": novaData
    };
    return obj;
  }

  var consultaCep = function(cepDestino, callback){
    configurarAPI.consultaCep(cepDestino).then((result) => {
      return callback(result.data);
    }).catch((error) => {
      return callback(error);
    });
  };

  var buscarPropriedades = function(){
    var prdPropriedades = angular.element(document.querySelector('#produtoPropriedades'));
    var valido = true;
    var propriedades = [];
    for (var i=0; i<prdPropriedades.length; i++)
    {
      var grpPropriedades = prdPropriedades[i].querySelectorAll("div.col-xs-12.col-sm-12.col-md-12.itens");
      for (var j=0; j<grpPropriedades.length; j++)
      {
        var id = grpPropriedades[j].querySelectorAll("#grupoId");
        var opcao = grpPropriedades[j].querySelectorAll("div.opt-sel");
        if (id.length > 0 && opcao.length > 0) {
          var lbl = opcao[0].querySelectorAll("label.ng-binding");
          propriedades.push({"grupoId": id[0].value, "propriedade": lbl[0].innerText});
        }
        else {
          valido = false;
          break;
        }
      }
    }
    if (valido){
      return {"propriedades": propriedades};
    }
    else{
      return null;
    }
  };

  var consultaFreteSku = function(propriedades, callback) {
    configurarAPI.sku(propriedades).then((result) => {
      return callback(result.data);
    }).catch((error) => {
      return callback(error);
    });
  };

  $scope.selecionarOpcoes = function(event) {
    var opcao = event.currentTarget;
    var erro = opcao.hasAttribute('data-erro') ? opcao.attributes['data-erro'].value : "0";
    var frete = opcao.hasAttribute('data-frete') ? opcao.attributes['data-frete'].value : "0";
    if ((erro === "0") || (erro !== "0" && frete !== "0")){
      var desc = TrocarOpcao(opcao);

      //NÃO CHAMAR A FUNÇÃO NA ESCOLHA DO FRETE!!!
      var origem = opcao.offsetParent;
      if (opcao.offsetParent.id !== "tabela-frete") AtualizaDadosResumo(opcao, desc);

      AtualizaPrevisao(opcao);

      if (($scope.cepEhValido) && ($scope.skuEhValido)) CalcularItem();
    }
  };

  var TrocarOpcao = function(opcao){
    var grupo = opcao.parentNode.parentNode.parentNode;
    var opcoes = grupo.querySelectorAll("div.opt-sel");
    if (opcoes.length == 0)
    opcoes = grupo.querySelectorAll("td.opt-sel");

    for (var i=0; i<opcoes.length; i++){
      //opcoes[i].removeAttribute("class");
      opcoes[i].className = "opt";
      var ativo = opcoes[i].querySelectorAll("div.check.active");
      ativo[0].style.display = "none";
      var inativo = opcoes[i].querySelectorAll("div.check");
      inativo[0].removeAttribute("style");
    }

    opcao.className = "opt-sel";
    var ativo = opcao.querySelectorAll("div.check.active");
    ativo[0].removeAttribute("style");
    var inativo = opcao.querySelectorAll("div.check");
    inativo[0].style.display = "none";

    var desc = [];
    desc = opcao.querySelectorAll("label.ng-binding");
    if (desc.length == 0) desc = opcao.querySelectorAll("p.ng-binding");
    return desc[0].innerText;
  }

  $scope.selecionarAdicionais = function(event) {
    var opcao = event.currentTarget;
    //var desc = TrocarAdicionais(opcao);
    var desc = TrocarOpcao(opcao);
    TrocarAdicionais(opcao);

    AtualizaDadosResumo(opcao, desc);
  };

  var TrocarAdicionais = function(opcao){
    var grupo = opcao.parentNode.parentNode;
    var opcoes = grupo.parentNode.querySelectorAll("div.col-xs-12.col-sm-12.col-md-12.checagem-checked.ng-scope");

    for (var i=0; i<opcoes.length; i++){
      opcoes[i].className = "col-xs-12 col-sm-12 col-md-12 checagem ng-scope";
    }

    grupo.className = "col-xs-12 col-sm-12 col-md-12 checagem-checked ng-scope";

    //CALCULAR ITEM!!!
    if (($scope.cepEhValido) && ($scope.skuEhValido)) CalcularItem();
  }

  var AtualizaDadosResumo = function(opcao, desc){
    var grupoId = opcao.attributes['data-grupoid'].value;
    var resumo = angular.element(document.querySelector('#resumo'));
    var origem = opcao.attributes['data-origem'].value;
    var lista = [];

    if (origem == "prp") lista = resumo[0].querySelectorAll("span.conf.ng-binding");
    else if (origem == "adc") lista = resumo[0].querySelectorAll("span.adic.ng-binding");

    for (var i = 0; i < lista.length; i++){
      if (lista[i].id == grupoId) {
        lista[i].innerText = lista[i].attributes['data-grupo'].value + ': ' + desc;
      }
    }
  }

  var AtualizaPrevisao = function(opcao){
    var data = opcao.attributes['data-previsao'].value;
    data = data.replace('"','').substring(0,10);
    arr = data.split('-');

    var previsao = new Date();
    previsao.setFullYear(parseInt(arr[0]),(parseInt(arr[1])-1),parseInt(arr[2]));

    var resumo = angular.element(document.querySelector('#resumo'));
    var prevBox = resumo[0].querySelectorAll("div.atencao");
    var box = prevBox[0].querySelectorAll("span");

    var pad = "00";
    var str = "" + previsao.getDate();
    var dia = pad.substring(0, pad.length - str.length) + str;
    str = "" + (previsao.getMonth() + 1);
    var mes = pad.substring(0, pad.length - str.length) + str;
    pad = "0000";
    str = "" + previsao.getFullYear();
    var ano = pad.substring(0, pad.length - str.length) + str;
    box[0].innerText = "Previsão de entrega: " + dia + "/" + mes + "/" + ano;
  }

  var CalcularItem = function(){
    var tabela = angular.element(document.querySelector('#tabela-frete'));
    var opcao = tabela[0].querySelectorAll("td.opt-sel");

    var sPreco = opcao[0].attributes['data-preco'].value;
    var preco = parseFloat(sPreco);
    var sQtde = opcao[0].attributes['data-qtde'].value;
    var qtde = parseFloat(sQtde);
    var boxLabel = opcao[0].querySelectorAll("label.ng-binding");
    var sFrete = boxLabel[0].firstChild.data.replace(".", "").replace(",", ".").replace(/[^0-9\.]+/g, "");
    var frete = parseFloat(sFrete);

    var adicionais = CalcularAdicionais();

    var valorTT = Number((preco + frete + adicionais).toFixed(2));
    var valorUN = Number((valorTT / qtde).toFixed(2));

    var resumo = angular.element(document.querySelector('#resumo'));
    var boxTT = resumo[0].querySelectorAll("h4");
    boxTT[0].firstChild.data = "R$ " + formatReal(parseInt(valorTT * 100));
    var boxUN = boxTT[0].querySelectorAll("span");
    boxUN[0].firstChild.data = "(R$ " + formatReal(parseInt(valorUN * 100)) + " / un)";
  }

  var CalcularAdicionais = function(){
    var adicionais = parseFloat(0);
    var boxAdicionais = angular.element(document.querySelector('#adicionais'));
    var opcoes = boxAdicionais[0].querySelectorAll("div.col-xs-12.col-sm-12.col-md-12.checagem-checked.ng-scope");
    for (var i = 0; i < opcoes.length; i++){
      var checados = opcoes[i].querySelectorAll("p.gratis");
      var sValor = checados[0].firstChild.data.replace(".", "").replace(",", ".").replace(/[^0-9\.]+/g, "");
      if (sValor.length > 0) adicionais = adicionais + parseFloat(sValor);
      else adicionais = adicionais + parseFloat(0);
    }
    return adicionais;
  }

  var ListarAdicionais = function(){
    var listaAdicionais = [];
    var boxAdicionais = angular.element(document.querySelector('#adicionais'));
    var opcoes = boxAdicionais[0].querySelectorAll("div.col-xs-12.col-sm-12.col-md-12.checagem-checked.ng-scope");
    for (var i = 0; i < opcoes.length; i++){
      var checados = opcoes[i].querySelectorAll("div.opt-sel");
      var sAdicionalId = checados[0].attributes['data-adicionalid'].value;
      var adicionalId = parseInt(sAdicionalId);

      var precos = opcoes[i].querySelectorAll("p.gratis");
      var sValor = precos[0].firstChild.data.replace(".", "").replace(",", ".").replace(/[^0-9\.]+/g, "");
      var valor = 0;
      if (sValor.length > 0) valor = parseFloat(sValor);

      listaAdicionais.push({"adicionalId": adicionalId, "valor": valor});
    }
    return listaAdicionais;
  }

  var formatReal = function( int ){
    var tmp = int+'';
    var neg = false;
    if(tmp.indexOf("-") == 0){
      neg = true;
      tmp = tmp.replace("-","");
    }

    if(tmp.length == 1) tmp = "0"+tmp

    tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
    if( tmp.length > 6)
    tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");

    if( tmp.length > 9)
    tmp = tmp.replace(/([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g,".$1.$2,$3");

    if( tmp.length > 12)
    tmp = tmp.replace(/([0-9]{3}).([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g,".$1.$2.$3,$4");

    if(tmp.indexOf(".") == 0) tmp = tmp.replace(".","");
    if(tmp.indexOf(",") == 0) tmp = tmp.replace(",","0,");

    return (neg ? '-'+tmp : tmp);
  }
});
