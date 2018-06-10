frontEnd.controller("loginCtrl", function ($scope, $rootScope, $location, $routeParams, $cookies, $window, config, loginAPI) {

  $rootScope.nomeLogado = null;

  $scope.logar = function(credencial) {
    loginAPI.logar(credencial).then((result) => {
      var dados = result.data;
      if(result.status == 200) {
        $cookies.put('24hs-token', dados.token);
        $window.sessionStorage.setItem("usuarioLogado",angular.toJson({nome: dados.nome}));
        location.href = '/#/carrinho/';
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  $scope.buscarUsuarioLogado = function(credencial) {
    var usr = angular.fromJson($window.sessionStorage.getItem('usuarioLogado'));
    if (usr) return usr.nome;
    else return null;
  }

  $scope.registrar = function(reg){
    //var reg = $scope.frm;
    if (reg.email == reg.email_confirmation){
      loginAPI.preCadastro(reg).then((result) => {
        if(result.status == 200) {
          var dados = result.data;
          //$cookies.put('24hs-token', dados.token);
          console.log("Token: " + dados.token + "Nome: " + dados.nome);
          location.href = '/#/minhaConta/' + dados.token; // PRE CADASTRO (FINALIZAR CADASTRO)!!!
        }
      }).catch((error) => {
        console.log(error);
      });
    }
  }
});
