// jshint esnext: true
!function($, Foundation){
  'use strict';

  function Lasso(anchor, element, options){
    this.anchor = anchor;
    this.element = element;
    this.options = $.extend({}, Lasso.defaults, options);

    this.tie();
  }

  Lasso.defaults = {
    xOffset: 1,
    yOffset: 1,
    position: 'bottom-left'
  };
  Lasso.prototype.positions = {

  };

  Lasso.prototype.tie = function(){
    this.eOffsetParent = getOffsetParent(this.element);
    this.aOffsetParent = getOffsetParent(this.anchor);
    this.parsePos();
    // console.log(this.anchor, this.element, this.options, `page offset ${pageYOffset}`);
  };

  Lasso.prototype.parsePos = function(){
    var pos = this.options.position.split('-');
    var arect = this.anchor.getBoundingClientRect();
    var erect = this.element.getBoundingClientRect();
    var thing = positions[pos[0]][pos[1]](arect, erect, this.options.xOffset);
    console.log(thing, 'whoo thing');
  };

  Foundation.Lasso = Lasso;



  //helper functions//
  var positions = {
    'left': {
      'bottom': function(a, e, o){return ;},
      'center': function(a, e, o){return ;},
      'top': function(a, e, o){return ;},
      'left': function(a, e, o){return ;}
    },
    'right': {
      'bottom': function(a, e, o){return ;},
      'center': function(a, e, o){return ;},
      'top': function(a, e, o){return ;},
      'left': function(a, e, o){return ;}
    },
    'top': {
      'left': function(a, e, o){return ;},
      'center': function(a, e, o){return ;},
      'right': function(a, e, o){return ;},
      'top': function(a, e, o){return ;}
    },
    'bottom': {
      'left': function(a, e, o){ return { x: Math.round(a.left - e.left), y: this.top(a, e, o) }; },
      'center': function(a, e, o){return { x: Math.round((a.left - e.left) - ((a.width - e.width) / 2)), y: this.top(a,e,o) }; },
      'right': function(a, e, o){return { x: Math.round((a.left - e.left) - (a.width - e.width)), y: this.top(a,e,o) }; },
      'top': function(a, e, o){ return Math.round((a.top + a.height + o) - e.top); }
    }
  };
  function getOffsetParent(el){
    return el.offsetParent ? el.offsetParent : document.documentElement;
  }
}(jQuery, window.Foundation);
