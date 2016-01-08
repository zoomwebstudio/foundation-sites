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
    closeOnClick: false
  };
  /**
   * Initializes the plugin by setting/checking options and attributes, adding helper variables, and saving the anchor.
   * @function
   * @private
   */
  Dropdown.prototype._init = function(){
    var id = this.$element[0].id;
    this.cached = {y:0,x:0};
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

    var comp = window.getComputedStyle(this.$element[0]);
    this.borderWidth = comp.borderWidth ? Math.ceil(parseFloat(comp.borderWidth)) : Math.ceil(parseFloat(comp['border-' + (this.getPositionClass() || 'bottom') + '-width']));

    this.options.positionClass = this.getPositionClass();
    this.cacheValues();
    this._positions();
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

  Dropdown.prototype._addBodyHandler = function(){
    var _this = this;
    $(document.body).on('click.zf.dropdown', function(e){
      var $tar = $(e.target)
      if(_this.$element[0] === e.target || _this.$element.find(e.target).length ||
        _this.$anchor[0] === e.target || _this.$anchor.find(e.target).length){
          return;
      }
      _this.close();
    });
  };

  Dropdown.prototype._removeBodyHandler = function(){
    $(document.body).off('click.zf.dropdown');
  };

  Dropdown.prototype.cacheValues = function(){
    var body = document.body,
        docEl = document.documentElement,
        scrollY = window.pageYOffset,
        scrollX = window.pageXOffset;

    this.dims = {
      paneRect: this.$element[0].getBoundingClientRect(),
      anchorRect: this.$anchor[0].getBoundingClientRect(),
      clientTop: docEl.clientTop || body.clientTop || 0,
      clientLeft: docEl.clientLeft || body.clientLeft || 0,
      winWidth: window.innerWidth,
      winHeight: window.innerHeight
    };

    this.dims.anchorTop = this.dims.anchorRect.top + scrollY - this.dims.clientTop;
    this.dims.anchorLeft = this.dims.anchorRect.left + scrollX - this.dims.clientLeft;
    this.dims.paneTop = this.dims.paneRect.top + scrollY - this.dims.clientTop;
    this.dims.paneLeft = this.dims.paneRect.left + scrollX - this.dims.clientLeft;

    this.changed = false;
  };

  Dropdown.prototype.reflow = function(){
    this.cacheValues();
    this._positions();
  };

  Dropdown.prototype._setPosition = function(e){
    if(e !== undefined){ this.changed = true; }
    if(this.isOpen){ this._positions(); }
  };
  Dropdown.prototype._positions = function(){
    if(this.changed){ this.cacheValues(); }
    var _this = this,
        dims = this.dims;

    var fns = {
      top: function(){
        return {y: Math.round(dims.paneTop + (dims.anchorRect.height * 2) - dims.anchorTop + _this.options.vOffset + _this.cached.y + _this.borderWidth),
                x: Math.round(dims.anchorLeft - dims.paneLeft - _this.options.hOffset + _this.borderWidth)};
      },
      left: function(){
        return {y: Math.round(dims.paneTop - dims.anchorTop + _this.cached.y),
                x: Math.round(dims.anchorLeft - (dims.paneLeft - _this.cached.x) - dims.paneRect.width - _this.options.hOffset - _this.borderWidth)};
      },
      right: function(){
        return {y: Math.round(dims.paneTop - dims.anchorTop + _this.cached.y),
                x: Math.round(dims.anchorLeft - (dims.paneLeft - _this.cached.x) + dims.anchorRect.width + _this.options.hOffset)};
      },
      '': function(){
        return {y: Math.round((dims.paneTop + _this.cached.y) - dims.anchorRect.height - dims.anchorTop - _this.options.vOffset),
                x: Math.round(dims.anchorLeft - (dims.paneLeft - _this.cached.x) - _this.options.hOffset + _this.borderWidth)};
      }
    };
    var translateVal = fns[this.getPositionClass()]() || {y:0, x:0};

    if(translateVal.x === 0 && translateVal.y === 0){ return; }

    this.$element[0].style.transform = 'translate(' + translateVal.x + 'px,' + -translateVal.y + 'px)';
    this.cached = translateVal;
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
  Dropdown.prototype._changePosition = function(){
    var arrs = {
      '': ['', 'top', 'left', 'right'],
      'top': ['top', '', 'left', 'right'],
      'left': ['left', 'right', '', 'top'],
      'right': ['right', 'left', '', 'top']
    },
        _this = this;
    for(var i = 0; i < 4; i++){
      this.$element.removeClass(arrs[this.options.positionClass][i])
          .addClass(arrs[this.options.positionClass][i+1]);
      this.changed = true;
      this._positions();
      if(Foundation.Box.ImNotTouchingYou(this.$element)) break;
    }
    // arrs[this.options.positionClass].forEach(function(c, i, arr){
    //   console.log('position change');
    //   _this.$element.removeClass(c).addClass(arr[i +1]);
    //   _this.changed = true;
    //   _this._positions();
    //   if(Foundation.Box.ImNotTouchingYou(_this.$element)) return;
    // })
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

    if(this.changed){ this._positions(); }

    this._setPosition();

    if(!Foundation.Box.ImNotTouchingYou(this.$element)) this._changePosition();
    console.log(Foundation.Box.ImNotTouchingYou(this.$element));

    this.$element.addClass('is-open')
        .attr('aria-hidden', false)
        .trigger('show.zf.dropdown', [this.$element]);

    this.isOpen = true;

    if(this.options.autoFocus){
      var $focusable = Foundation.Keyboard.findFocusable(this.$element);
      if($focusable.length){
        $focusable.eq(0).focus();
      }
    }
    if(this.options.closeOnClick) this._addBodyHandler();
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
        .attr('aria-hidden', true)
        .trigger('hide.zf.dropdown', [this.$element]);
    this.isOpen = false;
    this.$anchor.attr('aria-expanded', false);

    if(this.options.closeOnClick) this._removeBodyHandler();
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
    this.close();
    this.$anchor.off('.zf.dropdown');
    Foundation.unregisterPlugin(this);
  };

  Foundation.plugin(Dropdown, 'Dropdown');

}(jQuery, window.Foundation);
