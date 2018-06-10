frontEnd.controller("pesquisaCtrl", function ($scope, $location, $routeParams, $window, config, pesquisaAPI) {
  var consultaProdutos = function(param) {
    pesquisaAPI.produtos(param).then((result) => {
      if (result.data.length > 0){
        $scope.listaProdutos = result.data;
        console.log($scope.listaProdutos);
      }
      else{
        $window.location.href = "#/alerta";
      }
    }).catch((error) => {
      console.log('Produtos: ', error);
    });
  };
  consultaProdutos($routeParams.param);

  /*
  pesquisaAPI.blogs().then((result) => {
    $scope.listaBlogs = result.data;
    console.log($scope.listaBlogs);
  }).catch((error) => {
    console.log('Blogs: ', error);
  });

  pesquisaAPI.artigos().then((result) => {
    $scope.listaArtigos = result.data;
    console.log($scope.listaArtigos);
  }).catch((error) => {
    console.log('Artigos: ', error);
  });
  */
});
