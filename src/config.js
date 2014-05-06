angular.module('oblador.lazytube.config', []).
factory('obLazytubeConfig', function() {
  return {
    width: 480, 
    height: 360, 
    urlParams: { 
      autoplay: 1
    },
  };
});
