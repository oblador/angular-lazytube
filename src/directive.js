angular.module('oblador.lazytube.directive', ['oblador.lazytube.config']).
directive('obLazytube', function($sce, $window, $templateCache, obLazytubeConfig){
  //Inject base styles
  angular.element(document).find('head').prepend($templateCache.get('templates/lazytube/styles.html'));

  //Valid youtube URL pattern
  var urlPattern = /^(?:(https?:)?\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

  //Valid attributes that will be passed on to youtube via the query string
  var paramNames = 'autohide autoplay cc_load_policy color controls disablekb enablejsapi end fs iv_load_policy list listType loop modestbranding origin playerapiid playlist playsinline rel showinfo start theme'.split(' ');

  return {
    restrict: 'A',
    templateUrl: 'templates/lazytube/directive.html',
    replace: true,
    transclude: true,
    scope: true,
    link: function($scope, $element, $attrs) {
      var id = $attrs.obLazytube;
      if(!id) {
        var url = $attrs.href || $attrs.src || $attrs.ngSrc;
        if(!url) {
          return;
        }
        var r = url.match(urlPattern);
        if (!r) {
          return;
        }
        id = r[2];
      }

      $scope.id = id;
      var protocol = $window.location.protocol === 'https:' ? 'https:' : 'http:';
      var width = $scope.width = $element.attr('width') || obLazytubeConfig.width;
      var height = $scope.height = $element.attr('height') || obLazytubeConfig.height;
      var responsive = $scope.responsive = angular.isDefined($attrs.noResponsive) ? false : obLazytubeConfig.responsive;

      $scope.wrapperStyle = {};
      $scope.placeholderStyle = {
        backgroundImage: $attrs.obPlaceholder ? 'url(' + $attrs.obPlaceholder + ')' : 'url(' + protocol + '//i.ytimg.com/vi/' + id + '/hqdefault.jpg)'
      };

      if(responsive) {
        $scope.wrapperStyle.paddingBottom = 100 * height/width + '%';
      } else {
        $scope.placeholderStyle.width = width + 'px';
        $scope.placeholderStyle.height = height + 'px';
      }

      $scope.showVideo = function($event) {
        //Build query params by checking for attributes
        var params = angular.copy(obLazytubeConfig.urlParams);
        angular.forEach(paramNames, function(key) {
          var val = $attrs[key];
          if(angular.isDefined(val)) {
            params[key] = val;
          }
        });
        var urlParams = [];
        angular.forEach(params, function(val, key) {
          urlParams.push(key + '=' + encodeURIComponent(val));
        });

        //We regex checked ID so url should be safe. 
        $scope.embedUrl = $sce.trustAsResourceUrl(protocol + '//www.youtube.com/embed/' + id + '/?' + urlParams.join('&'));
        $scope.active = true;
        $event.preventDefault();
      };
    }
  };
});
