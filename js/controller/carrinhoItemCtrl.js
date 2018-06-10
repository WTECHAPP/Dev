frontEnd.controller("carrinhoItemCtrl", function ($scope, $location, $routeParams, config, carrinhoItemAPI, Upload, $window) {
  var consultaItem = function(carrinhoitemid) {
    if (carrinhoitemid){
      carrinhoItemAPI.consultar(carrinhoitemid).then((result) => {
        $scope.item = result.data[0];
      }).catch((error) => {
        console.log(error);
      });
    }
  };
  consultaItem($routeParams.carrinhoitemid);

  //$scope.formData = {};

  $scope.carregar = function(){ //function to call on form submit
    if ($scope.frmUpload.$valid && $scope.upload) { //check if form is valid
      var itemId = angular.element(document.getElementsByName('carrinhoItemId')[0]).val();
      uploadArte(itemId, $scope.upload); //call upload function
    }
  }

  var uploadArte = function(itemId, file) {
    Upload.upload({
      url: config.urlAPI + 'carrinhoItem/upload',
      data:{upload: file, 'carrinhoItemId': itemId} //pass file as data, should be user ng-model
    }).then(function (resp) { //upload function returns a promise
      if(resp.data.error_code === 0){ //validate success
        $window.alert('Success ' + resp.config.data.file.name + ' uploaded. Response: ');
      } else {
        $window.alert('an error occured');
      }
    }, function (resp) { //catch error
      console.log('Error status: ' + resp.status);
      $window.alert('Error status: ' + resp.status);
    }, function (evt) {
      console.log(evt);
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
    });
  };

  /*$scope.remover = function(carrinhoitemid){
    carrinhoItemAPI.remover(carrinhoitemid).then((result) => {
      $window.location.href = "/#/carrinho/";
    }).catch((error) => {
      console.log(error);
    });
  };*/
});
