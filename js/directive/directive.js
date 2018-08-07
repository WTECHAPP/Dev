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

diretivas.directive("owlCarousel", function() {
	return {
		restrict: 'E',
		transclude: false,
		link: function (scope) {
			scope.initCarousel = function(element) {
			  // provide any default options you want
				var defaultOptions = {
				};
				var customOptions = scope.$eval($(element).attr('data-options'));
				// combine the two options objects
				for(var key in customOptions) {
					defaultOptions[key] = customOptions[key];
				}
				// init carousel
				$(element).owlCarousel(defaultOptions);
			};
		}
	};
})

diretivas.directive('owlCarouselItem', [function() {
	return {
		restrict: 'A',
		transclude: false,
		link: function(scope, element) {
		  // wait for the last item in the ng-repeat then call init
			if(scope.$last) {
				scope.initCarousel(element.parent());
			}
		}
	};
}]);

diretivas.directive("owlCarousel", [ function() {
  return {
      restrict: 'E',
      transclude: false,
      link: function(scope) {
          scope.initCarousel = function(element) {
              console.log('initCarousel');

              // provide any default options you want
              var defaultOptions = {};
              var customOptions = scope.$eval($(element).attr('data-options'));
              // combine the two options objects
              for (var key in customOptions) {
                  defaultOptions[key] = customOptions[key];
              }
              // init carousel
              var curOwl = $(element).data('owlCarousel');
              if (!angular.isDefined(curOwl)) {
                  $(element).owlCarousel(defaultOptions);
              }
              scope.cnt++;
          };
      }
  };
}]);

diretivas.directive('owlCarouselItem', [
  function() {
      return {
          restrict: 'A',
          transclude: false,
          link: function(scope, element) {
              // wait for the last item in the ng-repeat then call init
              if (scope.$last) {
                  console.log('lst element');
                  scope.initCarousel(element.parent());
              }
          }
      };
  }
]);

diretivas.directive('ngRepeatOwlCarousel', function() {
  return {
      restrict: 'A',
      scope: {
          carouselInit: '&'
      },
      link: function(scope, element, attrs) {
          if ((scope.$parent != null) && scope.$parent.$last) {
              console.log(scope.$parent.$last);
              return scope.carouselInit()();
          }
      }
  };
});