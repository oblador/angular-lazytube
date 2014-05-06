angular.module('oblador.lazytube.directive', ['oblador.lazytube.config']).
directive('obYoutube', function($sce, $templateCache, obLazytubeConfig){
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
      var id = $attrs.obYoutube;
      if(!id) {
        var url = $attrs.href || $attrs.src;
        if(!url || !url.match(urlPattern)) {
          return;
        }
        id = RegExp.$2;
      }
      
      $scope.id = id;
      var width = $scope.width = $element.attr('width') || obLazytubeConfig.width;
      var height = $scope.height = $element.attr('height') || obLazytubeConfig.height;

      $scope.placeholderStyle = {
        backgroundImage: 'url(http://i.ytimg.com/vi/' + id + '/hqdefault.jpg)', 
        width: width + 'px',
        height: height + 'px'
      };

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
        $scope.embedUrl = $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + id + '/?' + urlParams.join('&'));
        $scope.active = true;
        $event.preventDefault();
      };
    }
  };
});
