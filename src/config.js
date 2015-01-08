angular.module('oblador.lazytube.config', []).
factory('obLazytubeConfig', function() {
  return {
    width: 560, 
    height: 315, 
    urlParams: { 
      autoplay: 1
    },
  };
});
