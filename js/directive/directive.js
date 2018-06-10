diretivas = angular.module('dir.owlCarousel', []);

diretivas.directive('owlCarouselOneSlide', [function() {
  return {
    restrict: 'A',
    //transclude: false,
    link: function(scope, element) {
      if(scope.$last) {
        $(element.parent()).owlCarousel({
          navigation: true,
          slideSpeed: 300,
          paginationSpeed: 400,
          singleItem: true,
          autoPlay: true,
          stopOnHover: true
        });
      }
    }
  };
}]);

diretivas.directive('owlCarouselThreeSlides', [function() {
  return {
    restrict: 'A',
    //transclude: false,
    link: function(scope, element) {
      if(scope.$last) {
        $(element.parent()).owlCarousel({
          items: 3,
          autoPlay: false,
          stopOnHover: true
        });
      }
    }
  };
}]);

diretivas.directive('owlCarouselFourSlides', [function() {
  return {
    restrict: 'A',
    //transclude: false,
    link: function(scope, element) {
      if(scope.$last) {
        $(element.parent()).owlCarousel({
          items: 4,
          autoPlay: false,
          stopOnHover: true
        });
      }
    }
  };
}]);

diretivas.directive('owlCarouselFiveSlides', [function() {
  return {
    restrict: 'A',
    //transclude: false,
    link: function(scope, element) {
      if(scope.$last) {
        $(element.parent()).owlCarousel({
          items: 6,
          navigation: false,
          autoPlay: false,
          stopOnHover: true
        });
      }
    }
  };
}]);

diretivas.directive('jqueryUiTabs', [function() {
  return {
    restrict: 'A',
    //transclude: false,
    link: function(scope, element) {
      if(scope.$last) {
        setTimeout(function() {
          $("#tabs").tabs();
        }, 0);
      }
    }
  };
}]);

diretivas.directive('jqueryUiTabsOwlCarOneSlide', [function() {
  return {
    restrict: 'A',
    //transclude: false,
    link: function(scope, element) {
      if(scope.$last) {
        $(element.parent()).owlCarousel({
          navigation: true,
          slideSpeed: 300,
          paginationSpeed: 400,
          singleItem: true,
          autoPlay: true,
          stopOnHover: true
        });

        setTimeout(function() {
          $("#tabs").tabs();
        }, 0);
      }
    }
  };
}]);