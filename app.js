var frontEnd = angular.module("frontEnd", ['ngRoute', 'ui.utils.masks', 'ngCookies', 'ngFileUpload', 'dir.owlCarousel']);

frontEnd.config(function ($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'view/home.html',
    controller: 'homeCtrl'
  })
  .when('/login', {
    templateUrl: 'view/login.html',
    controller: 'loginCtrl'
  })
  .when('/erro', {
    templateUrl: 'view/erro.html',
    controller: 'erroCtrl'
  })
  .when('/alerta', {
    templateUrl: 'view/alerta.html',
    controller: 'alertaCtrl'
  })
  .when('/carrinho/', {
    templateUrl: 'view/carrinho.html',
    controller: 'carrinhoCtrl'
  })
  .when('/minhaConta', {
    templateUrl: 'view/minhaConta.html',
    controller: 'minhaContaCtrl'
  })
  .when('/politicadeprivacidade', {
    templateUrl: 'view/politicaDePrivacidade.html',
    controller: 'alertaCtrl'
  })
  .when('/produto/:produto', {
    templateUrl: 'view/detalheProduto.html',
    controller: 'detalheCtrl'
  })
  .when('/configurar/:produto', {
    templateUrl: 'view/configurarProduto.html',
    controller: 'configurarCtrl'
  })
  .when('/minhaConta/:token', {
    templateUrl: 'view/minhaConta.html',
    controller: 'minhaContaCtrl'
  })
  .when('/pedido/:pedidoId', {
    templateUrl: 'view/detalhePedido.html',
    controller: 'pedidoCtrl'
  })
  .when('/pesquisa/:param', {
    templateUrl: 'view/pesquisa.html',
    controller: 'pesquisaCtrl'
  })
  .when('/carrinho/finalizar/', {
    templateUrl: 'view/finalizarCompra.html',
    controller: 'finalizarCompraCtrl'
  })
  .when('/pedidoitem/upload/:pedidoentregaprodutoskuid', {
    templateUrl: 'view/upload.html',
    controller: 'pedidoItemCtrl'
  })
  .otherwise({ redirectTo: '/erro' });

  $httpProvider.interceptors.push(function($q, $cookies) {
    return {
     request: function(config) {
          config.headers['token'] = $cookies.get("24hs-token");
          return config;
      }
    };
  });

});
