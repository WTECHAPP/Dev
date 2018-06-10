frontEnd.controller("newsletterCtrl", function ($scope, $location, $routeParams, $window, config, newsletterAPI) {
  $scope.novo = function(){
    if ($scope.frmNewsletter.$valid) {
      var email = {email: $scope.email};
      gravar(email);
    }
  }

  var gravar = function(email) {
    newsletterAPI.inserir(email).then((result) => {
      $window.location.href = "#/";
    }).catch((error) => {
      console.log(error);
    });
  }
});
