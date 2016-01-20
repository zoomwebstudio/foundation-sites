// !function(Foundation, $){
//   'use strict';
//
//   function Reveal(element, options){
//     this.$element = element;
//     this.options = $.extend({}, Reveal.defaults, this.$element.data(), options);
//
//     this._init();
//
//     // Foundation.registerPlugin(this, 'Reveal');
//   }
//
//   Reveal.defaults = {
//     animationIn: '',
//     animationOut: '',
//     showDelay: 0,
//     hideDelay: 0,
//     closeOnClick: true,
//     closeOnEsc: true,
//     multipleOpened: false,
//     // vOffset: 100,
//     // hOffset: 0,
//     fullScreen: false,
//     btmOffsetPct: 10,
//     overlay: true,
//     resetOnClose: false,
//     deepLink: false
//   };
//
//   Reveal.prototype._init = function(){
//
//   };
//   Reveal.prototype._events = function(){
//
//   };
//   Reveal.prototype._makeOverlay = function(id){
//     var $overlay = $('<div></div>')
//                     .addClass('reveal-overlay')
//                     .attr({'tabindex': -1, 'aria-hidden': true})
//                     .appendTo('body');
//     if(this.options.closeOnClick){
//       $overlay.attr({
//         'data-close': id
//       });
//     }
//     return $overlay;
//   };
//
//   Reveal.prototype._setPosition = function(){
//
//   };
//
//   Reveal.prototype.open = function(){
//
//   };
//
//   Reveal.prototype.close = function(){
//
//   };
//
//   Reveal.prototype.toggle = function(){
//
//   };
//
//   Reveal.prototype._extraHandlers = function(){
//
//   };
//
//   Reveal.prototype.destroy = function(){
//
//   };
// }(window.Foundation, jQuery);
