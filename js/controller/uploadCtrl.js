//frontEnd.controller("uploadCtrl", function ($scope, $location, $routeParams, config, uploadAPI) {
frontEnd.controller("uploadCtrl",['Upload','$window', function (Upload, $window) {
  var vm = this;
  vm.submit = function(){ //function to call on form submit
    if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
      vm.upload(vm.carrinhoItemId, vm.file); //call upload function
    }
  }
  vm.upload = function (itemId, file) {
    Upload.upload({
      url: config.urlAPI + '/carrinhoItem/upload', //webAPI exposed to upload the file
      data:{carrinhoItemId: itemId, file:file} //pass file as data, should be user ng-model
    }).then(function (resp) { //upload function returns a promise
      if(resp.data.error_code === 0){ //validate success
        $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
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
}]);
