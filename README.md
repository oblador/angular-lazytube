angular-lazytube
================

**Lightweight, responsive, lazy loaded YouTube videos that degrades gracefully.**

This AngularJS directive replaces any heavy `iframe`s or links with a image preview that loads the player only on click. Useful when performance and page size is important or for sites with many embeded youtube videos. 

For a simple example page with 10 videos, lazytube will reduce loadtime by 7x and memory usage by 2-3x.

Install
-------
With bower:

    $ bower install angular-lazytube

With NPM:

    $ npm install angular-lazytube

Don't forget to include [angular](https://angularjs.org/) and add `oblador.lazytube` to your module dependencies. 

Usage
-----

A few ways to embed the [Keyboard cat video](http://www.youtube.com/watch?v=J---aiyznGQ).

### Link
```html
<a ob-lazytube href="http://www.youtube.com/watch?v=J---aiyznGQ">Keyboard cat</a>
```

### Default `iframe`

```html
<iframe ob-lazytube width="480" height="360" src="//www.youtube.com/embed/J---aiyznGQ" frameborder="0" allowfullscreen></iframe>
```

### ID based
```html
<div ob-lazytube="J---aiyznGQ">Keyboard cat</div>
```

Player Configuration
--------------------

### Defaults

Any default options sent to YouTube can be changed by modifying the `obYoutubeConfig`. [Read more about which parameters you can use with the player](https://developers.google.com/youtube/player_parameters).

```js
angular.module('myApp', ['oblador.lazytube']).
  run(function(obLazytubeConfig) {
    //Change default player size
    obLazytubeConfig.width = 800;
    obLazytubeConfig.height = 600;

    //Disable related videos
    obLazytubeConfig.urlParams.rel = 0;

    //Disable responsive player
    obLazytubeConfig.responsive = false;
  }
);
```

### Per instance

To acheive the same thing but to only a specific player, just add the parameters as attributes. 

```html
<a ob-lazytube href="http://www.youtube.com/watch?v=J---aiyznGQ" rel="0">Keyboard cat</a>
```


### Responsiveness

Placeholders and the player is responsive by default. Don't forget to add `width` and `height` arguments if the aspect ratio is not 16:9. 

To **disable** the responsiveness either add the `no-responsive` attribute or change the defaults as outlined above. 

```html
<a ob-lazytube no-responsive href="http://www.youtube.com/watch?v=J---aiyznGQ">Keyboard cat</a>
```


Building
--------

    $ gulp
