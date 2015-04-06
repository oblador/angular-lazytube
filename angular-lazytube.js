angular.module('oblador.lazytube', [
  'oblador.lazytube.templates',
  'oblador.lazytube.config',
  'oblador.lazytube.directive'
]);


angular.module('oblador.lazytube.config', []).
factory('obLazytubeConfig', function() {
  return {
    width: 560,
    height: 315,
    responsive: true,
    urlParams: {
      autoplay: 1
    },
  };
});


angular.module("oblador.lazytube.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("templates/lazytube/directive.html","<div class=\"yt-wrap\" ng-class=\"{\'yt-responsive\' : responsive }\" ng-style=\"wrapperStyle\"><a ng-href=\"http://www.youtube.com/watch?v={{id}}\" ng-click=\"showVideo($event)\" ng-show=\"!active\" ng-style=\"placeholderStyle\" class=\"yt-placeholder\"><i class=\"yt-btn\"></i></a><iframe class=\"yt-embed\" ng-if=\"active\" width=\"{{width}}\" height=\"{{height}}\" ng-src=\"{{embedUrl}}\" frameborder=\"0\" allowfullscreen></iframe></div>");
$templateCache.put("templates/lazytube/styles.html","<style type=\"text/css\">.yt-responsive{position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%}.yt-placeholder{display:block;position:relative;background:#000 no-repeat 50% 50%;background-size:cover;margin:4px 0}.yt-responsive .yt-placeholder,.yt-responsive .yt-embed{position:absolute;top:0;left:0;width:100%;height:100%;margin:0}.yt-btn:before{content:\"▶\";color:#fff;font-family:Helvetica,sans-serif}.yt-btn{position:absolute;left:50%;top:50%;width:84px;line-height:58px;margin:-29px 0 0 -42px;font-style:normal;background:#000;background:rgba(0,0,0,.8);text-align:center;font-size:28px;border-radius:10px;text-indent:5px}a:hover .yt-btn{background:#cc181e}</style>");}]);

angular.module('oblador.lazytube.directive', ['oblador.lazytube.config']).
directive('obLazytube', ["$sce", "$window", "$templateCache", "obLazytubeConfig", function($sce, $window, $templateCache, obLazytubeConfig){
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
        var url = $attrs.href || $attrs.src;
        if(!url || !url.match(urlPattern)) {
          return;
        }
        id = RegExp.$2;
      }

      $scope.id = id;
      var width = $scope.width = $element.attr('width') || obLazytubeConfig.width;
      var height = $scope.height = $element.attr('height') || obLazytubeConfig.height;
      var responsive = $scope.responsive = angular.isDefined($attrs.noResponsive) ? false : obLazytubeConfig.responsive;
      var bgImg = $attrs.obLazyBackground ? $attrs.obLazyBackground : ('//i.ytimg.com/vi/' + id + '/hqdefault.jpg');

      $scope.wrapperStyle = {};
      $scope.placeholderStyle = {
        backgroundImage: 'url(' + bgImg + ')'
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
        $scope.embedUrl = $sce.trustAsResourceUrl('//www.youtube.com/embed/' + id + '/?' + urlParams.join('&'));
        $scope.active = true;
        $event.preventDefault();
      };
    }
  };
}]);
