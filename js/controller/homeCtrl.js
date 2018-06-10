frontEnd.controller("homeCtrl", function ($scope, $location, $window, config, homeAPI) {

    homeAPI.banners().then((result) => {
      $scope.listBanners = result.data;
      console.log($scope.listBanners);
    }).catch((error) => {
      console.log('Banner: ', error);
    });

    homeAPI.menu().then((result) => {
      $scope.listMenu = result.data;
      console.log($scope.listMenu);
    }).catch((error) => {
      console.log('Menu: ', error);
    });

    homeAPI.produtos().then((result) => {
      $scope.listProdutos = result.data;
      console.log($scope.listProdutos);
    }).catch((error) => {
      console.log('Produtos: ', error);
    });

    homeAPI.destaques().then((result) => {
      $scope.listDestaques = result.data;
      console.log($scope.listDestaques);
    }).catch((error) => {
      console.log('Destaque: ', error);
    });

    homeAPI.clientes().then((result) => {
      $scope.listClientes = result.data;
      console.log($scope.listClientes);
    }).catch((error) => {
      console.log('Cliente: ', error);
    });

    homeAPI.depoimentos().then((result) => {
      $scope.listDepoimentos = result.data;
      console.log($scope.listDepoimentos);
    }).catch((error) => {
      console.log('Depoimento: ', error);
    });

    homeAPI.blogs().then((result) => {
      $scope.listBlogs = result.data;
      console.log($scope.listBlogs);
    }).catch((error) => {
      console.log('Blog: ', error);
    });

    $scope.pesquisar = function(){
      var param = angular.element(document.querySelector('#pesquisaSite'));
      if (param[0].length > 0){
        $window.location.href = "#/pesquisa/" + param[0];
      }
    };

    $scope.home = function(){
      $window.location.href = "#/";
    }

});
