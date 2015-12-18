/**
 * Dropdown module.
 * @module foundation.dropdown
 * @requires foundation.util.keyboard
 * @requires foundation.util.box
 */
!function($, Foundation){
  'use strict';
  /**
   * Creates a new instance of a dropdown.
   * @class
   * @param {jQuery} element - jQuery object to make into an accordion menu.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  function Dropdown(element, options){
    this.$element = element;
    this.options = $.extend({}, Dropdown.defaults, this.$element.data(), options);
    this._init();

    Foundation.registerPlugin(this);
    Foundation.Keyboard.register('Dropdown', {
      'ENTER': 'open',
      'SPACE': 'open',
      'ESCAPE': 'close',
      'TAB': 'tab_forward',
      'SHIFT_TAB': 'tab_backward'
    });
  }

  Dropdown.defaults = {
    /**
     * Amount of time to delay opening a submenu on hover event.
     * @option
     * @example 250
     */
    hoverDelay: 250,
    /**
     * Allow submenus to open on hover events
     * @option
     * @example false
     */
    hover: false,
    /**
     * Don't close dropdown when hovering over dropdown pane
     * @option
     * @example true
     */
    hoverPane: false,
    /**
     * Number of pixels between the dropdown pane and the triggering element on open.
     * @option
     * @example 1
     */
    vOffset: 1,
    /**
     * Number of pixels between the dropdown pane and the triggering element on open.
     * @option
     * @example 1
     */
    hOffset: 1,
    /**
     * Class applied to adjust open position. JS will test and fill this in.
     * @option
     * @example 'top'
     */
    positionClass: '',
    /**
     * Allow the plugin to trap focus to the dropdown pane if opened with keyboard commands.
     * @option
     * @example false
     */
    trapFocus: false,
    /**
     * Allow the plugin to set focus to the first focusable element within the pane, regardless of method of opening.
     * @option
     * @example true
     */
    autoFocus: false,
    flipAxisOnly: false,
  };
  /**
   * Initializes the plugin by setting/checking options and attributes, adding helper variables, and saving the anchor.
   * @function
   * @private
   */
  Dropdown.prototype._init = function(){
    var id = this.$element[0].id;
    this.$anchor = $('[data-open="' + id + '"], [data-toggle="' + id + '"]');
    var anchLen = this.$anchor.length, anchId;
    if(anchLen){
      if(anchLen === 1){
        anchId = this.$anchor[0].id || Foundation.GetYoDigits(6, 'dd-anchor')
        this.$anchor.attr({
          'aria-controls': id,
          'data-yeti-box': id,
          'aria-haspopup': true,
          'aria-expanded': false
        });
      }else{
        //multi anchors *possibly*
      }
    }else{
      throw new Error("No anchor element available for this Dropdown.");
    }
    this.$element.attr({
      'aria-hidden': 'true',
      'data-yeti-box': id,
      'data-resize': id,
      'aria-labelledby': anchId
    });

    // var d = Foundation.Box.GetDimensions(this.$anchor);
    this.borderWidth = Math.ceil(parseFloat(window.getComputedStyle(this.$element[0]).borderWidth));
    // this.dims = {};
    // console.log(this.borderWidth, 'borderWidth');
    this.options.positionClass = this.getPositionClass();
    this.cacheValues(true);
    this._positions(true);
    // this.defaultPos = Foundation.Box.GetOffsets(this.$element, this.$anchor, this.options.positionClass, this.options.vOffset, this.options.hOffset)
    // this.$element.offset(this.defaultPos);
    // this.$element.css('transform', 'translate(' + d.offset.left + 'px, ' + d.offset.top + 'px)');
    this._events();
  };
  /**
   * Adds event listeners to the element utilizing the triggers utility library.
   * @function
   * @private
   */
  Dropdown.prototype._events = function(){
    var _this = this;
    this.$element.on({
      'open.zf.trigger': this.open.bind(this),
      'close.zf.trigger': this.close.bind(this),
      'toggle.zf.trigger': this.toggle.bind(this),
      'resizeme.zf.trigger': this._setPosition.bind(this)
    });

  };
  Dropdown.prototype.cacheValues = function(firstTime){
    var body = document.body,
        docEl = document.documentElement,
        scrollY = window.pageYOffset,
        scrollX = window.pageXOffset,
        oldLeft = !firstTime ? this.dims.anchorLeft : 0;
    // this.dims.diff = (this.dims.anchorLeft - this.dims.anchorRect.left + scrollX - this.dims.clientLeft) || 0;

    this.dims = {
      paneRect: this.$element[0].getBoundingClientRect(),
      anchorRect: this.$anchor[0].getBoundingClientRect(),
      clientTop: docEl.clientTop || body.clientTop || 0,
      clientLeft: docEl.clientLeft || body.clientLeft || 0,
      winWidth: window.innerWidth,
      winHeight: window.innderHeight
    }
    this.dims.anchorTop = this.dims.anchorRect.top + scrollY - this.dims.clientTop;
    this.dims.anchorLeft = this.dims.anchorRect.left + scrollX - this.dims.clientLeft;
    this.dims.paneTop = this.dims.paneRect.top + scrollY - this.dims.clientTop;
    this.dims.paneLeft = this.dims.paneRect.left + scrollX - this.dims.clientLeft;
    this.dims.diff = this.dims.anchorLeft - oldLeft;
    console.log(this.dims.diff, 'diff');

  };
  Dropdown.prototype.reflow = function(){
    this.cacheValues();
    this._positions();
  };
  Dropdown.prototype._setPosition = function(){
    // console.log(window.innerWidth);
    if(window.innerWidth !== this.dims.winWidth){
      console.log('resetting caches');
      this.cacheValues();
    }
    if(this.isOpen){
      this._positions();
    }

    // this.cacheValues();
    // var off = this.$anchor.offset();
    // var paneRect = this.$anchor[0].getBoundingClientRect();
    // console.log(this.$element.offset(), off, this.$element[0].getBoundingClientRect());
    // this.$element.offset({top: off.top + paneRect.height, left: off.left});
    // if(!this.$element.hasClass('is-open')) return;
    // console.log(this.$anchor.offset());
    // this.$element.offset(Foundation.Box.GetOffsets(this.$element, this.$anchor, this.getPositionClass(), this.options.vOffset, this.options.hOffset));
    // console.log(pos);
  };
  Dropdown.prototype._positions = function(firstTime){
    var _this = this,
        dims = this.dims,
        paneLeft = firstTime ? dims.paneLeft : (this.$element[0].style.transform.match(/\d+/)[0] * 1) - this.dims.diff;

    var fns = {
      top: function(){
        return {y: Math.round(dims.paneTop + (dims.anchorRect.height * 2) - dims.anchorTop + _this.options.vOffset) + (_this.borderWidth),
                x: Math.round(dims.anchorLeft - dims.paneLeft - _this.options.hOffset) + _this.borderWidth};
      },
      left: function(){
        // console.log(paneLeft, paneRect.width , anchorRect.width , anchorLeft , _this.options.hOffset);
        return {y: Math.round(dims.paneTop - dims.anchorTop),
                x: Math.round(dims.anchorLeft /*- dims.paneLeft*/ - dims.paneRect.width) - _this.options.hOffset - _this.borderWidth};
      },
      right: function(){
        return {y: Math.round(dims.paneTop - dims.anchorTop),
                x: Math.round(dims.anchorLeft - dims.paneLeft + dims.anchorRect.width) + _this.options.hOffset};
      },
      '': function(){
        console.log(paneLeft, 'paneLeft');
        return {y: Math.round(dims.paneTop - dims.anchorRect.height - dims.anchorTop - _this.options.vOffset),
                x: firstTime ? Math.floor(dims.anchorLeft - paneLeft - _this.options.hOffset) + _this.borderWidth : _this.cached.x + dims.diff};
      }
    };

    var beauty = fns[this.getPositionClass()]() || {y:0, x:0};
    if(beauty.x === 0 && beauty.y === 0){console.log('no change'); return;}
    console.log(this.$element[0].style.transform.match(/\d+/));
    this.$element[0].style.transform = 'translateX(' + beauty.x + 'px) translateY(' + -beauty.y + 'px)';
    this.cached = beauty;
    // this.$element[0].style.transform = 'translate(' + beauty.x + 'px,' + -beauty.y + 'px)';

  };
  /**
   * Helper function to determine current orientation of dropdown pane.
   * @function
   * @returns {String} position - string value of a position class.
   */
  Dropdown.prototype.getPositionClass = function(){
    var position = this.$element[0].className.match(/(top|left|right)/g);
        position = position ? position[0] : '';
    return position;
  };
  /**
   * Opens the dropdown pane, and fires a bubbling event to close other dropdowns.
   * @function
   * @fires Dropdown#closeme
   * @fires Dropdown#show
   */
  Dropdown.prototype.open = function(){
    this.$element.trigger('closeme.zf.dropdown', this.$element[0].id);
    this.$anchor.attr('aria-expanded', true);
    this._setPosition();
    // this.$element.slideUp();
    this.$element.addClass('is-open')
        .attr('aria-hidden', false);
    this.isOpen = true;
    if(this.options.autoFocus){
      var $focusable = Foundation.Keyboard.findFocusable(this.$element);
      if($focusable.length){
        $focusable.eq(0).focus();
      }
    }
  };

  /**
   * Closes the open dropdown pane.
   * @function
   * @fires Dropdown#hide
   */
  Dropdown.prototype.close = function(){
    var $focused = this.$element.find(':focus');
    if($focused.length){ $focused.blur(); }
    this.$element.removeClass('is-open')
        .attr('aria-hidden', true);
    this.isOpen = false;
    this.$anchor.attr('aria-expanded', false);
  };
  /**
   * Toggles the dropdown pane's visibility.
   * @function
   */
  Dropdown.prototype.toggle = function(){
    this[this.isOpen ? 'close' : 'open']();
  };
  /**
   * Destroys the dropdown.
   * @function
   */
  Dropdown.prototype.destroy = function(){
    Foundation.unregisterPlugin(this);
  };

  Foundation.plugin(Dropdown, 'Dropdown');

}(jQuery, window.Foundation);
