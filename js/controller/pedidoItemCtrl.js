frontEnd.controller("pedidoItemCtrl", function ($scope, $location, $rootScope, $routeParams, $window, config, pedidoItemAPI, Upload) {
  var selecionaItem = function(itemskuid) {
    if (itemskuid){
      pedidoItemAPI.selecionar(itemskuid).then((result) => {
        if (result.status == 200) {
          $scope.item = result.data[0];
        }
        else{
          console.log("Erro: " + result.data);
          //$window.location.href = "/#/alerta";
        }
      }).catch((error) => {
        console.log(error);
        //$window.location.href = "/#/alerta";
      });
    }
  };
  selecionaItem($routeParams.pedidoentregaprodutoskuid);

  $scope.carregar = function(){ //function to call on form submit
    if ($scope.frmUpload.$valid && $scope.upload) { //check if form is valid
      var pedidoId = angular.element(document.getElementsByName('pedidoId')[0]).val();
      var itemSkuId = angular.element(document.getElementsByName('pedidoEntregaProdutoSkuId')[0]).val();
      uploadArte(pedidoId, itemSkuId, $scope.upload); //call upload function
    }
  };

  var uploadArte = function(pedidoId, itemSkuId, file) {
    Upload.upload({
      url: config.urlAPIEscrita + 'pedidoItem/upload',
      data:{upload: file, 'pedidoEntregaProdutoSkuId': itemSkuId} //pass file as data, should be user ng-model
    }).then(function (resp) { //upload function returns a promise
      if(resp.status === 200){ //validate success
        $window.alert('Successo! Arquivo ' + resp.data.file + ' carregado.');
        $window.location.href = "/#/pedido/" + pedidoId;
      } else {
        $window.alert('Ocorreu erro ao carregar o arquivo!');
      }
    }, function (resp) { //catch error
      console.log('Error status: ' + resp.status);
      $window.alert('Error status: ' + resp.status);
    }, function (evt) {
      console.log(evt);
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
    });
  };
});
