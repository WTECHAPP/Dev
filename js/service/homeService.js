frontEnd.factory("homeAPI", function ($http, $cookies, $location, config, $rootScope) {
  var consultaMenu = function() {
    return $http.get(config.urlAPI + 'menu/');
  };

  var consultaBanner = function() {
    return $http.get(config.urlAPI + 'banner/');
  }

  var consultaProdutoDestaques = function() {
    return $http.get(config.urlAPI + 'produto/destaques');
  }

  var consultaDestaque = function() {
    return $http.get(config.urlAPI + 'destaque/');
  }

  var consultaClientes = function() {
    return $http.get(config.urlAPI + 'consumidor/');
  }

  var consultaDepoimentos = function() {
    return $http.get(config.urlAPI + 'consumidordepoimento/');
  }

  var consultaBlogs = function() {
    return $http.get(config.urlAPI + 'blog/');
  }

  return {
    menu: consultaMenu,
    banners: consultaBanner,
    destaques: consultaDestaque,
    produtos: consultaProdutoDestaques,
    clientes: consultaClientes,
    depoimentos: consultaDepoimentos,
    blogs: consultaBlogs
  };
});
