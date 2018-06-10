frontEnd.factory("newsletterAPI", function ($http, $cookies, $location, config, $rootScope) {
  var inserir = function(frm) {
    return $http.post(config.urlAPI + 'newsletter', frm);
  };

  return {
    inserir: inserir
  };
});
