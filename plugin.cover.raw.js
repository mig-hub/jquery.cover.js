;(function($) {
  $.do_when_image_loaded = function(src, callback) {
    var img = new Image();
    img.src = src;
    var loop = setInterval(function() {
      if (img.complete) {
        clearInterval(loop);
        callback();
      }
    }, 50);
  };
  $.fn.cover = function(options) {
    var defaults = {
      binding: 'click.cover',
      divID: 'cover_plugin_bloc',
      loader: 'loader.gif',
      backgroundColor: 'transparent',
      speed: 200
    };
    var settings = $.extend({}, defaults, options);
    return this.each(function() {
      var $this = $(this);
      if (!$this.is('img')) throw new Error("Cover was used with a node which is not an image.")
      $this.bind(settings.binding, function() {
        var href = $this.data().cover || $this.attr('src');
        var cover = $("<div id='"+settings.divID+"'></div>");
        cover.click(function() {
          // process again because it may have changed by scroll or whatever
          cover.stop(true,true).animate({
            left: $this.offset().left-$(window).scrollLeft()+'px',
            top: $this.offset().top-$(window).scrollTop()+'px',
            width: $this.width()+'px',
            height: $this.height()+'px'
          }, settings.speed, function() {cover.remove();});
        });
        cover.css({
          position: 'fixed',
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          left: $this.offset().left-$(window).scrollLeft()+'px',
          top: $this.offset().top-$(window).scrollTop()+'px',
          width: $this.width()+'px',
          height: $this.height()+'px'
        });
        var timeout = setTimeout(function() {
          // Should not show briefly when image is loaded
          cover.css({
            backgroundImage: "url("+settings.loader+")",
            backgroundColor: settings.backgroundColor
          });
        }, 250);
        $('body').append(cover);
        $.do_when_image_loaded(href, function() {
          clearTimeout(timeout);
          cover
          .css({backgroundImage: "url("+href+")", backgroundSize: "cover"})
          .stop(true,true)
          .animate({left: '0px', top: '0px', width: '100%', height: '100%'}, settings.speed);
        });
      });
    });
  };
})(jQuery);

