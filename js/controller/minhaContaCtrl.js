frontEnd.controller("minhaContaCtrl", function ($scope, $location, $routeParams, $cookies, $window, config, minhaContaAPI) {
  var consulta = function() {
    minhaContaAPI.consultar().then((result) => {
      $scope.preCadastro = false;
      $scope.conta = result.data[0];
      $scope.enderecoValido = ($scope.conta.enderecos.length > 0) ? true : false;
      $scope.pedidoValido = ($scope.conta.pedidos.length > 0) ? true : false;
      $scope.telefoneValido = ($scope.conta.telefones.length > 0) ? true : false;
    }).catch((error) => {
      console.log(error);
    });
  }
  consulta();

  var preCadastro = function(token) {
    if (token){
      minhaContaAPI.consultarPreCadastro(token).then((result) => {
        $scope.preCadastro = true;
        $scope.conta = result.data[0];
        $scope.enderecoValido = ($scope.conta.enderecos.length > 0) ? true : false;
        $scope.pedidoValido = ($scope.conta.pedidos.length > 0) ? true : false;
      }).catch((error) => {
        console.log(error);
      });
    }
  }
  preCadastro($routeParams.token);

  $scope.salvarMeusDados = function(reg){
    if (validarRegistro(reg)){
      minhaContaAPI.salvarMeusDados(reg).then((result) => {
        var dados = result.data;
        if(result.status == 200) {
          //APAGAR SESSION token
          if ($cookies.get('24hs-consumidorId')) $cookies.remove('24hs-consumidorId');
          $cookies.put('24hs-consumidorId', dados.consumidorId);
          $window.location.reload();
        }
      }).catch((error) => {
        console.log(error);
      });
    }
  }

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

  var consultaCep = function(cepDestino, callback){
    minhaContaAPI.consultaCep(cepDestino).then((result) => {
      return callback(result.data);
    }).catch((error) => {
      return callback(error);
    });
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
    minhaContaAPI.salvarEndereco(endereco).then((result) => {
      return callback(result.status);
    }).catch((error) => {
      return callback(error);
    });
  };

  $scope.salvarTelefone = function(){
    var boxDDD = angular.element(document.querySelector('#ddd'));
    var boxTipo = angular.element(document.querySelector('#tipo'));
    var boxTefefone = angular.element(document.querySelector('#telefone'));

    var ddd = boxDDD[0].value;
    var numero = boxTefefone[0].value;

    if (ddd.length > 0 && numero.length > 0){
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
    }
  };

  var novoTelefone = function(telefone, callback){
    minhaContaAPI.salvarTelefone(telefone).then((result) => {
      return callback(result.status);
    }).catch((error) => {
      return callback(error);
    });
  };

  validarRegistro = function(reg) {
    let consumidorId = angular.element(document.querySelector('#dadosId'));
    reg.consumidorId = consumidorId[0].value;

    let cpfCnpj = angular.element(document.querySelector('#cpfCnpj'));
    reg.cpfCnpj = cpfCnpj[0].value.replace(/[^0-9]/g, "");

    let dataNascimento = angular.element(document.querySelector('#dataNascimento'));
    arr = dataNascimento[0].value.split('/');
    reg.dataNascimento = new Date();
    reg.dataNascimento.setFullYear(arr[2],(arr[1]-1),arr[0]);

    if (!reg.nome || !reg.email || !reg.cpfCnpj || !reg.dataNascimento || reg.tipoPessoa == "I" || reg.sexo == "I"){
      $window.alert("Favor preencher os campos (Nome, Email, CPF/CNPJ, Nascimento, Tipo e Sexo) obrigatórios!");
      return false;
    }
    return true;
  }

  $scope.salvarCredencial = function(credencial){
    if (credencial.nova == credencial.confirme){
      alterarCredencial(credencial, function(status){
        if(status == 200){
          $window.location.reload();
        }
      });
    }
  }

  var alterarCredencial = function(credencial, callback){
    minhaContaAPI.novaCredencial(credencial).then((result) => {
      return callback(result.status);
    }).catch((error) => {
      return callback(error);
    });
  }

  $scope.sair = function(){
    logOut();
    $window.location.href="/#/";
  }

  var logOut = function(){
    $cookies.remove('24hs-token');
    $cookies.remove('24hs-consumidorId');
    $cookies.remove('24hs-nome');
    $window.sessionStorage.removeItem('usuarioLogado');
  }

  $scope.mostrarPedidos = false;
  $scope.mostrarDados = true;
  $scope.mostrarEnderecos = false;
  $scope.mostrarTelefones = false;
  $scope.mostrarSenha = false;

  $scope.trocarOpcaoMenu = function(opcao) {
    if (opcao == 'MP'){
      $scope.mostrarPedidos = true;
      $scope.mostrarDados = false;
      $scope.mostrarEnderecos = false;
      $scope.mostrarTelefones = false;
      $scope.mostrarSenha = false;
    }
    else if (opcao == 'MD'){
      $scope.mostrarPedidos = false;
      $scope.mostrarDados = true;
      $scope.mostrarEnderecos = false;
      $scope.mostrarTelefones = false;
      $scope.mostrarSenha = false;
    }
    else if (opcao == 'ME'){
      $scope.mostrarPedidos = false;
      $scope.mostrarDados = false;
      $scope.mostrarEnderecos = true;
      $scope.mostrarTelefones = false;
      $scope.mostrarSenha = false;
    }
    else if (opcao == 'MT'){
      $scope.mostrarPedidos = false;
      $scope.mostrarDados = false;
      $scope.mostrarEnderecos = false;
      $scope.mostrarTelefones = true;
      $scope.mostrarSenha = false;
    }
    else if (opcao == 'MS'){
      $scope.mostrarPedidos = false;
      $scope.mostrarDados = false;
      $scope.mostrarEnderecos = false;
      $scope.mostrarTelefones = false;
      $scope.mostrarSenha = true;
    }
  }
});
