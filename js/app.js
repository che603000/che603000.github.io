(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by alex on 07.08.2015.
 */
var Events = function (channels) {
    this._channels = {};
    this.initialize(channels);
}

Events.prototype = {
    initialize: function (channels) {
        [].concat(channels).forEach(this.createChannel, this);
        return this;
    },
    channel: function (name) {
        if (this._channels[name])
            return this._channels[name];
        else
            throw new Error('Not found channels:' + name);
    },
    createChannel: function (name) {
        if (!this._channels[name]) {
            this._channels[name] = _.extend({}, Backbone.Events).on('all', function (eName, e) {
                console.log('Канал: %s => %o', name, arguments);
            });

        }
        return this._channels[name];
    }
};


module.exports = Events;
},{}],2:[function(require,module,exports){
/**
 * Created by alex on 07.08.2015.
 */

var Events = require('./events');

app.options = require('./options');
app.events = new Events(app.options.channels);
app.store = require('./store');


require('./system');

var Message = require('./message');
app.message = new Message({el: $('#temp-message-block').html()});

var Modal = require('./modal');
app.modal = new Modal({el: '#map-modal'});


},{"./events":1,"./message":3,"./modal":4,"./options":5,"./store":6,"./system":7}],3:[function(require,module,exports){
/**
 * Created by alex on 09.09.2015.
 */

var View = Backbone.View.extend({
    templateItem: _.template($('#temp-message-item').html()),
    templateHtml: _.template($('#temp-message-html').html()),
    defaults: {
        className: 'alert-warning',
        title: '',
        content: '',
        html: '',
        time: 0,
        animation: 0
    },
    initialize: function (options) {
        $('body').append(this.el);
    },
    send: function (data) {
        data = _.defaults(data, this.defaults);
        var $el = this._create(data);
        this.$el.append($el);
        data.time && this._time($el, data);
        return $el;
    },
    _create: function (data) {
        return $((data.html ? this.templateHtml(data) : this.templateItem(data)));
    },
    _time: function ($el, data) {
        setTimeout(function () {
            $el.hide(data.animation, function () {
                $el.alert('close');
            });
        }, data.time);
    }


});

module.exports = View;
},{}],4:[function(require,module,exports){
/**
 * Created by alex on 09.09.2015.
 */

var View = Backbone.View.extend({
    defaults: {
        //className: 'alert-warning',
        //title: '',
        //content: '',
        //html: '',
        //time: 0,
        //animation: 0
    },
    initialize: function (options) {

    },
    open: function (view) {
        view.modal = this;
        this.$el
            .append(view.el || view)
            .one('hidden.bs.modal', function () {
                this.$el.empty();
            }.bind(this))
            .modal('show');
    },
    close : function(){
        this.$el.modal('hide')

    }
});


module.exports = View;
},{}],5:[function(require,module,exports){
/**
 * Created by NBP100083 on 18.08.2015.
 */

module.exports = {
    // список каналов событий приложения
    channels: ['system', 'screen', 'menu', 'layers', 'base-map', 'route' ,'info', 'map' , 'auth'],
    icons: {
        wp: L.divIcon({
            className: 'map-route-icon'
        }),
        df: L.divIcon({
            className: 'icon-hd-green-24',
            iconSize: L.point(24, 24),
            iconAnchor: L.point(12, 12)
        })
        //new L.Icon.Default()

    },
    types: { // типы ВП РФ
        WIND: {
            title: 'Ветер',
            enableZoom: [3, 8]
        },
        PRESS: {
            title: 'Атмосф. давление',
            enableZoom: [3, 8]
        },
        TEMP: {
            title: 'Температура возд.',
            enableZoom: [3, 8]
        },
        PRECIPITATION: {
            title: 'Осадки',
            enableZoom: [3, 8]
        },
        WAVE: {
            title: 'Высота волны',
            enableZoom: [3, 8]
        },

        SEEMARKER: {
            title: 'Маяки и буи',
            enableZoom: [8, 30]
        },
        MARINE: {
            title: 'Порты и марины - SkipperGuide.com',
            enableZoom: [4, 30]
        },
        LIGTH: {
            title: 'Порты и марины - OSM',
            enableZoom: [4, 30]
        },



    }
};
},{}],6:[function(require,module,exports){
/**
 * Created by NBP100083 on 16.08.2015.
 */

module.exports= {
    action: '_local',
    get: function(name){
        return this[this.action](name);
    },
    set: function(name, data){
        return this[this.action](name, data);
    },

    _local: function (name, data) {
        if(window.localStorage){
            if(data)    {
                window.localStorage.setItem(name, JSON.stringify(data));
                return true;
            } else {
                return JSON.parse(window.localStorage.getItem(name)) || {};
            }

        }
    }
};
},{}],7:[function(require,module,exports){
/**
 * Created by alex on 07.08.2015.
 */
var events =require('./events'),
    evnScreen = app.events.channel('screen'),
    evnSystem = app.events.channel('system');

$(window)
    .on('resize', _.debounce(function () {
        evnScreen.trigger('resize:start');
    }.bind(this), 300, true))
    .on('resize', _.debounce(function () {
        evnScreen.trigger('resize:end');
    }.bind(this), 300))
    .on('resize', _.throttle(function () {
        evnScreen.trigger('resize');
    }.bind(this), 100))
    .unload( function(e){
        evnSystem.trigger('unload');
    })
    .load( function(e){
        evnSystem.trigger('load');
    });
},{"./events":1}],8:[function(require,module,exports){
/**
 * Created by alex on 30.07.2015.
 */

!function () {


    window.app = {};

    var Route = Backbone.Router.extend({
        initialize: function () {
            require('./libs');
            require('./core');
            require('./modules');

            Backbone.history.start();

            // this._demoMessage();
        },

        routes: {
            "help": "help",    // #help
            "token/:key": "token",
            "search/:query": "search",  // #search/kiwis
            "search/:query/p:page": "search"   // #search/kiwis/p7
        },
        help: function () {
            console.log('#help');
        },
        search: function (query, page) {
        },
        token: function (key) {
            app.events.channel('auth').trigger('change-password', key);
        },


        _demoMessage: function () {
            var i = 8,
                key,
                $el = app.message.send({
                    title: 'Демострация инфо сообщений',
                    content: 'Большинство погаснут через <b id="testTime">' + i + '</b> секунд. Одно надо закрыть руками',
                    time: i * 1000
                    //animation: 1000
                });

            key = setInterval(function () {
                $el.find('#testTime').text(--i);
            }, 1000);

            $el.one('closed.bs.alert', function (e) {
                //alert('Окно закрыто !!!')
                clearInterval(key);
            });

            app.message.send({
                className: 'alert-info',
                title: 'Инфо сообщение',
                content: 'Нажми <span class="label label-primary">Alt-1, Alt-2, Alt-3</span> для просмотра подвала.</br><small> Меня надо закрыть руками. Нажми крестик</small>'
            });
            app.message.send({
                className: 'alert-danger',
                html: '<h1>Error</h1><p>Код ошибки:<code>522</code></p>',
                time: 4000,
                animation: 1000
            });
            app.message.send({
                className: 'alert-success',
                title: 'Все OK',
                content: 'Ура !!!',
                time: 2000
            });

        }
    });

    new Route();


}();


},{"./core":2,"./libs":15,"./modules":36}],9:[function(require,module,exports){
/**
 * Created by alex on 06.08.2015.
 */


// POPOVER MENU PUBLIC CLASS DEFINITION
+function ($) {
    'use strict';

    // POPOVER PUBLIC CLASS DEFINITION
    // ===============================

    var MenuPopover = function (element, options) {
        this.init('popover', element, options)
    }

    if (!$.fn.popover) throw new Error('Popover requires popover.js')

    MenuPopover.VERSION = '3.3.5'

    MenuPopover.DEFAULTS = $.extend({}, $.fn.popover.Constructor.DEFAULTS, {
        html: true,
        animation: false,
        placement: 'bottom',
        trigger: 'manual',
        container: 'body',
        content: '',
        template: $('#temp-menu-popover').html() || '<div class="popover" role="tooltip"><div class="arrow"></div><button class="close" type="button" style="margin-right:5px;">×</button><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
        viewport: {
            selector: 'body',
            padding: 5
        }
    })


    // NOTE: POPOVER EXTENDS tooltip.js
    // ================================

    MenuPopover.prototype = $.extend({}, $.fn.popover.Constructor.prototype)

    MenuPopover.prototype.constructor = MenuPopover

    MenuPopover.prototype.tip = function () {
        if (!this.$tip) {
            this.$tip = $(this.options.template)
            this.$tip.on('click','button.close', function(){
                this.hide();
            }.bind(this));
            if (this.$tip.length != 1) {
                throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
            }
        }
        return this.$tip
    };

    MenuPopover.prototype.getDefaults = function () {
        return MenuPopover.DEFAULTS;
    }

    // не меняем титле на this.$element
    MenuPopover.prototype.fixTitle = function () {
        //var $e = this.$element
        //if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
        //    $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
        //}
    }

    // перемещение меню при изменении позиции this.$element
    MenuPopover.prototype.mover = function(){
        var placement ='top';
        var $tip = this.$tip
            .detach()
            .css({top: 0, left: 0, display: 'block'})
            .addClass(placement)
            .data('bs.' + this.type, this)
        //debugger;
        this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
        //this.$element.trigger('inserted.bs.' + this.type)

        var pos = this.getPosition()
        var actualWidth = $tip[0].offsetWidth
        var actualHeight = $tip[0].offsetHeight

        if (true) {
            var orgPlacement = placement
            var viewportDim = this.getPosition(this.$viewport)

            placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top' :
                placement == 'top' && pos.top - actualHeight < viewportDim.top ? 'bottom' :
                    placement == 'right' && pos.right + actualWidth > viewportDim.width ? 'left' :
                        placement == 'left' && pos.left - actualWidth < viewportDim.left ? 'right' :
                            placement

            $tip
                .removeClass(orgPlacement)
                .addClass(placement)
        }

        var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

        this.applyPlacement(calculatedOffset, placement)
    };



    // POPOVER PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.popover')
            var options = typeof option == 'object' && option

            if (!data && /destroy|hide/.test(option)) return
            if (!data) $this.data('bs.popover', (data = new MenuPopover(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.popover

    $.fn.menuPopover = Plugin
    $.fn.menuPopover.Constructor = MenuPopover


    // POPOVER NO CONFLICT
    // ===================

    $.fn.menuPopover.noConflict = function () {
        $.fn.menuPopover = old
        return this
    }

}(jQuery);

},{}],10:[function(require,module,exports){
/**
 * Created by Александр on 08.08.2015.
 * Расширения библиотек вендоров
 */

require('./bootstrap.ext.js');
require('./underscore.ext.js');
require('./leaflet.ext.js');
require('./validation.ext.js');

},{"./bootstrap.ext.js":9,"./leaflet.ext.js":11,"./underscore.ext.js":12,"./validation.ext.js":13}],11:[function(require,module,exports){
/**
 * Created by Александр on 08.08.2015.
 */

"use strict";

L.Icon.Default.imagePath = './images';
//  Расширение для конторола по центру
L.Map.include({
    _initControlPos: function () {
        var corners = this._controlCorners = {},
            l = 'leaflet-',
            container = this._controlContainer = L.DomUtil.create('div', l + 'control-container', this._container);

        function createCorner(vSide, hSide) {
            var className = l + vSide + ' ' + l + hSide;

            corners[vSide + hSide] = L.DomUtil.create('div', className, container);
        }

        createCorner('top', 'center'); // control in center  - поставить первым а то проблемы с IE9
        createCorner('top', 'left');
        createCorner('top', 'right');
        createCorner('bottom', 'left');
        createCorner('bottom', 'right');
    }
});

// Point
L.Point.prototype.division = function (point, k) {
    var d = -k / (k - 1);
    var x = (this.x + d * point.x) / (1 + d),
        y = (this.y + d * point.y) / (1 + d);
    return L.point(x, y);
};

L.Point.prototype.middle = function (point) {
    return this.division(point, 2)
};

L.Point.prototype.toLatLng = function (map) {
    return map.unproject(this);
};

//LatLng
L.LatLng.prototype.toPoint = function (map) {
    return map.project(this);
};
L.LatLng.prototype.angle = function (latLng, map) {
    var a = map.project(this),
        b = map.project(latLng);
    var angle = (Math.atan2(a.y - b.y, a.x - b.x) * 180 / Math.PI);
    return (angle + 270) % 360;
};
L.LatLng.prototype.middle = function (latLng, map) {
    var p1 = map.project(this),
        p2 = map.project(latLng);
    return map.unproject(p1._add(p2)._divideBy(2));
};

// Leaflet views for use model & collection Backbone

L.MarkerModel = L.Marker.extend({
    initialize: function (model, options) {
        this.model = model;
        L.MarkerModel.__super__.initialize.call(this, model.get('latlng'), options);
    },
    visible: function (value) {
        this._icon && $(this._icon).toggle(value);
    }
});
L.markerModel = function (model, options) {
    return new L.MarkerModel(model, options);
};

L.LayerModel = L.LayerGroup.extend({
    options: {},
    initialize: function (model, options) {
        this.model = model;
        L.LayerCollection.__super__.initialize.call(this,[], options);
    }
});

L.LayerCollection = L.LayerGroup.extend({
    options: {},
    initialize: function (collection, options) {
        this.collection = collection;
        L.LayerCollection.__super__.initialize.call(this,[], options);
    }
});
L.layerCollection = function (collection, options) {
    return new L.LayerCollection(collection, options);
};

L.CanvasTiles =  L.TileLayer.Canvas.extend({

    initialize: function (userDrawFunc, options,callContext) {
        this._userDrawFunc = userDrawFunc;
        this._callContext = callContext;
        L.setOptions(this, options);

        var self = this;
        this.drawTile = function (tileCanvas, tilePoint, zoom) {

            this._draw(tileCanvas, tilePoint, zoom);
            if (self.options.debug) {
                self._drawDebugInfo(tileCanvas, tilePoint, zoom);
            }

        };
        return this;
    },

    drawing: function (userDrawFunc) {
        this._userDrawFunc = userDrawFunc;
        return this;
    },

    params: function (options) {
        L.setOptions(this, options);
        return this;
    },

    addTo: function (map) {
        map.addLayer(this);
        return this;
    },

    _drawDebugInfo: function (tileCanvas, tilePoint, zoom) {

        var max = this.options.tileSize;
        var g = tileCanvas.getContext('2d');
        g.globalCompositeOperation = 'destination-over';
        g.strokeStyle = '#FFFFFF';
        g.fillStyle = '#FFFFFF';
        g.strokeRect(0, 0, max, max);
        g.font = "12px Arial";
        g.fillRect(0, 0, 5, 5);
        g.fillRect(0, max - 5, 5, 5);
        g.fillRect(max - 5, 0, 5, 5);
        g.fillRect(max - 5, max - 5, 5, 5);
        g.fillRect(max / 2 - 5, max / 2 - 5, 10, 10);
        g.strokeText(tilePoint.x + ' ' + tilePoint.y + ' ' + zoom, max / 2 - 30, max / 2 - 10);

    },

    /**
     * Transforms coordinates to tile space
     */
    tilePoint: function (map, coords,tilePoint, tileSize) {
        // start coords to tile 'space'
        var s = tilePoint.multiplyBy(tileSize);

        // actual coords to tile 'space'
        var p = map.project(new L.LatLng(coords[0], coords[1]));

        // point to draw
        var x = Math.round(p.x - s.x);
        var y = Math.round(p.y - s.y);
        return {x: x,
            y: y};
    },
    /**
     * Creates a query for the quadtree from bounds
     */
    _boundsToQuery: function (bounds) {
        if (bounds.getSouthWest() == undefined) { return { x: 0, y: 0, width: 0.1, height: 0.1 }; }  // for empty data sets
        return {
            x: bounds.getSouthWest().lng,
            y: bounds.getSouthWest().lat,
            width: bounds.getNorthEast().lng - bounds.getSouthWest().lng,
            height: bounds.getNorthEast().lat - bounds.getSouthWest().lat
        };
    },

    _draw: function (tileCanvas, tilePoint, zoom) {

        var tileSize = this.options.tileSize;

        var nwPoint = tilePoint.multiplyBy(tileSize);
        var sePoint = nwPoint.add(new L.Point(tileSize, tileSize));


        // padding to draw points that overlap with this tile but their center is in other tile
        var pad = new L.Point(this.options.padding, this.options.padding);

        nwPoint = nwPoint.subtract(pad);
        sePoint = sePoint.add(pad);

        var bounds = new L.LatLngBounds(this._map.unproject(sePoint), this._map.unproject(nwPoint));
        var zoomScale  = 1 / ((40075016.68 / tileSize) / Math.pow(2, zoom));
        // console.time('process');

        if (this._userDrawFunc) {
            this._userDrawFunc.call(
                this._callContext,
                this,
                {
                    canvas: tileCanvas,
                    tilePoint: tilePoint,
                    bounds: bounds,
                    size: tileSize,
                    zoomScale: zoomScale,
                    zoom: zoom,
                    options: this.options,
                }
            );
        }


        // console.timeEnd('process');


    }


});

L.canvasTiles = function (userDrawFunc, options, callContext) {
    return new L.CanvasTiles(userDrawFunc, options, callContext);
};


},{}],12:[function(require,module,exports){
/**
 * Created by alex on 06.08.2015.
 */


_.templateSettings = {
    evaluate    : /\{\{([\s\S]+?)\}\}/g,
    interpolate : /\{\{=([\s\S]+?)\}\}/g,
    escape      : /\{\{-([\s\S]+?)\}\}/g
};

_.deferContext =function(func, context){
    return _.defer(func.bind(context));
};
},{}],13:[function(require,module,exports){
/**
 * Created by ��������� on 13.09.2015.
 */

_.extend(Backbone.Validation.callbacks, {
    valid: function (view, attr, selector) {
        var control, group;

        control = view.$('[' + selector + '=' + attr + ']')
        group = control.parents('.form-group')
        group.removeClass('has-error')

        if (control.data('error-style') == 'tooltip') {
            // CAUTION: calling tooltip('hide') on an uninitialized tooltip
            // causes bootstraps tooltips to crash somehow...
            control.tooltip('hide')
        }
        if (control.data('tooltip')) {
        }
        else if (control.data('error-style') == 'inline') {
            group.find('.help-inline.error-message').remove();
        } else {
            group.find('.help-block.error-message').remove()
            control = view.$('[' + selector + '=' + attr + ']');
            group = control.parents(".control-group");
            group.removeClass("error");
        }
    },
    invalid: function (view, attr, error, selector) {
        var control, group, position, target;

        control = view.$('[' + selector + '=' + attr + ']');
        group = control.parents('.form-group');
        group.addClass('has-error');

        if (control.data('error-style') == 'tooltip') {
            position = control.data('tooltip-position') || 'right';
            control.tooltip({
                placement: position,
                trigger: 'manual',
                title: error
            });
            control.tooltip('show');
        } else if (control.data('error-style') == 'inline') {
            if (group.find('.help-inline').length == 0) {
                group.find('.form-control').after('<span class=\'help-inline error-message\'></span>')
            }
            target = group.find('.help-inline');
            target.text(error);
        } else {
            if (group.find('.help-block').length == 0) {
                group.find('.form-control').after('<p class=\'help-block error-message\'></p>')
            }
            target = group.find('.help-block')
            target.text(error)
        }
    },
});

_.extend(Backbone.Validation.validators, {
    // ��������� �������� �� �������
    remote: function (value, attr, customValue, model, state) {
        var err = state[model.remoteField];
        if (err) {
            if (customValue.fn)
                return customValue.fn(err, model, state);

            if (!customValue.status)
                return err.statusText;

            if (err.status === customValue.status)
                customValue.mes;

        }
    },
    remoteErr400: function (value, attr, customValue, model, state) {
        var err = state[model.remoteField];
        if (err && err.status === 400)
            return  customValue.mes || err.responseJSON.errors[attr];
    }

});
},{}],14:[function(require,module,exports){
/**
 * Created by alex on 10.08.2015.
 */

//var events = require('../../core/events').channel('screen');


var View = Backbone.View.extend({
    el: $('#temp-footer').html(),
    height: 30,
    maxHeight: 50,
    minHeight: 20,
    winHeight: $(window).height(),

    events: {
        'click button.close': 'onClose',
        'mousedown div.map-footer-resize-vertical': 'onMousedown'
    },

    initialize: function (options) {
        options.keyPress && $(document).keydown(options.keyPress, this.onKeypress.bind(this));
        options.content && this.$el.append(options.content);
        options.height && (this.height = options.height);
        options.minHeight && (this.minHeight = options.minHeight);
        options.maxHeight && (this.maxHeight = options.maxHeight);
        this.options = options;

        //events.on('resize:end', this.onResize, this);
        //this.on('open', this.onOpen, this);
    },

    isDom: function () {
        return !!this.$el.parent().length;
    },
    sizeHeight: function (y) {
        var h = 100 - (y / this.winHeight * 100) | 0;
        if (h < this.maxHeight && h > this.minHeight) {
            this.height = h;
            this.$el.css({height: this.height + '%'});
            this.trigger('resize', this.height, this);
        }
    },
    close: function (isNotEvent) {
        this.$el.css({height: 0}).detach();
        !isNotEvent && this.trigger('close', 0, this);
    },
    open: function () {
        this.$el
            .css({height: this.height + '%'})
            .appendTo('body');
        this.trigger('open', this.height, this);
    },

    onKeypress: function (e) {
        if (e.altKey && e.which == e.data.charCodeAt()) {
            if (this.isDom())
                this.close();
            else
                this.open();
        }
    },
    onClose: function (e) {
        this.close();
    },
    onOpen: function (h, that) {
        // если открылся другой футер то закрыть этот
        this.isDom() && that !== this && this.close(true);
    },
    onResize: function(){
        this.winHeight = $(window).height();
    },

    onMousedown: function (e) {
        $(document).on('mousemove.' + this.cid, this.onMousemove.bind(this));
        $(document).one('mouseup.' + this.cid, this.onMouseup.bind(this));
        e.preventDefault();
    },
    onMouseup: function (e) {
        $(document).off('mousemove.' + this.cid); // убираем событие при перемещении мыши
        e.preventDefault();
    },
    onMousemove: function (e) {
        var y = e.pageY;
        y && this.sizeHeight(y);
        e.preventDefault();
    }
});

module.exports = View;


},{}],15:[function(require,module,exports){
/**
 * Created by alex on 07.08.2015.
 */

require('./extend');
require('./plugins');



},{"./extend":10,"./plugins":30}],16:[function(require,module,exports){
/**
 * Created by alex on 28.08.2015.
 */

var Collection = Backbone.Collection.extend({
    url :null,
    model: require('./model'),
    initialize: function (options) {
        this.type = options.type;
    },

    isFilter: function (item) {
        return true;
    },
    isReady: function () {
        return this.ready && this.ready.state() === 'resolved';
    },
    findBounds: function (bounds, isFilter) {
        return this.filter(function (model) {
            return (isFilter || this.isFilter)(model) && model.isBounds(bounds);
        }, this);
    },
    load: function () {
        return this.ready = this.fetch();
    }
 });

module.exports = Collection;


},{"./model":18}],17:[function(require,module,exports){
/**
 * Created by alex on 03.09.2015.
 * Классы для манипулирования layers на карте
 * загрузка и отображение в границах экрана
 */

var Layers = L.LayerGroup.extend({
    initialize: function (views) {
        Layers.__super__.initialize.call(this, []);
        this.types = {};
        [].concat(views).forEach(this.addTypes, this);
    },
    onActive: function (types) {
        for(var type in types)
            this.types[type] && this._toggleLayer(this.types[type], types[type]);
    },
    addTypes: function (layer) {
        this.types[layer.getType()] = layer;
    },

    _toggleLayer: function (layer, value) {
        if (value) {
            !layer._map && this.addLayer(layer);
        } else {
            layer._map && this.removeLayer(layer);
        }
    }
});


module.exports= Layers;
},{}],18:[function(require,module,exports){
/**
 * Created by alex on 31.08.2015.
 */

var Model = Backbone.Model.extend({
    coordName: 'position',
    initialize: function (item) {
       Model.__super__.initialize.apply(this, arguments);
    },
    isBounds: function (bounds) {
        throw Error('переопределите  метод');
    }

});

module.exports = Model;
},{}],19:[function(require,module,exports){
/**
 * Created by NBP100083 on 26.08.2015.
 */

var View = L.LayerGroup.extend({
    _debug: false,
    options: {
        layer: {}
    },
    initialize: function (collection, options) {
        View.__super__.initialize.call(this, []);
        L.Util.setOptions(this, options);
        this.collection = collection;

    },
    onAdd: function (map) {
        View.__super__.onAdd.apply(this, arguments);

        setTimeout(function () {
            this._map.on('moveend', this.onRefresh, this);
        }.bind(this));

        if (this.collection.isReady())
            this.render();
        else
            this.collection.load().done(this.onRefresh.bind(this));

    },
    onRemove: function () {
        this._map.off('moveend', this.onRefresh, this);
        this.eachLayer(this.removeLayer, this);
        View.__super__.onRemove.apply(this, arguments);
    },
    onRefresh: function () {
        this.collection.isReady() && this.render();
    },

    render: function () {
        if(this._debug) {
            console.group(this.collection.type);
            console.time('time');
        }

        var bounds = this._map.getBounds();
        this._addLayersInBounds(bounds)
            ._removeLayersOutBounds(bounds);

        if(this._debug) {
            console.timeEnd('time')
            console.groupEnd();
        }
    },
    create: function (item) {

    },
    getType: function(){
        return this.collection.type;
    },

    _removeLayersOutBounds: function (bounds) {
        // удалить все layers за пределами экрана
        var list = this.getLayers()
            .filter(function (layer) {
                return !layer.model.isBounds(bounds);
            });
        list.forEach(this.removeLayer, this);
        this._debug && console.log('Remove: %s. Total: %s', list.length, this.getLayers().length);
        return this;
    },
    _addLayersInBounds: function (bounds) {
        // добавить все layers которых еще нет на экране.

        var list = this.collection.findBounds(bounds);

        list = list.filter(function (model) {
            return !this._getLayersModel().some(function (modelLayer) {
                return modelLayer.id === model.id;
            });
        }, this);

        list.forEach(this.create, this);

        this._debug && console.log('Add: %s', list.length);
        return this;
    },
    _getLayersModel: function () {
        return this.getLayers().map(function (layer) {
            return layer.model;
        });
    }


});

module.exports = View;
},{}],20:[function(require,module,exports){
/**
 * Created by alex on 14.09.2015.
 */

var Mask = Backbone.View.extend({
    classMask: 'map-loading-mask',
    tempMessage: $('#temp-mask-message').html(),
    initialize: function () {

    },
    start: function () {
        this._setMask(true);
    },
    end: function (time, callback, context) {
        setTimeout(function () {
            this._setMask(false);
            callback && callback.call(context);
        }.bind(this), time || 0);

    },

    _setMask: function (value) {
        this.$el.toggleClass(this.classMask, value);
        this.$el.find('input').prop("disabled", value);
        this.$el.find('button').prop("disabled", value);
        if (value)
            this.$el.parent().append(this.tempMessage);
        else
            this.$el.parent().find('.map-loading-mask-message').remove();
    }
});

module.exports = Mask;
},{}],21:[function(require,module,exports){
/**
 * Created by alex on 30.07.2015.
 */


var Button = L.Control.extend({
    options: {
        hide: false,
        position: 'topleft',
        className: 'map-menu-button'
    },
    includes: L.Mixin.Events,
    initialize: function (options) {
        L.Control.prototype.initialize.apply(this, arguments);
        this.id = options.id;
        this._create(this.options);
    },

    onAdd: function (map) {
        setTimeout(this._centerVertical.bind(this), 0);
        this.fire('add', {map: map});
        return this.el;
    },

    setVisible: function (value) {
        this.$el.toggle(value);
        this.options.hide =!value;
        return this;
    },
    isVisible: function (value) {
        return this.$el.is(':visible');
    },

    onClick: function (e) {
        // клик на кнонку
        this.fire('click', e);

    },

    _create: function (options) {
        var el = this.el = L.DomUtil.create('div', options.className);

        var stop = L.DomEvent.stopPropagation;
        L.DomEvent
            .on(el, 'contextmenu', stop)
            .on(el, 'contextmenu', L.DomEvent.preventDefault)
            .on(el, 'click', stop)
            .on(el, 'mousedown', stop)
            .on(el, 'dblclick', stop)
            .on(el, 'click', L.DomEvent.preventDefault)
            .on(el, 'click', this.onClick, this)
            .on(el, 'click', this._refocusOnMap, this);

        this.$el = $(el).attr({
            id: options.id,
            title: options.title
        });
        options.icon && this.$el.append(options.icon);
        return el;
    },
    _centerVertical: function () {
        var $icon = this.$el.find('.map-menu-button-icon');
        if ($icon.length)
            $icon.css({
                marginTop: (this.$el.height() - $icon.height()) / 2
            })
    }
});

module.exports = Button;




},{}],22:[function(require,module,exports){
/**
 * Created by alex on 30.07.2015.
 *  Классы гланого меню - кнопки в верхней части карты
 */

module.exports = {
    Button: require('./button'),
    Popover: require('./popover'),
    Menu: require('./menu'),
    Manager:  require('./manager')
};




},{"./button":21,"./manager":23,"./menu":24,"./popover":25}],23:[function(require,module,exports){
/**
 * Created by alex on 30.07.2015.
 *  Классы гланого меню - кнопки в верхней части карты
 */
var Menu = require('./menu');

var Manager = L.Class.extend({
    menuActive: null,
    includes: L.Mixin.Events,
    initialize: function (menus, options) {
        this.menus = [];
    },
    add: function (menus) {
        this.menus = this.menus.concat([].concat(menus).map(this._createMenu, this));
    },

    get: function(id){
        return this._findMenu(id);
    },
    render: function (map) {
        this.menus.forEach(function (menu) {
            menu.button.addTo(map);
            menu.button.options.hide && menu.button.setVisible(!menu.button.options.hide);
        });
    },
    setVisible: function (id, value) {
        var menu = id instanceof Menu ? id : this._findMenu(id);
        if (menu) {
            !value && menu.setActive(value);
            menu.button.setVisible(value)
        }
    },
    setActive: function (id, value) {
        var menu = id instanceof Menu ? id : this._findMenu(id);
        menu && menu.setActive(value);
        return this;
    },
    onActive: function (e) {
        if (e.status) {
            this.menuActive && this.menuActive.setActive(false);
            this.menuActive = e.target;
        } else {
            if (this.menuActive === e.target)
                this.menuActive = null;
        }
    },

    _findMenu: function (id) {
        return _.findWhere(this.menus, {id: id});
    },
    _createMenu: function (_menu) {
        var menu = menu instanceof Menu ? menu : new Menu(_menu);
        menu.on('active', this.onActive, this);

        return menu;

    }
});

module.exports = Manager;




},{"./menu":24}],24:[function(require,module,exports){
/**
 * Created by Александр on 09.08.2015.
 * Содеожит в себе связку кнопка и поповер
 */
var events = app.events,
    Button = require('./button'),
    Popover = require('./popover');


module.exports = L.Class.extend({
    includes: L.Mixin.Events,
    initialize: function (options) {
        this.id= options.id,
        this.isActive = false;
        this.button = new Button(_.omit(options, 'popover'));
        if (options.popover) {
            this.popover = new Popover(this.button.el, options.popover)
                .on('open', this.onOpen, this)
                .on('close', this.onClose, this)
        }

        this.button
            .on('add', this.onAdd, this)
            .on('click', this.onClick, this);
    },
    onOpen: function () {
        this.isActive = true;
        this.fire('active', {status: true});
    },
    onClose: function () {
        this.isActive = false;
        this.fire('active', {status: false});
    },
    onClick: function (e) {
        this.setActive();
    },
    onAdd: function (e) {
        this.popover._map = e.map;
        this.popover._mover();
    },
    setActive: function (value) {
        var isActive = value === undefined ? !this.isActive : value;
        if (this.popover) {
            this.popover[isActive ? 'show' : 'hide']();
        }
        return this;
    }

    //setVisible: function (value) {
    //    this.$el.toggle(value);
    //    events.channel('menu').trigger('visible', {
    //        button: this,
    //        visible: value
    //    });
    //    return this;
    //},
    //isVisible: function (value) {
    //    return this.$el.is(':visible');
    //},


});
},{"./button":21,"./popover":25}],25:[function(require,module,exports){
/**
 * Created by alex on 30.07.2015.
 */

var screenEvents = app.events.channel('screen');

var Popover = L.Class.extend({
    options: {
        content: 'test'
    },
    includes: L.Mixin.Events,
    initialize: function (target, options) {
        this.target = target;
        this.$target = $(target);
        L.Util.setOptions(this, options);

        if (this.options.view)
            this.options.content = this.options.view.el;

        this._create(this.options);
        //this._mover(true);
    },

    isOpen: function () {
        return !!this.$target.attr('aria-describedby');
    },

    show: function () {
        this.$target.popover('show');
    },
    hide: function () {
        this.$target.popover('hide');
    },
    toggle: function () {
        this.$target.popover('toggle');
    },

    _create: function (options) {
        this._popover = this.$target.menuPopover(options)
            .on('show.bs.popover hide.bs.popover', function (e) {
                this.fire(e.type === 'show' ? 'open' : 'close');
            }.bind(this))
            .data('bs.popover');
    },
    _mover: function (isMover) {
        this._map.on('resize', function (e) {
            this.isOpen() && this._popover.mover();
        }.bind(this));
        //if (isMover) {
        //    this._map.on('resize', function (e) {
        //        this.isOpen() && this._popover.mover();
        //    }.bind(this));
        //} else {
        //    this._map..on('resize:start', function (e) {
        //        if (this.isOpen()) {
        //            this.hide();
        //            screenEvents.once('resize:end', function (e) {
        //                this.show();
        //            }, this);
        //        }
        //    }, this);
        //}
    }

});

module.exports = Popover;




},{}],26:[function(require,module,exports){


L.Control.Locate = L.Control.extend({
    options: {
        position: 'bottomleft',
        className: 'map-locate'
    },
    includes: L.Mixin.Events,
    initialize: function (options) {
        L.Control.prototype.initialize.apply(this, arguments);
    },

    onAdd: function (map) {
        this._map = map;
        var el = this.el = L.DomUtil.create('div', this.options.className);

        var stop = L.DomEvent.stopPropagation;
        L.DomEvent
            .on(el, 'contextmenu', stop)
            .on(el, 'contextmenu', L.DomEvent.preventDefault)
            .on(el, 'click', stop)
            .on(el, 'mousedown', stop)
            .on(el, 'dblclick', stop)
            .on(el, 'click', L.DomEvent.preventDefault)
            .on(el, 'click', this.onClick, this)
            .on(el, 'click', this._refocusOnMap, this);

        this.$el = $(el).attr({
            id: this.options.id,
            title: this.options.title
        });
        this.options.icon && this.$el.append(this.options.icon);
        map
            .on("locationfound", this.onLocationFound, this)
            .on("locationerror", this.onLocationError, this);
        return el;
    },
    onClick: function (e) {
        // клик на кнонку
        this._map.locate();

    },
    onLocationFound:function(e){
        this._map.setView(e.latlng);
        this.fire('location', e);
        var marker = L.marker(e.latlng).addTo(this._map);
        setTimeout(function () {
            this._map.removeLayer(marker);
        }.bind(this),3000);
    },
    onLocationError: function (e) {
        console.log(e);
    }
});

L.control.locate = function (щзешщты) {
    return new L.Control.Locate();
};



},{}],27:[function(require,module,exports){
L.Control.MousePosition = L.Control.extend({
    options: {
        position: 'bottomleft',
        separator: ' : ',
        emptyString: 'Unavailable',
        lngFirst: false,
        numDigits: 5,
        lngFormatter: undefined,
        latFormatter: undefined,
        prefix: ""
    },

    onAdd: function (map) {
        var el = this._container = L.DomUtil.create('div', 'leaflet-control-mouseposition');
        L.DomEvent
            .on(el, 'contextmenu', L.DomEvent.stopPropagation)
            .on(el, 'contextmenu', L.DomEvent.preventDefault);

        L.DomEvent.disableClickPropagation(this._container);

        map.on('mousemove', this._onMouseMove, this);
        this._container.innerHTML = this.options.emptyString;
        return this._container;
    },

    onRemove: function (map) {
        map.off('mousemove', this._onMouseMove)
    },

    _onMouseMove: function (e) {
        var lng = this.options.lngFormatter ? this.options.lngFormatter(e.latlng.lng) : L.Util.formatNum(e.latlng.lng, this.options.numDigits);
        var lat = this.options.latFormatter ? this.options.latFormatter(e.latlng.lat) : L.Util.formatNum(e.latlng.lat, this.options.numDigits);
        var value = this.options.lngFirst ? lng + this.options.separator + lat : lat + this.options.separator + lng;
        var prefixAndValue = this.options.prefix + ' ' + value;
        this._container.innerHTML = prefixAndValue;
    }

});

L.Map.mergeOptions({
    positionControl: false
});

L.Map.addInitHook(function () {
    if (this.options.positionControl) {
        this.positionControl = new L.Control.MousePosition();
        this.addControl(this.positionControl);
    }
});

L.control.mousePosition = function (options) {
    return new L.Control.MousePosition(options);
};

},{}],28:[function(require,module,exports){
// This file is part of Leaflet.Geodesic.
// Copyright (C) 2014  Henry Thasler
// based on code by Chris Veness Copyright (C) 2014 https://github.com/chrisveness/geodesy
// 
// Leaflet.Geodesic is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// Leaflet.Geodesic is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with Leaflet.Geodesic.  If not, see <http://www.gnu.org/licenses/>.


/** Extend Number object with method to convert numeric degrees to radians */
if (typeof Number.prototype.toRadians == 'undefined') {
    Number.prototype.toRadians = function () {
        return this * Math.PI / 180;
    }
}

/** Extend Number object with method to convert radians to numeric (signed) degrees */
if (typeof Number.prototype.toDegrees == 'undefined') {
    Number.prototype.toDegrees = function () {
        return this * 180 / Math.PI;
    }
}

var INTERSECT_LNG = 179.999;	// Lng used for intersection and wrap around on map edges 

L.Geodesic = L.MultiPolyline.extend({
    options: {
        color: 'blue',
        steps: 10,
        dash: 1,
        wrap: true
    },

    initialize: function (latlngs, options) {
        this.options = this._merge_options(this.options, options);
        this.datum = {};
        this.datum.ellipsoid = {a: 6378137, b: 6356752.3142, f: 1 / 298.257223563};	 // WGS-84
        L.MultiPolyline.prototype.initialize.call(this, latlngs, this.options);
    },

    setLatLngs: function (latlngs) {
        this._latlngs = (this.options.dash < 1) ? this._generate_GeodesicDashed(latlngs) : this._generate_Geodesic(latlngs);
        L.MultiPolyline.prototype.setLatLngs.call(this, this._latlngs);
    },

    /**
     * Calculates some statistic values of current geodesic multipolyline
     * @returns (Object} Object with several properties (e.g. overall distance)
     */
    getStats: function () {
        var obj = {
            distance: 0,
            points: 0,
            polygons: this._latlngs.length
        }, poly, points;

        for (poly = 0; poly < this._latlngs.length; poly++) {
            obj.points += this._latlngs[poly].length;
            for (points = 0; points < (this._latlngs[poly].length - 1); points++) {
                obj.distance += this._vincenty_inverse(this._latlngs[poly][points], this._latlngs[poly][points + 1]).distance;
            }
        }
        return obj;
    },

    /**
     * Creates a great circle. Replaces all current lines.
     * @param {Object} center - geographic position
     * @param {number} radius - radius of the circle in meters
     */
    createCircle: function (center, radius) {
        var _geo = [], _geocnt = 0;
        var prev = {lat: 0, lng: 0, brg: 0};//new L.LatLng(0, 0);
        var s;

        _geo[_geocnt] = [];

        var direct = this._vincenty_direct(L.latLng(center), 0, radius, this.options.wrap);
        prev = L.latLng(direct.lat, direct.lng);
        _geo[_geocnt].push(prev);
        for (s = 1; s <= this.options.steps;) {
            direct = this._vincenty_direct(L.latLng(center), 360 / this.options.steps * s, radius, this.options.wrap);
            var gp = L.latLng(direct.lat, direct.lng);
            if (Math.abs(gp.lng - prev.lng) > 180) {
                var inverse = this._vincenty_inverse(prev, gp);
                var sec = this._intersection(prev, inverse.initialBearing, {
                    lat: -89,
                    lng: ((gp.lng - prev.lng) > 0) ? -INTERSECT_LNG : INTERSECT_LNG
                }, 0);
                if (sec) {
                    _geo[_geocnt].push(L.latLng(sec.lat, sec.lng));
                    _geocnt++;
                    _geo[_geocnt] = [];
                    prev = L.latLng(sec.lat, -sec.lng);
                    _geo[_geocnt].push(prev);
                }
                else {
                    _geocnt++;
                    _geo[_geocnt] = [];
                    _geo[_geocnt].push(gp);
                    prev = gp;
                    s++;
                }
            }
            else {
                _geo[_geocnt].push(gp);
                prev = gp;
                s++;
            }
        }

        this._latlngs = _geo;
        L.MultiPolyline.prototype.setLatLngs.call(this, this._latlngs);
    },

    /**
     * Creates a geodesic MultiPolyline from given coordinates
     * @param {Object} latlngs - One or more polylines as an array. See Leaflet doc about MultiPolyline
     * @returns (Object} An array of arrays of geographical points.
     */
    _generate_Geodesic: function (latlngs) {
        var _geo = [], _geocnt = 0, s, poly, points;
//      _geo = latlngs;		// bypass

        for (poly = 0; poly < latlngs.length; poly++) {
            _geo[_geocnt] = [];
            for (points = 0; points < (latlngs[poly].length - 1); points++) {
                var inverse = this._vincenty_inverse(L.latLng(latlngs[poly][points]), L.latLng(latlngs[poly][points + 1]));
                var prev = L.latLng(latlngs[poly][points]);
                _geo[_geocnt].push(prev);
                for (s = 1; s <= this.options.steps;) {
                    var direct = this._vincenty_direct(L.latLng(latlngs[poly][points]), inverse.initialBearing, inverse.distance / this.options.steps * s, this.options.wrap);
                    var gp = L.latLng(direct.lat, direct.lng);
                    if (Math.abs(gp.lng - prev.lng) > 180) {
                        var sec = this._intersection(L.latLng(latlngs[poly][points]), inverse.initialBearing, {
                            lat: -89,
                            lng: ((gp.lng - prev.lng) > 0) ? -INTERSECT_LNG : INTERSECT_LNG
                        }, 0);
                        if (sec) {
                            _geo[_geocnt].push(L.latLng(sec.lat, sec.lng));
                            _geocnt++;
                            _geo[_geocnt] = [];
                            prev = L.latLng(sec.lat, -sec.lng);
                            _geo[_geocnt].push(prev);
                        }
                        else {
                            _geocnt++;
                            _geo[_geocnt] = [];
                            _geo[_geocnt].push(gp);
                            prev = gp;
                            s++;
                        }
                    }
                    else {
                        _geo[_geocnt].push(gp);
                        prev = gp;
                        s++;
                    }
                }
            }
            _geocnt++;
        }
        return _geo;
    },


    /**
     * Creates a dashed geodesic MultiPolyline from given coordinates - under work
     * @param {Object} latlngs - One or more polylines as an array. See Leaflet doc about MultiPolyline
     * @returns (Object} An array of arrays of geographical points.
     */
    _generate_GeodesicDashed: function (latlngs) {
        var _geo = [], _geocnt = 0, s, poly, points;
//      _geo = latlngs;		// bypass

        for (poly = 0; poly < latlngs.length; poly++) {
            _geo[_geocnt] = [];
            for (points = 0; points < (latlngs[poly].length - 1); points++) {
                var inverse = this._vincenty_inverse(L.latLng(latlngs[poly][points]), L.latLng(latlngs[poly][points + 1]));
                var prev = L.latLng(latlngs[poly][points]);
                _geo[_geocnt].push(prev);
                for (s = 1; s <= this.options.steps;) {
                    var direct = this._vincenty_direct(L.latLng(latlngs[poly][points]), inverse.initialBearing, inverse.distance / this.options.steps * s - inverse.distance / this.options.steps * (1 - this.options.dash), this.options.wrap);
                    var gp = L.latLng(direct.lat, direct.lng);
                    if (Math.abs(gp.lng - prev.lng) > 180) {
                        var sec = this._intersection(L.latLng(latlngs[poly][points]), inverse.initialBearing, {
                            lat: -89,
                            lng: ((gp.lng - prev.lng) > 0) ? -INTERSECT_LNG : INTERSECT_LNG
                        }, 0);
                        if (sec) {
                            _geo[_geocnt].push(L.latLng(sec.lat, sec.lng));
                            _geocnt++;
                            _geo[_geocnt] = [];
                            prev = L.latLng(sec.lat, -sec.lng);
                            _geo[_geocnt].push(prev);
                        }
                        else {
                            _geocnt++;
                            _geo[_geocnt] = [];
                            _geo[_geocnt].push(gp);
                            prev = gp;
                            s++;
                        }
                    }
                    else {
                        _geo[_geocnt].push(gp);
                        _geocnt++;
                        var direct2 = this._vincenty_direct(L.latLng(latlngs[poly][points]), inverse.initialBearing, inverse.distance / this.options.steps * s, this.options.wrap);
                        _geo[_geocnt] = [];
                        _geo[_geocnt].push(L.latLng(direct2.lat, direct2.lng));
                        s++;
                    }
                }
            }
            _geocnt++;
        }
        return _geo;
    },


    /**
     * Vincenty direct calculation.
     * based on the work of Chris Veness (https://github.com/chrisveness/geodesy)
     *
     * @private
     * @param {number} initialBearing - Initial bearing in degrees from north.
     * @param {number} distance - Distance along bearing in metres.
     * @returns (Object} Object including point (destination point), finalBearing.
     */
    _vincenty_direct: function (p1, initialBearing, distance, wrap) {
        var φ1 = p1.lat.toRadians(), λ1 = p1.lng.toRadians();
        var α1 = initialBearing.toRadians();
        var s = distance;

        var a = this.datum.ellipsoid.a, b = this.datum.ellipsoid.b, f = this.datum.ellipsoid.f;

        var sinα1 = Math.sin(α1);
        var cosα1 = Math.cos(α1);

        var tanU1 = (1 - f) * Math.tan(φ1), cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)), sinU1 = tanU1 * cosU1;
        var σ1 = Math.atan2(tanU1, cosα1);
        var sinα = cosU1 * sinα1;
        var cosSqα = 1 - sinα * sinα;
        var uSq = cosSqα * (a * a - b * b) / (b * b);
        var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
        var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));

        var σ = s / (b * A), σʹ, iterations = 0;
        do {
            var cos2σM = Math.cos(2 * σ1 + σ);
            var sinσ = Math.sin(σ);
            var cosσ = Math.cos(σ);
            var Δσ = B * sinσ * (cos2σM + B / 4 * (cosσ * (-1 + 2 * cos2σM * cos2σM) -
                B / 6 * cos2σM * (-3 + 4 * sinσ * sinσ) * (-3 + 4 * cos2σM * cos2σM)));
            σʹ = σ;
            σ = s / (b * A) + Δσ;
        } while (Math.abs(σ - σʹ) > 1e-12 && ++iterations);

        var x = sinU1 * sinσ - cosU1 * cosσ * cosα1;
        var φ2 = Math.atan2(sinU1 * cosσ + cosU1 * sinσ * cosα1, (1 - f) * Math.sqrt(sinα * sinα + x * x));
        var λ = Math.atan2(sinσ * sinα1, cosU1 * cosσ - sinU1 * sinσ * cosα1);
        var C = f / 16 * cosSqα * (4 + f * (4 - 3 * cosSqα));
        var L = λ - (1 - C) * f * sinα *
            (σ + C * sinσ * (cos2σM + C * cosσ * (-1 + 2 * cos2σM * cos2σM)));

        if (wrap)
            var λ2 = (λ1 + L + 3 * Math.PI) % (2 * Math.PI) - Math.PI; // normalise to -180...+180
        else
            var λ2 = (λ1 + L); // do not normalize

        var revAz = Math.atan2(sinα, -x);

        return {
            lat: φ2.toDegrees(),
            lng: λ2.toDegrees(),
            finalBearing: revAz.toDegrees()
        };
    },

    /**
     * Vincenty inverse calculation.
     * based on the work of Chris Veness (https://github.com/chrisveness/geodesy)
     *
     * @private
     * @param {LatLng} p1 - Latitude/longitude of start point.
     * @param {LatLng} p2 - Latitude/longitude of destination point.
     * @returns {Object} Object including distance, initialBearing, finalBearing.
     * @throws {Error} If formula failed to converge.
     */
    _vincenty_inverse: function (p1, p2) {
        var φ1 = p1.lat.toRadians(), λ1 = p1.lng.toRadians();
        var φ2 = p2.lat.toRadians(), λ2 = p2.lng.toRadians();

        var a = this.datum.ellipsoid.a, b = this.datum.ellipsoid.b, f = this.datum.ellipsoid.f;

        var L = λ2 - λ1;
        var tanU1 = (1 - f) * Math.tan(φ1), cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)), sinU1 = tanU1 * cosU1;
        var tanU2 = (1 - f) * Math.tan(φ2), cosU2 = 1 / Math.sqrt((1 + tanU2 * tanU2)), sinU2 = tanU2 * cosU2;

        var λ = L, λʹ, iterations = 0;
        do {
            var sinλ = Math.sin(λ), cosλ = Math.cos(λ);
            var sinSqσ = (cosU2 * sinλ) * (cosU2 * sinλ) + (cosU1 * sinU2 - sinU1 * cosU2 * cosλ) * (cosU1 * sinU2 - sinU1 * cosU2 * cosλ);
            var sinσ = Math.sqrt(sinSqσ);
            if (sinσ == 0) return 0;  // co-incident points
            var cosσ = sinU1 * sinU2 + cosU1 * cosU2 * cosλ;
            var σ = Math.atan2(sinσ, cosσ);
            var sinα = cosU1 * cosU2 * sinλ / sinσ;
            var cosSqα = 1 - sinα * sinα;
            var cos2σM = cosσ - 2 * sinU1 * sinU2 / cosSqα;
            if (isNaN(cos2σM)) cos2σM = 0;  // equatorial line: cosSqα=0 (§6)
            var C = f / 16 * cosSqα * (4 + f * (4 - 3 * cosSqα));
            λʹ = λ;
            λ = L + (1 - C) * f * sinα * (σ + C * sinσ * (cos2σM + C * cosσ * (-1 + 2 * cos2σM * cos2σM)));
        } while (Math.abs(λ - λʹ) > 1e-12 && ++iterations < 100);
        if (iterations >= 100) {
            console.log('Formula failed to converge. Altering target position.')
            return this._vincenty_inverse(p1, {lat: p2.lat, lng: p2.lng - 0.01})
//	throw new Error('Formula failed to converge');
        }

        var uSq = cosSqα * (a * a - b * b) / (b * b);
        var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
        var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
        var Δσ = B * sinσ * (cos2σM + B / 4 * (cosσ * (-1 + 2 * cos2σM * cos2σM) -
            B / 6 * cos2σM * (-3 + 4 * sinσ * sinσ) * (-3 + 4 * cos2σM * cos2σM)));

        var s = b * A * (σ - Δσ);

        var fwdAz = Math.atan2(cosU2 * sinλ, cosU1 * sinU2 - sinU1 * cosU2 * cosλ);
        var revAz = Math.atan2(cosU1 * sinλ, -sinU1 * cosU2 + cosU1 * sinU2 * cosλ);

        s = Number(s.toFixed(3)); // round to 1mm precision
        return {distance: s, initialBearing: fwdAz.toDegrees(), finalBearing: revAz.toDegrees()};
    },


    /**
     * Returns the point of intersection of two paths defined by point and bearing.
     * based on the work of Chris Veness (https://github.com/chrisveness/geodesy)
     *
     * @param {LatLon} p1 - First point.
     * @param {number} brng1 - Initial bearing from first point.
     * @param {LatLon} p2 - Second point.
     * @param {number} brng2 - Initial bearing from second point.
     * @returns {Object} containing lat/lng information of intersection.
     *
     * @example
     * var p1 = LatLon(51.8853, 0.2545), brng1 = 108.55;
     * var p2 = LatLon(49.0034, 2.5735), brng2 = 32.44;
     * var pInt = LatLon.intersection(p1, brng1, p2, brng2); // pInt.toString(): 50.9078°N, 4.5084°E
     */
    _intersection: function (p1, brng1, p2, brng2) {
        // see http://williams.best.vwh.net/avform.htm#Intersection

        var φ1 = p1.lat.toRadians(), λ1 = p1.lng.toRadians();
        var φ2 = p2.lat.toRadians(), λ2 = p2.lng.toRadians();
        var θ13 = Number(brng1).toRadians(), θ23 = Number(brng2).toRadians();
        var Δφ = φ2 - φ1, Δλ = λ2 - λ1;

        var δ12 = 2 * Math.asin(Math.sqrt(Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)));
        if (δ12 == 0) return null;

        // initial/final bearings between points
        var θ1 = Math.acos(( Math.sin(φ2) - Math.sin(φ1) * Math.cos(δ12) ) /
        ( Math.sin(δ12) * Math.cos(φ1) ));
        if (isNaN(θ1)) θ1 = 0; // protect against rounding
        var θ2 = Math.acos(( Math.sin(φ1) - Math.sin(φ2) * Math.cos(δ12) ) /
        ( Math.sin(δ12) * Math.cos(φ2) ));

        if (Math.sin(λ2 - λ1) > 0) {
            var θ12 = θ1;
            var θ21 = 2 * Math.PI - θ2;
        } else {
            var θ12 = 2 * Math.PI - θ1;
            var θ21 = θ2;
        }

        var α1 = (θ13 - θ12 + Math.PI) % (2 * Math.PI) - Math.PI; // angle 2-1-3
        var α2 = (θ21 - θ23 + Math.PI) % (2 * Math.PI) - Math.PI; // angle 1-2-3

        if (Math.sin(α1) == 0 && Math.sin(α2) == 0) return null; // infinite intersections
        if (Math.sin(α1) * Math.sin(α2) < 0) return null; // ambiguous intersection

        //α1 = Math.abs(α1);
        //α2 = Math.abs(α2);
        // ... Ed Williams takes abs of α1/α2, but seems to break calculation?

        var α3 = Math.acos(-Math.cos(α1) * Math.cos(α2) +
        Math.sin(α1) * Math.sin(α2) * Math.cos(δ12));
        var δ13 = Math.atan2(Math.sin(δ12) * Math.sin(α1) * Math.sin(α2),
            Math.cos(α2) + Math.cos(α1) * Math.cos(α3))
        var φ3 = Math.asin(Math.sin(φ1) * Math.cos(δ13) +
        Math.cos(φ1) * Math.sin(δ13) * Math.cos(θ13));
        var Δλ13 = Math.atan2(Math.sin(θ13) * Math.sin(δ13) * Math.cos(φ1),
            Math.cos(δ13) - Math.sin(φ1) * Math.sin(φ3));
        var λ3 = λ1 + Δλ13;
        λ3 = (λ3 + 3 * Math.PI) % (2 * Math.PI) - Math.PI; // normalise to -180..+180º

        return {
            lat: φ3.toDegrees(),
            lng: λ3.toDegrees()
        };
    },

    /**
     * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
     * @param obj1
     * @param obj2
     * @returns obj3 a new object based on obj1 and obj2
     */
    _merge_options: function (obj1, obj2) {
        var obj3 = {};
        for (var attrname in obj1) {
            obj3[attrname] = obj1[attrname];
        }
        for (var attrname in obj2) {
            obj3[attrname] = obj2[attrname];
        }
        return obj3;
    }
});

L.geodesic = function (latlngs, options) {
    return new L.Geodesic(latlngs, options);
};

// Hook into L.GeoJSON.geometryToLayer and add geodesic support
(function () {
    var orig_L_GeoJSON_geometryToLayer = L.GeoJSON.geometryToLayer;
    L.GeoJSON.geometryToLayer = function (geojson, pointToLayer, coordsToLatLng, vectorOptions) {
        if (geojson.properties && geojson.properties.geodesic) {
            var geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
                coords = geometry.coordinates, props = geojson.properties, latlngs;
            coordsToLatLng = coordsToLatLng || this.coordsToLatLng;
            if (props.geodesic_steps) vectorOptions = L.extend({steps: props.geodesic_steps}, vectorOptions);
            if (props.geodesic_wrap) vectorOptions = L.extend({wrap: props.geodesic_wrap}, vectorOptions);
            switch (geometry.type) {
                case 'LineString':
                    latlngs = this.coordsToLatLngs(coords, 0, coordsToLatLng);
                    return new L.Geodesic([latlngs], vectorOptions);
                case 'MultiLineString':
                    latlngs = this.coordsToLatLngs(coords, 1, coordsToLatLng);
                    return new L.Geodesic(latlngs, vectorOptions);
                default:
                    console.log('Not yet supported drawing GeoJSON ' + geometry.type + ' as a geodesic: Drawing as non-geodesic.')
            }
        }
        return orig_L_GeoJSON_geometryToLayer.apply(this, arguments);
    }
})();
},{}],29:[function(require,module,exports){
// Backbone.Stickit v0.9.2, MIT Licensed
// Copyright (c) 2012-2015 The New York Times, CMS Group, Matthew DeLambo <delambo@gmail.com>

(function (factory) {

  //// Set up Stickit appropriately for the environment. Start with AMD.
  //if (typeof define === 'function' && define.amd)
  //  define(['underscore', 'backbone', 'exports'], factory);
  //
  //// Next for Node.js or CommonJS.
  //else if (typeof exports === 'object')
  //  factory(require('underscore'), require('backbone'), exports);
  //
  //// Finally, as a browser global.
  //else
    factory(_, Backbone, {});

}(function (_, Backbone, Stickit) {

  // Stickit Namespace
  // --------------------------

  // Export onto Backbone object
  Backbone.Stickit = Stickit;

  Stickit._handlers = [];

  Stickit.addHandler = function(handlers) {
    // Fill-in default values.
    handlers = _.map(_.flatten([handlers]), function(handler) {
      return _.defaults({}, handler, {
        updateModel: true,
        updateView: true,
        updateMethod: 'text'
      });
    });
    this._handlers = this._handlers.concat(handlers);
  };

  // Backbone.View Mixins
  // --------------------

  Stickit.ViewMixin = {

    // Collection of model event bindings.
    //   [{model,event,fn,config}, ...]
    _modelBindings: null,

    // Unbind the model and event bindings from `this._modelBindings` and
    // `this.$el`. If the optional `model` parameter is defined, then only
    // delete bindings for the given `model` and its corresponding view events.
    unstickit: function(model, bindingSelector) {

      // Support passing a bindings hash in place of bindingSelector.
      if (_.isObject(bindingSelector)) {
        _.each(bindingSelector, function(v, selector) {
          this.unstickit(model, selector);
        }, this);
        return;
      }

      var models = [], destroyFns = [];
      this._modelBindings = _.reject(this._modelBindings, function(binding) {
        if (model && binding.model !== model) return;
        if (bindingSelector && binding.config.selector != bindingSelector) return;

        binding.model.off(binding.event, binding.fn);
        destroyFns.push(binding.config._destroy);
        models.push(binding.model);
        return true;
      });

      // Trigger an event for each model that was unbound.
      _.invoke(_.uniq(models), 'trigger', 'stickit:unstuck', this.cid);

      // Call `_destroy` on a unique list of the binding callbacks.
      _.each(_.uniq(destroyFns), function(fn) { fn.call(this); }, this);

      this.$el.off('.stickit' + (model ? '.' + model.cid : ''), bindingSelector);
    },

    // Initilize Stickit bindings for the view. Subsequent binding additions
    // can either call `stickit` with the new bindings, or add them directly
    // with `addBinding`. Both arguments to `stickit` are optional.
    stickit: function(optionalModel, optionalBindingsConfig) {
      var model = optionalModel || this.model,
          bindings = optionalBindingsConfig || _.result(this, "bindings") || {};

      this._modelBindings || (this._modelBindings = []);

      // Add bindings in bulk using `addBinding`.
      this.addBinding(model, bindings);

      // Wrap `view.remove` to unbind stickit model and dom events.
      var remove = this.remove;
      if (!remove.stickitWrapped) {
        this.remove = function() {
          var ret = this;
          this.unstickit();
          if (remove) ret = remove.apply(this, arguments);
          return ret;
        };
      }
      this.remove.stickitWrapped = true;
      return this;
    },

    // Add a single Stickit binding or a hash of bindings to the model. If
    // `optionalModel` is ommitted, will default to the view's `model` property.
    addBinding: function(optionalModel, selector, binding) {
      var model = optionalModel || this.model,
          namespace = '.stickit.' + model.cid;

      binding = binding || {};

      // Support jQuery-style {key: val} event maps.
      if (_.isObject(selector)) {
        var bindings = selector;
        _.each(bindings, function(val, key) {
          this.addBinding(model, key, val);
        }, this);
        return;
      }

      // Special case the ':el' selector to use the view's this.$el.
      var $el = selector === ':el' ? this.$el : this.$(selector);

      // Clear any previous matching bindings.
      this.unstickit(model, selector);

      // Fail fast if the selector didn't match an element.
      if (!$el.length) return;

      // Allow shorthand setting of model attributes - `'selector':'observe'`.
      if (_.isString(binding)) binding = {observe: binding};

      // Handle case where `observe` is in the form of a function.
      if (_.isFunction(binding.observe)) binding.observe = binding.observe.call(this);

      // Find all matching Stickit handlers that could apply to this element
      // and store in a config object.
      var config = getConfiguration($el, binding);

      // The attribute we're observing in our config.
      var modelAttr = config.observe;

      // Store needed properties for later.
      config.selector = selector;
      config.view = this;

      // Create the model set options with a unique `bindId` so that we
      // can avoid double-binding in the `change:attribute` event handler.
      var bindId = config.bindId = _.uniqueId();

      // Add a reference to the view for handlers of stickitChange events
      var options = _.extend({stickitChange: config}, config.setOptions);

      // Add a `_destroy` callback to the configuration, in case `destroy`
      // is a named function and we need a unique function when unsticking.
      config._destroy = function() {
        applyViewFn.call(this, config.destroy, $el, model, config);
      };

      initializeAttributes($el, config, model, modelAttr);
      initializeVisible($el, config, model, modelAttr);
      initializeClasses($el, config, model, modelAttr);

      if (modelAttr) {
        // Setup one-way (input element -> model) bindings.
        _.each(config.events, function(type) {
          var eventName = type + namespace;
          var listener = function(event) {
            var val = applyViewFn.call(this, config.getVal, $el, event, config, slice.call(arguments, 1));

            // Don't update the model if false is returned from the `updateModel` configuration.
            var currentVal = evaluateBoolean(config.updateModel, val, event, config);
            if (currentVal) setAttr(model, modelAttr, val, options, config);
          };
          var sel = selector === ':el'? '' : selector;
          this.$el.on(eventName, sel, _.bind(listener, this));
        }, this);

        // Setup a `change:modelAttr` observer to keep the view element in sync.
        // `modelAttr` may be an array of attributes or a single string value.
        _.each(_.flatten([modelAttr]), function(attr) {
          observeModelEvent(model, 'change:' + attr, config, function(m, val, options) {
            var changeId = options && options.stickitChange && options.stickitChange.bindId;
            if (changeId !== bindId) {
              var currentVal = getAttr(model, modelAttr, config);
              updateViewBindEl($el, config, currentVal, model);
            }
          });
        });

        var currentVal = getAttr(model, modelAttr, config);
        updateViewBindEl($el, config, currentVal, model, true);
      }

      // After each binding is setup, call the `initialize` callback.
      applyViewFn.call(this, config.initialize, $el, model, config);
    }
  };

  _.extend(Backbone.View.prototype, Stickit.ViewMixin);

  // Helpers
  // -------

  var slice = [].slice;

  // Evaluates the given `path` (in object/dot-notation) relative to the given
  // `obj`. If the path is null/undefined, then the given `obj` is returned.
  var evaluatePath = function(obj, path) {
    var parts = (path || '').split('.');
    var result = _.reduce(parts, function(memo, i) { return memo[i]; }, obj);
    return result == null ? obj : result;
  };

  // If the given `fn` is a string, then view[fn] is called, otherwise it is
  // a function that should be executed.
  var applyViewFn = function(fn) {
    fn = _.isString(fn) ? evaluatePath(this, fn) : fn;
    if (fn) return (fn).apply(this, slice.call(arguments, 1));
  };

  // Given a function, string (view function reference), or a boolean
  // value, returns the truthy result. Any other types evaluate as false.
  // The first argument must be `reference` and the last must be `config`, but
  // middle arguments can be variadic.
  var evaluateBoolean = function(reference, val, config) {
    if (_.isBoolean(reference)) {
      return reference;
    } else if (_.isFunction(reference) || _.isString(reference)) {
      var view = _.last(arguments).view;
      return applyViewFn.apply(view, arguments);
    }
    return false;
  };

  // Setup a model event binding with the given function, and track the event
  // in the view's _modelBindings.
  var observeModelEvent = function(model, event, config, fn) {
    var view = config.view;
    model.on(event, fn, view);
    view._modelBindings.push({model:model, event:event, fn:fn, config:config});
  };

  // Prepares the given `val`ue and sets it into the `model`.
  var setAttr = function(model, attr, val, options, config) {
    var value = {}, view = config.view;
    if (config.onSet) {
      val = applyViewFn.call(view, config.onSet, val, config);
    }

    if (config.set) {
      applyViewFn.call(view, config.set, attr, val, options, config);
    } else {
      value[attr] = val;
      // If `observe` is defined as an array and `onSet` returned
      // an array, then map attributes to their values.
      if (_.isArray(attr) && _.isArray(val)) {
        value = _.reduce(attr, function(memo, attribute, index) {
          memo[attribute] = _.has(val, index) ? val[index] : null;
          return memo;
        }, {});
      }
      model.set(value, options);
    }
  };

  // Returns the given `attr`'s value from the `model`, escaping and
  // formatting if necessary. If `attr` is an array, then an array of
  // respective values will be returned.
  var getAttr = function(model, attr, config) {
    var view = config.view;
    var retrieveVal = function(field) {
      return model[config.escape ? 'escape' : 'get'](field);
    };
    var sanitizeVal = function(val) {
      return val == null ? '' : val;
    };
    var val = _.isArray(attr) ? _.map(attr, retrieveVal) : retrieveVal(attr);
    if (config.onGet) val = applyViewFn.call(view, config.onGet, val, config);
    return _.isArray(val) ? _.map(val, sanitizeVal) : sanitizeVal(val);
  };

  // Find handlers in `Backbone.Stickit._handlers` with selectors that match
  // `$el` and generate a configuration by mixing them in the order that they
  // were found with the given `binding`.
  var getConfiguration = Stickit.getConfiguration = function($el, binding) {
    var handlers = [{
      updateModel: false,
      updateMethod: 'text',
      update: function($el, val, m, opts) { if ($el[opts.updateMethod]) $el[opts.updateMethod](val); },
      getVal: function($el, e, opts) { return $el[opts.updateMethod](); }
    }];
    handlers = handlers.concat(_.filter(Stickit._handlers, function(handler) {
      return $el.is(handler.selector);
    }));
    handlers.push(binding);

    // Merge handlers into a single config object. Last props in wins.
    var config = _.extend.apply(_, handlers);

    // `updateView` is defaulted to false for configutrations with
    // `visible`; otherwise, `updateView` is defaulted to true.
    if (!_.has(config, 'updateView')) config.updateView = !config.visible;
    return config;
  };

  // Setup the attributes configuration - a list that maps an attribute or
  // property `name`, to an `observe`d model attribute, using an optional
  // `onGet` formatter.
  //
  //     attributes: [{
  //       name: 'attributeOrPropertyName',
  //       observe: 'modelAttrName'
  //       onGet: function(modelAttrVal, modelAttrName) { ... }
  //     }, ...]
  //
  var initializeAttributes = function($el, config, model, modelAttr) {
    var props = ['autofocus', 'autoplay', 'async', 'checked', 'controls',
      'defer', 'disabled', 'hidden', 'indeterminate', 'loop', 'multiple',
      'open', 'readonly', 'required', 'scoped', 'selected'];

    var view = config.view;

    _.each(config.attributes || [], function(attrConfig) {
      attrConfig = _.clone(attrConfig);
      attrConfig.view = view;

      var lastClass = '';
      var observed = attrConfig.observe || (attrConfig.observe = modelAttr);
      var updateAttr = function() {
        var updateType = _.contains(props, attrConfig.name) ? 'prop' : 'attr',
            val = getAttr(model, observed, attrConfig);

        // If it is a class then we need to remove the last value and add the new.
        if (attrConfig.name === 'class') {
          $el.removeClass(lastClass).addClass(val);
          lastClass = val;
        } else {
          $el[updateType](attrConfig.name, val);
        }
      };

      _.each(_.flatten([observed]), function(attr) {
        observeModelEvent(model, 'change:' + attr, config, updateAttr);
      });

      // Initialize the matched element's state.
      updateAttr();
    });
  };

  var initializeClasses = function($el, config, model, modelAttr) {
    _.each(config.classes || [], function(classConfig, name) {
      if (_.isString(classConfig)) classConfig = {observe: classConfig};
      classConfig.view = config.view;

      var observed = classConfig.observe;
      var updateClass = function() {
        var val = getAttr(model, observed, classConfig);
        $el.toggleClass(name, !!val);
      };

      _.each(_.flatten([observed]), function(attr) {
        observeModelEvent(model, 'change:' + attr, config, updateClass);
      });
      updateClass();
    });
  };

  // If `visible` is configured, then the view element will be shown/hidden
  // based on the truthiness of the modelattr's value or the result of the
  // given callback. If a `visibleFn` is also supplied, then that callback
  // will be executed to manually handle showing/hiding the view element.
  //
  //     observe: 'isRight',
  //     visible: true, // or function(val, options) {}
  //     visibleFn: function($el, isVisible, options) {} // optional handler
  //
  var initializeVisible = function($el, config, model, modelAttr) {
    if (config.visible == null) return;
    var view = config.view;

    var visibleCb = function() {
      var visible = config.visible,
          visibleFn = config.visibleFn,
          val = getAttr(model, modelAttr, config),
          isVisible = !!val;

      // If `visible` is a function then it should return a boolean result to show/hide.
      if (_.isFunction(visible) || _.isString(visible)) {
        isVisible = !!applyViewFn.call(view, visible, val, config);
      }

      // Either use the custom `visibleFn`, if provided, or execute the standard show/hide.
      if (visibleFn) {
        applyViewFn.call(view, visibleFn, $el, isVisible, config);
      } else {
        $el.toggle(isVisible);
      }
    };

    _.each(_.flatten([modelAttr]), function(attr) {
      observeModelEvent(model, 'change:' + attr, config, visibleCb);
    });

    visibleCb();
  };

  // Update the value of `$el` using the given configuration and trigger the
  // `afterUpdate` callback. This action may be blocked by `config.updateView`.
  //
  //     update: function($el, val, model, options) {},  // handler for updating
  //     updateView: true, // defaults to true
  //     afterUpdate: function($el, val, options) {} // optional callback
  //
  var updateViewBindEl = function($el, config, val, model, isInitializing) {
    var view = config.view;
    if (!evaluateBoolean(config.updateView, val, config)) return;
    applyViewFn.call(view, config.update, $el, val, model, config);
    if (!isInitializing) applyViewFn.call(view, config.afterUpdate, $el, val, config);
  };

  // Default Handlers
  // ----------------

  Stickit.addHandler([{
    selector: '[contenteditable]',
    updateMethod: 'html',
    events: ['input', 'change']
  }, {
    selector: 'input',
    events: ['propertychange', 'input', 'change'],
    update: function($el, val) { $el.val(val); },
    getVal: function($el) {
      return $el.val();
    }
  }, {
    selector: 'textarea',
    events: ['propertychange', 'input', 'change'],
    update: function($el, val) { $el.val(val); },
    getVal: function($el) { return $el.val(); }
  }, {
    selector: 'input[type="radio"]',
    events: ['change'],
    update: function($el, val) {
      $el.filter('[value="'+val+'"]').prop('checked', true);
    },
    getVal: function($el) {
      return $el.filter(':checked').val();
    }
  }, {
    selector: 'input[type="checkbox"]',
    events: ['change'],
    update: function($el, val, model, options) {
      if ($el.length > 1) {
        // There are multiple checkboxes so we need to go through them and check
        // any that have value attributes that match what's in the array of `val`s.
        val || (val = []);
        $el.each(function(i, el) {
          var checkbox = Backbone.$(el);
          var checked = _.contains(val, checkbox.val());
          checkbox.prop('checked', checked);
        });
      } else {
        var checked = _.isBoolean(val) ? val : val === $el.val();
        $el.prop('checked', checked);
      }
    },
    getVal: function($el) {
      var val;
      if ($el.length > 1) {
        val = _.reduce($el, function(memo, el) {
          var checkbox = Backbone.$(el);
          if (checkbox.prop('checked')) memo.push(checkbox.val());
          return memo;
        }, []);
      } else {
        val = $el.prop('checked');
        // If the checkbox has a value attribute defined, then
        // use that value. Most browsers use "on" as a default.
        var boxval = $el.val();
        if (boxval !== 'on' && boxval != null) {
          val = val ? $el.val() : null;
        }
      }
      return val;
    }
  }, {
    selector: 'select',
    events: ['change'],
    update: function($el, val, model, options) {
      var optList,
        selectConfig = options.selectOptions,
        list = selectConfig && selectConfig.collection || undefined,
        isMultiple = $el.prop('multiple');

      // If there are no `selectOptions` then we assume that the `<select>`
      // is pre-rendered and that we need to generate the collection.
      if (!selectConfig) {
        selectConfig = {};
        var getList = function($el) {
          return $el.map(function(index, option) {
            // Retrieve the text and value of the option, preferring "stickit-bind-val"
            // data attribute over value property.
            var dataVal = Backbone.$(option).data('stickit-bind-val');
            return {
              value: dataVal !== undefined ? dataVal : option.value,
              label: option.text
            };
          }).get();
        };
        if ($el.find('optgroup').length) {
          list = {opt_labels:[]};
          // Search for options without optgroup
          if ($el.find('> option').length) {
            list.opt_labels.push(undefined);
            _.each($el.find('> option'), function(el) {
              list[undefined] = getList(Backbone.$(el));
            });
          }
          _.each($el.find('optgroup'), function(el) {
            var label = Backbone.$(el).attr('label');
            list.opt_labels.push(label);
            list[label] = getList(Backbone.$(el).find('option'));
          });
        } else {
          list = getList($el.find('option'));
        }
      }

      // Fill in default label and path values.
      selectConfig.valuePath = selectConfig.valuePath || 'value';
      selectConfig.labelPath = selectConfig.labelPath || 'label';
      selectConfig.disabledPath = selectConfig.disabledPath || 'disabled';

      var addSelectOptions = function(optList, $el, fieldVal) {
        _.each(optList, function(obj) {
          var option = Backbone.$('<option/>'), optionVal = obj;

          var fillOption = function(text, val, disabled) {
            option.text(text);
            optionVal = val;
            // Save the option value as data so that we can reference it later.
            option.data('stickit-bind-val', optionVal);
            if (!_.isArray(optionVal) && !_.isObject(optionVal)) option.val(optionVal);

            if (disabled === true) option.prop('disabled', 'disabled');
          };

          var text, val, disabled;
          if (obj === '__default__') {
            text = fieldVal.label,
            val = fieldVal.value,
            disabled = fieldVal.disabled;
          } else {
            text = evaluatePath(obj, selectConfig.labelPath),
            val = evaluatePath(obj, selectConfig.valuePath),
            disabled = evaluatePath(obj, selectConfig.disabledPath);
          }
          fillOption(text, val, disabled);

          // Determine if this option is selected.
          var isSelected = function() {
            if (!isMultiple && optionVal != null && fieldVal != null && optionVal === fieldVal) {
              return true;
            } else if (_.isObject(fieldVal) && _.isEqual(optionVal, fieldVal)) {
              return true;
            }
            return false;
          };

          if (isSelected()) {
            option.prop('selected', true);
          } else if (isMultiple && _.isArray(fieldVal)) {
            _.each(fieldVal, function(val) {
              if (_.isObject(val)) val = evaluatePath(val, selectConfig.valuePath);
              if (val === optionVal || (_.isObject(val) && _.isEqual(optionVal, val)))
                option.prop('selected', true);
            });
          }

          $el.append(option);
        });
      };

      $el.find('*').remove();

      // The `list` configuration is a function that returns the options list or a string
      // which represents the path to the list relative to `window` or the view/`this`.
      if (_.isString(list)) {
        var context = window;
        if (list.indexOf('this.') === 0) context = this;
        list = list.replace(/^[a-z]*\.(.+)$/, '$1');
        optList = evaluatePath(context, list);
      } else if (_.isFunction(list)) {
        optList = applyViewFn.call(this, list, $el, options);
      } else {
        optList = list;
      }

      // Support Backbone.Collection and deserialize.
      if (optList instanceof Backbone.Collection) {
        var collection = optList;
        var refreshSelectOptions = function() {
          var currentVal = getAttr(model, options.observe, options);
          applyViewFn.call(this, options.update, $el, currentVal, model, options);
        };
        // We need to call this function after unstickit and after an update so we don't end up
        // with multiple listeners doing the same thing
        var removeCollectionListeners = function() {
          collection.off('add remove reset sort', refreshSelectOptions);
        };
        var removeAllListeners = function() {
          removeCollectionListeners();
          collection.off('stickit:selectRefresh');
          model.off('stickit:selectRefresh');
        };
        // Remove previously set event listeners by triggering a custom event
        collection.trigger('stickit:selectRefresh');
        collection.once('stickit:selectRefresh', removeCollectionListeners, this);

        // Listen to the collection and trigger an update of the select options
        collection.on('add remove reset sort', refreshSelectOptions, this);

        // Remove the previous model event listener
        model.trigger('stickit:selectRefresh');
        model.once('stickit:selectRefresh', function() {
          model.off('stickit:unstuck', removeAllListeners);
        });
        // Remove collection event listeners once this binding is unstuck
        model.once('stickit:unstuck', removeAllListeners, this);
        optList = optList.toJSON();
      }

      if (selectConfig.defaultOption) {
        var option = _.isFunction(selectConfig.defaultOption) ?
          selectConfig.defaultOption.call(this, $el, options) :
          selectConfig.defaultOption;
        addSelectOptions(["__default__"], $el, option);
      }

      if (_.isArray(optList)) {
        addSelectOptions(optList, $el, val);
      } else if (optList.opt_labels) {
        // To define a select with optgroups, format selectOptions.collection as an object
        // with an 'opt_labels' property, as in the following:
        //
        //     {
        //       'opt_labels': ['Looney Tunes', 'Three Stooges'],
        //       'Looney Tunes': [{id: 1, name: 'Bugs Bunny'}, {id: 2, name: 'Donald Duck'}],
        //       'Three Stooges': [{id: 3, name : 'moe'}, {id: 4, name : 'larry'}, {id: 5, name : 'curly'}]
        //     }
        //
        _.each(optList.opt_labels, function(label) {
          var $group = Backbone.$('<optgroup/>').attr('label', label);
          addSelectOptions(optList[label], $group, val);
          $el.append($group);
        });
        // With no 'opt_labels' parameter, the object is assumed to be a simple value-label map.
        // Pass a selectOptions.comparator to override the default order of alphabetical by label.
      } else {
        var opts = [], opt;
        for (var i in optList) {
          opt = {};
          opt[selectConfig.valuePath] = i;
          opt[selectConfig.labelPath] = optList[i];
          opts.push(opt);
        }
        opts = _.sortBy(opts, selectConfig.comparator || selectConfig.labelPath);
        addSelectOptions(opts, $el, val);
      }
    },
    getVal: function($el) {
      var selected = $el.find('option:selected');

      if ($el.prop('multiple')) {
        return _.map(selected, function(el) {
          return Backbone.$(el).data('stickit-bind-val');
        });
      } else {
        return selected.data('stickit-bind-val');
      }
    }
  }]);

  return Stickit;

}));

},{}],30:[function(require,module,exports){
/**
 * Created by NBP100083 on 15.08.2015.
 */


require('./L.Control.MousePosition');
require('./L.Control.Locate');
require('./L.Geodesic');
require('./backbone.stickit');
},{"./L.Control.Locate":26,"./L.Control.MousePosition":27,"./L.Geodesic":28,"./backbone.stickit":29}],31:[function(require,module,exports){
/**
 * Created by alex on 01.09.2015.
 */

var Cmd = Backbone.View.extend({
    events: function () {
        return {
            "click [data-command]": "_onCommand"
        }
    },

    _onCommand: function (e) {
        var $el = $(e.currentTarget),
            cmd = $el.data('command');
        if (this[cmd])
            return this[cmd](e);
        else {
            e.preventDefault();
            alert('Command [' + cmd + '] not default !!! ');
        }
    },

});

module.exports = Cmd;


},{}],32:[function(require,module,exports){
/**
 * Created by alex on 01.09.2015.
 */

var View = L.Popup.extend({
    options: {
        maxWidth: 800,
        autoPanPadding: L.point(20, 70),
        htmlWait: $('#temp-info-wait').html()
    },

    initialize: function (options) {
        View.__super__.initialize.apply(this, arguments);
        options.latlng && this.setLatLng(options.latlng);
        if (options.content)
            this.setContent(options.content);
        else
            this.options.htmlWait && this._wait(this.options.htmlWait);
    },
    setContent: function (content) {
        if (content instanceof  Backbone.View)
            content = content.el;
        $(this._container).show();
        return View.__super__.setContent.call(this, content);
    },
    reContent: function (content) {
        this.setContent(content);
        this.update();
        return this;
    },
    _wait: function (context) {
        this.setContent(context);
        return this;
    }
});

module.exports = View;


},{}],33:[function(require,module,exports){
/**
 * Created by alex on 01.09.2015.
 */
var Mask = require('../mask');

var Remote = {
    Model: {
        remoteField: 'remoteErr',
        remoteValidate: function (err) {
            var attr = this.toJSON();
            attr[this.remoteField] = err;
            this.validate(attr);
        },
        messageError: function (xhr) {
            if (xhr.responseJSON && xhr.responseJSON.message)
                return xhr.responseJSON.message;
            else
                return L.Util.template('Error: {status}. {statusText}', xhr);
        },
    },
    View: {
        onRequest: function () {
            this._mask().start();
        },
        onSync: function () {
            this._mask().end();
        },
        onError: function (model, xhr, options) {
            this._mask().end(500, function () {
                this.model.remoteValidate(xhr);
            }, this);

        },

        _maskSelector: function () {
        },
        _mask: function () {
            if (!this.__mask) {
                this.__mask = new Mask({el: this._maskSelector()});
            }
            return this.__mask;
        },
        _setRemoteEvents: function () {
            this.model.on('error', this.onError, this);
            this.model.on('sync', this.onSync, this);
            this.model.on('request', this.onRequest, this);
        },

    }
};

module.exports = Remote;


},{"../mask":20}],34:[function(require,module,exports){
/**
 * Created by alex on 01.09.2015.
 */
var CommandView = require('./command');

var Tabs = CommandView.extend({
    el: $('#temp-tabs-simple').html(),

    // получить вкладки или вкладку по индексу
    $tabs: function (index) {
        var items = this.$('ul.nav.nav-tabs li a');
        return _.isNumber(index) ? items.eq(index) : items;
    },
    // получить content вкладки
    $tabContent: function (tab) {
        return this.$($(tab).attr('href'));
    },

});

module.exports = Tabs;


},{"./command":31}],35:[function(require,module,exports){
/**
 * Created by alex on 10.08.2015.
 */

var Base = require('../../libs/footer');
var Footer = Base.extend({
    initialize: function (options) {
        Footer.__super__.initialize.apply(this, arguments);
        this.on('all', this.onEvents, this);
    },
    onEvents: function (name, height) {
        if (~['open', 'close', 'resize'].indexOf(name))
            app.events.channel('screen').trigger('footer:' + name, height);
    }
});


var Footers = L.Class.extend({
    initialize: function (footers, options) {
        this.active = null;
        this.footers = footers.map(this._create, this);
    },

    onOpen: function (h, footer) {
        this.active && this.active !== footer && this.active.close(true);
        this.active = footer;
    },
    _create: function (options) {
        var footer = new Footer(options);
        footer.on('open', this.onOpen, this);
    }

});

new Footers([
    {
        keyPress: '1',
        height: 50,
        minHeight: 10,
        maxHeight: 70
    }, {
        content: $('<div/>', {
            id: 'CNT-90',
            title: 'Become a Googler',
            text: 'установим еще один обработчик события keypress, на этот раз элементам '
        }),
        keyPress: '2',
        height: 20,
        minHeight: 10,
        maxHeight: 70
    }, {
        content: $('#temp-footer-print').html(),
        keyPress: '3',
        height: 100,
        minHeight: 80,
        maxHeight: 101
    }
]);

},{"../../libs/footer":14}],36:[function(require,module,exports){
/**
 * Created by ��������� on 13.09.2015.
 */

require('./map');
require('./menu');
require('./maps');
require('./footers');

require('./sea');
require('./route');
require('./info');
},{"./footers":35,"./info":37,"./map":40,"./maps":41,"./menu":48,"./route":64,"./sea":73}],37:[function(require,module,exports){
/**
 * Created by alex on 31.08.2015.
 */

//http://openportguide.org/cgi-bin/weather/weather.pl/weather.png?var=meteogram&nx=614&ny=750&lat=56.0&lon=43.0&lang=ru&unit=metric&label=Pirate_Bay
var events = app.events.channel('info');

events.on('map', require('./local'), this );
events.on('route:vertex', require('./route-vertex'), this );



},{"./local":38,"./route-vertex":39}],38:[function(require,module,exports){
/**
 * Created by alex on 31.08.2015.
 */

var Popup = require('../../libs/views/popup'),
    Tabs = require('../../libs/views/tabs');


var Collection = Backbone.Collection.extend({
    url: '/api/local',
    initialize: function (attr, options) {

    },

})

var View = Backbone.View.extend({
    initialize: function () {
    },
    render: function () {
        this.$el.empty();
        //this.$el.append('<pre>')
        var model = this.collection.at(0);
        this.$el.append( );
        this.$el.append(L.Util.template('<p>Count:{length}</p>', this.collection));
        model && this.$el.append(L.Util.template("<pre>{name}</pre>", {name: JSON.stringify(model.toJSON(), null, 4)}));
        this.collection.each(function (model) {
            var name = model.get('seamark:type');
            name && this.$el.append(L.Util.template("<li>{name}</li>",{name:name}));
        }, this);
        this.$el.append('</pre>')
        return this;
    },
    load: function (latlng) {
        return this.collection.fetch({data: {lat: latlng.lat, lng: latlng.lng, distance: this._distance(latlng)}});
    },

    _distance: function (latlng) {
        var point = latlng.toPoint(app.map);
        point.y += 10;
        var offset = point.toLatLng(app.map);
        var dist = latlng.distanceTo(offset);
        return dist;
    }
})

module.exports = function (e) {
    var popup = new Popup({
        latlng: e.latlng,
    }).openOn(app.map);

    var view = new View({collection: new Collection()});

    view.load(e.latlng)
        .done(function () {
            popup.reContent(view.render());
        })
        .fail(function (xhr) {
            popup.reContent(L.Util.template("Error:{status}. {statusText}", xhr));
        });
}
},{"../../libs/views/popup":32,"../../libs/views/tabs":34}],39:[function(require,module,exports){
/**
 * Created by alex on 31.08.2015.
 */

var Popup = require('../../libs/views/popup'),
    Cmd = require('../../libs/views/command'),
    MyCmd = Cmd.extend({
        template: _.template($('#temp-info-route-vertex').html()),
        initialize: function () {
            this.render();
        },
        cmdTest: function (e) {
            //debugger;
            alert();
            return false;
        },
        render: function () {
            this.$el.append(this.template({
                json: JSON.stringify(this.model.toJSON(), null, 4)
            }));
        }
    })

module.exports = function (e) {

    var popup = new Popup({
        latlng: e.latlng,
        content: new MyCmd({model: e.model})
        //htmlWait: 'Ghbdtn'
    }).openOn(app.map);

    //setTimeout(function () {
    //    popup.reContent(new MyTabs({model: e.model}));
    //}, 500);
};
},{"../../libs/views/command":31,"../../libs/views/popup":32}],40:[function(require,module,exports){
/**
 * Created by alex on 30.07.2015.
 */
var events = app.events;

var View = Backbone.View.extend({
    initialize: function (options) {
        events.channel('screen').on('footer:open footer:close footer:resize', this.onFooter, this);
        events.channel('system')
            .on('unload', this.onUnload, this)
            .on('load', this.onLoad, this);

        app.map = this.map = this.initMap(options);
        this.initControls();
        this.initEvent();
    },
    initMap: function (options) {
        var map = L.map(this.el, options.map).setView(options.position, options.zoom);

        return map;
    },

    initControls: function () {
        L.control.zoom({position: "bottomright"}).addTo(this.map);
        L.control.mousePosition().addTo(this.map);
        L.control.locate({title: 'Определить местоположение...'})
            .on('location', this.onLocation, this)
            .addTo(this.map);
    },
    initEvent: function () {
        this.map.on('contextmenu', this.onContextmenu, this);
        this.map.on('click', this.onClick, this);
    },

    // захват типов types, находящихся на рассотянии distancePx писселов от координаты latlng
    capture: function (types, latlng, distancePx) {

        var layers = _.values(this.map._layers);
        types = [].concat(types);

        return layers
            .filter(function (layer) {
                return layer.capture && layer.types && _.intersection(types, layer.types).length > 0;
            }, this)
            .map(function (layer) {
                // возврат массива items = [{ type: types[n], distance : 1000, layer: layer1}, {},...]
                return layer.capture(types, latlng, distancePx);
            }, this)
            .reduce(function (res, list) {
                return res.concat(list); // получаем линейный массив из [items1 , items2, ...]
            }, [])
            .sort(function (item, item1) {
                return item.distance > item1.distance;
            });

    },

    onLocation: function (e) {
        console.time('ttt');
        _.values(this.map._layers)
            .filter(function (layer) {
                return layer.collection && layer.collection.nameObj === 'zone';
            })
            .forEach(function (layerGroup) {
                var res = layerGroup.getLayers()
                    .filter(function (layer) {
                        return layer.model.contains(e.latlng, layer._map);
                    })
                    .map(function (layer) {
                        return layer.model.toJSON();
                    });
                console.log(layerGroup.collection.type, res);
            });
        console.timeEnd('ttt');

    },
    onClick: function (e) {
        events.channel('info').trigger('map', e);
    },
    onContextmenu: function (e) {
        events.channel('route').trigger('add', {latlng: e.latlng});
    },
    getState: function () {
        var map = this.map,
            center = map.getCenter();
        return {
            center: center,
            zoom: map.getZoom()
        };
    },
    onFooter: function (height) {
        this.$el.css({height: (100 - height) + '%'});
        this.map.invalidateSize();
    },
    onUnload: function () {
        app.store.set('map-state', this.getState());
    },
    onLoad: function () {
        var data = app.store.get('map-state');
        this.map.setView(data.center, data.zoom);
    }

});
var data = app.store.get('map-state');
var view = new View({
    el: $('#map'),
    map: {
        zoomControl: false
    },
    //position: [55.5, 37.5],
    //zoom: 0
    position: data.center || [55.5, 37.5],
    zoom: data.zoom || 7
});


module.exports = view;




},{}],41:[function(require,module,exports){
/**
 * Created by alex on 02.09.2015.
 */

var map = app.map,
    Layers = require('../../libs/layer'),
    Layer = require('./layer'),
    events = app.events.channel('base-map');

var MyLayers = Layers.extend({
    initialize: function (layers) {
        MyLayers.__super__.initialize.apply(this, arguments);
        //this.onActive(layers[0].getType());
        events.on('active', this.onActive, this);
    },
    onActive: function (type) {
        this.clearLayers();
        if (this.types[type]) {
            this.addLayer(this._active = this.types[type]);
        }

        setTimeout(this._bringToBack.bind(this));
    },

    _bringToBack: function () {
        var pane = this._map._panes.tilePane;

        if (this._active && this._active._container) {
            pane.insertBefore(this._active._container, pane.firstChild);
            //this._setAutoZIndex(pane, Math.min);
        }

        return this;
    },

    _nextIndex: 0,
    _nextType: function () {
        var keys = _.keys(this.types);
        return this.types[keys[++this._nextIndex] || (keys[this._nextIndex = 0])];
    }
});


var layers = new MyLayers([
    new Layer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        type: 'OSM',
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }),
    new Layer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
        type: 'OCM',
        attribution: '&copy; <a href="http://osm.org/copyright">OpenCycleMap</a> contributors'
    }),
    new Layer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        type: 'CRT',
        noWrap: true,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    })

]);


layers.addTo(map);

},{"../../libs/layer":17,"./layer":42}],42:[function(require,module,exports){
/**
 * Created by alex on 03.09.2015.
 */

var Layer = L.TileLayer.extend({
    getType: function () {
        return this.options.type;
    }
});


module.exports = Layer;
},{}],43:[function(require,module,exports){
/**
 * Created by Александр on 13.09.2015.
 */

var Login = require('./login'),
    eventAuth = app.events.channel('auth');

var Model = Login.Model.extend({
    urlRoot: function () {
        return '/api/auth/token/' + this.options.token;
    },
    defaults: {
        username: '',
        password: '',
        password1: ''
    },
    initialize: function (attr, options) {
        this.options = options;
    },
    validation: {
        username: {
            required: true,
            pattern: 'email'
        },
        password: {
            required: true,
            minLength: 5,
            remoteErr400: {}
        },
        password1: {
            required: true,
            minLength: 5,
            fn: function (value, attr, computedState) {
                return value === computedState.password ? null : "Пароль не совпадает";
            }
        },
        remoteErr: {
            remote: {
                fn: function (err, model) {
                    return err.status === 400 ? null : model.messageError(err);
                }
            }
        }
    },

});
var View = Login.View.extend({
    el: $('#temp-password-change').html(),
    model: new Model(),
    bindings: {
        "[name=username]": "username",
        "[name=password]": "password",
        "[name=password1]": "password1",
    },
    onSync: function () {
        this._mask().end(300, function () {
            this.modal.close();
            this._message();
        }, this);

    },
    onError: function (model, xhr, options) {
        this._mask().end(300, function () {
            this.model.remoteValidate(xhr);
        }, this);

    },
    _message: function () {
        app.message.send({
            className: 'alert-info',
            title: 'Сброс пароля',
            content: L.Util.template('Пароль для пользователя <b>{username}</b> изменен.', this.model.toJSON()),
            time: 10000
        });
    },
    _maskSelector: function () {
        return this.$('.modal-content');
    }
});

module.exports = function (token) {
    // запрос get
    $.get("/api/auth/token/" + token)
        .done(function (data, xhr) {
            app.modal.open(new View({model: new Model(data, {token: token})}));
        })
        .fail(function (xhr) {
            app.message.send({
                className: 'alert-danger',
                title: 'Ошибка сброса пароля:',
                content: '[' + token.slice(0, 7) + '...] ' + xhr.responseJSON.message,
                time: 10000
            });
        });
};
},{"./login":45}],44:[function(require,module,exports){
/**
 * Created by alex on 07.09.2015.
 */

var ViewCmd = require('../../../libs/views/command'),
    ViewLogin = require('./login').View,
    ViewRegister = require('./register'),
    resetPassword = require('./reset-password'),
    changePassword = require('./change-password'),
    eventAuth = app.events.channel('auth');

var View = ViewCmd.extend({
    initialize: function (options) {
        this.views = {}
        this.setTabs(options.tabs);
        this.testLogin();
    },

    testLogin: function () {
        var viewLogin = this.views['.tab1'];
        $.get('/api/auth/login', function(data){
            viewLogin.model.set(data);
            viewLogin.onLogin();
        });
    },

    setTabs: function (tabs) {
        for (var p in tabs) {
            var View = tabs[p];
            this.views[p] = new View({el: this.$(p)});
        }
    },
    switch: function (selector) {
        this.$('[class^=tab]').addClass('hide');
        this.$(selector).removeClass('hide').addClass('active');
    },

    cmdRegister: function (e) {
        this.switch('.tab2');
    },
    cmdLogin: function (e) {
        this.switch('.tab1');
    },
    cmdResetPassword: function (e) {
        var view = resetPassword(this.views['.tab1'].model.get('username'));
        app.modal.open(view);
        return false;
    }
});

eventAuth.on('change-password', changePassword);


module.exports = {
    //position: 'topcenter',
    position: 'topright',
    id: 'login',
    title: 'Вход/регистрация в системе',
    icon: '<div class="icon-logout map-menu-button-icon"/>',
    popover: {
        view: new View({
            el: $('#temp-login-register').html(),
            tabs: {
                '.tab1': ViewLogin,
                '.tab2': ViewRegister
            }
        }),
        title: 'Вход/регистрация в системе'

    }
};



},{"../../../libs/views/command":31,"./change-password":43,"./login":45,"./register":46,"./reset-password":47}],45:[function(require,module,exports){
/**
 * Created by Александр on 13.09.2015.
 */

var remoteMix = require('../../../libs/views/remote-mix'),
    eventAuth = app.events.channel('auth');

var RmtModel = Backbone.Model.extend(remoteMix.Model),
    Model = RmtModel.extend({
        idAttribute: 'token',
        urlRoot: '/api/auth/login',
        defaults: {
            username: '',
            password: '',
        },
        validation: {
            username: {
                required: true,
                pattern: 'email'
            },
            password: {
                required: true,
                minLength: 5,
                remoteErr400: {}
            },
            remoteErr: {
                remote: {
                    fn: function (err, model) {
                        return err.status === 400 ? null : model.messageError(err);
                    }
                }
            }
        },
    });

var RmtView = Backbone.View.extend(remoteMix.View),
    View = RmtView.extend({
        model: new Model(),
        events: {
            "submit": "onSubmit"
        },
        bindings: {
            "[name=username]": "username",
            "[name=password]": "password"
        },

        initialize: function (attr, options) {
            Backbone.Validation.bind(this);
            this.stickit();
            this._setRemoteEvents();
            window.preLogin = this.onLoginNetwork.bind(this);
        },

        onSync: function () {
            this._mask().end(500, this.onLogin, this);
        },
        onError: function (model, xhr, options) {
            this._mask().end(500, function () {
                this.model.remoteValidate(xhr);
                eventAuth.trigger('logout', {});
            }, this);

        },
        onSubmit: function (e) {
            e.preventDefault();
            this.model.save();
        },
        onLogin: function () {
            eventAuth.trigger('login', this.model.toJSON());
            this._message();
        },
        onLoginNetwork: function (token) {
            $.get('/api/auth/login/token/' + token)
                .done(function (data) {
                    this.model.set(data);
                    this.onLogin();
                }.bind(this))
                .fail(function (xhr) {
                    app.message.send({
                        className: 'alert-info',
                        title: 'Инфо сообщение',
                        content: this.model.messageError(xhr)
                    });
                }.bind(this));
        },

        _message: function () {
            app.message.send({
                className: 'alert-success',
                //title: 'Вход на сайт',
                content: L.Util.template('Пользователь <b>{username}</b> успешно вошел в систему.', this.model.toJSON()),
                time: 3400
            });
        },
        _maskSelector: function () {
            return this.$el.parents('.popover-content');
        },

    });

module.exports = {
    Model: Model,
    View: View
};
},{"../../../libs/views/remote-mix":33}],46:[function(require,module,exports){
/**
 * Created by Александр on 13.09.2015.
 */
var Login = require('./login');

var Model = Login.Model.extend({
        urlRoot: '/api/auth/register',
        defaults: {
            username: '',
            password: '',
            password1: ''
        },
        validation: {
            username: {
                required: true,
                pattern: 'email'
            },
            password: {
                required: true,
                minLength: 5,
                remoteErr400: {}
            },
            password1: {
                required: true,
                minLength: 5,
                fn: function (value, attr, computedState) {
                    return value === computedState.password ? null : "Пароль не совпадает";
                }
            },
            remoteErr: {
                remote: {
                    fn: function (err, model) {
                        return err.status === 400 ? null : model.messageError(err);
                    }
                }
            }
        },
        toJSON: function () {
            return _.omit(Model.__super__.toJSON.apply(this, arguments), 'password1');
        }
    }),
    View = Login.View.extend({
        model: new Model(),
        bindings: {
            "[name=username]": "username",
            "[name=password]": "password",
            "[name=password1]": "password1"
        },
    });

module.exports = View;
},{"./login":45}],47:[function(require,module,exports){
/**
 * Created by Александр on 13.09.2015.
 */

var Login = require('./login');

var Model = Login.Model.extend({
        urlRoot: '/api/auth/createToken',
        defaults: {
            username: '',
        },
        validation: {
            username: {
                required: true,
                pattern: 'email'
            },
            remoteErr: {
                remote: {
                    fn: function (err, model) {
                        return err.status === 400 ? null : model.messageError(err);
                    }
                }
            }
        }
    }),
    View = Login.View.extend({
        el: $('#temp-password-reset').html(),
        model: new Model(),
        events: {
            "submit": "onSubmit"
        },
        bindings: {
            "[name=username]": "username",
        },

        onSync: function () {
            this._mask().end(300, function () {
                this.modal.close();
                this._message();
            }, this);

        },
        onError: function (model, xhr, options) {
            this._mask().end(300, function () {
                this.model.remoteValidate(xhr);
            }, this);

        },
        _message: function () {
            app.message.send({
                className: 'alert-info',
                title: 'Сброс пароля',
                content: L.Util.template('На Ваш email <b>{username}</b> отправленно сообщение. Для сброса пароля перейдите по <a href="/#token/{token}">ссылке</a> в письме.', this.model.toJSON()),
                time: 20000
            });
        },
        _maskSelector: function () {
            return this.$('.modal-content');
        }
    });

module.exports = function (username) {
    return new View({model: new Model({username: username})});
};
},{"./login":45}],48:[function(require,module,exports){
/**
 * Created by alex on 07.08.2015.
 */
"use strict";

var events = app.events,
    menu = require('../../libs/menu');

var Manager = menu.Manager.extend({
    initialize: function () {
        Manager.__super__.initialize.apply(this, arguments);
        app.events.channel('menu').on('active', this.onActive, this);
    }
});
var manager = new Manager();

manager.add([
    require('./maps'),
    require('./profile'),
    require('./auth'),

    require('./layers'),
    require('./meteo')
]);

events.channel('auth').on('login', function (attr) {
    manager.setVisible('login', false);
    manager.setVisible('profile', true);
});

events.channel('auth').on('logout', function (attr) {
    manager.setVisible('login', true);
    manager.setVisible('profile', false);
});

manager.render(app.map);



},{"../../libs/menu":22,"./auth":44,"./layers":49,"./maps":52,"./meteo":55,"./profile":59}],49:[function(require,module,exports){
/**
 * Created by NBP100083 on 26.08.2015.
 * Слои на карте. Можно выбрать несколько
 */
var View = require('./view');

module.exports = {
    position: 'topcenter',
    id: 'layers',
    icon: '<div  class="map-menu-button-icon icon-layers2"/>',
    popover: {
        view: new View(),
        title: 'Слои на карте'
    }
};






},{"./view":51}],50:[function(require,module,exports){
/**
 * Created by NBP100083 on 26.08.2015.
 */
var types = app.options.types,
    events = app.events,
    map = app.map,
    defTypes = _.object(_.keys(types).map(function (key, index) {
        return [key, false];
    }));


var Checks = Backbone.Model.extend({
    nameStore: 'as-state',
    defaults: defTypes,

    initialize: function (attr, options) {
        app.events.channel('system')
            .on('unload', this.onUnload, this)
            .on('load', this.onLoad, this);
    },
    onUnload: function () {
        app.store.set(this.nameStore, this.toJSON());
    },
    onLoad: function () {
        var data = app.store.get(this.nameStore);
        this.set(data);
    }
});

var Limited = Backbone.Model.extend({
    defaults: defTypes,

    initialize: function (attr, options) {
        this.onZoom();
        map.on('zoomend', this.onZoom, this);
    },
    onZoom: function () {
        var zoom = map.getZoom();
        _.keys(types).forEach(function (key) {
            this.set(key, this.isLimitedZoom(key, zoom));
        }, this);
    },
    isLimitedZoom: function (key, zoom) {
        return types[key].enableZoom[0] < zoom && types[key].enableZoom[1] > zoom;
    }
});


var m = module.exports = {
    checks: new Checks(),
    limited: new Limited()
};


var AS = Backbone.Model.extend({
    defaults: defTypes,

    initialize: function (attr, options) {
        m.checks.on('change', this.onChecks, this);
        m.limited.on('change', this.onLimited, this);
        this.on('change', function (model) {
            events.channel('layers').trigger('active', model.changed);
        });
    },
    onChecks: function (model) {
        for (var key in model.changed)
            m.limited.get(key) && this.set(key, model.get(key));
    },
    onLimited: function (model) {
        for (var key in model.changed)
            this.set(key, model.get(key) && m.checks.get(key));
    }
});

new AS()
},{}],51:[function(require,module,exports){
/**
 * Created by NBP100083 on 26.08.2015.
 */

var types = app.options.types;

var View = Backbone.View.extend({
    template: _.template($('#temp-menu-air-space').html()),
    model: require('./models').checks,
    limited: require('./models').limited,
    bindings: _.object(_.keys(types).map(function (key) {
        return ['#' + key, key];
    })),

    initialize: function (attr, options) {
        this.render();
        this.stickit();
        this.model.on('change', function (model) {

        });
        this.limited.on('change', this.onLimited, this);
    },
    render: function () {
        this.$el.append(this.template(types));
        for (var key in this.limited.toJSON())
            this.setLimited(key, this.limited.get(key));

    },
    onLimited: function (model) {
        for (var key in model.changed)
            this.setLimited(key, model.get(key));
    },

    setLimited: function (key, value) {
        this.$('#' + key)
            .prop('disabled', !value)
            .parent()
            .toggleClass('map-air-space-limited', !value)
            .attr('title', value ? types[key].title : 'ограничение zoom...');
    }

});

module.exports = View;
},{"./models":50}],52:[function(require,module,exports){
/**
 * Created by NBP100083 on 26.08.2015.
 * Слои на карте. Можно выбрать несколько
 */
var View = require('./view');

module.exports = {
    position: 'topright',
    id: 'layers',
    icon: '<div  class="map-menu-button-icon icon-maps"/>',
    popover: {
        view: new View(),
        title: 'Переключение карт'
    }
};






},{"./view":54}],53:[function(require,module,exports){
/**
 * Created by alex on 08.09.2015.
 */


var Model = Backbone.Model.extend({
    defaults: {
       maps : "OSM"
    },
    nameStore: 'map-base',

    initialize: function (attr, options) {
        app.events.channel('system')
            .on('unload', this.onUnload, this)
            .on('load', this.onLoad, this);

    },
    onUnload: function () {
        app.store.set(this.nameStore, this.toJSON());
    },
    onLoad: function () {
        var data = app.store.get(this.nameStore);
        this.set(data);
        this.setup();

    },
    setup: function(){
        app.events.channel('base-map').trigger('active', this.get('maps'));
        this.on('change', function (model) {
            app.events.channel('base-map').trigger('active', this.get('maps'));
        }, this);
    }
});

module.exports = Model;

},{}],54:[function(require,module,exports){
/**
 * Created by NBP100083 on 26.08.2015.
 */

var Model = require('./model');


var View = Backbone.View.extend({
    template: _.template($('#temp-menu-base-map').html()),
    model: new Model,
    bindings: {
      "input[name=maps]" :  "maps"
    },

    initialize: function (attr, options) {
        this.render();
        this.stickit();
        this.model.on('change', function (model) {

        });

    },
    render: function () {
        this.$el.append(this.template({}));
    }

});

module.exports = View;
},{"./model":53}],55:[function(require,module,exports){
/**
 * Created by NBP100083 on 26.08.2015.
 * Слои на карте. Можно выбрать несколько
 */
var View = require('./view');

require('./wind-scale');

module.exports = {
    position: 'topcenter',
    id: 'meteo',
    icon: '<div  class="map-menu-button-icon icon-meteo"/>',
    popover: {
        view: new View(),
        title: 'Погода'
    }
};






},{"./view":57,"./wind-scale":58}],56:[function(require,module,exports){
/**
 * Created by NBP100083 on 26.08.2015.
 */
var types = app.options.types,
    events = app.events,
    map = app.map,
    defTypes = _.object(_.keys(types).map(function (key, index) {
        return [key, false];
    }));


var Checks = Backbone.Model.extend({
    nameStore: 'meteo-state',
    defaults: defTypes,

    initialize: function (attr, options) {
        app.events.channel('system')
            .on('unload', this.onUnload, this)
            .on('load', this.onLoad, this);
    },
    onUnload: function () {
        app.store.set(this.nameStore, this.toJSON());
    },
    onLoad: function () {
        var data = app.store.get(this.nameStore);
        this.set(data);
    }

});

var Limited = Backbone.Model.extend({
    defaults: defTypes,

    initialize: function (attr, options) {
        this.onZoom();
        map.on('zoomend', this.onZoom, this);
    },
    onZoom: function () {
        var zoom = map.getZoom();
        _.keys(types).forEach(function (key) {
            this.set(key, this.isLimitedZoom(key, zoom));
        }, this);
    },
    isLimitedZoom: function (key, zoom) {
        return types[key].enableZoom[0] < zoom && types[key].enableZoom[1] > zoom;
    }
});


var m = module.exports = {
    checks: new Checks(),
    limited: new Limited()
};


var AS = Backbone.Model.extend({
    defaults: defTypes,

    initialize: function (attr, options) {
        m.checks.on('change', this.onChecks, this);
        m.limited.on('change', this.onLimited, this);
        this.on('change', function (model) {
            events.channel('layers').trigger('active', model.changed);
        });
    },
    onChecks: function (model) {
        for (var key in model.changed)
            m.limited.get(key) && this.set(key, model.get(key));
    },
    onLimited: function (model) {
        for (var key in model.changed)
            this.set(key, model.get(key) && m.checks.get(key));
    }
});

new AS()
},{}],57:[function(require,module,exports){
/**
 * Created by NBP100083 on 26.08.2015.
 */
var moment = require('moment'),
    events = app.events,
    types = app.options.types;

var View = Backbone.View.extend({
    template: _.template($('#temp-menu-meteo').html()),
    model: require('./models').checks,
    limited: require('./models').limited,
    bindings: _.object(_.keys(types).map(function (key) {
        return ['#' + key, key];
    })),
    meteoStep: [5, 7, 9, 11, 15, 19, 23, 27],
    events: {
        'change #meteo-time': 'onTime',
        'click #meteo-animation': 'onAnimation'

    },
    initialize: function (attr, options) {
        this.render();
        this.$elListTime = this.$('#meteo-time');
        this.$elProgressTime = this.$('#meteo-progress-time');

        this._createListTime().forEach(function (item) {
            this.$elListTime.append('<option value ="{0}">{1}</option>'.replace('{0}', item.value).replace('{1}', item.title));
        }, this);
        this.stickit();
        this.limited.on('change', this.onLimited, this);
    },
    render: function () {
        this.$el.append(this.template(types));
        for (var key in this.limited.toJSON())
            this._setLimited(key, this.limited.get(key));

    },
    onTime: function (e) {
        events.channel('layers').trigger('meteotime', e.target.value);
    },
    onAnimation: function (e) {
        clearInterval(this._key);
        var $progress = this.$elProgressTime.removeClass('hide').find('.progress-bar'),
            value = this.$elListTime.val(),
            list = this._createListTime(),
            step = 100/ (this.meteoStep.length-1);
        this.$elListTime.focus();

        this._index = 0;
        this._setMeteoTime(this.meteoStep[this._index]);
        $progress.width(this._index * step + '%');//.text(list[this._index].title);
        this._index ++;

        this._key = setInterval(function () {
            if (this.meteoStep[this._index]) {

                this._setMeteoTime(this.meteoStep[this._index]);
                $progress.width(this._index * step + '%');//.text(list[this._index].title);
                this._index++;

            } else {
                clearInterval(this._key);
                this._setMeteoTime(value);
                this.$elProgressTime.addClass('hide');
                $progress.width('0%');
            }
        }.bind(this), 2000);
    },
    onLimited: function (model) {
        for (var key in model.changed)
            this._setLimited(key, model.get(key));
    },
    _setProgress: function($el, step, value){

    },
    _setMeteoTime: function (value) {
        this.$elListTime.val(value).trigger('change');
    },
    _setLimited: function (key, value) {
        this.$('#' + key)
            .prop('disabled', !value)
            .parent()
            .toggleClass('map-air-space-limited', !value)
            .attr('title', value ? types[key].title : 'ограничение zoom...');
    },
    _createListTime: function () {
        var now = moment.utc(moment().format('YYYYMMDD000000'), 'YYYYMMDDHHmmss'),
            UTCHours = new Date().getUTCHours(),
            startTime = (UTCHours / 6 | 0) * 6;

        return this.meteoStep.map(function (k, index) {
            now.add(index < 4 ? 6 : 12, 'hours');
            return {
                value: k,
                title: now.utc().format('DD-MMM HH:00 UTC')
            }
        });
    }
});

module.exports = View;
},{"./models":56,"moment":81}],58:[function(require,module,exports){
/**
 * Created by alex on 30.07.2015.
 */


var Control = L.Control.extend({
    options: {
        hide: false,
        position: 'bottomright',
        className: 'icon-wind-scale map-wind-scale'
    },
    includes: L.Mixin.Events,
    initialize: function (options) {
        Control.__super__.initialize.apply(this, arguments);
        //his.id = options.id;
        this._create(this.options);
    },

    onAdd: function (map) {
        //this.setVisible(false);
        return this.el;
    },
    _create: function (options) {
        var el = this.el = L.DomUtil.create('div', options.className);

        var stop = L.DomEvent.stopPropagation;
        L.DomEvent
            .on(el, 'contextmenu', stop)
            .on(el, 'contextmenu', L.DomEvent.preventDefault)
            .on(el, 'click', stop)
            .on(el, 'mousedown', stop)
            .on(el, 'dblclick', stop)
            .on(el, 'click', L.DomEvent.preventDefault)
            .on(el, 'click', this._refocusOnMap, this);

        this.$el = $(el).attr({
            id: options.id,
            title: options.title
        });
        options.icon && this.$el.append(options.icon);
        return el;
    },

});

var cnt = new Control();


app.events.channel('layers').on('active', function (types) {
    if ('WIND' in types)
        if (types.WIND)
            app.map.addControl(cnt);
        else
            app.map.removeControl(cnt);

    //&& cnt.setVisible(types.WINDVECTOR);

});





},{}],59:[function(require,module,exports){
/**
 * Created by alex on 07.09.2015.
 */

var ViewTabs = require('../../../libs/views/tabs'),
    Model=  require('./model'),
    ViewPrivate = require('./private'),
    ViewNetworks = require('./social-networks'),
    eventAuth = app.events.channel('auth');

var View = ViewTabs.extend({
    initialize: function (options) {
        View.__super__.initialize.apply(this, arguments);
        this.views = {}
        this.setTabs(options.tabs);
    },
    setTabs: function (tabs) {
        for (var p in tabs) {
            var View = tabs[p];
            this.views[p] = new View({el: this.$(p), model: this.model});
        }
    },
    cmdLogout: function (e) {
        $.get('/api/auth/logout')
            .fail(function () {
                window.location = "/";
            })
            .done(function (data) {
                eventAuth.trigger('logout');
            });
        return false;
    },
});


module.exports = {
    //position: 'topcenter',
    position: 'topright',
    id: 'profile',
    title: 'Профиль пользователя',
    icon: '<div></dic>',//'<div class="icon-logout map-menu-button-icon"/>',
    hide: true,
    popover: {
        view: new View({
            el: $('#temp-profile').html(),
            tabs: {
                '.tab1': ViewPrivate,
                '.tab2': ViewNetworks
            },
            model: new Model()
        }),
        title: 'Профиль пользователя'

    }
};



},{"../../../libs/views/tabs":34,"./model":60,"./private":61,"./social-networks":62}],60:[function(require,module,exports){
/**
 * Created by Александр on 13.09.2015.
 */

var remoteMix = require('../../../libs/views/remote-mix'),
    eventAuth = app.events.channel('auth');

var Network = Backbone.Model.extend({
    idAttribute: '_id',
    defaults:{

    }

});

var Collection = Backbone.Collection.extend({
    url: '/api/auth/networks',
    model: Network,
    initialize: function () {
        eventAuth.on('login', this.onLogin, this);
    },
    onLogin: function(profileId){
        this.fetch({reset:true});
    }
});

var RmtModel = Backbone.Model.extend(remoteMix.Model),
    Model = RmtModel.extend({
        networks: new Collection(),
        urlRoot: '/api/auth/login',
        defaults: {
            username: '',
            name: '',
            phone: '',
        },
        validation: {
            username: {
                required: true,
                pattern: 'email'
            },
            name: {
                minLength: 5,
                remoteErr400: {}
            },
            phone: {
                minLength: 10,
                remoteErr400: {}
            },
            remoteErr: {
                remote: {
                    fn: function (err, model) {
                        return err.status === 400 ? null : model.messageError(err);
                    }
                }
            }
        },

        initialize: function () {
            Model.__super__.initialize.apply(this, arguments);
            eventAuth.on('login', this.onLogin, this);
        },
        onLogin: function (attr) {
            this.set(attr);

        }
    });

module.exports = Model;

},{"../../../libs/views/remote-mix":33}],61:[function(require,module,exports){
/**
 * Created by Александр on 13.09.2015.
 */

var remoteMix = require('../../../libs/views/remote-mix'),
    eventAuth = app.events.channel('auth');

var RmtView = Backbone.View.extend(remoteMix.View),
    View = RmtView.extend({
        events: {
            "submit": "onSubmit"
        },
        bindings: {
            "[name=username]": "username",
            "[name=name]": "name",
            "[name=phone]": "phone"
        },

        initialize: function (attr, options) {
            Backbone.Validation.bind(this);
            this.stickit();
            this._setRemoteEvents();
            eventAuth.on('login', this.onLogin, this);
        },

        onSync: function () {
            this._mask().end();
        },
        onError: function (model, xhr, options) {
            this._mask().end(300, function () {
                this.model.remoteValidate(xhr);
                //eventAuth.trigger('logout', {});
            }, this);

        },
        onSubmit: function (e) {
            e.preventDefault();
            this.model.save();
        },
        onLogin: function (attr) {
            this.model.set(attr);
        },

        _maskSelector: function () {
            return this.$el.parents('.popover-content');
        }
    });

module.exports = View;

},{"../../../libs/views/remote-mix":33}],62:[function(require,module,exports){
/**
 * Created by Александр on 13.09.2015.
 */

var eventAuth = app.events.channel('auth'),
    ViewCommand = require('../../../libs/views/command');

var View = ViewCommand.extend({
    itemTemplate: $('#temp-profile-item-nets').html(),

    initialize: function (options) {
        View.__super__.initialize.apply(this, arguments);
        this.$table = this.$('#nets');
        this.collection = this.model.networks;
        this.collection.on('reset add remove', this.render, this);
        window.preBinding = this._token.bind(this);
    },

    addNetwork: function (data) {
        data = $.parseJSON(data.toString());
        if (!data.error)
            this.collection.create(data, {wait: true});
    },
    render: function () {
        this.$table.empty();
        this.collection.each(this.renderItem, this);
    },
    renderItem: function (model) {
        var el = L.Util.template(this.itemTemplate, model.toJSON());
        this.$('#nets').append(el);
    },

    cmdRemove: function (e) {
        e.preventDefault();
        var index = $(e.currentTarget).data('index');
        this.collection.get(index).destroy({wait: true});
        return false;
    },
    _token: function (token) {
        var callback = this.addNetwork.bind(this);
        $.getJSON("//ulogin.ru/token.php?host=" + encodeURIComponent(location.toString()) + "&token=" + token + "&callback=?", callback);
    }
});

module.exports = View;

},{"../../../libs/views/command":31}],63:[function(require,module,exports){
/**
 * Created by NBP100083 on 19.08.2015.
 */

//route event controller 
var Controller = function (route) {
    this.initialize(route); // route as collection Backbone
};

Controller.prototype = {
    events: app.events.channel('route'),
    initialize: function (route) {
        this.route = route;
        this.events
            .on('add', this.onAdd, this)
            .on('remove', this.onRemove, this)
            .on('change', this.onChange, this)
            .on('reset', this.onReset, this)
            .on('reverse', this.onReverse, this);
    },

    onAdd: function (attr, options) {
        this.route.add(attr, options);
    },
    onRemove: function (model, options) {
        model = this._getModel(model);
        this.route.remove(model, options);
    },
    onChange: function (model, attr, options) {
        model = this._getModel(model);
        model.set(attr, options);
    },
    onReset: function (attrs, options) {
        this.route.reset(attrs, options);
    },
    onReverse: function () {
        this.route.reverse();
    },

    _getModel: function (model) {
        return _.isString(model) ? this.route.get(model) : model;
    }

};

module.exports=Controller;
},{}],64:[function(require,module,exports){
/**
 * Created by NBP100083 on 16.08.2015.
 */
"use strict";



var Route = require('./model'),
    Cnt = require('./controller'),
    View = require('./views/map/route');

var c = new Route([], {parse: true});

new Cnt(c);

var v = new View(c);

v.addTo(app.map);
//
//setTimeout(function () {
//    c.at(0).set({id: 6, latlng: L.latLng([56, 43]), type: 'df'}, {parse: true});
//}, 2000)
//
//
//setTimeout(function () {
//    c.at(0).set({id: 6, latlng: L.latLng([56, 43]), type: 'wp'}, {parse: true});
//    //c.reverse();
//    //c.reset();
//    //map.removeLayer(v);
//}, 4000);

//var Geodesic = L.geodesic([], {
//    weight: 7,
//    opacity: 0.5,
//    color: 'blue',
//    steps: 50
//}).addTo(map);
//var berlin = new L.LatLng(56, 43);
////var losangeles = new L.LatLng(33.82, -118.38);
//var capetown = new L.LatLng(56, 44);
//
//Geodesic.setLatLngs([[berlin,  capetown]]);
},{"./controller":63,"./model":65,"./views/map/route":70}],65:[function(require,module,exports){
/**
 * Created by NBP100083 on 16.08.2015.
 */
"use strict";

var WayPoint = Backbone.Model.extend({
    defaults: {
        id: null,
        type: 'wp',
        name: 'Way Point',
        latlng: null,
        icon: null
    },
    isDefaultType: function () {
       return this.get('type') === this.defaults.type;
    },
    getIcon: function () {
        return this.get('icon') || this.get('type');
    },
    parse: function (data) {
        if (data.latlng && _.isArray(data.latlng))
            data.latlng = L.latLng(data.latlng);
        return data;
    },
    next: function () {
        var index = this.collection.indexOf(this);
        return this.collection.models[index + 1];
    },
    prev: function () {
        var index = this.collection.indexOf(this);
        return this.collection.models[index - 1];
    },

    isChangeRouteMap:function(){
        return !!(this.changed.latlng || this.changed.type || this.changed.icon);
    }
});

var Route = Backbone.Collection.extend({
    model: WayPoint,
    getPath: function () {
        return this.pluck('latlng');
    },
    reverse: function(){
        var models = this.models.reverse();
        this.reset(models);
    }
});

module.exports = Route;


/*
 wp.on('change', function(model){
 console.log(model.toJSON());
 }, wp);

 wp.set('latlng', L.latLng(43,56,1));
 wp.set('latlng', L.latLng(44,56,2));
 */

},{}],66:[function(require,module,exports){
/**
 * Created by NBP100083 on 16.08.2015.
 */
"use strict";

var Base = require('./drag-marker'),
    events = app.events;

var Direction = Base.extend({
    options: {
        draggable: true,
        zIndexOffset: 1000,
        icon: L.divIcon({
            className: 'icon-airplane',
            iconSize: L.point(16, 16)
        })
    },
    initialize: function (model, options) {
        Direction.__super__.initialize.apply(this, arguments);
        //this.setLatLng([]);
        this.angle = 0;
    },
    // расчет и обновление позиции и поворота
    refresh: function (layer) {
        var next = this.model.next();
        if (layer._map && next) {
            this.angle = this._calcAngle(next, layer._map);
            this.setLatLng(this._calcLatlng(next, layer._map, true));
            this.visible(true);
        } else
            this.visible(false);

    },
    onClick: function (e) {
        e.model = this.model;
        events.channel('info').trigger('direction', e);
    },
    onDrag: function () {
        var path = _.compact([
            this.model.get('latlng'),
            this.getLatLng(),
            this.model.next() && this.model.next().get('latlng')
        ]);
        this.dragLine.setLatLngs([path]);
    },

    // rotate marker
    _setPos: function (pos) {
        Direction.__super__._setPos.apply(this, arguments);

        if (L.DomUtil.TRANSFORM) {
            // use the CSS transform rule if available
            this._icon.style[L.DomUtil.TRANSFORM] += ' rotate(' + this.angle  + 'deg)';
        } else if (L.Browser.ie) {
            // fallback for IE6, IE7, IE8
            var rad = this.angle * L.LatLng.DEG_TO_RAD,
                costheta = Math.cos(rad),
                sintheta = Math.sin(rad);
            this._icon.style.filter += ' progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\'auto expand\', M11=' +
            costheta + ', M12=' + (-sintheta) + ', M21=' + sintheta + ', M22=' + costheta + ')';
        }
    },

    // calculation
    _calcLatlng: function (next, map, isGeodesic) {
        var latlng= this.model.get('latlng'),
            latlng1 =next.get('latlng');
        if(isGeodesic) {
            var r = this.dragLine._vincenty_inverse(latlng, latlng1);
            var l = this.dragLine._vincenty_direct(latlng, r.initialBearing, r.distance / 2);
            return l;
        } else
            return this.model.get('latlng').middle(next.get('latlng'), map);
    },
    _calcAngle: function (next, map, isGeodesic) {
        var latlng= this.model.get('latlng'),
            latlng1 =next.get('latlng');

        if(isGeodesic) {
            var r = this.dragLine._vincenty_inverse(latlng, latlng1);
            return (r.initialBearing + 360) % 360;
        } else
            return latlng.angle(latlng1, map);
    }

});
module.exports = Direction;
},{"./drag-marker":67}],67:[function(require,module,exports){
/**
 * Created by NBP100083 on 16.08.2015.
 */
"use strict";

var DragMarker = L.MarkerModel.extend({
    options: {
        draggable: true
    },
    dragLine: L.geodesic([], {
        steps:50,
        className: 'map-route-line-drag'
    }),
    initialize: function (model, options) {
        DragMarker.__super__.initialize.apply(this, arguments);

    },
    refresh: function () {

    },
    toggle: function (layer, value) {
        if (layer) {
            if (value)
                !layer.hasLayer(this) && layer.addLayer(this);
            else
                layer.hasLayer(this) && layer.removeLayer(this);
        }
    },

    // interface control
    onAdd: function (map) {
        DragMarker.__super__.onAdd.apply(this, arguments);
        this.onClick && this.on('click', this.onClick, this);
        this._setup(map);
    },
    onRemove: function () {
        this._clear();
        DragMarker.__super__.onRemove.apply(this, arguments);
    },

    // events drag
    onDragstart: function () {
        this._startLatlng = this.getLatLng();
        this.dragLine.addTo(this._map);
    },
    onDrag: function (e) {

    },
    onDragend: function (e) {
        e.endLatlng = this.getLatLng();
        this.setLatLng(this._startLatlng);
        this.dragLine.setLatLngs([]);
        this._map.removeLayer(this.dragLine);

    },

    _setEvents: function () {
        this.on('dragstart', this.onDragstart, this)
            .on('drag', this.onDrag, this)
            .on('dragend', this.onDragend, this);
    },
    _setup: function () {
        this.options.draggable && this._setEvents();
    },
    _clear: function () {
        this.off(null, null, this);
        this.model.off(null, null, this);
        this.model= null;
    }
});

module.exports = DragMarker;
},{}],68:[function(require,module,exports){
/**
 * Created by NBP100083 on 16.08.2015.
 */
"use strict";

var Direction = require('./direction');

var Informer = Direction.extend({
    template: '<div class="{c}" title="{a}&deg; {d} км">{a}&deg; {d} км</div>',
    options: {
        zIndexOffset: 1000,
        draggable: false,
        clickable: false,
        icon: L.divIcon({
            iconSize: new L.Point(80, 12),
            iconAnchor: new L.Point(0, 6),
            className: 'map-direct-icon'
        })
    },

    refresh: function (layer) {
        var next = this.model.next();

        if (layer._map && next) {
            var l= this._calcLatlng(next, layer._map, true);
            var trueCurse = this._calcAngle(next, layer._map, true);
            this.angle = trueCurse - 90;
            this.setLatLng(this.model.get('latlng'));
            this.visible(true);
            this.setHtml(trueCurse,
                this.model.get('latlng').distanceTo(next.get('latlng')),
                this._pixelsToNext(layer._map) / 2
            );
        } else
            this.visible(false);

    },
    setHtml: function (a, d, p) {
        var $icon = $(this._icon);
        if (p < this.options.icon.options.iconSize.x+10)
            $icon.hide();
        else
            $icon
                .html(L.Util.template(this.template, {
                    c: a > 180 ? 'map-direct-icon-180' : '',
                    a: a | 0,
                    d: d / 1000 | 0
                }))
                .show();
    },

    _pixelsToNext: function (map) {    // растояние между точками в пикселях
        var next = this.model.next();
        if (next)
            return this.model.get('latlng').toPoint(map).distanceTo(next.get('latlng').toPoint(map));
        else
            return 0;
    },

    _angleDiv: function(next){
        var l= this._calcLatlng(next, null, true);
        var trueCurse = this._calcAngle(next, layer._map, true);
    }
});
module.exports = Informer;
},{"./direction":66}],69:[function(require,module,exports){
/**
 * Created by NBP100083 on 16.08.2015.
 */
"use strict";

var Vertex = require('./vertex'),
    Direction = require('./direction'),
    Informer = require('./informer');

var Marker = L.LayerModel.extend({
    options: {},
    _evRoute: app.events.channel('route'),

    initialize: function (model, options) {
        Marker.__super__.initialize.apply(this, arguments);
        this.direction = new Direction(this.model, this.options.direction)
            .on('dragend', this.onDragendDirection, this)
            .on('click', this.onClick, this);
        this.addLayer(this.direction);

        this.vertex = new Vertex(this.model, this.options.vertex)
            .on('contextmenu', this.onContextmenuVertex, this)
            .on('dragend', this.onDragendVertex, this);
        this.addLayer(this.vertex);

        this.informer = new Informer(this.model);
        this.addLayer(this.informer);

    },

    //interface L.Layer
    onAdd: function (map) {
        Marker.__super__.onAdd.apply(this, arguments);
        this.update(map);
        map.on('zoomend', this.onZoom, this);
    },
    onRemove: function () {
        this._map.off('zoomend', this.onZoom, this);
        this.eachLayer(function (layer) {
            layer.off && layer.off(null, null, this);
        }, this);
        this.vertex = this.informer = this.direction = this.model = null;
        Marker.__super__.onRemove.apply(this, arguments);

    },
    onZoom: function () {
        this.informer.refresh(this);
    },
    onClick: function (e) {

    },

    //calc direction and informer
    update: function () {
        this.direction.refresh(this);
        this.informer.refresh(this);
        return this;
    },
    indexOf: function () {
        return this.model.collection.indexOf(this.model);
    },

    //methods vertex
    onDragendVertex: function (e) {
        this._evRoute.trigger('change', this.model.cid, {latlng: e.endLatlng});
    },
    onContextmenuVertex: function () {
        setTimeout(function () {
            this._evRoute.trigger('remove', this.model);
        }.bind(this))
    },

    //methods direction
    onDragendDirection: function (e) {
        this._evRoute.trigger('add', {latlng: e.endLatlng}, {at: this.indexOf() + 1});
    }

});

module.exports = Marker;
},{"./direction":66,"./informer":68,"./vertex":71}],70:[function(require,module,exports){
/**
 * Created by NBP100083 on 16.08.2015.
 */
"use strict";

var Marker = require('./marker');


var Route = L.LayerCollection.extend({
    options: {
        vertex: {
            draggable: true
        },
        line: {
            //weight: 7,
            //opacity: 0.5,
            //color: 'blue',
            steps: 50,
            className: 'map-route-line',
            clickable: false
        }
    },
    datum: {
        ellipsoid: {
            a: 6378137, // 6378137
            b: 6356752.3142,
            f: 1 / 298.257223563
        }	 // WGS-84
    },

    initialize: function (options) {
        Route.__super__.initialize.apply(this, arguments);
        var p = this.collection.getPath();
        this.line = L.geodesic([p], this.options.line);
        //this.addLayer(this.line);

        this.createMarkers();
        this.collection
            .on('change:latlng', this.onModelLatlng, this)
            .on('remove', this.onModelRemove, this)
            .on('add', this.onModelAdd, this)
            .on('reset', this.onModelReset, this)
    },
    onAdd: function (map) {
        Route.__super__.onAdd.apply(this, arguments);
        //this.line.addTo(map);
        this.addLayer(this.line);

    },
    onRemove: function () {
        this.collection.off(null, null, this);
        Route.__super__.onRemove.apply(this, arguments);
    },

    capture: function (latlng, pixels, map) {
        var _map = map || this._map;
        if (_map)
            return this.getLayers()
                .filter(function (layer) {
                    return layer instanceof Marker
                        && layer.vertex.getLatLng().toPoint(_map).distanceTo(latlng.toPoint(_map)) <= pixels;
                }, this)
                .map(function (layer) {
                    return {
                        layer: layer,
                        distance: layer.vertex.getLatLng().distanceTo(latlng)
                    }
                });
        else
            return [];
    },
    update: function () {
        this.line.setLatLngs([this.collection.getPath()]);
        this.eachLayer(function (layer) {
            if (layer instanceof Marker)
                layer.update();
        });
    },
    createMarkers: function () {
        this.collection.each(function (model) {
            this.addLayer(new Marker(model));
        }, this);
    },

    onModelLatlng: function () {
        this.update();
    },
    onModelAdd: function (model) {
        this.addLayer(new Marker(model, this.options.vertex));
        this.update();
    },
    onModelRemove: function (model) {
        var layer = _.findWhere(this.getLayers(), {model: model});
        this.removeLayer(layer);
        this.update();
    },
    onModelReset: function () {
        this.eachLayer(function (layer) {
            if (layer instanceof Marker)
                this.removeLayer(layer);
        }, this);
        this.createMarkers();
        this.update();

    },

    /**
     * Vincenty inverse calculation.
     * based on the work of Chris Veness (https://github.com/chrisveness/geodesy)
     *
     * @private
     * @param {LatLng} p1 - Latitude/longitude of start point.
     * @param {LatLng} p2 - Latitude/longitude of destination point.
     * @returns {Object} Object including distance, initialBearing, finalBearing.
     * @throws {Error} If formula failed to converge.
     */
    _vincenty_inverse: function (p1, p2) {
        var φ1 = p1.lat.toRadians(), λ1 = p1.lng.toRadians();
        var φ2 = p2.lat.toRadians(), λ2 = p2.lng.toRadians();

        var a = this.datum.ellipsoid.a, b = this.datum.ellipsoid.b, f = this.datum.ellipsoid.f;

        var L = λ2 - λ1;
        var tanU1 = (1 - f) * Math.tan(φ1), cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)), sinU1 = tanU1 * cosU1;
        var tanU2 = (1 - f) * Math.tan(φ2), cosU2 = 1 / Math.sqrt((1 + tanU2 * tanU2)), sinU2 = tanU2 * cosU2;

        var λ = L, λʹ, iterations = 0;
        do {
            var sinλ = Math.sin(λ), cosλ = Math.cos(λ);
            var sinSqσ = (cosU2 * sinλ) * (cosU2 * sinλ) + (cosU1 * sinU2 - sinU1 * cosU2 * cosλ) * (cosU1 * sinU2 - sinU1 * cosU2 * cosλ);
            var sinσ = Math.sqrt(sinSqσ);
            if (sinσ == 0) return 0;  // co-incident points
            var cosσ = sinU1 * sinU2 + cosU1 * cosU2 * cosλ;
            var σ = Math.atan2(sinσ, cosσ);
            var sinα = cosU1 * cosU2 * sinλ / sinσ;
            var cosSqα = 1 - sinα * sinα;
            var cos2σM = cosσ - 2 * sinU1 * sinU2 / cosSqα;
            if (isNaN(cos2σM)) cos2σM = 0;  // equatorial line: cosSqα=0 (§6)
            var C = f / 16 * cosSqα * (4 + f * (4 - 3 * cosSqα));
            λʹ = λ;
            λ = L + (1 - C) * f * sinα * (σ + C * sinσ * (cos2σM + C * cosσ * (-1 + 2 * cos2σM * cos2σM)));
        } while (Math.abs(λ - λʹ) > 1e-12 && ++iterations < 100);
        if (iterations >= 100) {
            console.log('Formula failed to converge. Altering target position.')
            return this._vincenty_inverse(p1, {lat: p2.lat, lng: p2.lng - 0.01})
//	throw new Error('Formula failed to converge');
        }

        var uSq = cosSqα * (a * a - b * b) / (b * b);
        var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
        var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
        var Δσ = B * sinσ * (cos2σM + B / 4 * (cosσ * (-1 + 2 * cos2σM * cos2σM) -
            B / 6 * cos2σM * (-3 + 4 * sinσ * sinσ) * (-3 + 4 * cos2σM * cos2σM)));

        var s = b * A * (σ - Δσ);

        var fwdAz = Math.atan2(cosU2 * sinλ, cosU1 * sinU2 - sinU1 * cosU2 * cosλ);
        var revAz = Math.atan2(cosU1 * sinλ, -sinU1 * cosU2 + cosU1 * sinU2 * cosλ);

        s = Number(s.toFixed(3)); // round to 1mm precision
        return {distance: s, initialBearing: fwdAz.toDegrees(), finalBearing: revAz.toDegrees()};
    },


    /**
     * Returns the point of intersection of two paths defined by point and bearing.
     * based on the work of Chris Veness (https://github.com/chrisveness/geodesy)
     *
     * @param {LatLon} p1 - First point.
     * @param {number} brng1 - Initial bearing from first point.
     * @param {LatLon} p2 - Second point.
     * @param {number} brng2 - Initial bearing from second point.
     * @returns {Object} containing lat/lng information of intersection.
     *
     * @example
     * var p1 = LatLon(51.8853, 0.2545), brng1 = 108.55;
     * var p2 = LatLon(49.0034, 2.5735), brng2 = 32.44;
     * var pInt = LatLon.intersection(p1, brng1, p2, brng2); // pInt.toString(): 50.9078°N, 4.5084°E
     */
    _intersection: function (p1, brng1, p2, brng2) {
        // see http://williams.best.vwh.net/avform.htm#Intersection

        var φ1 = p1.lat.toRadians(), λ1 = p1.lng.toRadians();
        var φ2 = p2.lat.toRadians(), λ2 = p2.lng.toRadians();
        var θ13 = Number(brng1).toRadians(), θ23 = Number(brng2).toRadians();
        var Δφ = φ2 - φ1, Δλ = λ2 - λ1;

        var δ12 = 2 * Math.asin(Math.sqrt(Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)));
        if (δ12 == 0) return null;

        // initial/final bearings between points
        var θ1 = Math.acos(( Math.sin(φ2) - Math.sin(φ1) * Math.cos(δ12) ) /
        ( Math.sin(δ12) * Math.cos(φ1) ));
        if (isNaN(θ1)) θ1 = 0; // protect against rounding
        var θ2 = Math.acos(( Math.sin(φ1) - Math.sin(φ2) * Math.cos(δ12) ) /
        ( Math.sin(δ12) * Math.cos(φ2) ));

        if (Math.sin(λ2 - λ1) > 0) {
            var θ12 = θ1;
            var θ21 = 2 * Math.PI - θ2;
        } else {
            var θ12 = 2 * Math.PI - θ1;
            var θ21 = θ2;
        }

        var α1 = (θ13 - θ12 + Math.PI) % (2 * Math.PI) - Math.PI; // angle 2-1-3
        var α2 = (θ21 - θ23 + Math.PI) % (2 * Math.PI) - Math.PI; // angle 1-2-3

        if (Math.sin(α1) == 0 && Math.sin(α2) == 0) return null; // infinite intersections
        if (Math.sin(α1) * Math.sin(α2) < 0) return null; // ambiguous intersection

        //α1 = Math.abs(α1);
        //α2 = Math.abs(α2);
        // ... Ed Williams takes abs of α1/α2, but seems to break calculation?

        var α3 = Math.acos(-Math.cos(α1) * Math.cos(α2) +
        Math.sin(α1) * Math.sin(α2) * Math.cos(δ12));
        var δ13 = Math.atan2(Math.sin(δ12) * Math.sin(α1) * Math.sin(α2),
            Math.cos(α2) + Math.cos(α1) * Math.cos(α3))
        var φ3 = Math.asin(Math.sin(φ1) * Math.cos(δ13) +
        Math.cos(φ1) * Math.sin(δ13) * Math.cos(θ13));
        var Δλ13 = Math.atan2(Math.sin(θ13) * Math.sin(δ13) * Math.cos(φ1),
            Math.cos(δ13) - Math.sin(φ1) * Math.sin(φ3));
        var λ3 = λ1 + Δλ13;
        λ3 = (λ3 + 3 * Math.PI) % (2 * Math.PI) - Math.PI; // normalise to -180..+180º

        return L.latLng(φ3.toDegrees(), λ3.toDegrees());
    },

    _intersectionSeg: function (seg1, seg2) {
        var s1 = this._vincenty_inverse.apply(this, seg1),
            s2 = this._vincenty_inverse.apply(this, seg2),
            latlng = this._intersection(seg1[0], s1.initialBearing, seg2[0], s2.initialBearing);

        if (latlng)
            return (
            Math.abs(seg1[0].distanceTo(seg1[1]) - latlng.distanceTo(seg1[0]) - latlng.distanceTo(seg1[1])) < LIMIT &&
            Math.abs(seg2[0].distanceTo(seg2[1]) - latlng.distanceTo(seg2[0]) - latlng.distanceTo(seg2[1])) < LIMIT
            ) ? latlng : null;
        else
            return null;


    },
    intersectionTo: function (zone) {
        var path = this.getLatLngs(),
            path1 = zone.getLatLngs(),
            r = [];

        for (var i = 0, l = path.length - 1; i < l; i++)
            for (var j = 0, l1 = path.length - 1; j < l1; i++) {
                var latlng = this._intersectionSeg([path[i], path[i + 1]], [path1[j], path1[j + 1]]);
                latlng && r.push(latlng);
            }
        return r.length ? r : null;
    }

});

module.exports = Route;
},{"./marker":69}],71:[function(require,module,exports){
/**
 * Created by NBP100083 on 16.08.2015.
 */
"use strict";

var Base = require('./drag-marker'),
    events = app.events,
    icons = require('../../../../core/options').icons;


var Vertex = Base.extend({
    options: {
        zIndexOffset: 1010
    },
    initialize: function (model, options) {
        var opt = _.extend(this._getOptions(model), options);
        Vertex.__super__.initialize.call(this, model, opt);
        this.model.on('change', this.onChange, this);

    },

    setDragging: function (value) {
        value = value || this.options.draggable;
        this.dragging[value ? 'enable' : 'disable']();
    },
    refresh: function () {

    },
    onClick: function (e) {
        e.model = this.model;
        events.channel('info').trigger('route:vertex', e);
    },
    onDrag: function () {
        var path = _.compact([
            this.model.prev() && this.model.prev().get('latlng'),
            this.getLatLng(),
            this.model.next() && this.model.next().get('latlng')
        ]);
        this.dragLine.setLatLngs([path]);

    },
    onChange: function (model) {
        if (model.isChangeRouteMap()) {
            L.Util.setOptions(this, this._getOptions(model));
            if (model.changed.type || model.changed.icon) {
                this.setIcon(this.options.icon);
                this.setDragging();
            }
            if (model.changed.latlng)
                this.setLatLng(this.model.get('latlng'));
        }
    },

    _getOptions: function (model) {
        return {
            draggable: model.isDefaultType(),
            title: model.get('name'),
            icon: this._getIcon(model)
        };

    },
    _getIcon: function (model) {
        model = model || this.model;
        return icons[model.getIcon()];
    }
});

module.exports = Vertex;
},{"../../../../core/options":5,"./drag-marker":67}],72:[function(require,module,exports){
/**
 * Created by alex on 06.10.2015.
 */

var Layer = L.TileLayer.extend({
    options: {
    },
    initialize: function (options) {
        this.url = options.urlTempl.replace('{t}', '5');
        Layer.__super__.initialize.call(this, this.url, options);
        app.events.channel('layers').on('meteotime', this.onTime, this);
    },
    getType: function () {
        return this.options.type;
    },
    onTime: function (value) {
        this.setUrl(this.options.urlTempl.replace('{t}', value));
    }
});

module.exports = Layer;
},{}],73:[function(require,module,exports){
/**
 * Created by alex on 02.09.2015.
 */

var Layers = require('../../libs/layer'),
    SeeMarker = require('./see-marker'),
    Meteo = require('./base-meteo'),
    events = app.events.channel('layers');

var MyLayers = Layers.extend({
    initialize: function (layers) {
        MyLayers.__super__.initialize.apply(this, arguments);
        events.on('active', this.onActive, this);
    }
});

var map = app.map;



var layers = new MyLayers([
    require('./marine'),
    require('./ligth'),
    new SeeMarker(),
    new Meteo({type:'WIND', urlTempl:'http://www.openportguide.org/tiles/actual/wind_vector/{t}/{z}/{x}/{y}.png'}),
    new Meteo({type:'PRESS', urlTempl:'http://www.openportguide.org/tiles/actual/surface_pressure/{t}/{z}/{x}/{y}.png'}),
    new Meteo({type:'TEMP', urlTempl:'http://www.openportguide.org/tiles/actual/air_temperature/{t}/{z}/{x}/{y}.png'}),
    new Meteo({type:'PRECIPITATION', urlTempl:'http://www.openportguide.org/tiles/actual/precipitation/{t}/{z}/{x}/{y}.png'}),
    new Meteo({type:'WAVE', urlTempl:'http://www.openportguide.org/tiles/actual/significant_wave_height/{t}/{z}/{x}/{y}.png'}),
]);


layers.addTo(map);

},{"../../libs/layer":17,"./base-meteo":72,"./ligth":75,"./marine":78,"./see-marker":80}],74:[function(require,module,exports){
/**
 * Created by alex on 28.08.2015.
 */

var Collection = require('../../../libs/layer/collection'),
    Model = require('../../../libs/layer/model'),
    osmtogeojson = require('osmtogeojson');

var Ligth = Model.extend({
    coordName: 'latlng',
    isBounds: function (bounds) {
        return bounds.contains(this.get(this.coordName));
    },
    parse : function(attr){
        return {
            id: attr.id,
            latlng: new L.latLng(attr.position),
            title : attr.title,
            site : attr.website
        }
    }
});

var LigthList = Collection.extend({
    nameObj: 'ligth',
    model: Ligth,
    url: '/api/marina',

    initialize: function (options) {
        LigthList.__super__.initialize.apply(this, arguments);
    },
    load: function () {
        var query = {
            bounds: app.map.getBounds().toBBoxString()
        };
        return this.fetch({data: query, reset: true});

    }
});

module.exports = LigthList;
},{"../../../libs/layer/collection":16,"../../../libs/layer/model":18,"osmtogeojson":82}],75:[function(require,module,exports){
/**
 * Created by alex on 16.09.2015.
 */


var Collection = require('./collection'),
    View = require('./view');


module.exports = new View(
    new Collection({
        //url: '/map/public/data/{0}.json'.replace('{0}', 'AD'),
        type: 'LIGTH'
    }));
},{"./collection":74,"./view":76}],76:[function(require,module,exports){
/**
 * Created by NBP100083 on 26.08.2015.
 */
"use strict";

var View = require('../../../libs/layer/view'),
    size = 24;


var Marker = L.Marker.extend({
    initialize: function (model, options) {
        this.model = model;
        Marker.__super__.initialize.call(this, model.get(model.coordName), options);

    },
    onAdd: function (map) {
        Marker.__super__.onAdd.apply(this, arguments);
        this.on('click', this.onClick, this);
    },
    onRemove: function () {
        this.off('click', this.onClick, this);
        Marker.__super__.onRemove.apply(this, arguments);
    },

    onClick: function (e) {
        window.open(this.model.get('site'), '_blank');
    }

});


var See = View.extend({
    _debug: false,
    options: {
        layer: function (model) {
            return {
                //clickable: false,
                title: model.get('title'),
                icon: L.divIcon({
                    iconSize: L.point(size, size),
                    iconAnchor: L.point(size / 2, size / 2),
                    className: 'icon-marina_' + size + ' map-see-icon-marine',
                    //html: L.Util.template($('#temp-see-icon-marine').html(), _.extend({size: size}, model.toJSON()))
                })
            }
        }
    },
    onAdd: function (map) {
        View.__super__.onAdd.apply(this, arguments);

        setTimeout(function () {
            this._map.on('moveend', this.onRefresh, this);
        }.bind(this));

        this.collection.load(this._getParams())
            .done(this.render.bind(this))
            .fail(this.onError.bind(this));

    },

    onError: function (xhr) {
        if (xhr.status > 0)
            app.message.send({
                className: 'alert-danger',
                title: 'Error',
                content: L.Util.template('<p>Код ошибки:<code>{status}</code>. {statusText}</p>', xhr),
                time: 6000,
                animation: 0
            });
    },
    onRefresh: function () {
        this.collection.load(this._getParams())
            .done(this.render.bind(this))
            .fail(this.onError.bind(this));
    },
    create: function (model) {
        var marker = new Marker(model, this.options.layer(model));
        this.addLayer(marker);
    },

    _getParams: function () {
        var bounds = this._map.getBounds();
        return {
            s: bounds.getSouth(),
            n: bounds.getNorth(),
            w: bounds.getWest(),
            e: bounds.getEast(),
            z: this._map.getZoom()
        };
    }

});

module.exports = See;

},{"../../../libs/layer/view":19}],77:[function(require,module,exports){
/**
 * Created by alex on 28.08.2015.
 */

var Collection = require('../../../libs/layer/collection'),
    Model = require('../../../libs/layer/model');

var See = Model.extend({
    coordName: 'latlng',
    isBounds: function (bounds) {
        return bounds.contains(this.get(this.coordName));
    }
});

var SeeList = Collection.extend({
    url: 'http://dev.openseamap.org/website/map/api/getHarbours.php?b={b}&t={t}&l={l}&r={r}&ucid=7&maxSize=6&zoom={z}',
    nameObj: 'see',
    model: See,

    initialize: function (options) {
        SeeList.__super__.initialize.apply(this, arguments);
        window.putHarbourMarker = this._load.bind(this);
    },
    load: function (params) {
        var url = L.Util.template(this.url, params);
        this.reset();
        return this.ready = $.getScript(url, function (data, status, xhr) {

        }.bind(this));
    },
    _load: function (id, lng, lat, title, site, num) {
        var model = new this.model({
            id: id,
            latlng: L.latLng(lat, lng),
            title: title,
            site: site
        });
        this.add(model);
    }
});

module.exports = SeeList;
},{"../../../libs/layer/collection":16,"../../../libs/layer/model":18}],78:[function(require,module,exports){
/**
 * Created by alex on 16.09.2015.
 */


var Collection = require('./collection'),
    View = require('./view');


module.exports = new View(
    new Collection({
        //url: '/map/public/data/{0}.json'.replace('{0}', 'AD'),
        type: 'MARINE'
    }));
},{"./collection":77,"./view":79}],79:[function(require,module,exports){
/**
 * Created by NBP100083 on 26.08.2015.
 */
"use strict";

var View = require('../../../libs/layer/view'),
    size = 24;


var Marker = L.Marker.extend({
    initialize: function (model, options) {
        this.model = model;
        Marker.__super__.initialize.call(this, model.get(model.coordName), options);

    },
    onAdd: function (map) {
        Marker.__super__.onAdd.apply(this, arguments);
        this.on('click', this.onClick, this);
    },
    onRemove: function () {
        this.off('click', this.onClick, this);
        Marker.__super__.onRemove.apply(this, arguments);
    },

    onClick: function (e) {
        window.open(this.model.get('site'), '_blank');
    }

});


var See = View.extend({
    _debug: false,
    options: {
        layer: function (model) {
            return {
                //clickable: false,
                title: model.get('title'),
                icon: L.divIcon({
                    iconSize: L.point(size, size),
                    iconAnchor: L.point(size / 2, size / 2),
                    className: 'icon-marina_' + size + ' map-see-icon-marine',
                    html: L.Util.template($('#temp-see-icon-marine').html(), _.extend({size: size}, model.toJSON()))
                })
            }
        }
    },
    onAdd: function (map) {
        View.__super__.onAdd.apply(this, arguments);

        setTimeout(function () {
            this._map.on('moveend', this.onRefresh, this);
        }.bind(this));

        this.collection.load(this._getParams()).done(this.render.bind(this));

    },

    onRefresh: function () {
        this.collection.load(this._getParams()).done(this.render.bind(this));
    },
    create: function (model) {
        var marker = new Marker(model, this.options.layer(model));
        this.addLayer(marker);
    },

    _getParams: function () {
        var bounds = this._map.getBounds();
        return {
            b: bounds.getSouth(),
            t: bounds.getNorth(),
            l: bounds.getWest(),
            r: bounds.getEast(),
            z: this._map.getZoom()
        };
    }

});

module.exports = See;

},{"../../../libs/layer/view":19}],80:[function(require,module,exports){
/**
 * Created by alex on 03.09.2015.
 */

var Layer = L.TileLayer.extend({
    options: {
        //minZoom: 9
    }, //http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png
    url: 'http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png',
    initialize: function (url, options) {
        Layer.__super__.initialize.call(this, this.url, options);
    },
    getType: function () {
        return "SEEMARKER";
    }
});

module.exports = Layer;
},{}],81:[function(require,module,exports){
//! moment.js
//! version : 2.10.6
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, function () { 'use strict';

    var hookCallback;

    function utils_hooks__hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            m._isValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = getParsingFlags(from);
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function Locale() {
    }

    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && typeof module !== 'undefined' &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (typeof values === 'undefined') {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, values) {
        if (values !== null) {
            values.abbr = name;
            locales[name] = locales[name] || new Locale();
            locales[name].set(values);

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    // returns locale data
    function locale_locales__getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get (mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function get_set__set (mom, unit, value) {
        return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }

    // MOMENTS

    function getSet (units, value) {
        var unit;
        if (typeof units === 'object') {
            for (unit in units) {
                this.set(unit, units[unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;

    var regexes = {};

    function isFunction (sth) {
        // https://github.com/moment/moment/issues/2325
        return typeof sth === 'function' &&
            Object.prototype.toString.call(sth) === '[object Function]';
    }


    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  matchWord);
    addRegexToken('MMMM', matchWord);

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m) {
        return this._months[m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m) {
        return this._monthsShort[m.month()];
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (firstTime) {
                warn(msg + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;

    var from_string__isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
        ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
        ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d{2}/],
        ['YYYY-DDD', /\d{4}-\d{3}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
        ['HH:mm', /(T| )\d\d:\d\d/],
        ['HH', /(T| )\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = from_string__isoRegex.exec(string);

        if (match) {
            getParsingFlags(config).iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    config._f = isoDates[i][0];
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    // match[6] should be 'T' or space
                    config._f += (match[6] || ' ') + isoTimes[i][0];
                    break;
                }
            }
            if (string.match(matchOffset)) {
                config._f += 'Z';
            }
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    function createDate (y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', false);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = local__createLocal(mom).add(daysToDayOfWeek, 'd');
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var week1Jan = 6 + firstDayOfWeek - firstDayOfWeekOfYear, janX = createUTCDate(year, 0, 1 + week1Jan), d = janX.getUTCDay(), dayOfYear;
        if (d < firstDayOfWeek) {
            d += 7;
        }

        weekday = weekday != null ? 1 * weekday : firstDayOfWeek;

        dayOfYear = 1 + week1Jan + 7 * (week - 1) - d + weekday;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()];
        }
        return [now.getFullYear(), now.getMonth(), now.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (getParsingFlags(config).bigHour === true &&
                config._a[HOUR] <= 12 &&
                config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = [i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond];

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else if (isDate(input)) {
            config._d = input;
        } else {
            configFromInput(config);
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function local__createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
         'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
         function () {
             var other = local__createLocal.apply(null, arguments);
             return other < this ? this : other;
         }
     );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
        function () {
            var other = local__createLocal.apply(null, arguments);
            return other > this ? this : other;
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchOffset);
    addRegexToken('ZZ', matchOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(string) {
        var matches = ((string || '').match(matchOffset) || []);
        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(input);
            }
            if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            this.utcOffset(offsetFromString(this._i));
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        input = input ? local__createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (typeof this._isDSTShifted !== 'undefined') {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return !this._isUTC;
    }

    function isUtcOffset () {
        return this._isUTC;
    }

    function isUtc () {
        return this._isUTC && this._offset === 0;
    }

    var aspNetRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    var create__isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;

    function create__createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])        * sign,
                h  : toInt(match[HOUR])        * sign,
                m  : toInt(match[MINUTE])      * sign,
                s  : toInt(match[SECOND])      * sign,
                ms : toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = create__isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                d : parseIso(match[4], sign),
                h : parseIso(match[5], sign),
                m : parseIso(match[6], sign),
                s : parseIso(match[7], sign),
                w : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add      = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function moment_calendar__calendar (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            diff = this.diff(sod, 'days', true),
            format = diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
        return this.format(formats && formats[format] || this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this > +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return inputMs < +this.clone().startOf(units);
        }
    }

    function isBefore (input, units) {
        var inputMs;
        units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this < +input;
        } else {
            inputMs = isMoment(input) ? +input : +local__createLocal(input);
            return +this.clone().endOf(units) < inputMs;
        }
    }

    function isBetween (from, to, units) {
        return this.isAfter(from, units) && this.isBefore(to, units);
    }

    function isSame (input, units) {
        var inputMs;
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            input = isMoment(input) ? input : local__createLocal(input);
            return +this === +input;
        } else {
            inputMs = +local__createLocal(input);
            return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
        }
    }

    function diff (input, units, asFloat) {
        var that = cloneWithOffset(input, this),
            zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4,
            delta, output;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString () {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if ('function' === typeof Date.prototype.toISOString) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format (inputString) {
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (!this.isValid()) {
            return this.localeData().invalidDate();
        }
        return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
    }

    function toNow (withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
        case 'year':
            this.month(0);
            /* falls through */
        case 'quarter':
        case 'month':
            this.date(1);
            /* falls through */
        case 'week':
        case 'isoWeek':
        case 'day':
            this.hours(0);
            /* falls through */
        case 'hour':
            this.minutes(0);
            /* falls through */
        case 'minute':
            this.seconds(0);
            /* falls through */
        case 'second':
            this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }
        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf () {
        return +this._d - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(+this / 1000);
    }

    function toDate () {
        return this._offset ? new Date(+this) : this._d;
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function moment_valid__isValid () {
        return valid__isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // HELPERS

    function weeksInYear(year, dow, doy) {
        return weekOfYear(local__createLocal([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    // MOMENTS

    function getSetWeekYear (input) {
        var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getSetISOWeekYear (input) {
        var year = weekOfYear(this, 1, 4).year;
        return input == null ? year : this.add((input - year), 'y');
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    addFormatToken('Q', 0, 0, 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   matchWord);
    addRegexToken('ddd',  matchWord);
    addRegexToken('dddd', matchWord);

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config) {
        var weekday = config._locale.weekdaysParse(input);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m) {
        return this._weekdays[m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return this._weekdaysShort[m.day()];
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return this._weekdaysMin[m.day()];
    }

    function localeWeekdaysParse (weekdayName) {
        var i, mom, regex;

        this._weekdaysParse = this._weekdaysParse || [];

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            if (!this._weekdaysParse[i]) {
                mom = local__createLocal([2000, 1]).day(i);
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, function () {
        return this.hours() % 12 || 12;
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add          = add_subtract__add;
    momentPrototype__proto.calendar     = moment_calendar__calendar;
    momentPrototype__proto.clone        = clone;
    momentPrototype__proto.diff         = diff;
    momentPrototype__proto.endOf        = endOf;
    momentPrototype__proto.format       = format;
    momentPrototype__proto.from         = from;
    momentPrototype__proto.fromNow      = fromNow;
    momentPrototype__proto.to           = to;
    momentPrototype__proto.toNow        = toNow;
    momentPrototype__proto.get          = getSet;
    momentPrototype__proto.invalidAt    = invalidAt;
    momentPrototype__proto.isAfter      = isAfter;
    momentPrototype__proto.isBefore     = isBefore;
    momentPrototype__proto.isBetween    = isBetween;
    momentPrototype__proto.isSame       = isSame;
    momentPrototype__proto.isValid      = moment_valid__isValid;
    momentPrototype__proto.lang         = lang;
    momentPrototype__proto.locale       = locale;
    momentPrototype__proto.localeData   = localeData;
    momentPrototype__proto.max          = prototypeMax;
    momentPrototype__proto.min          = prototypeMin;
    momentPrototype__proto.parsingFlags = parsingFlags;
    momentPrototype__proto.set          = getSet;
    momentPrototype__proto.startOf      = startOf;
    momentPrototype__proto.subtract     = add_subtract__subtract;
    momentPrototype__proto.toArray      = toArray;
    momentPrototype__proto.toObject     = toObject;
    momentPrototype__proto.toDate       = toDate;
    momentPrototype__proto.toISOString  = moment_format__toISOString;
    momentPrototype__proto.toJSON       = moment_format__toISOString;
    momentPrototype__proto.toString     = toString;
    momentPrototype__proto.unix         = unix;
    momentPrototype__proto.valueOf      = to_type__valueOf;

    // Year
    momentPrototype__proto.year       = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear    = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month       = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
    momentPrototype__proto.weeksInYear    = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date       = getSetDayOfMonth;
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset            = getSetOffset;
    momentPrototype__proto.utc                  = setOffsetToUTC;
    momentPrototype__proto.local                = setOffsetToLocal;
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST                = isDaylightSavingTime;
    momentPrototype__proto.isDSTShifted         = isDaylightSavingTimeShifted;
    momentPrototype__proto.isLocal              = isLocal;
    momentPrototype__proto.isUtcOffset          = isUtcOffset;
    momentPrototype__proto.isUtc                = isUtc;
    momentPrototype__proto.isUTC                = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix (input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone () {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function locale_calendar__calendar (key, mom, now) {
        var output = this._calendar[key];
        return typeof output === 'function' ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    function preParsePostFormat (string) {
        return string;
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (typeof output === 'function') ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
    }

    function locale_set__set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (typeof prop === 'function') {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    var prototype__proto = Locale.prototype;

    prototype__proto._calendar       = defaultCalendar;
    prototype__proto.calendar        = locale_calendar__calendar;
    prototype__proto._longDateFormat = defaultLongDateFormat;
    prototype__proto.longDateFormat  = longDateFormat;
    prototype__proto._invalidDate    = defaultInvalidDate;
    prototype__proto.invalidDate     = invalidDate;
    prototype__proto._ordinal        = defaultOrdinal;
    prototype__proto.ordinal         = ordinal;
    prototype__proto._ordinalParse   = defaultOrdinalParse;
    prototype__proto.preparse        = preParsePostFormat;
    prototype__proto.postformat      = preParsePostFormat;
    prototype__proto._relativeTime   = defaultRelativeTime;
    prototype__proto.relativeTime    = relative__relativeTime;
    prototype__proto.pastFuture      = pastFuture;
    prototype__proto.set             = locale_set__set;

    // Month
    prototype__proto.months       =        localeMonths;
    prototype__proto._months      = defaultLocaleMonths;
    prototype__proto.monthsShort  =        localeMonthsShort;
    prototype__proto._monthsShort = defaultLocaleMonthsShort;
    prototype__proto.monthsParse  =        localeMonthsParse;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto._week = defaultLocaleWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays       =        localeWeekdays;
    prototype__proto._weekdays      = defaultLocaleWeekdays;
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
    prototype__proto._weekdaysMin   = defaultLocaleWeekdaysMin;
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get (format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function list (format, index, field, count, setter) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, setter);
        }

        var i;
        var out = [];
        for (i = 0; i < count; i++) {
            out[i] = lists__get(format, i, field, setter);
        }
        return out;
    }

    function lists__listMonths (format, index) {
        return list(format, index, 'months', 12, 'month');
    }

    function lists__listMonthsShort (format, index) {
        return list(format, index, 'monthsShort', 12, 'month');
    }

    function lists__listWeekdays (format, index) {
        return list(format, index, 'weekdays', 7, 'day');
    }

    function lists__listWeekdaysShort (format, index) {
        return list(format, index, 'weekdaysShort', 7, 'day');
    }

    function lists__listWeekdaysMin (format, index) {
        return list(format, index, 'weekdaysMin', 7, 'day');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract (duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf () {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function duration_get__get (units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds]  ||
                minutes === 1          && ['m']           ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours   === 1          && ['h']           ||
                hours   < thresholds.h && ['hh', hours]   ||
                days    === 1          && ['d']           ||
                days    < thresholds.d && ['dd', days]    ||
                months  === 1          && ['M']           ||
                months  < thresholds.M && ['MM', months]  ||
                years   === 1          && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize (withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        var seconds = iso_string__abs(this._milliseconds) / 1000;
        var days         = iso_string__abs(this._days);
        var months       = iso_string__abs(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs            = duration_abs__abs;
    duration_prototype__proto.add            = duration_add_subtract__add;
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
    duration_prototype__proto.as             = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds      = asSeconds;
    duration_prototype__proto.asMinutes      = asMinutes;
    duration_prototype__proto.asHours        = asHours;
    duration_prototype__proto.asDays         = asDays;
    duration_prototype__proto.asWeeks        = asWeeks;
    duration_prototype__proto.asMonths       = asMonths;
    duration_prototype__proto.asYears        = asYears;
    duration_prototype__proto.valueOf        = duration_as__valueOf;
    duration_prototype__proto._bubble        = bubble;
    duration_prototype__proto.get            = duration_get__get;
    duration_prototype__proto.milliseconds   = milliseconds;
    duration_prototype__proto.seconds        = seconds;
    duration_prototype__proto.minutes        = minutes;
    duration_prototype__proto.hours          = hours;
    duration_prototype__proto.days           = days;
    duration_prototype__proto.weeks          = weeks;
    duration_prototype__proto.months         = months;
    duration_prototype__proto.years          = years;
    duration_prototype__proto.humanize       = humanize;
    duration_prototype__proto.toISOString    = iso_string__toISOString;
    duration_prototype__proto.toString       = iso_string__toISOString;
    duration_prototype__proto.toJSON         = iso_string__toISOString;
    duration_prototype__proto.locale         = locale;
    duration_prototype__proto.localeData     = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    utils_hooks__hooks.version = '2.10.6';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn                    = momentPrototype;
    utils_hooks__hooks.min                   = min;
    utils_hooks__hooks.max                   = max;
    utils_hooks__hooks.utc                   = create_utc__createUTC;
    utils_hooks__hooks.unix                  = moment__createUnix;
    utils_hooks__hooks.months                = lists__listMonths;
    utils_hooks__hooks.isDate                = isDate;
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid               = valid__createInvalid;
    utils_hooks__hooks.duration              = create__createDuration;
    utils_hooks__hooks.isMoment              = isMoment;
    utils_hooks__hooks.weekdays              = lists__listWeekdays;
    utils_hooks__hooks.parseZone             = moment__createInZone;
    utils_hooks__hooks.localeData            = locale_locales__getLocale;
    utils_hooks__hooks.isDuration            = isDuration;
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale          = defineLocale;
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;

    var _moment = utils_hooks__hooks;

    return _moment;

}));
},{}],82:[function(require,module,exports){
var _ = require("./lodash.custom.js");
var rewind = require("geojson-rewind");

// see https://wiki.openstreetmap.org/wiki/Overpass_turbo/Polygon_Features
var polygonFeatures = require("./polygon_features.json");

var osmtogeojson = {};

osmtogeojson = function( data, options ) {

  options = _.merge(
    {
      verbose: false,
      flatProperties: false,
      uninterestingTags: {
        "source": true,
        "source_ref": true,
        "source:ref": true,
        "history": true,
        "attribution": true,
        "created_by": true,
        "tiger:county": true,
        "tiger:tlid": true,
        "tiger:upload_uuid": true
      },
      polygonFeatures: polygonFeatures,
    },
    options
  );

  var result;
  if ( ((typeof XMLDocument !== "undefined") && data instanceof XMLDocument ||
        (typeof XMLDocument === "undefined") && data.childNodes) )
    result = _osmXML2geoJSON(data);
  else
    result = _overpassJSON2geoJSON(data);
  return result;

  function _overpassJSON2geoJSON(json) {
    // sort elements
    var nodes = new Array();
    var ways  = new Array();
    var rels  = new Array();
    // helper functions
    function centerGeometry(object) {
      var pseudoNode = _.clone(object);
      pseudoNode.lat = object.center.lat;
      pseudoNode.lon = object.center.lon;
      pseudoNode.__is_center_placeholder = true;
      nodes.push(pseudoNode);
    }
    function boundsGeometry(object) {
      var pseudoWay = _.clone(object);
      pseudoWay.nodes = [];
      function addPseudoNode(lat,lon,i) {
        var pseudoNode = {
          type:"node",
          id:  "_"+pseudoWay.type+"/"+pseudoWay.id+"bounds"+i,
          lat: lat,
          lon: lon
        }
        pseudoWay.nodes.push(pseudoNode.id);
        nodes.push(pseudoNode);
      }
      addPseudoNode(pseudoWay.bounds.minlat,pseudoWay.bounds.minlon,1);
      addPseudoNode(pseudoWay.bounds.maxlat,pseudoWay.bounds.minlon,2);
      addPseudoNode(pseudoWay.bounds.maxlat,pseudoWay.bounds.maxlon,3);
      addPseudoNode(pseudoWay.bounds.minlat,pseudoWay.bounds.maxlon,4);
      pseudoWay.nodes.push(pseudoWay.nodes[0]);
      pseudoWay.__is_bounds_placeholder = true;
      ways.push(pseudoWay);
    }
    function fullGeometryWay(way) {
      function addFullGeometryNode(lat,lon,id) {
        var geometryNode = {
          type:"node",
          id:  id,
          lat: lat,
          lon: lon,
          __is_uninteresting: true
        }
        nodes.push(geometryNode);
      }
      if (!_.isArray(way.nodes)) {
        way.nodes = way.geometry.map(function(nd) {
          if (nd !== null) // have to skip ref-less nodes
            return "_anonymous@"+nd.lat+"/"+nd.lon;
          else
            return "_anonymous@unknown_location";
        });
      }
      way.geometry.forEach(function(nd, i) {
        if (nd) {
          addFullGeometryNode(
            nd.lat,
            nd.lon,
            way.nodes[i]
          );
        }
      });
    }
    function fullGeometryRelation(rel) {
      function addFullGeometryNode(lat,lon,id) {
        var geometryNode = {
          type:"node",
          id:  id,
          lat: lat,
          lon: lon
        }
        nodes.push(geometryNode);
      }
      function addFullGeometryWay(geometry,id) {
        // shared multipolygon ways cannot be defined multiple times with the same id.
        if (ways.some(function (way) { // todo: this is slow :(
          return way.type == "way" && way.id == id;
        })) return;
        var geometryWay = {
          type: "way",
          id:   id,
          nodes:[]
        }
        function addFullGeometryWayPseudoNode(lat,lon) {
          // todo? do not save the same pseudo node multiple times
          var geometryPseudoNode = {
            type:"node",
            id:  "_anonymous@"+lat+"/"+lon,
            lat: lat,
            lon: lon,
            __is_uninteresting: true
          }
          geometryWay.nodes.push(geometryPseudoNode.id);
          nodes.push(geometryPseudoNode);
        }
        geometry.forEach(function(nd) {
          if (nd) {
            addFullGeometryWayPseudoNode(
              nd.lat,
              nd.lon
            );
          } else {
            geometryWay.nodes.push(undefined);
          }
        });
        ways.push(geometryWay);
      }
      rel.members.forEach(function(member, i) {
        if (member.type == "node") {
          if (member.lat) {
            addFullGeometryNode(
              member.lat,
              member.lon,
              member.ref
            );
          }
        } else if (member.type == "way") {
          if (member.geometry) {
            addFullGeometryWay(
              member.geometry,
              member.ref
            );
          }
        }
      });
    }
    // create copies of individual json objects to make sure the original data doesn't get altered
    // todo: cloning is slow: see if this can be done differently!
    for (var i=0;i<json.elements.length;i++) {
      switch (json.elements[i].type) {
      case "node":
        var node = json.elements[i];
        nodes.push(node);
      break;
      case "way":
        var way = _.clone(json.elements[i]);
        way.nodes = _.clone(way.nodes);
        ways.push(way);
        if (way.center)
          centerGeometry(way);
        if (way.geometry)
          fullGeometryWay(way);
        else if (way.bounds)
          boundsGeometry(way);
      break;
      case "relation":
        var rel = _.clone(json.elements[i]);
        rel.members = _.clone(rel.members);
        rels.push(rel);
        var has_full_geometry = rel.members && rel.members.some(function (member) {
          return member.type == "node" && member.lat ||
                 member.type == "way"  && member.geometry && member.geometry.length > 0
        });
        if (rel.center) 
          centerGeometry(rel);
        if (has_full_geometry)
          fullGeometryRelation(rel);
        else if (rel.bounds)
          boundsGeometry(rel);
      break;
      default:
      // type=area (from coord-query) is an example for this case.
      }
    }
    return _convert2geoJSON(nodes,ways,rels);
  }
  function _osmXML2geoJSON(xml) {
    // sort elements
    var nodes = new Array();
    var ways  = new Array();
    var rels  = new Array();
    // helper function
    function copy_attribute( x, o, attr ) {
      if (x.hasAttribute(attr))
        o[attr] = x.getAttribute(attr);
    }
    function centerGeometry(object, centroid) {
      var pseudoNode = _.clone(object);
      copy_attribute(centroid, pseudoNode, 'lat');
      copy_attribute(centroid, pseudoNode, 'lon');
      pseudoNode.__is_center_placeholder = true;
      nodes.push(pseudoNode);
    }
    function boundsGeometry(object, bounds) {
      var pseudoWay = _.clone(object);
      pseudoWay.nodes = [];
      function addPseudoNode(lat,lon,i) {
        var pseudoNode = {
          type:"node",
          id:  "_"+pseudoWay.type+"/"+pseudoWay.id+"bounds"+i,
          lat: lat,
          lon: lon
        }
        pseudoWay.nodes.push(pseudoNode.id);
        nodes.push(pseudoNode);
      }
      addPseudoNode(bounds.getAttribute('minlat'),bounds.getAttribute('minlon'),1);
      addPseudoNode(bounds.getAttribute('maxlat'),bounds.getAttribute('minlon'),2);
      addPseudoNode(bounds.getAttribute('maxlat'),bounds.getAttribute('maxlon'),3);
      addPseudoNode(bounds.getAttribute('minlat'),bounds.getAttribute('maxlon'),4);
      pseudoWay.nodes.push(pseudoWay.nodes[0]);
      pseudoWay.__is_bounds_placeholder = true;
      ways.push(pseudoWay);
    }
    function fullGeometryWay(way, nds) {
      function addFullGeometryNode(lat,lon,id) {
        var geometryNode = {
          type:"node",
          id:  id,
          lat: lat,
          lon: lon,
          __is_uninteresting: true
        }
        nodes.push(geometryNode);
        return geometryNode.id;
      }
      if (!_.isArray(way.nodes)) {
        way.nodes = [];
        _.each( nds, function( nd, i ) {
          way.nodes.push("_anonymous@"+nd.getAttribute('lat')+"/"+nd.getAttribute('lon'));
        });
      }
      _.each( nds, function( nd, i ) {
        if (nd.getAttribute('lat')) {
          addFullGeometryNode(
            nd.getAttribute('lat'),
            nd.getAttribute('lon'),
            way.nodes[i]
          );
        }
      });
    }
    function fullGeometryRelation(rel, members) {
      function addFullGeometryNode(lat,lon,id) {
        var geometryNode = {
          type:"node",
          id:  id,
          lat: lat,
          lon: lon
        }
        nodes.push(geometryNode);
      }
      function addFullGeometryWay(nds,id) {
        // shared multipolygon ways cannot be defined multiple times with the same id.
        if (ways.some(function (way) { // todo: this is slow :(
          return way.type == "way" && way.id == id;
        })) return;
        var geometryWay = {
          type: "way",
          id:   id,
          nodes:[]
        }
        function addFullGeometryWayPseudoNode(lat,lon) {
          // todo? do not save the same pseudo node multiple times
          var geometryPseudoNode = {
            type:"node",
            id:  "_anonymous@"+lat+"/"+lon,
            lat: lat,
            lon: lon,
            __is_uninteresting: true
          }
          geometryWay.nodes.push(geometryPseudoNode.id);
          nodes.push(geometryPseudoNode);
        }
        _.each(nds, function(nd) {
          if (nd.getAttribute('lat')) {
            addFullGeometryWayPseudoNode(
              nd.getAttribute('lat'),
              nd.getAttribute('lon')
            );
          } else {
            geometryWay.nodes.push(undefined);
          }
        });
        ways.push(geometryWay);
      }
      _.each( members, function( member, i ) {
        if (rel.members[i].type == "node") {
          if (member.getAttribute('lat')) {
            addFullGeometryNode(
              member.getAttribute('lat'),
              member.getAttribute('lon'),
              rel.members[i].ref
            );
          }
        } else if (rel.members[i].type == "way") {
          if (member.getElementsByTagName('nd').length > 0) {
            addFullGeometryWay(
              member.getElementsByTagName('nd'),
              rel.members[i].ref
            );
          }
        }
      });
    }
    // nodes
    _.each( xml.getElementsByTagName('node'), function( node, i ) {
      var tags = {};
      _.each( node.getElementsByTagName('tag'), function( tag ) {
        tags[tag.getAttribute('k')] = tag.getAttribute('v');
      });
      var nodeObject = {
        'type': 'node'
      };
      copy_attribute( node, nodeObject, 'id' );
      copy_attribute( node, nodeObject, 'lat' );
      copy_attribute( node, nodeObject, 'lon' );
      copy_attribute( node, nodeObject, 'version' );
      copy_attribute( node, nodeObject, 'timestamp' );
      copy_attribute( node, nodeObject, 'changeset' );
      copy_attribute( node, nodeObject, 'uid' );
      copy_attribute( node, nodeObject, 'user' );
      if (!_.isEmpty(tags))
        nodeObject.tags = tags;
      nodes.push(nodeObject);
    });
    // ways
    var centroid,bounds;
    _.each( xml.getElementsByTagName('way'), function( way, i ) {
      var tags = {};
      var wnodes = [];
      _.each( way.getElementsByTagName('tag'), function( tag ) {
        tags[tag.getAttribute('k')] = tag.getAttribute('v');
      });
      var has_full_geometry = false;
      _.each( way.getElementsByTagName('nd'), function( nd, i ) {
        var id;
        if (id = nd.getAttribute('ref'))
          wnodes[i] = id;
        if (!has_full_geometry && nd.getAttribute('lat'))
          has_full_geometry = true;
      });
      var wayObject = {
        "type": "way"
      };
      copy_attribute( way, wayObject, 'id' );
      copy_attribute( way, wayObject, 'version' );
      copy_attribute( way, wayObject, 'timestamp' );
      copy_attribute( way, wayObject, 'changeset' );
      copy_attribute( way, wayObject, 'uid' );
      copy_attribute( way, wayObject, 'user' );
      if (wnodes.length > 0)
        wayObject.nodes = wnodes;
      if (!_.isEmpty(tags))
        wayObject.tags = tags;
      if (centroid = way.getElementsByTagName('center')[0])
        centerGeometry(wayObject,centroid);
      if (has_full_geometry)
        fullGeometryWay(wayObject, way.getElementsByTagName('nd'));
      else if (bounds = way.getElementsByTagName('bounds')[0])
        boundsGeometry(wayObject,bounds);
      ways.push(wayObject);
    });
    // relations
    _.each( xml.getElementsByTagName('relation'), function( relation, i ) {
      var tags = {};
      var members = [];
      _.each( relation.getElementsByTagName('tag'), function( tag ) {
        tags[tag.getAttribute('k')] = tag.getAttribute('v');
      });
      var has_full_geometry = false;
      _.each( relation.getElementsByTagName('member'), function( member, i ) {
        members[i] = {};
        copy_attribute( member, members[i], 'ref' );
        copy_attribute( member, members[i], 'role' );
        copy_attribute( member, members[i], 'type' );
        if (!has_full_geometry && 
             (members[i].type == 'node' && member.getAttribute('lat')) ||
             (members[i].type == 'way'  && member.getElementsByTagName('nd').length>0) )
          has_full_geometry = true;
      });
      var relObject = {
        "type": "relation"
      }
      copy_attribute( relation, relObject, 'id' );
      copy_attribute( relation, relObject, 'version' );
      copy_attribute( relation, relObject, 'timestamp' );
      copy_attribute( relation, relObject, 'changeset' );
      copy_attribute( relation, relObject, 'uid' );
      copy_attribute( relation, relObject, 'user' );
      if (members.length > 0)
        relObject.members = members;
      if (!_.isEmpty(tags))
        relObject.tags = tags;
      if (centroid = relation.getElementsByTagName('center')[0])
        centerGeometry(relObject,centroid);
      if (has_full_geometry)
        fullGeometryRelation(relObject, relation.getElementsByTagName('member'));
      else if (bounds = relation.getElementsByTagName('bounds')[0])
        boundsGeometry(relObject,bounds);
      rels.push(relObject);
    });
    return _convert2geoJSON(nodes,ways,rels);
  }
  function _convert2geoJSON(nodes,ways,rels) {

    // helper function that checks if there are any tags other than "created_by", "source", etc. or any tag provided in ignore_tags
    function has_interesting_tags(t, ignore_tags) {
      if (typeof ignore_tags !== "object")
        ignore_tags={};
      if (typeof options.uninterestingTags === "function")
        return !options.uninterestingTags(t, ignore_tags);
      for (var k in t)
        if (!(options.uninterestingTags[k]===true) &&
            !(ignore_tags[k]===true || ignore_tags[k]===t[k]))
          return true;
      return false;
    };
    // helper function to extract meta information
    function build_meta_information(object) {
      var res = {
        "timestamp": object.timestamp,
        "version": object.version,
        "changeset": object.changeset,
        "user": object.user,
        "uid": object.uid
      };
      for (k in res)
        if (res[k] === undefined)
          delete res[k];
      return res;
    }

    // some data processing (e.g. filter nodes only used for ways)
    var nodeids = new Object();
    for (var i=0;i<nodes.length;i++) {
      if (nodes[i].lat === undefined) {
        if (options.verbose) console.warn('Node',nodes[i].type+'/'+nodes[i].id,'ignored because it has no coordinates');
        continue; // ignore nodes without coordinates (e.g. returned by an ids_only query)
      }
      nodeids[nodes[i].id] = nodes[i];
    }
    var poinids = new Object();
    for (var i=0;i<nodes.length;i++) {
      if (typeof nodes[i].tags != 'undefined' &&
          has_interesting_tags(nodes[i].tags)) // this checks if the node has any tags other than "created_by"
        poinids[nodes[i].id] = true;
    }
    for (var i=0;i<rels.length;i++) {
      if (!_.isArray(rels[i].members)) {
        if (options.verbose) console.warn('Relation',rels[i].type+'/'+rels[i].id,'ignored because it has no members');
        continue; // ignore relations without members (e.g. returned by an ids_only query)
      }
      for (var j=0;j<rels[i].members.length;j++) {
        if (rels[i].members[j].type == "node")
          poinids[rels[i].members[j].ref] = true;
      }
    }
    var wayids = new Object();
    var waynids = new Object();
    for (var i=0;i<ways.length;i++) {
      if (!_.isArray(ways[i].nodes)) {
        if (options.verbose) console.warn('Way',ways[i].type+'/'+ways[i].id,'ignored because it has no nodes');
        continue; // ignore ways without nodes (e.g. returned by an ids_only query)
      }
      wayids[ways[i].id] = ways[i];
      for (var j=0;j<ways[i].nodes.length;j++) {
        waynids[ways[i].nodes[j]] = true;
        ways[i].nodes[j] = nodeids[ways[i].nodes[j]];
      }
    }
    var pois = new Array();
    for (var i=0;i<nodes.length;i++) {
      if (((!waynids[nodes[i].id]) ||
          (poinids[nodes[i].id])) &&
          !nodes[i].__is_uninteresting)
        pois.push(nodes[i]);
    }
    var relids = new Array();
    for (var i=0;i<rels.length;i++) {
      if (!_.isArray(rels[i].members)) {
        if (options.verbose) console.warn('Relation',rels[i].type+'/'+rels[i].id,'ignored because it has no members');
        continue; // ignore relations without members (e.g. returned by an ids_only query)
      }
      relids[rels[i].id] = rels[i];
    }
    var relsmap = {node: {}, way: {}, relation: {}};
    for (var i=0;i<rels.length;i++) {
      if (!_.isArray(rels[i].members)) {
        if (options.verbose) console.warn('Relation',rels[i].type+'/'+rels[i].id,'ignored because it has no members');
        continue; // ignore relations without members (e.g. returned by an ids_only query)
      }
      for (var j=0;j<rels[i].members.length;j++) {
        var m;
        switch (rels[i].members[j].type) {
          case "node":
            m = nodeids[rels[i].members[j].ref];
          break;
          case "way":
            m = wayids[rels[i].members[j].ref];
          break;
          case "relation":
            m = relids[rels[i].members[j].ref];
          break;
        }
        if (!m) {
          if (options.verbose) console.warn('Relation',rels[i].type+'/'+rels[i].id,'member',rels[i].members[j].type+'/'+rels[i].members[j].id,'ignored because it has an invalid type');
          continue;
        }
        var m_type = rels[i].members[j].type;
        var m_ref = rels[i].members[j].ref;
        if (typeof relsmap[m_type][m_ref] === "undefined")
          relsmap[m_type][m_ref] = [];
        relsmap[m_type][m_ref].push({
          "role" : rels[i].members[j].role,
          "rel" : rels[i].id,
          "reltags" : rels[i].tags,
        });
      }
    }
    // construct geojson
    var geojson;
    var geojsonnodes = {
      "type"     : "FeatureCollection",
      "features" : new Array()};
    for (i=0;i<pois.length;i++) {
      if (typeof pois[i].lon == "undefined" || typeof pois[i].lat == "undefined") {
        if (options.verbose) console.warn('POI',pois[i].type+'/'+pois[i].id,'ignored because it lacks coordinates');
        continue; // lon and lat are required for showing a point
      }
      var feature = {
        "type"       : "Feature",
        "id"         : pois[i].type+"/"+pois[i].id,
        "properties" : {
          "type" : pois[i].type,
          "id"   : pois[i].id,
          "tags" : pois[i].tags || {},
          "relations" : relsmap["node"][pois[i].id] || [],
          "meta": build_meta_information(pois[i])
        },
        "geometry"   : {
          "type" : "Point",
          "coordinates" : [+pois[i].lon, +pois[i].lat],
        }
      };
      if (pois[i].__is_center_placeholder)
        feature.properties["geometry"] = "center";
      geojsonnodes.features.push(feature);
    }
    var geojsonlines = {
      "type"     : "FeatureCollection",
      "features" : new Array()};
    var geojsonpolygons = {
      "type"     : "FeatureCollection",
      "features" : new Array()};
    // process multipolygons
    for (var i=0;i<rels.length;i++) {
      if ((typeof rels[i].tags != "undefined") &&
          (rels[i].tags["type"] == "multipolygon" || rels[i].tags["type"] == "boundary")) {
        if (!_.isArray(rels[i].members)) {
          if (options.verbose) console.warn('Multipolygon',rels[i].type+'/'+rels[i].id,'ignored because it has no members');
          continue; // ignore relations without members (e.g. returned by an ids_only query)
        }
        var outer_count = 0;
        for (var j=0;j<rels[i].members.length;j++)
          if (rels[i].members[j].role == "outer")
            outer_count++;
          else if (options.verbose && rels[i].members[j].role != "inner")
            console.warn('Multipolygon',rels[i].type+'/'+rels[i].id,'member',rels[i].members[j].type+'/'+rels[i].members[j].ref,'ignored because it has an invalid role: "' + rels[i].members[j].role + '"');
        rels[i].members.forEach(function(m) {
          if (wayids[m.ref]) {
            // this even works in the following corner case:
            // a multipolygon amenity=xxx with outer line tagged amenity=yyy
            // see https://github.com/tyrasd/osmtogeojson/issues/7
            if (m.role==="outer" && !has_interesting_tags(wayids[m.ref].tags,rels[i].tags))
              wayids[m.ref].is_multipolygon_outline = true;
            if (m.role==="inner" && !has_interesting_tags(wayids[m.ref].tags))
              wayids[m.ref].is_multipolygon_outline = true;
          }
        });
        if (outer_count == 0) {
          if (options.verbose) console.warn('Multipolygon relation',rels[i].type+'/'+rels[i].id,'ignored because it has no outer ways');
          continue; // ignore multipolygons without outer ways
        }
        var simple_mp = false;
        var mp_geometry = '';
        if (outer_count == 1 && !has_interesting_tags(rels[i].tags, {"type":true}))
          simple_mp = true;
        var feature = null;
        if (!simple_mp) {
          feature = construct_multipolygon(rels[i], rels[i]);
        } else {
          // simple multipolygon
          var outer_way = rels[i].members.filter(function(m) {return m.role === "outer";})[0];
          outer_way = wayids[outer_way.ref];
          if (outer_way === undefined) {
            if (options.verbose) console.warn('Multipolygon relation',rels[i].type+'/'+rels[i].id,'ignored because outer way', outer_way.type+'/'+outer_way.ref,'is missing');
            continue; // abort if outer way object is not present
          }
          outer_way.is_multipolygon_outline = true;
          feature = construct_multipolygon(outer_way, rels[i]);
        }
        if (feature === false) {
          if (options.verbose) console.warn('Multipolygon relation',rels[i].type+'/'+rels[i].id,'ignored because it has invalid geometry');
          continue; // abort if feature could not be constructed
        }
        geojsonpolygons.features.push(feature);
        function construct_multipolygon(tag_object, rel) {
          var is_tainted = false;
          var mp_geometry = simple_mp ? 'way' : 'relation'
          // prepare mp members
          var members;
          members = rel.members.filter(function(m) {return m.type === "way";});
          members = members.map(function(m) {
            var way = wayids[m.ref];
            if (way === undefined) { // check for missing ways
              if (options.verbose) console.warn('Multipolygon', mp_geometry+'/'+tag_object.id, 'tainted by a missing way', m.type+'/'+m.ref);
              is_tainted = true;
              return;
            }
            return { // TODO: this is slow! :(
              id: m.ref,
              role: m.role || "outer",
              way: way,
              nodes: way.nodes.filter(function(n) {
                if (n !== undefined)
                  return true;
                is_tainted = true;
                if (options.verbose) console.warn('Multipolygon', mp_geometry+'/'+tag_object.id,  'tainted by a way', m.type+'/'+m.ref, 'with a missing node');
                return false;
              })
            };
          });
          members = _.compact(members);
          // construct outer and inner rings
          var outers, inners;
          function join(ways) {
            var _first = function(arr) {return arr[0]};
            var _last  = function(arr) {return arr[arr.length-1]};
            // stolen from iD/relation.js
            var joined = [], current, first, last, i, how, what;
            while (ways.length) {
              current = ways.pop().nodes.slice();
              joined.push(current);
              while (ways.length && _first(current) !== _last(current)) {
                first = _first(current);
                last  = _last(current);
                for (i = 0; i < ways.length; i++) {
                  what = ways[i].nodes;
                  if (last === _first(what)) {
                    how  = current.push;
                    what = what.slice(1);
                    break;
                  } else if (last === _last(what)) {
                    how  = current.push;
                    what = what.slice(0, -1).reverse();
                    break;
                  } else if (first == _last(what)) {
                    how  = current.unshift;
                    what = what.slice(0, -1);
                    break;
                  } else if (first == _first(what)) {
                    how  = current.unshift;
                    what = what.slice(1).reverse();
                    break;
                  } else {
                    what = how = null;
                  }
                }
                if (!what) {
                  if (options.verbose) console.warn('Multipolygon', mp_geometry+'/'+tag_object.id, 'contains unclosed ring geometry');
                  break; // Invalid geometry (dangling way, unclosed ring)
                }
                ways.splice(i, 1);
                how.apply(current, what);
              }
            }
            return joined;
          }
          outers = join(members.filter(function(m) {return m.role==="outer";}));
          inners = join(members.filter(function(m) {return m.role==="inner";}));
          // sort rings
          var mp;
          function findOuter(inner) {
            var polygonIntersectsPolygon = function(outer, inner) {
              for (var i=0; i<inner.length; i++)
                if (pointInPolygon(inner[i], outer))
                  return true;
              return false;
            }
            var mapCoordinates = function(from) {
              return from.map(function(n) {
                return [+n.lat,+n.lon];
              });
            }
            // stolen from iD/geo.js,
            // based on https://github.com/substack/point-in-polygon,
            // ray-casting algorithm based on http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
            var pointInPolygon = function(point, polygon) {
              var x = point[0], y = point[1], inside = false;
              for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                var xi = polygon[i][0], yi = polygon[i][1];
                var xj = polygon[j][0], yj = polygon[j][1];
                var intersect = ((yi > y) != (yj > y)) &&
                  (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
              }
              return inside;
            };
            // stolen from iD/relation.js
            var o, outer;
            // todo: all this coordinate mapping makes this unneccesarily slow.
            // see the "todo: this is slow! :(" above.
            inner = mapCoordinates(inner);
            /*for (o = 0; o < outers.length; o++) {
              outer = mapCoordinates(outers[o]);
              if (polygonContainsPolygon(outer, inner))
                return o;
            }*/
            for (o = 0; o < outers.length; o++) {
              outer = mapCoordinates(outers[o]);
              if (polygonIntersectsPolygon(outer, inner))
                return o;
            }
          }
          mp = outers.map(function(o) {return [o];});
          for (var j=0; j<inners.length; j++) {
            var o = findOuter(inners[j]);
            if (o !== undefined)
              mp[o].push(inners[j]);
            else
              if (options.verbose) console.warn('Multipolygon', mp_geometry+'/'+tag_object.id, 'contains an inner ring with no containing outer');
              // so, no outer ring for this inner ring is found.
              // We're going to ignore holes in empty space.
              ;
          }
          // sanitize mp-coordinates (remove empty clusters or rings, {lat,lon,...} to [lon,lat]
          var mp_coords = [];
          mp_coords = _.compact(mp.map(function(cluster) {
            var cl = _.compact(cluster.map(function(ring) {
              if (ring.length < 4) { // todo: is this correct: ring.length < 4 ?
                if (options.verbose) console.warn('Multipolygon', mp_geometry+'/'+tag_object.id, 'contains a ring with less than four nodes');
                return;
              }
              return _.compact(ring.map(function(node) {
                return [+node.lon,+node.lat];
              }));
            }));
            if (cl.length == 0) {
              if (options.verbose) console.warn('Multipolygon', mp_geometry+'/'+tag_object.id, 'contains an empty ring cluster');
              return;
            }
            return cl;
          }));

          if (mp_coords.length == 0) {
            if (options.verbose) console.warn('Multipolygon', mp_geometry+'/'+tag_object.id, 'contains no coordinates');
            return false; // ignore multipolygons without coordinates
          }
          var mp_type = "MultiPolygon";
          if (mp_coords.length === 1) {
            mp_type = "Polygon";
            mp_coords = mp_coords[0];
          }
          // mp parsed, now construct the geoJSON
          var feature = {
            "type"       : "Feature",
            "id"         : tag_object.type+"/"+tag_object.id,
            "properties" : {
              "type" : tag_object.type,
              "id"   : tag_object.id,
              "tags" : tag_object.tags || {},
              "relations" :  relsmap[tag_object.type][tag_object.id] || [],
              "meta": build_meta_information(tag_object)
            },
            "geometry"   : {
              "type" : mp_type,
              "coordinates" : mp_coords,
            }
          }
          if (is_tainted) {
            if (options.verbose) console.warn('Multipolygon', mp_geometry+'/'+tag_object.id, 'is tainted');
            feature.properties["tainted"] = true;
          }
          return feature;
        }
      }
    }
    // process lines and polygons
    for (var i=0;i<ways.length;i++) {
      if (!_.isArray(ways[i].nodes)) {
        if (options.verbose) console.warn('Way',ways[i].type+'/'+ways[i].id,'ignored because it has no nodes');
        continue; // ignore ways without nodes (e.g. returned by an ids_only query)
      }
      if (ways[i].is_multipolygon_outline)
        continue; // ignore ways which are already rendered as (part of) a multipolygon
      ways[i].tainted = false;
      ways[i].hidden = false;
      coords = new Array();
      for (j=0;j<ways[i].nodes.length;j++) {
        if (typeof ways[i].nodes[j] == "object")
          coords.push([+ways[i].nodes[j].lon, +ways[i].nodes[j].lat]);
        else {
          if (options.verbose) console.warn('Way',ways[i].type+'/'+ways[i].id,'is tainted by an invalid node');
          ways[i].tainted = true;
        }
      }
      if (coords.length <= 1) { // invalid way geometry
        if (options.verbose) console.warn('Way',ways[i].type+'/'+ways[i].id,'ignored because it contains too few nodes');
        continue;
      }
      var way_type = "LineString"; // default
      if (typeof ways[i].nodes[0] != "undefined" && // way has its nodes loaded
        ways[i].nodes[0] === ways[i].nodes[ways[i].nodes.length-1] && // ... and forms a closed ring
        (
          typeof ways[i].tags != "undefined" && // ... and has tags
          _isPolygonFeature(ways[i].tags) // ... and tags say it is a polygon
          || // or is a placeholder for a bounds geometry
          ways[i].__is_bounds_placeholder
        )
      ) {
        way_type = "Polygon";
        coords = [coords];
      }
      var feature = {
        "type"       : "Feature",
        "id"         : ways[i].type+"/"+ways[i].id,
        "properties" : {
          "type" : ways[i].type,
          "id"   : ways[i].id,
          "tags" : ways[i].tags || {},
          "relations" : relsmap["way"][ways[i].id] || [],
          "meta": build_meta_information(ways[i])
        },
        "geometry"   : {
          "type" : way_type,
          "coordinates" : coords,
        }
      }
      if (ways[i].tainted) {
        if (options.verbose) console.warn('Way',ways[i].type+'/'+ways[i].id,'is tainted');
        feature.properties["tainted"] = true;
      }
      if (ways[i].__is_bounds_placeholder)
        feature.properties["geometry"] = "bounds";
      if (way_type == "LineString")
        geojsonlines.features.push(feature);
      else
        geojsonpolygons.features.push(feature);
    }

    geojson = {
      "type": "FeatureCollection",
      "features": []
    };
    geojson.features = geojson.features.concat(geojsonpolygons.features);
    geojson.features = geojson.features.concat(geojsonlines.features);
    geojson.features = geojson.features.concat(geojsonnodes.features);
    // optionally, flatten properties
    if (options.flatProperties) {
      geojson.features.forEach(function(f) {
        f.properties = _.merge(
          f.properties.meta,
          f.properties.tags,
          {id: f.properties.type+"/"+f.properties.id}
        );
      });
    }
    // fix polygon winding
    geojson = rewind(geojson, true /*remove for geojson-rewind >0.1.0*/);
    return geojson;
  }
  function _isPolygonFeature( tags ) {
    var polygonFeatures = options.polygonFeatures;
    if (typeof polygonFeatures === "function")
      return polygonFeatures(tags);
    // explicitely tagged non-areas
    if ( tags['area'] === 'no' )
      return false;
    // assuming that a typical OSM way has in average less tags than
    // the polygonFeatures list, this way around should be faster
    for ( var key in tags ) {
      var val = tags[key];
      var pfk = polygonFeatures[key];
      // continue with next if tag is unknown or not "categorizing"
      if ( typeof pfk === 'undefined' )
        continue;
      // continue with next if tag is explicitely un-set ("building=no")
      if ( val === 'no' )
        continue;
      // check polygon features for: general acceptance, included or excluded values
      if ( pfk === true )
        return true;
      if ( pfk.included_values && pfk.included_values[val] === true )
        return true;
      if ( pfk.excluded_values && pfk.excluded_values[val] !== true )
        return true;
    }
    // if no tags matched, this ain't no area.
    return false;
  }
};

// for backwards compatibility
osmtogeojson.toGeojson = osmtogeojson;

module.exports = osmtogeojson;

},{"./lodash.custom.js":83,"./polygon_features.json":87,"geojson-rewind":84}],83:[function(require,module,exports){
(function (global){
/**
 * @license
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash exports="node" include="clone,merge,isEmpty,isArray,compact,each" -d`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
;(function() {

  /** Used to pool arrays and objects used internally */
  var arrayPool = [];

  /** Used internally to indicate various things */
  var indicatorObject = {};

  /** Used as the max size of the `arrayPool` and `objectPool` */
  var maxPoolSize = 40;

  /** Used to match regexp flags from their coerced string values */
  var reFlags = /\w*$/;

  /** Used to detected named functions */
  var reFuncName = /^\s*function[ \n\r\t]+\w/;

  /** Used to detect functions containing a `this` reference */
  var reThis = /\bthis\b/;

  /** Used to fix the JScript [[DontEnum]] bug */
  var shadowedProps = [
    'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
    'toLocaleString', 'toString', 'valueOf'
  ];

  /** `Object#toString` result shortcuts */
  var argsClass = '[object Arguments]',
      arrayClass = '[object Array]',
      boolClass = '[object Boolean]',
      dateClass = '[object Date]',
      errorClass = '[object Error]',
      funcClass = '[object Function]',
      numberClass = '[object Number]',
      objectClass = '[object Object]',
      regexpClass = '[object RegExp]',
      stringClass = '[object String]';

  /** Used to identify object classifications that `_.clone` supports */
  var cloneableClasses = {};
  cloneableClasses[funcClass] = false;
  cloneableClasses[argsClass] = cloneableClasses[arrayClass] =
  cloneableClasses[boolClass] = cloneableClasses[dateClass] =
  cloneableClasses[numberClass] = cloneableClasses[objectClass] =
  cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;

  /** Used as the property descriptor for `__bindData__` */
  var descriptor = {
    'configurable': false,
    'enumerable': false,
    'value': null,
    'writable': false
  };

  /** Used as the data object for `iteratorTemplate` */
  var iteratorData = {
    'args': '',
    'array': null,
    'bottom': '',
    'firstArg': '',
    'init': '',
    'keys': null,
    'loop': '',
    'shadowedProps': null,
    'support': null,
    'top': '',
    'useHas': false
  };

  /** Used to determine if values are of the language type Object */
  var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
  };

  /** Used as a reference to the global object */
  var root = (objectTypes[typeof window] && window) || this;

  /** Detect free variable `exports` */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module` */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports` */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /** Detect free variable `global` from Node.js or Browserified code and use it as `root` */
  var freeGlobal = objectTypes[typeof global] && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    root = freeGlobal;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Gets an array from the array pool or creates a new one if the pool is empty.
   *
   * @private
   * @returns {Array} The array from the pool.
   */
  function getArray() {
    return arrayPool.pop() || [];
  }

  /**
   * Checks if `value` is a DOM node in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is a DOM node, else `false`.
   */
  function isNode(value) {
    // IE < 9 presents DOM nodes as `Object` objects except they have `toString`
    // methods that are `typeof` "string" and still can coerce nodes to strings
    return typeof value.toString != 'function' && typeof (value + '') == 'string';
  }

  /**
   * Releases the given array back to the array pool.
   *
   * @private
   * @param {Array} [array] The array to release.
   */
  function releaseArray(array) {
    array.length = 0;
    if (arrayPool.length < maxPoolSize) {
      arrayPool.push(array);
    }
  }

  /**
   * Slices the `collection` from the `start` index up to, but not including,
   * the `end` index.
   *
   * Note: This function is used instead of `Array#slice` to support node lists
   * in IE < 9 and to ensure dense arrays are returned.
   *
   * @private
   * @param {Array|Object|string} collection The collection to slice.
   * @param {number} start The start index.
   * @param {number} end The end index.
   * @returns {Array} Returns the new array.
   */
  function slice(array, start, end) {
    start || (start = 0);
    if (typeof end == 'undefined') {
      end = array ? array.length : 0;
    }
    var index = -1,
        length = end - start || 0,
        result = Array(length < 0 ? 0 : length);

    while (++index < length) {
      result[index] = array[start + index];
    }
    return result;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Used for `Array` method references.
   *
   * Normally `Array.prototype` would suffice, however, using an array literal
   * avoids issues in Narwhal.
   */
  var arrayRef = [];

  /** Used for native method references */
  var errorProto = Error.prototype,
      objectProto = Object.prototype,
      stringProto = String.prototype;

  /** Used to resolve the internal [[Class]] of values */
  var toString = objectProto.toString;

  /** Used to detect if a method is native */
  var reNative = RegExp('^' +
    String(toString)
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/toString| for [^\]]+/g, '.*?') + '$'
  );

  /** Native method shortcuts */
  var fnToString = Function.prototype.toString,
      getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
      hasOwnProperty = objectProto.hasOwnProperty,
      push = arrayRef.push,
      propertyIsEnumerable = objectProto.propertyIsEnumerable,
      unshift = arrayRef.unshift;

  /** Used to set meta data on functions */
  var defineProperty = (function() {
    // IE 8 only accepts DOM elements
    try {
      var o = {},
          func = isNative(func = Object.defineProperty) && func,
          result = func(o, o, o) && func;
    } catch(e) { }
    return result;
  }());

  /* Native method shortcuts for methods with the same name as other `lodash` methods */
  var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate,
      nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
      nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;

  /** Used to lookup a built-in constructor by [[Class]] */
  var ctorByClass = {};
  ctorByClass[arrayClass] = Array;
  ctorByClass[boolClass] = Boolean;
  ctorByClass[dateClass] = Date;
  ctorByClass[funcClass] = Function;
  ctorByClass[objectClass] = Object;
  ctorByClass[numberClass] = Number;
  ctorByClass[regexpClass] = RegExp;
  ctorByClass[stringClass] = String;

  /** Used to avoid iterating non-enumerable properties in IE < 9 */
  var nonEnumProps = {};
  nonEnumProps[arrayClass] = nonEnumProps[dateClass] = nonEnumProps[numberClass] = { 'constructor': true, 'toLocaleString': true, 'toString': true, 'valueOf': true };
  nonEnumProps[boolClass] = nonEnumProps[stringClass] = { 'constructor': true, 'toString': true, 'valueOf': true };
  nonEnumProps[errorClass] = nonEnumProps[funcClass] = nonEnumProps[regexpClass] = { 'constructor': true, 'toString': true };
  nonEnumProps[objectClass] = { 'constructor': true };

  (function() {
    var length = shadowedProps.length;
    while (length--) {
      var key = shadowedProps[length];
      for (var className in nonEnumProps) {
        if (hasOwnProperty.call(nonEnumProps, className) && !hasOwnProperty.call(nonEnumProps[className], key)) {
          nonEnumProps[className][key] = false;
        }
      }
    }
  }());

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a `lodash` object which wraps the given value to enable intuitive
   * method chaining.
   *
   * In addition to Lo-Dash methods, wrappers also have the following `Array` methods:
   * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
   * and `unshift`
   *
   * Chaining is supported in custom builds as long as the `value` method is
   * implicitly or explicitly included in the build.
   *
   * The chainable wrapper functions are:
   * `after`, `assign`, `bind`, `bindAll`, `bindKey`, `chain`, `compact`,
   * `compose`, `concat`, `countBy`, `create`, `createCallback`, `curry`,
   * `debounce`, `defaults`, `defer`, `delay`, `difference`, `filter`, `flatten`,
   * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
   * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
   * `invoke`, `keys`, `map`, `max`, `memoize`, `merge`, `min`, `object`, `omit`,
   * `once`, `pairs`, `partial`, `partialRight`, `pick`, `pluck`, `pull`, `push`,
   * `range`, `reject`, `remove`, `rest`, `reverse`, `shuffle`, `slice`, `sort`,
   * `sortBy`, `splice`, `tap`, `throttle`, `times`, `toArray`, `transform`,
   * `union`, `uniq`, `unshift`, `unzip`, `values`, `where`, `without`, `wrap`,
   * and `zip`
   *
   * The non-chainable wrapper functions are:
   * `clone`, `cloneDeep`, `contains`, `escape`, `every`, `find`, `findIndex`,
   * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `has`, `identity`,
   * `indexOf`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
   * `isEmpty`, `isEqual`, `isFinite`, `isFunction`, `isNaN`, `isNull`, `isNumber`,
   * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`, `join`,
   * `lastIndexOf`, `mixin`, `noConflict`, `parseInt`, `pop`, `random`, `reduce`,
   * `reduceRight`, `result`, `shift`, `size`, `some`, `sortedIndex`, `runInContext`,
   * `template`, `unescape`, `uniqueId`, and `value`
   *
   * The wrapper functions `first` and `last` return wrapped values when `n` is
   * provided, otherwise they return unwrapped values.
   *
   * Explicit chaining can be enabled by using the `_.chain` method.
   *
   * @name _
   * @constructor
   * @category Chaining
   * @param {*} value The value to wrap in a `lodash` instance.
   * @returns {Object} Returns a `lodash` instance.
   * @example
   *
   * var wrapped = _([1, 2, 3]);
   *
   * // returns an unwrapped value
   * wrapped.reduce(function(sum, num) {
   *   return sum + num;
   * });
   * // => 6
   *
   * // returns a wrapped value
   * var squares = wrapped.map(function(num) {
   *   return num * num;
   * });
   *
   * _.isArray(squares);
   * // => false
   *
   * _.isArray(squares.value());
   * // => true
   */
  function lodash() {
    // no operation performed
  }

  /**
   * An object used to flag environments features.
   *
   * @static
   * @memberOf _
   * @type Object
   */
  var support = lodash.support = {};

  (function() {
    var ctor = function() { this.x = 1; },
        object = { '0': 1, 'length': 1 },
        props = [];

    ctor.prototype = { 'valueOf': 1, 'y': 1 };
    for (var key in new ctor) { props.push(key); }
    for (key in arguments) { }

    /**
     * Detect if an `arguments` object's [[Class]] is resolvable (all but Firefox < 4, IE < 9).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.argsClass = toString.call(arguments) == argsClass;

    /**
     * Detect if `arguments` objects are `Object` objects (all but Narwhal and Opera < 10.5).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.argsObject = arguments.constructor == Object && !(arguments instanceof Array);

    /**
     * Detect if `name` or `message` properties of `Error.prototype` are
     * enumerable by default. (IE < 9, Safari < 5.1)
     *
     * @memberOf _.support
     * @type boolean
     */
    support.enumErrorProps = propertyIsEnumerable.call(errorProto, 'message') || propertyIsEnumerable.call(errorProto, 'name');

    /**
     * Detect if `prototype` properties are enumerable by default.
     *
     * Firefox < 3.6, Opera > 9.50 - Opera < 11.60, and Safari < 5.1
     * (if the prototype or a property on the prototype has been set)
     * incorrectly sets a function's `prototype` property [[Enumerable]]
     * value to `true`.
     *
     * @memberOf _.support
     * @type boolean
     */
    support.enumPrototypes = propertyIsEnumerable.call(ctor, 'prototype');

    /**
     * Detect if functions can be decompiled by `Function#toString`
     * (all but PS3 and older Opera mobile browsers & avoided in Windows 8 apps).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcDecomp = !isNative(root.WinRTError) && reThis.test(function() { return this; });

    /**
     * Detect if `Function#name` is supported (all but IE).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcNames = typeof Function.name == 'string';

    /**
     * Detect if `arguments` object indexes are non-enumerable
     * (Firefox < 4, IE < 9, PhantomJS, Safari < 5.1).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.nonEnumArgs = key != 0;

    /**
     * Detect if properties shadowing those on `Object.prototype` are non-enumerable.
     *
     * In IE < 9 an objects own properties, shadowing non-enumerable ones, are
     * made non-enumerable as well (a.k.a the JScript [[DontEnum]] bug).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.nonEnumShadows = !/valueOf/.test(props);

    /**
     * Detect if own properties are iterated after inherited properties (all but IE < 9).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.ownLast = props[0] != 'x';

    /**
     * Detect if `Array#shift` and `Array#splice` augment array-like objects correctly.
     *
     * Firefox < 10, IE compatibility mode, and IE < 9 have buggy Array `shift()`
     * and `splice()` functions that fail to remove the last element, `value[0]`,
     * of array-like objects even though the `length` property is set to `0`.
     * The `shift()` method is buggy in IE 8 compatibility mode, while `splice()`
     * is buggy regardless of mode in IE < 9 and buggy in compatibility mode in IE 9.
     *
     * @memberOf _.support
     * @type boolean
     */
    support.spliceObjects = (arrayRef.splice.call(object, 0, 1), !object[0]);

    /**
     * Detect lack of support for accessing string characters by index.
     *
     * IE < 8 can't access characters by index and IE 8 can only access
     * characters by index on string literals.
     *
     * @memberOf _.support
     * @type boolean
     */
    support.unindexedChars = ('x'[0] + Object('x')[0]) != 'xx';

    /**
     * Detect if a DOM node's [[Class]] is resolvable (all but IE < 9)
     * and that the JS engine errors when attempting to coerce an object to
     * a string without a `toString` function.
     *
     * @memberOf _.support
     * @type boolean
     */
    try {
      support.nodeClass = !(toString.call(document) == objectClass && !({ 'toString': 0 } + ''));
    } catch(e) {
      support.nodeClass = true;
    }
  }(1));

  /*--------------------------------------------------------------------------*/

  /**
   * The template used to create iterator functions.
   *
   * @private
   * @param {Object} data The data object used to populate the text.
   * @returns {string} Returns the interpolated text.
   */
  var iteratorTemplate = function(obj) {

    var __p = 'var index, iterable = ' +
    (obj.firstArg) +
    ', result = ' +
    (obj.init) +
    ';\nif (!iterable) return result;\n' +
    (obj.top) +
    ';';
     if (obj.array) {
    __p += '\nvar length = iterable.length; index = -1;\nif (' +
    (obj.array) +
    ') {  ';
     if (support.unindexedChars) {
    __p += '\n  if (isString(iterable)) {\n    iterable = iterable.split(\'\')\n  }  ';
     }
    __p += '\n  while (++index < length) {\n    ' +
    (obj.loop) +
    ';\n  }\n}\nelse {  ';
     } else if (support.nonEnumArgs) {
    __p += '\n  var length = iterable.length; index = -1;\n  if (length && isArguments(iterable)) {\n    while (++index < length) {\n      index += \'\';\n      ' +
    (obj.loop) +
    ';\n    }\n  } else {  ';
     }

     if (support.enumPrototypes) {
    __p += '\n  var skipProto = typeof iterable == \'function\';\n  ';
     }

     if (support.enumErrorProps) {
    __p += '\n  var skipErrorProps = iterable === errorProto || iterable instanceof Error;\n  ';
     }

        var conditions = [];    if (support.enumPrototypes) { conditions.push('!(skipProto && index == "prototype")'); }    if (support.enumErrorProps)  { conditions.push('!(skipErrorProps && (index == "message" || index == "name"))'); }

     if (obj.useHas && obj.keys) {
    __p += '\n  var ownIndex = -1,\n      ownProps = objectTypes[typeof iterable] && keys(iterable),\n      length = ownProps ? ownProps.length : 0;\n\n  while (++ownIndex < length) {\n    index = ownProps[ownIndex];\n';
        if (conditions.length) {
    __p += '    if (' +
    (conditions.join(' && ')) +
    ') {\n  ';
     }
    __p +=
    (obj.loop) +
    ';    ';
     if (conditions.length) {
    __p += '\n    }';
     }
    __p += '\n  }  ';
     } else {
    __p += '\n  for (index in iterable) {\n';
        if (obj.useHas) { conditions.push("hasOwnProperty.call(iterable, index)"); }    if (conditions.length) {
    __p += '    if (' +
    (conditions.join(' && ')) +
    ') {\n  ';
     }
    __p +=
    (obj.loop) +
    ';    ';
     if (conditions.length) {
    __p += '\n    }';
     }
    __p += '\n  }    ';
     if (support.nonEnumShadows) {
    __p += '\n\n  if (iterable !== objectProto) {\n    var ctor = iterable.constructor,\n        isProto = iterable === (ctor && ctor.prototype),\n        className = iterable === stringProto ? stringClass : iterable === errorProto ? errorClass : toString.call(iterable),\n        nonEnum = nonEnumProps[className];\n      ';
     for (k = 0; k < 7; k++) {
    __p += '\n    index = \'' +
    (obj.shadowedProps[k]) +
    '\';\n    if ((!(isProto && nonEnum[index]) && hasOwnProperty.call(iterable, index))';
            if (!obj.useHas) {
    __p += ' || (!nonEnum[index] && iterable[index] !== objectProto[index])';
     }
    __p += ') {\n      ' +
    (obj.loop) +
    ';\n    }      ';
     }
    __p += '\n  }    ';
     }

     }

     if (obj.array || support.nonEnumArgs) {
    __p += '\n}';
     }
    __p +=
    (obj.bottom) +
    ';\nreturn result';

    return __p
  };

  /*--------------------------------------------------------------------------*/

  /**
   * The base implementation of `_.bind` that creates the bound function and
   * sets its meta data.
   *
   * @private
   * @param {Array} bindData The bind data array.
   * @returns {Function} Returns the new bound function.
   */
  function baseBind(bindData) {
    var func = bindData[0],
        partialArgs = bindData[2],
        thisArg = bindData[4];

    function bound() {
      // `Function#bind` spec
      // http://es5.github.io/#x15.3.4.5
      if (partialArgs) {
        // avoid `arguments` object deoptimizations by using `slice` instead
        // of `Array.prototype.slice.call` and not assigning `arguments` to a
        // variable as a ternary expression
        var args = slice(partialArgs);
        push.apply(args, arguments);
      }
      // mimic the constructor's `return` behavior
      // http://es5.github.io/#x13.2.2
      if (this instanceof bound) {
        // ensure `new bound` is an instance of `func`
        var thisBinding = baseCreate(func.prototype),
            result = func.apply(thisBinding, args || arguments);
        return isObject(result) ? result : thisBinding;
      }
      return func.apply(thisArg, args || arguments);
    }
    setBindData(bound, bindData);
    return bound;
  }

  /**
   * The base implementation of `_.clone` without argument juggling or support
   * for `thisArg` binding.
   *
   * @private
   * @param {*} value The value to clone.
   * @param {boolean} [isDeep=false] Specify a deep clone.
   * @param {Function} [callback] The function to customize cloning values.
   * @param {Array} [stackA=[]] Tracks traversed source objects.
   * @param {Array} [stackB=[]] Associates clones with source counterparts.
   * @returns {*} Returns the cloned value.
   */
  function baseClone(value, isDeep, callback, stackA, stackB) {
    if (callback) {
      var result = callback(value);
      if (typeof result != 'undefined') {
        return result;
      }
    }
    // inspect [[Class]]
    var isObj = isObject(value);
    if (isObj) {
      var className = toString.call(value);
      if (!cloneableClasses[className] || (!support.nodeClass && isNode(value))) {
        return value;
      }
      var ctor = ctorByClass[className];
      switch (className) {
        case boolClass:
        case dateClass:
          return new ctor(+value);

        case numberClass:
        case stringClass:
          return new ctor(value);

        case regexpClass:
          result = ctor(value.source, reFlags.exec(value));
          result.lastIndex = value.lastIndex;
          return result;
      }
    } else {
      return value;
    }
    var isArr = isArray(value);
    if (isDeep) {
      // check for circular references and return corresponding clone
      var initedStack = !stackA;
      stackA || (stackA = getArray());
      stackB || (stackB = getArray());

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == value) {
          return stackB[length];
        }
      }
      result = isArr ? ctor(value.length) : {};
    }
    else {
      result = isArr ? slice(value) : assign({}, value);
    }
    // add array properties assigned by `RegExp#exec`
    if (isArr) {
      if (hasOwnProperty.call(value, 'index')) {
        result.index = value.index;
      }
      if (hasOwnProperty.call(value, 'input')) {
        result.input = value.input;
      }
    }
    // exit for shallow clone
    if (!isDeep) {
      return result;
    }
    // add the source value to the stack of traversed objects
    // and associate it with its clone
    stackA.push(value);
    stackB.push(result);

    // recursively populate clone (susceptible to call stack limits)
    (isArr ? baseEach : forOwn)(value, function(objValue, key) {
      result[key] = baseClone(objValue, isDeep, callback, stackA, stackB);
    });

    if (initedStack) {
      releaseArray(stackA);
      releaseArray(stackB);
    }
    return result;
  }

  /**
   * The base implementation of `_.create` without support for assigning
   * properties to the created object.
   *
   * @private
   * @param {Object} prototype The object to inherit from.
   * @returns {Object} Returns the new object.
   */
  function baseCreate(prototype, properties) {
    return isObject(prototype) ? nativeCreate(prototype) : {};
  }
  // fallback for browsers without `Object.create`
  if (!nativeCreate) {
    baseCreate = (function() {
      function Object() {}
      return function(prototype) {
        if (isObject(prototype)) {
          Object.prototype = prototype;
          var result = new Object;
          Object.prototype = null;
        }
        return result || root.Object();
      };
    }());
  }

  /**
   * The base implementation of `_.createCallback` without support for creating
   * "_.pluck" or "_.where" style callbacks.
   *
   * @private
   * @param {*} [func=identity] The value to convert to a callback.
   * @param {*} [thisArg] The `this` binding of the created callback.
   * @param {number} [argCount] The number of arguments the callback accepts.
   * @returns {Function} Returns a callback function.
   */
  function baseCreateCallback(func, thisArg, argCount) {
    if (typeof func != 'function') {
      return identity;
    }
    // exit early for no `thisArg` or already bound by `Function#bind`
    if (typeof thisArg == 'undefined' || !('prototype' in func)) {
      return func;
    }
    var bindData = func.__bindData__;
    if (typeof bindData == 'undefined') {
      if (support.funcNames) {
        bindData = !func.name;
      }
      bindData = bindData || !support.funcDecomp;
      if (!bindData) {
        var source = fnToString.call(func);
        if (!support.funcNames) {
          bindData = !reFuncName.test(source);
        }
        if (!bindData) {
          // checks if `func` references the `this` keyword and stores the result
          bindData = reThis.test(source);
          setBindData(func, bindData);
        }
      }
    }
    // exit early if there are no `this` references or `func` is bound
    if (bindData === false || (bindData !== true && bindData[1] & 1)) {
      return func;
    }
    switch (argCount) {
      case 1: return function(value) {
        return func.call(thisArg, value);
      };
      case 2: return function(a, b) {
        return func.call(thisArg, a, b);
      };
      case 3: return function(value, index, collection) {
        return func.call(thisArg, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(thisArg, accumulator, value, index, collection);
      };
    }
    return bind(func, thisArg);
  }

  /**
   * The base implementation of `createWrapper` that creates the wrapper and
   * sets its meta data.
   *
   * @private
   * @param {Array} bindData The bind data array.
   * @returns {Function} Returns the new function.
   */
  function baseCreateWrapper(bindData) {
    var func = bindData[0],
        bitmask = bindData[1],
        partialArgs = bindData[2],
        partialRightArgs = bindData[3],
        thisArg = bindData[4],
        arity = bindData[5];

    var isBind = bitmask & 1,
        isBindKey = bitmask & 2,
        isCurry = bitmask & 4,
        isCurryBound = bitmask & 8,
        key = func;

    function bound() {
      var thisBinding = isBind ? thisArg : this;
      if (partialArgs) {
        var args = slice(partialArgs);
        push.apply(args, arguments);
      }
      if (partialRightArgs || isCurry) {
        args || (args = slice(arguments));
        if (partialRightArgs) {
          push.apply(args, partialRightArgs);
        }
        if (isCurry && args.length < arity) {
          bitmask |= 16 & ~32;
          return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
        }
      }
      args || (args = arguments);
      if (isBindKey) {
        func = thisBinding[key];
      }
      if (this instanceof bound) {
        thisBinding = baseCreate(func.prototype);
        var result = func.apply(thisBinding, args);
        return isObject(result) ? result : thisBinding;
      }
      return func.apply(thisBinding, args);
    }
    setBindData(bound, bindData);
    return bound;
  }

  /**
   * The base implementation of `_.merge` without argument juggling or support
   * for `thisArg` binding.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @param {Function} [callback] The function to customize merging properties.
   * @param {Array} [stackA=[]] Tracks traversed source objects.
   * @param {Array} [stackB=[]] Associates values with source counterparts.
   */
  function baseMerge(object, source, callback, stackA, stackB) {
    (isArray(source) ? forEach : forOwn)(source, function(source, key) {
      var found,
          isArr,
          result = source,
          value = object[key];

      if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
        // avoid merging previously merged cyclic sources
        var stackLength = stackA.length;
        while (stackLength--) {
          if ((found = stackA[stackLength] == source)) {
            value = stackB[stackLength];
            break;
          }
        }
        if (!found) {
          var isShallow;
          if (callback) {
            result = callback(value, source);
            if ((isShallow = typeof result != 'undefined')) {
              value = result;
            }
          }
          if (!isShallow) {
            value = isArr
              ? (isArray(value) ? value : [])
              : (isPlainObject(value) ? value : {});
          }
          // add `source` and associated `value` to the stack of traversed objects
          stackA.push(source);
          stackB.push(value);

          // recursively merge objects and arrays (susceptible to call stack limits)
          if (!isShallow) {
            baseMerge(value, source, callback, stackA, stackB);
          }
        }
      }
      else {
        if (callback) {
          result = callback(value, source);
          if (typeof result == 'undefined') {
            result = source;
          }
        }
        if (typeof result != 'undefined') {
          value = result;
        }
      }
      object[key] = value;
    });
  }

  /**
   * Creates a function that, when called, either curries or invokes `func`
   * with an optional `this` binding and partially applied arguments.
   *
   * @private
   * @param {Function|string} func The function or method name to reference.
   * @param {number} bitmask The bitmask of method flags to compose.
   *  The bitmask may be composed of the following flags:
   *  1 - `_.bind`
   *  2 - `_.bindKey`
   *  4 - `_.curry`
   *  8 - `_.curry` (bound)
   *  16 - `_.partial`
   *  32 - `_.partialRight`
   * @param {Array} [partialArgs] An array of arguments to prepend to those
   *  provided to the new function.
   * @param {Array} [partialRightArgs] An array of arguments to append to those
   *  provided to the new function.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {number} [arity] The arity of `func`.
   * @returns {Function} Returns the new function.
   */
  function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
    var isBind = bitmask & 1,
        isBindKey = bitmask & 2,
        isCurry = bitmask & 4,
        isCurryBound = bitmask & 8,
        isPartial = bitmask & 16,
        isPartialRight = bitmask & 32;

    if (!isBindKey && !isFunction(func)) {
      throw new TypeError;
    }
    if (isPartial && !partialArgs.length) {
      bitmask &= ~16;
      isPartial = partialArgs = false;
    }
    if (isPartialRight && !partialRightArgs.length) {
      bitmask &= ~32;
      isPartialRight = partialRightArgs = false;
    }
    var bindData = func && func.__bindData__;
    if (bindData && bindData !== true) {
      // clone `bindData`
      bindData = slice(bindData);
      if (bindData[2]) {
        bindData[2] = slice(bindData[2]);
      }
      if (bindData[3]) {
        bindData[3] = slice(bindData[3]);
      }
      // set `thisBinding` is not previously bound
      if (isBind && !(bindData[1] & 1)) {
        bindData[4] = thisArg;
      }
      // set if previously bound but not currently (subsequent curried functions)
      if (!isBind && bindData[1] & 1) {
        bitmask |= 8;
      }
      // set curried arity if not yet set
      if (isCurry && !(bindData[1] & 4)) {
        bindData[5] = arity;
      }
      // append partial left arguments
      if (isPartial) {
        push.apply(bindData[2] || (bindData[2] = []), partialArgs);
      }
      // append partial right arguments
      if (isPartialRight) {
        unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
      }
      // merge flags
      bindData[1] |= bitmask;
      return createWrapper.apply(null, bindData);
    }
    // fast path for `_.bind`
    var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
    return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
  }

  /**
   * Creates compiled iteration functions.
   *
   * @private
   * @param {...Object} [options] The compile options object(s).
   * @param {string} [options.array] Code to determine if the iterable is an array or array-like.
   * @param {boolean} [options.useHas] Specify using `hasOwnProperty` checks in the object loop.
   * @param {Function} [options.keys] A reference to `_.keys` for use in own property iteration.
   * @param {string} [options.args] A comma separated string of iteration function arguments.
   * @param {string} [options.top] Code to execute before the iteration branches.
   * @param {string} [options.loop] Code to execute in the object loop.
   * @param {string} [options.bottom] Code to execute after the iteration branches.
   * @returns {Function} Returns the compiled function.
   */
  function createIterator() {
    // data properties
    iteratorData.shadowedProps = shadowedProps;

    // iterator options
    iteratorData.array = iteratorData.bottom = iteratorData.loop = iteratorData.top = '';
    iteratorData.init = 'iterable';
    iteratorData.useHas = true;

    // merge options into a template data object
    for (var object, index = 0; object = arguments[index]; index++) {
      for (var key in object) {
        iteratorData[key] = object[key];
      }
    }
    var args = iteratorData.args;
    iteratorData.firstArg = /^[^,]+/.exec(args)[0];

    // create the function factory
    var factory = Function(
        'baseCreateCallback, errorClass, errorProto, hasOwnProperty, ' +
        'indicatorObject, isArguments, isArray, isString, keys, objectProto, ' +
        'objectTypes, nonEnumProps, stringClass, stringProto, toString',
      'return function(' + args + ') {\n' + iteratorTemplate(iteratorData) + '\n}'
    );

    // return the compiled function
    return factory(
      baseCreateCallback, errorClass, errorProto, hasOwnProperty,
      indicatorObject, isArguments, isArray, isString, iteratorData.keys, objectProto,
      objectTypes, nonEnumProps, stringClass, stringProto, toString
    );
  }

  /**
   * Checks if `value` is a native function.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
   */
  function isNative(value) {
    return typeof value == 'function' && reNative.test(value);
  }

  /**
   * Sets `this` binding data on a given function.
   *
   * @private
   * @param {Function} func The function to set data on.
   * @param {Array} value The data array to set.
   */
  var setBindData = !defineProperty ? noop : function(func, value) {
    descriptor.value = value;
    defineProperty(func, '__bindData__', descriptor);
  };

  /**
   * A fallback implementation of `isPlainObject` which checks if a given value
   * is an object created by the `Object` constructor, assuming objects created
   * by the `Object` constructor have no inherited enumerable properties and that
   * there are no `Object.prototype` extensions.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
   */
  function shimIsPlainObject(value) {
    var ctor,
        result;

    // avoid non Object objects, `arguments` objects, and DOM elements
    if (!(value && toString.call(value) == objectClass) ||
        (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor)) ||
        (!support.argsClass && isArguments(value)) ||
        (!support.nodeClass && isNode(value))) {
      return false;
    }
    // IE < 9 iterates inherited properties before own properties. If the first
    // iterated property is an object's own property then there are no inherited
    // enumerable properties.
    if (support.ownLast) {
      forIn(value, function(value, key, object) {
        result = hasOwnProperty.call(object, key);
        return false;
      });
      return result !== false;
    }
    // In most environments an object's own properties are iterated before
    // its inherited properties. If the last iterated property is an object's
    // own property then there are no inherited enumerable properties.
    forIn(value, function(value, key) {
      result = key;
    });
    return typeof result == 'undefined' || hasOwnProperty.call(value, result);
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Checks if `value` is an `arguments` object.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is an `arguments` object, else `false`.
   * @example
   *
   * (function() { return _.isArguments(arguments); })(1, 2, 3);
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  function isArguments(value) {
    return value && typeof value == 'object' && typeof value.length == 'number' &&
      toString.call(value) == argsClass || false;
  }
  // fallback for browsers that can't detect `arguments` objects by [[Class]]
  if (!support.argsClass) {
    isArguments = function(value) {
      return value && typeof value == 'object' && typeof value.length == 'number' &&
        hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee') || false;
    };
  }

  /**
   * Checks if `value` is an array.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is an array, else `false`.
   * @example
   *
   * (function() { return _.isArray(arguments); })();
   * // => false
   *
   * _.isArray([1, 2, 3]);
   * // => true
   */
  var isArray = nativeIsArray || function(value) {
    return value && typeof value == 'object' && typeof value.length == 'number' &&
      toString.call(value) == arrayClass || false;
  };

  /**
   * A fallback implementation of `Object.keys` which produces an array of the
   * given object's own enumerable property names.
   *
   * @private
   * @type Function
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns an array of property names.
   */
  var shimKeys = createIterator({
    'args': 'object',
    'init': '[]',
    'top': 'if (!(objectTypes[typeof object])) return result',
    'loop': 'result.push(index)'
  });

  /**
   * Creates an array composed of the own enumerable property names of an object.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns an array of property names.
   * @example
   *
   * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
   * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
   */
  var keys = !nativeKeys ? shimKeys : function(object) {
    if (!isObject(object)) {
      return [];
    }
    if ((support.enumPrototypes && typeof object == 'function') ||
        (support.nonEnumArgs && object.length && isArguments(object))) {
      return shimKeys(object);
    }
    return nativeKeys(object);
  };

  /** Reusable iterator options shared by `each`, `forIn`, and `forOwn` */
  var eachIteratorOptions = {
    'args': 'collection, callback, thisArg',
    'top': "callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3)",
    'array': "typeof length == 'number'",
    'keys': keys,
    'loop': 'if (callback(iterable[index], index, collection) === false) return result'
  };

  /** Reusable iterator options for `assign` and `defaults` */
  var defaultsIteratorOptions = {
    'args': 'object, source, guard',
    'top':
      'var args = arguments,\n' +
      '    argsIndex = 0,\n' +
      "    argsLength = typeof guard == 'number' ? 2 : args.length;\n" +
      'while (++argsIndex < argsLength) {\n' +
      '  iterable = args[argsIndex];\n' +
      '  if (iterable && objectTypes[typeof iterable]) {',
    'keys': keys,
    'loop': "if (typeof result[index] == 'undefined') result[index] = iterable[index]",
    'bottom': '  }\n}'
  };

  /** Reusable iterator options for `forIn` and `forOwn` */
  var forOwnIteratorOptions = {
    'top': 'if (!objectTypes[typeof iterable]) return result;\n' + eachIteratorOptions.top,
    'array': false
  };

  /**
   * A function compiled to iterate `arguments` objects, arrays, objects, and
   * strings consistenly across environments, executing the callback for each
   * element in the collection. The callback is bound to `thisArg` and invoked
   * with three arguments; (value, index|key, collection). Callbacks may exit
   * iteration early by explicitly returning `false`.
   *
   * @private
   * @type Function
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {*} [thisArg] The `this` binding of `callback`.
   * @returns {Array|Object|string} Returns `collection`.
   */
  var baseEach = createIterator(eachIteratorOptions);

  /*--------------------------------------------------------------------------*/

  /**
   * Assigns own enumerable properties of source object(s) to the destination
   * object. Subsequent sources will overwrite property assignments of previous
   * sources. If a callback is provided it will be executed to produce the
   * assigned values. The callback is bound to `thisArg` and invoked with two
   * arguments; (objectValue, sourceValue).
   *
   * @static
   * @memberOf _
   * @type Function
   * @alias extend
   * @category Objects
   * @param {Object} object The destination object.
   * @param {...Object} [source] The source objects.
   * @param {Function} [callback] The function to customize assigning values.
   * @param {*} [thisArg] The `this` binding of `callback`.
   * @returns {Object} Returns the destination object.
   * @example
   *
   * _.assign({ 'name': 'fred' }, { 'employer': 'slate' });
   * // => { 'name': 'fred', 'employer': 'slate' }
   *
   * var defaults = _.partialRight(_.assign, function(a, b) {
   *   return typeof a == 'undefined' ? b : a;
   * });
   *
   * var object = { 'name': 'barney' };
   * defaults(object, { 'name': 'fred', 'employer': 'slate' });
   * // => { 'name': 'barney', 'employer': 'slate' }
   */
  var assign = createIterator(defaultsIteratorOptions, {
    'top':
      defaultsIteratorOptions.top.replace(';',
        ';\n' +
        "if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {\n" +
        '  var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);\n' +
        "} else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {\n" +
        '  callback = args[--argsLength];\n' +
        '}'
      ),
    'loop': 'result[index] = callback ? callback(result[index], iterable[index]) : iterable[index]'
  });

  /**
   * Creates a clone of `value`. If `isDeep` is `true` nested objects will also
   * be cloned, otherwise they will be assigned by reference. If a callback
   * is provided it will be executed to produce the cloned values. If the
   * callback returns `undefined` cloning will be handled by the method instead.
   * The callback is bound to `thisArg` and invoked with one argument; (value).
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to clone.
   * @param {boolean} [isDeep=false] Specify a deep clone.
   * @param {Function} [callback] The function to customize cloning values.
   * @param {*} [thisArg] The `this` binding of `callback`.
   * @returns {*} Returns the cloned value.
   * @example
   *
   * var characters = [
   *   { 'name': 'barney', 'age': 36 },
   *   { 'name': 'fred',   'age': 40 }
   * ];
   *
   * var shallow = _.clone(characters);
   * shallow[0] === characters[0];
   * // => true
   *
   * var deep = _.clone(characters, true);
   * deep[0] === characters[0];
   * // => false
   *
   * _.mixin({
   *   'clone': _.partialRight(_.clone, function(value) {
   *     return _.isElement(value) ? value.cloneNode(false) : undefined;
   *   })
   * });
   *
   * var clone = _.clone(document.body);
   * clone.childNodes.length;
   * // => 0
   */
  function clone(value, isDeep, callback, thisArg) {
    // allows working with "Collections" methods without using their `index`
    // and `collection` arguments for `isDeep` and `callback`
    if (typeof isDeep != 'boolean' && isDeep != null) {
      thisArg = callback;
      callback = isDeep;
      isDeep = false;
    }
    return baseClone(value, isDeep, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
  }

  /**
   * Iterates over own and inherited enumerable properties of an object,
   * executing the callback for each property. The callback is bound to `thisArg`
   * and invoked with three arguments; (value, key, object). Callbacks may exit
   * iteration early by explicitly returning `false`.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Objects
   * @param {Object} object The object to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {*} [thisArg] The `this` binding of `callback`.
   * @returns {Object} Returns `object`.
   * @example
   *
   * function Shape() {
   *   this.x = 0;
   *   this.y = 0;
   * }
   *
   * Shape.prototype.move = function(x, y) {
   *   this.x += x;
   *   this.y += y;
   * };
   *
   * _.forIn(new Shape, function(value, key) {
   *   console.log(key);
   * });
   * // => logs 'x', 'y', and 'move' (property order is not guaranteed across environments)
   */
  var forIn = createIterator(eachIteratorOptions, forOwnIteratorOptions, {
    'useHas': false
  });

  /**
   * Iterates over own enumerable properties of an object, executing the callback
   * for each property. The callback is bound to `thisArg` and invoked with three
   * arguments; (value, key, object). Callbacks may exit iteration early by
   * explicitly returning `false`.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Objects
   * @param {Object} object The object to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {*} [thisArg] The `this` binding of `callback`.
   * @returns {Object} Returns `object`.
   * @example
   *
   * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
   *   console.log(key);
   * });
   * // => logs '0', '1', and 'length' (property order is not guaranteed across environments)
   */
  var forOwn = createIterator(eachIteratorOptions, forOwnIteratorOptions);

  /**
   * Checks if `value` is empty. Arrays, strings, or `arguments` objects with a
   * length of `0` and objects with no own enumerable properties are considered
   * "empty".
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Array|Object|string} value The value to inspect.
   * @returns {boolean} Returns `true` if the `value` is empty, else `false`.
   * @example
   *
   * _.isEmpty([1, 2, 3]);
   * // => false
   *
   * _.isEmpty({});
   * // => true
   *
   * _.isEmpty('');
   * // => true
   */
  function isEmpty(value) {
    var result = true;
    if (!value) {
      return result;
    }
    var className = toString.call(value),
        length = value.length;

    if ((className == arrayClass || className == stringClass ||
        (support.argsClass ? className == argsClass : isArguments(value))) ||
        (className == objectClass && typeof length == 'number' && isFunction(value.splice))) {
      return !length;
    }
    forOwn(value, function() {
      return (result = false);
    });
    return result;
  }

  /**
   * Checks if `value` is a function.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   */
  function isFunction(value) {
    return typeof value == 'function';
  }
  // fallback for older versions of Chrome and Safari
  if (isFunction(/x/)) {
    isFunction = function(value) {
      return typeof value == 'function' && toString.call(value) == funcClass;
    };
  }

  /**
   * Checks if `value` is the language type of Object.
   * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(1);
   * // => false
   */
  function isObject(value) {
    // check if the value is the ECMAScript language type of Object
    // http://es5.github.io/#x8
    // and avoid a V8 bug
    // http://code.google.com/p/v8/issues/detail?id=2291
    return !!(value && objectTypes[typeof value]);
  }

  /**
   * Checks if `value` is an object created by the `Object` constructor.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
   * @example
   *
   * function Shape() {
   *   this.x = 0;
   *   this.y = 0;
   * }
   *
   * _.isPlainObject(new Shape);
   * // => false
   *
   * _.isPlainObject([1, 2, 3]);
   * // => false
   *
   * _.isPlainObject({ 'x': 0, 'y': 0 });
   * // => true
   */
  var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
    if (!(value && toString.call(value) == objectClass) || (!support.argsClass && isArguments(value))) {
      return false;
    }
    var valueOf = value.valueOf,
        objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

    return objProto
      ? (value == objProto || getPrototypeOf(value) == objProto)
      : shimIsPlainObject(value);
  };

  /**
   * Checks if `value` is a string.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is a string, else `false`.
   * @example
   *
   * _.isString('fred');
   * // => true
   */
  function isString(value) {
    return typeof value == 'string' ||
      value && typeof value == 'object' && toString.call(value) == stringClass || false;
  }

  /**
   * Recursively merges own enumerable properties of the source object(s), that
   * don't resolve to `undefined` into the destination object. Subsequent sources
   * will overwrite property assignments of previous sources. If a callback is
   * provided it will be executed to produce the merged values of the destination
   * and source properties. If the callback returns `undefined` merging will
   * be handled by the method instead. The callback is bound to `thisArg` and
   * invoked with two arguments; (objectValue, sourceValue).
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The destination object.
   * @param {...Object} [source] The source objects.
   * @param {Function} [callback] The function to customize merging properties.
   * @param {*} [thisArg] The `this` binding of `callback`.
   * @returns {Object} Returns the destination object.
   * @example
   *
   * var names = {
   *   'characters': [
   *     { 'name': 'barney' },
   *     { 'name': 'fred' }
   *   ]
   * };
   *
   * var ages = {
   *   'characters': [
   *     { 'age': 36 },
   *     { 'age': 40 }
   *   ]
   * };
   *
   * _.merge(names, ages);
   * // => { 'characters': [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred', 'age': 40 }] }
   *
   * var food = {
   *   'fruits': ['apple'],
   *   'vegetables': ['beet']
   * };
   *
   * var otherFood = {
   *   'fruits': ['banana'],
   *   'vegetables': ['carrot']
   * };
   *
   * _.merge(food, otherFood, function(a, b) {
   *   return _.isArray(a) ? a.concat(b) : undefined;
   * });
   * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot] }
   */
  function merge(object) {
    var args = arguments,
        length = 2;

    if (!isObject(object)) {
      return object;
    }
    // allows working with `_.reduce` and `_.reduceRight` without using
    // their `index` and `collection` arguments
    if (typeof args[2] != 'number') {
      length = args.length;
    }
    if (length > 3 && typeof args[length - 2] == 'function') {
      var callback = baseCreateCallback(args[--length - 1], args[length--], 2);
    } else if (length > 2 && typeof args[length - 1] == 'function') {
      callback = args[--length];
    }
    var sources = slice(arguments, 1, length),
        index = -1,
        stackA = getArray(),
        stackB = getArray();

    while (++index < length) {
      baseMerge(object, sources[index], callback, stackA, stackB);
    }
    releaseArray(stackA);
    releaseArray(stackB);
    return object;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Iterates over elements of a collection, executing the callback for each
   * element. The callback is bound to `thisArg` and invoked with three arguments;
   * (value, index|key, collection). Callbacks may exit iteration early by
   * explicitly returning `false`.
   *
   * Note: As with other "Collections" methods, objects with a `length` property
   * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
   * may be used for object iteration.
   *
   * @static
   * @memberOf _
   * @alias each
   * @category Collections
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {*} [thisArg] The `this` binding of `callback`.
   * @returns {Array|Object|string} Returns `collection`.
   * @example
   *
   * _([1, 2, 3]).forEach(function(num) { console.log(num); }).join(',');
   * // => logs each number and returns '1,2,3'
   *
   * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { console.log(num); });
   * // => logs each number and returns the object (property order is not guaranteed across environments)
   */
  function forEach(collection, callback, thisArg) {
    if (callback && typeof thisArg == 'undefined' && isArray(collection)) {
      var index = -1,
          length = collection.length;

      while (++index < length) {
        if (callback(collection[index], index, collection) === false) {
          break;
        }
      }
    } else {
      baseEach(collection, callback, thisArg);
    }
    return collection;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Creates an array with all falsey values removed. The values `false`, `null`,
   * `0`, `""`, `undefined`, and `NaN` are all falsey.
   *
   * @static
   * @memberOf _
   * @category Arrays
   * @param {Array} array The array to compact.
   * @returns {Array} Returns a new array of filtered values.
   * @example
   *
   * _.compact([0, 1, false, 2, '', 3]);
   * // => [1, 2, 3]
   */
  function compact(array) {
    var index = -1,
        length = array ? array.length : 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result.push(value);
      }
    }
    return result;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a function that, when called, invokes `func` with the `this`
   * binding of `thisArg` and prepends any additional `bind` arguments to those
   * provided to the bound function.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to bind.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {...*} [arg] Arguments to be partially applied.
   * @returns {Function} Returns the new bound function.
   * @example
   *
   * var func = function(greeting) {
   *   return greeting + ' ' + this.name;
   * };
   *
   * func = _.bind(func, { 'name': 'fred' }, 'hi');
   * func();
   * // => 'hi fred'
   */
  function bind(func, thisArg) {
    return arguments.length > 2
      ? createWrapper(func, 17, slice(arguments, 2), null, thisArg)
      : createWrapper(func, 1, null, null, thisArg);
  }

  /*--------------------------------------------------------------------------*/

  /**
   * This method returns the first argument provided to it.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'name': 'fred' };
   * _.identity(object) === object;
   * // => true
   */
  function identity(value) {
    return value;
  }

  /**
   * A no-operation function.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @example
   *
   * var object = { 'name': 'fred' };
   * _.noop(object) === undefined;
   * // => true
   */
  function noop() {
    // no operation performed
  }

  /*--------------------------------------------------------------------------*/

  lodash.assign = assign;
  lodash.bind = bind;
  lodash.compact = compact;
  lodash.forEach = forEach;
  lodash.forIn = forIn;
  lodash.forOwn = forOwn;
  lodash.keys = keys;
  lodash.merge = merge;

  lodash.each = forEach;
  lodash.extend = assign;

  /*--------------------------------------------------------------------------*/

  // add functions that return unwrapped values when chaining
  lodash.clone = clone;
  lodash.identity = identity;
  lodash.isArguments = isArguments;
  lodash.isArray = isArray;
  lodash.isEmpty = isEmpty;
  lodash.isFunction = isFunction;
  lodash.isObject = isObject;
  lodash.isPlainObject = isPlainObject;
  lodash.isString = isString;
  lodash.noop = noop;

  /*--------------------------------------------------------------------------*/

  /**
   * The semantic version number.
   *
   * @static
   * @memberOf _
   * @type string
   */
  lodash.VERSION = '2.4.1';

  /*--------------------------------------------------------------------------*/

  if (freeExports && freeModule) {
    // in Node.js or RingoJS
    if (moduleExports) {
      (freeModule.exports = lodash)._ = lodash;
    }

  }

}.call(this));

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],84:[function(require,module,exports){
var geojsonArea = require('geojson-area');

module.exports = rewind;

function rewind(gj, outer) {
    switch ((gj && gj.type) || null) {
        case 'FeatureCollection':
            gj.features = gj.features.map(curryOuter(rewind, outer));
            return gj;
        case 'Feature':
            gj.geometry = rewind(gj.geometry, outer);
            return gj;
        case 'Polygon':
        case 'MultiPolygon':
            return correct(gj, outer);
        default:
            return gj;
    }
}

function curryOuter(a, b) {
    return function(_) { return a(_, b); };
}

function correct(_, outer) {
    if (_.type === 'Polygon') {
        _.coordinates = correctRings(_.coordinates, outer);
    } else if (_.type === 'MultiPolygon') {
        _.coordinates = _.coordinates.map(curryOuter(correctRings, outer));
    }
    return _;
}

function correctRings(_, outer) {
    outer = !!outer;
    _[0] = wind(_[0], !outer);
    for (var i = 1; i < _.length; i++) {
        _[i] = wind(_[i], outer);
    }
    return _;
}

function wind(_, dir) {
    return cw(_) === dir ? _ : _.reverse();
}

function cw(_) {
    return geojsonArea.ring(_) >= 0;
}

},{"geojson-area":85}],85:[function(require,module,exports){
var wgs84 = require('wgs84');

module.exports.geometry = geometry;
module.exports.ring = ringArea;

function geometry(_) {
    if (_.type === 'Polygon') return polygonArea(_.coordinates);
    else if (_.type === 'MultiPolygon') {
        var area = 0;
        for (var i = 0; i < _.coordinates.length; i++) {
            area += polygonArea(_.coordinates[i]);
        }
        return area;
    } else {
        return null;
    }
}

function polygonArea(coords) {
    var area = 0;
    if (coords && coords.length > 0) {
        area += Math.abs(ringArea(coords[0]));
        for (var i = 1; i < coords.length; i++) {
            area -= Math.abs(ringArea(coords[i]));
        }
    }
    return area;
}

/**
 * Calculate the approximate area of the polygon were it projected onto
 *     the earth.  Note that this area will be positive if ring is oriented
 *     clockwise, otherwise it will be negative.
 *
 * Reference:
 * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
 *     Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
 *     Laboratory, Pasadena, CA, June 2007 http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409
 *
 * Returns:
 * {float} The approximate signed geodesic area of the polygon in square
 *     meters.
 */

function ringArea(coords) {
    var area = 0;

    if (coords.length > 2) {
        var p1, p2;
        for (var i = 0; i < coords.length - 1; i++) {
            p1 = coords[i];
            p2 = coords[i + 1];
            area += rad(p2[0] - p1[0]) * (2 + Math.sin(rad(p1[1])) + Math.sin(rad(p2[1])));
        }

        area = area * wgs84.RADIUS * wgs84.RADIUS / 2;
    }

    return area;
}

function rad(_) {
    return _ * Math.PI / 180;
}

},{"wgs84":86}],86:[function(require,module,exports){
module.exports.RADIUS = 6378137;
module.exports.FLATTENING = 1/298.257223563;
module.exports.POLAR_RADIUS = 6356752.3142;

},{}],87:[function(require,module,exports){
module.exports={
    "building": true,
    "highway": {
        "included_values": {
            "services": true,
            "rest_area": true,
            "escape": true
        }
    },
    "natural": {
        "excluded_values": {
            "coastline": true,
            "cliff": true,
            "ridge": true,
            "arete": true,
            "tree_row": true
        }
    },
    "landuse": true,
    "waterway": {
        "included_values": {
            "riverbank": true,
            "dock": true,
            "boatyard": true,
            "dam": true
        }
    },
    "amenity": true,
    "leisure": true,
    "barrier": {
        "included_values": {
            "city_wall": true,
            "ditch": true,
            "hedge": true,
            "retaining_wall": true,
            "wall": true,
            "spikes": true
        }
    },
    "railway": {
        "included_values": {
            "station": true,
            "turntable": true,
            "roundhouse": true,
            "platform": true
        }
    },
    "area": true,
    "boundary": true,
    "man_made": {
        "excluded_values": {
            "cutline": true,
            "embankment": true,
            "pipeline": true
        }
    },
    "power": {
        "included_values": {
            "plant": true,
            "substation": true,
            "generator": true,
            "transformer": true
        }
    },
    "place": true,
    "shop": true,
    "aeroway": {
        "excluded_values": {
            "taxiway": true
        }
    },
    "tourism": true,
    "historic": true,
    "public_transport": true,
    "office": true,
    "building:part": true,
    "military": true,
    "ruins": true,
    "area:highway": true,
    "craft": true,
    "golf": true
}

},{}]},{},[8])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6XFxwcm9qZWN0c1xcbWFwXFxub2RlX21vZHVsZXNcXGd1bHAtYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL2NvcmUvZXZlbnRzLmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9jb3JlL2luZGV4LmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9jb3JlL21lc3NhZ2UuanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL2NvcmUvbW9kYWwuanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL2NvcmUvb3B0aW9ucy5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvY29yZS9zdG9yZS5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvY29yZS9zeXN0ZW0uanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL2Zha2VfM2FjMTY2YjguanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL2xpYnMvZXh0ZW5kL2Jvb3RzdHJhcC5leHQuanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL2xpYnMvZXh0ZW5kL2luZGV4LmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9saWJzL2V4dGVuZC9sZWFmbGV0LmV4dC5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvbGlicy9leHRlbmQvdW5kZXJzY29yZS5leHQuanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL2xpYnMvZXh0ZW5kL3ZhbGlkYXRpb24uZXh0LmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9saWJzL2Zvb3Rlci9pbmRleC5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvbGlicy9pbmRleC5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvbGlicy9sYXllci9jb2xsZWN0aW9uLmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9saWJzL2xheWVyL2luZGV4LmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9saWJzL2xheWVyL21vZGVsLmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9saWJzL2xheWVyL3ZpZXcuanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL2xpYnMvbWFzay9pbmRleC5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvbGlicy9tZW51L2J1dHRvbi5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvbGlicy9tZW51L2luZGV4LmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9saWJzL21lbnUvbWFuYWdlci5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvbGlicy9tZW51L21lbnUuanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL2xpYnMvbWVudS9wb3BvdmVyLmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9saWJzL3BsdWdpbnMvTC5Db250cm9sLkxvY2F0ZS5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvbGlicy9wbHVnaW5zL0wuQ29udHJvbC5Nb3VzZVBvc2l0aW9uLmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9saWJzL3BsdWdpbnMvTC5HZW9kZXNpYy5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvbGlicy9wbHVnaW5zL2JhY2tib25lLnN0aWNraXQuanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL2xpYnMvcGx1Z2lucy9pbmRleC5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvbGlicy92aWV3cy9jb21tYW5kLmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9saWJzL3ZpZXdzL3BvcHVwLmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9saWJzL3ZpZXdzL3JlbW90ZS1taXguanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL2xpYnMvdmlld3MvdGFicy5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvbW9kdWxlcy9mb290ZXJzL2luZGV4LmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9tb2R1bGVzL2luZGV4LmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9tb2R1bGVzL2luZm8vaW5kZXguanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL21vZHVsZXMvaW5mby9sb2NhbC5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvbW9kdWxlcy9pbmZvL3JvdXRlLXZlcnRleC5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvbW9kdWxlcy9tYXAvaW5kZXguanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL21vZHVsZXMvbWFwcy9pbmRleC5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvbW9kdWxlcy9tYXBzL2xheWVyLmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9tb2R1bGVzL21lbnUvYXV0aC9jaGFuZ2UtcGFzc3dvcmQuanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL21vZHVsZXMvbWVudS9hdXRoL2luZGV4LmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9tb2R1bGVzL21lbnUvYXV0aC9sb2dpbi5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvbW9kdWxlcy9tZW51L2F1dGgvcmVnaXN0ZXIuanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL21vZHVsZXMvbWVudS9hdXRoL3Jlc2V0LXBhc3N3b3JkLmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9tb2R1bGVzL21lbnUvaW5kZXguanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL21vZHVsZXMvbWVudS9sYXllcnMvaW5kZXguanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL21vZHVsZXMvbWVudS9sYXllcnMvbW9kZWxzLmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9tb2R1bGVzL21lbnUvbGF5ZXJzL3ZpZXcuanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL21vZHVsZXMvbWVudS9tYXBzL2luZGV4LmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9tb2R1bGVzL21lbnUvbWFwcy9tb2RlbC5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvbW9kdWxlcy9tZW51L21hcHMvdmlldy5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvbW9kdWxlcy9tZW51L21ldGVvL2luZGV4LmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9tb2R1bGVzL21lbnUvbWV0ZW8vbW9kZWxzLmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9tb2R1bGVzL21lbnUvbWV0ZW8vdmlldy5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvbW9kdWxlcy9tZW51L21ldGVvL3dpbmQtc2NhbGUuanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL21vZHVsZXMvbWVudS9wcm9maWxlL2luZGV4LmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9tb2R1bGVzL21lbnUvcHJvZmlsZS9tb2RlbC5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvbW9kdWxlcy9tZW51L3Byb2ZpbGUvcHJpdmF0ZS5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvbW9kdWxlcy9tZW51L3Byb2ZpbGUvc29jaWFsLW5ldHdvcmtzLmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9tb2R1bGVzL3JvdXRlL2NvbnRyb2xsZXIuanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL21vZHVsZXMvcm91dGUvaW5kZXguanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL21vZHVsZXMvcm91dGUvbW9kZWwuanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL21vZHVsZXMvcm91dGUvdmlld3MvbWFwL2RpcmVjdGlvbi5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvbW9kdWxlcy9yb3V0ZS92aWV3cy9tYXAvZHJhZy1tYXJrZXIuanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL21vZHVsZXMvcm91dGUvdmlld3MvbWFwL2luZm9ybWVyLmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9tb2R1bGVzL3JvdXRlL3ZpZXdzL21hcC9tYXJrZXIuanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL21vZHVsZXMvcm91dGUvdmlld3MvbWFwL3JvdXRlLmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9tb2R1bGVzL3JvdXRlL3ZpZXdzL21hcC92ZXJ0ZXguanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL21vZHVsZXMvc2VhL2Jhc2UtbWV0ZW8uanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL21vZHVsZXMvc2VhL2luZGV4LmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9tb2R1bGVzL3NlYS9saWd0aC9jb2xsZWN0aW9uLmpzIiwiZTovcHJvamVjdHMvbWFwL2NsaWVudC9qcy9tb2R1bGVzL3NlYS9saWd0aC9pbmRleC5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvbW9kdWxlcy9zZWEvbGlndGgvdmlldy5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvbW9kdWxlcy9zZWEvbWFyaW5lL2NvbGxlY3Rpb24uanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL21vZHVsZXMvc2VhL21hcmluZS9pbmRleC5qcyIsImU6L3Byb2plY3RzL21hcC9jbGllbnQvanMvbW9kdWxlcy9zZWEvbWFyaW5lL3ZpZXcuanMiLCJlOi9wcm9qZWN0cy9tYXAvY2xpZW50L2pzL21vZHVsZXMvc2VhL3NlZS1tYXJrZXIuanMiLCJlOi9wcm9qZWN0cy9tYXAvbm9kZV9tb2R1bGVzL21vbWVudC9tb21lbnQuanMiLCJlOi9wcm9qZWN0cy9tYXAvbm9kZV9tb2R1bGVzL29zbXRvZ2VvanNvbi9pbmRleC5qcyIsImU6L3Byb2plY3RzL21hcC9ub2RlX21vZHVsZXMvb3NtdG9nZW9qc29uL2xvZGFzaC5jdXN0b20uanMiLCJlOi9wcm9qZWN0cy9tYXAvbm9kZV9tb2R1bGVzL29zbXRvZ2VvanNvbi9ub2RlX21vZHVsZXMvZ2VvanNvbi1yZXdpbmQvaW5kZXguanMiLCJlOi9wcm9qZWN0cy9tYXAvbm9kZV9tb2R1bGVzL29zbXRvZ2VvanNvbi9ub2RlX21vZHVsZXMvZ2VvanNvbi1yZXdpbmQvbm9kZV9tb2R1bGVzL2dlb2pzb24tYXJlYS9pbmRleC5qcyIsImU6L3Byb2plY3RzL21hcC9ub2RlX21vZHVsZXMvb3NtdG9nZW9qc29uL25vZGVfbW9kdWxlcy9nZW9qc29uLXJld2luZC9ub2RlX21vZHVsZXMvZ2VvanNvbi1hcmVhL25vZGVfbW9kdWxlcy93Z3M4NC9pbmRleC5qcyIsImU6L3Byb2plY3RzL21hcC9ub2RlX21vZHVsZXMvb3NtdG9nZW9qc29uL3BvbHlnb25fZmVhdHVyZXMuanNvbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Y0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ByQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3Y2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3B3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuICogQ3JlYXRlZCBieSBhbGV4IG9uIDA3LjA4LjIwMTUuXHJcbiAqL1xyXG52YXIgRXZlbnRzID0gZnVuY3Rpb24gKGNoYW5uZWxzKSB7XHJcbiAgICB0aGlzLl9jaGFubmVscyA9IHt9O1xyXG4gICAgdGhpcy5pbml0aWFsaXplKGNoYW5uZWxzKTtcclxufVxyXG5cclxuRXZlbnRzLnByb3RvdHlwZSA9IHtcclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChjaGFubmVscykge1xyXG4gICAgICAgIFtdLmNvbmNhdChjaGFubmVscykuZm9yRWFjaCh0aGlzLmNyZWF0ZUNoYW5uZWwsIHRoaXMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSxcclxuICAgIGNoYW5uZWw6IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NoYW5uZWxzW25hbWVdKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hhbm5lbHNbbmFtZV07XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBmb3VuZCBjaGFubmVsczonICsgbmFtZSk7XHJcbiAgICB9LFxyXG4gICAgY3JlYXRlQ2hhbm5lbDogZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2NoYW5uZWxzW25hbWVdKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NoYW5uZWxzW25hbWVdID0gXy5leHRlbmQoe30sIEJhY2tib25lLkV2ZW50cykub24oJ2FsbCcsIGZ1bmN0aW9uIChlTmFtZSwgZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9Ca0LDQvdCw0Ls6ICVzID0+ICVvJywgbmFtZSwgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fY2hhbm5lbHNbbmFtZV07XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFdmVudHM7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgYWxleCBvbiAwNy4wOC4yMDE1LlxyXG4gKi9cclxuXHJcbnZhciBFdmVudHMgPSByZXF1aXJlKCcuL2V2ZW50cycpO1xyXG5cclxuYXBwLm9wdGlvbnMgPSByZXF1aXJlKCcuL29wdGlvbnMnKTtcclxuYXBwLmV2ZW50cyA9IG5ldyBFdmVudHMoYXBwLm9wdGlvbnMuY2hhbm5lbHMpO1xyXG5hcHAuc3RvcmUgPSByZXF1aXJlKCcuL3N0b3JlJyk7XHJcblxyXG5cclxucmVxdWlyZSgnLi9zeXN0ZW0nKTtcclxuXHJcbnZhciBNZXNzYWdlID0gcmVxdWlyZSgnLi9tZXNzYWdlJyk7XHJcbmFwcC5tZXNzYWdlID0gbmV3IE1lc3NhZ2Uoe2VsOiAkKCcjdGVtcC1tZXNzYWdlLWJsb2NrJykuaHRtbCgpfSk7XHJcblxyXG52YXIgTW9kYWwgPSByZXF1aXJlKCcuL21vZGFsJyk7XHJcbmFwcC5tb2RhbCA9IG5ldyBNb2RhbCh7ZWw6ICcjbWFwLW1vZGFsJ30pO1xyXG5cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgYWxleCBvbiAwOS4wOS4yMDE1LlxyXG4gKi9cclxuXHJcbnZhciBWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xyXG4gICAgdGVtcGxhdGVJdGVtOiBfLnRlbXBsYXRlKCQoJyN0ZW1wLW1lc3NhZ2UtaXRlbScpLmh0bWwoKSksXHJcbiAgICB0ZW1wbGF0ZUh0bWw6IF8udGVtcGxhdGUoJCgnI3RlbXAtbWVzc2FnZS1odG1sJykuaHRtbCgpKSxcclxuICAgIGRlZmF1bHRzOiB7XHJcbiAgICAgICAgY2xhc3NOYW1lOiAnYWxlcnQtd2FybmluZycsXHJcbiAgICAgICAgdGl0bGU6ICcnLFxyXG4gICAgICAgIGNvbnRlbnQ6ICcnLFxyXG4gICAgICAgIGh0bWw6ICcnLFxyXG4gICAgICAgIHRpbWU6IDAsXHJcbiAgICAgICAgYW5pbWF0aW9uOiAwXHJcbiAgICB9LFxyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICAkKCdib2R5JykuYXBwZW5kKHRoaXMuZWwpO1xyXG4gICAgfSxcclxuICAgIHNlbmQ6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgZGF0YSA9IF8uZGVmYXVsdHMoZGF0YSwgdGhpcy5kZWZhdWx0cyk7XHJcbiAgICAgICAgdmFyICRlbCA9IHRoaXMuX2NyZWF0ZShkYXRhKTtcclxuICAgICAgICB0aGlzLiRlbC5hcHBlbmQoJGVsKTtcclxuICAgICAgICBkYXRhLnRpbWUgJiYgdGhpcy5fdGltZSgkZWwsIGRhdGEpO1xyXG4gICAgICAgIHJldHVybiAkZWw7XHJcbiAgICB9LFxyXG4gICAgX2NyZWF0ZTogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gJCgoZGF0YS5odG1sID8gdGhpcy50ZW1wbGF0ZUh0bWwoZGF0YSkgOiB0aGlzLnRlbXBsYXRlSXRlbShkYXRhKSkpO1xyXG4gICAgfSxcclxuICAgIF90aW1lOiBmdW5jdGlvbiAoJGVsLCBkYXRhKSB7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRlbC5oaWRlKGRhdGEuYW5pbWF0aW9uLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkZWwuYWxlcnQoJ2Nsb3NlJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sIGRhdGEudGltZSk7XHJcbiAgICB9XHJcblxyXG5cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgYWxleCBvbiAwOS4wOS4yMDE1LlxyXG4gKi9cclxuXHJcbnZhciBWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xyXG4gICAgZGVmYXVsdHM6IHtcclxuICAgICAgICAvL2NsYXNzTmFtZTogJ2FsZXJ0LXdhcm5pbmcnLFxyXG4gICAgICAgIC8vdGl0bGU6ICcnLFxyXG4gICAgICAgIC8vY29udGVudDogJycsXHJcbiAgICAgICAgLy9odG1sOiAnJyxcclxuICAgICAgICAvL3RpbWU6IDAsXHJcbiAgICAgICAgLy9hbmltYXRpb246IDBcclxuICAgIH0sXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG5cclxuICAgIH0sXHJcbiAgICBvcGVuOiBmdW5jdGlvbiAodmlldykge1xyXG4gICAgICAgIHZpZXcubW9kYWwgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuJGVsXHJcbiAgICAgICAgICAgIC5hcHBlbmQodmlldy5lbCB8fCB2aWV3KVxyXG4gICAgICAgICAgICAub25lKCdoaWRkZW4uYnMubW9kYWwnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRlbC5lbXB0eSgpO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcykpXHJcbiAgICAgICAgICAgIC5tb2RhbCgnc2hvdycpO1xyXG4gICAgfSxcclxuICAgIGNsb3NlIDogZnVuY3Rpb24oKXtcclxuICAgICAgICB0aGlzLiRlbC5tb2RhbCgnaGlkZScpXHJcblxyXG4gICAgfVxyXG59KTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgTkJQMTAwMDgzIG9uIDE4LjA4LjIwMTUuXHJcbiAqL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICAvLyDRgdC/0LjRgdC+0Log0LrQsNC90LDQu9C+0LIg0YHQvtCx0YvRgtC40Lkg0L/RgNC40LvQvtC20LXQvdC40Y9cclxuICAgIGNoYW5uZWxzOiBbJ3N5c3RlbScsICdzY3JlZW4nLCAnbWVudScsICdsYXllcnMnLCAnYmFzZS1tYXAnLCAncm91dGUnICwnaW5mbycsICdtYXAnICwgJ2F1dGgnXSxcclxuICAgIGljb25zOiB7XHJcbiAgICAgICAgd3A6IEwuZGl2SWNvbih7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ21hcC1yb3V0ZS1pY29uJ1xyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGRmOiBMLmRpdkljb24oe1xyXG4gICAgICAgICAgICBjbGFzc05hbWU6ICdpY29uLWhkLWdyZWVuLTI0JyxcclxuICAgICAgICAgICAgaWNvblNpemU6IEwucG9pbnQoMjQsIDI0KSxcclxuICAgICAgICAgICAgaWNvbkFuY2hvcjogTC5wb2ludCgxMiwgMTIpXHJcbiAgICAgICAgfSlcclxuICAgICAgICAvL25ldyBMLkljb24uRGVmYXVsdCgpXHJcblxyXG4gICAgfSxcclxuICAgIHR5cGVzOiB7IC8vINGC0LjQv9GLINCS0J8g0KDQpFxyXG4gICAgICAgIFdJTkQ6IHtcclxuICAgICAgICAgICAgdGl0bGU6ICfQktC10YLQtdGAJyxcclxuICAgICAgICAgICAgZW5hYmxlWm9vbTogWzMsIDhdXHJcbiAgICAgICAgfSxcclxuICAgICAgICBQUkVTUzoge1xyXG4gICAgICAgICAgICB0aXRsZTogJ9CQ0YLQvNC+0YHRhC4g0LTQsNCy0LvQtdC90LjQtScsXHJcbiAgICAgICAgICAgIGVuYWJsZVpvb206IFszLCA4XVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgVEVNUDoge1xyXG4gICAgICAgICAgICB0aXRsZTogJ9Ci0LXQvNC/0LXRgNCw0YLRg9GA0LAg0LLQvtC30LQuJyxcclxuICAgICAgICAgICAgZW5hYmxlWm9vbTogWzMsIDhdXHJcbiAgICAgICAgfSxcclxuICAgICAgICBQUkVDSVBJVEFUSU9OOiB7XHJcbiAgICAgICAgICAgIHRpdGxlOiAn0J7RgdCw0LTQutC4JyxcclxuICAgICAgICAgICAgZW5hYmxlWm9vbTogWzMsIDhdXHJcbiAgICAgICAgfSxcclxuICAgICAgICBXQVZFOiB7XHJcbiAgICAgICAgICAgIHRpdGxlOiAn0JLRi9GB0L7RgtCwINCy0L7Qu9C90YsnLFxyXG4gICAgICAgICAgICBlbmFibGVab29tOiBbMywgOF1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBTRUVNQVJLRVI6IHtcclxuICAgICAgICAgICAgdGl0bGU6ICfQnNCw0Y/QutC4INC4INCx0YPQuCcsXHJcbiAgICAgICAgICAgIGVuYWJsZVpvb206IFs4LCAzMF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIE1BUklORToge1xyXG4gICAgICAgICAgICB0aXRsZTogJ9Cf0L7RgNGC0Ysg0Lgg0LzQsNGA0LjQvdGLIC0gU2tpcHBlckd1aWRlLmNvbScsXHJcbiAgICAgICAgICAgIGVuYWJsZVpvb206IFs0LCAzMF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIExJR1RIOiB7XHJcbiAgICAgICAgICAgIHRpdGxlOiAn0J/QvtGA0YLRiyDQuCDQvNCw0YDQuNC90YsgLSBPU00nLFxyXG4gICAgICAgICAgICBlbmFibGVab29tOiBbNCwgMzBdXHJcbiAgICAgICAgfSxcclxuXHJcblxyXG5cclxuICAgIH1cclxufTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBOQlAxMDAwODMgb24gMTYuMDguMjAxNS5cclxuICovXHJcblxyXG5tb2R1bGUuZXhwb3J0cz0ge1xyXG4gICAgYWN0aW9uOiAnX2xvY2FsJyxcclxuICAgIGdldDogZnVuY3Rpb24obmFtZSl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXNbdGhpcy5hY3Rpb25dKG5hbWUpO1xyXG4gICAgfSxcclxuICAgIHNldDogZnVuY3Rpb24obmFtZSwgZGF0YSl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXNbdGhpcy5hY3Rpb25dKG5hbWUsIGRhdGEpO1xyXG4gICAgfSxcclxuXHJcbiAgICBfbG9jYWw6IGZ1bmN0aW9uIChuYW1lLCBkYXRhKSB7XHJcbiAgICAgICAgaWYod2luZG93LmxvY2FsU3RvcmFnZSl7XHJcbiAgICAgICAgICAgIGlmKGRhdGEpICAgIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShuYW1lLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShuYW1lKSkgfHwge307XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59OyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGFsZXggb24gMDcuMDguMjAxNS5cclxuICovXHJcbnZhciBldmVudHMgPXJlcXVpcmUoJy4vZXZlbnRzJyksXHJcbiAgICBldm5TY3JlZW4gPSBhcHAuZXZlbnRzLmNoYW5uZWwoJ3NjcmVlbicpLFxyXG4gICAgZXZuU3lzdGVtID0gYXBwLmV2ZW50cy5jaGFubmVsKCdzeXN0ZW0nKTtcclxuXHJcbiQod2luZG93KVxyXG4gICAgLm9uKCdyZXNpemUnLCBfLmRlYm91bmNlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBldm5TY3JlZW4udHJpZ2dlcigncmVzaXplOnN0YXJ0Jyk7XHJcbiAgICB9LmJpbmQodGhpcyksIDMwMCwgdHJ1ZSkpXHJcbiAgICAub24oJ3Jlc2l6ZScsIF8uZGVib3VuY2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGV2blNjcmVlbi50cmlnZ2VyKCdyZXNpemU6ZW5kJyk7XHJcbiAgICB9LmJpbmQodGhpcyksIDMwMCkpXHJcbiAgICAub24oJ3Jlc2l6ZScsIF8udGhyb3R0bGUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGV2blNjcmVlbi50cmlnZ2VyKCdyZXNpemUnKTtcclxuICAgIH0uYmluZCh0aGlzKSwgMTAwKSlcclxuICAgIC51bmxvYWQoIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgIGV2blN5c3RlbS50cmlnZ2VyKCd1bmxvYWQnKTtcclxuICAgIH0pXHJcbiAgICAubG9hZCggZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgZXZuU3lzdGVtLnRyaWdnZXIoJ2xvYWQnKTtcclxuICAgIH0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGFsZXggb24gMzAuMDcuMjAxNS5cclxuICovXHJcblxyXG4hZnVuY3Rpb24gKCkge1xyXG5cclxuXHJcbiAgICB3aW5kb3cuYXBwID0ge307XHJcblxyXG4gICAgdmFyIFJvdXRlID0gQmFja2JvbmUuUm91dGVyLmV4dGVuZCh7XHJcbiAgICAgICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXF1aXJlKCcuL2xpYnMnKTtcclxuICAgICAgICAgICAgcmVxdWlyZSgnLi9jb3JlJyk7XHJcbiAgICAgICAgICAgIHJlcXVpcmUoJy4vbW9kdWxlcycpO1xyXG5cclxuICAgICAgICAgICAgQmFja2JvbmUuaGlzdG9yeS5zdGFydCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gdGhpcy5fZGVtb01lc3NhZ2UoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICByb3V0ZXM6IHtcclxuICAgICAgICAgICAgXCJoZWxwXCI6IFwiaGVscFwiLCAgICAvLyAjaGVscFxyXG4gICAgICAgICAgICBcInRva2VuLzprZXlcIjogXCJ0b2tlblwiLFxyXG4gICAgICAgICAgICBcInNlYXJjaC86cXVlcnlcIjogXCJzZWFyY2hcIiwgIC8vICNzZWFyY2gva2l3aXNcclxuICAgICAgICAgICAgXCJzZWFyY2gvOnF1ZXJ5L3A6cGFnZVwiOiBcInNlYXJjaFwiICAgLy8gI3NlYXJjaC9raXdpcy9wN1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaGVscDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnI2hlbHAnKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNlYXJjaDogZnVuY3Rpb24gKHF1ZXJ5LCBwYWdlKSB7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB0b2tlbjogZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICBhcHAuZXZlbnRzLmNoYW5uZWwoJ2F1dGgnKS50cmlnZ2VyKCdjaGFuZ2UtcGFzc3dvcmQnLCBrZXkpO1xyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICBfZGVtb01lc3NhZ2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGkgPSA4LFxyXG4gICAgICAgICAgICAgICAga2V5LFxyXG4gICAgICAgICAgICAgICAgJGVsID0gYXBwLm1lc3NhZ2Uuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfQlNC10LzQvtGB0YLRgNCw0YbQuNGPINC40L3RhNC+INGB0L7QvtCx0YnQtdC90LjQuScsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogJ9CR0L7Qu9GM0YjQuNC90YHRgtCy0L4g0L/QvtCz0LDRgdC90YPRgiDRh9C10YDQtdC3IDxiIGlkPVwidGVzdFRpbWVcIj4nICsgaSArICc8L2I+INGB0LXQutGD0L3QtC4g0J7QtNC90L4g0L3QsNC00L4g0LfQsNC60YDRi9GC0Ywg0YDRg9C60LDQvNC4JyxcclxuICAgICAgICAgICAgICAgICAgICB0aW1lOiBpICogMTAwMFxyXG4gICAgICAgICAgICAgICAgICAgIC8vYW5pbWF0aW9uOiAxMDAwXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGtleSA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRlbC5maW5kKCcjdGVzdFRpbWUnKS50ZXh0KC0taSk7XHJcbiAgICAgICAgICAgIH0sIDEwMDApO1xyXG5cclxuICAgICAgICAgICAgJGVsLm9uZSgnY2xvc2VkLmJzLmFsZXJ0JywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIC8vYWxlcnQoJ9Ce0LrQvdC+INC30LDQutGA0YvRgtC+ICEhIScpXHJcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGtleSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYXBwLm1lc3NhZ2Uuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdhbGVydC1pbmZvJyxcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAn0JjQvdGE0L4g0YHQvtC+0LHRidC10L3QuNC1JyxcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICfQndCw0LbQvNC4IDxzcGFuIGNsYXNzPVwibGFiZWwgbGFiZWwtcHJpbWFyeVwiPkFsdC0xLCBBbHQtMiwgQWx0LTM8L3NwYW4+INC00LvRjyDQv9GA0L7RgdC80L7RgtGA0LAg0L/QvtC00LLQsNC70LAuPC9icj48c21hbGw+INCc0LXQvdGPINC90LDQtNC+INC30LDQutGA0YvRgtGMINGA0YPQutCw0LzQuC4g0J3QsNC20LzQuCDQutGA0LXRgdGC0LjQujwvc21hbGw+J1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgYXBwLm1lc3NhZ2Uuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdhbGVydC1kYW5nZXInLFxyXG4gICAgICAgICAgICAgICAgaHRtbDogJzxoMT5FcnJvcjwvaDE+PHA+0JrQvtC0INC+0YjQuNCx0LrQuDo8Y29kZT41MjI8L2NvZGU+PC9wPicsXHJcbiAgICAgICAgICAgICAgICB0aW1lOiA0MDAwLFxyXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiAxMDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBhcHAubWVzc2FnZS5zZW5kKHtcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2FsZXJ0LXN1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICfQktGB0LUgT0snLFxyXG4gICAgICAgICAgICAgICAgY29udGVudDogJ9Cj0YDQsCAhISEnLFxyXG4gICAgICAgICAgICAgICAgdGltZTogMjAwMFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgbmV3IFJvdXRlKCk7XHJcblxyXG5cclxufSgpO1xyXG5cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgYWxleCBvbiAwNi4wOC4yMDE1LlxyXG4gKi9cclxuXHJcblxyXG4vLyBQT1BPVkVSIE1FTlUgUFVCTElDIENMQVNTIERFRklOSVRJT05cclxuK2Z1bmN0aW9uICgkKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgLy8gUE9QT1ZFUiBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIHZhciBNZW51UG9wb3ZlciA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5pbml0KCdwb3BvdmVyJywgZWxlbWVudCwgb3B0aW9ucylcclxuICAgIH1cclxuXHJcbiAgICBpZiAoISQuZm4ucG9wb3ZlcikgdGhyb3cgbmV3IEVycm9yKCdQb3BvdmVyIHJlcXVpcmVzIHBvcG92ZXIuanMnKVxyXG5cclxuICAgIE1lbnVQb3BvdmVyLlZFUlNJT04gPSAnMy4zLjUnXHJcblxyXG4gICAgTWVudVBvcG92ZXIuREVGQVVMVFMgPSAkLmV4dGVuZCh7fSwgJC5mbi5wb3BvdmVyLkNvbnN0cnVjdG9yLkRFRkFVTFRTLCB7XHJcbiAgICAgICAgaHRtbDogdHJ1ZSxcclxuICAgICAgICBhbmltYXRpb246IGZhbHNlLFxyXG4gICAgICAgIHBsYWNlbWVudDogJ2JvdHRvbScsXHJcbiAgICAgICAgdHJpZ2dlcjogJ21hbnVhbCcsXHJcbiAgICAgICAgY29udGFpbmVyOiAnYm9keScsXHJcbiAgICAgICAgY29udGVudDogJycsXHJcbiAgICAgICAgdGVtcGxhdGU6ICQoJyN0ZW1wLW1lbnUtcG9wb3ZlcicpLmh0bWwoKSB8fCAnPGRpdiBjbGFzcz1cInBvcG92ZXJcIiByb2xlPVwidG9vbHRpcFwiPjxkaXYgY2xhc3M9XCJhcnJvd1wiPjwvZGl2PjxidXR0b24gY2xhc3M9XCJjbG9zZVwiIHR5cGU9XCJidXR0b25cIiBzdHlsZT1cIm1hcmdpbi1yaWdodDo1cHg7XCI+w5c8L2J1dHRvbj48aDMgY2xhc3M9XCJwb3BvdmVyLXRpdGxlXCI+PC9oMz48ZGl2IGNsYXNzPVwicG9wb3Zlci1jb250ZW50XCI+PC9kaXY+PC9kaXY+JyxcclxuICAgICAgICB2aWV3cG9ydDoge1xyXG4gICAgICAgICAgICBzZWxlY3RvcjogJ2JvZHknLFxyXG4gICAgICAgICAgICBwYWRkaW5nOiA1XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcblxyXG4gICAgLy8gTk9URTogUE9QT1ZFUiBFWFRFTkRTIHRvb2x0aXAuanNcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgTWVudVBvcG92ZXIucHJvdG90eXBlID0gJC5leHRlbmQoe30sICQuZm4ucG9wb3Zlci5Db25zdHJ1Y3Rvci5wcm90b3R5cGUpXHJcblxyXG4gICAgTWVudVBvcG92ZXIucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTWVudVBvcG92ZXJcclxuXHJcbiAgICBNZW51UG9wb3Zlci5wcm90b3R5cGUudGlwID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy4kdGlwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJHRpcCA9ICQodGhpcy5vcHRpb25zLnRlbXBsYXRlKVxyXG4gICAgICAgICAgICB0aGlzLiR0aXAub24oJ2NsaWNrJywnYnV0dG9uLmNsb3NlJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy4kdGlwLmxlbmd0aCAhPSAxKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IodGhpcy50eXBlICsgJyBgdGVtcGxhdGVgIG9wdGlvbiBtdXN0IGNvbnNpc3Qgb2YgZXhhY3RseSAxIHRvcC1sZXZlbCBlbGVtZW50IScpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJHRpcFxyXG4gICAgfTtcclxuXHJcbiAgICBNZW51UG9wb3Zlci5wcm90b3R5cGUuZ2V0RGVmYXVsdHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIE1lbnVQb3BvdmVyLkRFRkFVTFRTO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC90LUg0LzQtdC90Y/QtdC8INGC0LjRgtC70LUg0L3QsCB0aGlzLiRlbGVtZW50XHJcbiAgICBNZW51UG9wb3Zlci5wcm90b3R5cGUuZml4VGl0bGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy92YXIgJGUgPSB0aGlzLiRlbGVtZW50XHJcbiAgICAgICAgLy9pZiAoJGUuYXR0cigndGl0bGUnKSB8fCB0eXBlb2YgJGUuYXR0cignZGF0YS1vcmlnaW5hbC10aXRsZScpICE9ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgLy8gICAgJGUuYXR0cignZGF0YS1vcmlnaW5hbC10aXRsZScsICRlLmF0dHIoJ3RpdGxlJykgfHwgJycpLmF0dHIoJ3RpdGxlJywgJycpXHJcbiAgICAgICAgLy99XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L/QtdGA0LXQvNC10YnQtdC90LjQtSDQvNC10L3RjiDQv9GA0Lgg0LjQt9C80LXQvdC10L3QuNC4INC/0L7Qt9C40YbQuNC4IHRoaXMuJGVsZW1lbnRcclxuICAgIE1lbnVQb3BvdmVyLnByb3RvdHlwZS5tb3ZlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIHBsYWNlbWVudCA9J3RvcCc7XHJcbiAgICAgICAgdmFyICR0aXAgPSB0aGlzLiR0aXBcclxuICAgICAgICAgICAgLmRldGFjaCgpXHJcbiAgICAgICAgICAgIC5jc3Moe3RvcDogMCwgbGVmdDogMCwgZGlzcGxheTogJ2Jsb2NrJ30pXHJcbiAgICAgICAgICAgIC5hZGRDbGFzcyhwbGFjZW1lbnQpXHJcbiAgICAgICAgICAgIC5kYXRhKCdicy4nICsgdGhpcy50eXBlLCB0aGlzKVxyXG4gICAgICAgIC8vZGVidWdnZXI7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmNvbnRhaW5lciA/ICR0aXAuYXBwZW5kVG8odGhpcy5vcHRpb25zLmNvbnRhaW5lcikgOiAkdGlwLmluc2VydEFmdGVyKHRoaXMuJGVsZW1lbnQpXHJcbiAgICAgICAgLy90aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2luc2VydGVkLmJzLicgKyB0aGlzLnR5cGUpXHJcblxyXG4gICAgICAgIHZhciBwb3MgPSB0aGlzLmdldFBvc2l0aW9uKClcclxuICAgICAgICB2YXIgYWN0dWFsV2lkdGggPSAkdGlwWzBdLm9mZnNldFdpZHRoXHJcbiAgICAgICAgdmFyIGFjdHVhbEhlaWdodCA9ICR0aXBbMF0ub2Zmc2V0SGVpZ2h0XHJcblxyXG4gICAgICAgIGlmICh0cnVlKSB7XHJcbiAgICAgICAgICAgIHZhciBvcmdQbGFjZW1lbnQgPSBwbGFjZW1lbnRcclxuICAgICAgICAgICAgdmFyIHZpZXdwb3J0RGltID0gdGhpcy5nZXRQb3NpdGlvbih0aGlzLiR2aWV3cG9ydClcclxuXHJcbiAgICAgICAgICAgIHBsYWNlbWVudCA9IHBsYWNlbWVudCA9PSAnYm90dG9tJyAmJiBwb3MuYm90dG9tICsgYWN0dWFsSGVpZ2h0ID4gdmlld3BvcnREaW0uYm90dG9tID8gJ3RvcCcgOlxyXG4gICAgICAgICAgICAgICAgcGxhY2VtZW50ID09ICd0b3AnICYmIHBvcy50b3AgLSBhY3R1YWxIZWlnaHQgPCB2aWV3cG9ydERpbS50b3AgPyAnYm90dG9tJyA6XHJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2VtZW50ID09ICdyaWdodCcgJiYgcG9zLnJpZ2h0ICsgYWN0dWFsV2lkdGggPiB2aWV3cG9ydERpbS53aWR0aCA/ICdsZWZ0JyA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudCA9PSAnbGVmdCcgJiYgcG9zLmxlZnQgLSBhY3R1YWxXaWR0aCA8IHZpZXdwb3J0RGltLmxlZnQgPyAncmlnaHQnIDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlbWVudFxyXG5cclxuICAgICAgICAgICAgJHRpcFxyXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKG9yZ1BsYWNlbWVudClcclxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhwbGFjZW1lbnQpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgY2FsY3VsYXRlZE9mZnNldCA9IHRoaXMuZ2V0Q2FsY3VsYXRlZE9mZnNldChwbGFjZW1lbnQsIHBvcywgYWN0dWFsV2lkdGgsIGFjdHVhbEhlaWdodClcclxuXHJcbiAgICAgICAgdGhpcy5hcHBseVBsYWNlbWVudChjYWxjdWxhdGVkT2Zmc2V0LCBwbGFjZW1lbnQpXHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG4gICAgLy8gUE9QT1ZFUiBQTFVHSU4gREVGSU5JVElPTlxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGZ1bmN0aW9uIFBsdWdpbihvcHRpb24pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKVxyXG4gICAgICAgICAgICB2YXIgZGF0YSA9ICR0aGlzLmRhdGEoJ2JzLnBvcG92ZXInKVxyXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXHJcblxyXG4gICAgICAgICAgICBpZiAoIWRhdGEgJiYgL2Rlc3Ryb3l8aGlkZS8udGVzdChvcHRpb24pKSByZXR1cm5cclxuICAgICAgICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdicy5wb3BvdmVyJywgKGRhdGEgPSBuZXcgTWVudVBvcG92ZXIodGhpcywgb3B0aW9ucykpKVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHZhciBvbGQgPSAkLmZuLnBvcG92ZXJcclxuXHJcbiAgICAkLmZuLm1lbnVQb3BvdmVyID0gUGx1Z2luXHJcbiAgICAkLmZuLm1lbnVQb3BvdmVyLkNvbnN0cnVjdG9yID0gTWVudVBvcG92ZXJcclxuXHJcblxyXG4gICAgLy8gUE9QT1ZFUiBOTyBDT05GTElDVFxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICQuZm4ubWVudVBvcG92ZXIubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkLmZuLm1lbnVQb3BvdmVyID0gb2xkXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbn0oalF1ZXJ5KTtcclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkg0JDQu9C10LrRgdCw0L3QtNGAIG9uIDA4LjA4LjIwMTUuXHJcbiAqINCg0LDRgdGI0LjRgNC10L3QuNGPINCx0LjQsdC70LjQvtGC0LXQuiDQstC10L3QtNC+0YDQvtCyXHJcbiAqL1xyXG5cclxucmVxdWlyZSgnLi9ib290c3RyYXAuZXh0LmpzJyk7XHJcbnJlcXVpcmUoJy4vdW5kZXJzY29yZS5leHQuanMnKTtcclxucmVxdWlyZSgnLi9sZWFmbGV0LmV4dC5qcycpO1xyXG5yZXF1aXJlKCcuL3ZhbGlkYXRpb24uZXh0LmpzJyk7XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5INCQ0LvQtdC60YHQsNC90LTRgCBvbiAwOC4wOC4yMDE1LlxyXG4gKi9cclxuXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuTC5JY29uLkRlZmF1bHQuaW1hZ2VQYXRoID0gJy4vaW1hZ2VzJztcclxuLy8gINCg0LDRgdGI0LjRgNC10L3QuNC1INC00LvRjyDQutC+0L3RgtC+0YDQvtC70LAg0L/QviDRhtC10L3RgtGA0YNcclxuTC5NYXAuaW5jbHVkZSh7XHJcbiAgICBfaW5pdENvbnRyb2xQb3M6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgY29ybmVycyA9IHRoaXMuX2NvbnRyb2xDb3JuZXJzID0ge30sXHJcbiAgICAgICAgICAgIGwgPSAnbGVhZmxldC0nLFxyXG4gICAgICAgICAgICBjb250YWluZXIgPSB0aGlzLl9jb250cm9sQ29udGFpbmVyID0gTC5Eb21VdGlsLmNyZWF0ZSgnZGl2JywgbCArICdjb250cm9sLWNvbnRhaW5lcicsIHRoaXMuX2NvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUNvcm5lcih2U2lkZSwgaFNpZGUpIHtcclxuICAgICAgICAgICAgdmFyIGNsYXNzTmFtZSA9IGwgKyB2U2lkZSArICcgJyArIGwgKyBoU2lkZTtcclxuXHJcbiAgICAgICAgICAgIGNvcm5lcnNbdlNpZGUgKyBoU2lkZV0gPSBMLkRvbVV0aWwuY3JlYXRlKCdkaXYnLCBjbGFzc05hbWUsIGNvbnRhaW5lcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjcmVhdGVDb3JuZXIoJ3RvcCcsICdjZW50ZXInKTsgLy8gY29udHJvbCBpbiBjZW50ZXIgIC0g0L/QvtGB0YLQsNCy0LjRgtGMINC/0LXRgNCy0YvQvCDQsCDRgtC+INC/0YDQvtCx0LvQtdC80Ysg0YEgSUU5XHJcbiAgICAgICAgY3JlYXRlQ29ybmVyKCd0b3AnLCAnbGVmdCcpO1xyXG4gICAgICAgIGNyZWF0ZUNvcm5lcigndG9wJywgJ3JpZ2h0Jyk7XHJcbiAgICAgICAgY3JlYXRlQ29ybmVyKCdib3R0b20nLCAnbGVmdCcpO1xyXG4gICAgICAgIGNyZWF0ZUNvcm5lcignYm90dG9tJywgJ3JpZ2h0Jyk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuLy8gUG9pbnRcclxuTC5Qb2ludC5wcm90b3R5cGUuZGl2aXNpb24gPSBmdW5jdGlvbiAocG9pbnQsIGspIHtcclxuICAgIHZhciBkID0gLWsgLyAoayAtIDEpO1xyXG4gICAgdmFyIHggPSAodGhpcy54ICsgZCAqIHBvaW50LngpIC8gKDEgKyBkKSxcclxuICAgICAgICB5ID0gKHRoaXMueSArIGQgKiBwb2ludC55KSAvICgxICsgZCk7XHJcbiAgICByZXR1cm4gTC5wb2ludCh4LCB5KTtcclxufTtcclxuXHJcbkwuUG9pbnQucHJvdG90eXBlLm1pZGRsZSA9IGZ1bmN0aW9uIChwb2ludCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZGl2aXNpb24ocG9pbnQsIDIpXHJcbn07XHJcblxyXG5MLlBvaW50LnByb3RvdHlwZS50b0xhdExuZyA9IGZ1bmN0aW9uIChtYXApIHtcclxuICAgIHJldHVybiBtYXAudW5wcm9qZWN0KHRoaXMpO1xyXG59O1xyXG5cclxuLy9MYXRMbmdcclxuTC5MYXRMbmcucHJvdG90eXBlLnRvUG9pbnQgPSBmdW5jdGlvbiAobWFwKSB7XHJcbiAgICByZXR1cm4gbWFwLnByb2plY3QodGhpcyk7XHJcbn07XHJcbkwuTGF0TG5nLnByb3RvdHlwZS5hbmdsZSA9IGZ1bmN0aW9uIChsYXRMbmcsIG1hcCkge1xyXG4gICAgdmFyIGEgPSBtYXAucHJvamVjdCh0aGlzKSxcclxuICAgICAgICBiID0gbWFwLnByb2plY3QobGF0TG5nKTtcclxuICAgIHZhciBhbmdsZSA9IChNYXRoLmF0YW4yKGEueSAtIGIueSwgYS54IC0gYi54KSAqIDE4MCAvIE1hdGguUEkpO1xyXG4gICAgcmV0dXJuIChhbmdsZSArIDI3MCkgJSAzNjA7XHJcbn07XHJcbkwuTGF0TG5nLnByb3RvdHlwZS5taWRkbGUgPSBmdW5jdGlvbiAobGF0TG5nLCBtYXApIHtcclxuICAgIHZhciBwMSA9IG1hcC5wcm9qZWN0KHRoaXMpLFxyXG4gICAgICAgIHAyID0gbWFwLnByb2plY3QobGF0TG5nKTtcclxuICAgIHJldHVybiBtYXAudW5wcm9qZWN0KHAxLl9hZGQocDIpLl9kaXZpZGVCeSgyKSk7XHJcbn07XHJcblxyXG4vLyBMZWFmbGV0IHZpZXdzIGZvciB1c2UgbW9kZWwgJiBjb2xsZWN0aW9uIEJhY2tib25lXHJcblxyXG5MLk1hcmtlck1vZGVsID0gTC5NYXJrZXIuZXh0ZW5kKHtcclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChtb2RlbCwgb3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcclxuICAgICAgICBMLk1hcmtlck1vZGVsLl9fc3VwZXJfXy5pbml0aWFsaXplLmNhbGwodGhpcywgbW9kZWwuZ2V0KCdsYXRsbmcnKSwgb3B0aW9ucyk7XHJcbiAgICB9LFxyXG4gICAgdmlzaWJsZTogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5faWNvbiAmJiAkKHRoaXMuX2ljb24pLnRvZ2dsZSh2YWx1ZSk7XHJcbiAgICB9XHJcbn0pO1xyXG5MLm1hcmtlck1vZGVsID0gZnVuY3Rpb24gKG1vZGVsLCBvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gbmV3IEwuTWFya2VyTW9kZWwobW9kZWwsIG9wdGlvbnMpO1xyXG59O1xyXG5cclxuTC5MYXllck1vZGVsID0gTC5MYXllckdyb3VwLmV4dGVuZCh7XHJcbiAgICBvcHRpb25zOiB7fSxcclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChtb2RlbCwgb3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcclxuICAgICAgICBMLkxheWVyQ29sbGVjdGlvbi5fX3N1cGVyX18uaW5pdGlhbGl6ZS5jYWxsKHRoaXMsW10sIG9wdGlvbnMpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbkwuTGF5ZXJDb2xsZWN0aW9uID0gTC5MYXllckdyb3VwLmV4dGVuZCh7XHJcbiAgICBvcHRpb25zOiB7fSxcclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uID0gY29sbGVjdGlvbjtcclxuICAgICAgICBMLkxheWVyQ29sbGVjdGlvbi5fX3N1cGVyX18uaW5pdGlhbGl6ZS5jYWxsKHRoaXMsW10sIG9wdGlvbnMpO1xyXG4gICAgfVxyXG59KTtcclxuTC5sYXllckNvbGxlY3Rpb24gPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgb3B0aW9ucykge1xyXG4gICAgcmV0dXJuIG5ldyBMLkxheWVyQ29sbGVjdGlvbihjb2xsZWN0aW9uLCBvcHRpb25zKTtcclxufTtcclxuXHJcbkwuQ2FudmFzVGlsZXMgPSAgTC5UaWxlTGF5ZXIuQ2FudmFzLmV4dGVuZCh7XHJcblxyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKHVzZXJEcmF3RnVuYywgb3B0aW9ucyxjYWxsQ29udGV4dCkge1xyXG4gICAgICAgIHRoaXMuX3VzZXJEcmF3RnVuYyA9IHVzZXJEcmF3RnVuYztcclxuICAgICAgICB0aGlzLl9jYWxsQ29udGV4dCA9IGNhbGxDb250ZXh0O1xyXG4gICAgICAgIEwuc2V0T3B0aW9ucyh0aGlzLCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuZHJhd1RpbGUgPSBmdW5jdGlvbiAodGlsZUNhbnZhcywgdGlsZVBvaW50LCB6b29tKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9kcmF3KHRpbGVDYW52YXMsIHRpbGVQb2ludCwgem9vbSk7XHJcbiAgICAgICAgICAgIGlmIChzZWxmLm9wdGlvbnMuZGVidWcpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuX2RyYXdEZWJ1Z0luZm8odGlsZUNhbnZhcywgdGlsZVBvaW50LCB6b29tKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSxcclxuXHJcbiAgICBkcmF3aW5nOiBmdW5jdGlvbiAodXNlckRyYXdGdW5jKSB7XHJcbiAgICAgICAgdGhpcy5fdXNlckRyYXdGdW5jID0gdXNlckRyYXdGdW5jO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSxcclxuXHJcbiAgICBwYXJhbXM6IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgTC5zZXRPcHRpb25zKHRoaXMsIG9wdGlvbnMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSxcclxuXHJcbiAgICBhZGRUbzogZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgIG1hcC5hZGRMYXllcih0aGlzKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcblxyXG4gICAgX2RyYXdEZWJ1Z0luZm86IGZ1bmN0aW9uICh0aWxlQ2FudmFzLCB0aWxlUG9pbnQsIHpvb20pIHtcclxuXHJcbiAgICAgICAgdmFyIG1heCA9IHRoaXMub3B0aW9ucy50aWxlU2l6ZTtcclxuICAgICAgICB2YXIgZyA9IHRpbGVDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICBnLmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdkZXN0aW5hdGlvbi1vdmVyJztcclxuICAgICAgICBnLnN0cm9rZVN0eWxlID0gJyNGRkZGRkYnO1xyXG4gICAgICAgIGcuZmlsbFN0eWxlID0gJyNGRkZGRkYnO1xyXG4gICAgICAgIGcuc3Ryb2tlUmVjdCgwLCAwLCBtYXgsIG1heCk7XHJcbiAgICAgICAgZy5mb250ID0gXCIxMnB4IEFyaWFsXCI7XHJcbiAgICAgICAgZy5maWxsUmVjdCgwLCAwLCA1LCA1KTtcclxuICAgICAgICBnLmZpbGxSZWN0KDAsIG1heCAtIDUsIDUsIDUpO1xyXG4gICAgICAgIGcuZmlsbFJlY3QobWF4IC0gNSwgMCwgNSwgNSk7XHJcbiAgICAgICAgZy5maWxsUmVjdChtYXggLSA1LCBtYXggLSA1LCA1LCA1KTtcclxuICAgICAgICBnLmZpbGxSZWN0KG1heCAvIDIgLSA1LCBtYXggLyAyIC0gNSwgMTAsIDEwKTtcclxuICAgICAgICBnLnN0cm9rZVRleHQodGlsZVBvaW50LnggKyAnICcgKyB0aWxlUG9pbnQueSArICcgJyArIHpvb20sIG1heCAvIDIgLSAzMCwgbWF4IC8gMiAtIDEwKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVHJhbnNmb3JtcyBjb29yZGluYXRlcyB0byB0aWxlIHNwYWNlXHJcbiAgICAgKi9cclxuICAgIHRpbGVQb2ludDogZnVuY3Rpb24gKG1hcCwgY29vcmRzLHRpbGVQb2ludCwgdGlsZVNpemUpIHtcclxuICAgICAgICAvLyBzdGFydCBjb29yZHMgdG8gdGlsZSAnc3BhY2UnXHJcbiAgICAgICAgdmFyIHMgPSB0aWxlUG9pbnQubXVsdGlwbHlCeSh0aWxlU2l6ZSk7XHJcblxyXG4gICAgICAgIC8vIGFjdHVhbCBjb29yZHMgdG8gdGlsZSAnc3BhY2UnXHJcbiAgICAgICAgdmFyIHAgPSBtYXAucHJvamVjdChuZXcgTC5MYXRMbmcoY29vcmRzWzBdLCBjb29yZHNbMV0pKTtcclxuXHJcbiAgICAgICAgLy8gcG9pbnQgdG8gZHJhd1xyXG4gICAgICAgIHZhciB4ID0gTWF0aC5yb3VuZChwLnggLSBzLngpO1xyXG4gICAgICAgIHZhciB5ID0gTWF0aC5yb3VuZChwLnkgLSBzLnkpO1xyXG4gICAgICAgIHJldHVybiB7eDogeCxcclxuICAgICAgICAgICAgeTogeX07XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgcXVlcnkgZm9yIHRoZSBxdWFkdHJlZSBmcm9tIGJvdW5kc1xyXG4gICAgICovXHJcbiAgICBfYm91bmRzVG9RdWVyeTogZnVuY3Rpb24gKGJvdW5kcykge1xyXG4gICAgICAgIGlmIChib3VuZHMuZ2V0U291dGhXZXN0KCkgPT0gdW5kZWZpbmVkKSB7IHJldHVybiB7IHg6IDAsIHk6IDAsIHdpZHRoOiAwLjEsIGhlaWdodDogMC4xIH07IH0gIC8vIGZvciBlbXB0eSBkYXRhIHNldHNcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB4OiBib3VuZHMuZ2V0U291dGhXZXN0KCkubG5nLFxyXG4gICAgICAgICAgICB5OiBib3VuZHMuZ2V0U291dGhXZXN0KCkubGF0LFxyXG4gICAgICAgICAgICB3aWR0aDogYm91bmRzLmdldE5vcnRoRWFzdCgpLmxuZyAtIGJvdW5kcy5nZXRTb3V0aFdlc3QoKS5sbmcsXHJcbiAgICAgICAgICAgIGhlaWdodDogYm91bmRzLmdldE5vcnRoRWFzdCgpLmxhdCAtIGJvdW5kcy5nZXRTb3V0aFdlc3QoKS5sYXRcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuXHJcbiAgICBfZHJhdzogZnVuY3Rpb24gKHRpbGVDYW52YXMsIHRpbGVQb2ludCwgem9vbSkge1xyXG5cclxuICAgICAgICB2YXIgdGlsZVNpemUgPSB0aGlzLm9wdGlvbnMudGlsZVNpemU7XHJcblxyXG4gICAgICAgIHZhciBud1BvaW50ID0gdGlsZVBvaW50Lm11bHRpcGx5QnkodGlsZVNpemUpO1xyXG4gICAgICAgIHZhciBzZVBvaW50ID0gbndQb2ludC5hZGQobmV3IEwuUG9pbnQodGlsZVNpemUsIHRpbGVTaXplKSk7XHJcblxyXG5cclxuICAgICAgICAvLyBwYWRkaW5nIHRvIGRyYXcgcG9pbnRzIHRoYXQgb3ZlcmxhcCB3aXRoIHRoaXMgdGlsZSBidXQgdGhlaXIgY2VudGVyIGlzIGluIG90aGVyIHRpbGVcclxuICAgICAgICB2YXIgcGFkID0gbmV3IEwuUG9pbnQodGhpcy5vcHRpb25zLnBhZGRpbmcsIHRoaXMub3B0aW9ucy5wYWRkaW5nKTtcclxuXHJcbiAgICAgICAgbndQb2ludCA9IG53UG9pbnQuc3VidHJhY3QocGFkKTtcclxuICAgICAgICBzZVBvaW50ID0gc2VQb2ludC5hZGQocGFkKTtcclxuXHJcbiAgICAgICAgdmFyIGJvdW5kcyA9IG5ldyBMLkxhdExuZ0JvdW5kcyh0aGlzLl9tYXAudW5wcm9qZWN0KHNlUG9pbnQpLCB0aGlzLl9tYXAudW5wcm9qZWN0KG53UG9pbnQpKTtcclxuICAgICAgICB2YXIgem9vbVNjYWxlICA9IDEgLyAoKDQwMDc1MDE2LjY4IC8gdGlsZVNpemUpIC8gTWF0aC5wb3coMiwgem9vbSkpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUudGltZSgncHJvY2VzcycpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fdXNlckRyYXdGdW5jKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VzZXJEcmF3RnVuYy5jYWxsKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbENvbnRleHQsXHJcbiAgICAgICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbnZhczogdGlsZUNhbnZhcyxcclxuICAgICAgICAgICAgICAgICAgICB0aWxlUG9pbnQ6IHRpbGVQb2ludCxcclxuICAgICAgICAgICAgICAgICAgICBib3VuZHM6IGJvdW5kcyxcclxuICAgICAgICAgICAgICAgICAgICBzaXplOiB0aWxlU2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICB6b29tU2NhbGU6IHpvb21TY2FsZSxcclxuICAgICAgICAgICAgICAgICAgICB6b29tOiB6b29tLFxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHRoaXMub3B0aW9ucyxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAvLyBjb25zb2xlLnRpbWVFbmQoJ3Byb2Nlc3MnKTtcclxuXHJcblxyXG4gICAgfVxyXG5cclxuXHJcbn0pO1xyXG5cclxuTC5jYW52YXNUaWxlcyA9IGZ1bmN0aW9uICh1c2VyRHJhd0Z1bmMsIG9wdGlvbnMsIGNhbGxDb250ZXh0KSB7XHJcbiAgICByZXR1cm4gbmV3IEwuQ2FudmFzVGlsZXModXNlckRyYXdGdW5jLCBvcHRpb25zLCBjYWxsQ29udGV4dCk7XHJcbn07XHJcblxyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBhbGV4IG9uIDA2LjA4LjIwMTUuXHJcbiAqL1xyXG5cclxuXHJcbl8udGVtcGxhdGVTZXR0aW5ncyA9IHtcclxuICAgIGV2YWx1YXRlICAgIDogL1xce1xceyhbXFxzXFxTXSs/KVxcfVxcfS9nLFxyXG4gICAgaW50ZXJwb2xhdGUgOiAvXFx7XFx7PShbXFxzXFxTXSs/KVxcfVxcfS9nLFxyXG4gICAgZXNjYXBlICAgICAgOiAvXFx7XFx7LShbXFxzXFxTXSs/KVxcfVxcfS9nXHJcbn07XHJcblxyXG5fLmRlZmVyQ29udGV4dCA9ZnVuY3Rpb24oZnVuYywgY29udGV4dCl7XHJcbiAgICByZXR1cm4gXy5kZWZlcihmdW5jLmJpbmQoY29udGV4dCkpO1xyXG59OyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IO+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/vSBvbiAxMy4wOS4yMDE1LlxyXG4gKi9cclxuXHJcbl8uZXh0ZW5kKEJhY2tib25lLlZhbGlkYXRpb24uY2FsbGJhY2tzLCB7XHJcbiAgICB2YWxpZDogZnVuY3Rpb24gKHZpZXcsIGF0dHIsIHNlbGVjdG9yKSB7XHJcbiAgICAgICAgdmFyIGNvbnRyb2wsIGdyb3VwO1xyXG5cclxuICAgICAgICBjb250cm9sID0gdmlldy4kKCdbJyArIHNlbGVjdG9yICsgJz0nICsgYXR0ciArICddJylcclxuICAgICAgICBncm91cCA9IGNvbnRyb2wucGFyZW50cygnLmZvcm0tZ3JvdXAnKVxyXG4gICAgICAgIGdyb3VwLnJlbW92ZUNsYXNzKCdoYXMtZXJyb3InKVxyXG5cclxuICAgICAgICBpZiAoY29udHJvbC5kYXRhKCdlcnJvci1zdHlsZScpID09ICd0b29sdGlwJykge1xyXG4gICAgICAgICAgICAvLyBDQVVUSU9OOiBjYWxsaW5nIHRvb2x0aXAoJ2hpZGUnKSBvbiBhbiB1bmluaXRpYWxpemVkIHRvb2x0aXBcclxuICAgICAgICAgICAgLy8gY2F1c2VzIGJvb3RzdHJhcHMgdG9vbHRpcHMgdG8gY3Jhc2ggc29tZWhvdy4uLlxyXG4gICAgICAgICAgICBjb250cm9sLnRvb2x0aXAoJ2hpZGUnKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY29udHJvbC5kYXRhKCd0b29sdGlwJykpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoY29udHJvbC5kYXRhKCdlcnJvci1zdHlsZScpID09ICdpbmxpbmUnKSB7XHJcbiAgICAgICAgICAgIGdyb3VwLmZpbmQoJy5oZWxwLWlubGluZS5lcnJvci1tZXNzYWdlJykucmVtb3ZlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZ3JvdXAuZmluZCgnLmhlbHAtYmxvY2suZXJyb3ItbWVzc2FnZScpLnJlbW92ZSgpXHJcbiAgICAgICAgICAgIGNvbnRyb2wgPSB2aWV3LiQoJ1snICsgc2VsZWN0b3IgKyAnPScgKyBhdHRyICsgJ10nKTtcclxuICAgICAgICAgICAgZ3JvdXAgPSBjb250cm9sLnBhcmVudHMoXCIuY29udHJvbC1ncm91cFwiKTtcclxuICAgICAgICAgICAgZ3JvdXAucmVtb3ZlQ2xhc3MoXCJlcnJvclwiKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgaW52YWxpZDogZnVuY3Rpb24gKHZpZXcsIGF0dHIsIGVycm9yLCBzZWxlY3Rvcikge1xyXG4gICAgICAgIHZhciBjb250cm9sLCBncm91cCwgcG9zaXRpb24sIHRhcmdldDtcclxuXHJcbiAgICAgICAgY29udHJvbCA9IHZpZXcuJCgnWycgKyBzZWxlY3RvciArICc9JyArIGF0dHIgKyAnXScpO1xyXG4gICAgICAgIGdyb3VwID0gY29udHJvbC5wYXJlbnRzKCcuZm9ybS1ncm91cCcpO1xyXG4gICAgICAgIGdyb3VwLmFkZENsYXNzKCdoYXMtZXJyb3InKTtcclxuXHJcbiAgICAgICAgaWYgKGNvbnRyb2wuZGF0YSgnZXJyb3Itc3R5bGUnKSA9PSAndG9vbHRpcCcpIHtcclxuICAgICAgICAgICAgcG9zaXRpb24gPSBjb250cm9sLmRhdGEoJ3Rvb2x0aXAtcG9zaXRpb24nKSB8fCAncmlnaHQnO1xyXG4gICAgICAgICAgICBjb250cm9sLnRvb2x0aXAoe1xyXG4gICAgICAgICAgICAgICAgcGxhY2VtZW50OiBwb3NpdGlvbixcclxuICAgICAgICAgICAgICAgIHRyaWdnZXI6ICdtYW51YWwnLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6IGVycm9yXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjb250cm9sLnRvb2x0aXAoJ3Nob3cnKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRyb2wuZGF0YSgnZXJyb3Itc3R5bGUnKSA9PSAnaW5saW5lJykge1xyXG4gICAgICAgICAgICBpZiAoZ3JvdXAuZmluZCgnLmhlbHAtaW5saW5lJykubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIGdyb3VwLmZpbmQoJy5mb3JtLWNvbnRyb2wnKS5hZnRlcignPHNwYW4gY2xhc3M9XFwnaGVscC1pbmxpbmUgZXJyb3ItbWVzc2FnZVxcJz48L3NwYW4+JylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0YXJnZXQgPSBncm91cC5maW5kKCcuaGVscC1pbmxpbmUnKTtcclxuICAgICAgICAgICAgdGFyZ2V0LnRleHQoZXJyb3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChncm91cC5maW5kKCcuaGVscC1ibG9jaycpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBncm91cC5maW5kKCcuZm9ybS1jb250cm9sJykuYWZ0ZXIoJzxwIGNsYXNzPVxcJ2hlbHAtYmxvY2sgZXJyb3ItbWVzc2FnZVxcJz48L3A+JylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0YXJnZXQgPSBncm91cC5maW5kKCcuaGVscC1ibG9jaycpXHJcbiAgICAgICAgICAgIHRhcmdldC50ZXh0KGVycm9yKVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbn0pO1xyXG5cclxuXy5leHRlbmQoQmFja2JvbmUuVmFsaWRhdGlvbi52YWxpZGF0b3JzLCB7XHJcbiAgICAvLyDvv73vv73vv73vv73vv73vv73vv73vv73vv70g77+977+977+977+977+977+977+977+9IO+/ve+/vSDvv73vv73vv73vv73vv73vv73vv71cclxuICAgIHJlbW90ZTogZnVuY3Rpb24gKHZhbHVlLCBhdHRyLCBjdXN0b21WYWx1ZSwgbW9kZWwsIHN0YXRlKSB7XHJcbiAgICAgICAgdmFyIGVyciA9IHN0YXRlW21vZGVsLnJlbW90ZUZpZWxkXTtcclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgIGlmIChjdXN0b21WYWx1ZS5mbilcclxuICAgICAgICAgICAgICAgIHJldHVybiBjdXN0b21WYWx1ZS5mbihlcnIsIG1vZGVsLCBzdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWN1c3RvbVZhbHVlLnN0YXR1cylcclxuICAgICAgICAgICAgICAgIHJldHVybiBlcnIuc3RhdHVzVGV4dDtcclxuXHJcbiAgICAgICAgICAgIGlmIChlcnIuc3RhdHVzID09PSBjdXN0b21WYWx1ZS5zdGF0dXMpXHJcbiAgICAgICAgICAgICAgICBjdXN0b21WYWx1ZS5tZXM7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICByZW1vdGVFcnI0MDA6IGZ1bmN0aW9uICh2YWx1ZSwgYXR0ciwgY3VzdG9tVmFsdWUsIG1vZGVsLCBzdGF0ZSkge1xyXG4gICAgICAgIHZhciBlcnIgPSBzdGF0ZVttb2RlbC5yZW1vdGVGaWVsZF07XHJcbiAgICAgICAgaWYgKGVyciAmJiBlcnIuc3RhdHVzID09PSA0MDApXHJcbiAgICAgICAgICAgIHJldHVybiAgY3VzdG9tVmFsdWUubWVzIHx8IGVyci5yZXNwb25zZUpTT04uZXJyb3JzW2F0dHJdO1xyXG4gICAgfVxyXG5cclxufSk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgYWxleCBvbiAxMC4wOC4yMDE1LlxyXG4gKi9cclxuXHJcbi8vdmFyIGV2ZW50cyA9IHJlcXVpcmUoJy4uLy4uL2NvcmUvZXZlbnRzJykuY2hhbm5lbCgnc2NyZWVuJyk7XHJcblxyXG5cclxudmFyIFZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XHJcbiAgICBlbDogJCgnI3RlbXAtZm9vdGVyJykuaHRtbCgpLFxyXG4gICAgaGVpZ2h0OiAzMCxcclxuICAgIG1heEhlaWdodDogNTAsXHJcbiAgICBtaW5IZWlnaHQ6IDIwLFxyXG4gICAgd2luSGVpZ2h0OiAkKHdpbmRvdykuaGVpZ2h0KCksXHJcblxyXG4gICAgZXZlbnRzOiB7XHJcbiAgICAgICAgJ2NsaWNrIGJ1dHRvbi5jbG9zZSc6ICdvbkNsb3NlJyxcclxuICAgICAgICAnbW91c2Vkb3duIGRpdi5tYXAtZm9vdGVyLXJlc2l6ZS12ZXJ0aWNhbCc6ICdvbk1vdXNlZG93bidcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICBvcHRpb25zLmtleVByZXNzICYmICQoZG9jdW1lbnQpLmtleWRvd24ob3B0aW9ucy5rZXlQcmVzcywgdGhpcy5vbktleXByZXNzLmJpbmQodGhpcykpO1xyXG4gICAgICAgIG9wdGlvbnMuY29udGVudCAmJiB0aGlzLiRlbC5hcHBlbmQob3B0aW9ucy5jb250ZW50KTtcclxuICAgICAgICBvcHRpb25zLmhlaWdodCAmJiAodGhpcy5oZWlnaHQgPSBvcHRpb25zLmhlaWdodCk7XHJcbiAgICAgICAgb3B0aW9ucy5taW5IZWlnaHQgJiYgKHRoaXMubWluSGVpZ2h0ID0gb3B0aW9ucy5taW5IZWlnaHQpO1xyXG4gICAgICAgIG9wdGlvbnMubWF4SGVpZ2h0ICYmICh0aGlzLm1heEhlaWdodCA9IG9wdGlvbnMubWF4SGVpZ2h0KTtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xyXG5cclxuICAgICAgICAvL2V2ZW50cy5vbigncmVzaXplOmVuZCcsIHRoaXMub25SZXNpemUsIHRoaXMpO1xyXG4gICAgICAgIC8vdGhpcy5vbignb3BlbicsIHRoaXMub25PcGVuLCB0aGlzKTtcclxuICAgIH0sXHJcblxyXG4gICAgaXNEb206IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gISF0aGlzLiRlbC5wYXJlbnQoKS5sZW5ndGg7XHJcbiAgICB9LFxyXG4gICAgc2l6ZUhlaWdodDogZnVuY3Rpb24gKHkpIHtcclxuICAgICAgICB2YXIgaCA9IDEwMCAtICh5IC8gdGhpcy53aW5IZWlnaHQgKiAxMDApIHwgMDtcclxuICAgICAgICBpZiAoaCA8IHRoaXMubWF4SGVpZ2h0ICYmIGggPiB0aGlzLm1pbkhlaWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9IGg7XHJcbiAgICAgICAgICAgIHRoaXMuJGVsLmNzcyh7aGVpZ2h0OiB0aGlzLmhlaWdodCArICclJ30pO1xyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3Jlc2l6ZScsIHRoaXMuaGVpZ2h0LCB0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgY2xvc2U6IGZ1bmN0aW9uIChpc05vdEV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy4kZWwuY3NzKHtoZWlnaHQ6IDB9KS5kZXRhY2goKTtcclxuICAgICAgICAhaXNOb3RFdmVudCAmJiB0aGlzLnRyaWdnZXIoJ2Nsb3NlJywgMCwgdGhpcyk7XHJcbiAgICB9LFxyXG4gICAgb3BlbjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuJGVsXHJcbiAgICAgICAgICAgIC5jc3Moe2hlaWdodDogdGhpcy5oZWlnaHQgKyAnJSd9KVxyXG4gICAgICAgICAgICAuYXBwZW5kVG8oJ2JvZHknKTtcclxuICAgICAgICB0aGlzLnRyaWdnZXIoJ29wZW4nLCB0aGlzLmhlaWdodCwgdGhpcyk7XHJcbiAgICB9LFxyXG5cclxuICAgIG9uS2V5cHJlc3M6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgaWYgKGUuYWx0S2V5ICYmIGUud2hpY2ggPT0gZS5kYXRhLmNoYXJDb2RlQXQoKSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0RvbSgpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgb25DbG9zZTogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICB9LFxyXG4gICAgb25PcGVuOiBmdW5jdGlvbiAoaCwgdGhhdCkge1xyXG4gICAgICAgIC8vINC10YHQu9C4INC+0YLQutGA0YvQu9GB0Y8g0LTRgNGD0LPQvtC5INGE0YPRgtC10YAg0YLQviDQt9Cw0LrRgNGL0YLRjCDRjdGC0L7RglxyXG4gICAgICAgIHRoaXMuaXNEb20oKSAmJiB0aGF0ICE9PSB0aGlzICYmIHRoaXMuY2xvc2UodHJ1ZSk7XHJcbiAgICB9LFxyXG4gICAgb25SZXNpemU6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy53aW5IZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIG9uTW91c2Vkb3duOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdtb3VzZW1vdmUuJyArIHRoaXMuY2lkLCB0aGlzLm9uTW91c2Vtb3ZlLmJpbmQodGhpcykpO1xyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uZSgnbW91c2V1cC4nICsgdGhpcy5jaWQsIHRoaXMub25Nb3VzZXVwLmJpbmQodGhpcykpO1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIH0sXHJcbiAgICBvbk1vdXNldXA6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgJChkb2N1bWVudCkub2ZmKCdtb3VzZW1vdmUuJyArIHRoaXMuY2lkKTsgLy8g0YPQsdC40YDQsNC10Lwg0YHQvtCx0YvRgtC40LUg0L/RgNC4INC/0LXRgNC10LzQtdGJ0LXQvdC40Lgg0LzRi9GI0LhcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9LFxyXG4gICAgb25Nb3VzZW1vdmU6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdmFyIHkgPSBlLnBhZ2VZO1xyXG4gICAgICAgIHkgJiYgdGhpcy5zaXplSGVpZ2h0KHkpO1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7XHJcblxyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBhbGV4IG9uIDA3LjA4LjIwMTUuXHJcbiAqL1xyXG5cclxucmVxdWlyZSgnLi9leHRlbmQnKTtcclxucmVxdWlyZSgnLi9wbHVnaW5zJyk7XHJcblxyXG5cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgYWxleCBvbiAyOC4wOC4yMDE1LlxyXG4gKi9cclxuXHJcbnZhciBDb2xsZWN0aW9uID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xyXG4gICAgdXJsIDpudWxsLFxyXG4gICAgbW9kZWw6IHJlcXVpcmUoJy4vbW9kZWwnKSxcclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy50eXBlID0gb3B0aW9ucy50eXBlO1xyXG4gICAgfSxcclxuXHJcbiAgICBpc0ZpbHRlcjogZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICBpc1JlYWR5OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVhZHkgJiYgdGhpcy5yZWFkeS5zdGF0ZSgpID09PSAncmVzb2x2ZWQnO1xyXG4gICAgfSxcclxuICAgIGZpbmRCb3VuZHM6IGZ1bmN0aW9uIChib3VuZHMsIGlzRmlsdGVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyKGZ1bmN0aW9uIChtb2RlbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gKGlzRmlsdGVyIHx8IHRoaXMuaXNGaWx0ZXIpKG1vZGVsKSAmJiBtb2RlbC5pc0JvdW5kcyhib3VuZHMpO1xyXG4gICAgICAgIH0sIHRoaXMpO1xyXG4gICAgfSxcclxuICAgIGxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZWFkeSA9IHRoaXMuZmV0Y2goKTtcclxuICAgIH1cclxuIH0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb2xsZWN0aW9uO1xyXG5cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgYWxleCBvbiAwMy4wOS4yMDE1LlxyXG4gKiDQmtC70LDRgdGB0Ysg0LTQu9GPINC80LDQvdC40L/Rg9C70LjRgNC+0LLQsNC90LjRjyBsYXllcnMg0L3QsCDQutCw0YDRgtC1XHJcbiAqINC30LDQs9GA0YPQt9C60LAg0Lgg0L7RgtC+0LHRgNCw0LbQtdC90LjQtSDQsiDQs9GA0LDQvdC40YbQsNGFINGN0LrRgNCw0L3QsFxyXG4gKi9cclxuXHJcbnZhciBMYXllcnMgPSBMLkxheWVyR3JvdXAuZXh0ZW5kKHtcclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICh2aWV3cykge1xyXG4gICAgICAgIExheWVycy5fX3N1cGVyX18uaW5pdGlhbGl6ZS5jYWxsKHRoaXMsIFtdKTtcclxuICAgICAgICB0aGlzLnR5cGVzID0ge307XHJcbiAgICAgICAgW10uY29uY2F0KHZpZXdzKS5mb3JFYWNoKHRoaXMuYWRkVHlwZXMsIHRoaXMpO1xyXG4gICAgfSxcclxuICAgIG9uQWN0aXZlOiBmdW5jdGlvbiAodHlwZXMpIHtcclxuICAgICAgICBmb3IodmFyIHR5cGUgaW4gdHlwZXMpXHJcbiAgICAgICAgICAgIHRoaXMudHlwZXNbdHlwZV0gJiYgdGhpcy5fdG9nZ2xlTGF5ZXIodGhpcy50eXBlc1t0eXBlXSwgdHlwZXNbdHlwZV0pO1xyXG4gICAgfSxcclxuICAgIGFkZFR5cGVzOiBmdW5jdGlvbiAobGF5ZXIpIHtcclxuICAgICAgICB0aGlzLnR5cGVzW2xheWVyLmdldFR5cGUoKV0gPSBsYXllcjtcclxuICAgIH0sXHJcblxyXG4gICAgX3RvZ2dsZUxheWVyOiBmdW5jdGlvbiAobGF5ZXIsIHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICFsYXllci5fbWFwICYmIHRoaXMuYWRkTGF5ZXIobGF5ZXIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxheWVyLl9tYXAgJiYgdGhpcy5yZW1vdmVMYXllcihsYXllcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cz0gTGF5ZXJzOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGFsZXggb24gMzEuMDguMjAxNS5cclxuICovXHJcblxyXG52YXIgTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xyXG4gICAgY29vcmROYW1lOiAncG9zaXRpb24nLFxyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgIE1vZGVsLl9fc3VwZXJfXy5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICB9LFxyXG4gICAgaXNCb3VuZHM6IGZ1bmN0aW9uIChib3VuZHMpIHtcclxuICAgICAgICB0aHJvdyBFcnJvcign0L/QtdGA0LXQvtC/0YDQtdC00LXQu9C40YLQtSAg0LzQtdGC0L7QtCcpO1xyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IE5CUDEwMDA4MyBvbiAyNi4wOC4yMDE1LlxyXG4gKi9cclxuXHJcbnZhciBWaWV3ID0gTC5MYXllckdyb3VwLmV4dGVuZCh7XHJcbiAgICBfZGVidWc6IGZhbHNlLFxyXG4gICAgb3B0aW9uczoge1xyXG4gICAgICAgIGxheWVyOiB7fVxyXG4gICAgfSxcclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBvcHRpb25zKSB7XHJcbiAgICAgICAgVmlldy5fX3N1cGVyX18uaW5pdGlhbGl6ZS5jYWxsKHRoaXMsIFtdKTtcclxuICAgICAgICBMLlV0aWwuc2V0T3B0aW9ucyh0aGlzLCBvcHRpb25zKTtcclxuICAgICAgICB0aGlzLmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uO1xyXG5cclxuICAgIH0sXHJcbiAgICBvbkFkZDogZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgIFZpZXcuX19zdXBlcl9fLm9uQWRkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tYXAub24oJ21vdmVlbmQnLCB0aGlzLm9uUmVmcmVzaCwgdGhpcyk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29sbGVjdGlvbi5pc1JlYWR5KCkpXHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmNvbGxlY3Rpb24ubG9hZCgpLmRvbmUodGhpcy5vblJlZnJlc2guYmluZCh0aGlzKSk7XHJcblxyXG4gICAgfSxcclxuICAgIG9uUmVtb3ZlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5fbWFwLm9mZignbW92ZWVuZCcsIHRoaXMub25SZWZyZXNoLCB0aGlzKTtcclxuICAgICAgICB0aGlzLmVhY2hMYXllcih0aGlzLnJlbW92ZUxheWVyLCB0aGlzKTtcclxuICAgICAgICBWaWV3Ll9fc3VwZXJfXy5vblJlbW92ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgfSxcclxuICAgIG9uUmVmcmVzaDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY29sbGVjdGlvbi5pc1JlYWR5KCkgJiYgdGhpcy5yZW5kZXIoKTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYodGhpcy5fZGVidWcpIHtcclxuICAgICAgICAgICAgY29uc29sZS5ncm91cCh0aGlzLmNvbGxlY3Rpb24udHlwZSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSgndGltZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGJvdW5kcyA9IHRoaXMuX21hcC5nZXRCb3VuZHMoKTtcclxuICAgICAgICB0aGlzLl9hZGRMYXllcnNJbkJvdW5kcyhib3VuZHMpXHJcbiAgICAgICAgICAgIC5fcmVtb3ZlTGF5ZXJzT3V0Qm91bmRzKGJvdW5kcyk7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuX2RlYnVnKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgndGltZScpXHJcbiAgICAgICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgY3JlYXRlOiBmdW5jdGlvbiAoaXRlbSkge1xyXG5cclxuICAgIH0sXHJcbiAgICBnZXRUeXBlOiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24udHlwZTtcclxuICAgIH0sXHJcblxyXG4gICAgX3JlbW92ZUxheWVyc091dEJvdW5kczogZnVuY3Rpb24gKGJvdW5kcykge1xyXG4gICAgICAgIC8vINGD0LTQsNC70LjRgtGMINCy0YHQtSBsYXllcnMg0LfQsCDQv9GA0LXQtNC10LvQsNC80Lgg0Y3QutGA0LDQvdCwXHJcbiAgICAgICAgdmFyIGxpc3QgPSB0aGlzLmdldExheWVycygpXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gIWxheWVyLm1vZGVsLmlzQm91bmRzKGJvdW5kcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGxpc3QuZm9yRWFjaCh0aGlzLnJlbW92ZUxheWVyLCB0aGlzKTtcclxuICAgICAgICB0aGlzLl9kZWJ1ZyAmJiBjb25zb2xlLmxvZygnUmVtb3ZlOiAlcy4gVG90YWw6ICVzJywgbGlzdC5sZW5ndGgsIHRoaXMuZ2V0TGF5ZXJzKCkubGVuZ3RoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcbiAgICBfYWRkTGF5ZXJzSW5Cb3VuZHM6IGZ1bmN0aW9uIChib3VuZHMpIHtcclxuICAgICAgICAvLyDQtNC+0LHQsNCy0LjRgtGMINCy0YHQtSBsYXllcnMg0LrQvtGC0L7RgNGL0YUg0LXRidC1INC90LXRgiDQvdCwINGN0LrRgNCw0L3QtS5cclxuXHJcbiAgICAgICAgdmFyIGxpc3QgPSB0aGlzLmNvbGxlY3Rpb24uZmluZEJvdW5kcyhib3VuZHMpO1xyXG5cclxuICAgICAgICBsaXN0ID0gbGlzdC5maWx0ZXIoZnVuY3Rpb24gKG1vZGVsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAhdGhpcy5fZ2V0TGF5ZXJzTW9kZWwoKS5zb21lKGZ1bmN0aW9uIChtb2RlbExheWVyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9kZWxMYXllci5pZCA9PT0gbW9kZWwuaWQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sIHRoaXMpO1xyXG5cclxuICAgICAgICBsaXN0LmZvckVhY2godGhpcy5jcmVhdGUsIHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLl9kZWJ1ZyAmJiBjb25zb2xlLmxvZygnQWRkOiAlcycsIGxpc3QubGVuZ3RoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcbiAgICBfZ2V0TGF5ZXJzTW9kZWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRMYXllcnMoKS5tYXAoZnVuY3Rpb24gKGxheWVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsYXllci5tb2RlbDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmlldzsiLCIvKipcclxuICogQ3JlYXRlZCBieSBhbGV4IG9uIDE0LjA5LjIwMTUuXHJcbiAqL1xyXG5cclxudmFyIE1hc2sgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XHJcbiAgICBjbGFzc01hc2s6ICdtYXAtbG9hZGluZy1tYXNrJyxcclxuICAgIHRlbXBNZXNzYWdlOiAkKCcjdGVtcC1tYXNrLW1lc3NhZ2UnKS5odG1sKCksXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgfSxcclxuICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5fc2V0TWFzayh0cnVlKTtcclxuICAgIH0sXHJcbiAgICBlbmQ6IGZ1bmN0aW9uICh0aW1lLCBjYWxsYmFjaywgY29udGV4dCkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLl9zZXRNYXNrKGZhbHNlKTtcclxuICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2suY2FsbChjb250ZXh0KTtcclxuICAgICAgICB9LmJpbmQodGhpcyksIHRpbWUgfHwgMCk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBfc2V0TWFzazogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy4kZWwudG9nZ2xlQ2xhc3ModGhpcy5jbGFzc01hc2ssIHZhbHVlKTtcclxuICAgICAgICB0aGlzLiRlbC5maW5kKCdpbnB1dCcpLnByb3AoXCJkaXNhYmxlZFwiLCB2YWx1ZSk7XHJcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnYnV0dG9uJykucHJvcChcImRpc2FibGVkXCIsIHZhbHVlKTtcclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgIHRoaXMuJGVsLnBhcmVudCgpLmFwcGVuZCh0aGlzLnRlbXBNZXNzYWdlKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuJGVsLnBhcmVudCgpLmZpbmQoJy5tYXAtbG9hZGluZy1tYXNrLW1lc3NhZ2UnKS5yZW1vdmUoKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hc2s7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgYWxleCBvbiAzMC4wNy4yMDE1LlxyXG4gKi9cclxuXHJcblxyXG52YXIgQnV0dG9uID0gTC5Db250cm9sLmV4dGVuZCh7XHJcbiAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgaGlkZTogZmFsc2UsXHJcbiAgICAgICAgcG9zaXRpb246ICd0b3BsZWZ0JyxcclxuICAgICAgICBjbGFzc05hbWU6ICdtYXAtbWVudS1idXR0b24nXHJcbiAgICB9LFxyXG4gICAgaW5jbHVkZXM6IEwuTWl4aW4uRXZlbnRzLFxyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICBMLkNvbnRyb2wucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICB0aGlzLmlkID0gb3B0aW9ucy5pZDtcclxuICAgICAgICB0aGlzLl9jcmVhdGUodGhpcy5vcHRpb25zKTtcclxuICAgIH0sXHJcblxyXG4gICAgb25BZGQ6IGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICBzZXRUaW1lb3V0KHRoaXMuX2NlbnRlclZlcnRpY2FsLmJpbmQodGhpcyksIDApO1xyXG4gICAgICAgIHRoaXMuZmlyZSgnYWRkJywge21hcDogbWFwfSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZWw7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldFZpc2libGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuJGVsLnRvZ2dsZSh2YWx1ZSk7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmhpZGUgPSF2YWx1ZTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcbiAgICBpc1Zpc2libGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiRlbC5pcygnOnZpc2libGUnKTtcclxuICAgIH0sXHJcblxyXG4gICAgb25DbGljazogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAvLyDQutC70LjQuiDQvdCwINC60L3QvtC90LrRg1xyXG4gICAgICAgIHRoaXMuZmlyZSgnY2xpY2snLCBlKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIF9jcmVhdGU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgdmFyIGVsID0gdGhpcy5lbCA9IEwuRG9tVXRpbC5jcmVhdGUoJ2RpdicsIG9wdGlvbnMuY2xhc3NOYW1lKTtcclxuXHJcbiAgICAgICAgdmFyIHN0b3AgPSBMLkRvbUV2ZW50LnN0b3BQcm9wYWdhdGlvbjtcclxuICAgICAgICBMLkRvbUV2ZW50XHJcbiAgICAgICAgICAgIC5vbihlbCwgJ2NvbnRleHRtZW51Jywgc3RvcClcclxuICAgICAgICAgICAgLm9uKGVsLCAnY29udGV4dG1lbnUnLCBMLkRvbUV2ZW50LnByZXZlbnREZWZhdWx0KVxyXG4gICAgICAgICAgICAub24oZWwsICdjbGljaycsIHN0b3ApXHJcbiAgICAgICAgICAgIC5vbihlbCwgJ21vdXNlZG93bicsIHN0b3ApXHJcbiAgICAgICAgICAgIC5vbihlbCwgJ2RibGNsaWNrJywgc3RvcClcclxuICAgICAgICAgICAgLm9uKGVsLCAnY2xpY2snLCBMLkRvbUV2ZW50LnByZXZlbnREZWZhdWx0KVxyXG4gICAgICAgICAgICAub24oZWwsICdjbGljaycsIHRoaXMub25DbGljaywgdGhpcylcclxuICAgICAgICAgICAgLm9uKGVsLCAnY2xpY2snLCB0aGlzLl9yZWZvY3VzT25NYXAsIHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpLmF0dHIoe1xyXG4gICAgICAgICAgICBpZDogb3B0aW9ucy5pZCxcclxuICAgICAgICAgICAgdGl0bGU6IG9wdGlvbnMudGl0bGVcclxuICAgICAgICB9KTtcclxuICAgICAgICBvcHRpb25zLmljb24gJiYgdGhpcy4kZWwuYXBwZW5kKG9wdGlvbnMuaWNvbik7XHJcbiAgICAgICAgcmV0dXJuIGVsO1xyXG4gICAgfSxcclxuICAgIF9jZW50ZXJWZXJ0aWNhbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciAkaWNvbiA9IHRoaXMuJGVsLmZpbmQoJy5tYXAtbWVudS1idXR0b24taWNvbicpO1xyXG4gICAgICAgIGlmICgkaWNvbi5sZW5ndGgpXHJcbiAgICAgICAgICAgICRpY29uLmNzcyh7XHJcbiAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6ICh0aGlzLiRlbC5oZWlnaHQoKSAtICRpY29uLmhlaWdodCgpKSAvIDJcclxuICAgICAgICAgICAgfSlcclxuICAgIH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJ1dHRvbjtcclxuXHJcblxyXG5cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgYWxleCBvbiAzMC4wNy4yMDE1LlxyXG4gKiAg0JrQu9Cw0YHRgdGLINCz0LvQsNC90L7Qs9C+INC80LXQvdGOIC0g0LrQvdC+0L/QutC4INCyINCy0LXRgNGF0L3QtdC5INGH0LDRgdGC0Lgg0LrQsNGA0YLRi1xyXG4gKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgQnV0dG9uOiByZXF1aXJlKCcuL2J1dHRvbicpLFxyXG4gICAgUG9wb3ZlcjogcmVxdWlyZSgnLi9wb3BvdmVyJyksXHJcbiAgICBNZW51OiByZXF1aXJlKCcuL21lbnUnKSxcclxuICAgIE1hbmFnZXI6ICByZXF1aXJlKCcuL21hbmFnZXInKVxyXG59O1xyXG5cclxuXHJcblxyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBhbGV4IG9uIDMwLjA3LjIwMTUuXHJcbiAqICDQmtC70LDRgdGB0Ysg0LPQu9Cw0L3QvtCz0L4g0LzQtdC90Y4gLSDQutC90L7Qv9C60Lgg0LIg0LLQtdGA0YXQvdC10Lkg0YfQsNGB0YLQuCDQutCw0YDRgtGLXHJcbiAqL1xyXG52YXIgTWVudSA9IHJlcXVpcmUoJy4vbWVudScpO1xyXG5cclxudmFyIE1hbmFnZXIgPSBMLkNsYXNzLmV4dGVuZCh7XHJcbiAgICBtZW51QWN0aXZlOiBudWxsLFxyXG4gICAgaW5jbHVkZXM6IEwuTWl4aW4uRXZlbnRzLFxyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG1lbnVzLCBvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5tZW51cyA9IFtdO1xyXG4gICAgfSxcclxuICAgIGFkZDogZnVuY3Rpb24gKG1lbnVzKSB7XHJcbiAgICAgICAgdGhpcy5tZW51cyA9IHRoaXMubWVudXMuY29uY2F0KFtdLmNvbmNhdChtZW51cykubWFwKHRoaXMuX2NyZWF0ZU1lbnUsIHRoaXMpKTtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0OiBmdW5jdGlvbihpZCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZpbmRNZW51KGlkKTtcclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICB0aGlzLm1lbnVzLmZvckVhY2goZnVuY3Rpb24gKG1lbnUpIHtcclxuICAgICAgICAgICAgbWVudS5idXR0b24uYWRkVG8obWFwKTtcclxuICAgICAgICAgICAgbWVudS5idXR0b24ub3B0aW9ucy5oaWRlICYmIG1lbnUuYnV0dG9uLnNldFZpc2libGUoIW1lbnUuYnV0dG9uLm9wdGlvbnMuaGlkZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgc2V0VmlzaWJsZTogZnVuY3Rpb24gKGlkLCB2YWx1ZSkge1xyXG4gICAgICAgIHZhciBtZW51ID0gaWQgaW5zdGFuY2VvZiBNZW51ID8gaWQgOiB0aGlzLl9maW5kTWVudShpZCk7XHJcbiAgICAgICAgaWYgKG1lbnUpIHtcclxuICAgICAgICAgICAgIXZhbHVlICYmIG1lbnUuc2V0QWN0aXZlKHZhbHVlKTtcclxuICAgICAgICAgICAgbWVudS5idXR0b24uc2V0VmlzaWJsZSh2YWx1ZSlcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2V0QWN0aXZlOiBmdW5jdGlvbiAoaWQsIHZhbHVlKSB7XHJcbiAgICAgICAgdmFyIG1lbnUgPSBpZCBpbnN0YW5jZW9mIE1lbnUgPyBpZCA6IHRoaXMuX2ZpbmRNZW51KGlkKTtcclxuICAgICAgICBtZW51ICYmIG1lbnUuc2V0QWN0aXZlKHZhbHVlKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcbiAgICBvbkFjdGl2ZTogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBpZiAoZS5zdGF0dXMpIHtcclxuICAgICAgICAgICAgdGhpcy5tZW51QWN0aXZlICYmIHRoaXMubWVudUFjdGl2ZS5zZXRBY3RpdmUoZmFsc2UpO1xyXG4gICAgICAgICAgICB0aGlzLm1lbnVBY3RpdmUgPSBlLnRhcmdldDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tZW51QWN0aXZlID09PSBlLnRhcmdldClcclxuICAgICAgICAgICAgICAgIHRoaXMubWVudUFjdGl2ZSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfZmluZE1lbnU6IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIHJldHVybiBfLmZpbmRXaGVyZSh0aGlzLm1lbnVzLCB7aWQ6IGlkfSk7XHJcbiAgICB9LFxyXG4gICAgX2NyZWF0ZU1lbnU6IGZ1bmN0aW9uIChfbWVudSkge1xyXG4gICAgICAgIHZhciBtZW51ID0gbWVudSBpbnN0YW5jZW9mIE1lbnUgPyBtZW51IDogbmV3IE1lbnUoX21lbnUpO1xyXG4gICAgICAgIG1lbnUub24oJ2FjdGl2ZScsIHRoaXMub25BY3RpdmUsIHRoaXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gbWVudTtcclxuXHJcbiAgICB9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNYW5hZ2VyO1xyXG5cclxuXHJcblxyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSDQkNC70LXQutGB0LDQvdC00YAgb24gMDkuMDguMjAxNS5cclxuICog0KHQvtC00LXQvtC20LjRgiDQsiDRgdC10LHQtSDRgdCy0Y/Qt9C60YMg0LrQvdC+0L/QutCwINC4INC/0L7Qv9C+0LLQtdGAXHJcbiAqL1xyXG52YXIgZXZlbnRzID0gYXBwLmV2ZW50cyxcclxuICAgIEJ1dHRvbiA9IHJlcXVpcmUoJy4vYnV0dG9uJyksXHJcbiAgICBQb3BvdmVyID0gcmVxdWlyZSgnLi9wb3BvdmVyJyk7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMLkNsYXNzLmV4dGVuZCh7XHJcbiAgICBpbmNsdWRlczogTC5NaXhpbi5FdmVudHMsXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMuaWQ9IG9wdGlvbnMuaWQsXHJcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYnV0dG9uID0gbmV3IEJ1dHRvbihfLm9taXQob3B0aW9ucywgJ3BvcG92ZXInKSk7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMucG9wb3Zlcikge1xyXG4gICAgICAgICAgICB0aGlzLnBvcG92ZXIgPSBuZXcgUG9wb3Zlcih0aGlzLmJ1dHRvbi5lbCwgb3B0aW9ucy5wb3BvdmVyKVxyXG4gICAgICAgICAgICAgICAgLm9uKCdvcGVuJywgdGhpcy5vbk9wZW4sIHRoaXMpXHJcbiAgICAgICAgICAgICAgICAub24oJ2Nsb3NlJywgdGhpcy5vbkNsb3NlLCB0aGlzKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5idXR0b25cclxuICAgICAgICAgICAgLm9uKCdhZGQnLCB0aGlzLm9uQWRkLCB0aGlzKVxyXG4gICAgICAgICAgICAub24oJ2NsaWNrJywgdGhpcy5vbkNsaWNrLCB0aGlzKTtcclxuICAgIH0sXHJcbiAgICBvbk9wZW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmlzQWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmZpcmUoJ2FjdGl2ZScsIHtzdGF0dXM6IHRydWV9KTtcclxuICAgIH0sXHJcbiAgICBvbkNsb3NlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZmlyZSgnYWN0aXZlJywge3N0YXR1czogZmFsc2V9KTtcclxuICAgIH0sXHJcbiAgICBvbkNsaWNrOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHRoaXMuc2V0QWN0aXZlKCk7XHJcbiAgICB9LFxyXG4gICAgb25BZGQ6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdGhpcy5wb3BvdmVyLl9tYXAgPSBlLm1hcDtcclxuICAgICAgICB0aGlzLnBvcG92ZXIuX21vdmVyKCk7XHJcbiAgICB9LFxyXG4gICAgc2V0QWN0aXZlOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICB2YXIgaXNBY3RpdmUgPSB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gIXRoaXMuaXNBY3RpdmUgOiB2YWx1ZTtcclxuICAgICAgICBpZiAodGhpcy5wb3BvdmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMucG9wb3Zlcltpc0FjdGl2ZSA/ICdzaG93JyA6ICdoaWRlJ10oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy9zZXRWaXNpYmxlOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgIC8vICAgIHRoaXMuJGVsLnRvZ2dsZSh2YWx1ZSk7XHJcbiAgICAvLyAgICBldmVudHMuY2hhbm5lbCgnbWVudScpLnRyaWdnZXIoJ3Zpc2libGUnLCB7XHJcbiAgICAvLyAgICAgICAgYnV0dG9uOiB0aGlzLFxyXG4gICAgLy8gICAgICAgIHZpc2libGU6IHZhbHVlXHJcbiAgICAvLyAgICB9KTtcclxuICAgIC8vICAgIHJldHVybiB0aGlzO1xyXG4gICAgLy99LFxyXG4gICAgLy9pc1Zpc2libGU6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgLy8gICAgcmV0dXJuIHRoaXMuJGVsLmlzKCc6dmlzaWJsZScpO1xyXG4gICAgLy99LFxyXG5cclxuXHJcbn0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGFsZXggb24gMzAuMDcuMjAxNS5cclxuICovXHJcblxyXG52YXIgc2NyZWVuRXZlbnRzID0gYXBwLmV2ZW50cy5jaGFubmVsKCdzY3JlZW4nKTtcclxuXHJcbnZhciBQb3BvdmVyID0gTC5DbGFzcy5leHRlbmQoe1xyXG4gICAgb3B0aW9uczoge1xyXG4gICAgICAgIGNvbnRlbnQ6ICd0ZXN0J1xyXG4gICAgfSxcclxuICAgIGluY2x1ZGVzOiBMLk1peGluLkV2ZW50cyxcclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICh0YXJnZXQsIG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLnRhcmdldCA9IHRhcmdldDtcclxuICAgICAgICB0aGlzLiR0YXJnZXQgPSAkKHRhcmdldCk7XHJcbiAgICAgICAgTC5VdGlsLnNldE9wdGlvbnModGhpcywgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMudmlldylcclxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmNvbnRlbnQgPSB0aGlzLm9wdGlvbnMudmlldy5lbDtcclxuXHJcbiAgICAgICAgdGhpcy5fY3JlYXRlKHRoaXMub3B0aW9ucyk7XHJcbiAgICAgICAgLy90aGlzLl9tb3Zlcih0cnVlKTtcclxuICAgIH0sXHJcblxyXG4gICAgaXNPcGVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuICEhdGhpcy4kdGFyZ2V0LmF0dHIoJ2FyaWEtZGVzY3JpYmVkYnknKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2hvdzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuJHRhcmdldC5wb3BvdmVyKCdzaG93Jyk7XHJcbiAgICB9LFxyXG4gICAgaGlkZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuJHRhcmdldC5wb3BvdmVyKCdoaWRlJyk7XHJcbiAgICB9LFxyXG4gICAgdG9nZ2xlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy4kdGFyZ2V0LnBvcG92ZXIoJ3RvZ2dsZScpO1xyXG4gICAgfSxcclxuXHJcbiAgICBfY3JlYXRlOiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMuX3BvcG92ZXIgPSB0aGlzLiR0YXJnZXQubWVudVBvcG92ZXIob3B0aW9ucylcclxuICAgICAgICAgICAgLm9uKCdzaG93LmJzLnBvcG92ZXIgaGlkZS5icy5wb3BvdmVyJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyZShlLnR5cGUgPT09ICdzaG93JyA/ICdvcGVuJyA6ICdjbG9zZScpO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcykpXHJcbiAgICAgICAgICAgIC5kYXRhKCdicy5wb3BvdmVyJyk7XHJcbiAgICB9LFxyXG4gICAgX21vdmVyOiBmdW5jdGlvbiAoaXNNb3Zlcikge1xyXG4gICAgICAgIHRoaXMuX21hcC5vbigncmVzaXplJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgdGhpcy5pc09wZW4oKSAmJiB0aGlzLl9wb3BvdmVyLm1vdmVyKCk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuICAgICAgICAvL2lmIChpc01vdmVyKSB7XHJcbiAgICAgICAgLy8gICAgdGhpcy5fbWFwLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIC8vICAgICAgICB0aGlzLmlzT3BlbigpICYmIHRoaXMuX3BvcG92ZXIubW92ZXIoKTtcclxuICAgICAgICAvLyAgICB9LmJpbmQodGhpcykpO1xyXG4gICAgICAgIC8vfSBlbHNlIHtcclxuICAgICAgICAvLyAgICB0aGlzLl9tYXAuLm9uKCdyZXNpemU6c3RhcnQnLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIC8vICAgICAgICBpZiAodGhpcy5pc09wZW4oKSkge1xyXG4gICAgICAgIC8vICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgLy8gICAgICAgICAgICBzY3JlZW5FdmVudHMub25jZSgncmVzaXplOmVuZCcsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICAgICAgLy8gICAgICAgICAgICB9LCB0aGlzKTtcclxuICAgICAgICAvLyAgICAgICAgfVxyXG4gICAgICAgIC8vICAgIH0sIHRoaXMpO1xyXG4gICAgICAgIC8vfVxyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBvcG92ZXI7XHJcblxyXG5cclxuXHJcbiIsIlxyXG5cclxuTC5Db250cm9sLkxvY2F0ZSA9IEwuQ29udHJvbC5leHRlbmQoe1xyXG4gICAgb3B0aW9uczoge1xyXG4gICAgICAgIHBvc2l0aW9uOiAnYm90dG9tbGVmdCcsXHJcbiAgICAgICAgY2xhc3NOYW1lOiAnbWFwLWxvY2F0ZSdcclxuICAgIH0sXHJcbiAgICBpbmNsdWRlczogTC5NaXhpbi5FdmVudHMsXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIEwuQ29udHJvbC5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgfSxcclxuXHJcbiAgICBvbkFkZDogZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgIHRoaXMuX21hcCA9IG1hcDtcclxuICAgICAgICB2YXIgZWwgPSB0aGlzLmVsID0gTC5Eb21VdGlsLmNyZWF0ZSgnZGl2JywgdGhpcy5vcHRpb25zLmNsYXNzTmFtZSk7XHJcblxyXG4gICAgICAgIHZhciBzdG9wID0gTC5Eb21FdmVudC5zdG9wUHJvcGFnYXRpb247XHJcbiAgICAgICAgTC5Eb21FdmVudFxyXG4gICAgICAgICAgICAub24oZWwsICdjb250ZXh0bWVudScsIHN0b3ApXHJcbiAgICAgICAgICAgIC5vbihlbCwgJ2NvbnRleHRtZW51JywgTC5Eb21FdmVudC5wcmV2ZW50RGVmYXVsdClcclxuICAgICAgICAgICAgLm9uKGVsLCAnY2xpY2snLCBzdG9wKVxyXG4gICAgICAgICAgICAub24oZWwsICdtb3VzZWRvd24nLCBzdG9wKVxyXG4gICAgICAgICAgICAub24oZWwsICdkYmxjbGljaycsIHN0b3ApXHJcbiAgICAgICAgICAgIC5vbihlbCwgJ2NsaWNrJywgTC5Eb21FdmVudC5wcmV2ZW50RGVmYXVsdClcclxuICAgICAgICAgICAgLm9uKGVsLCAnY2xpY2snLCB0aGlzLm9uQ2xpY2ssIHRoaXMpXHJcbiAgICAgICAgICAgIC5vbihlbCwgJ2NsaWNrJywgdGhpcy5fcmVmb2N1c09uTWFwLCB0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKS5hdHRyKHtcclxuICAgICAgICAgICAgaWQ6IHRoaXMub3B0aW9ucy5pZCxcclxuICAgICAgICAgICAgdGl0bGU6IHRoaXMub3B0aW9ucy50aXRsZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5pY29uICYmIHRoaXMuJGVsLmFwcGVuZCh0aGlzLm9wdGlvbnMuaWNvbik7XHJcbiAgICAgICAgbWFwXHJcbiAgICAgICAgICAgIC5vbihcImxvY2F0aW9uZm91bmRcIiwgdGhpcy5vbkxvY2F0aW9uRm91bmQsIHRoaXMpXHJcbiAgICAgICAgICAgIC5vbihcImxvY2F0aW9uZXJyb3JcIiwgdGhpcy5vbkxvY2F0aW9uRXJyb3IsIHRoaXMpO1xyXG4gICAgICAgIHJldHVybiBlbDtcclxuICAgIH0sXHJcbiAgICBvbkNsaWNrOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIC8vINC60LvQuNC6INC90LAg0LrQvdC+0L3QutGDXHJcbiAgICAgICAgdGhpcy5fbWFwLmxvY2F0ZSgpO1xyXG5cclxuICAgIH0sXHJcbiAgICBvbkxvY2F0aW9uRm91bmQ6ZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgdGhpcy5fbWFwLnNldFZpZXcoZS5sYXRsbmcpO1xyXG4gICAgICAgIHRoaXMuZmlyZSgnbG9jYXRpb24nLCBlKTtcclxuICAgICAgICB2YXIgbWFya2VyID0gTC5tYXJrZXIoZS5sYXRsbmcpLmFkZFRvKHRoaXMuX21hcCk7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21hcC5yZW1vdmVMYXllcihtYXJrZXIpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSwzMDAwKTtcclxuICAgIH0sXHJcbiAgICBvbkxvY2F0aW9uRXJyb3I6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuTC5jb250cm9sLmxvY2F0ZSA9IGZ1bmN0aW9uICjRidC30LXRiNGJ0YLRiykge1xyXG4gICAgcmV0dXJuIG5ldyBMLkNvbnRyb2wuTG9jYXRlKCk7XHJcbn07XHJcblxyXG5cclxuIiwiTC5Db250cm9sLk1vdXNlUG9zaXRpb24gPSBMLkNvbnRyb2wuZXh0ZW5kKHtcclxuICAgIG9wdGlvbnM6IHtcclxuICAgICAgICBwb3NpdGlvbjogJ2JvdHRvbWxlZnQnLFxyXG4gICAgICAgIHNlcGFyYXRvcjogJyA6ICcsXHJcbiAgICAgICAgZW1wdHlTdHJpbmc6ICdVbmF2YWlsYWJsZScsXHJcbiAgICAgICAgbG5nRmlyc3Q6IGZhbHNlLFxyXG4gICAgICAgIG51bURpZ2l0czogNSxcclxuICAgICAgICBsbmdGb3JtYXR0ZXI6IHVuZGVmaW5lZCxcclxuICAgICAgICBsYXRGb3JtYXR0ZXI6IHVuZGVmaW5lZCxcclxuICAgICAgICBwcmVmaXg6IFwiXCJcclxuICAgIH0sXHJcblxyXG4gICAgb25BZGQ6IGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICB2YXIgZWwgPSB0aGlzLl9jb250YWluZXIgPSBMLkRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnbGVhZmxldC1jb250cm9sLW1vdXNlcG9zaXRpb24nKTtcclxuICAgICAgICBMLkRvbUV2ZW50XHJcbiAgICAgICAgICAgIC5vbihlbCwgJ2NvbnRleHRtZW51JywgTC5Eb21FdmVudC5zdG9wUHJvcGFnYXRpb24pXHJcbiAgICAgICAgICAgIC5vbihlbCwgJ2NvbnRleHRtZW51JywgTC5Eb21FdmVudC5wcmV2ZW50RGVmYXVsdCk7XHJcblxyXG4gICAgICAgIEwuRG9tRXZlbnQuZGlzYWJsZUNsaWNrUHJvcGFnYXRpb24odGhpcy5fY29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgbWFwLm9uKCdtb3VzZW1vdmUnLCB0aGlzLl9vbk1vdXNlTW92ZSwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5lbXB0eVN0cmluZztcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29udGFpbmVyO1xyXG4gICAgfSxcclxuXHJcbiAgICBvblJlbW92ZTogZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgIG1hcC5vZmYoJ21vdXNlbW92ZScsIHRoaXMuX29uTW91c2VNb3ZlKVxyXG4gICAgfSxcclxuXHJcbiAgICBfb25Nb3VzZU1vdmU6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdmFyIGxuZyA9IHRoaXMub3B0aW9ucy5sbmdGb3JtYXR0ZXIgPyB0aGlzLm9wdGlvbnMubG5nRm9ybWF0dGVyKGUubGF0bG5nLmxuZykgOiBMLlV0aWwuZm9ybWF0TnVtKGUubGF0bG5nLmxuZywgdGhpcy5vcHRpb25zLm51bURpZ2l0cyk7XHJcbiAgICAgICAgdmFyIGxhdCA9IHRoaXMub3B0aW9ucy5sYXRGb3JtYXR0ZXIgPyB0aGlzLm9wdGlvbnMubGF0Rm9ybWF0dGVyKGUubGF0bG5nLmxhdCkgOiBMLlV0aWwuZm9ybWF0TnVtKGUubGF0bG5nLmxhdCwgdGhpcy5vcHRpb25zLm51bURpZ2l0cyk7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5vcHRpb25zLmxuZ0ZpcnN0ID8gbG5nICsgdGhpcy5vcHRpb25zLnNlcGFyYXRvciArIGxhdCA6IGxhdCArIHRoaXMub3B0aW9ucy5zZXBhcmF0b3IgKyBsbmc7XHJcbiAgICAgICAgdmFyIHByZWZpeEFuZFZhbHVlID0gdGhpcy5vcHRpb25zLnByZWZpeCArICcgJyArIHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX2NvbnRhaW5lci5pbm5lckhUTUwgPSBwcmVmaXhBbmRWYWx1ZTtcclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxuTC5NYXAubWVyZ2VPcHRpb25zKHtcclxuICAgIHBvc2l0aW9uQ29udHJvbDogZmFsc2VcclxufSk7XHJcblxyXG5MLk1hcC5hZGRJbml0SG9vayhmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zLnBvc2l0aW9uQ29udHJvbCkge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb25Db250cm9sID0gbmV3IEwuQ29udHJvbC5Nb3VzZVBvc2l0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5hZGRDb250cm9sKHRoaXMucG9zaXRpb25Db250cm9sKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5MLmNvbnRyb2wubW91c2VQb3NpdGlvbiA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gbmV3IEwuQ29udHJvbC5Nb3VzZVBvc2l0aW9uKG9wdGlvbnMpO1xyXG59O1xyXG4iLCIvLyBUaGlzIGZpbGUgaXMgcGFydCBvZiBMZWFmbGV0Lkdlb2Rlc2ljLlxyXG4vLyBDb3B5cmlnaHQgKEMpIDIwMTQgIEhlbnJ5IFRoYXNsZXJcclxuLy8gYmFzZWQgb24gY29kZSBieSBDaHJpcyBWZW5lc3MgQ29weXJpZ2h0IChDKSAyMDE0IGh0dHBzOi8vZ2l0aHViLmNvbS9jaHJpc3ZlbmVzcy9nZW9kZXN5XHJcbi8vIFxyXG4vLyBMZWFmbGV0Lkdlb2Rlc2ljIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcclxuLy8gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcclxuLy8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcclxuLy8gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cclxuLy8gXHJcbi8vIExlYWZsZXQuR2VvZGVzaWMgaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcclxuLy8gYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcclxuLy8gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxyXG4vLyBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxyXG4vLyBcclxuLy8gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcclxuLy8gYWxvbmcgd2l0aCBMZWFmbGV0Lkdlb2Rlc2ljLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxyXG5cclxuXHJcbi8qKiBFeHRlbmQgTnVtYmVyIG9iamVjdCB3aXRoIG1ldGhvZCB0byBjb252ZXJ0IG51bWVyaWMgZGVncmVlcyB0byByYWRpYW5zICovXHJcbmlmICh0eXBlb2YgTnVtYmVyLnByb3RvdHlwZS50b1JhZGlhbnMgPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIE51bWJlci5wcm90b3R5cGUudG9SYWRpYW5zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzICogTWF0aC5QSSAvIDE4MDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqIEV4dGVuZCBOdW1iZXIgb2JqZWN0IHdpdGggbWV0aG9kIHRvIGNvbnZlcnQgcmFkaWFucyB0byBudW1lcmljIChzaWduZWQpIGRlZ3JlZXMgKi9cclxuaWYgKHR5cGVvZiBOdW1iZXIucHJvdG90eXBlLnRvRGVncmVlcyA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgTnVtYmVyLnByb3RvdHlwZS50b0RlZ3JlZXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMgKiAxODAgLyBNYXRoLlBJO1xyXG4gICAgfVxyXG59XHJcblxyXG52YXIgSU5URVJTRUNUX0xORyA9IDE3OS45OTk7XHQvLyBMbmcgdXNlZCBmb3IgaW50ZXJzZWN0aW9uIGFuZCB3cmFwIGFyb3VuZCBvbiBtYXAgZWRnZXMgXHJcblxyXG5MLkdlb2Rlc2ljID0gTC5NdWx0aVBvbHlsaW5lLmV4dGVuZCh7XHJcbiAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgY29sb3I6ICdibHVlJyxcclxuICAgICAgICBzdGVwczogMTAsXHJcbiAgICAgICAgZGFzaDogMSxcclxuICAgICAgICB3cmFwOiB0cnVlXHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChsYXRsbmdzLCBvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gdGhpcy5fbWVyZ2Vfb3B0aW9ucyh0aGlzLm9wdGlvbnMsIG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuZGF0dW0gPSB7fTtcclxuICAgICAgICB0aGlzLmRhdHVtLmVsbGlwc29pZCA9IHthOiA2Mzc4MTM3LCBiOiA2MzU2NzUyLjMxNDIsIGY6IDEgLyAyOTguMjU3MjIzNTYzfTtcdCAvLyBXR1MtODRcclxuICAgICAgICBMLk11bHRpUG9seWxpbmUucHJvdG90eXBlLmluaXRpYWxpemUuY2FsbCh0aGlzLCBsYXRsbmdzLCB0aGlzLm9wdGlvbnMpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRMYXRMbmdzOiBmdW5jdGlvbiAobGF0bG5ncykge1xyXG4gICAgICAgIHRoaXMuX2xhdGxuZ3MgPSAodGhpcy5vcHRpb25zLmRhc2ggPCAxKSA/IHRoaXMuX2dlbmVyYXRlX0dlb2Rlc2ljRGFzaGVkKGxhdGxuZ3MpIDogdGhpcy5fZ2VuZXJhdGVfR2VvZGVzaWMobGF0bG5ncyk7XHJcbiAgICAgICAgTC5NdWx0aVBvbHlsaW5lLnByb3RvdHlwZS5zZXRMYXRMbmdzLmNhbGwodGhpcywgdGhpcy5fbGF0bG5ncyk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlcyBzb21lIHN0YXRpc3RpYyB2YWx1ZXMgb2YgY3VycmVudCBnZW9kZXNpYyBtdWx0aXBvbHlsaW5lXHJcbiAgICAgKiBAcmV0dXJucyAoT2JqZWN0fSBPYmplY3Qgd2l0aCBzZXZlcmFsIHByb3BlcnRpZXMgKGUuZy4gb3ZlcmFsbCBkaXN0YW5jZSlcclxuICAgICAqL1xyXG4gICAgZ2V0U3RhdHM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgb2JqID0ge1xyXG4gICAgICAgICAgICBkaXN0YW5jZTogMCxcclxuICAgICAgICAgICAgcG9pbnRzOiAwLFxyXG4gICAgICAgICAgICBwb2x5Z29uczogdGhpcy5fbGF0bG5ncy5sZW5ndGhcclxuICAgICAgICB9LCBwb2x5LCBwb2ludHM7XHJcblxyXG4gICAgICAgIGZvciAocG9seSA9IDA7IHBvbHkgPCB0aGlzLl9sYXRsbmdzLmxlbmd0aDsgcG9seSsrKSB7XHJcbiAgICAgICAgICAgIG9iai5wb2ludHMgKz0gdGhpcy5fbGF0bG5nc1twb2x5XS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGZvciAocG9pbnRzID0gMDsgcG9pbnRzIDwgKHRoaXMuX2xhdGxuZ3NbcG9seV0ubGVuZ3RoIC0gMSk7IHBvaW50cysrKSB7XHJcbiAgICAgICAgICAgICAgICBvYmouZGlzdGFuY2UgKz0gdGhpcy5fdmluY2VudHlfaW52ZXJzZSh0aGlzLl9sYXRsbmdzW3BvbHldW3BvaW50c10sIHRoaXMuX2xhdGxuZ3NbcG9seV1bcG9pbnRzICsgMV0pLmRpc3RhbmNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYmo7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIGdyZWF0IGNpcmNsZS4gUmVwbGFjZXMgYWxsIGN1cnJlbnQgbGluZXMuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY2VudGVyIC0gZ2VvZ3JhcGhpYyBwb3NpdGlvblxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1cyAtIHJhZGl1cyBvZiB0aGUgY2lyY2xlIGluIG1ldGVyc1xyXG4gICAgICovXHJcbiAgICBjcmVhdGVDaXJjbGU6IGZ1bmN0aW9uIChjZW50ZXIsIHJhZGl1cykge1xyXG4gICAgICAgIHZhciBfZ2VvID0gW10sIF9nZW9jbnQgPSAwO1xyXG4gICAgICAgIHZhciBwcmV2ID0ge2xhdDogMCwgbG5nOiAwLCBicmc6IDB9Oy8vbmV3IEwuTGF0TG5nKDAsIDApO1xyXG4gICAgICAgIHZhciBzO1xyXG5cclxuICAgICAgICBfZ2VvW19nZW9jbnRdID0gW107XHJcblxyXG4gICAgICAgIHZhciBkaXJlY3QgPSB0aGlzLl92aW5jZW50eV9kaXJlY3QoTC5sYXRMbmcoY2VudGVyKSwgMCwgcmFkaXVzLCB0aGlzLm9wdGlvbnMud3JhcCk7XHJcbiAgICAgICAgcHJldiA9IEwubGF0TG5nKGRpcmVjdC5sYXQsIGRpcmVjdC5sbmcpO1xyXG4gICAgICAgIF9nZW9bX2dlb2NudF0ucHVzaChwcmV2KTtcclxuICAgICAgICBmb3IgKHMgPSAxOyBzIDw9IHRoaXMub3B0aW9ucy5zdGVwczspIHtcclxuICAgICAgICAgICAgZGlyZWN0ID0gdGhpcy5fdmluY2VudHlfZGlyZWN0KEwubGF0TG5nKGNlbnRlciksIDM2MCAvIHRoaXMub3B0aW9ucy5zdGVwcyAqIHMsIHJhZGl1cywgdGhpcy5vcHRpb25zLndyYXApO1xyXG4gICAgICAgICAgICB2YXIgZ3AgPSBMLmxhdExuZyhkaXJlY3QubGF0LCBkaXJlY3QubG5nKTtcclxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGdwLmxuZyAtIHByZXYubG5nKSA+IDE4MCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGludmVyc2UgPSB0aGlzLl92aW5jZW50eV9pbnZlcnNlKHByZXYsIGdwKTtcclxuICAgICAgICAgICAgICAgIHZhciBzZWMgPSB0aGlzLl9pbnRlcnNlY3Rpb24ocHJldiwgaW52ZXJzZS5pbml0aWFsQmVhcmluZywge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhdDogLTg5LFxyXG4gICAgICAgICAgICAgICAgICAgIGxuZzogKChncC5sbmcgLSBwcmV2LmxuZykgPiAwKSA/IC1JTlRFUlNFQ1RfTE5HIDogSU5URVJTRUNUX0xOR1xyXG4gICAgICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VjKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2dlb1tfZ2VvY250XS5wdXNoKEwubGF0TG5nKHNlYy5sYXQsIHNlYy5sbmcpKTtcclxuICAgICAgICAgICAgICAgICAgICBfZ2VvY250Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgX2dlb1tfZ2VvY250XSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXYgPSBMLmxhdExuZyhzZWMubGF0LCAtc2VjLmxuZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgX2dlb1tfZ2VvY250XS5wdXNoKHByZXYpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2dlb2NudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIF9nZW9bX2dlb2NudF0gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBfZ2VvW19nZW9jbnRdLnB1c2goZ3ApO1xyXG4gICAgICAgICAgICAgICAgICAgIHByZXYgPSBncDtcclxuICAgICAgICAgICAgICAgICAgICBzKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBfZ2VvW19nZW9jbnRdLnB1c2goZ3ApO1xyXG4gICAgICAgICAgICAgICAgcHJldiA9IGdwO1xyXG4gICAgICAgICAgICAgICAgcysrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9sYXRsbmdzID0gX2dlbztcclxuICAgICAgICBMLk11bHRpUG9seWxpbmUucHJvdG90eXBlLnNldExhdExuZ3MuY2FsbCh0aGlzLCB0aGlzLl9sYXRsbmdzKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgZ2VvZGVzaWMgTXVsdGlQb2x5bGluZSBmcm9tIGdpdmVuIGNvb3JkaW5hdGVzXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gbGF0bG5ncyAtIE9uZSBvciBtb3JlIHBvbHlsaW5lcyBhcyBhbiBhcnJheS4gU2VlIExlYWZsZXQgZG9jIGFib3V0IE11bHRpUG9seWxpbmVcclxuICAgICAqIEByZXR1cm5zIChPYmplY3R9IEFuIGFycmF5IG9mIGFycmF5cyBvZiBnZW9ncmFwaGljYWwgcG9pbnRzLlxyXG4gICAgICovXHJcbiAgICBfZ2VuZXJhdGVfR2VvZGVzaWM6IGZ1bmN0aW9uIChsYXRsbmdzKSB7XHJcbiAgICAgICAgdmFyIF9nZW8gPSBbXSwgX2dlb2NudCA9IDAsIHMsIHBvbHksIHBvaW50cztcclxuLy8gICAgICBfZ2VvID0gbGF0bG5ncztcdFx0Ly8gYnlwYXNzXHJcblxyXG4gICAgICAgIGZvciAocG9seSA9IDA7IHBvbHkgPCBsYXRsbmdzLmxlbmd0aDsgcG9seSsrKSB7XHJcbiAgICAgICAgICAgIF9nZW9bX2dlb2NudF0gPSBbXTtcclxuICAgICAgICAgICAgZm9yIChwb2ludHMgPSAwOyBwb2ludHMgPCAobGF0bG5nc1twb2x5XS5sZW5ndGggLSAxKTsgcG9pbnRzKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbnZlcnNlID0gdGhpcy5fdmluY2VudHlfaW52ZXJzZShMLmxhdExuZyhsYXRsbmdzW3BvbHldW3BvaW50c10pLCBMLmxhdExuZyhsYXRsbmdzW3BvbHldW3BvaW50cyArIDFdKSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJldiA9IEwubGF0TG5nKGxhdGxuZ3NbcG9seV1bcG9pbnRzXSk7XHJcbiAgICAgICAgICAgICAgICBfZ2VvW19nZW9jbnRdLnB1c2gocHJldik7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHMgPSAxOyBzIDw9IHRoaXMub3B0aW9ucy5zdGVwczspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGlyZWN0ID0gdGhpcy5fdmluY2VudHlfZGlyZWN0KEwubGF0TG5nKGxhdGxuZ3NbcG9seV1bcG9pbnRzXSksIGludmVyc2UuaW5pdGlhbEJlYXJpbmcsIGludmVyc2UuZGlzdGFuY2UgLyB0aGlzLm9wdGlvbnMuc3RlcHMgKiBzLCB0aGlzLm9wdGlvbnMud3JhcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdwID0gTC5sYXRMbmcoZGlyZWN0LmxhdCwgZGlyZWN0LmxuZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGdwLmxuZyAtIHByZXYubG5nKSA+IDE4MCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VjID0gdGhpcy5faW50ZXJzZWN0aW9uKEwubGF0TG5nKGxhdGxuZ3NbcG9seV1bcG9pbnRzXSksIGludmVyc2UuaW5pdGlhbEJlYXJpbmcsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhdDogLTg5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG5nOiAoKGdwLmxuZyAtIHByZXYubG5nKSA+IDApID8gLUlOVEVSU0VDVF9MTkcgOiBJTlRFUlNFQ1RfTE5HXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VjKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZ2VvW19nZW9jbnRdLnB1c2goTC5sYXRMbmcoc2VjLmxhdCwgc2VjLmxuZykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2dlb2NudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2dlb1tfZ2VvY250XSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldiA9IEwubGF0TG5nKHNlYy5sYXQsIC1zZWMubG5nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9nZW9bX2dlb2NudF0ucHVzaChwcmV2KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9nZW9jbnQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9nZW9bX2dlb2NudF0gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9nZW9bX2dlb2NudF0ucHVzaChncCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2ID0gZ3A7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzKys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9nZW9bX2dlb2NudF0ucHVzaChncCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXYgPSBncDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcysrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBfZ2VvY250Kys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBfZ2VvO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGEgZGFzaGVkIGdlb2Rlc2ljIE11bHRpUG9seWxpbmUgZnJvbSBnaXZlbiBjb29yZGluYXRlcyAtIHVuZGVyIHdvcmtcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBsYXRsbmdzIC0gT25lIG9yIG1vcmUgcG9seWxpbmVzIGFzIGFuIGFycmF5LiBTZWUgTGVhZmxldCBkb2MgYWJvdXQgTXVsdGlQb2x5bGluZVxyXG4gICAgICogQHJldHVybnMgKE9iamVjdH0gQW4gYXJyYXkgb2YgYXJyYXlzIG9mIGdlb2dyYXBoaWNhbCBwb2ludHMuXHJcbiAgICAgKi9cclxuICAgIF9nZW5lcmF0ZV9HZW9kZXNpY0Rhc2hlZDogZnVuY3Rpb24gKGxhdGxuZ3MpIHtcclxuICAgICAgICB2YXIgX2dlbyA9IFtdLCBfZ2VvY250ID0gMCwgcywgcG9seSwgcG9pbnRzO1xyXG4vLyAgICAgIF9nZW8gPSBsYXRsbmdzO1x0XHQvLyBieXBhc3NcclxuXHJcbiAgICAgICAgZm9yIChwb2x5ID0gMDsgcG9seSA8IGxhdGxuZ3MubGVuZ3RoOyBwb2x5KyspIHtcclxuICAgICAgICAgICAgX2dlb1tfZ2VvY250XSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHBvaW50cyA9IDA7IHBvaW50cyA8IChsYXRsbmdzW3BvbHldLmxlbmd0aCAtIDEpOyBwb2ludHMrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGludmVyc2UgPSB0aGlzLl92aW5jZW50eV9pbnZlcnNlKEwubGF0TG5nKGxhdGxuZ3NbcG9seV1bcG9pbnRzXSksIEwubGF0TG5nKGxhdGxuZ3NbcG9seV1bcG9pbnRzICsgMV0pKTtcclxuICAgICAgICAgICAgICAgIHZhciBwcmV2ID0gTC5sYXRMbmcobGF0bG5nc1twb2x5XVtwb2ludHNdKTtcclxuICAgICAgICAgICAgICAgIF9nZW9bX2dlb2NudF0ucHVzaChwcmV2KTtcclxuICAgICAgICAgICAgICAgIGZvciAocyA9IDE7IHMgPD0gdGhpcy5vcHRpb25zLnN0ZXBzOykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkaXJlY3QgPSB0aGlzLl92aW5jZW50eV9kaXJlY3QoTC5sYXRMbmcobGF0bG5nc1twb2x5XVtwb2ludHNdKSwgaW52ZXJzZS5pbml0aWFsQmVhcmluZywgaW52ZXJzZS5kaXN0YW5jZSAvIHRoaXMub3B0aW9ucy5zdGVwcyAqIHMgLSBpbnZlcnNlLmRpc3RhbmNlIC8gdGhpcy5vcHRpb25zLnN0ZXBzICogKDEgLSB0aGlzLm9wdGlvbnMuZGFzaCksIHRoaXMub3B0aW9ucy53cmFwKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZ3AgPSBMLmxhdExuZyhkaXJlY3QubGF0LCBkaXJlY3QubG5nKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZ3AubG5nIC0gcHJldi5sbmcpID4gMTgwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWMgPSB0aGlzLl9pbnRlcnNlY3Rpb24oTC5sYXRMbmcobGF0bG5nc1twb2x5XVtwb2ludHNdKSwgaW52ZXJzZS5pbml0aWFsQmVhcmluZywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF0OiAtODksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsbmc6ICgoZ3AubG5nIC0gcHJldi5sbmcpID4gMCkgPyAtSU5URVJTRUNUX0xORyA6IElOVEVSU0VDVF9MTkdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9nZW9bX2dlb2NudF0ucHVzaChMLmxhdExuZyhzZWMubGF0LCBzZWMubG5nKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZ2VvY250Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZ2VvW19nZW9jbnRdID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2ID0gTC5sYXRMbmcoc2VjLmxhdCwgLXNlYy5sbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2dlb1tfZ2VvY250XS5wdXNoKHByZXYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2dlb2NudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2dlb1tfZ2VvY250XSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2dlb1tfZ2VvY250XS5wdXNoKGdwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXYgPSBncDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHMrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2dlb1tfZ2VvY250XS5wdXNoKGdwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2dlb2NudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGlyZWN0MiA9IHRoaXMuX3ZpbmNlbnR5X2RpcmVjdChMLmxhdExuZyhsYXRsbmdzW3BvbHldW3BvaW50c10pLCBpbnZlcnNlLmluaXRpYWxCZWFyaW5nLCBpbnZlcnNlLmRpc3RhbmNlIC8gdGhpcy5vcHRpb25zLnN0ZXBzICogcywgdGhpcy5vcHRpb25zLndyYXApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfZ2VvW19nZW9jbnRdID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9nZW9bX2dlb2NudF0ucHVzaChMLmxhdExuZyhkaXJlY3QyLmxhdCwgZGlyZWN0Mi5sbmcpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcysrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBfZ2VvY250Kys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBfZ2VvO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBWaW5jZW50eSBkaXJlY3QgY2FsY3VsYXRpb24uXHJcbiAgICAgKiBiYXNlZCBvbiB0aGUgd29yayBvZiBDaHJpcyBWZW5lc3MgKGh0dHBzOi8vZ2l0aHViLmNvbS9jaHJpc3ZlbmVzcy9nZW9kZXN5KVxyXG4gICAgICpcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5pdGlhbEJlYXJpbmcgLSBJbml0aWFsIGJlYXJpbmcgaW4gZGVncmVlcyBmcm9tIG5vcnRoLlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRpc3RhbmNlIC0gRGlzdGFuY2UgYWxvbmcgYmVhcmluZyBpbiBtZXRyZXMuXHJcbiAgICAgKiBAcmV0dXJucyAoT2JqZWN0fSBPYmplY3QgaW5jbHVkaW5nIHBvaW50IChkZXN0aW5hdGlvbiBwb2ludCksIGZpbmFsQmVhcmluZy5cclxuICAgICAqL1xyXG4gICAgX3ZpbmNlbnR5X2RpcmVjdDogZnVuY3Rpb24gKHAxLCBpbml0aWFsQmVhcmluZywgZGlzdGFuY2UsIHdyYXApIHtcclxuICAgICAgICB2YXIgz4YxID0gcDEubGF0LnRvUmFkaWFucygpLCDOuzEgPSBwMS5sbmcudG9SYWRpYW5zKCk7XHJcbiAgICAgICAgdmFyIM6xMSA9IGluaXRpYWxCZWFyaW5nLnRvUmFkaWFucygpO1xyXG4gICAgICAgIHZhciBzID0gZGlzdGFuY2U7XHJcblxyXG4gICAgICAgIHZhciBhID0gdGhpcy5kYXR1bS5lbGxpcHNvaWQuYSwgYiA9IHRoaXMuZGF0dW0uZWxsaXBzb2lkLmIsIGYgPSB0aGlzLmRhdHVtLmVsbGlwc29pZC5mO1xyXG5cclxuICAgICAgICB2YXIgc2luzrExID0gTWF0aC5zaW4ozrExKTtcclxuICAgICAgICB2YXIgY29zzrExID0gTWF0aC5jb3MozrExKTtcclxuXHJcbiAgICAgICAgdmFyIHRhblUxID0gKDEgLSBmKSAqIE1hdGgudGFuKM+GMSksIGNvc1UxID0gMSAvIE1hdGguc3FydCgoMSArIHRhblUxICogdGFuVTEpKSwgc2luVTEgPSB0YW5VMSAqIGNvc1UxO1xyXG4gICAgICAgIHZhciDPgzEgPSBNYXRoLmF0YW4yKHRhblUxLCBjb3POsTEpO1xyXG4gICAgICAgIHZhciBzaW7OsSA9IGNvc1UxICogc2luzrExO1xyXG4gICAgICAgIHZhciBjb3NTcc6xID0gMSAtIHNpbs6xICogc2luzrE7XHJcbiAgICAgICAgdmFyIHVTcSA9IGNvc1NxzrEgKiAoYSAqIGEgLSBiICogYikgLyAoYiAqIGIpO1xyXG4gICAgICAgIHZhciBBID0gMSArIHVTcSAvIDE2Mzg0ICogKDQwOTYgKyB1U3EgKiAoLTc2OCArIHVTcSAqICgzMjAgLSAxNzUgKiB1U3EpKSk7XHJcbiAgICAgICAgdmFyIEIgPSB1U3EgLyAxMDI0ICogKDI1NiArIHVTcSAqICgtMTI4ICsgdVNxICogKDc0IC0gNDcgKiB1U3EpKSk7XHJcblxyXG4gICAgICAgIHZhciDPgyA9IHMgLyAoYiAqIEEpLCDPg8q5LCBpdGVyYXRpb25zID0gMDtcclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIHZhciBjb3Myz4NNID0gTWF0aC5jb3MoMiAqIM+DMSArIM+DKTtcclxuICAgICAgICAgICAgdmFyIHNpbs+DID0gTWF0aC5zaW4oz4MpO1xyXG4gICAgICAgICAgICB2YXIgY29zz4MgPSBNYXRoLmNvcyjPgyk7XHJcbiAgICAgICAgICAgIHZhciDOlM+DID0gQiAqIHNpbs+DICogKGNvczLPg00gKyBCIC8gNCAqIChjb3PPgyAqICgtMSArIDIgKiBjb3Myz4NNICogY29zMs+DTSkgLVxyXG4gICAgICAgICAgICAgICAgQiAvIDYgKiBjb3Myz4NNICogKC0zICsgNCAqIHNpbs+DICogc2luz4MpICogKC0zICsgNCAqIGNvczLPg00gKiBjb3Myz4NNKSkpO1xyXG4gICAgICAgICAgICDPg8q5ID0gz4M7XHJcbiAgICAgICAgICAgIM+DID0gcyAvIChiICogQSkgKyDOlM+DO1xyXG4gICAgICAgIH0gd2hpbGUgKE1hdGguYWJzKM+DIC0gz4PKuSkgPiAxZS0xMiAmJiArK2l0ZXJhdGlvbnMpO1xyXG5cclxuICAgICAgICB2YXIgeCA9IHNpblUxICogc2luz4MgLSBjb3NVMSAqIGNvc8+DICogY29zzrExO1xyXG4gICAgICAgIHZhciDPhjIgPSBNYXRoLmF0YW4yKHNpblUxICogY29zz4MgKyBjb3NVMSAqIHNpbs+DICogY29zzrExLCAoMSAtIGYpICogTWF0aC5zcXJ0KHNpbs6xICogc2luzrEgKyB4ICogeCkpO1xyXG4gICAgICAgIHZhciDOuyA9IE1hdGguYXRhbjIoc2luz4MgKiBzaW7OsTEsIGNvc1UxICogY29zz4MgLSBzaW5VMSAqIHNpbs+DICogY29zzrExKTtcclxuICAgICAgICB2YXIgQyA9IGYgLyAxNiAqIGNvc1NxzrEgKiAoNCArIGYgKiAoNCAtIDMgKiBjb3NTcc6xKSk7XHJcbiAgICAgICAgdmFyIEwgPSDOuyAtICgxIC0gQykgKiBmICogc2luzrEgKlxyXG4gICAgICAgICAgICAoz4MgKyBDICogc2luz4MgKiAoY29zMs+DTSArIEMgKiBjb3PPgyAqICgtMSArIDIgKiBjb3Myz4NNICogY29zMs+DTSkpKTtcclxuXHJcbiAgICAgICAgaWYgKHdyYXApXHJcbiAgICAgICAgICAgIHZhciDOuzIgPSAozrsxICsgTCArIDMgKiBNYXRoLlBJKSAlICgyICogTWF0aC5QSSkgLSBNYXRoLlBJOyAvLyBub3JtYWxpc2UgdG8gLTE4MC4uLisxODBcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHZhciDOuzIgPSAozrsxICsgTCk7IC8vIGRvIG5vdCBub3JtYWxpemVcclxuXHJcbiAgICAgICAgdmFyIHJldkF6ID0gTWF0aC5hdGFuMihzaW7OsSwgLXgpO1xyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBsYXQ6IM+GMi50b0RlZ3JlZXMoKSxcclxuICAgICAgICAgICAgbG5nOiDOuzIudG9EZWdyZWVzKCksXHJcbiAgICAgICAgICAgIGZpbmFsQmVhcmluZzogcmV2QXoudG9EZWdyZWVzKClcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIFZpbmNlbnR5IGludmVyc2UgY2FsY3VsYXRpb24uXHJcbiAgICAgKiBiYXNlZCBvbiB0aGUgd29yayBvZiBDaHJpcyBWZW5lc3MgKGh0dHBzOi8vZ2l0aHViLmNvbS9jaHJpc3ZlbmVzcy9nZW9kZXN5KVxyXG4gICAgICpcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0ge0xhdExuZ30gcDEgLSBMYXRpdHVkZS9sb25naXR1ZGUgb2Ygc3RhcnQgcG9pbnQuXHJcbiAgICAgKiBAcGFyYW0ge0xhdExuZ30gcDIgLSBMYXRpdHVkZS9sb25naXR1ZGUgb2YgZGVzdGluYXRpb24gcG9pbnQuXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBPYmplY3QgaW5jbHVkaW5nIGRpc3RhbmNlLCBpbml0aWFsQmVhcmluZywgZmluYWxCZWFyaW5nLlxyXG4gICAgICogQHRocm93cyB7RXJyb3J9IElmIGZvcm11bGEgZmFpbGVkIHRvIGNvbnZlcmdlLlxyXG4gICAgICovXHJcbiAgICBfdmluY2VudHlfaW52ZXJzZTogZnVuY3Rpb24gKHAxLCBwMikge1xyXG4gICAgICAgIHZhciDPhjEgPSBwMS5sYXQudG9SYWRpYW5zKCksIM67MSA9IHAxLmxuZy50b1JhZGlhbnMoKTtcclxuICAgICAgICB2YXIgz4YyID0gcDIubGF0LnRvUmFkaWFucygpLCDOuzIgPSBwMi5sbmcudG9SYWRpYW5zKCk7XHJcblxyXG4gICAgICAgIHZhciBhID0gdGhpcy5kYXR1bS5lbGxpcHNvaWQuYSwgYiA9IHRoaXMuZGF0dW0uZWxsaXBzb2lkLmIsIGYgPSB0aGlzLmRhdHVtLmVsbGlwc29pZC5mO1xyXG5cclxuICAgICAgICB2YXIgTCA9IM67MiAtIM67MTtcclxuICAgICAgICB2YXIgdGFuVTEgPSAoMSAtIGYpICogTWF0aC50YW4oz4YxKSwgY29zVTEgPSAxIC8gTWF0aC5zcXJ0KCgxICsgdGFuVTEgKiB0YW5VMSkpLCBzaW5VMSA9IHRhblUxICogY29zVTE7XHJcbiAgICAgICAgdmFyIHRhblUyID0gKDEgLSBmKSAqIE1hdGgudGFuKM+GMiksIGNvc1UyID0gMSAvIE1hdGguc3FydCgoMSArIHRhblUyICogdGFuVTIpKSwgc2luVTIgPSB0YW5VMiAqIGNvc1UyO1xyXG5cclxuICAgICAgICB2YXIgzrsgPSBMLCDOu8q5LCBpdGVyYXRpb25zID0gMDtcclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIHZhciBzaW7OuyA9IE1hdGguc2luKM67KSwgY29zzrsgPSBNYXRoLmNvcyjOuyk7XHJcbiAgICAgICAgICAgIHZhciBzaW5Tcc+DID0gKGNvc1UyICogc2luzrspICogKGNvc1UyICogc2luzrspICsgKGNvc1UxICogc2luVTIgLSBzaW5VMSAqIGNvc1UyICogY29zzrspICogKGNvc1UxICogc2luVTIgLSBzaW5VMSAqIGNvc1UyICogY29zzrspO1xyXG4gICAgICAgICAgICB2YXIgc2luz4MgPSBNYXRoLnNxcnQoc2luU3HPgyk7XHJcbiAgICAgICAgICAgIGlmIChzaW7PgyA9PSAwKSByZXR1cm4gMDsgIC8vIGNvLWluY2lkZW50IHBvaW50c1xyXG4gICAgICAgICAgICB2YXIgY29zz4MgPSBzaW5VMSAqIHNpblUyICsgY29zVTEgKiBjb3NVMiAqIGNvc867O1xyXG4gICAgICAgICAgICB2YXIgz4MgPSBNYXRoLmF0YW4yKHNpbs+DLCBjb3PPgyk7XHJcbiAgICAgICAgICAgIHZhciBzaW7OsSA9IGNvc1UxICogY29zVTIgKiBzaW7OuyAvIHNpbs+DO1xyXG4gICAgICAgICAgICB2YXIgY29zU3HOsSA9IDEgLSBzaW7OsSAqIHNpbs6xO1xyXG4gICAgICAgICAgICB2YXIgY29zMs+DTSA9IGNvc8+DIC0gMiAqIHNpblUxICogc2luVTIgLyBjb3NTcc6xO1xyXG4gICAgICAgICAgICBpZiAoaXNOYU4oY29zMs+DTSkpIGNvczLPg00gPSAwOyAgLy8gZXF1YXRvcmlhbCBsaW5lOiBjb3NTcc6xPTAgKMKnNilcclxuICAgICAgICAgICAgdmFyIEMgPSBmIC8gMTYgKiBjb3NTcc6xICogKDQgKyBmICogKDQgLSAzICogY29zU3HOsSkpO1xyXG4gICAgICAgICAgICDOu8q5ID0gzrs7XHJcbiAgICAgICAgICAgIM67ID0gTCArICgxIC0gQykgKiBmICogc2luzrEgKiAoz4MgKyBDICogc2luz4MgKiAoY29zMs+DTSArIEMgKiBjb3PPgyAqICgtMSArIDIgKiBjb3Myz4NNICogY29zMs+DTSkpKTtcclxuICAgICAgICB9IHdoaWxlIChNYXRoLmFicyjOuyAtIM67yrkpID4gMWUtMTIgJiYgKytpdGVyYXRpb25zIDwgMTAwKTtcclxuICAgICAgICBpZiAoaXRlcmF0aW9ucyA+PSAxMDApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0Zvcm11bGEgZmFpbGVkIHRvIGNvbnZlcmdlLiBBbHRlcmluZyB0YXJnZXQgcG9zaXRpb24uJylcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZpbmNlbnR5X2ludmVyc2UocDEsIHtsYXQ6IHAyLmxhdCwgbG5nOiBwMi5sbmcgLSAwLjAxfSlcclxuLy9cdHRocm93IG5ldyBFcnJvcignRm9ybXVsYSBmYWlsZWQgdG8gY29udmVyZ2UnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB1U3EgPSBjb3NTcc6xICogKGEgKiBhIC0gYiAqIGIpIC8gKGIgKiBiKTtcclxuICAgICAgICB2YXIgQSA9IDEgKyB1U3EgLyAxNjM4NCAqICg0MDk2ICsgdVNxICogKC03NjggKyB1U3EgKiAoMzIwIC0gMTc1ICogdVNxKSkpO1xyXG4gICAgICAgIHZhciBCID0gdVNxIC8gMTAyNCAqICgyNTYgKyB1U3EgKiAoLTEyOCArIHVTcSAqICg3NCAtIDQ3ICogdVNxKSkpO1xyXG4gICAgICAgIHZhciDOlM+DID0gQiAqIHNpbs+DICogKGNvczLPg00gKyBCIC8gNCAqIChjb3PPgyAqICgtMSArIDIgKiBjb3Myz4NNICogY29zMs+DTSkgLVxyXG4gICAgICAgICAgICBCIC8gNiAqIGNvczLPg00gKiAoLTMgKyA0ICogc2luz4MgKiBzaW7PgykgKiAoLTMgKyA0ICogY29zMs+DTSAqIGNvczLPg00pKSk7XHJcblxyXG4gICAgICAgIHZhciBzID0gYiAqIEEgKiAoz4MgLSDOlM+DKTtcclxuXHJcbiAgICAgICAgdmFyIGZ3ZEF6ID0gTWF0aC5hdGFuMihjb3NVMiAqIHNpbs67LCBjb3NVMSAqIHNpblUyIC0gc2luVTEgKiBjb3NVMiAqIGNvc867KTtcclxuICAgICAgICB2YXIgcmV2QXogPSBNYXRoLmF0YW4yKGNvc1UxICogc2luzrssIC1zaW5VMSAqIGNvc1UyICsgY29zVTEgKiBzaW5VMiAqIGNvc867KTtcclxuXHJcbiAgICAgICAgcyA9IE51bWJlcihzLnRvRml4ZWQoMykpOyAvLyByb3VuZCB0byAxbW0gcHJlY2lzaW9uXHJcbiAgICAgICAgcmV0dXJuIHtkaXN0YW5jZTogcywgaW5pdGlhbEJlYXJpbmc6IGZ3ZEF6LnRvRGVncmVlcygpLCBmaW5hbEJlYXJpbmc6IHJldkF6LnRvRGVncmVlcygpfTtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyB0aGUgcG9pbnQgb2YgaW50ZXJzZWN0aW9uIG9mIHR3byBwYXRocyBkZWZpbmVkIGJ5IHBvaW50IGFuZCBiZWFyaW5nLlxyXG4gICAgICogYmFzZWQgb24gdGhlIHdvcmsgb2YgQ2hyaXMgVmVuZXNzIChodHRwczovL2dpdGh1Yi5jb20vY2hyaXN2ZW5lc3MvZ2VvZGVzeSlcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge0xhdExvbn0gcDEgLSBGaXJzdCBwb2ludC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBicm5nMSAtIEluaXRpYWwgYmVhcmluZyBmcm9tIGZpcnN0IHBvaW50LlxyXG4gICAgICogQHBhcmFtIHtMYXRMb259IHAyIC0gU2Vjb25kIHBvaW50LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJybmcyIC0gSW5pdGlhbCBiZWFyaW5nIGZyb20gc2Vjb25kIHBvaW50LlxyXG4gICAgICogQHJldHVybnMge09iamVjdH0gY29udGFpbmluZyBsYXQvbG5nIGluZm9ybWF0aW9uIG9mIGludGVyc2VjdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogdmFyIHAxID0gTGF0TG9uKDUxLjg4NTMsIDAuMjU0NSksIGJybmcxID0gMTA4LjU1O1xyXG4gICAgICogdmFyIHAyID0gTGF0TG9uKDQ5LjAwMzQsIDIuNTczNSksIGJybmcyID0gMzIuNDQ7XHJcbiAgICAgKiB2YXIgcEludCA9IExhdExvbi5pbnRlcnNlY3Rpb24ocDEsIGJybmcxLCBwMiwgYnJuZzIpOyAvLyBwSW50LnRvU3RyaW5nKCk6IDUwLjkwNzjCsE4sIDQuNTA4NMKwRVxyXG4gICAgICovXHJcbiAgICBfaW50ZXJzZWN0aW9uOiBmdW5jdGlvbiAocDEsIGJybmcxLCBwMiwgYnJuZzIpIHtcclxuICAgICAgICAvLyBzZWUgaHR0cDovL3dpbGxpYW1zLmJlc3QudndoLm5ldC9hdmZvcm0uaHRtI0ludGVyc2VjdGlvblxyXG5cclxuICAgICAgICB2YXIgz4YxID0gcDEubGF0LnRvUmFkaWFucygpLCDOuzEgPSBwMS5sbmcudG9SYWRpYW5zKCk7XHJcbiAgICAgICAgdmFyIM+GMiA9IHAyLmxhdC50b1JhZGlhbnMoKSwgzrsyID0gcDIubG5nLnRvUmFkaWFucygpO1xyXG4gICAgICAgIHZhciDOuDEzID0gTnVtYmVyKGJybmcxKS50b1JhZGlhbnMoKSwgzrgyMyA9IE51bWJlcihicm5nMikudG9SYWRpYW5zKCk7XHJcbiAgICAgICAgdmFyIM6Uz4YgPSDPhjIgLSDPhjEsIM6UzrsgPSDOuzIgLSDOuzE7XHJcblxyXG4gICAgICAgIHZhciDOtDEyID0gMiAqIE1hdGguYXNpbihNYXRoLnNxcnQoTWF0aC5zaW4ozpTPhiAvIDIpICogTWF0aC5zaW4ozpTPhiAvIDIpICtcclxuICAgICAgICAgICAgTWF0aC5jb3Moz4YxKSAqIE1hdGguY29zKM+GMikgKiBNYXRoLnNpbijOlM67IC8gMikgKiBNYXRoLnNpbijOlM67IC8gMikpKTtcclxuICAgICAgICBpZiAozrQxMiA9PSAwKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgLy8gaW5pdGlhbC9maW5hbCBiZWFyaW5ncyBiZXR3ZWVuIHBvaW50c1xyXG4gICAgICAgIHZhciDOuDEgPSBNYXRoLmFjb3MoKCBNYXRoLnNpbijPhjIpIC0gTWF0aC5zaW4oz4YxKSAqIE1hdGguY29zKM60MTIpICkgL1xyXG4gICAgICAgICggTWF0aC5zaW4ozrQxMikgKiBNYXRoLmNvcyjPhjEpICkpO1xyXG4gICAgICAgIGlmIChpc05hTijOuDEpKSDOuDEgPSAwOyAvLyBwcm90ZWN0IGFnYWluc3Qgcm91bmRpbmdcclxuICAgICAgICB2YXIgzrgyID0gTWF0aC5hY29zKCggTWF0aC5zaW4oz4YxKSAtIE1hdGguc2luKM+GMikgKiBNYXRoLmNvcyjOtDEyKSApIC9cclxuICAgICAgICAoIE1hdGguc2luKM60MTIpICogTWF0aC5jb3Moz4YyKSApKTtcclxuXHJcbiAgICAgICAgaWYgKE1hdGguc2luKM67MiAtIM67MSkgPiAwKSB7XHJcbiAgICAgICAgICAgIHZhciDOuDEyID0gzrgxO1xyXG4gICAgICAgICAgICB2YXIgzrgyMSA9IDIgKiBNYXRoLlBJIC0gzrgyO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciDOuDEyID0gMiAqIE1hdGguUEkgLSDOuDE7XHJcbiAgICAgICAgICAgIHZhciDOuDIxID0gzrgyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIM6xMSA9ICjOuDEzIC0gzrgxMiArIE1hdGguUEkpICUgKDIgKiBNYXRoLlBJKSAtIE1hdGguUEk7IC8vIGFuZ2xlIDItMS0zXHJcbiAgICAgICAgdmFyIM6xMiA9ICjOuDIxIC0gzrgyMyArIE1hdGguUEkpICUgKDIgKiBNYXRoLlBJKSAtIE1hdGguUEk7IC8vIGFuZ2xlIDEtMi0zXHJcblxyXG4gICAgICAgIGlmIChNYXRoLnNpbijOsTEpID09IDAgJiYgTWF0aC5zaW4ozrEyKSA9PSAwKSByZXR1cm4gbnVsbDsgLy8gaW5maW5pdGUgaW50ZXJzZWN0aW9uc1xyXG4gICAgICAgIGlmIChNYXRoLnNpbijOsTEpICogTWF0aC5zaW4ozrEyKSA8IDApIHJldHVybiBudWxsOyAvLyBhbWJpZ3VvdXMgaW50ZXJzZWN0aW9uXHJcblxyXG4gICAgICAgIC8vzrExID0gTWF0aC5hYnMozrExKTtcclxuICAgICAgICAvL86xMiA9IE1hdGguYWJzKM6xMik7XHJcbiAgICAgICAgLy8gLi4uIEVkIFdpbGxpYW1zIHRha2VzIGFicyBvZiDOsTEvzrEyLCBidXQgc2VlbXMgdG8gYnJlYWsgY2FsY3VsYXRpb24/XHJcblxyXG4gICAgICAgIHZhciDOsTMgPSBNYXRoLmFjb3MoLU1hdGguY29zKM6xMSkgKiBNYXRoLmNvcyjOsTIpICtcclxuICAgICAgICBNYXRoLnNpbijOsTEpICogTWF0aC5zaW4ozrEyKSAqIE1hdGguY29zKM60MTIpKTtcclxuICAgICAgICB2YXIgzrQxMyA9IE1hdGguYXRhbjIoTWF0aC5zaW4ozrQxMikgKiBNYXRoLnNpbijOsTEpICogTWF0aC5zaW4ozrEyKSxcclxuICAgICAgICAgICAgTWF0aC5jb3MozrEyKSArIE1hdGguY29zKM6xMSkgKiBNYXRoLmNvcyjOsTMpKVxyXG4gICAgICAgIHZhciDPhjMgPSBNYXRoLmFzaW4oTWF0aC5zaW4oz4YxKSAqIE1hdGguY29zKM60MTMpICtcclxuICAgICAgICBNYXRoLmNvcyjPhjEpICogTWF0aC5zaW4ozrQxMykgKiBNYXRoLmNvcyjOuDEzKSk7XHJcbiAgICAgICAgdmFyIM6UzrsxMyA9IE1hdGguYXRhbjIoTWF0aC5zaW4ozrgxMykgKiBNYXRoLnNpbijOtDEzKSAqIE1hdGguY29zKM+GMSksXHJcbiAgICAgICAgICAgIE1hdGguY29zKM60MTMpIC0gTWF0aC5zaW4oz4YxKSAqIE1hdGguc2luKM+GMykpO1xyXG4gICAgICAgIHZhciDOuzMgPSDOuzEgKyDOlM67MTM7XHJcbiAgICAgICAgzrszID0gKM67MyArIDMgKiBNYXRoLlBJKSAlICgyICogTWF0aC5QSSkgLSBNYXRoLlBJOyAvLyBub3JtYWxpc2UgdG8gLTE4MC4uKzE4MMK6XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGxhdDogz4YzLnRvRGVncmVlcygpLFxyXG4gICAgICAgICAgICBsbmc6IM67My50b0RlZ3JlZXMoKVxyXG4gICAgICAgIH07XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3ZlcndyaXRlcyBvYmoxJ3MgdmFsdWVzIHdpdGggb2JqMidzIGFuZCBhZGRzIG9iajIncyBpZiBub24gZXhpc3RlbnQgaW4gb2JqMVxyXG4gICAgICogQHBhcmFtIG9iajFcclxuICAgICAqIEBwYXJhbSBvYmoyXHJcbiAgICAgKiBAcmV0dXJucyBvYmozIGEgbmV3IG9iamVjdCBiYXNlZCBvbiBvYmoxIGFuZCBvYmoyXHJcbiAgICAgKi9cclxuICAgIF9tZXJnZV9vcHRpb25zOiBmdW5jdGlvbiAob2JqMSwgb2JqMikge1xyXG4gICAgICAgIHZhciBvYmozID0ge307XHJcbiAgICAgICAgZm9yICh2YXIgYXR0cm5hbWUgaW4gb2JqMSkge1xyXG4gICAgICAgICAgICBvYmozW2F0dHJuYW1lXSA9IG9iajFbYXR0cm5hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciBhdHRybmFtZSBpbiBvYmoyKSB7XHJcbiAgICAgICAgICAgIG9iajNbYXR0cm5hbWVdID0gb2JqMlthdHRybmFtZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYmozO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbkwuZ2VvZGVzaWMgPSBmdW5jdGlvbiAobGF0bG5ncywgb3B0aW9ucykge1xyXG4gICAgcmV0dXJuIG5ldyBMLkdlb2Rlc2ljKGxhdGxuZ3MsIG9wdGlvbnMpO1xyXG59O1xyXG5cclxuLy8gSG9vayBpbnRvIEwuR2VvSlNPTi5nZW9tZXRyeVRvTGF5ZXIgYW5kIGFkZCBnZW9kZXNpYyBzdXBwb3J0XHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgb3JpZ19MX0dlb0pTT05fZ2VvbWV0cnlUb0xheWVyID0gTC5HZW9KU09OLmdlb21ldHJ5VG9MYXllcjtcclxuICAgIEwuR2VvSlNPTi5nZW9tZXRyeVRvTGF5ZXIgPSBmdW5jdGlvbiAoZ2VvanNvbiwgcG9pbnRUb0xheWVyLCBjb29yZHNUb0xhdExuZywgdmVjdG9yT3B0aW9ucykge1xyXG4gICAgICAgIGlmIChnZW9qc29uLnByb3BlcnRpZXMgJiYgZ2VvanNvbi5wcm9wZXJ0aWVzLmdlb2Rlc2ljKSB7XHJcbiAgICAgICAgICAgIHZhciBnZW9tZXRyeSA9IGdlb2pzb24udHlwZSA9PT0gJ0ZlYXR1cmUnID8gZ2VvanNvbi5nZW9tZXRyeSA6IGdlb2pzb24sXHJcbiAgICAgICAgICAgICAgICBjb29yZHMgPSBnZW9tZXRyeS5jb29yZGluYXRlcywgcHJvcHMgPSBnZW9qc29uLnByb3BlcnRpZXMsIGxhdGxuZ3M7XHJcbiAgICAgICAgICAgIGNvb3Jkc1RvTGF0TG5nID0gY29vcmRzVG9MYXRMbmcgfHwgdGhpcy5jb29yZHNUb0xhdExuZztcclxuICAgICAgICAgICAgaWYgKHByb3BzLmdlb2Rlc2ljX3N0ZXBzKSB2ZWN0b3JPcHRpb25zID0gTC5leHRlbmQoe3N0ZXBzOiBwcm9wcy5nZW9kZXNpY19zdGVwc30sIHZlY3Rvck9wdGlvbnMpO1xyXG4gICAgICAgICAgICBpZiAocHJvcHMuZ2VvZGVzaWNfd3JhcCkgdmVjdG9yT3B0aW9ucyA9IEwuZXh0ZW5kKHt3cmFwOiBwcm9wcy5nZW9kZXNpY193cmFwfSwgdmVjdG9yT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoZ2VvbWV0cnkudHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnTGluZVN0cmluZyc6XHJcbiAgICAgICAgICAgICAgICAgICAgbGF0bG5ncyA9IHRoaXMuY29vcmRzVG9MYXRMbmdzKGNvb3JkcywgMCwgY29vcmRzVG9MYXRMbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTC5HZW9kZXNpYyhbbGF0bG5nc10sIHZlY3Rvck9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnTXVsdGlMaW5lU3RyaW5nJzpcclxuICAgICAgICAgICAgICAgICAgICBsYXRsbmdzID0gdGhpcy5jb29yZHNUb0xhdExuZ3MoY29vcmRzLCAxLCBjb29yZHNUb0xhdExuZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBMLkdlb2Rlc2ljKGxhdGxuZ3MsIHZlY3Rvck9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTm90IHlldCBzdXBwb3J0ZWQgZHJhd2luZyBHZW9KU09OICcgKyBnZW9tZXRyeS50eXBlICsgJyBhcyBhIGdlb2Rlc2ljOiBEcmF3aW5nIGFzIG5vbi1nZW9kZXNpYy4nKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvcmlnX0xfR2VvSlNPTl9nZW9tZXRyeVRvTGF5ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIH1cclxufSkoKTsiLCIvLyBCYWNrYm9uZS5TdGlja2l0IHYwLjkuMiwgTUlUIExpY2Vuc2VkXHJcbi8vIENvcHlyaWdodCAoYykgMjAxMi0yMDE1IFRoZSBOZXcgWW9yayBUaW1lcywgQ01TIEdyb3VwLCBNYXR0aGV3IERlTGFtYm8gPGRlbGFtYm9AZ21haWwuY29tPlxyXG5cclxuKGZ1bmN0aW9uIChmYWN0b3J5KSB7XHJcblxyXG4gIC8vLy8gU2V0IHVwIFN0aWNraXQgYXBwcm9wcmlhdGVseSBmb3IgdGhlIGVudmlyb25tZW50LiBTdGFydCB3aXRoIEFNRC5cclxuICAvL2lmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXHJcbiAgLy8gIGRlZmluZShbJ3VuZGVyc2NvcmUnLCAnYmFja2JvbmUnLCAnZXhwb3J0cyddLCBmYWN0b3J5KTtcclxuICAvL1xyXG4gIC8vLy8gTmV4dCBmb3IgTm9kZS5qcyBvciBDb21tb25KUy5cclxuICAvL2Vsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JylcclxuICAvLyAgZmFjdG9yeShyZXF1aXJlKCd1bmRlcnNjb3JlJyksIHJlcXVpcmUoJ2JhY2tib25lJyksIGV4cG9ydHMpO1xyXG4gIC8vXHJcbiAgLy8vLyBGaW5hbGx5LCBhcyBhIGJyb3dzZXIgZ2xvYmFsLlxyXG4gIC8vZWxzZVxyXG4gICAgZmFjdG9yeShfLCBCYWNrYm9uZSwge30pO1xyXG5cclxufShmdW5jdGlvbiAoXywgQmFja2JvbmUsIFN0aWNraXQpIHtcclxuXHJcbiAgLy8gU3RpY2tpdCBOYW1lc3BhY2VcclxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvLyBFeHBvcnQgb250byBCYWNrYm9uZSBvYmplY3RcclxuICBCYWNrYm9uZS5TdGlja2l0ID0gU3RpY2tpdDtcclxuXHJcbiAgU3RpY2tpdC5faGFuZGxlcnMgPSBbXTtcclxuXHJcbiAgU3RpY2tpdC5hZGRIYW5kbGVyID0gZnVuY3Rpb24oaGFuZGxlcnMpIHtcclxuICAgIC8vIEZpbGwtaW4gZGVmYXVsdCB2YWx1ZXMuXHJcbiAgICBoYW5kbGVycyA9IF8ubWFwKF8uZmxhdHRlbihbaGFuZGxlcnNdKSwgZnVuY3Rpb24oaGFuZGxlcikge1xyXG4gICAgICByZXR1cm4gXy5kZWZhdWx0cyh7fSwgaGFuZGxlciwge1xyXG4gICAgICAgIHVwZGF0ZU1vZGVsOiB0cnVlLFxyXG4gICAgICAgIHVwZGF0ZVZpZXc6IHRydWUsXHJcbiAgICAgICAgdXBkYXRlTWV0aG9kOiAndGV4dCdcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMuX2hhbmRsZXJzID0gdGhpcy5faGFuZGxlcnMuY29uY2F0KGhhbmRsZXJzKTtcclxuICB9O1xyXG5cclxuICAvLyBCYWNrYm9uZS5WaWV3IE1peGluc1xyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIFN0aWNraXQuVmlld01peGluID0ge1xyXG5cclxuICAgIC8vIENvbGxlY3Rpb24gb2YgbW9kZWwgZXZlbnQgYmluZGluZ3MuXHJcbiAgICAvLyAgIFt7bW9kZWwsZXZlbnQsZm4sY29uZmlnfSwgLi4uXVxyXG4gICAgX21vZGVsQmluZGluZ3M6IG51bGwsXHJcblxyXG4gICAgLy8gVW5iaW5kIHRoZSBtb2RlbCBhbmQgZXZlbnQgYmluZGluZ3MgZnJvbSBgdGhpcy5fbW9kZWxCaW5kaW5nc2AgYW5kXHJcbiAgICAvLyBgdGhpcy4kZWxgLiBJZiB0aGUgb3B0aW9uYWwgYG1vZGVsYCBwYXJhbWV0ZXIgaXMgZGVmaW5lZCwgdGhlbiBvbmx5XHJcbiAgICAvLyBkZWxldGUgYmluZGluZ3MgZm9yIHRoZSBnaXZlbiBgbW9kZWxgIGFuZCBpdHMgY29ycmVzcG9uZGluZyB2aWV3IGV2ZW50cy5cclxuICAgIHVuc3RpY2tpdDogZnVuY3Rpb24obW9kZWwsIGJpbmRpbmdTZWxlY3Rvcikge1xyXG5cclxuICAgICAgLy8gU3VwcG9ydCBwYXNzaW5nIGEgYmluZGluZ3MgaGFzaCBpbiBwbGFjZSBvZiBiaW5kaW5nU2VsZWN0b3IuXHJcbiAgICAgIGlmIChfLmlzT2JqZWN0KGJpbmRpbmdTZWxlY3RvcikpIHtcclxuICAgICAgICBfLmVhY2goYmluZGluZ1NlbGVjdG9yLCBmdW5jdGlvbih2LCBzZWxlY3Rvcikge1xyXG4gICAgICAgICAgdGhpcy51bnN0aWNraXQobW9kZWwsIHNlbGVjdG9yKTtcclxuICAgICAgICB9LCB0aGlzKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBtb2RlbHMgPSBbXSwgZGVzdHJveUZucyA9IFtdO1xyXG4gICAgICB0aGlzLl9tb2RlbEJpbmRpbmdzID0gXy5yZWplY3QodGhpcy5fbW9kZWxCaW5kaW5ncywgZnVuY3Rpb24oYmluZGluZykge1xyXG4gICAgICAgIGlmIChtb2RlbCAmJiBiaW5kaW5nLm1vZGVsICE9PSBtb2RlbCkgcmV0dXJuO1xyXG4gICAgICAgIGlmIChiaW5kaW5nU2VsZWN0b3IgJiYgYmluZGluZy5jb25maWcuc2VsZWN0b3IgIT0gYmluZGluZ1NlbGVjdG9yKSByZXR1cm47XHJcblxyXG4gICAgICAgIGJpbmRpbmcubW9kZWwub2ZmKGJpbmRpbmcuZXZlbnQsIGJpbmRpbmcuZm4pO1xyXG4gICAgICAgIGRlc3Ryb3lGbnMucHVzaChiaW5kaW5nLmNvbmZpZy5fZGVzdHJveSk7XHJcbiAgICAgICAgbW9kZWxzLnB1c2goYmluZGluZy5tb2RlbCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gVHJpZ2dlciBhbiBldmVudCBmb3IgZWFjaCBtb2RlbCB0aGF0IHdhcyB1bmJvdW5kLlxyXG4gICAgICBfLmludm9rZShfLnVuaXEobW9kZWxzKSwgJ3RyaWdnZXInLCAnc3RpY2tpdDp1bnN0dWNrJywgdGhpcy5jaWQpO1xyXG5cclxuICAgICAgLy8gQ2FsbCBgX2Rlc3Ryb3lgIG9uIGEgdW5pcXVlIGxpc3Qgb2YgdGhlIGJpbmRpbmcgY2FsbGJhY2tzLlxyXG4gICAgICBfLmVhY2goXy51bmlxKGRlc3Ryb3lGbnMpLCBmdW5jdGlvbihmbikgeyBmbi5jYWxsKHRoaXMpOyB9LCB0aGlzKTtcclxuXHJcbiAgICAgIHRoaXMuJGVsLm9mZignLnN0aWNraXQnICsgKG1vZGVsID8gJy4nICsgbW9kZWwuY2lkIDogJycpLCBiaW5kaW5nU2VsZWN0b3IpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyBJbml0aWxpemUgU3RpY2tpdCBiaW5kaW5ncyBmb3IgdGhlIHZpZXcuIFN1YnNlcXVlbnQgYmluZGluZyBhZGRpdGlvbnNcclxuICAgIC8vIGNhbiBlaXRoZXIgY2FsbCBgc3RpY2tpdGAgd2l0aCB0aGUgbmV3IGJpbmRpbmdzLCBvciBhZGQgdGhlbSBkaXJlY3RseVxyXG4gICAgLy8gd2l0aCBgYWRkQmluZGluZ2AuIEJvdGggYXJndW1lbnRzIHRvIGBzdGlja2l0YCBhcmUgb3B0aW9uYWwuXHJcbiAgICBzdGlja2l0OiBmdW5jdGlvbihvcHRpb25hbE1vZGVsLCBvcHRpb25hbEJpbmRpbmdzQ29uZmlnKSB7XHJcbiAgICAgIHZhciBtb2RlbCA9IG9wdGlvbmFsTW9kZWwgfHwgdGhpcy5tb2RlbCxcclxuICAgICAgICAgIGJpbmRpbmdzID0gb3B0aW9uYWxCaW5kaW5nc0NvbmZpZyB8fCBfLnJlc3VsdCh0aGlzLCBcImJpbmRpbmdzXCIpIHx8IHt9O1xyXG5cclxuICAgICAgdGhpcy5fbW9kZWxCaW5kaW5ncyB8fCAodGhpcy5fbW9kZWxCaW5kaW5ncyA9IFtdKTtcclxuXHJcbiAgICAgIC8vIEFkZCBiaW5kaW5ncyBpbiBidWxrIHVzaW5nIGBhZGRCaW5kaW5nYC5cclxuICAgICAgdGhpcy5hZGRCaW5kaW5nKG1vZGVsLCBiaW5kaW5ncyk7XHJcblxyXG4gICAgICAvLyBXcmFwIGB2aWV3LnJlbW92ZWAgdG8gdW5iaW5kIHN0aWNraXQgbW9kZWwgYW5kIGRvbSBldmVudHMuXHJcbiAgICAgIHZhciByZW1vdmUgPSB0aGlzLnJlbW92ZTtcclxuICAgICAgaWYgKCFyZW1vdmUuc3RpY2tpdFdyYXBwZWQpIHtcclxuICAgICAgICB0aGlzLnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgdmFyIHJldCA9IHRoaXM7XHJcbiAgICAgICAgICB0aGlzLnVuc3RpY2tpdCgpO1xyXG4gICAgICAgICAgaWYgKHJlbW92ZSkgcmV0ID0gcmVtb3ZlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5yZW1vdmUuc3RpY2tpdFdyYXBwZWQgPSB0cnVlO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcblxyXG4gICAgLy8gQWRkIGEgc2luZ2xlIFN0aWNraXQgYmluZGluZyBvciBhIGhhc2ggb2YgYmluZGluZ3MgdG8gdGhlIG1vZGVsLiBJZlxyXG4gICAgLy8gYG9wdGlvbmFsTW9kZWxgIGlzIG9tbWl0dGVkLCB3aWxsIGRlZmF1bHQgdG8gdGhlIHZpZXcncyBgbW9kZWxgIHByb3BlcnR5LlxyXG4gICAgYWRkQmluZGluZzogZnVuY3Rpb24ob3B0aW9uYWxNb2RlbCwgc2VsZWN0b3IsIGJpbmRpbmcpIHtcclxuICAgICAgdmFyIG1vZGVsID0gb3B0aW9uYWxNb2RlbCB8fCB0aGlzLm1vZGVsLFxyXG4gICAgICAgICAgbmFtZXNwYWNlID0gJy5zdGlja2l0LicgKyBtb2RlbC5jaWQ7XHJcblxyXG4gICAgICBiaW5kaW5nID0gYmluZGluZyB8fCB7fTtcclxuXHJcbiAgICAgIC8vIFN1cHBvcnQgalF1ZXJ5LXN0eWxlIHtrZXk6IHZhbH0gZXZlbnQgbWFwcy5cclxuICAgICAgaWYgKF8uaXNPYmplY3Qoc2VsZWN0b3IpKSB7XHJcbiAgICAgICAgdmFyIGJpbmRpbmdzID0gc2VsZWN0b3I7XHJcbiAgICAgICAgXy5lYWNoKGJpbmRpbmdzLCBmdW5jdGlvbih2YWwsIGtleSkge1xyXG4gICAgICAgICAgdGhpcy5hZGRCaW5kaW5nKG1vZGVsLCBrZXksIHZhbCk7XHJcbiAgICAgICAgfSwgdGhpcyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBTcGVjaWFsIGNhc2UgdGhlICc6ZWwnIHNlbGVjdG9yIHRvIHVzZSB0aGUgdmlldydzIHRoaXMuJGVsLlxyXG4gICAgICB2YXIgJGVsID0gc2VsZWN0b3IgPT09ICc6ZWwnID8gdGhpcy4kZWwgOiB0aGlzLiQoc2VsZWN0b3IpO1xyXG5cclxuICAgICAgLy8gQ2xlYXIgYW55IHByZXZpb3VzIG1hdGNoaW5nIGJpbmRpbmdzLlxyXG4gICAgICB0aGlzLnVuc3RpY2tpdChtb2RlbCwgc2VsZWN0b3IpO1xyXG5cclxuICAgICAgLy8gRmFpbCBmYXN0IGlmIHRoZSBzZWxlY3RvciBkaWRuJ3QgbWF0Y2ggYW4gZWxlbWVudC5cclxuICAgICAgaWYgKCEkZWwubGVuZ3RoKSByZXR1cm47XHJcblxyXG4gICAgICAvLyBBbGxvdyBzaG9ydGhhbmQgc2V0dGluZyBvZiBtb2RlbCBhdHRyaWJ1dGVzIC0gYCdzZWxlY3Rvcic6J29ic2VydmUnYC5cclxuICAgICAgaWYgKF8uaXNTdHJpbmcoYmluZGluZykpIGJpbmRpbmcgPSB7b2JzZXJ2ZTogYmluZGluZ307XHJcblxyXG4gICAgICAvLyBIYW5kbGUgY2FzZSB3aGVyZSBgb2JzZXJ2ZWAgaXMgaW4gdGhlIGZvcm0gb2YgYSBmdW5jdGlvbi5cclxuICAgICAgaWYgKF8uaXNGdW5jdGlvbihiaW5kaW5nLm9ic2VydmUpKSBiaW5kaW5nLm9ic2VydmUgPSBiaW5kaW5nLm9ic2VydmUuY2FsbCh0aGlzKTtcclxuXHJcbiAgICAgIC8vIEZpbmQgYWxsIG1hdGNoaW5nIFN0aWNraXQgaGFuZGxlcnMgdGhhdCBjb3VsZCBhcHBseSB0byB0aGlzIGVsZW1lbnRcclxuICAgICAgLy8gYW5kIHN0b3JlIGluIGEgY29uZmlnIG9iamVjdC5cclxuICAgICAgdmFyIGNvbmZpZyA9IGdldENvbmZpZ3VyYXRpb24oJGVsLCBiaW5kaW5nKTtcclxuXHJcbiAgICAgIC8vIFRoZSBhdHRyaWJ1dGUgd2UncmUgb2JzZXJ2aW5nIGluIG91ciBjb25maWcuXHJcbiAgICAgIHZhciBtb2RlbEF0dHIgPSBjb25maWcub2JzZXJ2ZTtcclxuXHJcbiAgICAgIC8vIFN0b3JlIG5lZWRlZCBwcm9wZXJ0aWVzIGZvciBsYXRlci5cclxuICAgICAgY29uZmlnLnNlbGVjdG9yID0gc2VsZWN0b3I7XHJcbiAgICAgIGNvbmZpZy52aWV3ID0gdGhpcztcclxuXHJcbiAgICAgIC8vIENyZWF0ZSB0aGUgbW9kZWwgc2V0IG9wdGlvbnMgd2l0aCBhIHVuaXF1ZSBgYmluZElkYCBzbyB0aGF0IHdlXHJcbiAgICAgIC8vIGNhbiBhdm9pZCBkb3VibGUtYmluZGluZyBpbiB0aGUgYGNoYW5nZTphdHRyaWJ1dGVgIGV2ZW50IGhhbmRsZXIuXHJcbiAgICAgIHZhciBiaW5kSWQgPSBjb25maWcuYmluZElkID0gXy51bmlxdWVJZCgpO1xyXG5cclxuICAgICAgLy8gQWRkIGEgcmVmZXJlbmNlIHRvIHRoZSB2aWV3IGZvciBoYW5kbGVycyBvZiBzdGlja2l0Q2hhbmdlIGV2ZW50c1xyXG4gICAgICB2YXIgb3B0aW9ucyA9IF8uZXh0ZW5kKHtzdGlja2l0Q2hhbmdlOiBjb25maWd9LCBjb25maWcuc2V0T3B0aW9ucyk7XHJcblxyXG4gICAgICAvLyBBZGQgYSBgX2Rlc3Ryb3lgIGNhbGxiYWNrIHRvIHRoZSBjb25maWd1cmF0aW9uLCBpbiBjYXNlIGBkZXN0cm95YFxyXG4gICAgICAvLyBpcyBhIG5hbWVkIGZ1bmN0aW9uIGFuZCB3ZSBuZWVkIGEgdW5pcXVlIGZ1bmN0aW9uIHdoZW4gdW5zdGlja2luZy5cclxuICAgICAgY29uZmlnLl9kZXN0cm95ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgYXBwbHlWaWV3Rm4uY2FsbCh0aGlzLCBjb25maWcuZGVzdHJveSwgJGVsLCBtb2RlbCwgY29uZmlnKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGluaXRpYWxpemVBdHRyaWJ1dGVzKCRlbCwgY29uZmlnLCBtb2RlbCwgbW9kZWxBdHRyKTtcclxuICAgICAgaW5pdGlhbGl6ZVZpc2libGUoJGVsLCBjb25maWcsIG1vZGVsLCBtb2RlbEF0dHIpO1xyXG4gICAgICBpbml0aWFsaXplQ2xhc3NlcygkZWwsIGNvbmZpZywgbW9kZWwsIG1vZGVsQXR0cik7XHJcblxyXG4gICAgICBpZiAobW9kZWxBdHRyKSB7XHJcbiAgICAgICAgLy8gU2V0dXAgb25lLXdheSAoaW5wdXQgZWxlbWVudCAtPiBtb2RlbCkgYmluZGluZ3MuXHJcbiAgICAgICAgXy5lYWNoKGNvbmZpZy5ldmVudHMsIGZ1bmN0aW9uKHR5cGUpIHtcclxuICAgICAgICAgIHZhciBldmVudE5hbWUgPSB0eXBlICsgbmFtZXNwYWNlO1xyXG4gICAgICAgICAgdmFyIGxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAgICAgdmFyIHZhbCA9IGFwcGx5Vmlld0ZuLmNhbGwodGhpcywgY29uZmlnLmdldFZhbCwgJGVsLCBldmVudCwgY29uZmlnLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xyXG5cclxuICAgICAgICAgICAgLy8gRG9uJ3QgdXBkYXRlIHRoZSBtb2RlbCBpZiBmYWxzZSBpcyByZXR1cm5lZCBmcm9tIHRoZSBgdXBkYXRlTW9kZWxgIGNvbmZpZ3VyYXRpb24uXHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50VmFsID0gZXZhbHVhdGVCb29sZWFuKGNvbmZpZy51cGRhdGVNb2RlbCwgdmFsLCBldmVudCwgY29uZmlnKTtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRWYWwpIHNldEF0dHIobW9kZWwsIG1vZGVsQXR0ciwgdmFsLCBvcHRpb25zLCBjb25maWcpO1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIHZhciBzZWwgPSBzZWxlY3RvciA9PT0gJzplbCc/ICcnIDogc2VsZWN0b3I7XHJcbiAgICAgICAgICB0aGlzLiRlbC5vbihldmVudE5hbWUsIHNlbCwgXy5iaW5kKGxpc3RlbmVyLCB0aGlzKSk7XHJcbiAgICAgICAgfSwgdGhpcyk7XHJcblxyXG4gICAgICAgIC8vIFNldHVwIGEgYGNoYW5nZTptb2RlbEF0dHJgIG9ic2VydmVyIHRvIGtlZXAgdGhlIHZpZXcgZWxlbWVudCBpbiBzeW5jLlxyXG4gICAgICAgIC8vIGBtb2RlbEF0dHJgIG1heSBiZSBhbiBhcnJheSBvZiBhdHRyaWJ1dGVzIG9yIGEgc2luZ2xlIHN0cmluZyB2YWx1ZS5cclxuICAgICAgICBfLmVhY2goXy5mbGF0dGVuKFttb2RlbEF0dHJdKSwgZnVuY3Rpb24oYXR0cikge1xyXG4gICAgICAgICAgb2JzZXJ2ZU1vZGVsRXZlbnQobW9kZWwsICdjaGFuZ2U6JyArIGF0dHIsIGNvbmZpZywgZnVuY3Rpb24obSwgdmFsLCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHZhciBjaGFuZ2VJZCA9IG9wdGlvbnMgJiYgb3B0aW9ucy5zdGlja2l0Q2hhbmdlICYmIG9wdGlvbnMuc3RpY2tpdENoYW5nZS5iaW5kSWQ7XHJcbiAgICAgICAgICAgIGlmIChjaGFuZ2VJZCAhPT0gYmluZElkKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGN1cnJlbnRWYWwgPSBnZXRBdHRyKG1vZGVsLCBtb2RlbEF0dHIsIGNvbmZpZyk7XHJcbiAgICAgICAgICAgICAgdXBkYXRlVmlld0JpbmRFbCgkZWwsIGNvbmZpZywgY3VycmVudFZhbCwgbW9kZWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIGN1cnJlbnRWYWwgPSBnZXRBdHRyKG1vZGVsLCBtb2RlbEF0dHIsIGNvbmZpZyk7XHJcbiAgICAgICAgdXBkYXRlVmlld0JpbmRFbCgkZWwsIGNvbmZpZywgY3VycmVudFZhbCwgbW9kZWwsIHRydWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBBZnRlciBlYWNoIGJpbmRpbmcgaXMgc2V0dXAsIGNhbGwgdGhlIGBpbml0aWFsaXplYCBjYWxsYmFjay5cclxuICAgICAgYXBwbHlWaWV3Rm4uY2FsbCh0aGlzLCBjb25maWcuaW5pdGlhbGl6ZSwgJGVsLCBtb2RlbCwgY29uZmlnKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBfLmV4dGVuZChCYWNrYm9uZS5WaWV3LnByb3RvdHlwZSwgU3RpY2tpdC5WaWV3TWl4aW4pO1xyXG5cclxuICAvLyBIZWxwZXJzXHJcbiAgLy8gLS0tLS0tLVxyXG5cclxuICB2YXIgc2xpY2UgPSBbXS5zbGljZTtcclxuXHJcbiAgLy8gRXZhbHVhdGVzIHRoZSBnaXZlbiBgcGF0aGAgKGluIG9iamVjdC9kb3Qtbm90YXRpb24pIHJlbGF0aXZlIHRvIHRoZSBnaXZlblxyXG4gIC8vIGBvYmpgLiBJZiB0aGUgcGF0aCBpcyBudWxsL3VuZGVmaW5lZCwgdGhlbiB0aGUgZ2l2ZW4gYG9iamAgaXMgcmV0dXJuZWQuXHJcbiAgdmFyIGV2YWx1YXRlUGF0aCA9IGZ1bmN0aW9uKG9iaiwgcGF0aCkge1xyXG4gICAgdmFyIHBhcnRzID0gKHBhdGggfHwgJycpLnNwbGl0KCcuJyk7XHJcbiAgICB2YXIgcmVzdWx0ID0gXy5yZWR1Y2UocGFydHMsIGZ1bmN0aW9uKG1lbW8sIGkpIHsgcmV0dXJuIG1lbW9baV07IH0sIG9iaik7XHJcbiAgICByZXR1cm4gcmVzdWx0ID09IG51bGwgPyBvYmogOiByZXN1bHQ7XHJcbiAgfTtcclxuXHJcbiAgLy8gSWYgdGhlIGdpdmVuIGBmbmAgaXMgYSBzdHJpbmcsIHRoZW4gdmlld1tmbl0gaXMgY2FsbGVkLCBvdGhlcndpc2UgaXQgaXNcclxuICAvLyBhIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGJlIGV4ZWN1dGVkLlxyXG4gIHZhciBhcHBseVZpZXdGbiA9IGZ1bmN0aW9uKGZuKSB7XHJcbiAgICBmbiA9IF8uaXNTdHJpbmcoZm4pID8gZXZhbHVhdGVQYXRoKHRoaXMsIGZuKSA6IGZuO1xyXG4gICAgaWYgKGZuKSByZXR1cm4gKGZuKS5hcHBseSh0aGlzLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xyXG4gIH07XHJcblxyXG4gIC8vIEdpdmVuIGEgZnVuY3Rpb24sIHN0cmluZyAodmlldyBmdW5jdGlvbiByZWZlcmVuY2UpLCBvciBhIGJvb2xlYW5cclxuICAvLyB2YWx1ZSwgcmV0dXJucyB0aGUgdHJ1dGh5IHJlc3VsdC4gQW55IG90aGVyIHR5cGVzIGV2YWx1YXRlIGFzIGZhbHNlLlxyXG4gIC8vIFRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGByZWZlcmVuY2VgIGFuZCB0aGUgbGFzdCBtdXN0IGJlIGBjb25maWdgLCBidXRcclxuICAvLyBtaWRkbGUgYXJndW1lbnRzIGNhbiBiZSB2YXJpYWRpYy5cclxuICB2YXIgZXZhbHVhdGVCb29sZWFuID0gZnVuY3Rpb24ocmVmZXJlbmNlLCB2YWwsIGNvbmZpZykge1xyXG4gICAgaWYgKF8uaXNCb29sZWFuKHJlZmVyZW5jZSkpIHtcclxuICAgICAgcmV0dXJuIHJlZmVyZW5jZTtcclxuICAgIH0gZWxzZSBpZiAoXy5pc0Z1bmN0aW9uKHJlZmVyZW5jZSkgfHwgXy5pc1N0cmluZyhyZWZlcmVuY2UpKSB7XHJcbiAgICAgIHZhciB2aWV3ID0gXy5sYXN0KGFyZ3VtZW50cykudmlldztcclxuICAgICAgcmV0dXJuIGFwcGx5Vmlld0ZuLmFwcGx5KHZpZXcsIGFyZ3VtZW50cyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgLy8gU2V0dXAgYSBtb2RlbCBldmVudCBiaW5kaW5nIHdpdGggdGhlIGdpdmVuIGZ1bmN0aW9uLCBhbmQgdHJhY2sgdGhlIGV2ZW50XHJcbiAgLy8gaW4gdGhlIHZpZXcncyBfbW9kZWxCaW5kaW5ncy5cclxuICB2YXIgb2JzZXJ2ZU1vZGVsRXZlbnQgPSBmdW5jdGlvbihtb2RlbCwgZXZlbnQsIGNvbmZpZywgZm4pIHtcclxuICAgIHZhciB2aWV3ID0gY29uZmlnLnZpZXc7XHJcbiAgICBtb2RlbC5vbihldmVudCwgZm4sIHZpZXcpO1xyXG4gICAgdmlldy5fbW9kZWxCaW5kaW5ncy5wdXNoKHttb2RlbDptb2RlbCwgZXZlbnQ6ZXZlbnQsIGZuOmZuLCBjb25maWc6Y29uZmlnfSk7XHJcbiAgfTtcclxuXHJcbiAgLy8gUHJlcGFyZXMgdGhlIGdpdmVuIGB2YWxgdWUgYW5kIHNldHMgaXQgaW50byB0aGUgYG1vZGVsYC5cclxuICB2YXIgc2V0QXR0ciA9IGZ1bmN0aW9uKG1vZGVsLCBhdHRyLCB2YWwsIG9wdGlvbnMsIGNvbmZpZykge1xyXG4gICAgdmFyIHZhbHVlID0ge30sIHZpZXcgPSBjb25maWcudmlldztcclxuICAgIGlmIChjb25maWcub25TZXQpIHtcclxuICAgICAgdmFsID0gYXBwbHlWaWV3Rm4uY2FsbCh2aWV3LCBjb25maWcub25TZXQsIHZhbCwgY29uZmlnKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY29uZmlnLnNldCkge1xyXG4gICAgICBhcHBseVZpZXdGbi5jYWxsKHZpZXcsIGNvbmZpZy5zZXQsIGF0dHIsIHZhbCwgb3B0aW9ucywgY29uZmlnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhbHVlW2F0dHJdID0gdmFsO1xyXG4gICAgICAvLyBJZiBgb2JzZXJ2ZWAgaXMgZGVmaW5lZCBhcyBhbiBhcnJheSBhbmQgYG9uU2V0YCByZXR1cm5lZFxyXG4gICAgICAvLyBhbiBhcnJheSwgdGhlbiBtYXAgYXR0cmlidXRlcyB0byB0aGVpciB2YWx1ZXMuXHJcbiAgICAgIGlmIChfLmlzQXJyYXkoYXR0cikgJiYgXy5pc0FycmF5KHZhbCkpIHtcclxuICAgICAgICB2YWx1ZSA9IF8ucmVkdWNlKGF0dHIsIGZ1bmN0aW9uKG1lbW8sIGF0dHJpYnV0ZSwgaW5kZXgpIHtcclxuICAgICAgICAgIG1lbW9bYXR0cmlidXRlXSA9IF8uaGFzKHZhbCwgaW5kZXgpID8gdmFsW2luZGV4XSA6IG51bGw7XHJcbiAgICAgICAgICByZXR1cm4gbWVtbztcclxuICAgICAgICB9LCB7fSk7XHJcbiAgICAgIH1cclxuICAgICAgbW9kZWwuc2V0KHZhbHVlLCBvcHRpb25zKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvLyBSZXR1cm5zIHRoZSBnaXZlbiBgYXR0cmAncyB2YWx1ZSBmcm9tIHRoZSBgbW9kZWxgLCBlc2NhcGluZyBhbmRcclxuICAvLyBmb3JtYXR0aW5nIGlmIG5lY2Vzc2FyeS4gSWYgYGF0dHJgIGlzIGFuIGFycmF5LCB0aGVuIGFuIGFycmF5IG9mXHJcbiAgLy8gcmVzcGVjdGl2ZSB2YWx1ZXMgd2lsbCBiZSByZXR1cm5lZC5cclxuICB2YXIgZ2V0QXR0ciA9IGZ1bmN0aW9uKG1vZGVsLCBhdHRyLCBjb25maWcpIHtcclxuICAgIHZhciB2aWV3ID0gY29uZmlnLnZpZXc7XHJcbiAgICB2YXIgcmV0cmlldmVWYWwgPSBmdW5jdGlvbihmaWVsZCkge1xyXG4gICAgICByZXR1cm4gbW9kZWxbY29uZmlnLmVzY2FwZSA/ICdlc2NhcGUnIDogJ2dldCddKGZpZWxkKTtcclxuICAgIH07XHJcbiAgICB2YXIgc2FuaXRpemVWYWwgPSBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA9PSBudWxsID8gJycgOiB2YWw7XHJcbiAgICB9O1xyXG4gICAgdmFyIHZhbCA9IF8uaXNBcnJheShhdHRyKSA/IF8ubWFwKGF0dHIsIHJldHJpZXZlVmFsKSA6IHJldHJpZXZlVmFsKGF0dHIpO1xyXG4gICAgaWYgKGNvbmZpZy5vbkdldCkgdmFsID0gYXBwbHlWaWV3Rm4uY2FsbCh2aWV3LCBjb25maWcub25HZXQsIHZhbCwgY29uZmlnKTtcclxuICAgIHJldHVybiBfLmlzQXJyYXkodmFsKSA/IF8ubWFwKHZhbCwgc2FuaXRpemVWYWwpIDogc2FuaXRpemVWYWwodmFsKTtcclxuICB9O1xyXG5cclxuICAvLyBGaW5kIGhhbmRsZXJzIGluIGBCYWNrYm9uZS5TdGlja2l0Ll9oYW5kbGVyc2Agd2l0aCBzZWxlY3RvcnMgdGhhdCBtYXRjaFxyXG4gIC8vIGAkZWxgIGFuZCBnZW5lcmF0ZSBhIGNvbmZpZ3VyYXRpb24gYnkgbWl4aW5nIHRoZW0gaW4gdGhlIG9yZGVyIHRoYXQgdGhleVxyXG4gIC8vIHdlcmUgZm91bmQgd2l0aCB0aGUgZ2l2ZW4gYGJpbmRpbmdgLlxyXG4gIHZhciBnZXRDb25maWd1cmF0aW9uID0gU3RpY2tpdC5nZXRDb25maWd1cmF0aW9uID0gZnVuY3Rpb24oJGVsLCBiaW5kaW5nKSB7XHJcbiAgICB2YXIgaGFuZGxlcnMgPSBbe1xyXG4gICAgICB1cGRhdGVNb2RlbDogZmFsc2UsXHJcbiAgICAgIHVwZGF0ZU1ldGhvZDogJ3RleHQnLFxyXG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uKCRlbCwgdmFsLCBtLCBvcHRzKSB7IGlmICgkZWxbb3B0cy51cGRhdGVNZXRob2RdKSAkZWxbb3B0cy51cGRhdGVNZXRob2RdKHZhbCk7IH0sXHJcbiAgICAgIGdldFZhbDogZnVuY3Rpb24oJGVsLCBlLCBvcHRzKSB7IHJldHVybiAkZWxbb3B0cy51cGRhdGVNZXRob2RdKCk7IH1cclxuICAgIH1dO1xyXG4gICAgaGFuZGxlcnMgPSBoYW5kbGVycy5jb25jYXQoXy5maWx0ZXIoU3RpY2tpdC5faGFuZGxlcnMsIGZ1bmN0aW9uKGhhbmRsZXIpIHtcclxuICAgICAgcmV0dXJuICRlbC5pcyhoYW5kbGVyLnNlbGVjdG9yKTtcclxuICAgIH0pKTtcclxuICAgIGhhbmRsZXJzLnB1c2goYmluZGluZyk7XHJcblxyXG4gICAgLy8gTWVyZ2UgaGFuZGxlcnMgaW50byBhIHNpbmdsZSBjb25maWcgb2JqZWN0LiBMYXN0IHByb3BzIGluIHdpbnMuXHJcbiAgICB2YXIgY29uZmlnID0gXy5leHRlbmQuYXBwbHkoXywgaGFuZGxlcnMpO1xyXG5cclxuICAgIC8vIGB1cGRhdGVWaWV3YCBpcyBkZWZhdWx0ZWQgdG8gZmFsc2UgZm9yIGNvbmZpZ3V0cmF0aW9ucyB3aXRoXHJcbiAgICAvLyBgdmlzaWJsZWA7IG90aGVyd2lzZSwgYHVwZGF0ZVZpZXdgIGlzIGRlZmF1bHRlZCB0byB0cnVlLlxyXG4gICAgaWYgKCFfLmhhcyhjb25maWcsICd1cGRhdGVWaWV3JykpIGNvbmZpZy51cGRhdGVWaWV3ID0gIWNvbmZpZy52aXNpYmxlO1xyXG4gICAgcmV0dXJuIGNvbmZpZztcclxuICB9O1xyXG5cclxuICAvLyBTZXR1cCB0aGUgYXR0cmlidXRlcyBjb25maWd1cmF0aW9uIC0gYSBsaXN0IHRoYXQgbWFwcyBhbiBhdHRyaWJ1dGUgb3JcclxuICAvLyBwcm9wZXJ0eSBgbmFtZWAsIHRvIGFuIGBvYnNlcnZlYGQgbW9kZWwgYXR0cmlidXRlLCB1c2luZyBhbiBvcHRpb25hbFxyXG4gIC8vIGBvbkdldGAgZm9ybWF0dGVyLlxyXG4gIC8vXHJcbiAgLy8gICAgIGF0dHJpYnV0ZXM6IFt7XHJcbiAgLy8gICAgICAgbmFtZTogJ2F0dHJpYnV0ZU9yUHJvcGVydHlOYW1lJyxcclxuICAvLyAgICAgICBvYnNlcnZlOiAnbW9kZWxBdHRyTmFtZSdcclxuICAvLyAgICAgICBvbkdldDogZnVuY3Rpb24obW9kZWxBdHRyVmFsLCBtb2RlbEF0dHJOYW1lKSB7IC4uLiB9XHJcbiAgLy8gICAgIH0sIC4uLl1cclxuICAvL1xyXG4gIHZhciBpbml0aWFsaXplQXR0cmlidXRlcyA9IGZ1bmN0aW9uKCRlbCwgY29uZmlnLCBtb2RlbCwgbW9kZWxBdHRyKSB7XHJcbiAgICB2YXIgcHJvcHMgPSBbJ2F1dG9mb2N1cycsICdhdXRvcGxheScsICdhc3luYycsICdjaGVja2VkJywgJ2NvbnRyb2xzJyxcclxuICAgICAgJ2RlZmVyJywgJ2Rpc2FibGVkJywgJ2hpZGRlbicsICdpbmRldGVybWluYXRlJywgJ2xvb3AnLCAnbXVsdGlwbGUnLFxyXG4gICAgICAnb3BlbicsICdyZWFkb25seScsICdyZXF1aXJlZCcsICdzY29wZWQnLCAnc2VsZWN0ZWQnXTtcclxuXHJcbiAgICB2YXIgdmlldyA9IGNvbmZpZy52aWV3O1xyXG5cclxuICAgIF8uZWFjaChjb25maWcuYXR0cmlidXRlcyB8fCBbXSwgZnVuY3Rpb24oYXR0ckNvbmZpZykge1xyXG4gICAgICBhdHRyQ29uZmlnID0gXy5jbG9uZShhdHRyQ29uZmlnKTtcclxuICAgICAgYXR0ckNvbmZpZy52aWV3ID0gdmlldztcclxuXHJcbiAgICAgIHZhciBsYXN0Q2xhc3MgPSAnJztcclxuICAgICAgdmFyIG9ic2VydmVkID0gYXR0ckNvbmZpZy5vYnNlcnZlIHx8IChhdHRyQ29uZmlnLm9ic2VydmUgPSBtb2RlbEF0dHIpO1xyXG4gICAgICB2YXIgdXBkYXRlQXR0ciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB1cGRhdGVUeXBlID0gXy5jb250YWlucyhwcm9wcywgYXR0ckNvbmZpZy5uYW1lKSA/ICdwcm9wJyA6ICdhdHRyJyxcclxuICAgICAgICAgICAgdmFsID0gZ2V0QXR0cihtb2RlbCwgb2JzZXJ2ZWQsIGF0dHJDb25maWcpO1xyXG5cclxuICAgICAgICAvLyBJZiBpdCBpcyBhIGNsYXNzIHRoZW4gd2UgbmVlZCB0byByZW1vdmUgdGhlIGxhc3QgdmFsdWUgYW5kIGFkZCB0aGUgbmV3LlxyXG4gICAgICAgIGlmIChhdHRyQ29uZmlnLm5hbWUgPT09ICdjbGFzcycpIHtcclxuICAgICAgICAgICRlbC5yZW1vdmVDbGFzcyhsYXN0Q2xhc3MpLmFkZENsYXNzKHZhbCk7XHJcbiAgICAgICAgICBsYXN0Q2xhc3MgPSB2YWw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICRlbFt1cGRhdGVUeXBlXShhdHRyQ29uZmlnLm5hbWUsIHZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgXy5lYWNoKF8uZmxhdHRlbihbb2JzZXJ2ZWRdKSwgZnVuY3Rpb24oYXR0cikge1xyXG4gICAgICAgIG9ic2VydmVNb2RlbEV2ZW50KG1vZGVsLCAnY2hhbmdlOicgKyBhdHRyLCBjb25maWcsIHVwZGF0ZUF0dHIpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIC8vIEluaXRpYWxpemUgdGhlIG1hdGNoZWQgZWxlbWVudCdzIHN0YXRlLlxyXG4gICAgICB1cGRhdGVBdHRyKCk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICB2YXIgaW5pdGlhbGl6ZUNsYXNzZXMgPSBmdW5jdGlvbigkZWwsIGNvbmZpZywgbW9kZWwsIG1vZGVsQXR0cikge1xyXG4gICAgXy5lYWNoKGNvbmZpZy5jbGFzc2VzIHx8IFtdLCBmdW5jdGlvbihjbGFzc0NvbmZpZywgbmFtZSkge1xyXG4gICAgICBpZiAoXy5pc1N0cmluZyhjbGFzc0NvbmZpZykpIGNsYXNzQ29uZmlnID0ge29ic2VydmU6IGNsYXNzQ29uZmlnfTtcclxuICAgICAgY2xhc3NDb25maWcudmlldyA9IGNvbmZpZy52aWV3O1xyXG5cclxuICAgICAgdmFyIG9ic2VydmVkID0gY2xhc3NDb25maWcub2JzZXJ2ZTtcclxuICAgICAgdmFyIHVwZGF0ZUNsYXNzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHZhbCA9IGdldEF0dHIobW9kZWwsIG9ic2VydmVkLCBjbGFzc0NvbmZpZyk7XHJcbiAgICAgICAgJGVsLnRvZ2dsZUNsYXNzKG5hbWUsICEhdmFsKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIF8uZWFjaChfLmZsYXR0ZW4oW29ic2VydmVkXSksIGZ1bmN0aW9uKGF0dHIpIHtcclxuICAgICAgICBvYnNlcnZlTW9kZWxFdmVudChtb2RlbCwgJ2NoYW5nZTonICsgYXR0ciwgY29uZmlnLCB1cGRhdGVDbGFzcyk7XHJcbiAgICAgIH0pO1xyXG4gICAgICB1cGRhdGVDbGFzcygpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgLy8gSWYgYHZpc2libGVgIGlzIGNvbmZpZ3VyZWQsIHRoZW4gdGhlIHZpZXcgZWxlbWVudCB3aWxsIGJlIHNob3duL2hpZGRlblxyXG4gIC8vIGJhc2VkIG9uIHRoZSB0cnV0aGluZXNzIG9mIHRoZSBtb2RlbGF0dHIncyB2YWx1ZSBvciB0aGUgcmVzdWx0IG9mIHRoZVxyXG4gIC8vIGdpdmVuIGNhbGxiYWNrLiBJZiBhIGB2aXNpYmxlRm5gIGlzIGFsc28gc3VwcGxpZWQsIHRoZW4gdGhhdCBjYWxsYmFja1xyXG4gIC8vIHdpbGwgYmUgZXhlY3V0ZWQgdG8gbWFudWFsbHkgaGFuZGxlIHNob3dpbmcvaGlkaW5nIHRoZSB2aWV3IGVsZW1lbnQuXHJcbiAgLy9cclxuICAvLyAgICAgb2JzZXJ2ZTogJ2lzUmlnaHQnLFxyXG4gIC8vICAgICB2aXNpYmxlOiB0cnVlLCAvLyBvciBmdW5jdGlvbih2YWwsIG9wdGlvbnMpIHt9XHJcbiAgLy8gICAgIHZpc2libGVGbjogZnVuY3Rpb24oJGVsLCBpc1Zpc2libGUsIG9wdGlvbnMpIHt9IC8vIG9wdGlvbmFsIGhhbmRsZXJcclxuICAvL1xyXG4gIHZhciBpbml0aWFsaXplVmlzaWJsZSA9IGZ1bmN0aW9uKCRlbCwgY29uZmlnLCBtb2RlbCwgbW9kZWxBdHRyKSB7XHJcbiAgICBpZiAoY29uZmlnLnZpc2libGUgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgdmFyIHZpZXcgPSBjb25maWcudmlldztcclxuXHJcbiAgICB2YXIgdmlzaWJsZUNiID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciB2aXNpYmxlID0gY29uZmlnLnZpc2libGUsXHJcbiAgICAgICAgICB2aXNpYmxlRm4gPSBjb25maWcudmlzaWJsZUZuLFxyXG4gICAgICAgICAgdmFsID0gZ2V0QXR0cihtb2RlbCwgbW9kZWxBdHRyLCBjb25maWcpLFxyXG4gICAgICAgICAgaXNWaXNpYmxlID0gISF2YWw7XHJcblxyXG4gICAgICAvLyBJZiBgdmlzaWJsZWAgaXMgYSBmdW5jdGlvbiB0aGVuIGl0IHNob3VsZCByZXR1cm4gYSBib29sZWFuIHJlc3VsdCB0byBzaG93L2hpZGUuXHJcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24odmlzaWJsZSkgfHwgXy5pc1N0cmluZyh2aXNpYmxlKSkge1xyXG4gICAgICAgIGlzVmlzaWJsZSA9ICEhYXBwbHlWaWV3Rm4uY2FsbCh2aWV3LCB2aXNpYmxlLCB2YWwsIGNvbmZpZyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEVpdGhlciB1c2UgdGhlIGN1c3RvbSBgdmlzaWJsZUZuYCwgaWYgcHJvdmlkZWQsIG9yIGV4ZWN1dGUgdGhlIHN0YW5kYXJkIHNob3cvaGlkZS5cclxuICAgICAgaWYgKHZpc2libGVGbikge1xyXG4gICAgICAgIGFwcGx5Vmlld0ZuLmNhbGwodmlldywgdmlzaWJsZUZuLCAkZWwsIGlzVmlzaWJsZSwgY29uZmlnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkZWwudG9nZ2xlKGlzVmlzaWJsZSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgXy5lYWNoKF8uZmxhdHRlbihbbW9kZWxBdHRyXSksIGZ1bmN0aW9uKGF0dHIpIHtcclxuICAgICAgb2JzZXJ2ZU1vZGVsRXZlbnQobW9kZWwsICdjaGFuZ2U6JyArIGF0dHIsIGNvbmZpZywgdmlzaWJsZUNiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHZpc2libGVDYigpO1xyXG4gIH07XHJcblxyXG4gIC8vIFVwZGF0ZSB0aGUgdmFsdWUgb2YgYCRlbGAgdXNpbmcgdGhlIGdpdmVuIGNvbmZpZ3VyYXRpb24gYW5kIHRyaWdnZXIgdGhlXHJcbiAgLy8gYGFmdGVyVXBkYXRlYCBjYWxsYmFjay4gVGhpcyBhY3Rpb24gbWF5IGJlIGJsb2NrZWQgYnkgYGNvbmZpZy51cGRhdGVWaWV3YC5cclxuICAvL1xyXG4gIC8vICAgICB1cGRhdGU6IGZ1bmN0aW9uKCRlbCwgdmFsLCBtb2RlbCwgb3B0aW9ucykge30sICAvLyBoYW5kbGVyIGZvciB1cGRhdGluZ1xyXG4gIC8vICAgICB1cGRhdGVWaWV3OiB0cnVlLCAvLyBkZWZhdWx0cyB0byB0cnVlXHJcbiAgLy8gICAgIGFmdGVyVXBkYXRlOiBmdW5jdGlvbigkZWwsIHZhbCwgb3B0aW9ucykge30gLy8gb3B0aW9uYWwgY2FsbGJhY2tcclxuICAvL1xyXG4gIHZhciB1cGRhdGVWaWV3QmluZEVsID0gZnVuY3Rpb24oJGVsLCBjb25maWcsIHZhbCwgbW9kZWwsIGlzSW5pdGlhbGl6aW5nKSB7XHJcbiAgICB2YXIgdmlldyA9IGNvbmZpZy52aWV3O1xyXG4gICAgaWYgKCFldmFsdWF0ZUJvb2xlYW4oY29uZmlnLnVwZGF0ZVZpZXcsIHZhbCwgY29uZmlnKSkgcmV0dXJuO1xyXG4gICAgYXBwbHlWaWV3Rm4uY2FsbCh2aWV3LCBjb25maWcudXBkYXRlLCAkZWwsIHZhbCwgbW9kZWwsIGNvbmZpZyk7XHJcbiAgICBpZiAoIWlzSW5pdGlhbGl6aW5nKSBhcHBseVZpZXdGbi5jYWxsKHZpZXcsIGNvbmZpZy5hZnRlclVwZGF0ZSwgJGVsLCB2YWwsIGNvbmZpZyk7XHJcbiAgfTtcclxuXHJcbiAgLy8gRGVmYXVsdCBIYW5kbGVyc1xyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgU3RpY2tpdC5hZGRIYW5kbGVyKFt7XHJcbiAgICBzZWxlY3RvcjogJ1tjb250ZW50ZWRpdGFibGVdJyxcclxuICAgIHVwZGF0ZU1ldGhvZDogJ2h0bWwnLFxyXG4gICAgZXZlbnRzOiBbJ2lucHV0JywgJ2NoYW5nZSddXHJcbiAgfSwge1xyXG4gICAgc2VsZWN0b3I6ICdpbnB1dCcsXHJcbiAgICBldmVudHM6IFsncHJvcGVydHljaGFuZ2UnLCAnaW5wdXQnLCAnY2hhbmdlJ10sXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCRlbCwgdmFsKSB7ICRlbC52YWwodmFsKTsgfSxcclxuICAgIGdldFZhbDogZnVuY3Rpb24oJGVsKSB7XHJcbiAgICAgIHJldHVybiAkZWwudmFsKCk7XHJcbiAgICB9XHJcbiAgfSwge1xyXG4gICAgc2VsZWN0b3I6ICd0ZXh0YXJlYScsXHJcbiAgICBldmVudHM6IFsncHJvcGVydHljaGFuZ2UnLCAnaW5wdXQnLCAnY2hhbmdlJ10sXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCRlbCwgdmFsKSB7ICRlbC52YWwodmFsKTsgfSxcclxuICAgIGdldFZhbDogZnVuY3Rpb24oJGVsKSB7IHJldHVybiAkZWwudmFsKCk7IH1cclxuICB9LCB7XHJcbiAgICBzZWxlY3RvcjogJ2lucHV0W3R5cGU9XCJyYWRpb1wiXScsXHJcbiAgICBldmVudHM6IFsnY2hhbmdlJ10sXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCRlbCwgdmFsKSB7XHJcbiAgICAgICRlbC5maWx0ZXIoJ1t2YWx1ZT1cIicrdmFsKydcIl0nKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XHJcbiAgICB9LFxyXG4gICAgZ2V0VmFsOiBmdW5jdGlvbigkZWwpIHtcclxuICAgICAgcmV0dXJuICRlbC5maWx0ZXIoJzpjaGVja2VkJykudmFsKCk7XHJcbiAgICB9XHJcbiAgfSwge1xyXG4gICAgc2VsZWN0b3I6ICdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nLFxyXG4gICAgZXZlbnRzOiBbJ2NoYW5nZSddLFxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbigkZWwsIHZhbCwgbW9kZWwsIG9wdGlvbnMpIHtcclxuICAgICAgaWYgKCRlbC5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgLy8gVGhlcmUgYXJlIG11bHRpcGxlIGNoZWNrYm94ZXMgc28gd2UgbmVlZCB0byBnbyB0aHJvdWdoIHRoZW0gYW5kIGNoZWNrXHJcbiAgICAgICAgLy8gYW55IHRoYXQgaGF2ZSB2YWx1ZSBhdHRyaWJ1dGVzIHRoYXQgbWF0Y2ggd2hhdCdzIGluIHRoZSBhcnJheSBvZiBgdmFsYHMuXHJcbiAgICAgICAgdmFsIHx8ICh2YWwgPSBbXSk7XHJcbiAgICAgICAgJGVsLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcclxuICAgICAgICAgIHZhciBjaGVja2JveCA9IEJhY2tib25lLiQoZWwpO1xyXG4gICAgICAgICAgdmFyIGNoZWNrZWQgPSBfLmNvbnRhaW5zKHZhbCwgY2hlY2tib3gudmFsKCkpO1xyXG4gICAgICAgICAgY2hlY2tib3gucHJvcCgnY2hlY2tlZCcsIGNoZWNrZWQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBjaGVja2VkID0gXy5pc0Jvb2xlYW4odmFsKSA/IHZhbCA6IHZhbCA9PT0gJGVsLnZhbCgpO1xyXG4gICAgICAgICRlbC5wcm9wKCdjaGVja2VkJywgY2hlY2tlZCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBnZXRWYWw6IGZ1bmN0aW9uKCRlbCkge1xyXG4gICAgICB2YXIgdmFsO1xyXG4gICAgICBpZiAoJGVsLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICB2YWwgPSBfLnJlZHVjZSgkZWwsIGZ1bmN0aW9uKG1lbW8sIGVsKSB7XHJcbiAgICAgICAgICB2YXIgY2hlY2tib3ggPSBCYWNrYm9uZS4kKGVsKTtcclxuICAgICAgICAgIGlmIChjaGVja2JveC5wcm9wKCdjaGVja2VkJykpIG1lbW8ucHVzaChjaGVja2JveC52YWwoKSk7XHJcbiAgICAgICAgICByZXR1cm4gbWVtbztcclxuICAgICAgICB9LCBbXSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFsID0gJGVsLnByb3AoJ2NoZWNrZWQnKTtcclxuICAgICAgICAvLyBJZiB0aGUgY2hlY2tib3ggaGFzIGEgdmFsdWUgYXR0cmlidXRlIGRlZmluZWQsIHRoZW5cclxuICAgICAgICAvLyB1c2UgdGhhdCB2YWx1ZS4gTW9zdCBicm93c2VycyB1c2UgXCJvblwiIGFzIGEgZGVmYXVsdC5cclxuICAgICAgICB2YXIgYm94dmFsID0gJGVsLnZhbCgpO1xyXG4gICAgICAgIGlmIChib3h2YWwgIT09ICdvbicgJiYgYm94dmFsICE9IG51bGwpIHtcclxuICAgICAgICAgIHZhbCA9IHZhbCA/ICRlbC52YWwoKSA6IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB2YWw7XHJcbiAgICB9XHJcbiAgfSwge1xyXG4gICAgc2VsZWN0b3I6ICdzZWxlY3QnLFxyXG4gICAgZXZlbnRzOiBbJ2NoYW5nZSddLFxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbigkZWwsIHZhbCwgbW9kZWwsIG9wdGlvbnMpIHtcclxuICAgICAgdmFyIG9wdExpc3QsXHJcbiAgICAgICAgc2VsZWN0Q29uZmlnID0gb3B0aW9ucy5zZWxlY3RPcHRpb25zLFxyXG4gICAgICAgIGxpc3QgPSBzZWxlY3RDb25maWcgJiYgc2VsZWN0Q29uZmlnLmNvbGxlY3Rpb24gfHwgdW5kZWZpbmVkLFxyXG4gICAgICAgIGlzTXVsdGlwbGUgPSAkZWwucHJvcCgnbXVsdGlwbGUnKTtcclxuXHJcbiAgICAgIC8vIElmIHRoZXJlIGFyZSBubyBgc2VsZWN0T3B0aW9uc2AgdGhlbiB3ZSBhc3N1bWUgdGhhdCB0aGUgYDxzZWxlY3Q+YFxyXG4gICAgICAvLyBpcyBwcmUtcmVuZGVyZWQgYW5kIHRoYXQgd2UgbmVlZCB0byBnZW5lcmF0ZSB0aGUgY29sbGVjdGlvbi5cclxuICAgICAgaWYgKCFzZWxlY3RDb25maWcpIHtcclxuICAgICAgICBzZWxlY3RDb25maWcgPSB7fTtcclxuICAgICAgICB2YXIgZ2V0TGlzdCA9IGZ1bmN0aW9uKCRlbCkge1xyXG4gICAgICAgICAgcmV0dXJuICRlbC5tYXAoZnVuY3Rpb24oaW5kZXgsIG9wdGlvbikge1xyXG4gICAgICAgICAgICAvLyBSZXRyaWV2ZSB0aGUgdGV4dCBhbmQgdmFsdWUgb2YgdGhlIG9wdGlvbiwgcHJlZmVycmluZyBcInN0aWNraXQtYmluZC12YWxcIlxyXG4gICAgICAgICAgICAvLyBkYXRhIGF0dHJpYnV0ZSBvdmVyIHZhbHVlIHByb3BlcnR5LlxyXG4gICAgICAgICAgICB2YXIgZGF0YVZhbCA9IEJhY2tib25lLiQob3B0aW9uKS5kYXRhKCdzdGlja2l0LWJpbmQtdmFsJyk7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgdmFsdWU6IGRhdGFWYWwgIT09IHVuZGVmaW5lZCA/IGRhdGFWYWwgOiBvcHRpb24udmFsdWUsXHJcbiAgICAgICAgICAgICAgbGFiZWw6IG9wdGlvbi50ZXh0XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICB9KS5nZXQoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICgkZWwuZmluZCgnb3B0Z3JvdXAnKS5sZW5ndGgpIHtcclxuICAgICAgICAgIGxpc3QgPSB7b3B0X2xhYmVsczpbXX07XHJcbiAgICAgICAgICAvLyBTZWFyY2ggZm9yIG9wdGlvbnMgd2l0aG91dCBvcHRncm91cFxyXG4gICAgICAgICAgaWYgKCRlbC5maW5kKCc+IG9wdGlvbicpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBsaXN0Lm9wdF9sYWJlbHMucHVzaCh1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICBfLmVhY2goJGVsLmZpbmQoJz4gb3B0aW9uJyksIGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgICAgICAgbGlzdFt1bmRlZmluZWRdID0gZ2V0TGlzdChCYWNrYm9uZS4kKGVsKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXy5lYWNoKCRlbC5maW5kKCdvcHRncm91cCcpLCBmdW5jdGlvbihlbCkge1xyXG4gICAgICAgICAgICB2YXIgbGFiZWwgPSBCYWNrYm9uZS4kKGVsKS5hdHRyKCdsYWJlbCcpO1xyXG4gICAgICAgICAgICBsaXN0Lm9wdF9sYWJlbHMucHVzaChsYWJlbCk7XHJcbiAgICAgICAgICAgIGxpc3RbbGFiZWxdID0gZ2V0TGlzdChCYWNrYm9uZS4kKGVsKS5maW5kKCdvcHRpb24nKSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbGlzdCA9IGdldExpc3QoJGVsLmZpbmQoJ29wdGlvbicpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEZpbGwgaW4gZGVmYXVsdCBsYWJlbCBhbmQgcGF0aCB2YWx1ZXMuXHJcbiAgICAgIHNlbGVjdENvbmZpZy52YWx1ZVBhdGggPSBzZWxlY3RDb25maWcudmFsdWVQYXRoIHx8ICd2YWx1ZSc7XHJcbiAgICAgIHNlbGVjdENvbmZpZy5sYWJlbFBhdGggPSBzZWxlY3RDb25maWcubGFiZWxQYXRoIHx8ICdsYWJlbCc7XHJcbiAgICAgIHNlbGVjdENvbmZpZy5kaXNhYmxlZFBhdGggPSBzZWxlY3RDb25maWcuZGlzYWJsZWRQYXRoIHx8ICdkaXNhYmxlZCc7XHJcblxyXG4gICAgICB2YXIgYWRkU2VsZWN0T3B0aW9ucyA9IGZ1bmN0aW9uKG9wdExpc3QsICRlbCwgZmllbGRWYWwpIHtcclxuICAgICAgICBfLmVhY2gob3B0TGlzdCwgZnVuY3Rpb24ob2JqKSB7XHJcbiAgICAgICAgICB2YXIgb3B0aW9uID0gQmFja2JvbmUuJCgnPG9wdGlvbi8+JyksIG9wdGlvblZhbCA9IG9iajtcclxuXHJcbiAgICAgICAgICB2YXIgZmlsbE9wdGlvbiA9IGZ1bmN0aW9uKHRleHQsIHZhbCwgZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgb3B0aW9uLnRleHQodGV4dCk7XHJcbiAgICAgICAgICAgIG9wdGlvblZhbCA9IHZhbDtcclxuICAgICAgICAgICAgLy8gU2F2ZSB0aGUgb3B0aW9uIHZhbHVlIGFzIGRhdGEgc28gdGhhdCB3ZSBjYW4gcmVmZXJlbmNlIGl0IGxhdGVyLlxyXG4gICAgICAgICAgICBvcHRpb24uZGF0YSgnc3RpY2tpdC1iaW5kLXZhbCcsIG9wdGlvblZhbCk7XHJcbiAgICAgICAgICAgIGlmICghXy5pc0FycmF5KG9wdGlvblZhbCkgJiYgIV8uaXNPYmplY3Qob3B0aW9uVmFsKSkgb3B0aW9uLnZhbChvcHRpb25WYWwpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGRpc2FibGVkID09PSB0cnVlKSBvcHRpb24ucHJvcCgnZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgdmFyIHRleHQsIHZhbCwgZGlzYWJsZWQ7XHJcbiAgICAgICAgICBpZiAob2JqID09PSAnX19kZWZhdWx0X18nKSB7XHJcbiAgICAgICAgICAgIHRleHQgPSBmaWVsZFZhbC5sYWJlbCxcclxuICAgICAgICAgICAgdmFsID0gZmllbGRWYWwudmFsdWUsXHJcbiAgICAgICAgICAgIGRpc2FibGVkID0gZmllbGRWYWwuZGlzYWJsZWQ7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0ZXh0ID0gZXZhbHVhdGVQYXRoKG9iaiwgc2VsZWN0Q29uZmlnLmxhYmVsUGF0aCksXHJcbiAgICAgICAgICAgIHZhbCA9IGV2YWx1YXRlUGF0aChvYmosIHNlbGVjdENvbmZpZy52YWx1ZVBhdGgpLFxyXG4gICAgICAgICAgICBkaXNhYmxlZCA9IGV2YWx1YXRlUGF0aChvYmosIHNlbGVjdENvbmZpZy5kaXNhYmxlZFBhdGgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZmlsbE9wdGlvbih0ZXh0LCB2YWwsIGRpc2FibGVkKTtcclxuXHJcbiAgICAgICAgICAvLyBEZXRlcm1pbmUgaWYgdGhpcyBvcHRpb24gaXMgc2VsZWN0ZWQuXHJcbiAgICAgICAgICB2YXIgaXNTZWxlY3RlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAoIWlzTXVsdGlwbGUgJiYgb3B0aW9uVmFsICE9IG51bGwgJiYgZmllbGRWYWwgIT0gbnVsbCAmJiBvcHRpb25WYWwgPT09IGZpZWxkVmFsKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXy5pc09iamVjdChmaWVsZFZhbCkgJiYgXy5pc0VxdWFsKG9wdGlvblZhbCwgZmllbGRWYWwpKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICBpZiAoaXNTZWxlY3RlZCgpKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbi5wcm9wKCdzZWxlY3RlZCcsIHRydWUpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChpc011bHRpcGxlICYmIF8uaXNBcnJheShmaWVsZFZhbCkpIHtcclxuICAgICAgICAgICAgXy5lYWNoKGZpZWxkVmFsLCBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgICAgICAgICBpZiAoXy5pc09iamVjdCh2YWwpKSB2YWwgPSBldmFsdWF0ZVBhdGgodmFsLCBzZWxlY3RDb25maWcudmFsdWVQYXRoKTtcclxuICAgICAgICAgICAgICBpZiAodmFsID09PSBvcHRpb25WYWwgfHwgKF8uaXNPYmplY3QodmFsKSAmJiBfLmlzRXF1YWwob3B0aW9uVmFsLCB2YWwpKSlcclxuICAgICAgICAgICAgICAgIG9wdGlvbi5wcm9wKCdzZWxlY3RlZCcsIHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAkZWwuYXBwZW5kKG9wdGlvbik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkZWwuZmluZCgnKicpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgLy8gVGhlIGBsaXN0YCBjb25maWd1cmF0aW9uIGlzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBvcHRpb25zIGxpc3Qgb3IgYSBzdHJpbmdcclxuICAgICAgLy8gd2hpY2ggcmVwcmVzZW50cyB0aGUgcGF0aCB0byB0aGUgbGlzdCByZWxhdGl2ZSB0byBgd2luZG93YCBvciB0aGUgdmlldy9gdGhpc2AuXHJcbiAgICAgIGlmIChfLmlzU3RyaW5nKGxpc3QpKSB7XHJcbiAgICAgICAgdmFyIGNvbnRleHQgPSB3aW5kb3c7XHJcbiAgICAgICAgaWYgKGxpc3QuaW5kZXhPZigndGhpcy4nKSA9PT0gMCkgY29udGV4dCA9IHRoaXM7XHJcbiAgICAgICAgbGlzdCA9IGxpc3QucmVwbGFjZSgvXlthLXpdKlxcLiguKykkLywgJyQxJyk7XHJcbiAgICAgICAgb3B0TGlzdCA9IGV2YWx1YXRlUGF0aChjb250ZXh0LCBsaXN0KTtcclxuICAgICAgfSBlbHNlIGlmIChfLmlzRnVuY3Rpb24obGlzdCkpIHtcclxuICAgICAgICBvcHRMaXN0ID0gYXBwbHlWaWV3Rm4uY2FsbCh0aGlzLCBsaXN0LCAkZWwsIG9wdGlvbnMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG9wdExpc3QgPSBsaXN0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBTdXBwb3J0IEJhY2tib25lLkNvbGxlY3Rpb24gYW5kIGRlc2VyaWFsaXplLlxyXG4gICAgICBpZiAob3B0TGlzdCBpbnN0YW5jZW9mIEJhY2tib25lLkNvbGxlY3Rpb24pIHtcclxuICAgICAgICB2YXIgY29sbGVjdGlvbiA9IG9wdExpc3Q7XHJcbiAgICAgICAgdmFyIHJlZnJlc2hTZWxlY3RPcHRpb25zID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICB2YXIgY3VycmVudFZhbCA9IGdldEF0dHIobW9kZWwsIG9wdGlvbnMub2JzZXJ2ZSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICBhcHBseVZpZXdGbi5jYWxsKHRoaXMsIG9wdGlvbnMudXBkYXRlLCAkZWwsIGN1cnJlbnRWYWwsIG1vZGVsLCBvcHRpb25zKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIFdlIG5lZWQgdG8gY2FsbCB0aGlzIGZ1bmN0aW9uIGFmdGVyIHVuc3RpY2tpdCBhbmQgYWZ0ZXIgYW4gdXBkYXRlIHNvIHdlIGRvbid0IGVuZCB1cFxyXG4gICAgICAgIC8vIHdpdGggbXVsdGlwbGUgbGlzdGVuZXJzIGRvaW5nIHRoZSBzYW1lIHRoaW5nXHJcbiAgICAgICAgdmFyIHJlbW92ZUNvbGxlY3Rpb25MaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGNvbGxlY3Rpb24ub2ZmKCdhZGQgcmVtb3ZlIHJlc2V0IHNvcnQnLCByZWZyZXNoU2VsZWN0T3B0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgcmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICByZW1vdmVDb2xsZWN0aW9uTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgICBjb2xsZWN0aW9uLm9mZignc3RpY2tpdDpzZWxlY3RSZWZyZXNoJyk7XHJcbiAgICAgICAgICBtb2RlbC5vZmYoJ3N0aWNraXQ6c2VsZWN0UmVmcmVzaCcpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy8gUmVtb3ZlIHByZXZpb3VzbHkgc2V0IGV2ZW50IGxpc3RlbmVycyBieSB0cmlnZ2VyaW5nIGEgY3VzdG9tIGV2ZW50XHJcbiAgICAgICAgY29sbGVjdGlvbi50cmlnZ2VyKCdzdGlja2l0OnNlbGVjdFJlZnJlc2gnKTtcclxuICAgICAgICBjb2xsZWN0aW9uLm9uY2UoJ3N0aWNraXQ6c2VsZWN0UmVmcmVzaCcsIHJlbW92ZUNvbGxlY3Rpb25MaXN0ZW5lcnMsIHRoaXMpO1xyXG5cclxuICAgICAgICAvLyBMaXN0ZW4gdG8gdGhlIGNvbGxlY3Rpb24gYW5kIHRyaWdnZXIgYW4gdXBkYXRlIG9mIHRoZSBzZWxlY3Qgb3B0aW9uc1xyXG4gICAgICAgIGNvbGxlY3Rpb24ub24oJ2FkZCByZW1vdmUgcmVzZXQgc29ydCcsIHJlZnJlc2hTZWxlY3RPcHRpb25zLCB0aGlzKTtcclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBwcmV2aW91cyBtb2RlbCBldmVudCBsaXN0ZW5lclxyXG4gICAgICAgIG1vZGVsLnRyaWdnZXIoJ3N0aWNraXQ6c2VsZWN0UmVmcmVzaCcpO1xyXG4gICAgICAgIG1vZGVsLm9uY2UoJ3N0aWNraXQ6c2VsZWN0UmVmcmVzaCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgbW9kZWwub2ZmKCdzdGlja2l0OnVuc3R1Y2snLCByZW1vdmVBbGxMaXN0ZW5lcnMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIFJlbW92ZSBjb2xsZWN0aW9uIGV2ZW50IGxpc3RlbmVycyBvbmNlIHRoaXMgYmluZGluZyBpcyB1bnN0dWNrXHJcbiAgICAgICAgbW9kZWwub25jZSgnc3RpY2tpdDp1bnN0dWNrJywgcmVtb3ZlQWxsTGlzdGVuZXJzLCB0aGlzKTtcclxuICAgICAgICBvcHRMaXN0ID0gb3B0TGlzdC50b0pTT04oKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHNlbGVjdENvbmZpZy5kZWZhdWx0T3B0aW9uKSB7XHJcbiAgICAgICAgdmFyIG9wdGlvbiA9IF8uaXNGdW5jdGlvbihzZWxlY3RDb25maWcuZGVmYXVsdE9wdGlvbikgP1xyXG4gICAgICAgICAgc2VsZWN0Q29uZmlnLmRlZmF1bHRPcHRpb24uY2FsbCh0aGlzLCAkZWwsIG9wdGlvbnMpIDpcclxuICAgICAgICAgIHNlbGVjdENvbmZpZy5kZWZhdWx0T3B0aW9uO1xyXG4gICAgICAgIGFkZFNlbGVjdE9wdGlvbnMoW1wiX19kZWZhdWx0X19cIl0sICRlbCwgb3B0aW9uKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKF8uaXNBcnJheShvcHRMaXN0KSkge1xyXG4gICAgICAgIGFkZFNlbGVjdE9wdGlvbnMob3B0TGlzdCwgJGVsLCB2YWwpO1xyXG4gICAgICB9IGVsc2UgaWYgKG9wdExpc3Qub3B0X2xhYmVscykge1xyXG4gICAgICAgIC8vIFRvIGRlZmluZSBhIHNlbGVjdCB3aXRoIG9wdGdyb3VwcywgZm9ybWF0IHNlbGVjdE9wdGlvbnMuY29sbGVjdGlvbiBhcyBhbiBvYmplY3RcclxuICAgICAgICAvLyB3aXRoIGFuICdvcHRfbGFiZWxzJyBwcm9wZXJ0eSwgYXMgaW4gdGhlIGZvbGxvd2luZzpcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgICB7XHJcbiAgICAgICAgLy8gICAgICAgJ29wdF9sYWJlbHMnOiBbJ0xvb25leSBUdW5lcycsICdUaHJlZSBTdG9vZ2VzJ10sXHJcbiAgICAgICAgLy8gICAgICAgJ0xvb25leSBUdW5lcyc6IFt7aWQ6IDEsIG5hbWU6ICdCdWdzIEJ1bm55J30sIHtpZDogMiwgbmFtZTogJ0RvbmFsZCBEdWNrJ31dLFxyXG4gICAgICAgIC8vICAgICAgICdUaHJlZSBTdG9vZ2VzJzogW3tpZDogMywgbmFtZSA6ICdtb2UnfSwge2lkOiA0LCBuYW1lIDogJ2xhcnJ5J30sIHtpZDogNSwgbmFtZSA6ICdjdXJseSd9XVxyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy9cclxuICAgICAgICBfLmVhY2gob3B0TGlzdC5vcHRfbGFiZWxzLCBmdW5jdGlvbihsYWJlbCkge1xyXG4gICAgICAgICAgdmFyICRncm91cCA9IEJhY2tib25lLiQoJzxvcHRncm91cC8+JykuYXR0cignbGFiZWwnLCBsYWJlbCk7XHJcbiAgICAgICAgICBhZGRTZWxlY3RPcHRpb25zKG9wdExpc3RbbGFiZWxdLCAkZ3JvdXAsIHZhbCk7XHJcbiAgICAgICAgICAkZWwuYXBwZW5kKCRncm91cCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gV2l0aCBubyAnb3B0X2xhYmVscycgcGFyYW1ldGVyLCB0aGUgb2JqZWN0IGlzIGFzc3VtZWQgdG8gYmUgYSBzaW1wbGUgdmFsdWUtbGFiZWwgbWFwLlxyXG4gICAgICAgIC8vIFBhc3MgYSBzZWxlY3RPcHRpb25zLmNvbXBhcmF0b3IgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgb3JkZXIgb2YgYWxwaGFiZXRpY2FsIGJ5IGxhYmVsLlxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBvcHRzID0gW10sIG9wdDtcclxuICAgICAgICBmb3IgKHZhciBpIGluIG9wdExpc3QpIHtcclxuICAgICAgICAgIG9wdCA9IHt9O1xyXG4gICAgICAgICAgb3B0W3NlbGVjdENvbmZpZy52YWx1ZVBhdGhdID0gaTtcclxuICAgICAgICAgIG9wdFtzZWxlY3RDb25maWcubGFiZWxQYXRoXSA9IG9wdExpc3RbaV07XHJcbiAgICAgICAgICBvcHRzLnB1c2gob3B0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb3B0cyA9IF8uc29ydEJ5KG9wdHMsIHNlbGVjdENvbmZpZy5jb21wYXJhdG9yIHx8IHNlbGVjdENvbmZpZy5sYWJlbFBhdGgpO1xyXG4gICAgICAgIGFkZFNlbGVjdE9wdGlvbnMob3B0cywgJGVsLCB2YWwpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgZ2V0VmFsOiBmdW5jdGlvbigkZWwpIHtcclxuICAgICAgdmFyIHNlbGVjdGVkID0gJGVsLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpO1xyXG5cclxuICAgICAgaWYgKCRlbC5wcm9wKCdtdWx0aXBsZScpKSB7XHJcbiAgICAgICAgcmV0dXJuIF8ubWFwKHNlbGVjdGVkLCBmdW5jdGlvbihlbCkge1xyXG4gICAgICAgICAgcmV0dXJuIEJhY2tib25lLiQoZWwpLmRhdGEoJ3N0aWNraXQtYmluZC12YWwnKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gc2VsZWN0ZWQuZGF0YSgnc3RpY2tpdC1iaW5kLXZhbCcpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfV0pO1xyXG5cclxuICByZXR1cm4gU3RpY2tpdDtcclxuXHJcbn0pKTtcclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgTkJQMTAwMDgzIG9uIDE1LjA4LjIwMTUuXHJcbiAqL1xyXG5cclxuXHJcbnJlcXVpcmUoJy4vTC5Db250cm9sLk1vdXNlUG9zaXRpb24nKTtcclxucmVxdWlyZSgnLi9MLkNvbnRyb2wuTG9jYXRlJyk7XHJcbnJlcXVpcmUoJy4vTC5HZW9kZXNpYycpO1xyXG5yZXF1aXJlKCcuL2JhY2tib25lLnN0aWNraXQnKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBhbGV4IG9uIDAxLjA5LjIwMTUuXHJcbiAqL1xyXG5cclxudmFyIENtZCA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcclxuICAgIGV2ZW50czogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFwiY2xpY2sgW2RhdGEtY29tbWFuZF1cIjogXCJfb25Db21tYW5kXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9vbkNvbW1hbmQ6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdmFyICRlbCA9ICQoZS5jdXJyZW50VGFyZ2V0KSxcclxuICAgICAgICAgICAgY21kID0gJGVsLmRhdGEoJ2NvbW1hbmQnKTtcclxuICAgICAgICBpZiAodGhpc1tjbWRdKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpc1tjbWRdKGUpO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGFsZXJ0KCdDb21tYW5kIFsnICsgY21kICsgJ10gbm90IGRlZmF1bHQgISEhICcpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ21kO1xyXG5cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgYWxleCBvbiAwMS4wOS4yMDE1LlxyXG4gKi9cclxuXHJcbnZhciBWaWV3ID0gTC5Qb3B1cC5leHRlbmQoe1xyXG4gICAgb3B0aW9uczoge1xyXG4gICAgICAgIG1heFdpZHRoOiA4MDAsXHJcbiAgICAgICAgYXV0b1BhblBhZGRpbmc6IEwucG9pbnQoMjAsIDcwKSxcclxuICAgICAgICBodG1sV2FpdDogJCgnI3RlbXAtaW5mby13YWl0JykuaHRtbCgpXHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgVmlldy5fX3N1cGVyX18uaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIG9wdGlvbnMubGF0bG5nICYmIHRoaXMuc2V0TGF0TG5nKG9wdGlvbnMubGF0bG5nKTtcclxuICAgICAgICBpZiAob3B0aW9ucy5jb250ZW50KVxyXG4gICAgICAgICAgICB0aGlzLnNldENvbnRlbnQob3B0aW9ucy5jb250ZW50KTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5odG1sV2FpdCAmJiB0aGlzLl93YWl0KHRoaXMub3B0aW9ucy5odG1sV2FpdCk7XHJcbiAgICB9LFxyXG4gICAgc2V0Q29udGVudDogZnVuY3Rpb24gKGNvbnRlbnQpIHtcclxuICAgICAgICBpZiAoY29udGVudCBpbnN0YW5jZW9mICBCYWNrYm9uZS5WaWV3KVxyXG4gICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5lbDtcclxuICAgICAgICAkKHRoaXMuX2NvbnRhaW5lcikuc2hvdygpO1xyXG4gICAgICAgIHJldHVybiBWaWV3Ll9fc3VwZXJfXy5zZXRDb250ZW50LmNhbGwodGhpcywgY29udGVudCk7XHJcbiAgICB9LFxyXG4gICAgcmVDb250ZW50OiBmdW5jdGlvbiAoY29udGVudCkge1xyXG4gICAgICAgIHRoaXMuc2V0Q29udGVudChjb250ZW50KTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSxcclxuICAgIF93YWl0OiBmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgICAgIHRoaXMuc2V0Q29udGVudChjb250ZXh0KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7XHJcblxyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBhbGV4IG9uIDAxLjA5LjIwMTUuXHJcbiAqL1xyXG52YXIgTWFzayA9IHJlcXVpcmUoJy4uL21hc2snKTtcclxuXHJcbnZhciBSZW1vdGUgPSB7XHJcbiAgICBNb2RlbDoge1xyXG4gICAgICAgIHJlbW90ZUZpZWxkOiAncmVtb3RlRXJyJyxcclxuICAgICAgICByZW1vdGVWYWxpZGF0ZTogZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICB2YXIgYXR0ciA9IHRoaXMudG9KU09OKCk7XHJcbiAgICAgICAgICAgIGF0dHJbdGhpcy5yZW1vdGVGaWVsZF0gPSBlcnI7XHJcbiAgICAgICAgICAgIHRoaXMudmFsaWRhdGUoYXR0cik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtZXNzYWdlRXJyb3I6IGZ1bmN0aW9uICh4aHIpIHtcclxuICAgICAgICAgICAgaWYgKHhoci5yZXNwb25zZUpTT04gJiYgeGhyLnJlc3BvbnNlSlNPTi5tZXNzYWdlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHhoci5yZXNwb25zZUpTT04ubWVzc2FnZTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEwuVXRpbC50ZW1wbGF0ZSgnRXJyb3I6IHtzdGF0dXN9LiB7c3RhdHVzVGV4dH0nLCB4aHIpO1xyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgVmlldzoge1xyXG4gICAgICAgIG9uUmVxdWVzdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tYXNrKCkuc3RhcnQoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uU3luYzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tYXNrKCkuZW5kKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbkVycm9yOiBmdW5jdGlvbiAobW9kZWwsIHhociwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICB0aGlzLl9tYXNrKCkuZW5kKDUwMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tb2RlbC5yZW1vdGVWYWxpZGF0ZSh4aHIpO1xyXG4gICAgICAgICAgICB9LCB0aGlzKTtcclxuXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgX21hc2tTZWxlY3RvcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgX21hc2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9fbWFzaykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fX21hc2sgPSBuZXcgTWFzayh7ZWw6IHRoaXMuX21hc2tTZWxlY3RvcigpfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19tYXNrO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgX3NldFJlbW90ZUV2ZW50czogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLm9uKCdlcnJvcicsIHRoaXMub25FcnJvciwgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMubW9kZWwub24oJ3N5bmMnLCB0aGlzLm9uU3luYywgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMubW9kZWwub24oJ3JlcXVlc3QnLCB0aGlzLm9uUmVxdWVzdCwgdGhpcyk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlbW90ZTtcclxuXHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGFsZXggb24gMDEuMDkuMjAxNS5cclxuICovXHJcbnZhciBDb21tYW5kVmlldyA9IHJlcXVpcmUoJy4vY29tbWFuZCcpO1xyXG5cclxudmFyIFRhYnMgPSBDb21tYW5kVmlldy5leHRlbmQoe1xyXG4gICAgZWw6ICQoJyN0ZW1wLXRhYnMtc2ltcGxlJykuaHRtbCgpLFxyXG5cclxuICAgIC8vINC/0L7Qu9GD0YfQuNGC0Ywg0LLQutC70LDQtNC60Lgg0LjQu9C4INCy0LrQu9Cw0LTQutGDINC/0L4g0LjQvdC00LXQutGB0YNcclxuICAgICR0YWJzOiBmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICB2YXIgaXRlbXMgPSB0aGlzLiQoJ3VsLm5hdi5uYXYtdGFicyBsaSBhJyk7XHJcbiAgICAgICAgcmV0dXJuIF8uaXNOdW1iZXIoaW5kZXgpID8gaXRlbXMuZXEoaW5kZXgpIDogaXRlbXM7XHJcbiAgICB9LFxyXG4gICAgLy8g0L/QvtC70YPRh9C40YLRjCBjb250ZW50INCy0LrQu9Cw0LTQutC4XHJcbiAgICAkdGFiQ29udGVudDogZnVuY3Rpb24gKHRhYikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLiQoJCh0YWIpLmF0dHIoJ2hyZWYnKSk7XHJcbiAgICB9LFxyXG5cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRhYnM7XHJcblxyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBhbGV4IG9uIDEwLjA4LjIwMTUuXHJcbiAqL1xyXG5cclxudmFyIEJhc2UgPSByZXF1aXJlKCcuLi8uLi9saWJzL2Zvb3RlcicpO1xyXG52YXIgRm9vdGVyID0gQmFzZS5leHRlbmQoe1xyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICBGb290ZXIuX19zdXBlcl9fLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICB0aGlzLm9uKCdhbGwnLCB0aGlzLm9uRXZlbnRzLCB0aGlzKTtcclxuICAgIH0sXHJcbiAgICBvbkV2ZW50czogZnVuY3Rpb24gKG5hbWUsIGhlaWdodCkge1xyXG4gICAgICAgIGlmICh+WydvcGVuJywgJ2Nsb3NlJywgJ3Jlc2l6ZSddLmluZGV4T2YobmFtZSkpXHJcbiAgICAgICAgICAgIGFwcC5ldmVudHMuY2hhbm5lbCgnc2NyZWVuJykudHJpZ2dlcignZm9vdGVyOicgKyBuYW1lLCBoZWlnaHQpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcblxyXG52YXIgRm9vdGVycyA9IEwuQ2xhc3MuZXh0ZW5kKHtcclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChmb290ZXJzLCBvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZm9vdGVycyA9IGZvb3RlcnMubWFwKHRoaXMuX2NyZWF0ZSwgdGhpcyk7XHJcbiAgICB9LFxyXG5cclxuICAgIG9uT3BlbjogZnVuY3Rpb24gKGgsIGZvb3Rlcikge1xyXG4gICAgICAgIHRoaXMuYWN0aXZlICYmIHRoaXMuYWN0aXZlICE9PSBmb290ZXIgJiYgdGhpcy5hY3RpdmUuY2xvc2UodHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmb290ZXI7XHJcbiAgICB9LFxyXG4gICAgX2NyZWF0ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgZm9vdGVyID0gbmV3IEZvb3RlcihvcHRpb25zKTtcclxuICAgICAgICBmb290ZXIub24oJ29wZW4nLCB0aGlzLm9uT3BlbiwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG59KTtcclxuXHJcbm5ldyBGb290ZXJzKFtcclxuICAgIHtcclxuICAgICAgICBrZXlQcmVzczogJzEnLFxyXG4gICAgICAgIGhlaWdodDogNTAsXHJcbiAgICAgICAgbWluSGVpZ2h0OiAxMCxcclxuICAgICAgICBtYXhIZWlnaHQ6IDcwXHJcbiAgICB9LCB7XHJcbiAgICAgICAgY29udGVudDogJCgnPGRpdi8+Jywge1xyXG4gICAgICAgICAgICBpZDogJ0NOVC05MCcsXHJcbiAgICAgICAgICAgIHRpdGxlOiAnQmVjb21lIGEgR29vZ2xlcicsXHJcbiAgICAgICAgICAgIHRleHQ6ICfRg9GB0YLQsNC90L7QstC40Lwg0LXRidC1INC+0LTQuNC9INC+0LHRgNCw0LHQvtGC0YfQuNC6INGB0L7QsdGL0YLQuNGPIGtleXByZXNzLCDQvdCwINGN0YLQvtGCINGA0LDQtyDRjdC70LXQvNC10L3RgtCw0LwgJ1xyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGtleVByZXNzOiAnMicsXHJcbiAgICAgICAgaGVpZ2h0OiAyMCxcclxuICAgICAgICBtaW5IZWlnaHQ6IDEwLFxyXG4gICAgICAgIG1heEhlaWdodDogNzBcclxuICAgIH0sIHtcclxuICAgICAgICBjb250ZW50OiAkKCcjdGVtcC1mb290ZXItcHJpbnQnKS5odG1sKCksXHJcbiAgICAgICAga2V5UHJlc3M6ICczJyxcclxuICAgICAgICBoZWlnaHQ6IDEwMCxcclxuICAgICAgICBtaW5IZWlnaHQ6IDgwLFxyXG4gICAgICAgIG1heEhlaWdodDogMTAxXHJcbiAgICB9XHJcbl0pO1xyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSDvv73vv73vv73vv73vv73vv73vv73vv73vv70gb24gMTMuMDkuMjAxNS5cclxuICovXHJcblxyXG5yZXF1aXJlKCcuL21hcCcpO1xyXG5yZXF1aXJlKCcuL21lbnUnKTtcclxucmVxdWlyZSgnLi9tYXBzJyk7XHJcbnJlcXVpcmUoJy4vZm9vdGVycycpO1xyXG5cclxucmVxdWlyZSgnLi9zZWEnKTtcclxucmVxdWlyZSgnLi9yb3V0ZScpO1xyXG5yZXF1aXJlKCcuL2luZm8nKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBhbGV4IG9uIDMxLjA4LjIwMTUuXHJcbiAqL1xyXG5cclxuLy9odHRwOi8vb3BlbnBvcnRndWlkZS5vcmcvY2dpLWJpbi93ZWF0aGVyL3dlYXRoZXIucGwvd2VhdGhlci5wbmc/dmFyPW1ldGVvZ3JhbSZueD02MTQmbnk9NzUwJmxhdD01Ni4wJmxvbj00My4wJmxhbmc9cnUmdW5pdD1tZXRyaWMmbGFiZWw9UGlyYXRlX0JheVxyXG52YXIgZXZlbnRzID0gYXBwLmV2ZW50cy5jaGFubmVsKCdpbmZvJyk7XHJcblxyXG5ldmVudHMub24oJ21hcCcsIHJlcXVpcmUoJy4vbG9jYWwnKSwgdGhpcyApO1xyXG5ldmVudHMub24oJ3JvdXRlOnZlcnRleCcsIHJlcXVpcmUoJy4vcm91dGUtdmVydGV4JyksIHRoaXMgKTtcclxuXHJcblxyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBhbGV4IG9uIDMxLjA4LjIwMTUuXHJcbiAqL1xyXG5cclxudmFyIFBvcHVwID0gcmVxdWlyZSgnLi4vLi4vbGlicy92aWV3cy9wb3B1cCcpLFxyXG4gICAgVGFicyA9IHJlcXVpcmUoJy4uLy4uL2xpYnMvdmlld3MvdGFicycpO1xyXG5cclxuXHJcbnZhciBDb2xsZWN0aW9uID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xyXG4gICAgdXJsOiAnL2FwaS9sb2NhbCcsXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0ciwgb3B0aW9ucykge1xyXG5cclxuICAgIH0sXHJcblxyXG59KVxyXG5cclxudmFyIFZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy4kZWwuZW1wdHkoKTtcclxuICAgICAgICAvL3RoaXMuJGVsLmFwcGVuZCgnPHByZT4nKVxyXG4gICAgICAgIHZhciBtb2RlbCA9IHRoaXMuY29sbGVjdGlvbi5hdCgwKTtcclxuICAgICAgICB0aGlzLiRlbC5hcHBlbmQoICk7XHJcbiAgICAgICAgdGhpcy4kZWwuYXBwZW5kKEwuVXRpbC50ZW1wbGF0ZSgnPHA+Q291bnQ6e2xlbmd0aH08L3A+JywgdGhpcy5jb2xsZWN0aW9uKSk7XHJcbiAgICAgICAgbW9kZWwgJiYgdGhpcy4kZWwuYXBwZW5kKEwuVXRpbC50ZW1wbGF0ZShcIjxwcmU+e25hbWV9PC9wcmU+XCIsIHtuYW1lOiBKU09OLnN0cmluZ2lmeShtb2RlbC50b0pTT04oKSwgbnVsbCwgNCl9KSk7XHJcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uLmVhY2goZnVuY3Rpb24gKG1vZGVsKSB7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gbW9kZWwuZ2V0KCdzZWFtYXJrOnR5cGUnKTtcclxuICAgICAgICAgICAgbmFtZSAmJiB0aGlzLiRlbC5hcHBlbmQoTC5VdGlsLnRlbXBsYXRlKFwiPGxpPntuYW1lfTwvbGk+XCIse25hbWU6bmFtZX0pKTtcclxuICAgICAgICB9LCB0aGlzKTtcclxuICAgICAgICB0aGlzLiRlbC5hcHBlbmQoJzwvcHJlPicpXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG4gICAgbG9hZDogZnVuY3Rpb24gKGxhdGxuZykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24uZmV0Y2goe2RhdGE6IHtsYXQ6IGxhdGxuZy5sYXQsIGxuZzogbGF0bG5nLmxuZywgZGlzdGFuY2U6IHRoaXMuX2Rpc3RhbmNlKGxhdGxuZyl9fSk7XHJcbiAgICB9LFxyXG5cclxuICAgIF9kaXN0YW5jZTogZnVuY3Rpb24gKGxhdGxuZykge1xyXG4gICAgICAgIHZhciBwb2ludCA9IGxhdGxuZy50b1BvaW50KGFwcC5tYXApO1xyXG4gICAgICAgIHBvaW50LnkgKz0gMTA7XHJcbiAgICAgICAgdmFyIG9mZnNldCA9IHBvaW50LnRvTGF0TG5nKGFwcC5tYXApO1xyXG4gICAgICAgIHZhciBkaXN0ID0gbGF0bG5nLmRpc3RhbmNlVG8ob2Zmc2V0KTtcclxuICAgICAgICByZXR1cm4gZGlzdDtcclxuICAgIH1cclxufSlcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGUpIHtcclxuICAgIHZhciBwb3B1cCA9IG5ldyBQb3B1cCh7XHJcbiAgICAgICAgbGF0bG5nOiBlLmxhdGxuZyxcclxuICAgIH0pLm9wZW5PbihhcHAubWFwKTtcclxuXHJcbiAgICB2YXIgdmlldyA9IG5ldyBWaWV3KHtjb2xsZWN0aW9uOiBuZXcgQ29sbGVjdGlvbigpfSk7XHJcblxyXG4gICAgdmlldy5sb2FkKGUubGF0bG5nKVxyXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcG9wdXAucmVDb250ZW50KHZpZXcucmVuZGVyKCkpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmZhaWwoZnVuY3Rpb24gKHhocikge1xyXG4gICAgICAgICAgICBwb3B1cC5yZUNvbnRlbnQoTC5VdGlsLnRlbXBsYXRlKFwiRXJyb3I6e3N0YXR1c30uIHtzdGF0dXNUZXh0fVwiLCB4aHIpKTtcclxuICAgICAgICB9KTtcclxufSIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGFsZXggb24gMzEuMDguMjAxNS5cclxuICovXHJcblxyXG52YXIgUG9wdXAgPSByZXF1aXJlKCcuLi8uLi9saWJzL3ZpZXdzL3BvcHVwJyksXHJcbiAgICBDbWQgPSByZXF1aXJlKCcuLi8uLi9saWJzL3ZpZXdzL2NvbW1hbmQnKSxcclxuICAgIE15Q21kID0gQ21kLmV4dGVuZCh7XHJcbiAgICAgICAgdGVtcGxhdGU6IF8udGVtcGxhdGUoJCgnI3RlbXAtaW5mby1yb3V0ZS12ZXJ0ZXgnKS5odG1sKCkpLFxyXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNtZFRlc3Q6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIC8vZGVidWdnZXI7XHJcbiAgICAgICAgICAgIGFsZXJ0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLiRlbC5hcHBlbmQodGhpcy50ZW1wbGF0ZSh7XHJcbiAgICAgICAgICAgICAgICBqc29uOiBKU09OLnN0cmluZ2lmeSh0aGlzLm1vZGVsLnRvSlNPTigpLCBudWxsLCA0KVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGUpIHtcclxuXHJcbiAgICB2YXIgcG9wdXAgPSBuZXcgUG9wdXAoe1xyXG4gICAgICAgIGxhdGxuZzogZS5sYXRsbmcsXHJcbiAgICAgICAgY29udGVudDogbmV3IE15Q21kKHttb2RlbDogZS5tb2RlbH0pXHJcbiAgICAgICAgLy9odG1sV2FpdDogJ0doYmR0bidcclxuICAgIH0pLm9wZW5PbihhcHAubWFwKTtcclxuXHJcbiAgICAvL3NldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gICAgcG9wdXAucmVDb250ZW50KG5ldyBNeVRhYnMoe21vZGVsOiBlLm1vZGVsfSkpO1xyXG4gICAgLy99LCA1MDApO1xyXG59OyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGFsZXggb24gMzAuMDcuMjAxNS5cclxuICovXHJcbnZhciBldmVudHMgPSBhcHAuZXZlbnRzO1xyXG5cclxudmFyIFZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIGV2ZW50cy5jaGFubmVsKCdzY3JlZW4nKS5vbignZm9vdGVyOm9wZW4gZm9vdGVyOmNsb3NlIGZvb3RlcjpyZXNpemUnLCB0aGlzLm9uRm9vdGVyLCB0aGlzKTtcclxuICAgICAgICBldmVudHMuY2hhbm5lbCgnc3lzdGVtJylcclxuICAgICAgICAgICAgLm9uKCd1bmxvYWQnLCB0aGlzLm9uVW5sb2FkLCB0aGlzKVxyXG4gICAgICAgICAgICAub24oJ2xvYWQnLCB0aGlzLm9uTG9hZCwgdGhpcyk7XHJcblxyXG4gICAgICAgIGFwcC5tYXAgPSB0aGlzLm1hcCA9IHRoaXMuaW5pdE1hcChvcHRpb25zKTtcclxuICAgICAgICB0aGlzLmluaXRDb250cm9scygpO1xyXG4gICAgICAgIHRoaXMuaW5pdEV2ZW50KCk7XHJcbiAgICB9LFxyXG4gICAgaW5pdE1hcDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgbWFwID0gTC5tYXAodGhpcy5lbCwgb3B0aW9ucy5tYXApLnNldFZpZXcob3B0aW9ucy5wb3NpdGlvbiwgb3B0aW9ucy56b29tKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1hcDtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdENvbnRyb2xzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgTC5jb250cm9sLnpvb20oe3Bvc2l0aW9uOiBcImJvdHRvbXJpZ2h0XCJ9KS5hZGRUbyh0aGlzLm1hcCk7XHJcbiAgICAgICAgTC5jb250cm9sLm1vdXNlUG9zaXRpb24oKS5hZGRUbyh0aGlzLm1hcCk7XHJcbiAgICAgICAgTC5jb250cm9sLmxvY2F0ZSh7dGl0bGU6ICfQntC/0YDQtdC00LXQu9C40YLRjCDQvNC10YHRgtC+0L/QvtC70L7QttC10L3QuNC1Li4uJ30pXHJcbiAgICAgICAgICAgIC5vbignbG9jYXRpb24nLCB0aGlzLm9uTG9jYXRpb24sIHRoaXMpXHJcbiAgICAgICAgICAgIC5hZGRUbyh0aGlzLm1hcCk7XHJcbiAgICB9LFxyXG4gICAgaW5pdEV2ZW50OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5tYXAub24oJ2NvbnRleHRtZW51JywgdGhpcy5vbkNvbnRleHRtZW51LCB0aGlzKTtcclxuICAgICAgICB0aGlzLm1hcC5vbignY2xpY2snLCB0aGlzLm9uQ2xpY2ssIHRoaXMpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyDQt9Cw0YXQstCw0YIg0YLQuNC/0L7QsiB0eXBlcywg0L3QsNGF0L7QtNGP0YnQuNGF0YHRjyDQvdCwINGA0LDRgdGB0L7RgtGP0L3QuNC4IGRpc3RhbmNlUHgg0L/QuNGB0YHQtdC70L7QsiDQvtGCINC60L7QvtGA0LTQuNC90LDRgtGLIGxhdGxuZ1xyXG4gICAgY2FwdHVyZTogZnVuY3Rpb24gKHR5cGVzLCBsYXRsbmcsIGRpc3RhbmNlUHgpIHtcclxuXHJcbiAgICAgICAgdmFyIGxheWVycyA9IF8udmFsdWVzKHRoaXMubWFwLl9sYXllcnMpO1xyXG4gICAgICAgIHR5cGVzID0gW10uY29uY2F0KHR5cGVzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGxheWVyc1xyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChsYXllcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxheWVyLmNhcHR1cmUgJiYgbGF5ZXIudHlwZXMgJiYgXy5pbnRlcnNlY3Rpb24odHlwZXMsIGxheWVyLnR5cGVzKS5sZW5ndGggPiAwO1xyXG4gICAgICAgICAgICB9LCB0aGlzKVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChsYXllcikge1xyXG4gICAgICAgICAgICAgICAgLy8g0LLQvtC30LLRgNCw0YIg0LzQsNGB0YHQuNCy0LAgaXRlbXMgPSBbeyB0eXBlOiB0eXBlc1tuXSwgZGlzdGFuY2UgOiAxMDAwLCBsYXllcjogbGF5ZXIxfSwge30sLi4uXVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxheWVyLmNhcHR1cmUodHlwZXMsIGxhdGxuZywgZGlzdGFuY2VQeCk7XHJcbiAgICAgICAgICAgIH0sIHRoaXMpXHJcbiAgICAgICAgICAgIC5yZWR1Y2UoZnVuY3Rpb24gKHJlcywgbGlzdCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5jb25jYXQobGlzdCk7IC8vINC/0L7Qu9GD0YfQsNC10Lwg0LvQuNC90LXQudC90YvQuSDQvNCw0YHRgdC40LIg0LjQtyBbaXRlbXMxICwgaXRlbXMyLCAuLi5dXHJcbiAgICAgICAgICAgIH0sIFtdKVxyXG4gICAgICAgICAgICAuc29ydChmdW5jdGlvbiAoaXRlbSwgaXRlbTEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmRpc3RhbmNlID4gaXRlbTEuZGlzdGFuY2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgb25Mb2NhdGlvbjogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBjb25zb2xlLnRpbWUoJ3R0dCcpO1xyXG4gICAgICAgIF8udmFsdWVzKHRoaXMubWFwLl9sYXllcnMpXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGF5ZXIuY29sbGVjdGlvbiAmJiBsYXllci5jb2xsZWN0aW9uLm5hbWVPYmogPT09ICd6b25lJztcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKGxheWVyR3JvdXApIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXMgPSBsYXllckdyb3VwLmdldExheWVycygpXHJcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAobGF5ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxheWVyLm1vZGVsLmNvbnRhaW5zKGUubGF0bG5nLCBsYXllci5fbWFwKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXllci5tb2RlbC50b0pTT04oKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGxheWVyR3JvdXAuY29sbGVjdGlvbi50eXBlLCByZXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ3R0dCcpO1xyXG5cclxuICAgIH0sXHJcbiAgICBvbkNsaWNrOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGV2ZW50cy5jaGFubmVsKCdpbmZvJykudHJpZ2dlcignbWFwJywgZSk7XHJcbiAgICB9LFxyXG4gICAgb25Db250ZXh0bWVudTogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBldmVudHMuY2hhbm5lbCgncm91dGUnKS50cmlnZ2VyKCdhZGQnLCB7bGF0bG5nOiBlLmxhdGxuZ30pO1xyXG4gICAgfSxcclxuICAgIGdldFN0YXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1hcCA9IHRoaXMubWFwLFxyXG4gICAgICAgICAgICBjZW50ZXIgPSBtYXAuZ2V0Q2VudGVyKCk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY2VudGVyOiBjZW50ZXIsXHJcbiAgICAgICAgICAgIHpvb206IG1hcC5nZXRab29tKClcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuICAgIG9uRm9vdGVyOiBmdW5jdGlvbiAoaGVpZ2h0KSB7XHJcbiAgICAgICAgdGhpcy4kZWwuY3NzKHtoZWlnaHQ6ICgxMDAgLSBoZWlnaHQpICsgJyUnfSk7XHJcbiAgICAgICAgdGhpcy5tYXAuaW52YWxpZGF0ZVNpemUoKTtcclxuICAgIH0sXHJcbiAgICBvblVubG9hZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGFwcC5zdG9yZS5zZXQoJ21hcC1zdGF0ZScsIHRoaXMuZ2V0U3RhdGUoKSk7XHJcbiAgICB9LFxyXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSBhcHAuc3RvcmUuZ2V0KCdtYXAtc3RhdGUnKTtcclxuICAgICAgICB0aGlzLm1hcC5zZXRWaWV3KGRhdGEuY2VudGVyLCBkYXRhLnpvb20pO1xyXG4gICAgfVxyXG5cclxufSk7XHJcbnZhciBkYXRhID0gYXBwLnN0b3JlLmdldCgnbWFwLXN0YXRlJyk7XHJcbnZhciB2aWV3ID0gbmV3IFZpZXcoe1xyXG4gICAgZWw6ICQoJyNtYXAnKSxcclxuICAgIG1hcDoge1xyXG4gICAgICAgIHpvb21Db250cm9sOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIC8vcG9zaXRpb246IFs1NS41LCAzNy41XSxcclxuICAgIC8vem9vbTogMFxyXG4gICAgcG9zaXRpb246IGRhdGEuY2VudGVyIHx8IFs1NS41LCAzNy41XSxcclxuICAgIHpvb206IGRhdGEuem9vbSB8fCA3XHJcbn0pO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdmlldztcclxuXHJcblxyXG5cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgYWxleCBvbiAwMi4wOS4yMDE1LlxyXG4gKi9cclxuXHJcbnZhciBtYXAgPSBhcHAubWFwLFxyXG4gICAgTGF5ZXJzID0gcmVxdWlyZSgnLi4vLi4vbGlicy9sYXllcicpLFxyXG4gICAgTGF5ZXIgPSByZXF1aXJlKCcuL2xheWVyJyksXHJcbiAgICBldmVudHMgPSBhcHAuZXZlbnRzLmNoYW5uZWwoJ2Jhc2UtbWFwJyk7XHJcblxyXG52YXIgTXlMYXllcnMgPSBMYXllcnMuZXh0ZW5kKHtcclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChsYXllcnMpIHtcclxuICAgICAgICBNeUxheWVycy5fX3N1cGVyX18uaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIC8vdGhpcy5vbkFjdGl2ZShsYXllcnNbMF0uZ2V0VHlwZSgpKTtcclxuICAgICAgICBldmVudHMub24oJ2FjdGl2ZScsIHRoaXMub25BY3RpdmUsIHRoaXMpO1xyXG4gICAgfSxcclxuICAgIG9uQWN0aXZlOiBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICAgIHRoaXMuY2xlYXJMYXllcnMoKTtcclxuICAgICAgICBpZiAodGhpcy50eXBlc1t0eXBlXSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZExheWVyKHRoaXMuX2FjdGl2ZSA9IHRoaXMudHlwZXNbdHlwZV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc2V0VGltZW91dCh0aGlzLl9icmluZ1RvQmFjay5iaW5kKHRoaXMpKTtcclxuICAgIH0sXHJcblxyXG4gICAgX2JyaW5nVG9CYWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHBhbmUgPSB0aGlzLl9tYXAuX3BhbmVzLnRpbGVQYW5lO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fYWN0aXZlICYmIHRoaXMuX2FjdGl2ZS5fY29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgIHBhbmUuaW5zZXJ0QmVmb3JlKHRoaXMuX2FjdGl2ZS5fY29udGFpbmVyLCBwYW5lLmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgICAgICAvL3RoaXMuX3NldEF1dG9aSW5kZXgocGFuZSwgTWF0aC5taW4pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG5cclxuICAgIF9uZXh0SW5kZXg6IDAsXHJcbiAgICBfbmV4dFR5cGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIga2V5cyA9IF8ua2V5cyh0aGlzLnR5cGVzKTtcclxuICAgICAgICByZXR1cm4gdGhpcy50eXBlc1trZXlzWysrdGhpcy5fbmV4dEluZGV4XSB8fCAoa2V5c1t0aGlzLl9uZXh0SW5kZXggPSAwXSldO1xyXG4gICAgfVxyXG59KTtcclxuXHJcblxyXG52YXIgbGF5ZXJzID0gbmV3IE15TGF5ZXJzKFtcclxuICAgIG5ldyBMYXllcignaHR0cDovL3tzfS50aWxlLm9zbS5vcmcve3p9L3t4fS97eX0ucG5nJywge1xyXG4gICAgICAgIHR5cGU6ICdPU00nLFxyXG4gICAgICAgIGF0dHJpYnV0aW9uOiAnJmNvcHk7IDxhIGhyZWY9XCJodHRwOi8vb3NtLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMnXHJcbiAgICB9KSxcclxuICAgIG5ldyBMYXllcignaHR0cDovL3tzfS50aWxlLm9wZW5jeWNsZW1hcC5vcmcvY3ljbGUve3p9L3t4fS97eX0ucG5nJywge1xyXG4gICAgICAgIHR5cGU6ICdPQ00nLFxyXG4gICAgICAgIGF0dHJpYnV0aW9uOiAnJmNvcHk7IDxhIGhyZWY9XCJodHRwOi8vb3NtLm9yZy9jb3B5cmlnaHRcIj5PcGVuQ3ljbGVNYXA8L2E+IGNvbnRyaWJ1dG9ycydcclxuICAgIH0pLFxyXG4gICAgbmV3IExheWVyKCdodHRwOi8ve3N9LmJhc2VtYXBzLmNhcnRvY2RuLmNvbS9saWdodF9hbGwve3p9L3t4fS97eX0ucG5nJywge1xyXG4gICAgICAgIHR5cGU6ICdDUlQnLFxyXG4gICAgICAgIG5vV3JhcDogdHJ1ZSxcclxuICAgICAgICBhdHRyaWJ1dGlvbjogJyZjb3B5OyA8YSBocmVmPVwiaHR0cDovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMsICZjb3B5OyA8YSBocmVmPVwiaHR0cDovL2NhcnRvZGIuY29tL2F0dHJpYnV0aW9uc1wiPkNhcnRvREI8L2E+J1xyXG4gICAgfSlcclxuXHJcbl0pO1xyXG5cclxuXHJcbmxheWVycy5hZGRUbyhtYXApO1xyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBhbGV4IG9uIDAzLjA5LjIwMTUuXHJcbiAqL1xyXG5cclxudmFyIExheWVyID0gTC5UaWxlTGF5ZXIuZXh0ZW5kKHtcclxuICAgIGdldFR5cGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnR5cGU7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGF5ZXI7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkg0JDQu9C10LrRgdCw0L3QtNGAIG9uIDEzLjA5LjIwMTUuXHJcbiAqL1xyXG5cclxudmFyIExvZ2luID0gcmVxdWlyZSgnLi9sb2dpbicpLFxyXG4gICAgZXZlbnRBdXRoID0gYXBwLmV2ZW50cy5jaGFubmVsKCdhdXRoJyk7XHJcblxyXG52YXIgTW9kZWwgPSBMb2dpbi5Nb2RlbC5leHRlbmQoe1xyXG4gICAgdXJsUm9vdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiAnL2FwaS9hdXRoL3Rva2VuLycgKyB0aGlzLm9wdGlvbnMudG9rZW47XHJcbiAgICB9LFxyXG4gICAgZGVmYXVsdHM6IHtcclxuICAgICAgICB1c2VybmFtZTogJycsXHJcbiAgICAgICAgcGFzc3dvcmQ6ICcnLFxyXG4gICAgICAgIHBhc3N3b3JkMTogJydcclxuICAgIH0sXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0ciwgb3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICB9LFxyXG4gICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgIHVzZXJuYW1lOiB7XHJcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICBwYXR0ZXJuOiAnZW1haWwnXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwYXNzd29yZDoge1xyXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgbWluTGVuZ3RoOiA1LFxyXG4gICAgICAgICAgICByZW1vdGVFcnI0MDA6IHt9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwYXNzd29yZDE6IHtcclxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIG1pbkxlbmd0aDogNSxcclxuICAgICAgICAgICAgZm46IGZ1bmN0aW9uICh2YWx1ZSwgYXR0ciwgY29tcHV0ZWRTdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlID09PSBjb21wdXRlZFN0YXRlLnBhc3N3b3JkID8gbnVsbCA6IFwi0J/QsNGA0L7Qu9GMINC90LUg0YHQvtCy0L/QsNC00LDQtdGCXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlbW90ZUVycjoge1xyXG4gICAgICAgICAgICByZW1vdGU6IHtcclxuICAgICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoZXJyLCBtb2RlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlcnIuc3RhdHVzID09PSA0MDAgPyBudWxsIDogbW9kZWwubWVzc2FnZUVycm9yKGVycik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxufSk7XHJcbnZhciBWaWV3ID0gTG9naW4uVmlldy5leHRlbmQoe1xyXG4gICAgZWw6ICQoJyN0ZW1wLXBhc3N3b3JkLWNoYW5nZScpLmh0bWwoKSxcclxuICAgIG1vZGVsOiBuZXcgTW9kZWwoKSxcclxuICAgIGJpbmRpbmdzOiB7XHJcbiAgICAgICAgXCJbbmFtZT11c2VybmFtZV1cIjogXCJ1c2VybmFtZVwiLFxyXG4gICAgICAgIFwiW25hbWU9cGFzc3dvcmRdXCI6IFwicGFzc3dvcmRcIixcclxuICAgICAgICBcIltuYW1lPXBhc3N3b3JkMV1cIjogXCJwYXNzd29yZDFcIixcclxuICAgIH0sXHJcbiAgICBvblN5bmM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLl9tYXNrKCkuZW5kKDMwMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGFsLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX21lc3NhZ2UoKTtcclxuICAgICAgICB9LCB0aGlzKTtcclxuXHJcbiAgICB9LFxyXG4gICAgb25FcnJvcjogZnVuY3Rpb24gKG1vZGVsLCB4aHIsIG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLl9tYXNrKCkuZW5kKDMwMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLnJlbW90ZVZhbGlkYXRlKHhocik7XHJcbiAgICAgICAgfSwgdGhpcyk7XHJcblxyXG4gICAgfSxcclxuICAgIF9tZXNzYWdlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgYXBwLm1lc3NhZ2Uuc2VuZCh7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2FsZXJ0LWluZm8nLFxyXG4gICAgICAgICAgICB0aXRsZTogJ9Ch0LHRgNC+0YEg0L/QsNGA0L7Qu9GPJyxcclxuICAgICAgICAgICAgY29udGVudDogTC5VdGlsLnRlbXBsYXRlKCfQn9Cw0YDQvtC70Ywg0LTQu9GPINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjyA8Yj57dXNlcm5hbWV9PC9iPiDQuNC30LzQtdC90LXQvS4nLCB0aGlzLm1vZGVsLnRvSlNPTigpKSxcclxuICAgICAgICAgICAgdGltZTogMTAwMDBcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBfbWFza1NlbGVjdG9yOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJCgnLm1vZGFsLWNvbnRlbnQnKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0b2tlbikge1xyXG4gICAgLy8g0LfQsNC/0YDQvtGBIGdldFxyXG4gICAgJC5nZXQoXCIvYXBpL2F1dGgvdG9rZW4vXCIgKyB0b2tlbilcclxuICAgICAgICAuZG9uZShmdW5jdGlvbiAoZGF0YSwgeGhyKSB7XHJcbiAgICAgICAgICAgIGFwcC5tb2RhbC5vcGVuKG5ldyBWaWV3KHttb2RlbDogbmV3IE1vZGVsKGRhdGEsIHt0b2tlbjogdG9rZW59KX0pKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5mYWlsKGZ1bmN0aW9uICh4aHIpIHtcclxuICAgICAgICAgICAgYXBwLm1lc3NhZ2Uuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdhbGVydC1kYW5nZXInLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICfQntGI0LjQsdC60LAg0YHQsdGA0L7RgdCwINC/0LDRgNC+0LvRjzonLFxyXG4gICAgICAgICAgICAgICAgY29udGVudDogJ1snICsgdG9rZW4uc2xpY2UoMCwgNykgKyAnLi4uXSAnICsgeGhyLnJlc3BvbnNlSlNPTi5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgdGltZTogMTAwMDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbn07IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgYWxleCBvbiAwNy4wOS4yMDE1LlxyXG4gKi9cclxuXHJcbnZhciBWaWV3Q21kID0gcmVxdWlyZSgnLi4vLi4vLi4vbGlicy92aWV3cy9jb21tYW5kJyksXHJcbiAgICBWaWV3TG9naW4gPSByZXF1aXJlKCcuL2xvZ2luJykuVmlldyxcclxuICAgIFZpZXdSZWdpc3RlciA9IHJlcXVpcmUoJy4vcmVnaXN0ZXInKSxcclxuICAgIHJlc2V0UGFzc3dvcmQgPSByZXF1aXJlKCcuL3Jlc2V0LXBhc3N3b3JkJyksXHJcbiAgICBjaGFuZ2VQYXNzd29yZCA9IHJlcXVpcmUoJy4vY2hhbmdlLXBhc3N3b3JkJyksXHJcbiAgICBldmVudEF1dGggPSBhcHAuZXZlbnRzLmNoYW5uZWwoJ2F1dGgnKTtcclxuXHJcbnZhciBWaWV3ID0gVmlld0NtZC5leHRlbmQoe1xyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLnZpZXdzID0ge31cclxuICAgICAgICB0aGlzLnNldFRhYnMob3B0aW9ucy50YWJzKTtcclxuICAgICAgICB0aGlzLnRlc3RMb2dpbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICB0ZXN0TG9naW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdmlld0xvZ2luID0gdGhpcy52aWV3c1snLnRhYjEnXTtcclxuICAgICAgICAkLmdldCgnL2FwaS9hdXRoL2xvZ2luJywgZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgIHZpZXdMb2dpbi5tb2RlbC5zZXQoZGF0YSk7XHJcbiAgICAgICAgICAgIHZpZXdMb2dpbi5vbkxvZ2luKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldFRhYnM6IGZ1bmN0aW9uICh0YWJzKSB7XHJcbiAgICAgICAgZm9yICh2YXIgcCBpbiB0YWJzKSB7XHJcbiAgICAgICAgICAgIHZhciBWaWV3ID0gdGFic1twXTtcclxuICAgICAgICAgICAgdGhpcy52aWV3c1twXSA9IG5ldyBWaWV3KHtlbDogdGhpcy4kKHApfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHN3aXRjaDogZnVuY3Rpb24gKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgdGhpcy4kKCdbY2xhc3NePXRhYl0nKS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgIHRoaXMuJChzZWxlY3RvcikucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNtZFJlZ2lzdGVyOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHRoaXMuc3dpdGNoKCcudGFiMicpO1xyXG4gICAgfSxcclxuICAgIGNtZExvZ2luOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHRoaXMuc3dpdGNoKCcudGFiMScpO1xyXG4gICAgfSxcclxuICAgIGNtZFJlc2V0UGFzc3dvcmQ6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgdmFyIHZpZXcgPSByZXNldFBhc3N3b3JkKHRoaXMudmlld3NbJy50YWIxJ10ubW9kZWwuZ2V0KCd1c2VybmFtZScpKTtcclxuICAgICAgICBhcHAubW9kYWwub3Blbih2aWV3KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuZXZlbnRBdXRoLm9uKCdjaGFuZ2UtcGFzc3dvcmQnLCBjaGFuZ2VQYXNzd29yZCk7XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICAvL3Bvc2l0aW9uOiAndG9wY2VudGVyJyxcclxuICAgIHBvc2l0aW9uOiAndG9wcmlnaHQnLFxyXG4gICAgaWQ6ICdsb2dpbicsXHJcbiAgICB0aXRsZTogJ9CS0YXQvtC0L9GA0LXQs9C40YHRgtGA0LDRhtC40Y8g0LIg0YHQuNGB0YLQtdC80LUnLFxyXG4gICAgaWNvbjogJzxkaXYgY2xhc3M9XCJpY29uLWxvZ291dCBtYXAtbWVudS1idXR0b24taWNvblwiLz4nLFxyXG4gICAgcG9wb3Zlcjoge1xyXG4gICAgICAgIHZpZXc6IG5ldyBWaWV3KHtcclxuICAgICAgICAgICAgZWw6ICQoJyN0ZW1wLWxvZ2luLXJlZ2lzdGVyJykuaHRtbCgpLFxyXG4gICAgICAgICAgICB0YWJzOiB7XHJcbiAgICAgICAgICAgICAgICAnLnRhYjEnOiBWaWV3TG9naW4sXHJcbiAgICAgICAgICAgICAgICAnLnRhYjInOiBWaWV3UmVnaXN0ZXJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIHRpdGxlOiAn0JLRhdC+0LQv0YDQtdCz0LjRgdGC0YDQsNGG0LjRjyDQsiDRgdC40YHRgtC10LzQtSdcclxuXHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkg0JDQu9C10LrRgdCw0L3QtNGAIG9uIDEzLjA5LjIwMTUuXHJcbiAqL1xyXG5cclxudmFyIHJlbW90ZU1peCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYnMvdmlld3MvcmVtb3RlLW1peCcpLFxyXG4gICAgZXZlbnRBdXRoID0gYXBwLmV2ZW50cy5jaGFubmVsKCdhdXRoJyk7XHJcblxyXG52YXIgUm10TW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQocmVtb3RlTWl4Lk1vZGVsKSxcclxuICAgIE1vZGVsID0gUm10TW9kZWwuZXh0ZW5kKHtcclxuICAgICAgICBpZEF0dHJpYnV0ZTogJ3Rva2VuJyxcclxuICAgICAgICB1cmxSb290OiAnL2FwaS9hdXRoL2xvZ2luJyxcclxuICAgICAgICBkZWZhdWx0czoge1xyXG4gICAgICAgICAgICB1c2VybmFtZTogJycsXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiAnJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgICAgdXNlcm5hbWU6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcGF0dGVybjogJ2VtYWlsJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwYXNzd29yZDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtaW5MZW5ndGg6IDUsXHJcbiAgICAgICAgICAgICAgICByZW1vdGVFcnI0MDA6IHt9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlbW90ZUVycjoge1xyXG4gICAgICAgICAgICAgICAgcmVtb3RlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uIChlcnIsIG1vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBlcnIuc3RhdHVzID09PSA0MDAgPyBudWxsIDogbW9kZWwubWVzc2FnZUVycm9yKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgIH0pO1xyXG5cclxudmFyIFJtdFZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZChyZW1vdGVNaXguVmlldyksXHJcbiAgICBWaWV3ID0gUm10Vmlldy5leHRlbmQoe1xyXG4gICAgICAgIG1vZGVsOiBuZXcgTW9kZWwoKSxcclxuICAgICAgICBldmVudHM6IHtcclxuICAgICAgICAgICAgXCJzdWJtaXRcIjogXCJvblN1Ym1pdFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBiaW5kaW5nczoge1xyXG4gICAgICAgICAgICBcIltuYW1lPXVzZXJuYW1lXVwiOiBcInVzZXJuYW1lXCIsXHJcbiAgICAgICAgICAgIFwiW25hbWU9cGFzc3dvcmRdXCI6IFwicGFzc3dvcmRcIlxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRyLCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIEJhY2tib25lLlZhbGlkYXRpb24uYmluZCh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5zdGlja2l0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NldFJlbW90ZUV2ZW50cygpO1xyXG4gICAgICAgICAgICB3aW5kb3cucHJlTG9naW4gPSB0aGlzLm9uTG9naW5OZXR3b3JrLmJpbmQodGhpcyk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgb25TeW5jOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21hc2soKS5lbmQoNTAwLCB0aGlzLm9uTG9naW4sIHRoaXMpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25FcnJvcjogZnVuY3Rpb24gKG1vZGVsLCB4aHIsIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWFzaygpLmVuZCg1MDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwucmVtb3RlVmFsaWRhdGUoeGhyKTtcclxuICAgICAgICAgICAgICAgIGV2ZW50QXV0aC50cmlnZ2VyKCdsb2dvdXQnLCB7fSk7XHJcbiAgICAgICAgICAgIH0sIHRoaXMpO1xyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uU3VibWl0OiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2F2ZSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25Mb2dpbjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBldmVudEF1dGgudHJpZ2dlcignbG9naW4nLCB0aGlzLm1vZGVsLnRvSlNPTigpKTtcclxuICAgICAgICAgICAgdGhpcy5fbWVzc2FnZSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25Mb2dpbk5ldHdvcms6IGZ1bmN0aW9uICh0b2tlbikge1xyXG4gICAgICAgICAgICAkLmdldCgnL2FwaS9hdXRoL2xvZ2luL3Rva2VuLycgKyB0b2tlbilcclxuICAgICAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkxvZ2luKCk7XHJcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcykpXHJcbiAgICAgICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAoeGhyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXBwLm1lc3NhZ2Uuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2FsZXJ0LWluZm8nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ9CY0L3RhNC+INGB0L7QvtCx0YnQtdC90LjQtScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHRoaXMubW9kZWwubWVzc2FnZUVycm9yKHhocilcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgX21lc3NhZ2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYXBwLm1lc3NhZ2Uuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdhbGVydC1zdWNjZXNzJyxcclxuICAgICAgICAgICAgICAgIC8vdGl0bGU6ICfQktGF0L7QtCDQvdCwINGB0LDQudGCJyxcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IEwuVXRpbC50ZW1wbGF0ZSgn0J/QvtC70YzQt9C+0LLQsNGC0LXQu9GMIDxiPnt1c2VybmFtZX08L2I+INGD0YHQv9C10YjQvdC+INCy0L7RiNC10Lsg0LIg0YHQuNGB0YLQtdC80YMuJywgdGhpcy5tb2RlbC50b0pTT04oKSksXHJcbiAgICAgICAgICAgICAgICB0aW1lOiAzNDAwXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgX21hc2tTZWxlY3RvcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kZWwucGFyZW50cygnLnBvcG92ZXItY29udGVudCcpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgfSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIE1vZGVsOiBNb2RlbCxcclxuICAgIFZpZXc6IFZpZXdcclxufTsiLCIvKipcclxuICogQ3JlYXRlZCBieSDQkNC70LXQutGB0LDQvdC00YAgb24gMTMuMDkuMjAxNS5cclxuICovXHJcbnZhciBMb2dpbiA9IHJlcXVpcmUoJy4vbG9naW4nKTtcclxuXHJcbnZhciBNb2RlbCA9IExvZ2luLk1vZGVsLmV4dGVuZCh7XHJcbiAgICAgICAgdXJsUm9vdDogJy9hcGkvYXV0aC9yZWdpc3RlcicsXHJcbiAgICAgICAgZGVmYXVsdHM6IHtcclxuICAgICAgICAgICAgdXNlcm5hbWU6ICcnLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogJycsXHJcbiAgICAgICAgICAgIHBhc3N3b3JkMTogJydcclxuICAgICAgICB9LFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgICAgdXNlcm5hbWU6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcGF0dGVybjogJ2VtYWlsJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwYXNzd29yZDoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtaW5MZW5ndGg6IDUsXHJcbiAgICAgICAgICAgICAgICByZW1vdGVFcnI0MDA6IHt9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBhc3N3b3JkMToge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtaW5MZW5ndGg6IDUsXHJcbiAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKHZhbHVlLCBhdHRyLCBjb21wdXRlZFN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlID09PSBjb21wdXRlZFN0YXRlLnBhc3N3b3JkID8gbnVsbCA6IFwi0J/QsNGA0L7Qu9GMINC90LUg0YHQvtCy0L/QsNC00LDQtdGCXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlbW90ZUVycjoge1xyXG4gICAgICAgICAgICAgICAgcmVtb3RlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm46IGZ1bmN0aW9uIChlcnIsIG1vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBlcnIuc3RhdHVzID09PSA0MDAgPyBudWxsIDogbW9kZWwubWVzc2FnZUVycm9yKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB0b0pTT046IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF8ub21pdChNb2RlbC5fX3N1cGVyX18udG9KU09OLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksICdwYXNzd29yZDEnKTtcclxuICAgICAgICB9XHJcbiAgICB9KSxcclxuICAgIFZpZXcgPSBMb2dpbi5WaWV3LmV4dGVuZCh7XHJcbiAgICAgICAgbW9kZWw6IG5ldyBNb2RlbCgpLFxyXG4gICAgICAgIGJpbmRpbmdzOiB7XHJcbiAgICAgICAgICAgIFwiW25hbWU9dXNlcm5hbWVdXCI6IFwidXNlcm5hbWVcIixcclxuICAgICAgICAgICAgXCJbbmFtZT1wYXNzd29yZF1cIjogXCJwYXNzd29yZFwiLFxyXG4gICAgICAgICAgICBcIltuYW1lPXBhc3N3b3JkMV1cIjogXCJwYXNzd29yZDFcIlxyXG4gICAgICAgIH0sXHJcbiAgICB9KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmlldzsiLCIvKipcclxuICogQ3JlYXRlZCBieSDQkNC70LXQutGB0LDQvdC00YAgb24gMTMuMDkuMjAxNS5cclxuICovXHJcblxyXG52YXIgTG9naW4gPSByZXF1aXJlKCcuL2xvZ2luJyk7XHJcblxyXG52YXIgTW9kZWwgPSBMb2dpbi5Nb2RlbC5leHRlbmQoe1xyXG4gICAgICAgIHVybFJvb3Q6ICcvYXBpL2F1dGgvY3JlYXRlVG9rZW4nLFxyXG4gICAgICAgIGRlZmF1bHRzOiB7XHJcbiAgICAgICAgICAgIHVzZXJuYW1lOiAnJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICAgICAgdXNlcm5hbWU6IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcGF0dGVybjogJ2VtYWlsJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZW1vdGVFcnI6IHtcclxuICAgICAgICAgICAgICAgIHJlbW90ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGZuOiBmdW5jdGlvbiAoZXJyLCBtb2RlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXJyLnN0YXR1cyA9PT0gNDAwID8gbnVsbCA6IG1vZGVsLm1lc3NhZ2VFcnJvcihlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pLFxyXG4gICAgVmlldyA9IExvZ2luLlZpZXcuZXh0ZW5kKHtcclxuICAgICAgICBlbDogJCgnI3RlbXAtcGFzc3dvcmQtcmVzZXQnKS5odG1sKCksXHJcbiAgICAgICAgbW9kZWw6IG5ldyBNb2RlbCgpLFxyXG4gICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgICBcInN1Ym1pdFwiOiBcIm9uU3VibWl0XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJpbmRpbmdzOiB7XHJcbiAgICAgICAgICAgIFwiW25hbWU9dXNlcm5hbWVdXCI6IFwidXNlcm5hbWVcIixcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBvblN5bmM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWFzaygpLmVuZCgzMDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubW9kYWwuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21lc3NhZ2UoKTtcclxuICAgICAgICAgICAgfSwgdGhpcyk7XHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25FcnJvcjogZnVuY3Rpb24gKG1vZGVsLCB4aHIsIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWFzaygpLmVuZCgzMDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwucmVtb3RlVmFsaWRhdGUoeGhyKTtcclxuICAgICAgICAgICAgfSwgdGhpcyk7XHJcblxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgX21lc3NhZ2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgYXBwLm1lc3NhZ2Uuc2VuZCh7XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdhbGVydC1pbmZvJyxcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAn0KHQsdGA0L7RgSDQv9Cw0YDQvtC70Y8nLFxyXG4gICAgICAgICAgICAgICAgY29udGVudDogTC5VdGlsLnRlbXBsYXRlKCfQndCwINCS0LDRiCBlbWFpbCA8Yj57dXNlcm5hbWV9PC9iPiDQvtGC0L/RgNCw0LLQu9C10L3QvdC+INGB0L7QvtCx0YnQtdC90LjQtS4g0JTQu9GPINGB0LHRgNC+0YHQsCDQv9Cw0YDQvtC70Y8g0L/QtdGA0LXQudC00LjRgtC1INC/0L4gPGEgaHJlZj1cIi8jdG9rZW4ve3Rva2VufVwiPtGB0YHRi9C70LrQtTwvYT4g0LIg0L/QuNGB0YzQvNC1LicsIHRoaXMubW9kZWwudG9KU09OKCkpLFxyXG4gICAgICAgICAgICAgICAgdGltZTogMjAwMDBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBfbWFza1NlbGVjdG9yOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiQoJy5tb2RhbC1jb250ZW50Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1c2VybmFtZSkge1xyXG4gICAgcmV0dXJuIG5ldyBWaWV3KHttb2RlbDogbmV3IE1vZGVsKHt1c2VybmFtZTogdXNlcm5hbWV9KX0pO1xyXG59OyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGFsZXggb24gMDcuMDguMjAxNS5cclxuICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIGV2ZW50cyA9IGFwcC5ldmVudHMsXHJcbiAgICBtZW51ID0gcmVxdWlyZSgnLi4vLi4vbGlicy9tZW51Jyk7XHJcblxyXG52YXIgTWFuYWdlciA9IG1lbnUuTWFuYWdlci5leHRlbmQoe1xyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIE1hbmFnZXIuX19zdXBlcl9fLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICBhcHAuZXZlbnRzLmNoYW5uZWwoJ21lbnUnKS5vbignYWN0aXZlJywgdGhpcy5vbkFjdGl2ZSwgdGhpcyk7XHJcbiAgICB9XHJcbn0pO1xyXG52YXIgbWFuYWdlciA9IG5ldyBNYW5hZ2VyKCk7XHJcblxyXG5tYW5hZ2VyLmFkZChbXHJcbiAgICByZXF1aXJlKCcuL21hcHMnKSxcclxuICAgIHJlcXVpcmUoJy4vcHJvZmlsZScpLFxyXG4gICAgcmVxdWlyZSgnLi9hdXRoJyksXHJcblxyXG4gICAgcmVxdWlyZSgnLi9sYXllcnMnKSxcclxuICAgIHJlcXVpcmUoJy4vbWV0ZW8nKVxyXG5dKTtcclxuXHJcbmV2ZW50cy5jaGFubmVsKCdhdXRoJykub24oJ2xvZ2luJywgZnVuY3Rpb24gKGF0dHIpIHtcclxuICAgIG1hbmFnZXIuc2V0VmlzaWJsZSgnbG9naW4nLCBmYWxzZSk7XHJcbiAgICBtYW5hZ2VyLnNldFZpc2libGUoJ3Byb2ZpbGUnLCB0cnVlKTtcclxufSk7XHJcblxyXG5ldmVudHMuY2hhbm5lbCgnYXV0aCcpLm9uKCdsb2dvdXQnLCBmdW5jdGlvbiAoYXR0cikge1xyXG4gICAgbWFuYWdlci5zZXRWaXNpYmxlKCdsb2dpbicsIHRydWUpO1xyXG4gICAgbWFuYWdlci5zZXRWaXNpYmxlKCdwcm9maWxlJywgZmFsc2UpO1xyXG59KTtcclxuXHJcbm1hbmFnZXIucmVuZGVyKGFwcC5tYXApO1xyXG5cclxuXHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IE5CUDEwMDA4MyBvbiAyNi4wOC4yMDE1LlxyXG4gKiDQodC70L7QuCDQvdCwINC60LDRgNGC0LUuINCc0L7QttC90L4g0LLRi9Cx0YDQsNGC0Ywg0L3QtdGB0LrQvtC70YzQutC+XHJcbiAqL1xyXG52YXIgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBwb3NpdGlvbjogJ3RvcGNlbnRlcicsXHJcbiAgICBpZDogJ2xheWVycycsXHJcbiAgICBpY29uOiAnPGRpdiAgY2xhc3M9XCJtYXAtbWVudS1idXR0b24taWNvbiBpY29uLWxheWVyczJcIi8+JyxcclxuICAgIHBvcG92ZXI6IHtcclxuICAgICAgICB2aWV3OiBuZXcgVmlldygpLFxyXG4gICAgICAgIHRpdGxlOiAn0KHQu9C+0Lgg0L3QsCDQutCw0YDRgtC1J1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuXHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IE5CUDEwMDA4MyBvbiAyNi4wOC4yMDE1LlxyXG4gKi9cclxudmFyIHR5cGVzID0gYXBwLm9wdGlvbnMudHlwZXMsXHJcbiAgICBldmVudHMgPSBhcHAuZXZlbnRzLFxyXG4gICAgbWFwID0gYXBwLm1hcCxcclxuICAgIGRlZlR5cGVzID0gXy5vYmplY3QoXy5rZXlzKHR5cGVzKS5tYXAoZnVuY3Rpb24gKGtleSwgaW5kZXgpIHtcclxuICAgICAgICByZXR1cm4gW2tleSwgZmFsc2VdO1xyXG4gICAgfSkpO1xyXG5cclxuXHJcbnZhciBDaGVja3MgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xyXG4gICAgbmFtZVN0b3JlOiAnYXMtc3RhdGUnLFxyXG4gICAgZGVmYXVsdHM6IGRlZlR5cGVzLFxyXG5cclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRyLCBvcHRpb25zKSB7XHJcbiAgICAgICAgYXBwLmV2ZW50cy5jaGFubmVsKCdzeXN0ZW0nKVxyXG4gICAgICAgICAgICAub24oJ3VubG9hZCcsIHRoaXMub25VbmxvYWQsIHRoaXMpXHJcbiAgICAgICAgICAgIC5vbignbG9hZCcsIHRoaXMub25Mb2FkLCB0aGlzKTtcclxuICAgIH0sXHJcbiAgICBvblVubG9hZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGFwcC5zdG9yZS5zZXQodGhpcy5uYW1lU3RvcmUsIHRoaXMudG9KU09OKCkpO1xyXG4gICAgfSxcclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBkYXRhID0gYXBwLnN0b3JlLmdldCh0aGlzLm5hbWVTdG9yZSk7XHJcbiAgICAgICAgdGhpcy5zZXQoZGF0YSk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxudmFyIExpbWl0ZWQgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xyXG4gICAgZGVmYXVsdHM6IGRlZlR5cGVzLFxyXG5cclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRyLCBvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5vblpvb20oKTtcclxuICAgICAgICBtYXAub24oJ3pvb21lbmQnLCB0aGlzLm9uWm9vbSwgdGhpcyk7XHJcbiAgICB9LFxyXG4gICAgb25ab29tOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHpvb20gPSBtYXAuZ2V0Wm9vbSgpO1xyXG4gICAgICAgIF8ua2V5cyh0eXBlcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KGtleSwgdGhpcy5pc0xpbWl0ZWRab29tKGtleSwgem9vbSkpO1xyXG4gICAgICAgIH0sIHRoaXMpO1xyXG4gICAgfSxcclxuICAgIGlzTGltaXRlZFpvb206IGZ1bmN0aW9uIChrZXksIHpvb20pIHtcclxuICAgICAgICByZXR1cm4gdHlwZXNba2V5XS5lbmFibGVab29tWzBdIDwgem9vbSAmJiB0eXBlc1trZXldLmVuYWJsZVpvb21bMV0gPiB6b29tO1xyXG4gICAgfVxyXG59KTtcclxuXHJcblxyXG52YXIgbSA9IG1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgY2hlY2tzOiBuZXcgQ2hlY2tzKCksXHJcbiAgICBsaW1pdGVkOiBuZXcgTGltaXRlZCgpXHJcbn07XHJcblxyXG5cclxudmFyIEFTID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcclxuICAgIGRlZmF1bHRzOiBkZWZUeXBlcyxcclxuXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0ciwgb3B0aW9ucykge1xyXG4gICAgICAgIG0uY2hlY2tzLm9uKCdjaGFuZ2UnLCB0aGlzLm9uQ2hlY2tzLCB0aGlzKTtcclxuICAgICAgICBtLmxpbWl0ZWQub24oJ2NoYW5nZScsIHRoaXMub25MaW1pdGVkLCB0aGlzKTtcclxuICAgICAgICB0aGlzLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAobW9kZWwpIHtcclxuICAgICAgICAgICAgZXZlbnRzLmNoYW5uZWwoJ2xheWVycycpLnRyaWdnZXIoJ2FjdGl2ZScsIG1vZGVsLmNoYW5nZWQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIG9uQ2hlY2tzOiBmdW5jdGlvbiAobW9kZWwpIHtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gbW9kZWwuY2hhbmdlZClcclxuICAgICAgICAgICAgbS5saW1pdGVkLmdldChrZXkpICYmIHRoaXMuc2V0KGtleSwgbW9kZWwuZ2V0KGtleSkpO1xyXG4gICAgfSxcclxuICAgIG9uTGltaXRlZDogZnVuY3Rpb24gKG1vZGVsKSB7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG1vZGVsLmNoYW5nZWQpXHJcbiAgICAgICAgICAgIHRoaXMuc2V0KGtleSwgbW9kZWwuZ2V0KGtleSkgJiYgbS5jaGVja3MuZ2V0KGtleSkpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbm5ldyBBUygpIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgTkJQMTAwMDgzIG9uIDI2LjA4LjIwMTUuXHJcbiAqL1xyXG5cclxudmFyIHR5cGVzID0gYXBwLm9wdGlvbnMudHlwZXM7XHJcblxyXG52YXIgVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcclxuICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKCQoJyN0ZW1wLW1lbnUtYWlyLXNwYWNlJykuaHRtbCgpKSxcclxuICAgIG1vZGVsOiByZXF1aXJlKCcuL21vZGVscycpLmNoZWNrcyxcclxuICAgIGxpbWl0ZWQ6IHJlcXVpcmUoJy4vbW9kZWxzJykubGltaXRlZCxcclxuICAgIGJpbmRpbmdzOiBfLm9iamVjdChfLmtleXModHlwZXMpLm1hcChmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIFsnIycgKyBrZXksIGtleV07XHJcbiAgICB9KSksXHJcblxyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHIsIG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIHRoaXMuc3RpY2tpdCgpO1xyXG4gICAgICAgIHRoaXMubW9kZWwub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChtb2RlbCkge1xyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmxpbWl0ZWQub24oJ2NoYW5nZScsIHRoaXMub25MaW1pdGVkLCB0aGlzKTtcclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLiRlbC5hcHBlbmQodGhpcy50ZW1wbGF0ZSh0eXBlcykpO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmxpbWl0ZWQudG9KU09OKCkpXHJcbiAgICAgICAgICAgIHRoaXMuc2V0TGltaXRlZChrZXksIHRoaXMubGltaXRlZC5nZXQoa2V5KSk7XHJcblxyXG4gICAgfSxcclxuICAgIG9uTGltaXRlZDogZnVuY3Rpb24gKG1vZGVsKSB7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG1vZGVsLmNoYW5nZWQpXHJcbiAgICAgICAgICAgIHRoaXMuc2V0TGltaXRlZChrZXksIG1vZGVsLmdldChrZXkpKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0TGltaXRlZDogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICAgICB0aGlzLiQoJyMnICsga2V5KVxyXG4gICAgICAgICAgICAucHJvcCgnZGlzYWJsZWQnLCAhdmFsdWUpXHJcbiAgICAgICAgICAgIC5wYXJlbnQoKVxyXG4gICAgICAgICAgICAudG9nZ2xlQ2xhc3MoJ21hcC1haXItc3BhY2UtbGltaXRlZCcsICF2YWx1ZSlcclxuICAgICAgICAgICAgLmF0dHIoJ3RpdGxlJywgdmFsdWUgPyB0eXBlc1trZXldLnRpdGxlIDogJ9C+0LPRgNCw0L3QuNGH0LXQvdC40LUgem9vbS4uLicpO1xyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgTkJQMTAwMDgzIG9uIDI2LjA4LjIwMTUuXHJcbiAqINCh0LvQvtC4INC90LAg0LrQsNGA0YLQtS4g0JzQvtC20L3QviDQstGL0LHRgNCw0YLRjCDQvdC10YHQutC+0LvRjNC60L5cclxuICovXHJcbnZhciBWaWV3ID0gcmVxdWlyZSgnLi92aWV3Jyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIHBvc2l0aW9uOiAndG9wcmlnaHQnLFxyXG4gICAgaWQ6ICdsYXllcnMnLFxyXG4gICAgaWNvbjogJzxkaXYgIGNsYXNzPVwibWFwLW1lbnUtYnV0dG9uLWljb24gaWNvbi1tYXBzXCIvPicsXHJcbiAgICBwb3BvdmVyOiB7XHJcbiAgICAgICAgdmlldzogbmV3IFZpZXcoKSxcclxuICAgICAgICB0aXRsZTogJ9Cf0LXRgNC10LrQu9GO0YfQtdC90LjQtSDQutCw0YDRgidcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBhbGV4IG9uIDA4LjA5LjIwMTUuXHJcbiAqL1xyXG5cclxuXHJcbnZhciBNb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XHJcbiAgICBkZWZhdWx0czoge1xyXG4gICAgICAgbWFwcyA6IFwiT1NNXCJcclxuICAgIH0sXHJcbiAgICBuYW1lU3RvcmU6ICdtYXAtYmFzZScsXHJcblxyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHIsIG9wdGlvbnMpIHtcclxuICAgICAgICBhcHAuZXZlbnRzLmNoYW5uZWwoJ3N5c3RlbScpXHJcbiAgICAgICAgICAgIC5vbigndW5sb2FkJywgdGhpcy5vblVubG9hZCwgdGhpcylcclxuICAgICAgICAgICAgLm9uKCdsb2FkJywgdGhpcy5vbkxvYWQsIHRoaXMpO1xyXG5cclxuICAgIH0sXHJcbiAgICBvblVubG9hZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGFwcC5zdG9yZS5zZXQodGhpcy5uYW1lU3RvcmUsIHRoaXMudG9KU09OKCkpO1xyXG4gICAgfSxcclxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBkYXRhID0gYXBwLnN0b3JlLmdldCh0aGlzLm5hbWVTdG9yZSk7XHJcbiAgICAgICAgdGhpcy5zZXQoZGF0YSk7XHJcbiAgICAgICAgdGhpcy5zZXR1cCgpO1xyXG5cclxuICAgIH0sXHJcbiAgICBzZXR1cDogZnVuY3Rpb24oKXtcclxuICAgICAgICBhcHAuZXZlbnRzLmNoYW5uZWwoJ2Jhc2UtbWFwJykudHJpZ2dlcignYWN0aXZlJywgdGhpcy5nZXQoJ21hcHMnKSk7XHJcbiAgICAgICAgdGhpcy5vbignY2hhbmdlJywgZnVuY3Rpb24gKG1vZGVsKSB7XHJcbiAgICAgICAgICAgIGFwcC5ldmVudHMuY2hhbm5lbCgnYmFzZS1tYXAnKS50cmlnZ2VyKCdhY3RpdmUnLCB0aGlzLmdldCgnbWFwcycpKTtcclxuICAgICAgICB9LCB0aGlzKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsO1xyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBOQlAxMDAwODMgb24gMjYuMDguMjAxNS5cclxuICovXHJcblxyXG52YXIgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyk7XHJcblxyXG5cclxudmFyIFZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XHJcbiAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZSgkKCcjdGVtcC1tZW51LWJhc2UtbWFwJykuaHRtbCgpKSxcclxuICAgIG1vZGVsOiBuZXcgTW9kZWwsXHJcbiAgICBiaW5kaW5nczoge1xyXG4gICAgICBcImlucHV0W25hbWU9bWFwc11cIiA6ICBcIm1hcHNcIlxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0ciwgb3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgdGhpcy5zdGlja2l0KCk7XHJcbiAgICAgICAgdGhpcy5tb2RlbC5vbignY2hhbmdlJywgZnVuY3Rpb24gKG1vZGVsKSB7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLiRlbC5hcHBlbmQodGhpcy50ZW1wbGF0ZSh7fSkpO1xyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgTkJQMTAwMDgzIG9uIDI2LjA4LjIwMTUuXHJcbiAqINCh0LvQvtC4INC90LAg0LrQsNGA0YLQtS4g0JzQvtC20L3QviDQstGL0LHRgNCw0YLRjCDQvdC10YHQutC+0LvRjNC60L5cclxuICovXHJcbnZhciBWaWV3ID0gcmVxdWlyZSgnLi92aWV3Jyk7XHJcblxyXG5yZXF1aXJlKCcuL3dpbmQtc2NhbGUnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgcG9zaXRpb246ICd0b3BjZW50ZXInLFxyXG4gICAgaWQ6ICdtZXRlbycsXHJcbiAgICBpY29uOiAnPGRpdiAgY2xhc3M9XCJtYXAtbWVudS1idXR0b24taWNvbiBpY29uLW1ldGVvXCIvPicsXHJcbiAgICBwb3BvdmVyOiB7XHJcbiAgICAgICAgdmlldzogbmV3IFZpZXcoKSxcclxuICAgICAgICB0aXRsZTogJ9Cf0L7Qs9C+0LTQsCdcclxuICAgIH1cclxufTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBOQlAxMDAwODMgb24gMjYuMDguMjAxNS5cclxuICovXHJcbnZhciB0eXBlcyA9IGFwcC5vcHRpb25zLnR5cGVzLFxyXG4gICAgZXZlbnRzID0gYXBwLmV2ZW50cyxcclxuICAgIG1hcCA9IGFwcC5tYXAsXHJcbiAgICBkZWZUeXBlcyA9IF8ub2JqZWN0KF8ua2V5cyh0eXBlcykubWFwKGZ1bmN0aW9uIChrZXksIGluZGV4KSB7XHJcbiAgICAgICAgcmV0dXJuIFtrZXksIGZhbHNlXTtcclxuICAgIH0pKTtcclxuXHJcblxyXG52YXIgQ2hlY2tzID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcclxuICAgIG5hbWVTdG9yZTogJ21ldGVvLXN0YXRlJyxcclxuICAgIGRlZmF1bHRzOiBkZWZUeXBlcyxcclxuXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0ciwgb3B0aW9ucykge1xyXG4gICAgICAgIGFwcC5ldmVudHMuY2hhbm5lbCgnc3lzdGVtJylcclxuICAgICAgICAgICAgLm9uKCd1bmxvYWQnLCB0aGlzLm9uVW5sb2FkLCB0aGlzKVxyXG4gICAgICAgICAgICAub24oJ2xvYWQnLCB0aGlzLm9uTG9hZCwgdGhpcyk7XHJcbiAgICB9LFxyXG4gICAgb25VbmxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBhcHAuc3RvcmUuc2V0KHRoaXMubmFtZVN0b3JlLCB0aGlzLnRvSlNPTigpKTtcclxuICAgIH0sXHJcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZGF0YSA9IGFwcC5zdG9yZS5nZXQodGhpcy5uYW1lU3RvcmUpO1xyXG4gICAgICAgIHRoaXMuc2V0KGRhdGEpO1xyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG52YXIgTGltaXRlZCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XHJcbiAgICBkZWZhdWx0czogZGVmVHlwZXMsXHJcblxyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKGF0dHIsIG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLm9uWm9vbSgpO1xyXG4gICAgICAgIG1hcC5vbignem9vbWVuZCcsIHRoaXMub25ab29tLCB0aGlzKTtcclxuICAgIH0sXHJcbiAgICBvblpvb206IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgem9vbSA9IG1hcC5nZXRab29tKCk7XHJcbiAgICAgICAgXy5rZXlzKHR5cGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXQoa2V5LCB0aGlzLmlzTGltaXRlZFpvb20oa2V5LCB6b29tKSk7XHJcbiAgICAgICAgfSwgdGhpcyk7XHJcbiAgICB9LFxyXG4gICAgaXNMaW1pdGVkWm9vbTogZnVuY3Rpb24gKGtleSwgem9vbSkge1xyXG4gICAgICAgIHJldHVybiB0eXBlc1trZXldLmVuYWJsZVpvb21bMF0gPCB6b29tICYmIHR5cGVzW2tleV0uZW5hYmxlWm9vbVsxXSA+IHpvb207XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuXHJcbnZhciBtID0gbW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBjaGVja3M6IG5ldyBDaGVja3MoKSxcclxuICAgIGxpbWl0ZWQ6IG5ldyBMaW1pdGVkKClcclxufTtcclxuXHJcblxyXG52YXIgQVMgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xyXG4gICAgZGVmYXVsdHM6IGRlZlR5cGVzLFxyXG5cclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChhdHRyLCBvcHRpb25zKSB7XHJcbiAgICAgICAgbS5jaGVja3Mub24oJ2NoYW5nZScsIHRoaXMub25DaGVja3MsIHRoaXMpO1xyXG4gICAgICAgIG0ubGltaXRlZC5vbignY2hhbmdlJywgdGhpcy5vbkxpbWl0ZWQsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMub24oJ2NoYW5nZScsIGZ1bmN0aW9uIChtb2RlbCkge1xyXG4gICAgICAgICAgICBldmVudHMuY2hhbm5lbCgnbGF5ZXJzJykudHJpZ2dlcignYWN0aXZlJywgbW9kZWwuY2hhbmdlZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgb25DaGVja3M6IGZ1bmN0aW9uIChtb2RlbCkge1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBtb2RlbC5jaGFuZ2VkKVxyXG4gICAgICAgICAgICBtLmxpbWl0ZWQuZ2V0KGtleSkgJiYgdGhpcy5zZXQoa2V5LCBtb2RlbC5nZXQoa2V5KSk7XHJcbiAgICB9LFxyXG4gICAgb25MaW1pdGVkOiBmdW5jdGlvbiAobW9kZWwpIHtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gbW9kZWwuY2hhbmdlZClcclxuICAgICAgICAgICAgdGhpcy5zZXQoa2V5LCBtb2RlbC5nZXQoa2V5KSAmJiBtLmNoZWNrcy5nZXQoa2V5KSk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxubmV3IEFTKCkiLCIvKipcclxuICogQ3JlYXRlZCBieSBOQlAxMDAwODMgb24gMjYuMDguMjAxNS5cclxuICovXHJcbnZhciBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKSxcclxuICAgIGV2ZW50cyA9IGFwcC5ldmVudHMsXHJcbiAgICB0eXBlcyA9IGFwcC5vcHRpb25zLnR5cGVzO1xyXG5cclxudmFyIFZpZXcgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XHJcbiAgICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZSgkKCcjdGVtcC1tZW51LW1ldGVvJykuaHRtbCgpKSxcclxuICAgIG1vZGVsOiByZXF1aXJlKCcuL21vZGVscycpLmNoZWNrcyxcclxuICAgIGxpbWl0ZWQ6IHJlcXVpcmUoJy4vbW9kZWxzJykubGltaXRlZCxcclxuICAgIGJpbmRpbmdzOiBfLm9iamVjdChfLmtleXModHlwZXMpLm1hcChmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIFsnIycgKyBrZXksIGtleV07XHJcbiAgICB9KSksXHJcbiAgICBtZXRlb1N0ZXA6IFs1LCA3LCA5LCAxMSwgMTUsIDE5LCAyMywgMjddLFxyXG4gICAgZXZlbnRzOiB7XHJcbiAgICAgICAgJ2NoYW5nZSAjbWV0ZW8tdGltZSc6ICdvblRpbWUnLFxyXG4gICAgICAgICdjbGljayAjbWV0ZW8tYW5pbWF0aW9uJzogJ29uQW5pbWF0aW9uJ1xyXG5cclxuICAgIH0sXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0ciwgb3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgdGhpcy4kZWxMaXN0VGltZSA9IHRoaXMuJCgnI21ldGVvLXRpbWUnKTtcclxuICAgICAgICB0aGlzLiRlbFByb2dyZXNzVGltZSA9IHRoaXMuJCgnI21ldGVvLXByb2dyZXNzLXRpbWUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5fY3JlYXRlTGlzdFRpbWUoKS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGVsTGlzdFRpbWUuYXBwZW5kKCc8b3B0aW9uIHZhbHVlID1cInswfVwiPnsxfTwvb3B0aW9uPicucmVwbGFjZSgnezB9JywgaXRlbS52YWx1ZSkucmVwbGFjZSgnezF9JywgaXRlbS50aXRsZSkpO1xyXG4gICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICAgIHRoaXMuc3RpY2tpdCgpO1xyXG4gICAgICAgIHRoaXMubGltaXRlZC5vbignY2hhbmdlJywgdGhpcy5vbkxpbWl0ZWQsIHRoaXMpO1xyXG4gICAgfSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuJGVsLmFwcGVuZCh0aGlzLnRlbXBsYXRlKHR5cGVzKSk7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMubGltaXRlZC50b0pTT04oKSlcclxuICAgICAgICAgICAgdGhpcy5fc2V0TGltaXRlZChrZXksIHRoaXMubGltaXRlZC5nZXQoa2V5KSk7XHJcblxyXG4gICAgfSxcclxuICAgIG9uVGltZTogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBldmVudHMuY2hhbm5lbCgnbGF5ZXJzJykudHJpZ2dlcignbWV0ZW90aW1lJywgZS50YXJnZXQudmFsdWUpO1xyXG4gICAgfSxcclxuICAgIG9uQW5pbWF0aW9uOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fa2V5KTtcclxuICAgICAgICB2YXIgJHByb2dyZXNzID0gdGhpcy4kZWxQcm9ncmVzc1RpbWUucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5maW5kKCcucHJvZ3Jlc3MtYmFyJyksXHJcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy4kZWxMaXN0VGltZS52YWwoKSxcclxuICAgICAgICAgICAgbGlzdCA9IHRoaXMuX2NyZWF0ZUxpc3RUaW1lKCksXHJcbiAgICAgICAgICAgIHN0ZXAgPSAxMDAvICh0aGlzLm1ldGVvU3RlcC5sZW5ndGgtMSk7XHJcbiAgICAgICAgdGhpcy4kZWxMaXN0VGltZS5mb2N1cygpO1xyXG5cclxuICAgICAgICB0aGlzLl9pbmRleCA9IDA7XHJcbiAgICAgICAgdGhpcy5fc2V0TWV0ZW9UaW1lKHRoaXMubWV0ZW9TdGVwW3RoaXMuX2luZGV4XSk7XHJcbiAgICAgICAgJHByb2dyZXNzLndpZHRoKHRoaXMuX2luZGV4ICogc3RlcCArICclJyk7Ly8udGV4dChsaXN0W3RoaXMuX2luZGV4XS50aXRsZSk7XHJcbiAgICAgICAgdGhpcy5faW5kZXggKys7XHJcblxyXG4gICAgICAgIHRoaXMuX2tleSA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWV0ZW9TdGVwW3RoaXMuX2luZGV4XSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuX3NldE1ldGVvVGltZSh0aGlzLm1ldGVvU3RlcFt0aGlzLl9pbmRleF0pO1xyXG4gICAgICAgICAgICAgICAgJHByb2dyZXNzLndpZHRoKHRoaXMuX2luZGV4ICogc3RlcCArICclJyk7Ly8udGV4dChsaXN0W3RoaXMuX2luZGV4XS50aXRsZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pbmRleCsrO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fa2V5KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NldE1ldGVvVGltZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRlbFByb2dyZXNzVGltZS5hZGRDbGFzcygnaGlkZScpO1xyXG4gICAgICAgICAgICAgICAgJHByb2dyZXNzLndpZHRoKCcwJScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpLCAyMDAwKTtcclxuICAgIH0sXHJcbiAgICBvbkxpbWl0ZWQ6IGZ1bmN0aW9uIChtb2RlbCkge1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBtb2RlbC5jaGFuZ2VkKVxyXG4gICAgICAgICAgICB0aGlzLl9zZXRMaW1pdGVkKGtleSwgbW9kZWwuZ2V0KGtleSkpO1xyXG4gICAgfSxcclxuICAgIF9zZXRQcm9ncmVzczogZnVuY3Rpb24oJGVsLCBzdGVwLCB2YWx1ZSl7XHJcblxyXG4gICAgfSxcclxuICAgIF9zZXRNZXRlb1RpbWU6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuJGVsTGlzdFRpbWUudmFsKHZhbHVlKS50cmlnZ2VyKCdjaGFuZ2UnKTtcclxuICAgIH0sXHJcbiAgICBfc2V0TGltaXRlZDogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICAgICB0aGlzLiQoJyMnICsga2V5KVxyXG4gICAgICAgICAgICAucHJvcCgnZGlzYWJsZWQnLCAhdmFsdWUpXHJcbiAgICAgICAgICAgIC5wYXJlbnQoKVxyXG4gICAgICAgICAgICAudG9nZ2xlQ2xhc3MoJ21hcC1haXItc3BhY2UtbGltaXRlZCcsICF2YWx1ZSlcclxuICAgICAgICAgICAgLmF0dHIoJ3RpdGxlJywgdmFsdWUgPyB0eXBlc1trZXldLnRpdGxlIDogJ9C+0LPRgNCw0L3QuNGH0LXQvdC40LUgem9vbS4uLicpO1xyXG4gICAgfSxcclxuICAgIF9jcmVhdGVMaXN0VGltZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBub3cgPSBtb21lbnQudXRjKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NREQwMDAwMDAnKSwgJ1lZWVlNTURESEhtbXNzJyksXHJcbiAgICAgICAgICAgIFVUQ0hvdXJzID0gbmV3IERhdGUoKS5nZXRVVENIb3VycygpLFxyXG4gICAgICAgICAgICBzdGFydFRpbWUgPSAoVVRDSG91cnMgLyA2IHwgMCkgKiA2O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5tZXRlb1N0ZXAubWFwKGZ1bmN0aW9uIChrLCBpbmRleCkge1xyXG4gICAgICAgICAgICBub3cuYWRkKGluZGV4IDwgNCA/IDYgOiAxMiwgJ2hvdXJzJyk7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogayxcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBub3cudXRjKCkuZm9ybWF0KCdERC1NTU0gSEg6MDAgVVRDJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmlldzsiLCIvKipcclxuICogQ3JlYXRlZCBieSBhbGV4IG9uIDMwLjA3LjIwMTUuXHJcbiAqL1xyXG5cclxuXHJcbnZhciBDb250cm9sID0gTC5Db250cm9sLmV4dGVuZCh7XHJcbiAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgaGlkZTogZmFsc2UsXHJcbiAgICAgICAgcG9zaXRpb246ICdib3R0b21yaWdodCcsXHJcbiAgICAgICAgY2xhc3NOYW1lOiAnaWNvbi13aW5kLXNjYWxlIG1hcC13aW5kLXNjYWxlJ1xyXG4gICAgfSxcclxuICAgIGluY2x1ZGVzOiBMLk1peGluLkV2ZW50cyxcclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgQ29udHJvbC5fX3N1cGVyX18uaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIC8vaGlzLmlkID0gb3B0aW9ucy5pZDtcclxuICAgICAgICB0aGlzLl9jcmVhdGUodGhpcy5vcHRpb25zKTtcclxuICAgIH0sXHJcblxyXG4gICAgb25BZGQ6IGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICAvL3RoaXMuc2V0VmlzaWJsZShmYWxzZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZWw7XHJcbiAgICB9LFxyXG4gICAgX2NyZWF0ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgZWwgPSB0aGlzLmVsID0gTC5Eb21VdGlsLmNyZWF0ZSgnZGl2Jywgb3B0aW9ucy5jbGFzc05hbWUpO1xyXG5cclxuICAgICAgICB2YXIgc3RvcCA9IEwuRG9tRXZlbnQuc3RvcFByb3BhZ2F0aW9uO1xyXG4gICAgICAgIEwuRG9tRXZlbnRcclxuICAgICAgICAgICAgLm9uKGVsLCAnY29udGV4dG1lbnUnLCBzdG9wKVxyXG4gICAgICAgICAgICAub24oZWwsICdjb250ZXh0bWVudScsIEwuRG9tRXZlbnQucHJldmVudERlZmF1bHQpXHJcbiAgICAgICAgICAgIC5vbihlbCwgJ2NsaWNrJywgc3RvcClcclxuICAgICAgICAgICAgLm9uKGVsLCAnbW91c2Vkb3duJywgc3RvcClcclxuICAgICAgICAgICAgLm9uKGVsLCAnZGJsY2xpY2snLCBzdG9wKVxyXG4gICAgICAgICAgICAub24oZWwsICdjbGljaycsIEwuRG9tRXZlbnQucHJldmVudERlZmF1bHQpXHJcbiAgICAgICAgICAgIC5vbihlbCwgJ2NsaWNrJywgdGhpcy5fcmVmb2N1c09uTWFwLCB0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKS5hdHRyKHtcclxuICAgICAgICAgICAgaWQ6IG9wdGlvbnMuaWQsXHJcbiAgICAgICAgICAgIHRpdGxlOiBvcHRpb25zLnRpdGxlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgb3B0aW9ucy5pY29uICYmIHRoaXMuJGVsLmFwcGVuZChvcHRpb25zLmljb24pO1xyXG4gICAgICAgIHJldHVybiBlbDtcclxuICAgIH0sXHJcblxyXG59KTtcclxuXHJcbnZhciBjbnQgPSBuZXcgQ29udHJvbCgpO1xyXG5cclxuXHJcbmFwcC5ldmVudHMuY2hhbm5lbCgnbGF5ZXJzJykub24oJ2FjdGl2ZScsIGZ1bmN0aW9uICh0eXBlcykge1xyXG4gICAgaWYgKCdXSU5EJyBpbiB0eXBlcylcclxuICAgICAgICBpZiAodHlwZXMuV0lORClcclxuICAgICAgICAgICAgYXBwLm1hcC5hZGRDb250cm9sKGNudCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBhcHAubWFwLnJlbW92ZUNvbnRyb2woY250KTtcclxuXHJcbiAgICAvLyYmIGNudC5zZXRWaXNpYmxlKHR5cGVzLldJTkRWRUNUT1IpO1xyXG5cclxufSk7XHJcblxyXG5cclxuXHJcblxyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBhbGV4IG9uIDA3LjA5LjIwMTUuXHJcbiAqL1xyXG5cclxudmFyIFZpZXdUYWJzID0gcmVxdWlyZSgnLi4vLi4vLi4vbGlicy92aWV3cy90YWJzJyksXHJcbiAgICBNb2RlbD0gIHJlcXVpcmUoJy4vbW9kZWwnKSxcclxuICAgIFZpZXdQcml2YXRlID0gcmVxdWlyZSgnLi9wcml2YXRlJyksXHJcbiAgICBWaWV3TmV0d29ya3MgPSByZXF1aXJlKCcuL3NvY2lhbC1uZXR3b3JrcycpLFxyXG4gICAgZXZlbnRBdXRoID0gYXBwLmV2ZW50cy5jaGFubmVsKCdhdXRoJyk7XHJcblxyXG52YXIgVmlldyA9IFZpZXdUYWJzLmV4dGVuZCh7XHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIFZpZXcuX19zdXBlcl9fLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICB0aGlzLnZpZXdzID0ge31cclxuICAgICAgICB0aGlzLnNldFRhYnMob3B0aW9ucy50YWJzKTtcclxuICAgIH0sXHJcbiAgICBzZXRUYWJzOiBmdW5jdGlvbiAodGFicykge1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gdGFicykge1xyXG4gICAgICAgICAgICB2YXIgVmlldyA9IHRhYnNbcF07XHJcbiAgICAgICAgICAgIHRoaXMudmlld3NbcF0gPSBuZXcgVmlldyh7ZWw6IHRoaXMuJChwKSwgbW9kZWw6IHRoaXMubW9kZWx9KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgY21kTG9nb3V0OiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICQuZ2V0KCcvYXBpL2F1dGgvbG9nb3V0JylcclxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gXCIvXCI7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudEF1dGgudHJpZ2dlcignbG9nb3V0Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcbn0pO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgLy9wb3NpdGlvbjogJ3RvcGNlbnRlcicsXHJcbiAgICBwb3NpdGlvbjogJ3RvcHJpZ2h0JyxcclxuICAgIGlkOiAncHJvZmlsZScsXHJcbiAgICB0aXRsZTogJ9Cf0YDQvtGE0LjQu9GMINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjycsXHJcbiAgICBpY29uOiAnPGRpdj48L2RpYz4nLC8vJzxkaXYgY2xhc3M9XCJpY29uLWxvZ291dCBtYXAtbWVudS1idXR0b24taWNvblwiLz4nLFxyXG4gICAgaGlkZTogdHJ1ZSxcclxuICAgIHBvcG92ZXI6IHtcclxuICAgICAgICB2aWV3OiBuZXcgVmlldyh7XHJcbiAgICAgICAgICAgIGVsOiAkKCcjdGVtcC1wcm9maWxlJykuaHRtbCgpLFxyXG4gICAgICAgICAgICB0YWJzOiB7XHJcbiAgICAgICAgICAgICAgICAnLnRhYjEnOiBWaWV3UHJpdmF0ZSxcclxuICAgICAgICAgICAgICAgICcudGFiMic6IFZpZXdOZXR3b3Jrc1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBtb2RlbDogbmV3IE1vZGVsKClcclxuICAgICAgICB9KSxcclxuICAgICAgICB0aXRsZTogJ9Cf0YDQvtGE0LjQu9GMINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjydcclxuXHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkg0JDQu9C10LrRgdCw0L3QtNGAIG9uIDEzLjA5LjIwMTUuXHJcbiAqL1xyXG5cclxudmFyIHJlbW90ZU1peCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYnMvdmlld3MvcmVtb3RlLW1peCcpLFxyXG4gICAgZXZlbnRBdXRoID0gYXBwLmV2ZW50cy5jaGFubmVsKCdhdXRoJyk7XHJcblxyXG52YXIgTmV0d29yayA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XHJcbiAgICBpZEF0dHJpYnV0ZTogJ19pZCcsXHJcbiAgICBkZWZhdWx0czp7XHJcblxyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG52YXIgQ29sbGVjdGlvbiA9IEJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcclxuICAgIHVybDogJy9hcGkvYXV0aC9uZXR3b3JrcycsXHJcbiAgICBtb2RlbDogTmV0d29yayxcclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBldmVudEF1dGgub24oJ2xvZ2luJywgdGhpcy5vbkxvZ2luLCB0aGlzKTtcclxuICAgIH0sXHJcbiAgICBvbkxvZ2luOiBmdW5jdGlvbihwcm9maWxlSWQpe1xyXG4gICAgICAgIHRoaXMuZmV0Y2goe3Jlc2V0OnRydWV9KTtcclxuICAgIH1cclxufSk7XHJcblxyXG52YXIgUm10TW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQocmVtb3RlTWl4Lk1vZGVsKSxcclxuICAgIE1vZGVsID0gUm10TW9kZWwuZXh0ZW5kKHtcclxuICAgICAgICBuZXR3b3JrczogbmV3IENvbGxlY3Rpb24oKSxcclxuICAgICAgICB1cmxSb290OiAnL2FwaS9hdXRoL2xvZ2luJyxcclxuICAgICAgICBkZWZhdWx0czoge1xyXG4gICAgICAgICAgICB1c2VybmFtZTogJycsXHJcbiAgICAgICAgICAgIG5hbWU6ICcnLFxyXG4gICAgICAgICAgICBwaG9uZTogJycsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB2YWxpZGF0aW9uOiB7XHJcbiAgICAgICAgICAgIHVzZXJuYW1lOiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHBhdHRlcm46ICdlbWFpbCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbmFtZToge1xyXG4gICAgICAgICAgICAgICAgbWluTGVuZ3RoOiA1LFxyXG4gICAgICAgICAgICAgICAgcmVtb3RlRXJyNDAwOiB7fVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwaG9uZToge1xyXG4gICAgICAgICAgICAgICAgbWluTGVuZ3RoOiAxMCxcclxuICAgICAgICAgICAgICAgIHJlbW90ZUVycjQwMDoge31cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmVtb3RlRXJyOiB7XHJcbiAgICAgICAgICAgICAgICByZW1vdGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBmbjogZnVuY3Rpb24gKGVyciwgbW9kZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVyci5zdGF0dXMgPT09IDQwMCA/IG51bGwgOiBtb2RlbC5tZXNzYWdlRXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIE1vZGVsLl9fc3VwZXJfXy5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIGV2ZW50QXV0aC5vbignbG9naW4nLCB0aGlzLm9uTG9naW4sIHRoaXMpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25Mb2dpbjogZnVuY3Rpb24gKGF0dHIpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXQoYXR0cik7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbDtcclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkg0JDQu9C10LrRgdCw0L3QtNGAIG9uIDEzLjA5LjIwMTUuXHJcbiAqL1xyXG5cclxudmFyIHJlbW90ZU1peCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYnMvdmlld3MvcmVtb3RlLW1peCcpLFxyXG4gICAgZXZlbnRBdXRoID0gYXBwLmV2ZW50cy5jaGFubmVsKCdhdXRoJyk7XHJcblxyXG52YXIgUm10VmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHJlbW90ZU1peC5WaWV3KSxcclxuICAgIFZpZXcgPSBSbXRWaWV3LmV4dGVuZCh7XHJcbiAgICAgICAgZXZlbnRzOiB7XHJcbiAgICAgICAgICAgIFwic3VibWl0XCI6IFwib25TdWJtaXRcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYmluZGluZ3M6IHtcclxuICAgICAgICAgICAgXCJbbmFtZT11c2VybmFtZV1cIjogXCJ1c2VybmFtZVwiLFxyXG4gICAgICAgICAgICBcIltuYW1lPW5hbWVdXCI6IFwibmFtZVwiLFxyXG4gICAgICAgICAgICBcIltuYW1lPXBob25lXVwiOiBcInBob25lXCJcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoYXR0ciwgb3B0aW9ucykge1xyXG4gICAgICAgICAgICBCYWNrYm9uZS5WYWxpZGF0aW9uLmJpbmQodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RpY2tpdCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9zZXRSZW1vdGVFdmVudHMoKTtcclxuICAgICAgICAgICAgZXZlbnRBdXRoLm9uKCdsb2dpbicsIHRoaXMub25Mb2dpbiwgdGhpcyk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgb25TeW5jOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21hc2soKS5lbmQoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uRXJyb3I6IGZ1bmN0aW9uIChtb2RlbCwgeGhyLCBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21hc2soKS5lbmQoMzAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGVsLnJlbW90ZVZhbGlkYXRlKHhocik7XHJcbiAgICAgICAgICAgICAgICAvL2V2ZW50QXV0aC50cmlnZ2VyKCdsb2dvdXQnLCB7fSk7XHJcbiAgICAgICAgICAgIH0sIHRoaXMpO1xyXG5cclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uU3VibWl0OiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMubW9kZWwuc2F2ZSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25Mb2dpbjogZnVuY3Rpb24gKGF0dHIpIHtcclxuICAgICAgICAgICAgdGhpcy5tb2RlbC5zZXQoYXR0cik7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgX21hc2tTZWxlY3RvcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kZWwucGFyZW50cygnLnBvcG92ZXItY29udGVudCcpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBWaWV3O1xyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSDQkNC70LXQutGB0LDQvdC00YAgb24gMTMuMDkuMjAxNS5cclxuICovXHJcblxyXG52YXIgZXZlbnRBdXRoID0gYXBwLmV2ZW50cy5jaGFubmVsKCdhdXRoJyksXHJcbiAgICBWaWV3Q29tbWFuZCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYnMvdmlld3MvY29tbWFuZCcpO1xyXG5cclxudmFyIFZpZXcgPSBWaWV3Q29tbWFuZC5leHRlbmQoe1xyXG4gICAgaXRlbVRlbXBsYXRlOiAkKCcjdGVtcC1wcm9maWxlLWl0ZW0tbmV0cycpLmh0bWwoKSxcclxuXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIFZpZXcuX19zdXBlcl9fLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICB0aGlzLiR0YWJsZSA9IHRoaXMuJCgnI25ldHMnKTtcclxuICAgICAgICB0aGlzLmNvbGxlY3Rpb24gPSB0aGlzLm1vZGVsLm5ldHdvcmtzO1xyXG4gICAgICAgIHRoaXMuY29sbGVjdGlvbi5vbigncmVzZXQgYWRkIHJlbW92ZScsIHRoaXMucmVuZGVyLCB0aGlzKTtcclxuICAgICAgICB3aW5kb3cucHJlQmluZGluZyA9IHRoaXMuX3Rva2VuLmJpbmQodGhpcyk7XHJcbiAgICB9LFxyXG5cclxuICAgIGFkZE5ldHdvcms6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgZGF0YSA9ICQucGFyc2VKU09OKGRhdGEudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgaWYgKCFkYXRhLmVycm9yKVxyXG4gICAgICAgICAgICB0aGlzLmNvbGxlY3Rpb24uY3JlYXRlKGRhdGEsIHt3YWl0OiB0cnVlfSk7XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy4kdGFibGUuZW1wdHkoKTtcclxuICAgICAgICB0aGlzLmNvbGxlY3Rpb24uZWFjaCh0aGlzLnJlbmRlckl0ZW0sIHRoaXMpO1xyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW06IGZ1bmN0aW9uIChtb2RlbCkge1xyXG4gICAgICAgIHZhciBlbCA9IEwuVXRpbC50ZW1wbGF0ZSh0aGlzLml0ZW1UZW1wbGF0ZSwgbW9kZWwudG9KU09OKCkpO1xyXG4gICAgICAgIHRoaXMuJCgnI25ldHMnKS5hcHBlbmQoZWwpO1xyXG4gICAgfSxcclxuXHJcbiAgICBjbWRSZW1vdmU6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHZhciBpbmRleCA9ICQoZS5jdXJyZW50VGFyZ2V0KS5kYXRhKCdpbmRleCcpO1xyXG4gICAgICAgIHRoaXMuY29sbGVjdGlvbi5nZXQoaW5kZXgpLmRlc3Ryb3koe3dhaXQ6IHRydWV9KTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG4gICAgX3Rva2VuOiBmdW5jdGlvbiAodG9rZW4pIHtcclxuICAgICAgICB2YXIgY2FsbGJhY2sgPSB0aGlzLmFkZE5ldHdvcmsuYmluZCh0aGlzKTtcclxuICAgICAgICAkLmdldEpTT04oXCIvL3Vsb2dpbi5ydS90b2tlbi5waHA/aG9zdD1cIiArIGVuY29kZVVSSUNvbXBvbmVudChsb2NhdGlvbi50b1N0cmluZygpKSArIFwiJnRva2VuPVwiICsgdG9rZW4gKyBcIiZjYWxsYmFjaz0/XCIsIGNhbGxiYWNrKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IE5CUDEwMDA4MyBvbiAxOS4wOC4yMDE1LlxyXG4gKi9cclxuXHJcbi8vcm91dGUgZXZlbnQgY29udHJvbGxlciBcclxudmFyIENvbnRyb2xsZXIgPSBmdW5jdGlvbiAocm91dGUpIHtcclxuICAgIHRoaXMuaW5pdGlhbGl6ZShyb3V0ZSk7IC8vIHJvdXRlIGFzIGNvbGxlY3Rpb24gQmFja2JvbmVcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlID0ge1xyXG4gICAgZXZlbnRzOiBhcHAuZXZlbnRzLmNoYW5uZWwoJ3JvdXRlJyksXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAocm91dGUpIHtcclxuICAgICAgICB0aGlzLnJvdXRlID0gcm91dGU7XHJcbiAgICAgICAgdGhpcy5ldmVudHNcclxuICAgICAgICAgICAgLm9uKCdhZGQnLCB0aGlzLm9uQWRkLCB0aGlzKVxyXG4gICAgICAgICAgICAub24oJ3JlbW92ZScsIHRoaXMub25SZW1vdmUsIHRoaXMpXHJcbiAgICAgICAgICAgIC5vbignY2hhbmdlJywgdGhpcy5vbkNoYW5nZSwgdGhpcylcclxuICAgICAgICAgICAgLm9uKCdyZXNldCcsIHRoaXMub25SZXNldCwgdGhpcylcclxuICAgICAgICAgICAgLm9uKCdyZXZlcnNlJywgdGhpcy5vblJldmVyc2UsIHRoaXMpO1xyXG4gICAgfSxcclxuXHJcbiAgICBvbkFkZDogZnVuY3Rpb24gKGF0dHIsIG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLnJvdXRlLmFkZChhdHRyLCBvcHRpb25zKTtcclxuICAgIH0sXHJcbiAgICBvblJlbW92ZTogZnVuY3Rpb24gKG1vZGVsLCBvcHRpb25zKSB7XHJcbiAgICAgICAgbW9kZWwgPSB0aGlzLl9nZXRNb2RlbChtb2RlbCk7XHJcbiAgICAgICAgdGhpcy5yb3V0ZS5yZW1vdmUobW9kZWwsIG9wdGlvbnMpO1xyXG4gICAgfSxcclxuICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAobW9kZWwsIGF0dHIsIG9wdGlvbnMpIHtcclxuICAgICAgICBtb2RlbCA9IHRoaXMuX2dldE1vZGVsKG1vZGVsKTtcclxuICAgICAgICBtb2RlbC5zZXQoYXR0ciwgb3B0aW9ucyk7XHJcbiAgICB9LFxyXG4gICAgb25SZXNldDogZnVuY3Rpb24gKGF0dHJzLCBvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy5yb3V0ZS5yZXNldChhdHRycywgb3B0aW9ucyk7XHJcbiAgICB9LFxyXG4gICAgb25SZXZlcnNlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5yb3V0ZS5yZXZlcnNlKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIF9nZXRNb2RlbDogZnVuY3Rpb24gKG1vZGVsKSB7XHJcbiAgICAgICAgcmV0dXJuIF8uaXNTdHJpbmcobW9kZWwpID8gdGhpcy5yb3V0ZS5nZXQobW9kZWwpIDogbW9kZWw7XHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHM9Q29udHJvbGxlcjsiLCIvKipcclxuICogQ3JlYXRlZCBieSBOQlAxMDAwODMgb24gMTYuMDguMjAxNS5cclxuICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxuXHJcblxyXG52YXIgUm91dGUgPSByZXF1aXJlKCcuL21vZGVsJyksXHJcbiAgICBDbnQgPSByZXF1aXJlKCcuL2NvbnRyb2xsZXInKSxcclxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXdzL21hcC9yb3V0ZScpO1xyXG5cclxudmFyIGMgPSBuZXcgUm91dGUoW10sIHtwYXJzZTogdHJ1ZX0pO1xyXG5cclxubmV3IENudChjKTtcclxuXHJcbnZhciB2ID0gbmV3IFZpZXcoYyk7XHJcblxyXG52LmFkZFRvKGFwcC5tYXApO1xyXG4vL1xyXG4vL3NldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4vLyAgICBjLmF0KDApLnNldCh7aWQ6IDYsIGxhdGxuZzogTC5sYXRMbmcoWzU2LCA0M10pLCB0eXBlOiAnZGYnfSwge3BhcnNlOiB0cnVlfSk7XHJcbi8vfSwgMjAwMClcclxuLy9cclxuLy9cclxuLy9zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuLy8gICAgYy5hdCgwKS5zZXQoe2lkOiA2LCBsYXRsbmc6IEwubGF0TG5nKFs1NiwgNDNdKSwgdHlwZTogJ3dwJ30sIHtwYXJzZTogdHJ1ZX0pO1xyXG4vLyAgICAvL2MucmV2ZXJzZSgpO1xyXG4vLyAgICAvL2MucmVzZXQoKTtcclxuLy8gICAgLy9tYXAucmVtb3ZlTGF5ZXIodik7XHJcbi8vfSwgNDAwMCk7XHJcblxyXG4vL3ZhciBHZW9kZXNpYyA9IEwuZ2VvZGVzaWMoW10sIHtcclxuLy8gICAgd2VpZ2h0OiA3LFxyXG4vLyAgICBvcGFjaXR5OiAwLjUsXHJcbi8vICAgIGNvbG9yOiAnYmx1ZScsXHJcbi8vICAgIHN0ZXBzOiA1MFxyXG4vL30pLmFkZFRvKG1hcCk7XHJcbi8vdmFyIGJlcmxpbiA9IG5ldyBMLkxhdExuZyg1NiwgNDMpO1xyXG4vLy8vdmFyIGxvc2FuZ2VsZXMgPSBuZXcgTC5MYXRMbmcoMzMuODIsIC0xMTguMzgpO1xyXG4vL3ZhciBjYXBldG93biA9IG5ldyBMLkxhdExuZyg1NiwgNDQpO1xyXG4vL1xyXG4vL0dlb2Rlc2ljLnNldExhdExuZ3MoW1tiZXJsaW4sICBjYXBldG93bl1dKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBOQlAxMDAwODMgb24gMTYuMDguMjAxNS5cclxuICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIFdheVBvaW50ID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcclxuICAgIGRlZmF1bHRzOiB7XHJcbiAgICAgICAgaWQ6IG51bGwsXHJcbiAgICAgICAgdHlwZTogJ3dwJyxcclxuICAgICAgICBuYW1lOiAnV2F5IFBvaW50JyxcclxuICAgICAgICBsYXRsbmc6IG51bGwsXHJcbiAgICAgICAgaWNvbjogbnVsbFxyXG4gICAgfSxcclxuICAgIGlzRGVmYXVsdFR5cGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgIHJldHVybiB0aGlzLmdldCgndHlwZScpID09PSB0aGlzLmRlZmF1bHRzLnR5cGU7XHJcbiAgICB9LFxyXG4gICAgZ2V0SWNvbjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldCgnaWNvbicpIHx8IHRoaXMuZ2V0KCd0eXBlJyk7XHJcbiAgICB9LFxyXG4gICAgcGFyc2U6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgaWYgKGRhdGEubGF0bG5nICYmIF8uaXNBcnJheShkYXRhLmxhdGxuZykpXHJcbiAgICAgICAgICAgIGRhdGEubGF0bG5nID0gTC5sYXRMbmcoZGF0YS5sYXRsbmcpO1xyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfSxcclxuICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmNvbGxlY3Rpb24uaW5kZXhPZih0aGlzKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLm1vZGVsc1tpbmRleCArIDFdO1xyXG4gICAgfSxcclxuICAgIHByZXY6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmNvbGxlY3Rpb24uaW5kZXhPZih0aGlzKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLm1vZGVsc1tpbmRleCAtIDFdO1xyXG4gICAgfSxcclxuXHJcbiAgICBpc0NoYW5nZVJvdXRlTWFwOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuICEhKHRoaXMuY2hhbmdlZC5sYXRsbmcgfHwgdGhpcy5jaGFuZ2VkLnR5cGUgfHwgdGhpcy5jaGFuZ2VkLmljb24pO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbnZhciBSb3V0ZSA9IEJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcclxuICAgIG1vZGVsOiBXYXlQb2ludCxcclxuICAgIGdldFBhdGg6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wbHVjaygnbGF0bG5nJyk7XHJcbiAgICB9LFxyXG4gICAgcmV2ZXJzZTogZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgbW9kZWxzID0gdGhpcy5tb2RlbHMucmV2ZXJzZSgpO1xyXG4gICAgICAgIHRoaXMucmVzZXQobW9kZWxzKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJvdXRlO1xyXG5cclxuXHJcbi8qXHJcbiB3cC5vbignY2hhbmdlJywgZnVuY3Rpb24obW9kZWwpe1xyXG4gY29uc29sZS5sb2cobW9kZWwudG9KU09OKCkpO1xyXG4gfSwgd3ApO1xyXG5cclxuIHdwLnNldCgnbGF0bG5nJywgTC5sYXRMbmcoNDMsNTYsMSkpO1xyXG4gd3Auc2V0KCdsYXRsbmcnLCBMLmxhdExuZyg0NCw1NiwyKSk7XHJcbiAqL1xyXG4iLCIvKipcclxuICogQ3JlYXRlZCBieSBOQlAxMDAwODMgb24gMTYuMDguMjAxNS5cclxuICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIEJhc2UgPSByZXF1aXJlKCcuL2RyYWctbWFya2VyJyksXHJcbiAgICBldmVudHMgPSBhcHAuZXZlbnRzO1xyXG5cclxudmFyIERpcmVjdGlvbiA9IEJhc2UuZXh0ZW5kKHtcclxuICAgIG9wdGlvbnM6IHtcclxuICAgICAgICBkcmFnZ2FibGU6IHRydWUsXHJcbiAgICAgICAgekluZGV4T2Zmc2V0OiAxMDAwLFxyXG4gICAgICAgIGljb246IEwuZGl2SWNvbih7XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2ljb24tYWlycGxhbmUnLFxyXG4gICAgICAgICAgICBpY29uU2l6ZTogTC5wb2ludCgxNiwgMTYpXHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAobW9kZWwsIG9wdGlvbnMpIHtcclxuICAgICAgICBEaXJlY3Rpb24uX19zdXBlcl9fLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICAvL3RoaXMuc2V0TGF0TG5nKFtdKTtcclxuICAgICAgICB0aGlzLmFuZ2xlID0gMDtcclxuICAgIH0sXHJcbiAgICAvLyDRgNCw0YHRh9C10YIg0Lgg0L7QsdC90L7QstC70LXQvdC40LUg0L/QvtC30LjRhtC40Lgg0Lgg0L/QvtCy0L7RgNC+0YLQsFxyXG4gICAgcmVmcmVzaDogZnVuY3Rpb24gKGxheWVyKSB7XHJcbiAgICAgICAgdmFyIG5leHQgPSB0aGlzLm1vZGVsLm5leHQoKTtcclxuICAgICAgICBpZiAobGF5ZXIuX21hcCAmJiBuZXh0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuYW5nbGUgPSB0aGlzLl9jYWxjQW5nbGUobmV4dCwgbGF5ZXIuX21hcCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0TGF0TG5nKHRoaXMuX2NhbGNMYXRsbmcobmV4dCwgbGF5ZXIuX21hcCwgdHJ1ZSkpO1xyXG4gICAgICAgICAgICB0aGlzLnZpc2libGUodHJ1ZSk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMudmlzaWJsZShmYWxzZSk7XHJcblxyXG4gICAgfSxcclxuICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgZS5tb2RlbCA9IHRoaXMubW9kZWw7XHJcbiAgICAgICAgZXZlbnRzLmNoYW5uZWwoJ2luZm8nKS50cmlnZ2VyKCdkaXJlY3Rpb24nLCBlKTtcclxuICAgIH0sXHJcbiAgICBvbkRyYWc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcGF0aCA9IF8uY29tcGFjdChbXHJcbiAgICAgICAgICAgIHRoaXMubW9kZWwuZ2V0KCdsYXRsbmcnKSxcclxuICAgICAgICAgICAgdGhpcy5nZXRMYXRMbmcoKSxcclxuICAgICAgICAgICAgdGhpcy5tb2RlbC5uZXh0KCkgJiYgdGhpcy5tb2RlbC5uZXh0KCkuZ2V0KCdsYXRsbmcnKVxyXG4gICAgICAgIF0pO1xyXG4gICAgICAgIHRoaXMuZHJhZ0xpbmUuc2V0TGF0TG5ncyhbcGF0aF0pO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyByb3RhdGUgbWFya2VyXHJcbiAgICBfc2V0UG9zOiBmdW5jdGlvbiAocG9zKSB7XHJcbiAgICAgICAgRGlyZWN0aW9uLl9fc3VwZXJfXy5fc2V0UG9zLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgICAgIGlmIChMLkRvbVV0aWwuVFJBTlNGT1JNKSB7XHJcbiAgICAgICAgICAgIC8vIHVzZSB0aGUgQ1NTIHRyYW5zZm9ybSBydWxlIGlmIGF2YWlsYWJsZVxyXG4gICAgICAgICAgICB0aGlzLl9pY29uLnN0eWxlW0wuRG9tVXRpbC5UUkFOU0ZPUk1dICs9ICcgcm90YXRlKCcgKyB0aGlzLmFuZ2xlICArICdkZWcpJztcclxuICAgICAgICB9IGVsc2UgaWYgKEwuQnJvd3Nlci5pZSkge1xyXG4gICAgICAgICAgICAvLyBmYWxsYmFjayBmb3IgSUU2LCBJRTcsIElFOFxyXG4gICAgICAgICAgICB2YXIgcmFkID0gdGhpcy5hbmdsZSAqIEwuTGF0TG5nLkRFR19UT19SQUQsXHJcbiAgICAgICAgICAgICAgICBjb3N0aGV0YSA9IE1hdGguY29zKHJhZCksXHJcbiAgICAgICAgICAgICAgICBzaW50aGV0YSA9IE1hdGguc2luKHJhZCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2ljb24uc3R5bGUuZmlsdGVyICs9ICcgcHJvZ2lkOkRYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0Lk1hdHJpeChzaXppbmdNZXRob2Q9XFwnYXV0byBleHBhbmRcXCcsIE0xMT0nICtcclxuICAgICAgICAgICAgY29zdGhldGEgKyAnLCBNMTI9JyArICgtc2ludGhldGEpICsgJywgTTIxPScgKyBzaW50aGV0YSArICcsIE0yMj0nICsgY29zdGhldGEgKyAnKSc7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBjYWxjdWxhdGlvblxyXG4gICAgX2NhbGNMYXRsbmc6IGZ1bmN0aW9uIChuZXh0LCBtYXAsIGlzR2VvZGVzaWMpIHtcclxuICAgICAgICB2YXIgbGF0bG5nPSB0aGlzLm1vZGVsLmdldCgnbGF0bG5nJyksXHJcbiAgICAgICAgICAgIGxhdGxuZzEgPW5leHQuZ2V0KCdsYXRsbmcnKTtcclxuICAgICAgICBpZihpc0dlb2Rlc2ljKSB7XHJcbiAgICAgICAgICAgIHZhciByID0gdGhpcy5kcmFnTGluZS5fdmluY2VudHlfaW52ZXJzZShsYXRsbmcsIGxhdGxuZzEpO1xyXG4gICAgICAgICAgICB2YXIgbCA9IHRoaXMuZHJhZ0xpbmUuX3ZpbmNlbnR5X2RpcmVjdChsYXRsbmcsIHIuaW5pdGlhbEJlYXJpbmcsIHIuZGlzdGFuY2UgLyAyKTtcclxuICAgICAgICAgICAgcmV0dXJuIGw7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1vZGVsLmdldCgnbGF0bG5nJykubWlkZGxlKG5leHQuZ2V0KCdsYXRsbmcnKSwgbWFwKTtcclxuICAgIH0sXHJcbiAgICBfY2FsY0FuZ2xlOiBmdW5jdGlvbiAobmV4dCwgbWFwLCBpc0dlb2Rlc2ljKSB7XHJcbiAgICAgICAgdmFyIGxhdGxuZz0gdGhpcy5tb2RlbC5nZXQoJ2xhdGxuZycpLFxyXG4gICAgICAgICAgICBsYXRsbmcxID1uZXh0LmdldCgnbGF0bG5nJyk7XHJcblxyXG4gICAgICAgIGlmKGlzR2VvZGVzaWMpIHtcclxuICAgICAgICAgICAgdmFyIHIgPSB0aGlzLmRyYWdMaW5lLl92aW5jZW50eV9pbnZlcnNlKGxhdGxuZywgbGF0bG5nMSk7XHJcbiAgICAgICAgICAgIHJldHVybiAoci5pbml0aWFsQmVhcmluZyArIDM2MCkgJSAzNjA7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiBsYXRsbmcuYW5nbGUobGF0bG5nMSwgbWFwKTtcclxuICAgIH1cclxuXHJcbn0pO1xyXG5tb2R1bGUuZXhwb3J0cyA9IERpcmVjdGlvbjsiLCIvKipcclxuICogQ3JlYXRlZCBieSBOQlAxMDAwODMgb24gMTYuMDguMjAxNS5cclxuICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIERyYWdNYXJrZXIgPSBMLk1hcmtlck1vZGVsLmV4dGVuZCh7XHJcbiAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgZHJhZ2dhYmxlOiB0cnVlXHJcbiAgICB9LFxyXG4gICAgZHJhZ0xpbmU6IEwuZ2VvZGVzaWMoW10sIHtcclxuICAgICAgICBzdGVwczo1MCxcclxuICAgICAgICBjbGFzc05hbWU6ICdtYXAtcm91dGUtbGluZS1kcmFnJ1xyXG4gICAgfSksXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAobW9kZWwsIG9wdGlvbnMpIHtcclxuICAgICAgICBEcmFnTWFya2VyLl9fc3VwZXJfXy5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgfSxcclxuICAgIHJlZnJlc2g6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB9LFxyXG4gICAgdG9nZ2xlOiBmdW5jdGlvbiAobGF5ZXIsIHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKGxheWVyKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgICAgICFsYXllci5oYXNMYXllcih0aGlzKSAmJiBsYXllci5hZGRMYXllcih0aGlzKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgbGF5ZXIuaGFzTGF5ZXIodGhpcykgJiYgbGF5ZXIucmVtb3ZlTGF5ZXIodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBpbnRlcmZhY2UgY29udHJvbFxyXG4gICAgb25BZGQ6IGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICBEcmFnTWFya2VyLl9fc3VwZXJfXy5vbkFkZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIHRoaXMub25DbGljayAmJiB0aGlzLm9uKCdjbGljaycsIHRoaXMub25DbGljaywgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5fc2V0dXAobWFwKTtcclxuICAgIH0sXHJcbiAgICBvblJlbW92ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuX2NsZWFyKCk7XHJcbiAgICAgICAgRHJhZ01hcmtlci5fX3N1cGVyX18ub25SZW1vdmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8gZXZlbnRzIGRyYWdcclxuICAgIG9uRHJhZ3N0YXJ0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5fc3RhcnRMYXRsbmcgPSB0aGlzLmdldExhdExuZygpO1xyXG4gICAgICAgIHRoaXMuZHJhZ0xpbmUuYWRkVG8odGhpcy5fbWFwKTtcclxuICAgIH0sXHJcbiAgICBvbkRyYWc6IGZ1bmN0aW9uIChlKSB7XHJcblxyXG4gICAgfSxcclxuICAgIG9uRHJhZ2VuZDogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICBlLmVuZExhdGxuZyA9IHRoaXMuZ2V0TGF0TG5nKCk7XHJcbiAgICAgICAgdGhpcy5zZXRMYXRMbmcodGhpcy5fc3RhcnRMYXRsbmcpO1xyXG4gICAgICAgIHRoaXMuZHJhZ0xpbmUuc2V0TGF0TG5ncyhbXSk7XHJcbiAgICAgICAgdGhpcy5fbWFwLnJlbW92ZUxheWVyKHRoaXMuZHJhZ0xpbmUpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgX3NldEV2ZW50czogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMub24oJ2RyYWdzdGFydCcsIHRoaXMub25EcmFnc3RhcnQsIHRoaXMpXHJcbiAgICAgICAgICAgIC5vbignZHJhZycsIHRoaXMub25EcmFnLCB0aGlzKVxyXG4gICAgICAgICAgICAub24oJ2RyYWdlbmQnLCB0aGlzLm9uRHJhZ2VuZCwgdGhpcyk7XHJcbiAgICB9LFxyXG4gICAgX3NldHVwOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmRyYWdnYWJsZSAmJiB0aGlzLl9zZXRFdmVudHMoKTtcclxuICAgIH0sXHJcbiAgICBfY2xlYXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLm9mZihudWxsLCBudWxsLCB0aGlzKTtcclxuICAgICAgICB0aGlzLm1vZGVsLm9mZihudWxsLCBudWxsLCB0aGlzKTtcclxuICAgICAgICB0aGlzLm1vZGVsPSBudWxsO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRHJhZ01hcmtlcjsiLCIvKipcclxuICogQ3JlYXRlZCBieSBOQlAxMDAwODMgb24gMTYuMDguMjAxNS5cclxuICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIERpcmVjdGlvbiA9IHJlcXVpcmUoJy4vZGlyZWN0aW9uJyk7XHJcblxyXG52YXIgSW5mb3JtZXIgPSBEaXJlY3Rpb24uZXh0ZW5kKHtcclxuICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cIntjfVwiIHRpdGxlPVwie2F9JmRlZzsge2R9INC60LxcIj57YX0mZGVnOyB7ZH0g0LrQvDwvZGl2PicsXHJcbiAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgekluZGV4T2Zmc2V0OiAxMDAwLFxyXG4gICAgICAgIGRyYWdnYWJsZTogZmFsc2UsXHJcbiAgICAgICAgY2xpY2thYmxlOiBmYWxzZSxcclxuICAgICAgICBpY29uOiBMLmRpdkljb24oe1xyXG4gICAgICAgICAgICBpY29uU2l6ZTogbmV3IEwuUG9pbnQoODAsIDEyKSxcclxuICAgICAgICAgICAgaWNvbkFuY2hvcjogbmV3IEwuUG9pbnQoMCwgNiksXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ21hcC1kaXJlY3QtaWNvbidcclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuXHJcbiAgICByZWZyZXNoOiBmdW5jdGlvbiAobGF5ZXIpIHtcclxuICAgICAgICB2YXIgbmV4dCA9IHRoaXMubW9kZWwubmV4dCgpO1xyXG5cclxuICAgICAgICBpZiAobGF5ZXIuX21hcCAmJiBuZXh0KSB7XHJcbiAgICAgICAgICAgIHZhciBsPSB0aGlzLl9jYWxjTGF0bG5nKG5leHQsIGxheWVyLl9tYXAsIHRydWUpO1xyXG4gICAgICAgICAgICB2YXIgdHJ1ZUN1cnNlID0gdGhpcy5fY2FsY0FuZ2xlKG5leHQsIGxheWVyLl9tYXAsIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLmFuZ2xlID0gdHJ1ZUN1cnNlIC0gOTA7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0TGF0TG5nKHRoaXMubW9kZWwuZ2V0KCdsYXRsbmcnKSk7XHJcbiAgICAgICAgICAgIHRoaXMudmlzaWJsZSh0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRIdG1sKHRydWVDdXJzZSxcclxuICAgICAgICAgICAgICAgIHRoaXMubW9kZWwuZ2V0KCdsYXRsbmcnKS5kaXN0YW5jZVRvKG5leHQuZ2V0KCdsYXRsbmcnKSksXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9waXhlbHNUb05leHQobGF5ZXIuX21hcCkgLyAyXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMudmlzaWJsZShmYWxzZSk7XHJcblxyXG4gICAgfSxcclxuICAgIHNldEh0bWw6IGZ1bmN0aW9uIChhLCBkLCBwKSB7XHJcbiAgICAgICAgdmFyICRpY29uID0gJCh0aGlzLl9pY29uKTtcclxuICAgICAgICBpZiAocCA8IHRoaXMub3B0aW9ucy5pY29uLm9wdGlvbnMuaWNvblNpemUueCsxMClcclxuICAgICAgICAgICAgJGljb24uaGlkZSgpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgJGljb25cclxuICAgICAgICAgICAgICAgIC5odG1sKEwuVXRpbC50ZW1wbGF0ZSh0aGlzLnRlbXBsYXRlLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYzogYSA+IDE4MCA/ICdtYXAtZGlyZWN0LWljb24tMTgwJyA6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgIGE6IGEgfCAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGQ6IGQgLyAxMDAwIHwgMFxyXG4gICAgICAgICAgICAgICAgfSkpXHJcbiAgICAgICAgICAgICAgICAuc2hvdygpO1xyXG4gICAgfSxcclxuXHJcbiAgICBfcGl4ZWxzVG9OZXh0OiBmdW5jdGlvbiAobWFwKSB7ICAgIC8vINGA0LDRgdGC0L7Rj9C90LjQtSDQvNC10LbQtNGDINGC0L7Rh9C60LDQvNC4INCyINC/0LjQutGB0LXQu9GP0YVcclxuICAgICAgICB2YXIgbmV4dCA9IHRoaXMubW9kZWwubmV4dCgpO1xyXG4gICAgICAgIGlmIChuZXh0KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tb2RlbC5nZXQoJ2xhdGxuZycpLnRvUG9pbnQobWFwKS5kaXN0YW5jZVRvKG5leHQuZ2V0KCdsYXRsbmcnKS50b1BvaW50KG1hcCkpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9LFxyXG5cclxuICAgIF9hbmdsZURpdjogZnVuY3Rpb24obmV4dCl7XHJcbiAgICAgICAgdmFyIGw9IHRoaXMuX2NhbGNMYXRsbmcobmV4dCwgbnVsbCwgdHJ1ZSk7XHJcbiAgICAgICAgdmFyIHRydWVDdXJzZSA9IHRoaXMuX2NhbGNBbmdsZShuZXh0LCBsYXllci5fbWFwLCB0cnVlKTtcclxuICAgIH1cclxufSk7XHJcbm1vZHVsZS5leHBvcnRzID0gSW5mb3JtZXI7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgTkJQMTAwMDgzIG9uIDE2LjA4LjIwMTUuXHJcbiAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBWZXJ0ZXggPSByZXF1aXJlKCcuL3ZlcnRleCcpLFxyXG4gICAgRGlyZWN0aW9uID0gcmVxdWlyZSgnLi9kaXJlY3Rpb24nKSxcclxuICAgIEluZm9ybWVyID0gcmVxdWlyZSgnLi9pbmZvcm1lcicpO1xyXG5cclxudmFyIE1hcmtlciA9IEwuTGF5ZXJNb2RlbC5leHRlbmQoe1xyXG4gICAgb3B0aW9uczoge30sXHJcbiAgICBfZXZSb3V0ZTogYXBwLmV2ZW50cy5jaGFubmVsKCdyb3V0ZScpLFxyXG5cclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChtb2RlbCwgb3B0aW9ucykge1xyXG4gICAgICAgIE1hcmtlci5fX3N1cGVyX18uaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gbmV3IERpcmVjdGlvbih0aGlzLm1vZGVsLCB0aGlzLm9wdGlvbnMuZGlyZWN0aW9uKVxyXG4gICAgICAgICAgICAub24oJ2RyYWdlbmQnLCB0aGlzLm9uRHJhZ2VuZERpcmVjdGlvbiwgdGhpcylcclxuICAgICAgICAgICAgLm9uKCdjbGljaycsIHRoaXMub25DbGljaywgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5hZGRMYXllcih0aGlzLmRpcmVjdGlvbik7XHJcblxyXG4gICAgICAgIHRoaXMudmVydGV4ID0gbmV3IFZlcnRleCh0aGlzLm1vZGVsLCB0aGlzLm9wdGlvbnMudmVydGV4KVxyXG4gICAgICAgICAgICAub24oJ2NvbnRleHRtZW51JywgdGhpcy5vbkNvbnRleHRtZW51VmVydGV4LCB0aGlzKVxyXG4gICAgICAgICAgICAub24oJ2RyYWdlbmQnLCB0aGlzLm9uRHJhZ2VuZFZlcnRleCwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5hZGRMYXllcih0aGlzLnZlcnRleCk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5mb3JtZXIgPSBuZXcgSW5mb3JtZXIodGhpcy5tb2RlbCk7XHJcbiAgICAgICAgdGhpcy5hZGRMYXllcih0aGlzLmluZm9ybWVyKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vaW50ZXJmYWNlIEwuTGF5ZXJcclxuICAgIG9uQWRkOiBmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgTWFya2VyLl9fc3VwZXJfXy5vbkFkZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKG1hcCk7XHJcbiAgICAgICAgbWFwLm9uKCd6b29tZW5kJywgdGhpcy5vblpvb20sIHRoaXMpO1xyXG4gICAgfSxcclxuICAgIG9uUmVtb3ZlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5fbWFwLm9mZignem9vbWVuZCcsIHRoaXMub25ab29tLCB0aGlzKTtcclxuICAgICAgICB0aGlzLmVhY2hMYXllcihmdW5jdGlvbiAobGF5ZXIpIHtcclxuICAgICAgICAgICAgbGF5ZXIub2ZmICYmIGxheWVyLm9mZihudWxsLCBudWxsLCB0aGlzKTtcclxuICAgICAgICB9LCB0aGlzKTtcclxuICAgICAgICB0aGlzLnZlcnRleCA9IHRoaXMuaW5mb3JtZXIgPSB0aGlzLmRpcmVjdGlvbiA9IHRoaXMubW9kZWwgPSBudWxsO1xyXG4gICAgICAgIE1hcmtlci5fX3N1cGVyX18ub25SZW1vdmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHJcbiAgICB9LFxyXG4gICAgb25ab29tOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5pbmZvcm1lci5yZWZyZXNoKHRoaXMpO1xyXG4gICAgfSxcclxuICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIChlKSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvL2NhbGMgZGlyZWN0aW9uIGFuZCBpbmZvcm1lclxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24ucmVmcmVzaCh0aGlzKTtcclxuICAgICAgICB0aGlzLmluZm9ybWVyLnJlZnJlc2godGhpcyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG4gICAgaW5kZXhPZjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1vZGVsLmNvbGxlY3Rpb24uaW5kZXhPZih0aGlzLm1vZGVsKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9tZXRob2RzIHZlcnRleFxyXG4gICAgb25EcmFnZW5kVmVydGV4OiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHRoaXMuX2V2Um91dGUudHJpZ2dlcignY2hhbmdlJywgdGhpcy5tb2RlbC5jaWQsIHtsYXRsbmc6IGUuZW5kTGF0bG5nfSk7XHJcbiAgICB9LFxyXG4gICAgb25Db250ZXh0bWVudVZlcnRleDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLl9ldlJvdXRlLnRyaWdnZXIoJ3JlbW92ZScsIHRoaXMubW9kZWwpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSlcclxuICAgIH0sXHJcblxyXG4gICAgLy9tZXRob2RzIGRpcmVjdGlvblxyXG4gICAgb25EcmFnZW5kRGlyZWN0aW9uOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHRoaXMuX2V2Um91dGUudHJpZ2dlcignYWRkJywge2xhdGxuZzogZS5lbmRMYXRsbmd9LCB7YXQ6IHRoaXMuaW5kZXhPZigpICsgMX0pO1xyXG4gICAgfVxyXG5cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1hcmtlcjsiLCIvKipcclxuICogQ3JlYXRlZCBieSBOQlAxMDAwODMgb24gMTYuMDguMjAxNS5cclxuICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIE1hcmtlciA9IHJlcXVpcmUoJy4vbWFya2VyJyk7XHJcblxyXG5cclxudmFyIFJvdXRlID0gTC5MYXllckNvbGxlY3Rpb24uZXh0ZW5kKHtcclxuICAgIG9wdGlvbnM6IHtcclxuICAgICAgICB2ZXJ0ZXg6IHtcclxuICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsaW5lOiB7XHJcbiAgICAgICAgICAgIC8vd2VpZ2h0OiA3LFxyXG4gICAgICAgICAgICAvL29wYWNpdHk6IDAuNSxcclxuICAgICAgICAgICAgLy9jb2xvcjogJ2JsdWUnLFxyXG4gICAgICAgICAgICBzdGVwczogNTAsXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ21hcC1yb3V0ZS1saW5lJyxcclxuICAgICAgICAgICAgY2xpY2thYmxlOiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBkYXR1bToge1xyXG4gICAgICAgIGVsbGlwc29pZDoge1xyXG4gICAgICAgICAgICBhOiA2Mzc4MTM3LCAvLyA2Mzc4MTM3XHJcbiAgICAgICAgICAgIGI6IDYzNTY3NTIuMzE0MixcclxuICAgICAgICAgICAgZjogMSAvIDI5OC4yNTcyMjM1NjNcclxuICAgICAgICB9XHQgLy8gV0dTLTg0XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgUm91dGUuX19zdXBlcl9fLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICB2YXIgcCA9IHRoaXMuY29sbGVjdGlvbi5nZXRQYXRoKCk7XHJcbiAgICAgICAgdGhpcy5saW5lID0gTC5nZW9kZXNpYyhbcF0sIHRoaXMub3B0aW9ucy5saW5lKTtcclxuICAgICAgICAvL3RoaXMuYWRkTGF5ZXIodGhpcy5saW5lKTtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGVNYXJrZXJzKCk7XHJcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uXHJcbiAgICAgICAgICAgIC5vbignY2hhbmdlOmxhdGxuZycsIHRoaXMub25Nb2RlbExhdGxuZywgdGhpcylcclxuICAgICAgICAgICAgLm9uKCdyZW1vdmUnLCB0aGlzLm9uTW9kZWxSZW1vdmUsIHRoaXMpXHJcbiAgICAgICAgICAgIC5vbignYWRkJywgdGhpcy5vbk1vZGVsQWRkLCB0aGlzKVxyXG4gICAgICAgICAgICAub24oJ3Jlc2V0JywgdGhpcy5vbk1vZGVsUmVzZXQsIHRoaXMpXHJcbiAgICB9LFxyXG4gICAgb25BZGQ6IGZ1bmN0aW9uIChtYXApIHtcclxuICAgICAgICBSb3V0ZS5fX3N1cGVyX18ub25BZGQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICAvL3RoaXMubGluZS5hZGRUbyhtYXApO1xyXG4gICAgICAgIHRoaXMuYWRkTGF5ZXIodGhpcy5saW5lKTtcclxuXHJcbiAgICB9LFxyXG4gICAgb25SZW1vdmU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmNvbGxlY3Rpb24ub2ZmKG51bGwsIG51bGwsIHRoaXMpO1xyXG4gICAgICAgIFJvdXRlLl9fc3VwZXJfXy5vblJlbW92ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgfSxcclxuXHJcbiAgICBjYXB0dXJlOiBmdW5jdGlvbiAobGF0bG5nLCBwaXhlbHMsIG1hcCkge1xyXG4gICAgICAgIHZhciBfbWFwID0gbWFwIHx8IHRoaXMuX21hcDtcclxuICAgICAgICBpZiAoX21hcClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TGF5ZXJzKClcclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxheWVyIGluc3RhbmNlb2YgTWFya2VyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIGxheWVyLnZlcnRleC5nZXRMYXRMbmcoKS50b1BvaW50KF9tYXApLmRpc3RhbmNlVG8obGF0bG5nLnRvUG9pbnQoX21hcCkpIDw9IHBpeGVscztcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMpXHJcbiAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChsYXllcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyOiBsYXllcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2U6IGxheWVyLnZlcnRleC5nZXRMYXRMbmcoKS5kaXN0YW5jZVRvKGxhdGxuZylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgIH0sXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmxpbmUuc2V0TGF0TG5ncyhbdGhpcy5jb2xsZWN0aW9uLmdldFBhdGgoKV0pO1xyXG4gICAgICAgIHRoaXMuZWFjaExheWVyKGZ1bmN0aW9uIChsYXllcikge1xyXG4gICAgICAgICAgICBpZiAobGF5ZXIgaW5zdGFuY2VvZiBNYXJrZXIpXHJcbiAgICAgICAgICAgICAgICBsYXllci51cGRhdGUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBjcmVhdGVNYXJrZXJzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uLmVhY2goZnVuY3Rpb24gKG1vZGVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkTGF5ZXIobmV3IE1hcmtlcihtb2RlbCkpO1xyXG4gICAgICAgIH0sIHRoaXMpO1xyXG4gICAgfSxcclxuXHJcbiAgICBvbk1vZGVsTGF0bG5nOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH0sXHJcbiAgICBvbk1vZGVsQWRkOiBmdW5jdGlvbiAobW9kZWwpIHtcclxuICAgICAgICB0aGlzLmFkZExheWVyKG5ldyBNYXJrZXIobW9kZWwsIHRoaXMub3B0aW9ucy52ZXJ0ZXgpKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfSxcclxuICAgIG9uTW9kZWxSZW1vdmU6IGZ1bmN0aW9uIChtb2RlbCkge1xyXG4gICAgICAgIHZhciBsYXllciA9IF8uZmluZFdoZXJlKHRoaXMuZ2V0TGF5ZXJzKCksIHttb2RlbDogbW9kZWx9KTtcclxuICAgICAgICB0aGlzLnJlbW92ZUxheWVyKGxheWVyKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfSxcclxuICAgIG9uTW9kZWxSZXNldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZWFjaExheWVyKGZ1bmN0aW9uIChsYXllcikge1xyXG4gICAgICAgICAgICBpZiAobGF5ZXIgaW5zdGFuY2VvZiBNYXJrZXIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUxheWVyKGxheWVyKTtcclxuICAgICAgICB9LCB0aGlzKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZU1hcmtlcnMoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBWaW5jZW50eSBpbnZlcnNlIGNhbGN1bGF0aW9uLlxyXG4gICAgICogYmFzZWQgb24gdGhlIHdvcmsgb2YgQ2hyaXMgVmVuZXNzIChodHRwczovL2dpdGh1Yi5jb20vY2hyaXN2ZW5lc3MvZ2VvZGVzeSlcclxuICAgICAqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHtMYXRMbmd9IHAxIC0gTGF0aXR1ZGUvbG9uZ2l0dWRlIG9mIHN0YXJ0IHBvaW50LlxyXG4gICAgICogQHBhcmFtIHtMYXRMbmd9IHAyIC0gTGF0aXR1ZGUvbG9uZ2l0dWRlIG9mIGRlc3RpbmF0aW9uIHBvaW50LlxyXG4gICAgICogQHJldHVybnMge09iamVjdH0gT2JqZWN0IGluY2x1ZGluZyBkaXN0YW5jZSwgaW5pdGlhbEJlYXJpbmcsIGZpbmFsQmVhcmluZy5cclxuICAgICAqIEB0aHJvd3Mge0Vycm9yfSBJZiBmb3JtdWxhIGZhaWxlZCB0byBjb252ZXJnZS5cclxuICAgICAqL1xyXG4gICAgX3ZpbmNlbnR5X2ludmVyc2U6IGZ1bmN0aW9uIChwMSwgcDIpIHtcclxuICAgICAgICB2YXIgz4YxID0gcDEubGF0LnRvUmFkaWFucygpLCDOuzEgPSBwMS5sbmcudG9SYWRpYW5zKCk7XHJcbiAgICAgICAgdmFyIM+GMiA9IHAyLmxhdC50b1JhZGlhbnMoKSwgzrsyID0gcDIubG5nLnRvUmFkaWFucygpO1xyXG5cclxuICAgICAgICB2YXIgYSA9IHRoaXMuZGF0dW0uZWxsaXBzb2lkLmEsIGIgPSB0aGlzLmRhdHVtLmVsbGlwc29pZC5iLCBmID0gdGhpcy5kYXR1bS5lbGxpcHNvaWQuZjtcclxuXHJcbiAgICAgICAgdmFyIEwgPSDOuzIgLSDOuzE7XHJcbiAgICAgICAgdmFyIHRhblUxID0gKDEgLSBmKSAqIE1hdGgudGFuKM+GMSksIGNvc1UxID0gMSAvIE1hdGguc3FydCgoMSArIHRhblUxICogdGFuVTEpKSwgc2luVTEgPSB0YW5VMSAqIGNvc1UxO1xyXG4gICAgICAgIHZhciB0YW5VMiA9ICgxIC0gZikgKiBNYXRoLnRhbijPhjIpLCBjb3NVMiA9IDEgLyBNYXRoLnNxcnQoKDEgKyB0YW5VMiAqIHRhblUyKSksIHNpblUyID0gdGFuVTIgKiBjb3NVMjtcclxuXHJcbiAgICAgICAgdmFyIM67ID0gTCwgzrvKuSwgaXRlcmF0aW9ucyA9IDA7XHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICB2YXIgc2luzrsgPSBNYXRoLnNpbijOuyksIGNvc867ID0gTWF0aC5jb3MozrspO1xyXG4gICAgICAgICAgICB2YXIgc2luU3HPgyA9IChjb3NVMiAqIHNpbs67KSAqIChjb3NVMiAqIHNpbs67KSArIChjb3NVMSAqIHNpblUyIC0gc2luVTEgKiBjb3NVMiAqIGNvc867KSAqIChjb3NVMSAqIHNpblUyIC0gc2luVTEgKiBjb3NVMiAqIGNvc867KTtcclxuICAgICAgICAgICAgdmFyIHNpbs+DID0gTWF0aC5zcXJ0KHNpblNxz4MpO1xyXG4gICAgICAgICAgICBpZiAoc2luz4MgPT0gMCkgcmV0dXJuIDA7ICAvLyBjby1pbmNpZGVudCBwb2ludHNcclxuICAgICAgICAgICAgdmFyIGNvc8+DID0gc2luVTEgKiBzaW5VMiArIGNvc1UxICogY29zVTIgKiBjb3POuztcclxuICAgICAgICAgICAgdmFyIM+DID0gTWF0aC5hdGFuMihzaW7PgywgY29zz4MpO1xyXG4gICAgICAgICAgICB2YXIgc2luzrEgPSBjb3NVMSAqIGNvc1UyICogc2luzrsgLyBzaW7PgztcclxuICAgICAgICAgICAgdmFyIGNvc1NxzrEgPSAxIC0gc2luzrEgKiBzaW7OsTtcclxuICAgICAgICAgICAgdmFyIGNvczLPg00gPSBjb3PPgyAtIDIgKiBzaW5VMSAqIHNpblUyIC8gY29zU3HOsTtcclxuICAgICAgICAgICAgaWYgKGlzTmFOKGNvczLPg00pKSBjb3Myz4NNID0gMDsgIC8vIGVxdWF0b3JpYWwgbGluZTogY29zU3HOsT0wICjCpzYpXHJcbiAgICAgICAgICAgIHZhciBDID0gZiAvIDE2ICogY29zU3HOsSAqICg0ICsgZiAqICg0IC0gMyAqIGNvc1NxzrEpKTtcclxuICAgICAgICAgICAgzrvKuSA9IM67O1xyXG4gICAgICAgICAgICDOuyA9IEwgKyAoMSAtIEMpICogZiAqIHNpbs6xICogKM+DICsgQyAqIHNpbs+DICogKGNvczLPg00gKyBDICogY29zz4MgKiAoLTEgKyAyICogY29zMs+DTSAqIGNvczLPg00pKSk7XHJcbiAgICAgICAgfSB3aGlsZSAoTWF0aC5hYnMozrsgLSDOu8q5KSA+IDFlLTEyICYmICsraXRlcmF0aW9ucyA8IDEwMCk7XHJcbiAgICAgICAgaWYgKGl0ZXJhdGlvbnMgPj0gMTAwKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGb3JtdWxhIGZhaWxlZCB0byBjb252ZXJnZS4gQWx0ZXJpbmcgdGFyZ2V0IHBvc2l0aW9uLicpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92aW5jZW50eV9pbnZlcnNlKHAxLCB7bGF0OiBwMi5sYXQsIGxuZzogcDIubG5nIC0gMC4wMX0pXHJcbi8vXHR0aHJvdyBuZXcgRXJyb3IoJ0Zvcm11bGEgZmFpbGVkIHRvIGNvbnZlcmdlJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdVNxID0gY29zU3HOsSAqIChhICogYSAtIGIgKiBiKSAvIChiICogYik7XHJcbiAgICAgICAgdmFyIEEgPSAxICsgdVNxIC8gMTYzODQgKiAoNDA5NiArIHVTcSAqICgtNzY4ICsgdVNxICogKDMyMCAtIDE3NSAqIHVTcSkpKTtcclxuICAgICAgICB2YXIgQiA9IHVTcSAvIDEwMjQgKiAoMjU2ICsgdVNxICogKC0xMjggKyB1U3EgKiAoNzQgLSA0NyAqIHVTcSkpKTtcclxuICAgICAgICB2YXIgzpTPgyA9IEIgKiBzaW7PgyAqIChjb3Myz4NNICsgQiAvIDQgKiAoY29zz4MgKiAoLTEgKyAyICogY29zMs+DTSAqIGNvczLPg00pIC1cclxuICAgICAgICAgICAgQiAvIDYgKiBjb3Myz4NNICogKC0zICsgNCAqIHNpbs+DICogc2luz4MpICogKC0zICsgNCAqIGNvczLPg00gKiBjb3Myz4NNKSkpO1xyXG5cclxuICAgICAgICB2YXIgcyA9IGIgKiBBICogKM+DIC0gzpTPgyk7XHJcblxyXG4gICAgICAgIHZhciBmd2RBeiA9IE1hdGguYXRhbjIoY29zVTIgKiBzaW7OuywgY29zVTEgKiBzaW5VMiAtIHNpblUxICogY29zVTIgKiBjb3POuyk7XHJcbiAgICAgICAgdmFyIHJldkF6ID0gTWF0aC5hdGFuMihjb3NVMSAqIHNpbs67LCAtc2luVTEgKiBjb3NVMiArIGNvc1UxICogc2luVTIgKiBjb3POuyk7XHJcblxyXG4gICAgICAgIHMgPSBOdW1iZXIocy50b0ZpeGVkKDMpKTsgLy8gcm91bmQgdG8gMW1tIHByZWNpc2lvblxyXG4gICAgICAgIHJldHVybiB7ZGlzdGFuY2U6IHMsIGluaXRpYWxCZWFyaW5nOiBmd2RBei50b0RlZ3JlZXMoKSwgZmluYWxCZWFyaW5nOiByZXZBei50b0RlZ3JlZXMoKX07XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgdGhlIHBvaW50IG9mIGludGVyc2VjdGlvbiBvZiB0d28gcGF0aHMgZGVmaW5lZCBieSBwb2ludCBhbmQgYmVhcmluZy5cclxuICAgICAqIGJhc2VkIG9uIHRoZSB3b3JrIG9mIENocmlzIFZlbmVzcyAoaHR0cHM6Ly9naXRodWIuY29tL2NocmlzdmVuZXNzL2dlb2Rlc3kpXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtMYXRMb259IHAxIC0gRmlyc3QgcG9pbnQuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYnJuZzEgLSBJbml0aWFsIGJlYXJpbmcgZnJvbSBmaXJzdCBwb2ludC5cclxuICAgICAqIEBwYXJhbSB7TGF0TG9ufSBwMiAtIFNlY29uZCBwb2ludC5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBicm5nMiAtIEluaXRpYWwgYmVhcmluZyBmcm9tIHNlY29uZCBwb2ludC5cclxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IGNvbnRhaW5pbmcgbGF0L2xuZyBpbmZvcm1hdGlvbiBvZiBpbnRlcnNlY3Rpb24uXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIHZhciBwMSA9IExhdExvbig1MS44ODUzLCAwLjI1NDUpLCBicm5nMSA9IDEwOC41NTtcclxuICAgICAqIHZhciBwMiA9IExhdExvbig0OS4wMDM0LCAyLjU3MzUpLCBicm5nMiA9IDMyLjQ0O1xyXG4gICAgICogdmFyIHBJbnQgPSBMYXRMb24uaW50ZXJzZWN0aW9uKHAxLCBicm5nMSwgcDIsIGJybmcyKTsgLy8gcEludC50b1N0cmluZygpOiA1MC45MDc4wrBOLCA0LjUwODTCsEVcclxuICAgICAqL1xyXG4gICAgX2ludGVyc2VjdGlvbjogZnVuY3Rpb24gKHAxLCBicm5nMSwgcDIsIGJybmcyKSB7XHJcbiAgICAgICAgLy8gc2VlIGh0dHA6Ly93aWxsaWFtcy5iZXN0LnZ3aC5uZXQvYXZmb3JtLmh0bSNJbnRlcnNlY3Rpb25cclxuXHJcbiAgICAgICAgdmFyIM+GMSA9IHAxLmxhdC50b1JhZGlhbnMoKSwgzrsxID0gcDEubG5nLnRvUmFkaWFucygpO1xyXG4gICAgICAgIHZhciDPhjIgPSBwMi5sYXQudG9SYWRpYW5zKCksIM67MiA9IHAyLmxuZy50b1JhZGlhbnMoKTtcclxuICAgICAgICB2YXIgzrgxMyA9IE51bWJlcihicm5nMSkudG9SYWRpYW5zKCksIM64MjMgPSBOdW1iZXIoYnJuZzIpLnRvUmFkaWFucygpO1xyXG4gICAgICAgIHZhciDOlM+GID0gz4YyIC0gz4YxLCDOlM67ID0gzrsyIC0gzrsxO1xyXG5cclxuICAgICAgICB2YXIgzrQxMiA9IDIgKiBNYXRoLmFzaW4oTWF0aC5zcXJ0KE1hdGguc2luKM6Uz4YgLyAyKSAqIE1hdGguc2luKM6Uz4YgLyAyKSArXHJcbiAgICAgICAgICAgIE1hdGguY29zKM+GMSkgKiBNYXRoLmNvcyjPhjIpICogTWF0aC5zaW4ozpTOuyAvIDIpICogTWF0aC5zaW4ozpTOuyAvIDIpKSk7XHJcbiAgICAgICAgaWYgKM60MTIgPT0gMCkgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIC8vIGluaXRpYWwvZmluYWwgYmVhcmluZ3MgYmV0d2VlbiBwb2ludHNcclxuICAgICAgICB2YXIgzrgxID0gTWF0aC5hY29zKCggTWF0aC5zaW4oz4YyKSAtIE1hdGguc2luKM+GMSkgKiBNYXRoLmNvcyjOtDEyKSApIC9cclxuICAgICAgICAoIE1hdGguc2luKM60MTIpICogTWF0aC5jb3Moz4YxKSApKTtcclxuICAgICAgICBpZiAoaXNOYU4ozrgxKSkgzrgxID0gMDsgLy8gcHJvdGVjdCBhZ2FpbnN0IHJvdW5kaW5nXHJcbiAgICAgICAgdmFyIM64MiA9IE1hdGguYWNvcygoIE1hdGguc2luKM+GMSkgLSBNYXRoLnNpbijPhjIpICogTWF0aC5jb3MozrQxMikgKSAvXHJcbiAgICAgICAgKCBNYXRoLnNpbijOtDEyKSAqIE1hdGguY29zKM+GMikgKSk7XHJcblxyXG4gICAgICAgIGlmIChNYXRoLnNpbijOuzIgLSDOuzEpID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgzrgxMiA9IM64MTtcclxuICAgICAgICAgICAgdmFyIM64MjEgPSAyICogTWF0aC5QSSAtIM64MjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgzrgxMiA9IDIgKiBNYXRoLlBJIC0gzrgxO1xyXG4gICAgICAgICAgICB2YXIgzrgyMSA9IM64MjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciDOsTEgPSAozrgxMyAtIM64MTIgKyBNYXRoLlBJKSAlICgyICogTWF0aC5QSSkgLSBNYXRoLlBJOyAvLyBhbmdsZSAyLTEtM1xyXG4gICAgICAgIHZhciDOsTIgPSAozrgyMSAtIM64MjMgKyBNYXRoLlBJKSAlICgyICogTWF0aC5QSSkgLSBNYXRoLlBJOyAvLyBhbmdsZSAxLTItM1xyXG5cclxuICAgICAgICBpZiAoTWF0aC5zaW4ozrExKSA9PSAwICYmIE1hdGguc2luKM6xMikgPT0gMCkgcmV0dXJuIG51bGw7IC8vIGluZmluaXRlIGludGVyc2VjdGlvbnNcclxuICAgICAgICBpZiAoTWF0aC5zaW4ozrExKSAqIE1hdGguc2luKM6xMikgPCAwKSByZXR1cm4gbnVsbDsgLy8gYW1iaWd1b3VzIGludGVyc2VjdGlvblxyXG5cclxuICAgICAgICAvL86xMSA9IE1hdGguYWJzKM6xMSk7XHJcbiAgICAgICAgLy/OsTIgPSBNYXRoLmFicyjOsTIpO1xyXG4gICAgICAgIC8vIC4uLiBFZCBXaWxsaWFtcyB0YWtlcyBhYnMgb2YgzrExL86xMiwgYnV0IHNlZW1zIHRvIGJyZWFrIGNhbGN1bGF0aW9uP1xyXG5cclxuICAgICAgICB2YXIgzrEzID0gTWF0aC5hY29zKC1NYXRoLmNvcyjOsTEpICogTWF0aC5jb3MozrEyKSArXHJcbiAgICAgICAgTWF0aC5zaW4ozrExKSAqIE1hdGguc2luKM6xMikgKiBNYXRoLmNvcyjOtDEyKSk7XHJcbiAgICAgICAgdmFyIM60MTMgPSBNYXRoLmF0YW4yKE1hdGguc2luKM60MTIpICogTWF0aC5zaW4ozrExKSAqIE1hdGguc2luKM6xMiksXHJcbiAgICAgICAgICAgIE1hdGguY29zKM6xMikgKyBNYXRoLmNvcyjOsTEpICogTWF0aC5jb3MozrEzKSlcclxuICAgICAgICB2YXIgz4YzID0gTWF0aC5hc2luKE1hdGguc2luKM+GMSkgKiBNYXRoLmNvcyjOtDEzKSArXHJcbiAgICAgICAgTWF0aC5jb3Moz4YxKSAqIE1hdGguc2luKM60MTMpICogTWF0aC5jb3MozrgxMykpO1xyXG4gICAgICAgIHZhciDOlM67MTMgPSBNYXRoLmF0YW4yKE1hdGguc2luKM64MTMpICogTWF0aC5zaW4ozrQxMykgKiBNYXRoLmNvcyjPhjEpLFxyXG4gICAgICAgICAgICBNYXRoLmNvcyjOtDEzKSAtIE1hdGguc2luKM+GMSkgKiBNYXRoLnNpbijPhjMpKTtcclxuICAgICAgICB2YXIgzrszID0gzrsxICsgzpTOuzEzO1xyXG4gICAgICAgIM67MyA9ICjOuzMgKyAzICogTWF0aC5QSSkgJSAoMiAqIE1hdGguUEkpIC0gTWF0aC5QSTsgLy8gbm9ybWFsaXNlIHRvIC0xODAuLisxODDCulxyXG5cclxuICAgICAgICByZXR1cm4gTC5sYXRMbmcoz4YzLnRvRGVncmVlcygpLCDOuzMudG9EZWdyZWVzKCkpO1xyXG4gICAgfSxcclxuXHJcbiAgICBfaW50ZXJzZWN0aW9uU2VnOiBmdW5jdGlvbiAoc2VnMSwgc2VnMikge1xyXG4gICAgICAgIHZhciBzMSA9IHRoaXMuX3ZpbmNlbnR5X2ludmVyc2UuYXBwbHkodGhpcywgc2VnMSksXHJcbiAgICAgICAgICAgIHMyID0gdGhpcy5fdmluY2VudHlfaW52ZXJzZS5hcHBseSh0aGlzLCBzZWcyKSxcclxuICAgICAgICAgICAgbGF0bG5nID0gdGhpcy5faW50ZXJzZWN0aW9uKHNlZzFbMF0sIHMxLmluaXRpYWxCZWFyaW5nLCBzZWcyWzBdLCBzMi5pbml0aWFsQmVhcmluZyk7XHJcblxyXG4gICAgICAgIGlmIChsYXRsbmcpXHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIE1hdGguYWJzKHNlZzFbMF0uZGlzdGFuY2VUbyhzZWcxWzFdKSAtIGxhdGxuZy5kaXN0YW5jZVRvKHNlZzFbMF0pIC0gbGF0bG5nLmRpc3RhbmNlVG8oc2VnMVsxXSkpIDwgTElNSVQgJiZcclxuICAgICAgICAgICAgTWF0aC5hYnMoc2VnMlswXS5kaXN0YW5jZVRvKHNlZzJbMV0pIC0gbGF0bG5nLmRpc3RhbmNlVG8oc2VnMlswXSkgLSBsYXRsbmcuZGlzdGFuY2VUbyhzZWcyWzFdKSkgPCBMSU1JVFxyXG4gICAgICAgICAgICApID8gbGF0bG5nIDogbnVsbDtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG5cclxuXHJcbiAgICB9LFxyXG4gICAgaW50ZXJzZWN0aW9uVG86IGZ1bmN0aW9uICh6b25lKSB7XHJcbiAgICAgICAgdmFyIHBhdGggPSB0aGlzLmdldExhdExuZ3MoKSxcclxuICAgICAgICAgICAgcGF0aDEgPSB6b25lLmdldExhdExuZ3MoKSxcclxuICAgICAgICAgICAgciA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IHBhdGgubGVuZ3RoIC0gMTsgaSA8IGw7IGkrKylcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGwxID0gcGF0aC5sZW5ndGggLSAxOyBqIDwgbDE7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxhdGxuZyA9IHRoaXMuX2ludGVyc2VjdGlvblNlZyhbcGF0aFtpXSwgcGF0aFtpICsgMV1dLCBbcGF0aDFbal0sIHBhdGgxW2ogKyAxXV0pO1xyXG4gICAgICAgICAgICAgICAgbGF0bG5nICYmIHIucHVzaChsYXRsbmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHIubGVuZ3RoID8gciA6IG51bGw7XHJcbiAgICB9XHJcblxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUm91dGU7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgTkJQMTAwMDgzIG9uIDE2LjA4LjIwMTUuXHJcbiAqL1xyXG5cInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciBCYXNlID0gcmVxdWlyZSgnLi9kcmFnLW1hcmtlcicpLFxyXG4gICAgZXZlbnRzID0gYXBwLmV2ZW50cyxcclxuICAgIGljb25zID0gcmVxdWlyZSgnLi4vLi4vLi4vLi4vY29yZS9vcHRpb25zJykuaWNvbnM7XHJcblxyXG5cclxudmFyIFZlcnRleCA9IEJhc2UuZXh0ZW5kKHtcclxuICAgIG9wdGlvbnM6IHtcclxuICAgICAgICB6SW5kZXhPZmZzZXQ6IDEwMTBcclxuICAgIH0sXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAobW9kZWwsIG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgb3B0ID0gXy5leHRlbmQodGhpcy5fZ2V0T3B0aW9ucyhtb2RlbCksIG9wdGlvbnMpO1xyXG4gICAgICAgIFZlcnRleC5fX3N1cGVyX18uaW5pdGlhbGl6ZS5jYWxsKHRoaXMsIG1vZGVsLCBvcHQpO1xyXG4gICAgICAgIHRoaXMubW9kZWwub24oJ2NoYW5nZScsIHRoaXMub25DaGFuZ2UsIHRoaXMpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgc2V0RHJhZ2dpbmc6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHZhbHVlID0gdmFsdWUgfHwgdGhpcy5vcHRpb25zLmRyYWdnYWJsZTtcclxuICAgICAgICB0aGlzLmRyYWdnaW5nW3ZhbHVlID8gJ2VuYWJsZScgOiAnZGlzYWJsZSddKCk7XHJcbiAgICB9LFxyXG4gICAgcmVmcmVzaDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH0sXHJcbiAgICBvbkNsaWNrOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUubW9kZWwgPSB0aGlzLm1vZGVsO1xyXG4gICAgICAgIGV2ZW50cy5jaGFubmVsKCdpbmZvJykudHJpZ2dlcigncm91dGU6dmVydGV4JywgZSk7XHJcbiAgICB9LFxyXG4gICAgb25EcmFnOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHBhdGggPSBfLmNvbXBhY3QoW1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLnByZXYoKSAmJiB0aGlzLm1vZGVsLnByZXYoKS5nZXQoJ2xhdGxuZycpLFxyXG4gICAgICAgICAgICB0aGlzLmdldExhdExuZygpLFxyXG4gICAgICAgICAgICB0aGlzLm1vZGVsLm5leHQoKSAmJiB0aGlzLm1vZGVsLm5leHQoKS5nZXQoJ2xhdGxuZycpXHJcbiAgICAgICAgXSk7XHJcbiAgICAgICAgdGhpcy5kcmFnTGluZS5zZXRMYXRMbmdzKFtwYXRoXSk7XHJcblxyXG4gICAgfSxcclxuICAgIG9uQ2hhbmdlOiBmdW5jdGlvbiAobW9kZWwpIHtcclxuICAgICAgICBpZiAobW9kZWwuaXNDaGFuZ2VSb3V0ZU1hcCgpKSB7XHJcbiAgICAgICAgICAgIEwuVXRpbC5zZXRPcHRpb25zKHRoaXMsIHRoaXMuX2dldE9wdGlvbnMobW9kZWwpKTtcclxuICAgICAgICAgICAgaWYgKG1vZGVsLmNoYW5nZWQudHlwZSB8fCBtb2RlbC5jaGFuZ2VkLmljb24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0SWNvbih0aGlzLm9wdGlvbnMuaWNvbik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldERyYWdnaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG1vZGVsLmNoYW5nZWQubGF0bG5nKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRMYXRMbmcodGhpcy5tb2RlbC5nZXQoJ2xhdGxuZycpKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9nZXRPcHRpb25zOiBmdW5jdGlvbiAobW9kZWwpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBkcmFnZ2FibGU6IG1vZGVsLmlzRGVmYXVsdFR5cGUoKSxcclxuICAgICAgICAgICAgdGl0bGU6IG1vZGVsLmdldCgnbmFtZScpLFxyXG4gICAgICAgICAgICBpY29uOiB0aGlzLl9nZXRJY29uKG1vZGVsKVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfSxcclxuICAgIF9nZXRJY29uOiBmdW5jdGlvbiAobW9kZWwpIHtcclxuICAgICAgICBtb2RlbCA9IG1vZGVsIHx8IHRoaXMubW9kZWw7XHJcbiAgICAgICAgcmV0dXJuIGljb25zW21vZGVsLmdldEljb24oKV07XHJcbiAgICB9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBWZXJ0ZXg7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgYWxleCBvbiAwNi4xMC4yMDE1LlxyXG4gKi9cclxuXHJcbnZhciBMYXllciA9IEwuVGlsZUxheWVyLmV4dGVuZCh7XHJcbiAgICBvcHRpb25zOiB7XHJcbiAgICB9LFxyXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLnVybCA9IG9wdGlvbnMudXJsVGVtcGwucmVwbGFjZSgne3R9JywgJzUnKTtcclxuICAgICAgICBMYXllci5fX3N1cGVyX18uaW5pdGlhbGl6ZS5jYWxsKHRoaXMsIHRoaXMudXJsLCBvcHRpb25zKTtcclxuICAgICAgICBhcHAuZXZlbnRzLmNoYW5uZWwoJ2xheWVycycpLm9uKCdtZXRlb3RpbWUnLCB0aGlzLm9uVGltZSwgdGhpcyk7XHJcbiAgICB9LFxyXG4gICAgZ2V0VHlwZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMudHlwZTtcclxuICAgIH0sXHJcbiAgICBvblRpbWU6IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuc2V0VXJsKHRoaXMub3B0aW9ucy51cmxUZW1wbC5yZXBsYWNlKCd7dH0nLCB2YWx1ZSkpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGF5ZXI7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgYWxleCBvbiAwMi4wOS4yMDE1LlxyXG4gKi9cclxuXHJcbnZhciBMYXllcnMgPSByZXF1aXJlKCcuLi8uLi9saWJzL2xheWVyJyksXHJcbiAgICBTZWVNYXJrZXIgPSByZXF1aXJlKCcuL3NlZS1tYXJrZXInKSxcclxuICAgIE1ldGVvID0gcmVxdWlyZSgnLi9iYXNlLW1ldGVvJyksXHJcbiAgICBldmVudHMgPSBhcHAuZXZlbnRzLmNoYW5uZWwoJ2xheWVycycpO1xyXG5cclxudmFyIE15TGF5ZXJzID0gTGF5ZXJzLmV4dGVuZCh7XHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgTXlMYXllcnMuX19zdXBlcl9fLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICBldmVudHMub24oJ2FjdGl2ZScsIHRoaXMub25BY3RpdmUsIHRoaXMpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbnZhciBtYXAgPSBhcHAubWFwO1xyXG5cclxuXHJcblxyXG52YXIgbGF5ZXJzID0gbmV3IE15TGF5ZXJzKFtcclxuICAgIHJlcXVpcmUoJy4vbWFyaW5lJyksXHJcbiAgICByZXF1aXJlKCcuL2xpZ3RoJyksXHJcbiAgICBuZXcgU2VlTWFya2VyKCksXHJcbiAgICBuZXcgTWV0ZW8oe3R5cGU6J1dJTkQnLCB1cmxUZW1wbDonaHR0cDovL3d3dy5vcGVucG9ydGd1aWRlLm9yZy90aWxlcy9hY3R1YWwvd2luZF92ZWN0b3Ive3R9L3t6fS97eH0ve3l9LnBuZyd9KSxcclxuICAgIG5ldyBNZXRlbyh7dHlwZTonUFJFU1MnLCB1cmxUZW1wbDonaHR0cDovL3d3dy5vcGVucG9ydGd1aWRlLm9yZy90aWxlcy9hY3R1YWwvc3VyZmFjZV9wcmVzc3VyZS97dH0ve3p9L3t4fS97eX0ucG5nJ30pLFxyXG4gICAgbmV3IE1ldGVvKHt0eXBlOidURU1QJywgdXJsVGVtcGw6J2h0dHA6Ly93d3cub3BlbnBvcnRndWlkZS5vcmcvdGlsZXMvYWN0dWFsL2Fpcl90ZW1wZXJhdHVyZS97dH0ve3p9L3t4fS97eX0ucG5nJ30pLFxyXG4gICAgbmV3IE1ldGVvKHt0eXBlOidQUkVDSVBJVEFUSU9OJywgdXJsVGVtcGw6J2h0dHA6Ly93d3cub3BlbnBvcnRndWlkZS5vcmcvdGlsZXMvYWN0dWFsL3ByZWNpcGl0YXRpb24ve3R9L3t6fS97eH0ve3l9LnBuZyd9KSxcclxuICAgIG5ldyBNZXRlbyh7dHlwZTonV0FWRScsIHVybFRlbXBsOidodHRwOi8vd3d3Lm9wZW5wb3J0Z3VpZGUub3JnL3RpbGVzL2FjdHVhbC9zaWduaWZpY2FudF93YXZlX2hlaWdodC97dH0ve3p9L3t4fS97eX0ucG5nJ30pLFxyXG5dKTtcclxuXHJcblxyXG5sYXllcnMuYWRkVG8obWFwKTtcclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgYWxleCBvbiAyOC4wOC4yMDE1LlxyXG4gKi9cclxuXHJcbnZhciBDb2xsZWN0aW9uID0gcmVxdWlyZSgnLi4vLi4vLi4vbGlicy9sYXllci9jb2xsZWN0aW9uJyksXHJcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYnMvbGF5ZXIvbW9kZWwnKSxcclxuICAgIG9zbXRvZ2VvanNvbiA9IHJlcXVpcmUoJ29zbXRvZ2VvanNvbicpO1xyXG5cclxudmFyIExpZ3RoID0gTW9kZWwuZXh0ZW5kKHtcclxuICAgIGNvb3JkTmFtZTogJ2xhdGxuZycsXHJcbiAgICBpc0JvdW5kczogZnVuY3Rpb24gKGJvdW5kcykge1xyXG4gICAgICAgIHJldHVybiBib3VuZHMuY29udGFpbnModGhpcy5nZXQodGhpcy5jb29yZE5hbWUpKTtcclxuICAgIH0sXHJcbiAgICBwYXJzZSA6IGZ1bmN0aW9uKGF0dHIpe1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGlkOiBhdHRyLmlkLFxyXG4gICAgICAgICAgICBsYXRsbmc6IG5ldyBMLmxhdExuZyhhdHRyLnBvc2l0aW9uKSxcclxuICAgICAgICAgICAgdGl0bGUgOiBhdHRyLnRpdGxlLFxyXG4gICAgICAgICAgICBzaXRlIDogYXR0ci53ZWJzaXRlXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuXHJcbnZhciBMaWd0aExpc3QgPSBDb2xsZWN0aW9uLmV4dGVuZCh7XHJcbiAgICBuYW1lT2JqOiAnbGlndGgnLFxyXG4gICAgbW9kZWw6IExpZ3RoLFxyXG4gICAgdXJsOiAnL2FwaS9tYXJpbmEnLFxyXG5cclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICAgICAgTGlndGhMaXN0Ll9fc3VwZXJfXy5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICB9LFxyXG4gICAgbG9hZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBxdWVyeSA9IHtcclxuICAgICAgICAgICAgYm91bmRzOiBhcHAubWFwLmdldEJvdW5kcygpLnRvQkJveFN0cmluZygpXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gdGhpcy5mZXRjaCh7ZGF0YTogcXVlcnksIHJlc2V0OiB0cnVlfSk7XHJcblxyXG4gICAgfVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGlndGhMaXN0OyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGFsZXggb24gMTYuMDkuMjAxNS5cclxuICovXHJcblxyXG5cclxudmFyIENvbGxlY3Rpb24gPSByZXF1aXJlKCcuL2NvbGxlY3Rpb24nKSxcclxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBWaWV3KFxyXG4gICAgbmV3IENvbGxlY3Rpb24oe1xyXG4gICAgICAgIC8vdXJsOiAnL21hcC9wdWJsaWMvZGF0YS97MH0uanNvbicucmVwbGFjZSgnezB9JywgJ0FEJyksXHJcbiAgICAgICAgdHlwZTogJ0xJR1RIJ1xyXG4gICAgfSkpOyIsIi8qKlxuICogQ3JlYXRlZCBieSBOQlAxMDAwODMgb24gMjYuMDguMjAxNS5cbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBWaWV3ID0gcmVxdWlyZSgnLi4vLi4vLi4vbGlicy9sYXllci92aWV3JyksXG4gICAgc2l6ZSA9IDI0O1xuXG5cbnZhciBNYXJrZXIgPSBMLk1hcmtlci5leHRlbmQoe1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChtb2RlbCwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgICAgIE1hcmtlci5fX3N1cGVyX18uaW5pdGlhbGl6ZS5jYWxsKHRoaXMsIG1vZGVsLmdldChtb2RlbC5jb29yZE5hbWUpLCBvcHRpb25zKTtcblxuICAgIH0sXG4gICAgb25BZGQ6IGZ1bmN0aW9uIChtYXApIHtcbiAgICAgICAgTWFya2VyLl9fc3VwZXJfXy5vbkFkZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB0aGlzLm9uKCdjbGljaycsIHRoaXMub25DbGljaywgdGhpcyk7XG4gICAgfSxcbiAgICBvblJlbW92ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm9mZignY2xpY2snLCB0aGlzLm9uQ2xpY2ssIHRoaXMpO1xuICAgICAgICBNYXJrZXIuX19zdXBlcl9fLm9uUmVtb3ZlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfSxcblxuICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHdpbmRvdy5vcGVuKHRoaXMubW9kZWwuZ2V0KCdzaXRlJyksICdfYmxhbmsnKTtcbiAgICB9XG5cbn0pO1xuXG5cbnZhciBTZWUgPSBWaWV3LmV4dGVuZCh7XG4gICAgX2RlYnVnOiBmYWxzZSxcbiAgICBvcHRpb25zOiB7XG4gICAgICAgIGxheWVyOiBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgLy9jbGlja2FibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBtb2RlbC5nZXQoJ3RpdGxlJyksXG4gICAgICAgICAgICAgICAgaWNvbjogTC5kaXZJY29uKHtcbiAgICAgICAgICAgICAgICAgICAgaWNvblNpemU6IEwucG9pbnQoc2l6ZSwgc2l6ZSksXG4gICAgICAgICAgICAgICAgICAgIGljb25BbmNob3I6IEwucG9pbnQoc2l6ZSAvIDIsIHNpemUgLyAyKSxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnaWNvbi1tYXJpbmFfJyArIHNpemUgKyAnIG1hcC1zZWUtaWNvbi1tYXJpbmUnLFxuICAgICAgICAgICAgICAgICAgICAvL2h0bWw6IEwuVXRpbC50ZW1wbGF0ZSgkKCcjdGVtcC1zZWUtaWNvbi1tYXJpbmUnKS5odG1sKCksIF8uZXh0ZW5kKHtzaXplOiBzaXplfSwgbW9kZWwudG9KU09OKCkpKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uQWRkOiBmdW5jdGlvbiAobWFwKSB7XG4gICAgICAgIFZpZXcuX19zdXBlcl9fLm9uQWRkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXAub24oJ21vdmVlbmQnLCB0aGlzLm9uUmVmcmVzaCwgdGhpcyk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uLmxvYWQodGhpcy5fZ2V0UGFyYW1zKCkpXG4gICAgICAgICAgICAuZG9uZSh0aGlzLnJlbmRlci5iaW5kKHRoaXMpKVxuICAgICAgICAgICAgLmZhaWwodGhpcy5vbkVycm9yLmJpbmQodGhpcykpO1xuXG4gICAgfSxcblxuICAgIG9uRXJyb3I6IGZ1bmN0aW9uICh4aHIpIHtcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPiAwKVxuICAgICAgICAgICAgYXBwLm1lc3NhZ2Uuc2VuZCh7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnYWxlcnQtZGFuZ2VyJyxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0Vycm9yJyxcbiAgICAgICAgICAgICAgICBjb250ZW50OiBMLlV0aWwudGVtcGxhdGUoJzxwPtCa0L7QtCDQvtGI0LjQsdC60Lg6PGNvZGU+e3N0YXR1c308L2NvZGU+LiB7c3RhdHVzVGV4dH08L3A+JywgeGhyKSxcbiAgICAgICAgICAgICAgICB0aW1lOiA2MDAwLFxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogMFxuICAgICAgICAgICAgfSk7XG4gICAgfSxcbiAgICBvblJlZnJlc2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uLmxvYWQodGhpcy5fZ2V0UGFyYW1zKCkpXG4gICAgICAgICAgICAuZG9uZSh0aGlzLnJlbmRlci5iaW5kKHRoaXMpKVxuICAgICAgICAgICAgLmZhaWwodGhpcy5vbkVycm9yLmJpbmQodGhpcykpO1xuICAgIH0sXG4gICAgY3JlYXRlOiBmdW5jdGlvbiAobW9kZWwpIHtcbiAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBNYXJrZXIobW9kZWwsIHRoaXMub3B0aW9ucy5sYXllcihtb2RlbCkpO1xuICAgICAgICB0aGlzLmFkZExheWVyKG1hcmtlcik7XG4gICAgfSxcblxuICAgIF9nZXRQYXJhbXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGJvdW5kcyA9IHRoaXMuX21hcC5nZXRCb3VuZHMoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHM6IGJvdW5kcy5nZXRTb3V0aCgpLFxuICAgICAgICAgICAgbjogYm91bmRzLmdldE5vcnRoKCksXG4gICAgICAgICAgICB3OiBib3VuZHMuZ2V0V2VzdCgpLFxuICAgICAgICAgICAgZTogYm91bmRzLmdldEVhc3QoKSxcbiAgICAgICAgICAgIHo6IHRoaXMuX21hcC5nZXRab29tKClcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlZTtcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGFsZXggb24gMjguMDguMjAxNS5cclxuICovXHJcblxyXG52YXIgQ29sbGVjdGlvbiA9IHJlcXVpcmUoJy4uLy4uLy4uL2xpYnMvbGF5ZXIvY29sbGVjdGlvbicpLFxyXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuLi8uLi8uLi9saWJzL2xheWVyL21vZGVsJyk7XHJcblxyXG52YXIgU2VlID0gTW9kZWwuZXh0ZW5kKHtcclxuICAgIGNvb3JkTmFtZTogJ2xhdGxuZycsXHJcbiAgICBpc0JvdW5kczogZnVuY3Rpb24gKGJvdW5kcykge1xyXG4gICAgICAgIHJldHVybiBib3VuZHMuY29udGFpbnModGhpcy5nZXQodGhpcy5jb29yZE5hbWUpKTtcclxuICAgIH1cclxufSk7XHJcblxyXG52YXIgU2VlTGlzdCA9IENvbGxlY3Rpb24uZXh0ZW5kKHtcclxuICAgIHVybDogJ2h0dHA6Ly9kZXYub3BlbnNlYW1hcC5vcmcvd2Vic2l0ZS9tYXAvYXBpL2dldEhhcmJvdXJzLnBocD9iPXtifSZ0PXt0fSZsPXtsfSZyPXtyfSZ1Y2lkPTcmbWF4U2l6ZT02Jnpvb209e3p9JyxcclxuICAgIG5hbWVPYmo6ICdzZWUnLFxyXG4gICAgbW9kZWw6IFNlZSxcclxuXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIFNlZUxpc3QuX19zdXBlcl9fLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICB3aW5kb3cucHV0SGFyYm91ck1hcmtlciA9IHRoaXMuX2xvYWQuYmluZCh0aGlzKTtcclxuICAgIH0sXHJcbiAgICBsb2FkOiBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgICAgdmFyIHVybCA9IEwuVXRpbC50ZW1wbGF0ZSh0aGlzLnVybCwgcGFyYW1zKTtcclxuICAgICAgICB0aGlzLnJlc2V0KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVhZHkgPSAkLmdldFNjcmlwdCh1cmwsIGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIHhocikge1xyXG5cclxuICAgICAgICB9LmJpbmQodGhpcykpO1xyXG4gICAgfSxcclxuICAgIF9sb2FkOiBmdW5jdGlvbiAoaWQsIGxuZywgbGF0LCB0aXRsZSwgc2l0ZSwgbnVtKSB7XHJcbiAgICAgICAgdmFyIG1vZGVsID0gbmV3IHRoaXMubW9kZWwoe1xyXG4gICAgICAgICAgICBpZDogaWQsXHJcbiAgICAgICAgICAgIGxhdGxuZzogTC5sYXRMbmcobGF0LCBsbmcpLFxyXG4gICAgICAgICAgICB0aXRsZTogdGl0bGUsXHJcbiAgICAgICAgICAgIHNpdGU6IHNpdGVcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmFkZChtb2RlbCk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTZWVMaXN0OyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGFsZXggb24gMTYuMDkuMjAxNS5cclxuICovXHJcblxyXG5cclxudmFyIENvbGxlY3Rpb24gPSByZXF1aXJlKCcuL2NvbGxlY3Rpb24nKSxcclxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBWaWV3KFxyXG4gICAgbmV3IENvbGxlY3Rpb24oe1xyXG4gICAgICAgIC8vdXJsOiAnL21hcC9wdWJsaWMvZGF0YS97MH0uanNvbicucmVwbGFjZSgnezB9JywgJ0FEJyksXHJcbiAgICAgICAgdHlwZTogJ01BUklORSdcclxuICAgIH0pKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBOQlAxMDAwODMgb24gMjYuMDguMjAxNS5cclxuICovXHJcblwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIFZpZXcgPSByZXF1aXJlKCcuLi8uLi8uLi9saWJzL2xheWVyL3ZpZXcnKSxcclxuICAgIHNpemUgPSAyNDtcclxuXHJcblxyXG52YXIgTWFya2VyID0gTC5NYXJrZXIuZXh0ZW5kKHtcclxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uIChtb2RlbCwgb3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcclxuICAgICAgICBNYXJrZXIuX19zdXBlcl9fLmluaXRpYWxpemUuY2FsbCh0aGlzLCBtb2RlbC5nZXQobW9kZWwuY29vcmROYW1lKSwgb3B0aW9ucyk7XHJcblxyXG4gICAgfSxcclxuICAgIG9uQWRkOiBmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgTWFya2VyLl9fc3VwZXJfXy5vbkFkZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIHRoaXMub24oJ2NsaWNrJywgdGhpcy5vbkNsaWNrLCB0aGlzKTtcclxuICAgIH0sXHJcbiAgICBvblJlbW92ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMub2ZmKCdjbGljaycsIHRoaXMub25DbGljaywgdGhpcyk7XHJcbiAgICAgICAgTWFya2VyLl9fc3VwZXJfXy5vblJlbW92ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgfSxcclxuXHJcbiAgICBvbkNsaWNrOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHdpbmRvdy5vcGVuKHRoaXMubW9kZWwuZ2V0KCdzaXRlJyksICdfYmxhbmsnKTtcclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxuXHJcbnZhciBTZWUgPSBWaWV3LmV4dGVuZCh7XHJcbiAgICBfZGVidWc6IGZhbHNlLFxyXG4gICAgb3B0aW9uczoge1xyXG4gICAgICAgIGxheWVyOiBmdW5jdGlvbiAobW9kZWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIC8vY2xpY2thYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBtb2RlbC5nZXQoJ3RpdGxlJyksXHJcbiAgICAgICAgICAgICAgICBpY29uOiBMLmRpdkljb24oe1xyXG4gICAgICAgICAgICAgICAgICAgIGljb25TaXplOiBMLnBvaW50KHNpemUsIHNpemUpLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb25BbmNob3I6IEwucG9pbnQoc2l6ZSAvIDIsIHNpemUgLyAyKSxcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdpY29uLW1hcmluYV8nICsgc2l6ZSArICcgbWFwLXNlZS1pY29uLW1hcmluZScsXHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbDogTC5VdGlsLnRlbXBsYXRlKCQoJyN0ZW1wLXNlZS1pY29uLW1hcmluZScpLmh0bWwoKSwgXy5leHRlbmQoe3NpemU6IHNpemV9LCBtb2RlbC50b0pTT04oKSkpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIG9uQWRkOiBmdW5jdGlvbiAobWFwKSB7XHJcbiAgICAgICAgVmlldy5fX3N1cGVyX18ub25BZGQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21hcC5vbignbW92ZWVuZCcsIHRoaXMub25SZWZyZXNoLCB0aGlzKTtcclxuICAgICAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbGxlY3Rpb24ubG9hZCh0aGlzLl9nZXRQYXJhbXMoKSkuZG9uZSh0aGlzLnJlbmRlci5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIG9uUmVmcmVzaDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY29sbGVjdGlvbi5sb2FkKHRoaXMuX2dldFBhcmFtcygpKS5kb25lKHRoaXMucmVuZGVyLmJpbmQodGhpcykpO1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZTogZnVuY3Rpb24gKG1vZGVsKSB7XHJcbiAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBNYXJrZXIobW9kZWwsIHRoaXMub3B0aW9ucy5sYXllcihtb2RlbCkpO1xyXG4gICAgICAgIHRoaXMuYWRkTGF5ZXIobWFya2VyKTtcclxuICAgIH0sXHJcblxyXG4gICAgX2dldFBhcmFtczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBib3VuZHMgPSB0aGlzLl9tYXAuZ2V0Qm91bmRzKCk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgYjogYm91bmRzLmdldFNvdXRoKCksXHJcbiAgICAgICAgICAgIHQ6IGJvdW5kcy5nZXROb3J0aCgpLFxyXG4gICAgICAgICAgICBsOiBib3VuZHMuZ2V0V2VzdCgpLFxyXG4gICAgICAgICAgICByOiBib3VuZHMuZ2V0RWFzdCgpLFxyXG4gICAgICAgICAgICB6OiB0aGlzLl9tYXAuZ2V0Wm9vbSgpXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBTZWU7XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGFsZXggb24gMDMuMDkuMjAxNS5cclxuICovXHJcblxyXG52YXIgTGF5ZXIgPSBMLlRpbGVMYXllci5leHRlbmQoe1xyXG4gICAgb3B0aW9uczoge1xyXG4gICAgICAgIC8vbWluWm9vbTogOVxyXG4gICAgfSwgLy9odHRwOi8vdGlsZXMub3BlbnNlYW1hcC5vcmcvc2VhbWFyay97en0ve3h9L3t5fS5wbmdcclxuICAgIHVybDogJ2h0dHA6Ly90aWxlcy5vcGVuc2VhbWFwLm9yZy9zZWFtYXJrL3t6fS97eH0ve3l9LnBuZycsXHJcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAodXJsLCBvcHRpb25zKSB7XHJcbiAgICAgICAgTGF5ZXIuX19zdXBlcl9fLmluaXRpYWxpemUuY2FsbCh0aGlzLCB0aGlzLnVybCwgb3B0aW9ucyk7XHJcbiAgICB9LFxyXG4gICAgZ2V0VHlwZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBcIlNFRU1BUktFUlwiO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGF5ZXI7IiwiLy8hIG1vbWVudC5qc1xuLy8hIHZlcnNpb24gOiAyLjEwLjZcbi8vISBhdXRob3JzIDogVGltIFdvb2QsIElza3JlbiBDaGVybmV2LCBNb21lbnQuanMgY29udHJpYnV0b3JzXG4vLyEgbGljZW5zZSA6IE1JVFxuLy8hIG1vbWVudGpzLmNvbVxuXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAgIGdsb2JhbC5tb21lbnQgPSBmYWN0b3J5KClcbn0odGhpcywgZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgaG9va0NhbGxiYWNrO1xuXG4gICAgZnVuY3Rpb24gdXRpbHNfaG9va3NfX2hvb2tzICgpIHtcbiAgICAgICAgcmV0dXJuIGhvb2tDYWxsYmFjay5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIC8vIFRoaXMgaXMgZG9uZSB0byByZWdpc3RlciB0aGUgbWV0aG9kIGNhbGxlZCB3aXRoIG1vbWVudCgpXG4gICAgLy8gd2l0aG91dCBjcmVhdGluZyBjaXJjdWxhciBkZXBlbmRlbmNpZXMuXG4gICAgZnVuY3Rpb24gc2V0SG9va0NhbGxiYWNrIChjYWxsYmFjaykge1xuICAgICAgICBob29rQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0FycmF5KGlucHV0KSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRGF0ZShpbnB1dCkge1xuICAgICAgICByZXR1cm4gaW5wdXQgaW5zdGFuY2VvZiBEYXRlIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IERhdGVdJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXAoYXJyLCBmbikge1xuICAgICAgICB2YXIgcmVzID0gW10sIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKGZuKGFycltpXSwgaSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFzT3duUHJvcChhLCBiKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYSwgYik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXh0ZW5kKGEsIGIpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBiKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcChiLCBpKSkge1xuICAgICAgICAgICAgICAgIGFbaV0gPSBiW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc093blByb3AoYiwgJ3RvU3RyaW5nJykpIHtcbiAgICAgICAgICAgIGEudG9TdHJpbmcgPSBiLnRvU3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc093blByb3AoYiwgJ3ZhbHVlT2YnKSkge1xuICAgICAgICAgICAgYS52YWx1ZU9mID0gYi52YWx1ZU9mO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlX3V0Y19fY3JlYXRlVVRDIChpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCkge1xuICAgICAgICByZXR1cm4gY3JlYXRlTG9jYWxPclVUQyhpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCwgdHJ1ZSkudXRjKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVmYXVsdFBhcnNpbmdGbGFncygpIHtcbiAgICAgICAgLy8gV2UgbmVlZCB0byBkZWVwIGNsb25lIHRoaXMgb2JqZWN0LlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZW1wdHkgICAgICAgICAgIDogZmFsc2UsXG4gICAgICAgICAgICB1bnVzZWRUb2tlbnMgICAgOiBbXSxcbiAgICAgICAgICAgIHVudXNlZElucHV0ICAgICA6IFtdLFxuICAgICAgICAgICAgb3ZlcmZsb3cgICAgICAgIDogLTIsXG4gICAgICAgICAgICBjaGFyc0xlZnRPdmVyICAgOiAwLFxuICAgICAgICAgICAgbnVsbElucHV0ICAgICAgIDogZmFsc2UsXG4gICAgICAgICAgICBpbnZhbGlkTW9udGggICAgOiBudWxsLFxuICAgICAgICAgICAgaW52YWxpZEZvcm1hdCAgIDogZmFsc2UsXG4gICAgICAgICAgICB1c2VySW52YWxpZGF0ZWQgOiBmYWxzZSxcbiAgICAgICAgICAgIGlzbyAgICAgICAgICAgICA6IGZhbHNlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UGFyc2luZ0ZsYWdzKG0pIHtcbiAgICAgICAgaWYgKG0uX3BmID09IG51bGwpIHtcbiAgICAgICAgICAgIG0uX3BmID0gZGVmYXVsdFBhcnNpbmdGbGFncygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtLl9wZjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZF9faXNWYWxpZChtKSB7XG4gICAgICAgIGlmIChtLl9pc1ZhbGlkID09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBmbGFncyA9IGdldFBhcnNpbmdGbGFncyhtKTtcbiAgICAgICAgICAgIG0uX2lzVmFsaWQgPSAhaXNOYU4obS5fZC5nZXRUaW1lKCkpICYmXG4gICAgICAgICAgICAgICAgZmxhZ3Mub3ZlcmZsb3cgPCAwICYmXG4gICAgICAgICAgICAgICAgIWZsYWdzLmVtcHR5ICYmXG4gICAgICAgICAgICAgICAgIWZsYWdzLmludmFsaWRNb250aCAmJlxuICAgICAgICAgICAgICAgICFmbGFncy5pbnZhbGlkV2Vla2RheSAmJlxuICAgICAgICAgICAgICAgICFmbGFncy5udWxsSW5wdXQgJiZcbiAgICAgICAgICAgICAgICAhZmxhZ3MuaW52YWxpZEZvcm1hdCAmJlxuICAgICAgICAgICAgICAgICFmbGFncy51c2VySW52YWxpZGF0ZWQ7XG5cbiAgICAgICAgICAgIGlmIChtLl9zdHJpY3QpIHtcbiAgICAgICAgICAgICAgICBtLl9pc1ZhbGlkID0gbS5faXNWYWxpZCAmJlxuICAgICAgICAgICAgICAgICAgICBmbGFncy5jaGFyc0xlZnRPdmVyID09PSAwICYmXG4gICAgICAgICAgICAgICAgICAgIGZsYWdzLnVudXNlZFRva2Vucy5sZW5ndGggPT09IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgZmxhZ3MuYmlnSG91ciA9PT0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtLl9pc1ZhbGlkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkX19jcmVhdGVJbnZhbGlkIChmbGFncykge1xuICAgICAgICB2YXIgbSA9IGNyZWF0ZV91dGNfX2NyZWF0ZVVUQyhOYU4pO1xuICAgICAgICBpZiAoZmxhZ3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgZXh0ZW5kKGdldFBhcnNpbmdGbGFncyhtKSwgZmxhZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKG0pLnVzZXJJbnZhbGlkYXRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9XG5cbiAgICB2YXIgbW9tZW50UHJvcGVydGllcyA9IHV0aWxzX2hvb2tzX19ob29rcy5tb21lbnRQcm9wZXJ0aWVzID0gW107XG5cbiAgICBmdW5jdGlvbiBjb3B5Q29uZmlnKHRvLCBmcm9tKSB7XG4gICAgICAgIHZhciBpLCBwcm9wLCB2YWw7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9pc0FNb21lbnRPYmplY3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5faXNBTW9tZW50T2JqZWN0ID0gZnJvbS5faXNBTW9tZW50T2JqZWN0O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5faSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9pID0gZnJvbS5faTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX2YgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5fZiA9IGZyb20uX2Y7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9sICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2wgPSBmcm9tLl9sO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fc3RyaWN0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX3N0cmljdCA9IGZyb20uX3N0cmljdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX3R6bSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl90em0gPSBmcm9tLl90em07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9pc1VUQyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9pc1VUQyA9IGZyb20uX2lzVVRDO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fb2Zmc2V0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX29mZnNldCA9IGZyb20uX29mZnNldDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX3BmICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX3BmID0gZ2V0UGFyc2luZ0ZsYWdzKGZyb20pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fbG9jYWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2xvY2FsZSA9IGZyb20uX2xvY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtb21lbnRQcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAoaSBpbiBtb21lbnRQcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgcHJvcCA9IG1vbWVudFByb3BlcnRpZXNbaV07XG4gICAgICAgICAgICAgICAgdmFsID0gZnJvbVtwcm9wXTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9bcHJvcF0gPSB2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRvO1xuICAgIH1cblxuICAgIHZhciB1cGRhdGVJblByb2dyZXNzID0gZmFsc2U7XG5cbiAgICAvLyBNb21lbnQgcHJvdG90eXBlIG9iamVjdFxuICAgIGZ1bmN0aW9uIE1vbWVudChjb25maWcpIHtcbiAgICAgICAgY29weUNvbmZpZyh0aGlzLCBjb25maWcpO1xuICAgICAgICB0aGlzLl9kID0gbmV3IERhdGUoY29uZmlnLl9kICE9IG51bGwgPyBjb25maWcuX2QuZ2V0VGltZSgpIDogTmFOKTtcbiAgICAgICAgLy8gUHJldmVudCBpbmZpbml0ZSBsb29wIGluIGNhc2UgdXBkYXRlT2Zmc2V0IGNyZWF0ZXMgbmV3IG1vbWVudFxuICAgICAgICAvLyBvYmplY3RzLlxuICAgICAgICBpZiAodXBkYXRlSW5Qcm9ncmVzcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHVwZGF0ZUluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLnVwZGF0ZU9mZnNldCh0aGlzKTtcbiAgICAgICAgICAgIHVwZGF0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTW9tZW50IChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIE1vbWVudCB8fCAob2JqICE9IG51bGwgJiYgb2JqLl9pc0FNb21lbnRPYmplY3QgIT0gbnVsbCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWJzRmxvb3IgKG51bWJlcikge1xuICAgICAgICBpZiAobnVtYmVyIDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbChudW1iZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IobnVtYmVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvSW50KGFyZ3VtZW50Rm9yQ29lcmNpb24pIHtcbiAgICAgICAgdmFyIGNvZXJjZWROdW1iZXIgPSArYXJndW1lbnRGb3JDb2VyY2lvbixcbiAgICAgICAgICAgIHZhbHVlID0gMDtcblxuICAgICAgICBpZiAoY29lcmNlZE51bWJlciAhPT0gMCAmJiBpc0Zpbml0ZShjb2VyY2VkTnVtYmVyKSkge1xuICAgICAgICAgICAgdmFsdWUgPSBhYnNGbG9vcihjb2VyY2VkTnVtYmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wYXJlQXJyYXlzKGFycmF5MSwgYXJyYXkyLCBkb250Q29udmVydCkge1xuICAgICAgICB2YXIgbGVuID0gTWF0aC5taW4oYXJyYXkxLmxlbmd0aCwgYXJyYXkyLmxlbmd0aCksXG4gICAgICAgICAgICBsZW5ndGhEaWZmID0gTWF0aC5hYnMoYXJyYXkxLmxlbmd0aCAtIGFycmF5Mi5sZW5ndGgpLFxuICAgICAgICAgICAgZGlmZnMgPSAwLFxuICAgICAgICAgICAgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoKGRvbnRDb252ZXJ0ICYmIGFycmF5MVtpXSAhPT0gYXJyYXkyW2ldKSB8fFxuICAgICAgICAgICAgICAgICghZG9udENvbnZlcnQgJiYgdG9JbnQoYXJyYXkxW2ldKSAhPT0gdG9JbnQoYXJyYXkyW2ldKSkpIHtcbiAgICAgICAgICAgICAgICBkaWZmcysrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaWZmcyArIGxlbmd0aERpZmY7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gTG9jYWxlKCkge1xuICAgIH1cblxuICAgIHZhciBsb2NhbGVzID0ge307XG4gICAgdmFyIGdsb2JhbExvY2FsZTtcblxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZUxvY2FsZShrZXkpIHtcbiAgICAgICAgcmV0dXJuIGtleSA/IGtleS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJ18nLCAnLScpIDoga2V5O1xuICAgIH1cblxuICAgIC8vIHBpY2sgdGhlIGxvY2FsZSBmcm9tIHRoZSBhcnJheVxuICAgIC8vIHRyeSBbJ2VuLWF1JywgJ2VuLWdiJ10gYXMgJ2VuLWF1JywgJ2VuLWdiJywgJ2VuJywgYXMgaW4gbW92ZSB0aHJvdWdoIHRoZSBsaXN0IHRyeWluZyBlYWNoXG4gICAgLy8gc3Vic3RyaW5nIGZyb20gbW9zdCBzcGVjaWZpYyB0byBsZWFzdCwgYnV0IG1vdmUgdG8gdGhlIG5leHQgYXJyYXkgaXRlbSBpZiBpdCdzIGEgbW9yZSBzcGVjaWZpYyB2YXJpYW50IHRoYW4gdGhlIGN1cnJlbnQgcm9vdFxuICAgIGZ1bmN0aW9uIGNob29zZUxvY2FsZShuYW1lcykge1xuICAgICAgICB2YXIgaSA9IDAsIGosIG5leHQsIGxvY2FsZSwgc3BsaXQ7XG5cbiAgICAgICAgd2hpbGUgKGkgPCBuYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHNwbGl0ID0gbm9ybWFsaXplTG9jYWxlKG5hbWVzW2ldKS5zcGxpdCgnLScpO1xuICAgICAgICAgICAgaiA9IHNwbGl0Lmxlbmd0aDtcbiAgICAgICAgICAgIG5leHQgPSBub3JtYWxpemVMb2NhbGUobmFtZXNbaSArIDFdKTtcbiAgICAgICAgICAgIG5leHQgPSBuZXh0ID8gbmV4dC5zcGxpdCgnLScpIDogbnVsbDtcbiAgICAgICAgICAgIHdoaWxlIChqID4gMCkge1xuICAgICAgICAgICAgICAgIGxvY2FsZSA9IGxvYWRMb2NhbGUoc3BsaXQuc2xpY2UoMCwgaikuam9pbignLScpKTtcbiAgICAgICAgICAgICAgICBpZiAobG9jYWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsb2NhbGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChuZXh0ICYmIG5leHQubGVuZ3RoID49IGogJiYgY29tcGFyZUFycmF5cyhzcGxpdCwgbmV4dCwgdHJ1ZSkgPj0gaiAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy90aGUgbmV4dCBhcnJheSBpdGVtIGlzIGJldHRlciB0aGFuIGEgc2hhbGxvd2VyIHN1YnN0cmluZyBvZiB0aGlzIG9uZVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgai0tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWRMb2NhbGUobmFtZSkge1xuICAgICAgICB2YXIgb2xkTG9jYWxlID0gbnVsbDtcbiAgICAgICAgLy8gVE9ETzogRmluZCBhIGJldHRlciB3YXkgdG8gcmVnaXN0ZXIgYW5kIGxvYWQgYWxsIHRoZSBsb2NhbGVzIGluIE5vZGVcbiAgICAgICAgaWYgKCFsb2NhbGVzW25hbWVdICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAgICAgbW9kdWxlICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG9sZExvY2FsZSA9IGdsb2JhbExvY2FsZS5fYWJicjtcbiAgICAgICAgICAgICAgICByZXF1aXJlKCcuL2xvY2FsZS8nICsgbmFtZSk7XG4gICAgICAgICAgICAgICAgLy8gYmVjYXVzZSBkZWZpbmVMb2NhbGUgY3VycmVudGx5IGFsc28gc2V0cyB0aGUgZ2xvYmFsIGxvY2FsZSwgd2VcbiAgICAgICAgICAgICAgICAvLyB3YW50IHRvIHVuZG8gdGhhdCBmb3IgbGF6eSBsb2FkZWQgbG9jYWxlc1xuICAgICAgICAgICAgICAgIGxvY2FsZV9sb2NhbGVzX19nZXRTZXRHbG9iYWxMb2NhbGUob2xkTG9jYWxlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsb2NhbGVzW25hbWVdO1xuICAgIH1cblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCBsb2FkIGxvY2FsZSBhbmQgdGhlbiBzZXQgdGhlIGdsb2JhbCBsb2NhbGUuICBJZlxuICAgIC8vIG5vIGFyZ3VtZW50cyBhcmUgcGFzc2VkIGluLCBpdCB3aWxsIHNpbXBseSByZXR1cm4gdGhlIGN1cnJlbnQgZ2xvYmFsXG4gICAgLy8gbG9jYWxlIGtleS5cbiAgICBmdW5jdGlvbiBsb2NhbGVfbG9jYWxlc19fZ2V0U2V0R2xvYmFsTG9jYWxlIChrZXksIHZhbHVlcykge1xuICAgICAgICB2YXIgZGF0YTtcbiAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZXMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGxvY2FsZV9sb2NhbGVzX19nZXRMb2NhbGUoa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkZWZpbmVMb2NhbGUoa2V5LCB2YWx1ZXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIC8vIG1vbWVudC5kdXJhdGlvbi5fbG9jYWxlID0gbW9tZW50Ll9sb2NhbGUgPSBkYXRhO1xuICAgICAgICAgICAgICAgIGdsb2JhbExvY2FsZSA9IGRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZ2xvYmFsTG9jYWxlLl9hYmJyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlZmluZUxvY2FsZSAobmFtZSwgdmFsdWVzKSB7XG4gICAgICAgIGlmICh2YWx1ZXMgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhbHVlcy5hYmJyID0gbmFtZTtcbiAgICAgICAgICAgIGxvY2FsZXNbbmFtZV0gPSBsb2NhbGVzW25hbWVdIHx8IG5ldyBMb2NhbGUoKTtcbiAgICAgICAgICAgIGxvY2FsZXNbbmFtZV0uc2V0KHZhbHVlcyk7XG5cbiAgICAgICAgICAgIC8vIGJhY2t3YXJkcyBjb21wYXQgZm9yIG5vdzogYWxzbyBzZXQgdGhlIGxvY2FsZVxuICAgICAgICAgICAgbG9jYWxlX2xvY2FsZXNfX2dldFNldEdsb2JhbExvY2FsZShuYW1lKTtcblxuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZXNbbmFtZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB1c2VmdWwgZm9yIHRlc3RpbmdcbiAgICAgICAgICAgIGRlbGV0ZSBsb2NhbGVzW25hbWVdO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZXR1cm5zIGxvY2FsZSBkYXRhXG4gICAgZnVuY3Rpb24gbG9jYWxlX2xvY2FsZXNfX2dldExvY2FsZSAoa2V5KSB7XG4gICAgICAgIHZhciBsb2NhbGU7XG5cbiAgICAgICAgaWYgKGtleSAmJiBrZXkuX2xvY2FsZSAmJiBrZXkuX2xvY2FsZS5fYWJicikge1xuICAgICAgICAgICAga2V5ID0ga2V5Ll9sb2NhbGUuX2FiYnI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWtleSkge1xuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbExvY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNBcnJheShrZXkpKSB7XG4gICAgICAgICAgICAvL3Nob3J0LWNpcmN1aXQgZXZlcnl0aGluZyBlbHNlXG4gICAgICAgICAgICBsb2NhbGUgPSBsb2FkTG9jYWxlKGtleSk7XG4gICAgICAgICAgICBpZiAobG9jYWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxvY2FsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtleSA9IFtrZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNob29zZUxvY2FsZShrZXkpO1xuICAgIH1cblxuICAgIHZhciBhbGlhc2VzID0ge307XG5cbiAgICBmdW5jdGlvbiBhZGRVbml0QWxpYXMgKHVuaXQsIHNob3J0aGFuZCkge1xuICAgICAgICB2YXIgbG93ZXJDYXNlID0gdW5pdC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBhbGlhc2VzW2xvd2VyQ2FzZV0gPSBhbGlhc2VzW2xvd2VyQ2FzZSArICdzJ10gPSBhbGlhc2VzW3Nob3J0aGFuZF0gPSB1bml0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZVVuaXRzKHVuaXRzKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdW5pdHMgPT09ICdzdHJpbmcnID8gYWxpYXNlc1t1bml0c10gfHwgYWxpYXNlc1t1bml0cy50b0xvd2VyQ2FzZSgpXSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3JtYWxpemVPYmplY3RVbml0cyhpbnB1dE9iamVjdCkge1xuICAgICAgICB2YXIgbm9ybWFsaXplZElucHV0ID0ge30sXG4gICAgICAgICAgICBub3JtYWxpemVkUHJvcCxcbiAgICAgICAgICAgIHByb3A7XG5cbiAgICAgICAgZm9yIChwcm9wIGluIGlucHV0T2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcChpbnB1dE9iamVjdCwgcHJvcCkpIHtcbiAgICAgICAgICAgICAgICBub3JtYWxpemVkUHJvcCA9IG5vcm1hbGl6ZVVuaXRzKHByb3ApO1xuICAgICAgICAgICAgICAgIGlmIChub3JtYWxpemVkUHJvcCkge1xuICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVkSW5wdXRbbm9ybWFsaXplZFByb3BdID0gaW5wdXRPYmplY3RbcHJvcF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZWRJbnB1dDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlR2V0U2V0ICh1bml0LCBrZWVwVGltZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGdldF9zZXRfX3NldCh0aGlzLCB1bml0LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgdXRpbHNfaG9va3NfX2hvb2tzLnVwZGF0ZU9mZnNldCh0aGlzLCBrZWVwVGltZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBnZXRfc2V0X19nZXQodGhpcywgdW5pdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0X3NldF9fZ2V0IChtb20sIHVuaXQpIHtcbiAgICAgICAgcmV0dXJuIG1vbS5fZFsnZ2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyB1bml0XSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldF9zZXRfX3NldCAobW9tLCB1bml0LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gbW9tLl9kWydzZXQnICsgKG1vbS5faXNVVEMgPyAnVVRDJyA6ICcnKSArIHVuaXRdKHZhbHVlKTtcbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXQgKHVuaXRzLCB2YWx1ZSkge1xuICAgICAgICB2YXIgdW5pdDtcbiAgICAgICAgaWYgKHR5cGVvZiB1bml0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGZvciAodW5pdCBpbiB1bml0cykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0KHVuaXQsIHVuaXRzW3VuaXRdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzW3VuaXRzXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzW3VuaXRzXSh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gemVyb0ZpbGwobnVtYmVyLCB0YXJnZXRMZW5ndGgsIGZvcmNlU2lnbikge1xuICAgICAgICB2YXIgYWJzTnVtYmVyID0gJycgKyBNYXRoLmFicyhudW1iZXIpLFxuICAgICAgICAgICAgemVyb3NUb0ZpbGwgPSB0YXJnZXRMZW5ndGggLSBhYnNOdW1iZXIubGVuZ3RoLFxuICAgICAgICAgICAgc2lnbiA9IG51bWJlciA+PSAwO1xuICAgICAgICByZXR1cm4gKHNpZ24gPyAoZm9yY2VTaWduID8gJysnIDogJycpIDogJy0nKSArXG4gICAgICAgICAgICBNYXRoLnBvdygxMCwgTWF0aC5tYXgoMCwgemVyb3NUb0ZpbGwpKS50b1N0cmluZygpLnN1YnN0cigxKSArIGFic051bWJlcjtcbiAgICB9XG5cbiAgICB2YXIgZm9ybWF0dGluZ1Rva2VucyA9IC8oXFxbW15cXFtdKlxcXSl8KFxcXFwpPyhNb3xNTT9NP00/fERvfERERG98REQ/RD9EP3xkZGQ/ZD98ZG8/fHdbb3x3XT98V1tvfFddP3xRfFlZWVlZWXxZWVlZWXxZWVlZfFlZfGdnKGdnZz8pP3xHRyhHR0c/KT98ZXxFfGF8QXxoaD98SEg/fG1tP3xzcz98U3sxLDl9fHh8WHx6ej98Wlo/fC4pL2c7XG5cbiAgICB2YXIgbG9jYWxGb3JtYXR0aW5nVG9rZW5zID0gLyhcXFtbXlxcW10qXFxdKXwoXFxcXCk/KExUU3xMVHxMTD9MP0w/fGx7MSw0fSkvZztcblxuICAgIHZhciBmb3JtYXRGdW5jdGlvbnMgPSB7fTtcblxuICAgIHZhciBmb3JtYXRUb2tlbkZ1bmN0aW9ucyA9IHt9O1xuXG4gICAgLy8gdG9rZW46ICAgICdNJ1xuICAgIC8vIHBhZGRlZDogICBbJ01NJywgMl1cbiAgICAvLyBvcmRpbmFsOiAgJ01vJ1xuICAgIC8vIGNhbGxiYWNrOiBmdW5jdGlvbiAoKSB7IHRoaXMubW9udGgoKSArIDEgfVxuICAgIGZ1bmN0aW9uIGFkZEZvcm1hdFRva2VuICh0b2tlbiwgcGFkZGVkLCBvcmRpbmFsLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgZnVuYyA9IGNhbGxiYWNrO1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1tjYWxsYmFja10oKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9uc1t0b2tlbl0gPSBmdW5jO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYWRkZWQpIHtcbiAgICAgICAgICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zW3BhZGRlZFswXV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHplcm9GaWxsKGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKSwgcGFkZGVkWzFdLCBwYWRkZWRbMl0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3JkaW5hbCkge1xuICAgICAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnNbb3JkaW5hbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm9yZGluYWwoZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCB0b2tlbik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlRm9ybWF0dGluZ1Rva2VucyhpbnB1dCkge1xuICAgICAgICBpZiAoaW5wdXQubWF0Y2goL1xcW1tcXHNcXFNdLykpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC9eXFxbfFxcXSQvZywgJycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC9cXFxcL2csICcnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlRm9ybWF0RnVuY3Rpb24oZm9ybWF0KSB7XG4gICAgICAgIHZhciBhcnJheSA9IGZvcm1hdC5tYXRjaChmb3JtYXR0aW5nVG9rZW5zKSwgaSwgbGVuZ3RoO1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0VG9rZW5GdW5jdGlvbnNbYXJyYXlbaV1dKSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSBmb3JtYXRUb2tlbkZ1bmN0aW9uc1thcnJheVtpXV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFycmF5W2ldID0gcmVtb3ZlRm9ybWF0dGluZ1Rva2VucyhhcnJheVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1vbSkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9ICcnO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IGFycmF5W2ldIGluc3RhbmNlb2YgRnVuY3Rpb24gPyBhcnJheVtpXS5jYWxsKG1vbSwgZm9ybWF0KSA6IGFycmF5W2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBmb3JtYXQgZGF0ZSB1c2luZyBuYXRpdmUgZGF0ZSBvYmplY3RcbiAgICBmdW5jdGlvbiBmb3JtYXRNb21lbnQobSwgZm9ybWF0KSB7XG4gICAgICAgIGlmICghbS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBtLmxvY2FsZURhdGEoKS5pbnZhbGlkRGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybWF0ID0gZXhwYW5kRm9ybWF0KGZvcm1hdCwgbS5sb2NhbGVEYXRhKCkpO1xuICAgICAgICBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XSA9IGZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdIHx8IG1ha2VGb3JtYXRGdW5jdGlvbihmb3JtYXQpO1xuXG4gICAgICAgIHJldHVybiBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XShtKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHBhbmRGb3JtYXQoZm9ybWF0LCBsb2NhbGUpIHtcbiAgICAgICAgdmFyIGkgPSA1O1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlcGxhY2VMb25nRGF0ZUZvcm1hdFRva2VucyhpbnB1dCkge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZS5sb25nRGF0ZUZvcm1hdChpbnB1dCkgfHwgaW5wdXQ7XG4gICAgICAgIH1cblxuICAgICAgICBsb2NhbEZvcm1hdHRpbmdUb2tlbnMubGFzdEluZGV4ID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPj0gMCAmJiBsb2NhbEZvcm1hdHRpbmdUb2tlbnMudGVzdChmb3JtYXQpKSB7XG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZShsb2NhbEZvcm1hdHRpbmdUb2tlbnMsIHJlcGxhY2VMb25nRGF0ZUZvcm1hdFRva2Vucyk7XG4gICAgICAgICAgICBsb2NhbEZvcm1hdHRpbmdUb2tlbnMubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgIGkgLT0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmb3JtYXQ7XG4gICAgfVxuXG4gICAgdmFyIG1hdGNoMSAgICAgICAgID0gL1xcZC87ICAgICAgICAgICAgLy8gICAgICAgMCAtIDlcbiAgICB2YXIgbWF0Y2gyICAgICAgICAgPSAvXFxkXFxkLzsgICAgICAgICAgLy8gICAgICAwMCAtIDk5XG4gICAgdmFyIG1hdGNoMyAgICAgICAgID0gL1xcZHszfS87ICAgICAgICAgLy8gICAgIDAwMCAtIDk5OVxuICAgIHZhciBtYXRjaDQgICAgICAgICA9IC9cXGR7NH0vOyAgICAgICAgIC8vICAgIDAwMDAgLSA5OTk5XG4gICAgdmFyIG1hdGNoNiAgICAgICAgID0gL1srLV0/XFxkezZ9LzsgICAgLy8gLTk5OTk5OSAtIDk5OTk5OVxuICAgIHZhciBtYXRjaDF0bzIgICAgICA9IC9cXGRcXGQ/LzsgICAgICAgICAvLyAgICAgICAwIC0gOTlcbiAgICB2YXIgbWF0Y2gxdG8zICAgICAgPSAvXFxkezEsM30vOyAgICAgICAvLyAgICAgICAwIC0gOTk5XG4gICAgdmFyIG1hdGNoMXRvNCAgICAgID0gL1xcZHsxLDR9LzsgICAgICAgLy8gICAgICAgMCAtIDk5OTlcbiAgICB2YXIgbWF0Y2gxdG82ICAgICAgPSAvWystXT9cXGR7MSw2fS87ICAvLyAtOTk5OTk5IC0gOTk5OTk5XG5cbiAgICB2YXIgbWF0Y2hVbnNpZ25lZCAgPSAvXFxkKy87ICAgICAgICAgICAvLyAgICAgICAwIC0gaW5mXG4gICAgdmFyIG1hdGNoU2lnbmVkICAgID0gL1srLV0/XFxkKy87ICAgICAgLy8gICAgLWluZiAtIGluZlxuXG4gICAgdmFyIG1hdGNoT2Zmc2V0ICAgID0gL1p8WystXVxcZFxcZDo/XFxkXFxkL2dpOyAvLyArMDA6MDAgLTAwOjAwICswMDAwIC0wMDAwIG9yIFpcblxuICAgIHZhciBtYXRjaFRpbWVzdGFtcCA9IC9bKy1dP1xcZCsoXFwuXFxkezEsM30pPy87IC8vIDEyMzQ1Njc4OSAxMjM0NTY3ODkuMTIzXG5cbiAgICAvLyBhbnkgd29yZCAob3IgdHdvKSBjaGFyYWN0ZXJzIG9yIG51bWJlcnMgaW5jbHVkaW5nIHR3by90aHJlZSB3b3JkIG1vbnRoIGluIGFyYWJpYy5cbiAgICB2YXIgbWF0Y2hXb3JkID0gL1swLTldKlsnYS16XFx1MDBBMC1cXHUwNUZGXFx1MDcwMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSt8W1xcdTA2MDAtXFx1MDZGRlxcL10rKFxccyo/W1xcdTA2MDAtXFx1MDZGRl0rKXsxLDJ9L2k7XG5cbiAgICB2YXIgcmVnZXhlcyA9IHt9O1xuXG4gICAgZnVuY3Rpb24gaXNGdW5jdGlvbiAoc3RoKSB7XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8yMzI1XG4gICAgICAgIHJldHVybiB0eXBlb2Ygc3RoID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAgICAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3RoKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGFkZFJlZ2V4VG9rZW4gKHRva2VuLCByZWdleCwgc3RyaWN0UmVnZXgpIHtcbiAgICAgICAgcmVnZXhlc1t0b2tlbl0gPSBpc0Z1bmN0aW9uKHJlZ2V4KSA/IHJlZ2V4IDogZnVuY3Rpb24gKGlzU3RyaWN0KSB7XG4gICAgICAgICAgICByZXR1cm4gKGlzU3RyaWN0ICYmIHN0cmljdFJlZ2V4KSA/IHN0cmljdFJlZ2V4IDogcmVnZXg7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UGFyc2VSZWdleEZvclRva2VuICh0b2tlbiwgY29uZmlnKSB7XG4gICAgICAgIGlmICghaGFzT3duUHJvcChyZWdleGVzLCB0b2tlbikpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmVnRXhwKHVuZXNjYXBlRm9ybWF0KHRva2VuKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVnZXhlc1t0b2tlbl0oY29uZmlnLl9zdHJpY3QsIGNvbmZpZy5fbG9jYWxlKTtcbiAgICB9XG5cbiAgICAvLyBDb2RlIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zNTYxNDkzL2lzLXRoZXJlLWEtcmVnZXhwLWVzY2FwZS1mdW5jdGlvbi1pbi1qYXZhc2NyaXB0XG4gICAgZnVuY3Rpb24gdW5lc2NhcGVGb3JtYXQocykge1xuICAgICAgICByZXR1cm4gcy5yZXBsYWNlKCdcXFxcJywgJycpLnJlcGxhY2UoL1xcXFwoXFxbKXxcXFxcKFxcXSl8XFxbKFteXFxdXFxbXSopXFxdfFxcXFwoLikvZywgZnVuY3Rpb24gKG1hdGNoZWQsIHAxLCBwMiwgcDMsIHA0KSB7XG4gICAgICAgICAgICByZXR1cm4gcDEgfHwgcDIgfHwgcDMgfHwgcDQ7XG4gICAgICAgIH0pLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpO1xuICAgIH1cblxuICAgIHZhciB0b2tlbnMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGFkZFBhcnNlVG9rZW4gKHRva2VuLCBjYWxsYmFjaykge1xuICAgICAgICB2YXIgaSwgZnVuYyA9IGNhbGxiYWNrO1xuICAgICAgICBpZiAodHlwZW9mIHRva2VuID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdG9rZW4gPSBbdG9rZW5dO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBmdW5jID0gZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICAgICAgICAgIGFycmF5W2NhbGxiYWNrXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRva2VuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0b2tlbnNbdG9rZW5baV1dID0gZnVuYztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFdlZWtQYXJzZVRva2VuICh0b2tlbiwgY2FsbGJhY2spIHtcbiAgICAgICAgYWRkUGFyc2VUb2tlbih0b2tlbiwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnLCB0b2tlbikge1xuICAgICAgICAgICAgY29uZmlnLl93ID0gY29uZmlnLl93IHx8IHt9O1xuICAgICAgICAgICAgY2FsbGJhY2soaW5wdXQsIGNvbmZpZy5fdywgY29uZmlnLCB0b2tlbik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFRpbWVUb0FycmF5RnJvbVRva2VuKHRva2VuLCBpbnB1dCwgY29uZmlnKSB7XG4gICAgICAgIGlmIChpbnB1dCAhPSBudWxsICYmIGhhc093blByb3AodG9rZW5zLCB0b2tlbikpIHtcbiAgICAgICAgICAgIHRva2Vuc1t0b2tlbl0oaW5wdXQsIGNvbmZpZy5fYSwgY29uZmlnLCB0b2tlbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgWUVBUiA9IDA7XG4gICAgdmFyIE1PTlRIID0gMTtcbiAgICB2YXIgREFURSA9IDI7XG4gICAgdmFyIEhPVVIgPSAzO1xuICAgIHZhciBNSU5VVEUgPSA0O1xuICAgIHZhciBTRUNPTkQgPSA1O1xuICAgIHZhciBNSUxMSVNFQ09ORCA9IDY7XG5cbiAgICBmdW5jdGlvbiBkYXlzSW5Nb250aCh5ZWFyLCBtb250aCkge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoeWVhciwgbW9udGggKyAxLCAwKSkuZ2V0VVRDRGF0ZSgpO1xuICAgIH1cblxuICAgIC8vIEZPUk1BVFRJTkdcblxuICAgIGFkZEZvcm1hdFRva2VuKCdNJywgWydNTScsIDJdLCAnTW8nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vbnRoKCkgKyAxO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ01NTScsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm1vbnRoc1Nob3J0KHRoaXMsIGZvcm1hdCk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignTU1NTScsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm1vbnRocyh0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdtb250aCcsICdNJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdNJywgICAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdNTScsICAgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ01NTScsICBtYXRjaFdvcmQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ01NTU0nLCBtYXRjaFdvcmQpO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ00nLCAnTU0nXSwgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtNT05USF0gPSB0b0ludChpbnB1dCkgLSAxO1xuICAgIH0pO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ01NTScsICdNTU1NJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZywgdG9rZW4pIHtcbiAgICAgICAgdmFyIG1vbnRoID0gY29uZmlnLl9sb2NhbGUubW9udGhzUGFyc2UoaW5wdXQsIHRva2VuLCBjb25maWcuX3N0cmljdCk7XG4gICAgICAgIC8vIGlmIHdlIGRpZG4ndCBmaW5kIGEgbW9udGggbmFtZSwgbWFyayB0aGUgZGF0ZSBhcyBpbnZhbGlkLlxuICAgICAgICBpZiAobW9udGggIT0gbnVsbCkge1xuICAgICAgICAgICAgYXJyYXlbTU9OVEhdID0gbW9udGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pbnZhbGlkTW9udGggPSBpbnB1dDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gTE9DQUxFU1xuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVNb250aHMgPSAnSmFudWFyeV9GZWJydWFyeV9NYXJjaF9BcHJpbF9NYXlfSnVuZV9KdWx5X0F1Z3VzdF9TZXB0ZW1iZXJfT2N0b2Jlcl9Ob3ZlbWJlcl9EZWNlbWJlcicuc3BsaXQoJ18nKTtcbiAgICBmdW5jdGlvbiBsb2NhbGVNb250aHMgKG0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21vbnRoc1ttLm1vbnRoKCldO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9jYWxlTW9udGhzU2hvcnQgPSAnSmFuX0ZlYl9NYXJfQXByX01heV9KdW5fSnVsX0F1Z19TZXBfT2N0X05vdl9EZWMnLnNwbGl0KCdfJyk7XG4gICAgZnVuY3Rpb24gbG9jYWxlTW9udGhzU2hvcnQgKG0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21vbnRoc1Nob3J0W20ubW9udGgoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9jYWxlTW9udGhzUGFyc2UgKG1vbnRoTmFtZSwgZm9ybWF0LCBzdHJpY3QpIHtcbiAgICAgICAgdmFyIGksIG1vbSwgcmVnZXg7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9tb250aHNQYXJzZSkge1xuICAgICAgICAgICAgdGhpcy5fbW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX2xvbmdNb250aHNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy5fc2hvcnRNb250aHNQYXJzZSA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDEyOyBpKyspIHtcbiAgICAgICAgICAgIC8vIG1ha2UgdGhlIHJlZ2V4IGlmIHdlIGRvbid0IGhhdmUgaXQgYWxyZWFkeVxuICAgICAgICAgICAgbW9tID0gY3JlYXRlX3V0Y19fY3JlYXRlVVRDKFsyMDAwLCBpXSk7XG4gICAgICAgICAgICBpZiAoc3RyaWN0ICYmICF0aGlzLl9sb25nTW9udGhzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb25nTW9udGhzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKCdeJyArIHRoaXMubW9udGhzKG1vbSwgJycpLnJlcGxhY2UoJy4nLCAnJykgKyAnJCcsICdpJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2hvcnRNb250aHNQYXJzZVtpXSA9IG5ldyBSZWdFeHAoJ14nICsgdGhpcy5tb250aHNTaG9ydChtb20sICcnKS5yZXBsYWNlKCcuJywgJycpICsgJyQnLCAnaScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFzdHJpY3QgJiYgIXRoaXMuX21vbnRoc1BhcnNlW2ldKSB7XG4gICAgICAgICAgICAgICAgcmVnZXggPSAnXicgKyB0aGlzLm1vbnRocyhtb20sICcnKSArICd8XicgKyB0aGlzLm1vbnRoc1Nob3J0KG1vbSwgJycpO1xuICAgICAgICAgICAgICAgIHRoaXMuX21vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cChyZWdleC5yZXBsYWNlKCcuJywgJycpLCAnaScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGVzdCB0aGUgcmVnZXhcbiAgICAgICAgICAgIGlmIChzdHJpY3QgJiYgZm9ybWF0ID09PSAnTU1NTScgJiYgdGhpcy5fbG9uZ01vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdHJpY3QgJiYgZm9ybWF0ID09PSAnTU1NJyAmJiB0aGlzLl9zaG9ydE1vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghc3RyaWN0ICYmIHRoaXMuX21vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gc2V0TW9udGggKG1vbSwgdmFsdWUpIHtcbiAgICAgICAgdmFyIGRheU9mTW9udGg7XG5cbiAgICAgICAgLy8gVE9ETzogTW92ZSB0aGlzIG91dCBvZiBoZXJlIVxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdmFsdWUgPSBtb20ubG9jYWxlRGF0YSgpLm1vbnRoc1BhcnNlKHZhbHVlKTtcbiAgICAgICAgICAgIC8vIFRPRE86IEFub3RoZXIgc2lsZW50IGZhaWx1cmU/XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBtb207XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBkYXlPZk1vbnRoID0gTWF0aC5taW4obW9tLmRhdGUoKSwgZGF5c0luTW9udGgobW9tLnllYXIoKSwgdmFsdWUpKTtcbiAgICAgICAgbW9tLl9kWydzZXQnICsgKG1vbS5faXNVVEMgPyAnVVRDJyA6ICcnKSArICdNb250aCddKHZhbHVlLCBkYXlPZk1vbnRoKTtcbiAgICAgICAgcmV0dXJuIG1vbTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRNb250aCAodmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHNldE1vbnRoKHRoaXMsIHZhbHVlKTtcbiAgICAgICAgICAgIHV0aWxzX2hvb2tzX19ob29rcy51cGRhdGVPZmZzZXQodGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRfc2V0X19nZXQodGhpcywgJ01vbnRoJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXREYXlzSW5Nb250aCAoKSB7XG4gICAgICAgIHJldHVybiBkYXlzSW5Nb250aCh0aGlzLnllYXIoKSwgdGhpcy5tb250aCgpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGVja092ZXJmbG93IChtKSB7XG4gICAgICAgIHZhciBvdmVyZmxvdztcbiAgICAgICAgdmFyIGEgPSBtLl9hO1xuXG4gICAgICAgIGlmIChhICYmIGdldFBhcnNpbmdGbGFncyhtKS5vdmVyZmxvdyA9PT0gLTIpIHtcbiAgICAgICAgICAgIG92ZXJmbG93ID1cbiAgICAgICAgICAgICAgICBhW01PTlRIXSAgICAgICA8IDAgfHwgYVtNT05USF0gICAgICAgPiAxMSAgPyBNT05USCA6XG4gICAgICAgICAgICAgICAgYVtEQVRFXSAgICAgICAgPCAxIHx8IGFbREFURV0gICAgICAgID4gZGF5c0luTW9udGgoYVtZRUFSXSwgYVtNT05USF0pID8gREFURSA6XG4gICAgICAgICAgICAgICAgYVtIT1VSXSAgICAgICAgPCAwIHx8IGFbSE9VUl0gICAgICAgID4gMjQgfHwgKGFbSE9VUl0gPT09IDI0ICYmIChhW01JTlVURV0gIT09IDAgfHwgYVtTRUNPTkRdICE9PSAwIHx8IGFbTUlMTElTRUNPTkRdICE9PSAwKSkgPyBIT1VSIDpcbiAgICAgICAgICAgICAgICBhW01JTlVURV0gICAgICA8IDAgfHwgYVtNSU5VVEVdICAgICAgPiA1OSAgPyBNSU5VVEUgOlxuICAgICAgICAgICAgICAgIGFbU0VDT05EXSAgICAgIDwgMCB8fCBhW1NFQ09ORF0gICAgICA+IDU5ICA/IFNFQ09ORCA6XG4gICAgICAgICAgICAgICAgYVtNSUxMSVNFQ09ORF0gPCAwIHx8IGFbTUlMTElTRUNPTkRdID4gOTk5ID8gTUlMTElTRUNPTkQgOlxuICAgICAgICAgICAgICAgIC0xO1xuXG4gICAgICAgICAgICBpZiAoZ2V0UGFyc2luZ0ZsYWdzKG0pLl9vdmVyZmxvd0RheU9mWWVhciAmJiAob3ZlcmZsb3cgPCBZRUFSIHx8IG92ZXJmbG93ID4gREFURSkpIHtcbiAgICAgICAgICAgICAgICBvdmVyZmxvdyA9IERBVEU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhtKS5vdmVyZmxvdyA9IG92ZXJmbG93O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd2Fybihtc2cpIHtcbiAgICAgICAgaWYgKHV0aWxzX2hvb2tzX19ob29rcy5zdXBwcmVzc0RlcHJlY2F0aW9uV2FybmluZ3MgPT09IGZhbHNlICYmIHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignRGVwcmVjYXRpb24gd2FybmluZzogJyArIG1zZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXByZWNhdGUobXNnLCBmbikge1xuICAgICAgICB2YXIgZmlyc3RUaW1lID0gdHJ1ZTtcblxuICAgICAgICByZXR1cm4gZXh0ZW5kKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgICAgICAgICB3YXJuKG1zZyArICdcXG4nICsgKG5ldyBFcnJvcigpKS5zdGFjayk7XG4gICAgICAgICAgICAgICAgZmlyc3RUaW1lID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSwgZm4pO1xuICAgIH1cblxuICAgIHZhciBkZXByZWNhdGlvbnMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIGRlcHJlY2F0ZVNpbXBsZShuYW1lLCBtc2cpIHtcbiAgICAgICAgaWYgKCFkZXByZWNhdGlvbnNbbmFtZV0pIHtcbiAgICAgICAgICAgIHdhcm4obXNnKTtcbiAgICAgICAgICAgIGRlcHJlY2F0aW9uc1tuYW1lXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1dGlsc19ob29rc19faG9va3Muc3VwcHJlc3NEZXByZWNhdGlvbldhcm5pbmdzID0gZmFsc2U7XG5cbiAgICB2YXIgZnJvbV9zdHJpbmdfX2lzb1JlZ2V4ID0gL15cXHMqKD86WystXVxcZHs2fXxcXGR7NH0pLSg/OihcXGRcXGQtXFxkXFxkKXwoV1xcZFxcZCQpfChXXFxkXFxkLVxcZCl8KFxcZFxcZFxcZCkpKChUfCApKFxcZFxcZCg6XFxkXFxkKDpcXGRcXGQoXFwuXFxkKyk/KT8pPyk/KFtcXCtcXC1dXFxkXFxkKD86Oj9cXGRcXGQpP3xcXHMqWik/KT8kLztcblxuICAgIHZhciBpc29EYXRlcyA9IFtcbiAgICAgICAgWydZWVlZWVktTU0tREQnLCAvWystXVxcZHs2fS1cXGR7Mn0tXFxkezJ9L10sXG4gICAgICAgIFsnWVlZWS1NTS1ERCcsIC9cXGR7NH0tXFxkezJ9LVxcZHsyfS9dLFxuICAgICAgICBbJ0dHR0ctW1ddV1ctRScsIC9cXGR7NH0tV1xcZHsyfS1cXGQvXSxcbiAgICAgICAgWydHR0dHLVtXXVdXJywgL1xcZHs0fS1XXFxkezJ9L10sXG4gICAgICAgIFsnWVlZWS1EREQnLCAvXFxkezR9LVxcZHszfS9dXG4gICAgXTtcblxuICAgIC8vIGlzbyB0aW1lIGZvcm1hdHMgYW5kIHJlZ2V4ZXNcbiAgICB2YXIgaXNvVGltZXMgPSBbXG4gICAgICAgIFsnSEg6bW06c3MuU1NTUycsIC8oVHwgKVxcZFxcZDpcXGRcXGQ6XFxkXFxkXFwuXFxkKy9dLFxuICAgICAgICBbJ0hIOm1tOnNzJywgLyhUfCApXFxkXFxkOlxcZFxcZDpcXGRcXGQvXSxcbiAgICAgICAgWydISDptbScsIC8oVHwgKVxcZFxcZDpcXGRcXGQvXSxcbiAgICAgICAgWydISCcsIC8oVHwgKVxcZFxcZC9dXG4gICAgXTtcblxuICAgIHZhciBhc3BOZXRKc29uUmVnZXggPSAvXlxcLz9EYXRlXFwoKFxcLT9cXGQrKS9pO1xuXG4gICAgLy8gZGF0ZSBmcm9tIGlzbyBmb3JtYXRcbiAgICBmdW5jdGlvbiBjb25maWdGcm9tSVNPKGNvbmZpZykge1xuICAgICAgICB2YXIgaSwgbCxcbiAgICAgICAgICAgIHN0cmluZyA9IGNvbmZpZy5faSxcbiAgICAgICAgICAgIG1hdGNoID0gZnJvbV9zdHJpbmdfX2lzb1JlZ2V4LmV4ZWMoc3RyaW5nKTtcblxuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmlzbyA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsID0gaXNvRGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzb0RhdGVzW2ldWzFdLmV4ZWMoc3RyaW5nKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25maWcuX2YgPSBpc29EYXRlc1tpXVswXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChpID0gMCwgbCA9IGlzb1RpbWVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpc29UaW1lc1tpXVsxXS5leGVjKHN0cmluZykpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbWF0Y2hbNl0gc2hvdWxkIGJlICdUJyBvciBzcGFjZVxuICAgICAgICAgICAgICAgICAgICBjb25maWcuX2YgKz0gKG1hdGNoWzZdIHx8ICcgJykgKyBpc29UaW1lc1tpXVswXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN0cmluZy5tYXRjaChtYXRjaE9mZnNldCkpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX2YgKz0gJ1onO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZ0FuZEZvcm1hdChjb25maWcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uZmlnLl9pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkYXRlIGZyb20gaXNvIGZvcm1hdCBvciBmYWxsYmFja1xuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21TdHJpbmcoY29uZmlnKSB7XG4gICAgICAgIHZhciBtYXRjaGVkID0gYXNwTmV0SnNvblJlZ2V4LmV4ZWMoY29uZmlnLl9pKTtcblxuICAgICAgICBpZiAobWF0Y2hlZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoK21hdGNoZWRbMV0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnRnJvbUlTTyhjb25maWcpO1xuICAgICAgICBpZiAoY29uZmlnLl9pc1ZhbGlkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgZGVsZXRlIGNvbmZpZy5faXNWYWxpZDtcbiAgICAgICAgICAgIHV0aWxzX2hvb2tzX19ob29rcy5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayhjb25maWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50IGNvbnN0cnVjdGlvbiBmYWxscyBiYWNrIHRvIGpzIERhdGUuIFRoaXMgaXMgJyArXG4gICAgICAgICdkaXNjb3VyYWdlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHVwY29taW5nIG1ham9yICcgK1xuICAgICAgICAncmVsZWFzZS4gUGxlYXNlIHJlZmVyIHRvICcgK1xuICAgICAgICAnaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE0MDcgZm9yIG1vcmUgaW5mby4nLFxuICAgICAgICBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShjb25maWcuX2kgKyAoY29uZmlnLl91c2VVVEMgPyAnIFVUQycgOiAnJykpO1xuICAgICAgICB9XG4gICAgKTtcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZURhdGUgKHksIG0sIGQsIGgsIE0sIHMsIG1zKSB7XG4gICAgICAgIC8vY2FuJ3QganVzdCBhcHBseSgpIHRvIGNyZWF0ZSBhIGRhdGU6XG4gICAgICAgIC8vaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xODEzNDgvaW5zdGFudGlhdGluZy1hLWphdmFzY3JpcHQtb2JqZWN0LWJ5LWNhbGxpbmctcHJvdG90eXBlLWNvbnN0cnVjdG9yLWFwcGx5XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoeSwgbSwgZCwgaCwgTSwgcywgbXMpO1xuXG4gICAgICAgIC8vdGhlIGRhdGUgY29uc3RydWN0b3IgZG9lc24ndCBhY2NlcHQgeWVhcnMgPCAxOTcwXG4gICAgICAgIGlmICh5IDwgMTk3MCkge1xuICAgICAgICAgICAgZGF0ZS5zZXRGdWxsWWVhcih5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVVVENEYXRlICh5KSB7XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoRGF0ZS5VVEMuYXBwbHkobnVsbCwgYXJndW1lbnRzKSk7XG4gICAgICAgIGlmICh5IDwgMTk3MCkge1xuICAgICAgICAgICAgZGF0ZS5zZXRVVENGdWxsWWVhcih5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1lZJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueWVhcigpICUgMTAwO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydZWVlZJywgICA0XSwgICAgICAgMCwgJ3llYXInKTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1lZWVlZJywgIDVdLCAgICAgICAwLCAneWVhcicpO1xuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnWVlZWVlZJywgNiwgdHJ1ZV0sIDAsICd5ZWFyJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3llYXInLCAneScpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignWScsICAgICAgbWF0Y2hTaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1lZJywgICAgIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdZWVlZJywgICBtYXRjaDF0bzQsIG1hdGNoNCk7XG4gICAgYWRkUmVnZXhUb2tlbignWVlZWVknLCAgbWF0Y2gxdG82LCBtYXRjaDYpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1lZWVlZWScsIG1hdGNoMXRvNiwgbWF0Y2g2KTtcblxuICAgIGFkZFBhcnNlVG9rZW4oWydZWVlZWScsICdZWVlZWVknXSwgWUVBUik7XG4gICAgYWRkUGFyc2VUb2tlbignWVlZWScsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXkpIHtcbiAgICAgICAgYXJyYXlbWUVBUl0gPSBpbnB1dC5sZW5ndGggPT09IDIgPyB1dGlsc19ob29rc19faG9va3MucGFyc2VUd29EaWdpdFllYXIoaW5wdXQpIDogdG9JbnQoaW5wdXQpO1xuICAgIH0pO1xuICAgIGFkZFBhcnNlVG9rZW4oJ1lZJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtZRUFSXSA9IHV0aWxzX2hvb2tzX19ob29rcy5wYXJzZVR3b0RpZ2l0WWVhcihpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICBmdW5jdGlvbiBkYXlzSW5ZZWFyKHllYXIpIHtcbiAgICAgICAgcmV0dXJuIGlzTGVhcFllYXIoeWVhcikgPyAzNjYgOiAzNjU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNMZWFwWWVhcih5ZWFyKSB7XG4gICAgICAgIHJldHVybiAoeWVhciAlIDQgPT09IDAgJiYgeWVhciAlIDEwMCAhPT0gMCkgfHwgeWVhciAlIDQwMCA9PT0gMDtcbiAgICB9XG5cbiAgICAvLyBIT09LU1xuXG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLnBhcnNlVHdvRGlnaXRZZWFyID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgIHJldHVybiB0b0ludChpbnB1dCkgKyAodG9JbnQoaW5wdXQpID4gNjggPyAxOTAwIDogMjAwMCk7XG4gICAgfTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXRZZWFyID0gbWFrZUdldFNldCgnRnVsbFllYXInLCBmYWxzZSk7XG5cbiAgICBmdW5jdGlvbiBnZXRJc0xlYXBZZWFyICgpIHtcbiAgICAgICAgcmV0dXJuIGlzTGVhcFllYXIodGhpcy55ZWFyKCkpO1xuICAgIH1cblxuICAgIGFkZEZvcm1hdFRva2VuKCd3JywgWyd3dycsIDJdLCAnd28nLCAnd2VlaycpO1xuICAgIGFkZEZvcm1hdFRva2VuKCdXJywgWydXVycsIDJdLCAnV28nLCAnaXNvV2VlaycpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCd3ZWVrJywgJ3cnKTtcbiAgICBhZGRVbml0QWxpYXMoJ2lzb1dlZWsnLCAnVycpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbigndycsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ3d3JywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1cnLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdXVycsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsndycsICd3dycsICdXJywgJ1dXJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB3ZWVrW3Rva2VuLnN1YnN0cigwLCAxKV0gPSB0b0ludChpbnB1dCk7XG4gICAgfSk7XG5cbiAgICAvLyBIRUxQRVJTXG5cbiAgICAvLyBmaXJzdERheU9mV2VlayAgICAgICAwID0gc3VuLCA2ID0gc2F0XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgdGhlIGRheSBvZiB0aGUgd2VlayB0aGF0IHN0YXJ0cyB0aGUgd2Vla1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICh1c3VhbGx5IHN1bmRheSBvciBtb25kYXkpXG4gICAgLy8gZmlyc3REYXlPZldlZWtPZlllYXIgMCA9IHN1biwgNiA9IHNhdFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIHRoZSBmaXJzdCB3ZWVrIGlzIHRoZSB3ZWVrIHRoYXQgY29udGFpbnMgdGhlIGZpcnN0XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgb2YgdGhpcyBkYXkgb2YgdGhlIHdlZWtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAoZWcuIElTTyB3ZWVrcyB1c2UgdGh1cnNkYXkgKDQpKVxuICAgIGZ1bmN0aW9uIHdlZWtPZlllYXIobW9tLCBmaXJzdERheU9mV2VlaywgZmlyc3REYXlPZldlZWtPZlllYXIpIHtcbiAgICAgICAgdmFyIGVuZCA9IGZpcnN0RGF5T2ZXZWVrT2ZZZWFyIC0gZmlyc3REYXlPZldlZWssXG4gICAgICAgICAgICBkYXlzVG9EYXlPZldlZWsgPSBmaXJzdERheU9mV2Vla09mWWVhciAtIG1vbS5kYXkoKSxcbiAgICAgICAgICAgIGFkanVzdGVkTW9tZW50O1xuXG5cbiAgICAgICAgaWYgKGRheXNUb0RheU9mV2VlayA+IGVuZCkge1xuICAgICAgICAgICAgZGF5c1RvRGF5T2ZXZWVrIC09IDc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGF5c1RvRGF5T2ZXZWVrIDwgZW5kIC0gNykge1xuICAgICAgICAgICAgZGF5c1RvRGF5T2ZXZWVrICs9IDc7XG4gICAgICAgIH1cblxuICAgICAgICBhZGp1c3RlZE1vbWVudCA9IGxvY2FsX19jcmVhdGVMb2NhbChtb20pLmFkZChkYXlzVG9EYXlPZldlZWssICdkJyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3ZWVrOiBNYXRoLmNlaWwoYWRqdXN0ZWRNb21lbnQuZGF5T2ZZZWFyKCkgLyA3KSxcbiAgICAgICAgICAgIHllYXI6IGFkanVzdGVkTW9tZW50LnllYXIoKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIExPQ0FMRVNcblxuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWsgKG1vbSkge1xuICAgICAgICByZXR1cm4gd2Vla09mWWVhcihtb20sIHRoaXMuX3dlZWsuZG93LCB0aGlzLl93ZWVrLmRveSkud2VlaztcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZVdlZWsgPSB7XG4gICAgICAgIGRvdyA6IDAsIC8vIFN1bmRheSBpcyB0aGUgZmlyc3QgZGF5IG9mIHRoZSB3ZWVrLlxuICAgICAgICBkb3kgOiA2ICAvLyBUaGUgd2VlayB0aGF0IGNvbnRhaW5zIEphbiAxc3QgaXMgdGhlIGZpcnN0IHdlZWsgb2YgdGhlIHllYXIuXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxvY2FsZUZpcnN0RGF5T2ZXZWVrICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWsuZG93O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZUZpcnN0RGF5T2ZZZWFyICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWsuZG95O1xuICAgIH1cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIGdldFNldFdlZWsgKGlucHV0KSB7XG4gICAgICAgIHZhciB3ZWVrID0gdGhpcy5sb2NhbGVEYXRhKCkud2Vlayh0aGlzKTtcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrIDogdGhpcy5hZGQoKGlucHV0IC0gd2VlaykgKiA3LCAnZCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldElTT1dlZWsgKGlucHV0KSB7XG4gICAgICAgIHZhciB3ZWVrID0gd2Vla09mWWVhcih0aGlzLCAxLCA0KS53ZWVrO1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWsgOiB0aGlzLmFkZCgoaW5wdXQgLSB3ZWVrKSAqIDcsICdkJyk7XG4gICAgfVxuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ0RERCcsIFsnRERERCcsIDNdLCAnREREbycsICdkYXlPZlllYXInKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnZGF5T2ZZZWFyJywgJ0RERCcpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignREREJywgIG1hdGNoMXRvMyk7XG4gICAgYWRkUmVnZXhUb2tlbignRERERCcsIG1hdGNoMyk7XG4gICAgYWRkUGFyc2VUb2tlbihbJ0RERCcsICdEREREJ10sIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX2RheU9mWWVhciA9IHRvSW50KGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIC8vaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9JU09fd2Vla19kYXRlI0NhbGN1bGF0aW5nX2FfZGF0ZV9naXZlbl90aGVfeWVhci4yQ193ZWVrX251bWJlcl9hbmRfd2Vla2RheVxuICAgIGZ1bmN0aW9uIGRheU9mWWVhckZyb21XZWVrcyh5ZWFyLCB3ZWVrLCB3ZWVrZGF5LCBmaXJzdERheU9mV2Vla09mWWVhciwgZmlyc3REYXlPZldlZWspIHtcbiAgICAgICAgdmFyIHdlZWsxSmFuID0gNiArIGZpcnN0RGF5T2ZXZWVrIC0gZmlyc3REYXlPZldlZWtPZlllYXIsIGphblggPSBjcmVhdGVVVENEYXRlKHllYXIsIDAsIDEgKyB3ZWVrMUphbiksIGQgPSBqYW5YLmdldFVUQ0RheSgpLCBkYXlPZlllYXI7XG4gICAgICAgIGlmIChkIDwgZmlyc3REYXlPZldlZWspIHtcbiAgICAgICAgICAgIGQgKz0gNztcbiAgICAgICAgfVxuXG4gICAgICAgIHdlZWtkYXkgPSB3ZWVrZGF5ICE9IG51bGwgPyAxICogd2Vla2RheSA6IGZpcnN0RGF5T2ZXZWVrO1xuXG4gICAgICAgIGRheU9mWWVhciA9IDEgKyB3ZWVrMUphbiArIDcgKiAod2VlayAtIDEpIC0gZCArIHdlZWtkYXk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHllYXI6IGRheU9mWWVhciA+IDAgPyB5ZWFyIDogeWVhciAtIDEsXG4gICAgICAgICAgICBkYXlPZlllYXI6IGRheU9mWWVhciA+IDAgPyAgZGF5T2ZZZWFyIDogZGF5c0luWWVhcih5ZWFyIC0gMSkgKyBkYXlPZlllYXJcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICBmdW5jdGlvbiBnZXRTZXREYXlPZlllYXIgKGlucHV0KSB7XG4gICAgICAgIHZhciBkYXlPZlllYXIgPSBNYXRoLnJvdW5kKCh0aGlzLmNsb25lKCkuc3RhcnRPZignZGF5JykgLSB0aGlzLmNsb25lKCkuc3RhcnRPZigneWVhcicpKSAvIDg2NGU1KSArIDE7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gZGF5T2ZZZWFyIDogdGhpcy5hZGQoKGlucHV0IC0gZGF5T2ZZZWFyKSwgJ2QnKTtcbiAgICB9XG5cbiAgICAvLyBQaWNrIHRoZSBmaXJzdCBkZWZpbmVkIG9mIHR3byBvciB0aHJlZSBhcmd1bWVudHMuXG4gICAgZnVuY3Rpb24gZGVmYXVsdHMoYSwgYiwgYykge1xuICAgICAgICBpZiAoYSAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYiAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gYjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjdXJyZW50RGF0ZUFycmF5KGNvbmZpZykge1xuICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgaWYgKGNvbmZpZy5fdXNlVVRDKSB7XG4gICAgICAgICAgICByZXR1cm4gW25vdy5nZXRVVENGdWxsWWVhcigpLCBub3cuZ2V0VVRDTW9udGgoKSwgbm93LmdldFVUQ0RhdGUoKV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtub3cuZ2V0RnVsbFllYXIoKSwgbm93LmdldE1vbnRoKCksIG5vdy5nZXREYXRlKCldO1xuICAgIH1cblxuICAgIC8vIGNvbnZlcnQgYW4gYXJyYXkgdG8gYSBkYXRlLlxuICAgIC8vIHRoZSBhcnJheSBzaG91bGQgbWlycm9yIHRoZSBwYXJhbWV0ZXJzIGJlbG93XG4gICAgLy8gbm90ZTogYWxsIHZhbHVlcyBwYXN0IHRoZSB5ZWFyIGFyZSBvcHRpb25hbCBhbmQgd2lsbCBkZWZhdWx0IHRvIHRoZSBsb3dlc3QgcG9zc2libGUgdmFsdWUuXG4gICAgLy8gW3llYXIsIG1vbnRoLCBkYXkgLCBob3VyLCBtaW51dGUsIHNlY29uZCwgbWlsbGlzZWNvbmRdXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbUFycmF5IChjb25maWcpIHtcbiAgICAgICAgdmFyIGksIGRhdGUsIGlucHV0ID0gW10sIGN1cnJlbnREYXRlLCB5ZWFyVG9Vc2U7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudERhdGUgPSBjdXJyZW50RGF0ZUFycmF5KGNvbmZpZyk7XG5cbiAgICAgICAgLy9jb21wdXRlIGRheSBvZiB0aGUgeWVhciBmcm9tIHdlZWtzIGFuZCB3ZWVrZGF5c1xuICAgICAgICBpZiAoY29uZmlnLl93ICYmIGNvbmZpZy5fYVtEQVRFXSA9PSBudWxsICYmIGNvbmZpZy5fYVtNT05USF0gPT0gbnVsbCkge1xuICAgICAgICAgICAgZGF5T2ZZZWFyRnJvbVdlZWtJbmZvKGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2lmIHRoZSBkYXkgb2YgdGhlIHllYXIgaXMgc2V0LCBmaWd1cmUgb3V0IHdoYXQgaXQgaXNcbiAgICAgICAgaWYgKGNvbmZpZy5fZGF5T2ZZZWFyKSB7XG4gICAgICAgICAgICB5ZWFyVG9Vc2UgPSBkZWZhdWx0cyhjb25maWcuX2FbWUVBUl0sIGN1cnJlbnREYXRlW1lFQVJdKTtcblxuICAgICAgICAgICAgaWYgKGNvbmZpZy5fZGF5T2ZZZWFyID4gZGF5c0luWWVhcih5ZWFyVG9Vc2UpKSB7XG4gICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuX292ZXJmbG93RGF5T2ZZZWFyID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGF0ZSA9IGNyZWF0ZVVUQ0RhdGUoeWVhclRvVXNlLCAwLCBjb25maWcuX2RheU9mWWVhcik7XG4gICAgICAgICAgICBjb25maWcuX2FbTU9OVEhdID0gZGF0ZS5nZXRVVENNb250aCgpO1xuICAgICAgICAgICAgY29uZmlnLl9hW0RBVEVdID0gZGF0ZS5nZXRVVENEYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEZWZhdWx0IHRvIGN1cnJlbnQgZGF0ZS5cbiAgICAgICAgLy8gKiBpZiBubyB5ZWFyLCBtb250aCwgZGF5IG9mIG1vbnRoIGFyZSBnaXZlbiwgZGVmYXVsdCB0byB0b2RheVxuICAgICAgICAvLyAqIGlmIGRheSBvZiBtb250aCBpcyBnaXZlbiwgZGVmYXVsdCBtb250aCBhbmQgeWVhclxuICAgICAgICAvLyAqIGlmIG1vbnRoIGlzIGdpdmVuLCBkZWZhdWx0IG9ubHkgeWVhclxuICAgICAgICAvLyAqIGlmIHllYXIgaXMgZ2l2ZW4sIGRvbid0IGRlZmF1bHQgYW55dGhpbmdcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDMgJiYgY29uZmlnLl9hW2ldID09IG51bGw7ICsraSkge1xuICAgICAgICAgICAgY29uZmlnLl9hW2ldID0gaW5wdXRbaV0gPSBjdXJyZW50RGF0ZVtpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFplcm8gb3V0IHdoYXRldmVyIHdhcyBub3QgZGVmYXVsdGVkLCBpbmNsdWRpbmcgdGltZVxuICAgICAgICBmb3IgKDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgY29uZmlnLl9hW2ldID0gaW5wdXRbaV0gPSAoY29uZmlnLl9hW2ldID09IG51bGwpID8gKGkgPT09IDIgPyAxIDogMCkgOiBjb25maWcuX2FbaV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBmb3IgMjQ6MDA6MDAuMDAwXG4gICAgICAgIGlmIChjb25maWcuX2FbSE9VUl0gPT09IDI0ICYmXG4gICAgICAgICAgICAgICAgY29uZmlnLl9hW01JTlVURV0gPT09IDAgJiZcbiAgICAgICAgICAgICAgICBjb25maWcuX2FbU0VDT05EXSA9PT0gMCAmJlxuICAgICAgICAgICAgICAgIGNvbmZpZy5fYVtNSUxMSVNFQ09ORF0gPT09IDApIHtcbiAgICAgICAgICAgIGNvbmZpZy5fbmV4dERheSA9IHRydWU7XG4gICAgICAgICAgICBjb25maWcuX2FbSE9VUl0gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnLl9kID0gKGNvbmZpZy5fdXNlVVRDID8gY3JlYXRlVVRDRGF0ZSA6IGNyZWF0ZURhdGUpLmFwcGx5KG51bGwsIGlucHV0KTtcbiAgICAgICAgLy8gQXBwbHkgdGltZXpvbmUgb2Zmc2V0IGZyb20gaW5wdXQuIFRoZSBhY3R1YWwgdXRjT2Zmc2V0IGNhbiBiZSBjaGFuZ2VkXG4gICAgICAgIC8vIHdpdGggcGFyc2Vab25lLlxuICAgICAgICBpZiAoY29uZmlnLl90em0gIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uZmlnLl9kLnNldFVUQ01pbnV0ZXMoY29uZmlnLl9kLmdldFVUQ01pbnV0ZXMoKSAtIGNvbmZpZy5fdHptKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWcuX25leHREYXkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtIT1VSXSA9IDI0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGF5T2ZZZWFyRnJvbVdlZWtJbmZvKGNvbmZpZykge1xuICAgICAgICB2YXIgdywgd2Vla1llYXIsIHdlZWssIHdlZWtkYXksIGRvdywgZG95LCB0ZW1wO1xuXG4gICAgICAgIHcgPSBjb25maWcuX3c7XG4gICAgICAgIGlmICh3LkdHICE9IG51bGwgfHwgdy5XICE9IG51bGwgfHwgdy5FICE9IG51bGwpIHtcbiAgICAgICAgICAgIGRvdyA9IDE7XG4gICAgICAgICAgICBkb3kgPSA0O1xuXG4gICAgICAgICAgICAvLyBUT0RPOiBXZSBuZWVkIHRvIHRha2UgdGhlIGN1cnJlbnQgaXNvV2Vla1llYXIsIGJ1dCB0aGF0IGRlcGVuZHMgb25cbiAgICAgICAgICAgIC8vIGhvdyB3ZSBpbnRlcnByZXQgbm93IChsb2NhbCwgdXRjLCBmaXhlZCBvZmZzZXQpLiBTbyBjcmVhdGVcbiAgICAgICAgICAgIC8vIGEgbm93IHZlcnNpb24gb2YgY3VycmVudCBjb25maWcgKHRha2UgbG9jYWwvdXRjL29mZnNldCBmbGFncywgYW5kXG4gICAgICAgICAgICAvLyBjcmVhdGUgbm93KS5cbiAgICAgICAgICAgIHdlZWtZZWFyID0gZGVmYXVsdHMody5HRywgY29uZmlnLl9hW1lFQVJdLCB3ZWVrT2ZZZWFyKGxvY2FsX19jcmVhdGVMb2NhbCgpLCAxLCA0KS55ZWFyKTtcbiAgICAgICAgICAgIHdlZWsgPSBkZWZhdWx0cyh3LlcsIDEpO1xuICAgICAgICAgICAgd2Vla2RheSA9IGRlZmF1bHRzKHcuRSwgMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb3cgPSBjb25maWcuX2xvY2FsZS5fd2Vlay5kb3c7XG4gICAgICAgICAgICBkb3kgPSBjb25maWcuX2xvY2FsZS5fd2Vlay5kb3k7XG5cbiAgICAgICAgICAgIHdlZWtZZWFyID0gZGVmYXVsdHMody5nZywgY29uZmlnLl9hW1lFQVJdLCB3ZWVrT2ZZZWFyKGxvY2FsX19jcmVhdGVMb2NhbCgpLCBkb3csIGRveSkueWVhcik7XG4gICAgICAgICAgICB3ZWVrID0gZGVmYXVsdHMody53LCAxKTtcblxuICAgICAgICAgICAgaWYgKHcuZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gd2Vla2RheSAtLSBsb3cgZGF5IG51bWJlcnMgYXJlIGNvbnNpZGVyZWQgbmV4dCB3ZWVrXG4gICAgICAgICAgICAgICAgd2Vla2RheSA9IHcuZDtcbiAgICAgICAgICAgICAgICBpZiAod2Vla2RheSA8IGRvdykge1xuICAgICAgICAgICAgICAgICAgICArK3dlZWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh3LmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIGxvY2FsIHdlZWtkYXkgLS0gY291bnRpbmcgc3RhcnRzIGZyb20gYmVnaW5pbmcgb2Ygd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSB3LmUgKyBkb3c7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgdG8gYmVnaW5pbmcgb2Ygd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSBkb3c7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGVtcCA9IGRheU9mWWVhckZyb21XZWVrcyh3ZWVrWWVhciwgd2Vlaywgd2Vla2RheSwgZG95LCBkb3cpO1xuXG4gICAgICAgIGNvbmZpZy5fYVtZRUFSXSA9IHRlbXAueWVhcjtcbiAgICAgICAgY29uZmlnLl9kYXlPZlllYXIgPSB0ZW1wLmRheU9mWWVhcjtcbiAgICB9XG5cbiAgICB1dGlsc19ob29rc19faG9va3MuSVNPXzg2MDEgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgIC8vIGRhdGUgZnJvbSBzdHJpbmcgYW5kIGZvcm1hdCBzdHJpbmdcbiAgICBmdW5jdGlvbiBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZykge1xuICAgICAgICAvLyBUT0RPOiBNb3ZlIHRoaXMgdG8gYW5vdGhlciBwYXJ0IG9mIHRoZSBjcmVhdGlvbiBmbG93IHRvIHByZXZlbnQgY2lyY3VsYXIgZGVwc1xuICAgICAgICBpZiAoY29uZmlnLl9mID09PSB1dGlsc19ob29rc19faG9va3MuSVNPXzg2MDEpIHtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21JU08oY29uZmlnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZy5fYSA9IFtdO1xuICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5lbXB0eSA9IHRydWU7XG5cbiAgICAgICAgLy8gVGhpcyBhcnJheSBpcyB1c2VkIHRvIG1ha2UgYSBEYXRlLCBlaXRoZXIgd2l0aCBgbmV3IERhdGVgIG9yIGBEYXRlLlVUQ2BcbiAgICAgICAgdmFyIHN0cmluZyA9ICcnICsgY29uZmlnLl9pLFxuICAgICAgICAgICAgaSwgcGFyc2VkSW5wdXQsIHRva2VucywgdG9rZW4sIHNraXBwZWQsXG4gICAgICAgICAgICBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoLFxuICAgICAgICAgICAgdG90YWxQYXJzZWRJbnB1dExlbmd0aCA9IDA7XG5cbiAgICAgICAgdG9rZW5zID0gZXhwYW5kRm9ybWF0KGNvbmZpZy5fZiwgY29uZmlnLl9sb2NhbGUpLm1hdGNoKGZvcm1hdHRpbmdUb2tlbnMpIHx8IFtdO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRva2VuID0gdG9rZW5zW2ldO1xuICAgICAgICAgICAgcGFyc2VkSW5wdXQgPSAoc3RyaW5nLm1hdGNoKGdldFBhcnNlUmVnZXhGb3JUb2tlbih0b2tlbiwgY29uZmlnKSkgfHwgW10pWzBdO1xuICAgICAgICAgICAgaWYgKHBhcnNlZElucHV0KSB7XG4gICAgICAgICAgICAgICAgc2tpcHBlZCA9IHN0cmluZy5zdWJzdHIoMCwgc3RyaW5nLmluZGV4T2YocGFyc2VkSW5wdXQpKTtcbiAgICAgICAgICAgICAgICBpZiAoc2tpcHBlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnVudXNlZElucHV0LnB1c2goc2tpcHBlZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0cmluZyA9IHN0cmluZy5zbGljZShzdHJpbmcuaW5kZXhPZihwYXJzZWRJbnB1dCkgKyBwYXJzZWRJbnB1dC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIHRvdGFsUGFyc2VkSW5wdXRMZW5ndGggKz0gcGFyc2VkSW5wdXQubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZG9uJ3QgcGFyc2UgaWYgaXQncyBub3QgYSBrbm93biB0b2tlblxuICAgICAgICAgICAgaWYgKGZvcm1hdFRva2VuRnVuY3Rpb25zW3Rva2VuXSkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5lbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykudW51c2VkVG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhZGRUaW1lVG9BcnJheUZyb21Ub2tlbih0b2tlbiwgcGFyc2VkSW5wdXQsIGNvbmZpZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjb25maWcuX3N0cmljdCAmJiAhcGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS51bnVzZWRUb2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhZGQgcmVtYWluaW5nIHVucGFyc2VkIGlucHV0IGxlbmd0aCB0byB0aGUgc3RyaW5nXG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmNoYXJzTGVmdE92ZXIgPSBzdHJpbmdMZW5ndGggLSB0b3RhbFBhcnNlZElucHV0TGVuZ3RoO1xuICAgICAgICBpZiAoc3RyaW5nLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLnVudXNlZElucHV0LnB1c2goc3RyaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNsZWFyIF8xMmggZmxhZyBpZiBob3VyIGlzIDw9IDEyXG4gICAgICAgIGlmIChnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5iaWdIb3VyID09PSB0cnVlICYmXG4gICAgICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdIDw9IDEyICYmXG4gICAgICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdID4gMCkge1xuICAgICAgICAgICAgZ2V0UGFyc2luZ0ZsYWdzKGNvbmZpZykuYmlnSG91ciA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICAvLyBoYW5kbGUgbWVyaWRpZW1cbiAgICAgICAgY29uZmlnLl9hW0hPVVJdID0gbWVyaWRpZW1GaXhXcmFwKGNvbmZpZy5fbG9jYWxlLCBjb25maWcuX2FbSE9VUl0sIGNvbmZpZy5fbWVyaWRpZW0pO1xuXG4gICAgICAgIGNvbmZpZ0Zyb21BcnJheShjb25maWcpO1xuICAgICAgICBjaGVja092ZXJmbG93KGNvbmZpZyk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBtZXJpZGllbUZpeFdyYXAgKGxvY2FsZSwgaG91ciwgbWVyaWRpZW0pIHtcbiAgICAgICAgdmFyIGlzUG07XG5cbiAgICAgICAgaWYgKG1lcmlkaWVtID09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIG5vdGhpbmcgdG8gZG9cbiAgICAgICAgICAgIHJldHVybiBob3VyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb2NhbGUubWVyaWRpZW1Ib3VyICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbGUubWVyaWRpZW1Ib3VyKGhvdXIsIG1lcmlkaWVtKTtcbiAgICAgICAgfSBlbHNlIGlmIChsb2NhbGUuaXNQTSAhPSBudWxsKSB7XG4gICAgICAgICAgICAvLyBGYWxsYmFja1xuICAgICAgICAgICAgaXNQbSA9IGxvY2FsZS5pc1BNKG1lcmlkaWVtKTtcbiAgICAgICAgICAgIGlmIChpc1BtICYmIGhvdXIgPCAxMikge1xuICAgICAgICAgICAgICAgIGhvdXIgKz0gMTI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzUG0gJiYgaG91ciA9PT0gMTIpIHtcbiAgICAgICAgICAgICAgICBob3VyID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBob3VyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGhpcyBpcyBub3Qgc3VwcG9zZWQgdG8gaGFwcGVuXG4gICAgICAgICAgICByZXR1cm4gaG91cjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbmZpZ0Zyb21TdHJpbmdBbmRBcnJheShjb25maWcpIHtcbiAgICAgICAgdmFyIHRlbXBDb25maWcsXG4gICAgICAgICAgICBiZXN0TW9tZW50LFxuXG4gICAgICAgICAgICBzY29yZVRvQmVhdCxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBjdXJyZW50U2NvcmU7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fZi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmludmFsaWRGb3JtYXQgPSB0cnVlO1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoTmFOKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb25maWcuX2YubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZSA9IDA7XG4gICAgICAgICAgICB0ZW1wQ29uZmlnID0gY29weUNvbmZpZyh7fSwgY29uZmlnKTtcbiAgICAgICAgICAgIGlmIChjb25maWcuX3VzZVVUQyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGVtcENvbmZpZy5fdXNlVVRDID0gY29uZmlnLl91c2VVVEM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ZW1wQ29uZmlnLl9mID0gY29uZmlnLl9mW2ldO1xuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZ0FuZEZvcm1hdCh0ZW1wQ29uZmlnKTtcblxuICAgICAgICAgICAgaWYgKCF2YWxpZF9faXNWYWxpZCh0ZW1wQ29uZmlnKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBhbnkgaW5wdXQgdGhhdCB3YXMgbm90IHBhcnNlZCBhZGQgYSBwZW5hbHR5IGZvciB0aGF0IGZvcm1hdFxuICAgICAgICAgICAgY3VycmVudFNjb3JlICs9IGdldFBhcnNpbmdGbGFncyh0ZW1wQ29uZmlnKS5jaGFyc0xlZnRPdmVyO1xuXG4gICAgICAgICAgICAvL29yIHRva2Vuc1xuICAgICAgICAgICAgY3VycmVudFNjb3JlICs9IGdldFBhcnNpbmdGbGFncyh0ZW1wQ29uZmlnKS51bnVzZWRUb2tlbnMubGVuZ3RoICogMTA7XG5cbiAgICAgICAgICAgIGdldFBhcnNpbmdGbGFncyh0ZW1wQ29uZmlnKS5zY29yZSA9IGN1cnJlbnRTY29yZTtcblxuICAgICAgICAgICAgaWYgKHNjb3JlVG9CZWF0ID09IG51bGwgfHwgY3VycmVudFNjb3JlIDwgc2NvcmVUb0JlYXQpIHtcbiAgICAgICAgICAgICAgICBzY29yZVRvQmVhdCA9IGN1cnJlbnRTY29yZTtcbiAgICAgICAgICAgICAgICBiZXN0TW9tZW50ID0gdGVtcENvbmZpZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGV4dGVuZChjb25maWcsIGJlc3RNb21lbnQgfHwgdGVtcENvbmZpZyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbU9iamVjdChjb25maWcpIHtcbiAgICAgICAgaWYgKGNvbmZpZy5fZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGkgPSBub3JtYWxpemVPYmplY3RVbml0cyhjb25maWcuX2kpO1xuICAgICAgICBjb25maWcuX2EgPSBbaS55ZWFyLCBpLm1vbnRoLCBpLmRheSB8fCBpLmRhdGUsIGkuaG91ciwgaS5taW51dGUsIGkuc2Vjb25kLCBpLm1pbGxpc2Vjb25kXTtcblxuICAgICAgICBjb25maWdGcm9tQXJyYXkoY29uZmlnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVGcm9tQ29uZmlnIChjb25maWcpIHtcbiAgICAgICAgdmFyIHJlcyA9IG5ldyBNb21lbnQoY2hlY2tPdmVyZmxvdyhwcmVwYXJlQ29uZmlnKGNvbmZpZykpKTtcbiAgICAgICAgaWYgKHJlcy5fbmV4dERheSkge1xuICAgICAgICAgICAgLy8gQWRkaW5nIGlzIHNtYXJ0IGVub3VnaCBhcm91bmQgRFNUXG4gICAgICAgICAgICByZXMuYWRkKDEsICdkJyk7XG4gICAgICAgICAgICByZXMuX25leHREYXkgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByZXBhcmVDb25maWcgKGNvbmZpZykge1xuICAgICAgICB2YXIgaW5wdXQgPSBjb25maWcuX2ksXG4gICAgICAgICAgICBmb3JtYXQgPSBjb25maWcuX2Y7XG5cbiAgICAgICAgY29uZmlnLl9sb2NhbGUgPSBjb25maWcuX2xvY2FsZSB8fCBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlKGNvbmZpZy5fbCk7XG5cbiAgICAgICAgaWYgKGlucHV0ID09PSBudWxsIHx8IChmb3JtYXQgPT09IHVuZGVmaW5lZCAmJiBpbnB1dCA9PT0gJycpKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsaWRfX2NyZWF0ZUludmFsaWQoe251bGxJbnB1dDogdHJ1ZX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbmZpZy5faSA9IGlucHV0ID0gY29uZmlnLl9sb2NhbGUucHJlcGFyc2UoaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzTW9tZW50KGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBNb21lbnQoY2hlY2tPdmVyZmxvdyhpbnB1dCkpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkoZm9ybWF0KSkge1xuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZ0FuZEFycmF5KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0KSB7XG4gICAgICAgICAgICBjb25maWdGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNEYXRlKGlucHV0KSkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gaW5wdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maWdGcm9tSW5wdXQoY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb25maWc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uZmlnRnJvbUlucHV0KGNvbmZpZykge1xuICAgICAgICB2YXIgaW5wdXQgPSBjb25maWcuX2k7XG4gICAgICAgIGlmIChpbnB1dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzRGF0ZShpbnB1dCkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKCtpbnB1dCk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uZmlnRnJvbVN0cmluZyhjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcuX2EgPSBtYXAoaW5wdXQuc2xpY2UoMCksIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQob2JqLCAxMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbmZpZ0Zyb21BcnJheShjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZihpbnB1dCkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBjb25maWdGcm9tT2JqZWN0KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mKGlucHV0KSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIC8vIGZyb20gbWlsbGlzZWNvbmRzXG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShpbnB1dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MuY3JlYXRlRnJvbUlucHV0RmFsbGJhY2soY29uZmlnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUxvY2FsT3JVVEMgKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0LCBpc1VUQykge1xuICAgICAgICB2YXIgYyA9IHt9O1xuXG4gICAgICAgIGlmICh0eXBlb2YobG9jYWxlKSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICBzdHJpY3QgPSBsb2NhbGU7XG4gICAgICAgICAgICBsb2NhbGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gb2JqZWN0IGNvbnN0cnVjdGlvbiBtdXN0IGJlIGRvbmUgdGhpcyB3YXkuXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNDIzXG4gICAgICAgIGMuX2lzQU1vbWVudE9iamVjdCA9IHRydWU7XG4gICAgICAgIGMuX3VzZVVUQyA9IGMuX2lzVVRDID0gaXNVVEM7XG4gICAgICAgIGMuX2wgPSBsb2NhbGU7XG4gICAgICAgIGMuX2kgPSBpbnB1dDtcbiAgICAgICAgYy5fZiA9IGZvcm1hdDtcbiAgICAgICAgYy5fc3RyaWN0ID0gc3RyaWN0O1xuXG4gICAgICAgIHJldHVybiBjcmVhdGVGcm9tQ29uZmlnKGMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsX19jcmVhdGVMb2NhbCAoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUxvY2FsT3JVVEMoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QsIGZhbHNlKTtcbiAgICB9XG5cbiAgICB2YXIgcHJvdG90eXBlTWluID0gZGVwcmVjYXRlKFxuICAgICAgICAgJ21vbWVudCgpLm1pbiBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50Lm1pbiBpbnN0ZWFkLiBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTU0OCcsXG4gICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgdmFyIG90aGVyID0gbG9jYWxfX2NyZWF0ZUxvY2FsLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgcmV0dXJuIG90aGVyIDwgdGhpcyA/IHRoaXMgOiBvdGhlcjtcbiAgICAgICAgIH1cbiAgICAgKTtcblxuICAgIHZhciBwcm90b3R5cGVNYXggPSBkZXByZWNhdGUoXG4gICAgICAgICdtb21lbnQoKS5tYXggaXMgZGVwcmVjYXRlZCwgdXNlIG1vbWVudC5tYXggaW5zdGVhZC4gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE1NDgnLFxuICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb3RoZXIgPSBsb2NhbF9fY3JlYXRlTG9jYWwuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHJldHVybiBvdGhlciA+IHRoaXMgPyB0aGlzIDogb3RoZXI7XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gUGljayBhIG1vbWVudCBtIGZyb20gbW9tZW50cyBzbyB0aGF0IG1bZm5dKG90aGVyKSBpcyB0cnVlIGZvciBhbGxcbiAgICAvLyBvdGhlci4gVGhpcyByZWxpZXMgb24gdGhlIGZ1bmN0aW9uIGZuIHRvIGJlIHRyYW5zaXRpdmUuXG4gICAgLy9cbiAgICAvLyBtb21lbnRzIHNob3VsZCBlaXRoZXIgYmUgYW4gYXJyYXkgb2YgbW9tZW50IG9iamVjdHMgb3IgYW4gYXJyYXksIHdob3NlXG4gICAgLy8gZmlyc3QgZWxlbWVudCBpcyBhbiBhcnJheSBvZiBtb21lbnQgb2JqZWN0cy5cbiAgICBmdW5jdGlvbiBwaWNrQnkoZm4sIG1vbWVudHMpIHtcbiAgICAgICAgdmFyIHJlcywgaTtcbiAgICAgICAgaWYgKG1vbWVudHMubGVuZ3RoID09PSAxICYmIGlzQXJyYXkobW9tZW50c1swXSkpIHtcbiAgICAgICAgICAgIG1vbWVudHMgPSBtb21lbnRzWzBdO1xuICAgICAgICB9XG4gICAgICAgIGlmICghbW9tZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbF9fY3JlYXRlTG9jYWwoKTtcbiAgICAgICAgfVxuICAgICAgICByZXMgPSBtb21lbnRzWzBdO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbW9tZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgaWYgKCFtb21lbnRzW2ldLmlzVmFsaWQoKSB8fCBtb21lbnRzW2ldW2ZuXShyZXMpKSB7XG4gICAgICAgICAgICAgICAgcmVzID0gbW9tZW50c1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIC8vIFRPRE86IFVzZSBbXS5zb3J0IGluc3RlYWQ/XG4gICAgZnVuY3Rpb24gbWluICgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG5cbiAgICAgICAgcmV0dXJuIHBpY2tCeSgnaXNCZWZvcmUnLCBhcmdzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXggKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICByZXR1cm4gcGlja0J5KCdpc0FmdGVyJywgYXJncyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gRHVyYXRpb24gKGR1cmF0aW9uKSB7XG4gICAgICAgIHZhciBub3JtYWxpemVkSW5wdXQgPSBub3JtYWxpemVPYmplY3RVbml0cyhkdXJhdGlvbiksXG4gICAgICAgICAgICB5ZWFycyA9IG5vcm1hbGl6ZWRJbnB1dC55ZWFyIHx8IDAsXG4gICAgICAgICAgICBxdWFydGVycyA9IG5vcm1hbGl6ZWRJbnB1dC5xdWFydGVyIHx8IDAsXG4gICAgICAgICAgICBtb250aHMgPSBub3JtYWxpemVkSW5wdXQubW9udGggfHwgMCxcbiAgICAgICAgICAgIHdlZWtzID0gbm9ybWFsaXplZElucHV0LndlZWsgfHwgMCxcbiAgICAgICAgICAgIGRheXMgPSBub3JtYWxpemVkSW5wdXQuZGF5IHx8IDAsXG4gICAgICAgICAgICBob3VycyA9IG5vcm1hbGl6ZWRJbnB1dC5ob3VyIHx8IDAsXG4gICAgICAgICAgICBtaW51dGVzID0gbm9ybWFsaXplZElucHV0Lm1pbnV0ZSB8fCAwLFxuICAgICAgICAgICAgc2Vjb25kcyA9IG5vcm1hbGl6ZWRJbnB1dC5zZWNvbmQgfHwgMCxcbiAgICAgICAgICAgIG1pbGxpc2Vjb25kcyA9IG5vcm1hbGl6ZWRJbnB1dC5taWxsaXNlY29uZCB8fCAwO1xuXG4gICAgICAgIC8vIHJlcHJlc2VudGF0aW9uIGZvciBkYXRlQWRkUmVtb3ZlXG4gICAgICAgIHRoaXMuX21pbGxpc2Vjb25kcyA9ICttaWxsaXNlY29uZHMgK1xuICAgICAgICAgICAgc2Vjb25kcyAqIDFlMyArIC8vIDEwMDBcbiAgICAgICAgICAgIG1pbnV0ZXMgKiA2ZTQgKyAvLyAxMDAwICogNjBcbiAgICAgICAgICAgIGhvdXJzICogMzZlNTsgLy8gMTAwMCAqIDYwICogNjBcbiAgICAgICAgLy8gQmVjYXVzZSBvZiBkYXRlQWRkUmVtb3ZlIHRyZWF0cyAyNCBob3VycyBhcyBkaWZmZXJlbnQgZnJvbSBhXG4gICAgICAgIC8vIGRheSB3aGVuIHdvcmtpbmcgYXJvdW5kIERTVCwgd2UgbmVlZCB0byBzdG9yZSB0aGVtIHNlcGFyYXRlbHlcbiAgICAgICAgdGhpcy5fZGF5cyA9ICtkYXlzICtcbiAgICAgICAgICAgIHdlZWtzICogNztcbiAgICAgICAgLy8gSXQgaXMgaW1wb3NzaWJsZSB0cmFuc2xhdGUgbW9udGhzIGludG8gZGF5cyB3aXRob3V0IGtub3dpbmdcbiAgICAgICAgLy8gd2hpY2ggbW9udGhzIHlvdSBhcmUgYXJlIHRhbGtpbmcgYWJvdXQsIHNvIHdlIGhhdmUgdG8gc3RvcmVcbiAgICAgICAgLy8gaXQgc2VwYXJhdGVseS5cbiAgICAgICAgdGhpcy5fbW9udGhzID0gK21vbnRocyArXG4gICAgICAgICAgICBxdWFydGVycyAqIDMgK1xuICAgICAgICAgICAgeWVhcnMgKiAxMjtcblxuICAgICAgICB0aGlzLl9kYXRhID0ge307XG5cbiAgICAgICAgdGhpcy5fbG9jYWxlID0gbG9jYWxlX2xvY2FsZXNfX2dldExvY2FsZSgpO1xuXG4gICAgICAgIHRoaXMuX2J1YmJsZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRHVyYXRpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRHVyYXRpb247XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb2Zmc2V0ICh0b2tlbiwgc2VwYXJhdG9yKSB7XG4gICAgICAgIGFkZEZvcm1hdFRva2VuKHRva2VuLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy51dGNPZmZzZXQoKTtcbiAgICAgICAgICAgIHZhciBzaWduID0gJysnO1xuICAgICAgICAgICAgaWYgKG9mZnNldCA8IDApIHtcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSAtb2Zmc2V0O1xuICAgICAgICAgICAgICAgIHNpZ24gPSAnLSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2lnbiArIHplcm9GaWxsKH5+KG9mZnNldCAvIDYwKSwgMikgKyBzZXBhcmF0b3IgKyB6ZXJvRmlsbCh+fihvZmZzZXQpICUgNjAsIDIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvZmZzZXQoJ1onLCAnOicpO1xuICAgIG9mZnNldCgnWlonLCAnJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdaJywgIG1hdGNoT2Zmc2V0KTtcbiAgICBhZGRSZWdleFRva2VuKCdaWicsIG1hdGNoT2Zmc2V0KTtcbiAgICBhZGRQYXJzZVRva2VuKFsnWicsICdaWiddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl91c2VVVEMgPSB0cnVlO1xuICAgICAgICBjb25maWcuX3R6bSA9IG9mZnNldEZyb21TdHJpbmcoaW5wdXQpO1xuICAgIH0pO1xuXG4gICAgLy8gSEVMUEVSU1xuXG4gICAgLy8gdGltZXpvbmUgY2h1bmtlclxuICAgIC8vICcrMTA6MDAnID4gWycxMCcsICAnMDAnXVxuICAgIC8vICctMTUzMCcgID4gWyctMTUnLCAnMzAnXVxuICAgIHZhciBjaHVua09mZnNldCA9IC8oW1xcK1xcLV18XFxkXFxkKS9naTtcblxuICAgIGZ1bmN0aW9uIG9mZnNldEZyb21TdHJpbmcoc3RyaW5nKSB7XG4gICAgICAgIHZhciBtYXRjaGVzID0gKChzdHJpbmcgfHwgJycpLm1hdGNoKG1hdGNoT2Zmc2V0KSB8fCBbXSk7XG4gICAgICAgIHZhciBjaHVuayAgID0gbWF0Y2hlc1ttYXRjaGVzLmxlbmd0aCAtIDFdIHx8IFtdO1xuICAgICAgICB2YXIgcGFydHMgICA9IChjaHVuayArICcnKS5tYXRjaChjaHVua09mZnNldCkgfHwgWyctJywgMCwgMF07XG4gICAgICAgIHZhciBtaW51dGVzID0gKyhwYXJ0c1sxXSAqIDYwKSArIHRvSW50KHBhcnRzWzJdKTtcblxuICAgICAgICByZXR1cm4gcGFydHNbMF0gPT09ICcrJyA/IG1pbnV0ZXMgOiAtbWludXRlcztcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYSBtb21lbnQgZnJvbSBpbnB1dCwgdGhhdCBpcyBsb2NhbC91dGMvem9uZSBlcXVpdmFsZW50IHRvIG1vZGVsLlxuICAgIGZ1bmN0aW9uIGNsb25lV2l0aE9mZnNldChpbnB1dCwgbW9kZWwpIHtcbiAgICAgICAgdmFyIHJlcywgZGlmZjtcbiAgICAgICAgaWYgKG1vZGVsLl9pc1VUQykge1xuICAgICAgICAgICAgcmVzID0gbW9kZWwuY2xvbmUoKTtcbiAgICAgICAgICAgIGRpZmYgPSAoaXNNb21lbnQoaW5wdXQpIHx8IGlzRGF0ZShpbnB1dCkgPyAraW5wdXQgOiArbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KSkgLSAoK3Jlcyk7XG4gICAgICAgICAgICAvLyBVc2UgbG93LWxldmVsIGFwaSwgYmVjYXVzZSB0aGlzIGZuIGlzIGxvdy1sZXZlbCBhcGkuXG4gICAgICAgICAgICByZXMuX2Quc2V0VGltZSgrcmVzLl9kICsgZGlmZik7XG4gICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MudXBkYXRlT2Zmc2V0KHJlcywgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpLmxvY2FsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXREYXRlT2Zmc2V0IChtKSB7XG4gICAgICAgIC8vIE9uIEZpcmVmb3guMjQgRGF0ZSNnZXRUaW1lem9uZU9mZnNldCByZXR1cm5zIGEgZmxvYXRpbmcgcG9pbnQuXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L3B1bGwvMTg3MVxuICAgICAgICByZXR1cm4gLU1hdGgucm91bmQobS5fZC5nZXRUaW1lem9uZU9mZnNldCgpIC8gMTUpICogMTU7XG4gICAgfVxuXG4gICAgLy8gSE9PS1NcblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2hlbmV2ZXIgYSBtb21lbnQgaXMgbXV0YXRlZC5cbiAgICAvLyBJdCBpcyBpbnRlbmRlZCB0byBrZWVwIHRoZSBvZmZzZXQgaW4gc3luYyB3aXRoIHRoZSB0aW1lem9uZS5cbiAgICB1dGlsc19ob29rc19faG9va3MudXBkYXRlT2Zmc2V0ID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICAvLyBrZWVwTG9jYWxUaW1lID0gdHJ1ZSBtZWFucyBvbmx5IGNoYW5nZSB0aGUgdGltZXpvbmUsIHdpdGhvdXRcbiAgICAvLyBhZmZlY3RpbmcgdGhlIGxvY2FsIGhvdXIuIFNvIDU6MzE6MjYgKzAzMDAgLS1bdXRjT2Zmc2V0KDIsIHRydWUpXS0tPlxuICAgIC8vIDU6MzE6MjYgKzAyMDAgSXQgaXMgcG9zc2libGUgdGhhdCA1OjMxOjI2IGRvZXNuJ3QgZXhpc3Qgd2l0aCBvZmZzZXRcbiAgICAvLyArMDIwMCwgc28gd2UgYWRqdXN0IHRoZSB0aW1lIGFzIG5lZWRlZCwgdG8gYmUgdmFsaWQuXG4gICAgLy9cbiAgICAvLyBLZWVwaW5nIHRoZSB0aW1lIGFjdHVhbGx5IGFkZHMvc3VidHJhY3RzIChvbmUgaG91cilcbiAgICAvLyBmcm9tIHRoZSBhY3R1YWwgcmVwcmVzZW50ZWQgdGltZS4gVGhhdCBpcyB3aHkgd2UgY2FsbCB1cGRhdGVPZmZzZXRcbiAgICAvLyBhIHNlY29uZCB0aW1lLiBJbiBjYXNlIGl0IHdhbnRzIHVzIHRvIGNoYW5nZSB0aGUgb2Zmc2V0IGFnYWluXG4gICAgLy8gX2NoYW5nZUluUHJvZ3Jlc3MgPT0gdHJ1ZSBjYXNlLCB0aGVuIHdlIGhhdmUgdG8gYWRqdXN0LCBiZWNhdXNlXG4gICAgLy8gdGhlcmUgaXMgbm8gc3VjaCB0aW1lIGluIHRoZSBnaXZlbiB0aW1lem9uZS5cbiAgICBmdW5jdGlvbiBnZXRTZXRPZmZzZXQgKGlucHV0LCBrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLl9vZmZzZXQgfHwgMCxcbiAgICAgICAgICAgIGxvY2FsQWRqdXN0O1xuICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IG9mZnNldEZyb21TdHJpbmcoaW5wdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGlucHV0KSA8IDE2KSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dCAqIDYwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLl9pc1VUQyAmJiBrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxBZGp1c3QgPSBnZXREYXRlT2Zmc2V0KHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fb2Zmc2V0ID0gaW5wdXQ7XG4gICAgICAgICAgICB0aGlzLl9pc1VUQyA9IHRydWU7XG4gICAgICAgICAgICBpZiAobG9jYWxBZGp1c3QgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkKGxvY2FsQWRqdXN0LCAnbScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9mZnNldCAhPT0gaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWtlZXBMb2NhbFRpbWUgfHwgdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcykge1xuICAgICAgICAgICAgICAgICAgICBhZGRfc3VidHJhY3RfX2FkZFN1YnRyYWN0KHRoaXMsIGNyZWF0ZV9fY3JlYXRlRHVyYXRpb24oaW5wdXQgLSBvZmZzZXQsICdtJyksIDEsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9jaGFuZ2VJblByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB1dGlsc19ob29rc19faG9va3MudXBkYXRlT2Zmc2V0KHRoaXMsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VJblByb2dyZXNzID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pc1VUQyA/IG9mZnNldCA6IGdldERhdGVPZmZzZXQodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRTZXRab25lIChpbnB1dCwga2VlcExvY2FsVGltZSkge1xuICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IC1pbnB1dDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQoaW5wdXQsIGtlZXBMb2NhbFRpbWUpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAtdGhpcy51dGNPZmZzZXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldE9mZnNldFRvVVRDIChrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnV0Y09mZnNldCgwLCBrZWVwTG9jYWxUaW1lKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRPZmZzZXRUb0xvY2FsIChrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgIGlmICh0aGlzLl9pc1VUQykge1xuICAgICAgICAgICAgdGhpcy51dGNPZmZzZXQoMCwga2VlcExvY2FsVGltZSk7XG4gICAgICAgICAgICB0aGlzLl9pc1VUQyA9IGZhbHNlO1xuXG4gICAgICAgICAgICBpZiAoa2VlcExvY2FsVGltZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3VidHJhY3QoZ2V0RGF0ZU9mZnNldCh0aGlzKSwgJ20nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRPZmZzZXRUb1BhcnNlZE9mZnNldCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl90em0pIHtcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KHRoaXMuX3R6bSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuX2kgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aGlzLnV0Y09mZnNldChvZmZzZXRGcm9tU3RyaW5nKHRoaXMuX2kpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYXNBbGlnbmVkSG91ck9mZnNldCAoaW5wdXQpIHtcbiAgICAgICAgaW5wdXQgPSBpbnB1dCA/IGxvY2FsX19jcmVhdGVMb2NhbChpbnB1dCkudXRjT2Zmc2V0KCkgOiAwO1xuXG4gICAgICAgIHJldHVybiAodGhpcy51dGNPZmZzZXQoKSAtIGlucHV0KSAlIDYwID09PSAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRGF5bGlnaHRTYXZpbmdUaW1lICgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KCkgPiB0aGlzLmNsb25lKCkubW9udGgoMCkudXRjT2Zmc2V0KCkgfHxcbiAgICAgICAgICAgIHRoaXMudXRjT2Zmc2V0KCkgPiB0aGlzLmNsb25lKCkubW9udGgoNSkudXRjT2Zmc2V0KClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0RheWxpZ2h0U2F2aW5nVGltZVNoaWZ0ZWQgKCkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuX2lzRFNUU2hpZnRlZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pc0RTVFNoaWZ0ZWQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYyA9IHt9O1xuXG4gICAgICAgIGNvcHlDb25maWcoYywgdGhpcyk7XG4gICAgICAgIGMgPSBwcmVwYXJlQ29uZmlnKGMpO1xuXG4gICAgICAgIGlmIChjLl9hKSB7XG4gICAgICAgICAgICB2YXIgb3RoZXIgPSBjLl9pc1VUQyA/IGNyZWF0ZV91dGNfX2NyZWF0ZVVUQyhjLl9hKSA6IGxvY2FsX19jcmVhdGVMb2NhbChjLl9hKTtcbiAgICAgICAgICAgIHRoaXMuX2lzRFNUU2hpZnRlZCA9IHRoaXMuaXNWYWxpZCgpICYmXG4gICAgICAgICAgICAgICAgY29tcGFyZUFycmF5cyhjLl9hLCBvdGhlci50b0FycmF5KCkpID4gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2lzRFNUU2hpZnRlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzRFNUU2hpZnRlZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0xvY2FsICgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLl9pc1VUQztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1V0Y09mZnNldCAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc1VUQztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1V0YyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc1VUQyAmJiB0aGlzLl9vZmZzZXQgPT09IDA7XG4gICAgfVxuXG4gICAgdmFyIGFzcE5ldFJlZ2V4ID0gLyhcXC0pPyg/OihcXGQqKVxcLik/KFxcZCspXFw6KFxcZCspKD86XFw6KFxcZCspXFwuPyhcXGR7M30pPyk/LztcblxuICAgIC8vIGZyb20gaHR0cDovL2RvY3MuY2xvc3VyZS1saWJyYXJ5Lmdvb2dsZWNvZGUuY29tL2dpdC9jbG9zdXJlX2dvb2dfZGF0ZV9kYXRlLmpzLnNvdXJjZS5odG1sXG4gICAgLy8gc29tZXdoYXQgbW9yZSBpbiBsaW5lIHdpdGggNC40LjMuMiAyMDA0IHNwZWMsIGJ1dCBhbGxvd3MgZGVjaW1hbCBhbnl3aGVyZVxuICAgIHZhciBjcmVhdGVfX2lzb1JlZ2V4ID0gL14oLSk/UCg/Oig/OihbMC05LC5dKilZKT8oPzooWzAtOSwuXSopTSk/KD86KFswLTksLl0qKUQpPyg/OlQoPzooWzAtOSwuXSopSCk/KD86KFswLTksLl0qKU0pPyg/OihbMC05LC5dKilTKT8pP3woWzAtOSwuXSopVykkLztcblxuICAgIGZ1bmN0aW9uIGNyZWF0ZV9fY3JlYXRlRHVyYXRpb24gKGlucHV0LCBrZXkpIHtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gaW5wdXQsXG4gICAgICAgICAgICAvLyBtYXRjaGluZyBhZ2FpbnN0IHJlZ2V4cCBpcyBleHBlbnNpdmUsIGRvIGl0IG9uIGRlbWFuZFxuICAgICAgICAgICAgbWF0Y2ggPSBudWxsLFxuICAgICAgICAgICAgc2lnbixcbiAgICAgICAgICAgIHJldCxcbiAgICAgICAgICAgIGRpZmZSZXM7XG5cbiAgICAgICAgaWYgKGlzRHVyYXRpb24oaW5wdXQpKSB7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICBtcyA6IGlucHV0Ll9taWxsaXNlY29uZHMsXG4gICAgICAgICAgICAgICAgZCAgOiBpbnB1dC5fZGF5cyxcbiAgICAgICAgICAgICAgICBNICA6IGlucHV0Ll9tb250aHNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGlucHV0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7fTtcbiAgICAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbltrZXldID0gaW5wdXQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uLm1pbGxpc2Vjb25kcyA9IGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCEhKG1hdGNoID0gYXNwTmV0UmVnZXguZXhlYyhpbnB1dCkpKSB7XG4gICAgICAgICAgICBzaWduID0gKG1hdGNoWzFdID09PSAnLScpID8gLTEgOiAxO1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgeSAgOiAwLFxuICAgICAgICAgICAgICAgIGQgIDogdG9JbnQobWF0Y2hbREFURV0pICAgICAgICAqIHNpZ24sXG4gICAgICAgICAgICAgICAgaCAgOiB0b0ludChtYXRjaFtIT1VSXSkgICAgICAgICogc2lnbixcbiAgICAgICAgICAgICAgICBtICA6IHRvSW50KG1hdGNoW01JTlVURV0pICAgICAgKiBzaWduLFxuICAgICAgICAgICAgICAgIHMgIDogdG9JbnQobWF0Y2hbU0VDT05EXSkgICAgICAqIHNpZ24sXG4gICAgICAgICAgICAgICAgbXMgOiB0b0ludChtYXRjaFtNSUxMSVNFQ09ORF0pICogc2lnblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmICghIShtYXRjaCA9IGNyZWF0ZV9faXNvUmVnZXguZXhlYyhpbnB1dCkpKSB7XG4gICAgICAgICAgICBzaWduID0gKG1hdGNoWzFdID09PSAnLScpID8gLTEgOiAxO1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgeSA6IHBhcnNlSXNvKG1hdGNoWzJdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBNIDogcGFyc2VJc28obWF0Y2hbM10sIHNpZ24pLFxuICAgICAgICAgICAgICAgIGQgOiBwYXJzZUlzbyhtYXRjaFs0XSwgc2lnbiksXG4gICAgICAgICAgICAgICAgaCA6IHBhcnNlSXNvKG1hdGNoWzVdLCBzaWduKSxcbiAgICAgICAgICAgICAgICBtIDogcGFyc2VJc28obWF0Y2hbNl0sIHNpZ24pLFxuICAgICAgICAgICAgICAgIHMgOiBwYXJzZUlzbyhtYXRjaFs3XSwgc2lnbiksXG4gICAgICAgICAgICAgICAgdyA6IHBhcnNlSXNvKG1hdGNoWzhdLCBzaWduKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmIChkdXJhdGlvbiA9PSBudWxsKSB7Ly8gY2hlY2tzIGZvciBudWxsIG9yIHVuZGVmaW5lZFxuICAgICAgICAgICAgZHVyYXRpb24gPSB7fTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZHVyYXRpb24gPT09ICdvYmplY3QnICYmICgnZnJvbScgaW4gZHVyYXRpb24gfHwgJ3RvJyBpbiBkdXJhdGlvbikpIHtcbiAgICAgICAgICAgIGRpZmZSZXMgPSBtb21lbnRzRGlmZmVyZW5jZShsb2NhbF9fY3JlYXRlTG9jYWwoZHVyYXRpb24uZnJvbSksIGxvY2FsX19jcmVhdGVMb2NhbChkdXJhdGlvbi50bykpO1xuXG4gICAgICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgICAgICAgICAgZHVyYXRpb24ubXMgPSBkaWZmUmVzLm1pbGxpc2Vjb25kcztcbiAgICAgICAgICAgIGR1cmF0aW9uLk0gPSBkaWZmUmVzLm1vbnRocztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldCA9IG5ldyBEdXJhdGlvbihkdXJhdGlvbik7XG5cbiAgICAgICAgaWYgKGlzRHVyYXRpb24oaW5wdXQpICYmIGhhc093blByb3AoaW5wdXQsICdfbG9jYWxlJykpIHtcbiAgICAgICAgICAgIHJldC5fbG9jYWxlID0gaW5wdXQuX2xvY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuXG4gICAgY3JlYXRlX19jcmVhdGVEdXJhdGlvbi5mbiA9IER1cmF0aW9uLnByb3RvdHlwZTtcblxuICAgIGZ1bmN0aW9uIHBhcnNlSXNvIChpbnAsIHNpZ24pIHtcbiAgICAgICAgLy8gV2UnZCBub3JtYWxseSB1c2Ugfn5pbnAgZm9yIHRoaXMsIGJ1dCB1bmZvcnR1bmF0ZWx5IGl0IGFsc29cbiAgICAgICAgLy8gY29udmVydHMgZmxvYXRzIHRvIGludHMuXG4gICAgICAgIC8vIGlucCBtYXkgYmUgdW5kZWZpbmVkLCBzbyBjYXJlZnVsIGNhbGxpbmcgcmVwbGFjZSBvbiBpdC5cbiAgICAgICAgdmFyIHJlcyA9IGlucCAmJiBwYXJzZUZsb2F0KGlucC5yZXBsYWNlKCcsJywgJy4nKSk7XG4gICAgICAgIC8vIGFwcGx5IHNpZ24gd2hpbGUgd2UncmUgYXQgaXRcbiAgICAgICAgcmV0dXJuIChpc05hTihyZXMpID8gMCA6IHJlcykgKiBzaWduO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpIHtcbiAgICAgICAgdmFyIHJlcyA9IHttaWxsaXNlY29uZHM6IDAsIG1vbnRoczogMH07XG5cbiAgICAgICAgcmVzLm1vbnRocyA9IG90aGVyLm1vbnRoKCkgLSBiYXNlLm1vbnRoKCkgK1xuICAgICAgICAgICAgKG90aGVyLnllYXIoKSAtIGJhc2UueWVhcigpKSAqIDEyO1xuICAgICAgICBpZiAoYmFzZS5jbG9uZSgpLmFkZChyZXMubW9udGhzLCAnTScpLmlzQWZ0ZXIob3RoZXIpKSB7XG4gICAgICAgICAgICAtLXJlcy5tb250aHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXMubWlsbGlzZWNvbmRzID0gK290aGVyIC0gKyhiYXNlLmNsb25lKCkuYWRkKHJlcy5tb250aHMsICdNJykpO1xuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpIHtcbiAgICAgICAgdmFyIHJlcztcbiAgICAgICAgb3RoZXIgPSBjbG9uZVdpdGhPZmZzZXQob3RoZXIsIGJhc2UpO1xuICAgICAgICBpZiAoYmFzZS5pc0JlZm9yZShvdGhlcikpIHtcbiAgICAgICAgICAgIHJlcyA9IHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzID0gcG9zaXRpdmVNb21lbnRzRGlmZmVyZW5jZShvdGhlciwgYmFzZSk7XG4gICAgICAgICAgICByZXMubWlsbGlzZWNvbmRzID0gLXJlcy5taWxsaXNlY29uZHM7XG4gICAgICAgICAgICByZXMubW9udGhzID0gLXJlcy5tb250aHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNyZWF0ZUFkZGVyKGRpcmVjdGlvbiwgbmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbCwgcGVyaW9kKSB7XG4gICAgICAgICAgICB2YXIgZHVyLCB0bXA7XG4gICAgICAgICAgICAvL2ludmVydCB0aGUgYXJndW1lbnRzLCBidXQgY29tcGxhaW4gYWJvdXQgaXRcbiAgICAgICAgICAgIGlmIChwZXJpb2QgIT09IG51bGwgJiYgIWlzTmFOKCtwZXJpb2QpKSB7XG4gICAgICAgICAgICAgICAgZGVwcmVjYXRlU2ltcGxlKG5hbWUsICdtb21lbnQoKS4nICsgbmFtZSAgKyAnKHBlcmlvZCwgbnVtYmVyKSBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIG1vbWVudCgpLicgKyBuYW1lICsgJyhudW1iZXIsIHBlcmlvZCkuJyk7XG4gICAgICAgICAgICAgICAgdG1wID0gdmFsOyB2YWwgPSBwZXJpb2Q7IHBlcmlvZCA9IHRtcDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFsID0gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgPyArdmFsIDogdmFsO1xuICAgICAgICAgICAgZHVyID0gY3JlYXRlX19jcmVhdGVEdXJhdGlvbih2YWwsIHBlcmlvZCk7XG4gICAgICAgICAgICBhZGRfc3VidHJhY3RfX2FkZFN1YnRyYWN0KHRoaXMsIGR1ciwgZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZF9zdWJ0cmFjdF9fYWRkU3VidHJhY3QgKG1vbSwgZHVyYXRpb24sIGlzQWRkaW5nLCB1cGRhdGVPZmZzZXQpIHtcbiAgICAgICAgdmFyIG1pbGxpc2Vjb25kcyA9IGR1cmF0aW9uLl9taWxsaXNlY29uZHMsXG4gICAgICAgICAgICBkYXlzID0gZHVyYXRpb24uX2RheXMsXG4gICAgICAgICAgICBtb250aHMgPSBkdXJhdGlvbi5fbW9udGhzO1xuICAgICAgICB1cGRhdGVPZmZzZXQgPSB1cGRhdGVPZmZzZXQgPT0gbnVsbCA/IHRydWUgOiB1cGRhdGVPZmZzZXQ7XG5cbiAgICAgICAgaWYgKG1pbGxpc2Vjb25kcykge1xuICAgICAgICAgICAgbW9tLl9kLnNldFRpbWUoK21vbS5fZCArIG1pbGxpc2Vjb25kcyAqIGlzQWRkaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF5cykge1xuICAgICAgICAgICAgZ2V0X3NldF9fc2V0KG1vbSwgJ0RhdGUnLCBnZXRfc2V0X19nZXQobW9tLCAnRGF0ZScpICsgZGF5cyAqIGlzQWRkaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobW9udGhzKSB7XG4gICAgICAgICAgICBzZXRNb250aChtb20sIGdldF9zZXRfX2dldChtb20sICdNb250aCcpICsgbW9udGhzICogaXNBZGRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1cGRhdGVPZmZzZXQpIHtcbiAgICAgICAgICAgIHV0aWxzX2hvb2tzX19ob29rcy51cGRhdGVPZmZzZXQobW9tLCBkYXlzIHx8IG1vbnRocyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgYWRkX3N1YnRyYWN0X19hZGQgICAgICA9IGNyZWF0ZUFkZGVyKDEsICdhZGQnKTtcbiAgICB2YXIgYWRkX3N1YnRyYWN0X19zdWJ0cmFjdCA9IGNyZWF0ZUFkZGVyKC0xLCAnc3VidHJhY3QnKTtcblxuICAgIGZ1bmN0aW9uIG1vbWVudF9jYWxlbmRhcl9fY2FsZW5kYXIgKHRpbWUsIGZvcm1hdHMpIHtcbiAgICAgICAgLy8gV2Ugd2FudCB0byBjb21wYXJlIHRoZSBzdGFydCBvZiB0b2RheSwgdnMgdGhpcy5cbiAgICAgICAgLy8gR2V0dGluZyBzdGFydC1vZi10b2RheSBkZXBlbmRzIG9uIHdoZXRoZXIgd2UncmUgbG9jYWwvdXRjL29mZnNldCBvciBub3QuXG4gICAgICAgIHZhciBub3cgPSB0aW1lIHx8IGxvY2FsX19jcmVhdGVMb2NhbCgpLFxuICAgICAgICAgICAgc29kID0gY2xvbmVXaXRoT2Zmc2V0KG5vdywgdGhpcykuc3RhcnRPZignZGF5JyksXG4gICAgICAgICAgICBkaWZmID0gdGhpcy5kaWZmKHNvZCwgJ2RheXMnLCB0cnVlKSxcbiAgICAgICAgICAgIGZvcm1hdCA9IGRpZmYgPCAtNiA/ICdzYW1lRWxzZScgOlxuICAgICAgICAgICAgICAgIGRpZmYgPCAtMSA/ICdsYXN0V2VlaycgOlxuICAgICAgICAgICAgICAgIGRpZmYgPCAwID8gJ2xhc3REYXknIDpcbiAgICAgICAgICAgICAgICBkaWZmIDwgMSA/ICdzYW1lRGF5JyA6XG4gICAgICAgICAgICAgICAgZGlmZiA8IDIgPyAnbmV4dERheScgOlxuICAgICAgICAgICAgICAgIGRpZmYgPCA3ID8gJ25leHRXZWVrJyA6ICdzYW1lRWxzZSc7XG4gICAgICAgIHJldHVybiB0aGlzLmZvcm1hdChmb3JtYXRzICYmIGZvcm1hdHNbZm9ybWF0XSB8fCB0aGlzLmxvY2FsZURhdGEoKS5jYWxlbmRhcihmb3JtYXQsIHRoaXMsIGxvY2FsX19jcmVhdGVMb2NhbChub3cpKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvbmUgKCkge1xuICAgICAgICByZXR1cm4gbmV3IE1vbWVudCh0aGlzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0FmdGVyIChpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgdmFyIGlucHV0TXM7XG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModHlwZW9mIHVuaXRzICE9PSAndW5kZWZpbmVkJyA/IHVuaXRzIDogJ21pbGxpc2Vjb25kJyk7XG4gICAgICAgIGlmICh1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICAgICAgaW5wdXQgPSBpc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IGxvY2FsX19jcmVhdGVMb2NhbChpbnB1dCk7XG4gICAgICAgICAgICByZXR1cm4gK3RoaXMgPiAraW5wdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnB1dE1zID0gaXNNb21lbnQoaW5wdXQpID8gK2lucHV0IDogK2xvY2FsX19jcmVhdGVMb2NhbChpbnB1dCk7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXRNcyA8ICt0aGlzLmNsb25lKCkuc3RhcnRPZih1bml0cyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0JlZm9yZSAoaW5wdXQsIHVuaXRzKSB7XG4gICAgICAgIHZhciBpbnB1dE1zO1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHR5cGVvZiB1bml0cyAhPT0gJ3VuZGVmaW5lZCcgPyB1bml0cyA6ICdtaWxsaXNlY29uZCcpO1xuICAgICAgICBpZiAodW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgICAgIGlucHV0ID0gaXNNb21lbnQoaW5wdXQpID8gaW5wdXQgOiBsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuICt0aGlzIDwgK2lucHV0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5wdXRNcyA9IGlzTW9tZW50KGlucHV0KSA/ICtpbnB1dCA6ICtsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuICt0aGlzLmNsb25lKCkuZW5kT2YodW5pdHMpIDwgaW5wdXRNcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQmV0d2VlbiAoZnJvbSwgdG8sIHVuaXRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzQWZ0ZXIoZnJvbSwgdW5pdHMpICYmIHRoaXMuaXNCZWZvcmUodG8sIHVuaXRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1NhbWUgKGlucHV0LCB1bml0cykge1xuICAgICAgICB2YXIgaW5wdXRNcztcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyB8fCAnbWlsbGlzZWNvbmQnKTtcbiAgICAgICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICBpbnB1dCA9IGlzTW9tZW50KGlucHV0KSA/IGlucHV0IDogbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0KTtcbiAgICAgICAgICAgIHJldHVybiArdGhpcyA9PT0gK2lucHV0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5wdXRNcyA9ICtsb2NhbF9fY3JlYXRlTG9jYWwoaW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuICsodGhpcy5jbG9uZSgpLnN0YXJ0T2YodW5pdHMpKSA8PSBpbnB1dE1zICYmIGlucHV0TXMgPD0gKyh0aGlzLmNsb25lKCkuZW5kT2YodW5pdHMpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRpZmYgKGlucHV0LCB1bml0cywgYXNGbG9hdCkge1xuICAgICAgICB2YXIgdGhhdCA9IGNsb25lV2l0aE9mZnNldChpbnB1dCwgdGhpcyksXG4gICAgICAgICAgICB6b25lRGVsdGEgPSAodGhhdC51dGNPZmZzZXQoKSAtIHRoaXMudXRjT2Zmc2V0KCkpICogNmU0LFxuICAgICAgICAgICAgZGVsdGEsIG91dHB1dDtcblxuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcblxuICAgICAgICBpZiAodW5pdHMgPT09ICd5ZWFyJyB8fCB1bml0cyA9PT0gJ21vbnRoJyB8fCB1bml0cyA9PT0gJ3F1YXJ0ZXInKSB7XG4gICAgICAgICAgICBvdXRwdXQgPSBtb250aERpZmYodGhpcywgdGhhdCk7XG4gICAgICAgICAgICBpZiAodW5pdHMgPT09ICdxdWFydGVyJykge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dCAvIDM7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHVuaXRzID09PSAneWVhcicpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQgLyAxMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbHRhID0gdGhpcyAtIHRoYXQ7XG4gICAgICAgICAgICBvdXRwdXQgPSB1bml0cyA9PT0gJ3NlY29uZCcgPyBkZWx0YSAvIDFlMyA6IC8vIDEwMDBcbiAgICAgICAgICAgICAgICB1bml0cyA9PT0gJ21pbnV0ZScgPyBkZWx0YSAvIDZlNCA6IC8vIDEwMDAgKiA2MFxuICAgICAgICAgICAgICAgIHVuaXRzID09PSAnaG91cicgPyBkZWx0YSAvIDM2ZTUgOiAvLyAxMDAwICogNjAgKiA2MFxuICAgICAgICAgICAgICAgIHVuaXRzID09PSAnZGF5JyA/IChkZWx0YSAtIHpvbmVEZWx0YSkgLyA4NjRlNSA6IC8vIDEwMDAgKiA2MCAqIDYwICogMjQsIG5lZ2F0ZSBkc3RcbiAgICAgICAgICAgICAgICB1bml0cyA9PT0gJ3dlZWsnID8gKGRlbHRhIC0gem9uZURlbHRhKSAvIDYwNDhlNSA6IC8vIDEwMDAgKiA2MCAqIDYwICogMjQgKiA3LCBuZWdhdGUgZHN0XG4gICAgICAgICAgICAgICAgZGVsdGE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFzRmxvYXQgPyBvdXRwdXQgOiBhYnNGbG9vcihvdXRwdXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vbnRoRGlmZiAoYSwgYikge1xuICAgICAgICAvLyBkaWZmZXJlbmNlIGluIG1vbnRoc1xuICAgICAgICB2YXIgd2hvbGVNb250aERpZmYgPSAoKGIueWVhcigpIC0gYS55ZWFyKCkpICogMTIpICsgKGIubW9udGgoKSAtIGEubW9udGgoKSksXG4gICAgICAgICAgICAvLyBiIGlzIGluIChhbmNob3IgLSAxIG1vbnRoLCBhbmNob3IgKyAxIG1vbnRoKVxuICAgICAgICAgICAgYW5jaG9yID0gYS5jbG9uZSgpLmFkZCh3aG9sZU1vbnRoRGlmZiwgJ21vbnRocycpLFxuICAgICAgICAgICAgYW5jaG9yMiwgYWRqdXN0O1xuXG4gICAgICAgIGlmIChiIC0gYW5jaG9yIDwgMCkge1xuICAgICAgICAgICAgYW5jaG9yMiA9IGEuY2xvbmUoKS5hZGQod2hvbGVNb250aERpZmYgLSAxLCAnbW9udGhzJyk7XG4gICAgICAgICAgICAvLyBsaW5lYXIgYWNyb3NzIHRoZSBtb250aFxuICAgICAgICAgICAgYWRqdXN0ID0gKGIgLSBhbmNob3IpIC8gKGFuY2hvciAtIGFuY2hvcjIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYW5jaG9yMiA9IGEuY2xvbmUoKS5hZGQod2hvbGVNb250aERpZmYgKyAxLCAnbW9udGhzJyk7XG4gICAgICAgICAgICAvLyBsaW5lYXIgYWNyb3NzIHRoZSBtb250aFxuICAgICAgICAgICAgYWRqdXN0ID0gKGIgLSBhbmNob3IpIC8gKGFuY2hvcjIgLSBhbmNob3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIC0od2hvbGVNb250aERpZmYgKyBhZGp1c3QpO1xuICAgIH1cblxuICAgIHV0aWxzX2hvb2tzX19ob29rcy5kZWZhdWx0Rm9ybWF0ID0gJ1lZWVktTU0tRERUSEg6bW06c3NaJztcblxuICAgIGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sb2NhbGUoJ2VuJykuZm9ybWF0KCdkZGQgTU1NIEREIFlZWVkgSEg6bW06c3MgW0dNVF1aWicpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vbWVudF9mb3JtYXRfX3RvSVNPU3RyaW5nICgpIHtcbiAgICAgICAgdmFyIG0gPSB0aGlzLmNsb25lKCkudXRjKCk7XG4gICAgICAgIGlmICgwIDwgbS55ZWFyKCkgJiYgbS55ZWFyKCkgPD0gOTk5OSkge1xuICAgICAgICAgICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZykge1xuICAgICAgICAgICAgICAgIC8vIG5hdGl2ZSBpbXBsZW1lbnRhdGlvbiBpcyB+NTB4IGZhc3RlciwgdXNlIGl0IHdoZW4gd2UgY2FuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9EYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdE1vbWVudChtLCAnWVlZWS1NTS1ERFtUXUhIOm1tOnNzLlNTU1taXScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdE1vbWVudChtLCAnWVlZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTW1pdJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXQgKGlucHV0U3RyaW5nKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSBmb3JtYXRNb21lbnQodGhpcywgaW5wdXRTdHJpbmcgfHwgdXRpbHNfaG9va3NfX2hvb2tzLmRlZmF1bHRGb3JtYXQpO1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkucG9zdGZvcm1hdChvdXRwdXQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZyb20gKHRpbWUsIHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmFsaWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLmludmFsaWREYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNyZWF0ZV9fY3JlYXRlRHVyYXRpb24oe3RvOiB0aGlzLCBmcm9tOiB0aW1lfSkubG9jYWxlKHRoaXMubG9jYWxlKCkpLmh1bWFuaXplKCF3aXRob3V0U3VmZml4KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmcm9tTm93ICh3aXRob3V0U3VmZml4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZyb20obG9jYWxfX2NyZWF0ZUxvY2FsKCksIHdpdGhvdXRTdWZmaXgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvICh0aW1lLCB3aXRob3V0U3VmZml4KSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5pbnZhbGlkRGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjcmVhdGVfX2NyZWF0ZUR1cmF0aW9uKHtmcm9tOiB0aGlzLCB0bzogdGltZX0pLmxvY2FsZSh0aGlzLmxvY2FsZSgpKS5odW1hbml6ZSghd2l0aG91dFN1ZmZpeCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9Ob3cgKHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG8obG9jYWxfX2NyZWF0ZUxvY2FsKCksIHdpdGhvdXRTdWZmaXgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvY2FsZSAoa2V5KSB7XG4gICAgICAgIHZhciBuZXdMb2NhbGVEYXRhO1xuXG4gICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsZS5fYWJicjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0xvY2FsZURhdGEgPSBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlKGtleSk7XG4gICAgICAgICAgICBpZiAobmV3TG9jYWxlRGF0YSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9jYWxlID0gbmV3TG9jYWxlRGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxhbmcgPSBkZXByZWNhdGUoXG4gICAgICAgICdtb21lbnQoKS5sYW5nKCkgaXMgZGVwcmVjYXRlZC4gSW5zdGVhZCwgdXNlIG1vbWVudCgpLmxvY2FsZURhdGEoKSB0byBnZXQgdGhlIGxhbmd1YWdlIGNvbmZpZ3VyYXRpb24uIFVzZSBtb21lbnQoKS5sb2NhbGUoKSB0byBjaGFuZ2UgbGFuZ3VhZ2VzLicsXG4gICAgICAgIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlKGtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgZnVuY3Rpb24gbG9jYWxlRGF0YSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RhcnRPZiAodW5pdHMpIHtcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgIC8vIHRoZSBmb2xsb3dpbmcgc3dpdGNoIGludGVudGlvbmFsbHkgb21pdHMgYnJlYWsga2V5d29yZHNcbiAgICAgICAgLy8gdG8gdXRpbGl6ZSBmYWxsaW5nIHRocm91Z2ggdGhlIGNhc2VzLlxuICAgICAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgIGNhc2UgJ3llYXInOlxuICAgICAgICAgICAgdGhpcy5tb250aCgwKTtcbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAncXVhcnRlcic6XG4gICAgICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgICAgICAgIHRoaXMuZGF0ZSgxKTtcbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnd2Vlayc6XG4gICAgICAgIGNhc2UgJ2lzb1dlZWsnOlxuICAgICAgICBjYXNlICdkYXknOlxuICAgICAgICAgICAgdGhpcy5ob3VycygwKTtcbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnaG91cic6XG4gICAgICAgICAgICB0aGlzLm1pbnV0ZXMoMCk7XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ21pbnV0ZSc6XG4gICAgICAgICAgICB0aGlzLnNlY29uZHMoMCk7XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ3NlY29uZCc6XG4gICAgICAgICAgICB0aGlzLm1pbGxpc2Vjb25kcygwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdlZWtzIGFyZSBhIHNwZWNpYWwgY2FzZVxuICAgICAgICBpZiAodW5pdHMgPT09ICd3ZWVrJykge1xuICAgICAgICAgICAgdGhpcy53ZWVrZGF5KDApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1bml0cyA9PT0gJ2lzb1dlZWsnKSB7XG4gICAgICAgICAgICB0aGlzLmlzb1dlZWtkYXkoMSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBxdWFydGVycyBhcmUgYWxzbyBzcGVjaWFsXG4gICAgICAgIGlmICh1bml0cyA9PT0gJ3F1YXJ0ZXInKSB7XG4gICAgICAgICAgICB0aGlzLm1vbnRoKE1hdGguZmxvb3IodGhpcy5tb250aCgpIC8gMykgKiAzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVuZE9mICh1bml0cykge1xuICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgaWYgKHVuaXRzID09PSB1bmRlZmluZWQgfHwgdW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXJ0T2YodW5pdHMpLmFkZCgxLCAodW5pdHMgPT09ICdpc29XZWVrJyA/ICd3ZWVrJyA6IHVuaXRzKSkuc3VidHJhY3QoMSwgJ21zJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9fdHlwZV9fdmFsdWVPZiAoKSB7XG4gICAgICAgIHJldHVybiArdGhpcy5fZCAtICgodGhpcy5fb2Zmc2V0IHx8IDApICogNjAwMDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVuaXggKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigrdGhpcyAvIDEwMDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvRGF0ZSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vZmZzZXQgPyBuZXcgRGF0ZSgrdGhpcykgOiB0aGlzLl9kO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvQXJyYXkgKCkge1xuICAgICAgICB2YXIgbSA9IHRoaXM7XG4gICAgICAgIHJldHVybiBbbS55ZWFyKCksIG0ubW9udGgoKSwgbS5kYXRlKCksIG0uaG91cigpLCBtLm1pbnV0ZSgpLCBtLnNlY29uZCgpLCBtLm1pbGxpc2Vjb25kKCldO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvT2JqZWN0ICgpIHtcbiAgICAgICAgdmFyIG0gPSB0aGlzO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeWVhcnM6IG0ueWVhcigpLFxuICAgICAgICAgICAgbW9udGhzOiBtLm1vbnRoKCksXG4gICAgICAgICAgICBkYXRlOiBtLmRhdGUoKSxcbiAgICAgICAgICAgIGhvdXJzOiBtLmhvdXJzKCksXG4gICAgICAgICAgICBtaW51dGVzOiBtLm1pbnV0ZXMoKSxcbiAgICAgICAgICAgIHNlY29uZHM6IG0uc2Vjb25kcygpLFxuICAgICAgICAgICAgbWlsbGlzZWNvbmRzOiBtLm1pbGxpc2Vjb25kcygpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9tZW50X3ZhbGlkX19pc1ZhbGlkICgpIHtcbiAgICAgICAgcmV0dXJuIHZhbGlkX19pc1ZhbGlkKHRoaXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNpbmdGbGFncyAoKSB7XG4gICAgICAgIHJldHVybiBleHRlbmQoe30sIGdldFBhcnNpbmdGbGFncyh0aGlzKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW52YWxpZEF0ICgpIHtcbiAgICAgICAgcmV0dXJuIGdldFBhcnNpbmdGbGFncyh0aGlzKS5vdmVyZmxvdztcbiAgICB9XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ2dnJywgMl0sIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2Vla1llYXIoKSAlIDEwMDtcbiAgICB9KTtcblxuICAgIGFkZEZvcm1hdFRva2VuKDAsIFsnR0cnLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc29XZWVrWWVhcigpICUgMTAwO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gYWRkV2Vla1llYXJGb3JtYXRUb2tlbiAodG9rZW4sIGdldHRlcikge1xuICAgICAgICBhZGRGb3JtYXRUb2tlbigwLCBbdG9rZW4sIHRva2VuLmxlbmd0aF0sIDAsIGdldHRlcik7XG4gICAgfVxuXG4gICAgYWRkV2Vla1llYXJGb3JtYXRUb2tlbignZ2dnZycsICAgICAnd2Vla1llYXInKTtcbiAgICBhZGRXZWVrWWVhckZvcm1hdFRva2VuKCdnZ2dnZycsICAgICd3ZWVrWWVhcicpO1xuICAgIGFkZFdlZWtZZWFyRm9ybWF0VG9rZW4oJ0dHR0cnLCAgJ2lzb1dlZWtZZWFyJyk7XG4gICAgYWRkV2Vla1llYXJGb3JtYXRUb2tlbignR0dHR0cnLCAnaXNvV2Vla1llYXInKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnd2Vla1llYXInLCAnZ2cnKTtcbiAgICBhZGRVbml0QWxpYXMoJ2lzb1dlZWtZZWFyJywgJ0dHJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdHJywgICAgICBtYXRjaFNpZ25lZCk7XG4gICAgYWRkUmVnZXhUb2tlbignZycsICAgICAgbWF0Y2hTaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0dHJywgICAgIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdnZycsICAgICBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUmVnZXhUb2tlbignR0dHRycsICAgbWF0Y2gxdG80LCBtYXRjaDQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2dnZ2cnLCAgIG1hdGNoMXRvNCwgbWF0Y2g0KTtcbiAgICBhZGRSZWdleFRva2VuKCdHR0dHRycsICBtYXRjaDF0bzYsIG1hdGNoNik7XG4gICAgYWRkUmVnZXhUb2tlbignZ2dnZ2cnLCAgbWF0Y2gxdG82LCBtYXRjaDYpO1xuXG4gICAgYWRkV2Vla1BhcnNlVG9rZW4oWydnZ2dnJywgJ2dnZ2dnJywgJ0dHR0cnLCAnR0dHR0cnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHdlZWtbdG9rZW4uc3Vic3RyKDAsIDIpXSA9IHRvSW50KGlucHV0KTtcbiAgICB9KTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsnZ2cnLCAnR0cnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcsIHRva2VuKSB7XG4gICAgICAgIHdlZWtbdG9rZW5dID0gdXRpbHNfaG9va3NfX2hvb2tzLnBhcnNlVHdvRGlnaXRZZWFyKGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIGZ1bmN0aW9uIHdlZWtzSW5ZZWFyKHllYXIsIGRvdywgZG95KSB7XG4gICAgICAgIHJldHVybiB3ZWVrT2ZZZWFyKGxvY2FsX19jcmVhdGVMb2NhbChbeWVhciwgMTEsIDMxICsgZG93IC0gZG95XSksIGRvdywgZG95KS53ZWVrO1xuICAgIH1cblxuICAgIC8vIE1PTUVOVFNcblxuICAgIGZ1bmN0aW9uIGdldFNldFdlZWtZZWFyIChpbnB1dCkge1xuICAgICAgICB2YXIgeWVhciA9IHdlZWtPZlllYXIodGhpcywgdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWsuZG93LCB0aGlzLmxvY2FsZURhdGEoKS5fd2Vlay5kb3kpLnllYXI7XG4gICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8geWVhciA6IHRoaXMuYWRkKChpbnB1dCAtIHllYXIpLCAneScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFNldElTT1dlZWtZZWFyIChpbnB1dCkge1xuICAgICAgICB2YXIgeWVhciA9IHdlZWtPZlllYXIodGhpcywgMSwgNCkueWVhcjtcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB5ZWFyIDogdGhpcy5hZGQoKGlucHV0IC0geWVhciksICd5Jyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0SVNPV2Vla3NJblllYXIgKCkge1xuICAgICAgICByZXR1cm4gd2Vla3NJblllYXIodGhpcy55ZWFyKCksIDEsIDQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFdlZWtzSW5ZZWFyICgpIHtcbiAgICAgICAgdmFyIHdlZWtJbmZvID0gdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWs7XG4gICAgICAgIHJldHVybiB3ZWVrc0luWWVhcih0aGlzLnllYXIoKSwgd2Vla0luZm8uZG93LCB3ZWVrSW5mby5kb3kpO1xuICAgIH1cblxuICAgIGFkZEZvcm1hdFRva2VuKCdRJywgMCwgMCwgJ3F1YXJ0ZXInKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygncXVhcnRlcicsICdRJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdRJywgbWF0Y2gxKTtcbiAgICBhZGRQYXJzZVRva2VuKCdRJywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtNT05USF0gPSAodG9JbnQoaW5wdXQpIC0gMSkgKiAzO1xuICAgIH0pO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0UXVhcnRlciAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyBNYXRoLmNlaWwoKHRoaXMubW9udGgoKSArIDEpIC8gMykgOiB0aGlzLm1vbnRoKChpbnB1dCAtIDEpICogMyArIHRoaXMubW9udGgoKSAlIDMpO1xuICAgIH1cblxuICAgIGFkZEZvcm1hdFRva2VuKCdEJywgWydERCcsIDJdLCAnRG8nLCAnZGF0ZScpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdkYXRlJywgJ0QnKTtcblxuICAgIC8vIFBBUlNJTkdcblxuICAgIGFkZFJlZ2V4VG9rZW4oJ0QnLCAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdERCcsIG1hdGNoMXRvMiwgbWF0Y2gyKTtcbiAgICBhZGRSZWdleFRva2VuKCdEbycsIGZ1bmN0aW9uIChpc1N0cmljdCwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBpc1N0cmljdCA/IGxvY2FsZS5fb3JkaW5hbFBhcnNlIDogbG9jYWxlLl9vcmRpbmFsUGFyc2VMZW5pZW50O1xuICAgIH0pO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ0QnLCAnREQnXSwgREFURSk7XG4gICAgYWRkUGFyc2VUb2tlbignRG8nLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5KSB7XG4gICAgICAgIGFycmF5W0RBVEVdID0gdG9JbnQoaW5wdXQubWF0Y2gobWF0Y2gxdG8yKVswXSwgMTApO1xuICAgIH0pO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgdmFyIGdldFNldERheU9mTW9udGggPSBtYWtlR2V0U2V0KCdEYXRlJywgdHJ1ZSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignZCcsIDAsICdkbycsICdkYXknKTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdkZCcsIDAsIDAsIGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLndlZWtkYXlzTWluKHRoaXMsIGZvcm1hdCk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignZGRkJywgMCwgMCwgZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkud2Vla2RheXNTaG9ydCh0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2RkZGQnLCAwLCAwLCBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS53ZWVrZGF5cyh0aGlzLCBmb3JtYXQpO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ2UnLCAwLCAwLCAnd2Vla2RheScpO1xuICAgIGFkZEZvcm1hdFRva2VuKCdFJywgMCwgMCwgJ2lzb1dlZWtkYXknKTtcblxuICAgIC8vIEFMSUFTRVNcblxuICAgIGFkZFVuaXRBbGlhcygnZGF5JywgJ2QnKTtcbiAgICBhZGRVbml0QWxpYXMoJ3dlZWtkYXknLCAnZScpO1xuICAgIGFkZFVuaXRBbGlhcygnaXNvV2Vla2RheScsICdFJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdkJywgICAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdlJywgICAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdFJywgICAgbWF0Y2gxdG8yKTtcbiAgICBhZGRSZWdleFRva2VuKCdkZCcsICAgbWF0Y2hXb3JkKTtcbiAgICBhZGRSZWdleFRva2VuKCdkZGQnLCAgbWF0Y2hXb3JkKTtcbiAgICBhZGRSZWdleFRva2VuKCdkZGRkJywgbWF0Y2hXb3JkKTtcblxuICAgIGFkZFdlZWtQYXJzZVRva2VuKFsnZGQnLCAnZGRkJywgJ2RkZGQnXSwgZnVuY3Rpb24gKGlucHV0LCB3ZWVrLCBjb25maWcpIHtcbiAgICAgICAgdmFyIHdlZWtkYXkgPSBjb25maWcuX2xvY2FsZS53ZWVrZGF5c1BhcnNlKGlucHV0KTtcbiAgICAgICAgLy8gaWYgd2UgZGlkbid0IGdldCBhIHdlZWtkYXkgbmFtZSwgbWFyayB0aGUgZGF0ZSBhcyBpbnZhbGlkXG4gICAgICAgIGlmICh3ZWVrZGF5ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHdlZWsuZCA9IHdlZWtkYXk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnZXRQYXJzaW5nRmxhZ3MoY29uZmlnKS5pbnZhbGlkV2Vla2RheSA9IGlucHV0O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBhZGRXZWVrUGFyc2VUb2tlbihbJ2QnLCAnZScsICdFJ10sIGZ1bmN0aW9uIChpbnB1dCwgd2VlaywgY29uZmlnLCB0b2tlbikge1xuICAgICAgICB3ZWVrW3Rva2VuXSA9IHRvSW50KGlucHV0KTtcbiAgICB9KTtcblxuICAgIC8vIEhFTFBFUlNcblxuICAgIGZ1bmN0aW9uIHBhcnNlV2Vla2RheShpbnB1dCwgbG9jYWxlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzTmFOKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KGlucHV0LCAxMCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbnB1dCA9IGxvY2FsZS53ZWVrZGF5c1BhcnNlKGlucHV0KTtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIExPQ0FMRVNcblxuICAgIHZhciBkZWZhdWx0TG9jYWxlV2Vla2RheXMgPSAnU3VuZGF5X01vbmRheV9UdWVzZGF5X1dlZG5lc2RheV9UaHVyc2RheV9GcmlkYXlfU2F0dXJkYXknLnNwbGl0KCdfJyk7XG4gICAgZnVuY3Rpb24gbG9jYWxlV2Vla2RheXMgKG0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzW20uZGF5KCldO1xuICAgIH1cblxuICAgIHZhciBkZWZhdWx0TG9jYWxlV2Vla2RheXNTaG9ydCA9ICdTdW5fTW9uX1R1ZV9XZWRfVGh1X0ZyaV9TYXQnLnNwbGl0KCdfJyk7XG4gICAgZnVuY3Rpb24gbG9jYWxlV2Vla2RheXNTaG9ydCAobSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNTaG9ydFttLmRheSgpXTtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvY2FsZVdlZWtkYXlzTWluID0gJ1N1X01vX1R1X1dlX1RoX0ZyX1NhJy5zcGxpdCgnXycpO1xuICAgIGZ1bmN0aW9uIGxvY2FsZVdlZWtkYXlzTWluIChtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c01pblttLmRheSgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVXZWVrZGF5c1BhcnNlICh3ZWVrZGF5TmFtZSkge1xuICAgICAgICB2YXIgaSwgbW9tLCByZWdleDtcblxuICAgICAgICB0aGlzLl93ZWVrZGF5c1BhcnNlID0gdGhpcy5fd2Vla2RheXNQYXJzZSB8fCBbXTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcbiAgICAgICAgICAgIGlmICghdGhpcy5fd2Vla2RheXNQYXJzZVtpXSkge1xuICAgICAgICAgICAgICAgIG1vbSA9IGxvY2FsX19jcmVhdGVMb2NhbChbMjAwMCwgMV0pLmRheShpKTtcbiAgICAgICAgICAgICAgICByZWdleCA9ICdeJyArIHRoaXMud2Vla2RheXMobW9tLCAnJykgKyAnfF4nICsgdGhpcy53ZWVrZGF5c1Nob3J0KG1vbSwgJycpICsgJ3xeJyArIHRoaXMud2Vla2RheXNNaW4obW9tLCAnJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNQYXJzZVtpXSA9IG5ldyBSZWdFeHAocmVnZXgucmVwbGFjZSgnLicsICcnKSwgJ2knKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRlc3QgdGhlIHJlZ2V4XG4gICAgICAgICAgICBpZiAodGhpcy5fd2Vla2RheXNQYXJzZVtpXS50ZXN0KHdlZWtkYXlOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0U2V0RGF5T2ZXZWVrIChpbnB1dCkge1xuICAgICAgICB2YXIgZGF5ID0gdGhpcy5faXNVVEMgPyB0aGlzLl9kLmdldFVUQ0RheSgpIDogdGhpcy5fZC5nZXREYXkoKTtcbiAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlucHV0ID0gcGFyc2VXZWVrZGF5KGlucHV0LCB0aGlzLmxvY2FsZURhdGEoKSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hZGQoaW5wdXQgLSBkYXksICdkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZGF5O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0TG9jYWxlRGF5T2ZXZWVrIChpbnB1dCkge1xuICAgICAgICB2YXIgd2Vla2RheSA9ICh0aGlzLmRheSgpICsgNyAtIHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrLmRvdykgJSA3O1xuICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWtkYXkgOiB0aGlzLmFkZChpbnB1dCAtIHdlZWtkYXksICdkJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2V0SVNPRGF5T2ZXZWVrIChpbnB1dCkge1xuICAgICAgICAvLyBiZWhhdmVzIHRoZSBzYW1lIGFzIG1vbWVudCNkYXkgZXhjZXB0XG4gICAgICAgIC8vIGFzIGEgZ2V0dGVyLCByZXR1cm5zIDcgaW5zdGVhZCBvZiAwICgxLTcgcmFuZ2UgaW5zdGVhZCBvZiAwLTYpXG4gICAgICAgIC8vIGFzIGEgc2V0dGVyLCBzdW5kYXkgc2hvdWxkIGJlbG9uZyB0byB0aGUgcHJldmlvdXMgd2Vlay5cbiAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB0aGlzLmRheSgpIHx8IDcgOiB0aGlzLmRheSh0aGlzLmRheSgpICUgNyA/IGlucHV0IDogaW5wdXQgLSA3KTtcbiAgICB9XG5cbiAgICBhZGRGb3JtYXRUb2tlbignSCcsIFsnSEgnLCAyXSwgMCwgJ2hvdXInKTtcbiAgICBhZGRGb3JtYXRUb2tlbignaCcsIFsnaGgnLCAyXSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ob3VycygpICUgMTIgfHwgMTI7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBtZXJpZGllbSAodG9rZW4sIGxvd2VyY2FzZSkge1xuICAgICAgICBhZGRGb3JtYXRUb2tlbih0b2tlbiwgMCwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm1lcmlkaWVtKHRoaXMuaG91cnMoKSwgdGhpcy5taW51dGVzKCksIGxvd2VyY2FzZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG1lcmlkaWVtKCdhJywgdHJ1ZSk7XG4gICAgbWVyaWRpZW0oJ0EnLCBmYWxzZSk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ2hvdXInLCAnaCcpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgZnVuY3Rpb24gbWF0Y2hNZXJpZGllbSAoaXNTdHJpY3QsIGxvY2FsZSkge1xuICAgICAgICByZXR1cm4gbG9jYWxlLl9tZXJpZGllbVBhcnNlO1xuICAgIH1cblxuICAgIGFkZFJlZ2V4VG9rZW4oJ2EnLCAgbWF0Y2hNZXJpZGllbSk7XG4gICAgYWRkUmVnZXhUb2tlbignQScsICBtYXRjaE1lcmlkaWVtKTtcbiAgICBhZGRSZWdleFRva2VuKCdIJywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignaCcsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ0hIJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ2hoJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuXG4gICAgYWRkUGFyc2VUb2tlbihbJ0gnLCAnSEgnXSwgSE9VUik7XG4gICAgYWRkUGFyc2VUb2tlbihbJ2EnLCAnQSddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl9pc1BtID0gY29uZmlnLl9sb2NhbGUuaXNQTShpbnB1dCk7XG4gICAgICAgIGNvbmZpZy5fbWVyaWRpZW0gPSBpbnB1dDtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKFsnaCcsICdoaCddLCBmdW5jdGlvbiAoaW5wdXQsIGFycmF5LCBjb25maWcpIHtcbiAgICAgICAgYXJyYXlbSE9VUl0gPSB0b0ludChpbnB1dCk7XG4gICAgICAgIGdldFBhcnNpbmdGbGFncyhjb25maWcpLmJpZ0hvdXIgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgLy8gTE9DQUxFU1xuXG4gICAgZnVuY3Rpb24gbG9jYWxlSXNQTSAoaW5wdXQpIHtcbiAgICAgICAgLy8gSUU4IFF1aXJrcyBNb2RlICYgSUU3IFN0YW5kYXJkcyBNb2RlIGRvIG5vdCBhbGxvdyBhY2Nlc3Npbmcgc3RyaW5ncyBsaWtlIGFycmF5c1xuICAgICAgICAvLyBVc2luZyBjaGFyQXQgc2hvdWxkIGJlIG1vcmUgY29tcGF0aWJsZS5cbiAgICAgICAgcmV0dXJuICgoaW5wdXQgKyAnJykudG9Mb3dlckNhc2UoKS5jaGFyQXQoMCkgPT09ICdwJyk7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRMb2NhbGVNZXJpZGllbVBhcnNlID0gL1thcF1cXC4/bT9cXC4/L2k7XG4gICAgZnVuY3Rpb24gbG9jYWxlTWVyaWRpZW0gKGhvdXJzLCBtaW51dGVzLCBpc0xvd2VyKSB7XG4gICAgICAgIGlmIChob3VycyA+IDExKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNMb3dlciA/ICdwbScgOiAnUE0nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGlzTG93ZXIgPyAnYW0nIDogJ0FNJztcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgLy8gU2V0dGluZyB0aGUgaG91ciBzaG91bGQga2VlcCB0aGUgdGltZSwgYmVjYXVzZSB0aGUgdXNlciBleHBsaWNpdGx5XG4gICAgLy8gc3BlY2lmaWVkIHdoaWNoIGhvdXIgaGUgd2FudHMuIFNvIHRyeWluZyB0byBtYWludGFpbiB0aGUgc2FtZSBob3VyIChpblxuICAgIC8vIGEgbmV3IHRpbWV6b25lKSBtYWtlcyBzZW5zZS4gQWRkaW5nL3N1YnRyYWN0aW5nIGhvdXJzIGRvZXMgbm90IGZvbGxvd1xuICAgIC8vIHRoaXMgcnVsZS5cbiAgICB2YXIgZ2V0U2V0SG91ciA9IG1ha2VHZXRTZXQoJ0hvdXJzJywgdHJ1ZSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbignbScsIFsnbW0nLCAyXSwgMCwgJ21pbnV0ZScpO1xuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdtaW51dGUnLCAnbScpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignbScsICBtYXRjaDF0bzIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ21tJywgbWF0Y2gxdG8yLCBtYXRjaDIpO1xuICAgIGFkZFBhcnNlVG9rZW4oWydtJywgJ21tJ10sIE1JTlVURSk7XG5cbiAgICAvLyBNT01FTlRTXG5cbiAgICB2YXIgZ2V0U2V0TWludXRlID0gbWFrZUdldFNldCgnTWludXRlcycsIGZhbHNlKTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCdzJywgWydzcycsIDJdLCAwLCAnc2Vjb25kJyk7XG5cbiAgICAvLyBBTElBU0VTXG5cbiAgICBhZGRVbml0QWxpYXMoJ3NlY29uZCcsICdzJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCdzJywgIG1hdGNoMXRvMik7XG4gICAgYWRkUmVnZXhUb2tlbignc3MnLCBtYXRjaDF0bzIsIG1hdGNoMik7XG4gICAgYWRkUGFyc2VUb2tlbihbJ3MnLCAnc3MnXSwgU0VDT05EKTtcblxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXRTZWNvbmQgPSBtYWtlR2V0U2V0KCdTZWNvbmRzJywgZmFsc2UpO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oJ1MnLCAwLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB+fih0aGlzLm1pbGxpc2Vjb25kKCkgLyAxMDApO1xuICAgIH0pO1xuXG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTUycsIDJdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB+fih0aGlzLm1pbGxpc2Vjb25kKCkgLyAxMCk7XG4gICAgfSk7XG5cbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTUycsIDNdLCAwLCAnbWlsbGlzZWNvbmQnKTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1MnLCA0XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTA7XG4gICAgfSk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTUycsIDVdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDA7XG4gICAgfSk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTU1MnLCA2XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwMDtcbiAgICB9KTtcbiAgICBhZGRGb3JtYXRUb2tlbigwLCBbJ1NTU1NTU1MnLCA3XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwMDA7XG4gICAgfSk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTU1NTUycsIDhdLCAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbGxpc2Vjb25kKCkgKiAxMDAwMDA7XG4gICAgfSk7XG4gICAgYWRkRm9ybWF0VG9rZW4oMCwgWydTU1NTU1NTU1MnLCA5XSwgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5taWxsaXNlY29uZCgpICogMTAwMDAwMDtcbiAgICB9KTtcblxuXG4gICAgLy8gQUxJQVNFU1xuXG4gICAgYWRkVW5pdEFsaWFzKCdtaWxsaXNlY29uZCcsICdtcycpO1xuXG4gICAgLy8gUEFSU0lOR1xuXG4gICAgYWRkUmVnZXhUb2tlbignUycsICAgIG1hdGNoMXRvMywgbWF0Y2gxKTtcbiAgICBhZGRSZWdleFRva2VuKCdTUycsICAgbWF0Y2gxdG8zLCBtYXRjaDIpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1NTUycsICBtYXRjaDF0bzMsIG1hdGNoMyk7XG5cbiAgICB2YXIgdG9rZW47XG4gICAgZm9yICh0b2tlbiA9ICdTU1NTJzsgdG9rZW4ubGVuZ3RoIDw9IDk7IHRva2VuICs9ICdTJykge1xuICAgICAgICBhZGRSZWdleFRva2VuKHRva2VuLCBtYXRjaFVuc2lnbmVkKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZU1zKGlucHV0LCBhcnJheSkge1xuICAgICAgICBhcnJheVtNSUxMSVNFQ09ORF0gPSB0b0ludCgoJzAuJyArIGlucHV0KSAqIDEwMDApO1xuICAgIH1cblxuICAgIGZvciAodG9rZW4gPSAnUyc7IHRva2VuLmxlbmd0aCA8PSA5OyB0b2tlbiArPSAnUycpIHtcbiAgICAgICAgYWRkUGFyc2VUb2tlbih0b2tlbiwgcGFyc2VNcyk7XG4gICAgfVxuICAgIC8vIE1PTUVOVFNcblxuICAgIHZhciBnZXRTZXRNaWxsaXNlY29uZCA9IG1ha2VHZXRTZXQoJ01pbGxpc2Vjb25kcycsIGZhbHNlKTtcblxuICAgIGFkZEZvcm1hdFRva2VuKCd6JywgIDAsIDAsICd6b25lQWJicicpO1xuICAgIGFkZEZvcm1hdFRva2VuKCd6eicsIDAsIDAsICd6b25lTmFtZScpO1xuXG4gICAgLy8gTU9NRU5UU1xuXG4gICAgZnVuY3Rpb24gZ2V0Wm9uZUFiYnIgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgPyAnVVRDJyA6ICcnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFpvbmVOYW1lICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gJ0Nvb3JkaW5hdGVkIFVuaXZlcnNhbCBUaW1lJyA6ICcnO1xuICAgIH1cblxuICAgIHZhciBtb21lbnRQcm90b3R5cGVfX3Byb3RvID0gTW9tZW50LnByb3RvdHlwZTtcblxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uYWRkICAgICAgICAgID0gYWRkX3N1YnRyYWN0X19hZGQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5jYWxlbmRhciAgICAgPSBtb21lbnRfY2FsZW5kYXJfX2NhbGVuZGFyO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uY2xvbmUgICAgICAgID0gY2xvbmU7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5kaWZmICAgICAgICAgPSBkaWZmO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZW5kT2YgICAgICAgID0gZW5kT2Y7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5mb3JtYXQgICAgICAgPSBmb3JtYXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5mcm9tICAgICAgICAgPSBmcm9tO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZnJvbU5vdyAgICAgID0gZnJvbU5vdztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnRvICAgICAgICAgICA9IHRvO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udG9Ob3cgICAgICAgID0gdG9Ob3c7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5nZXQgICAgICAgICAgPSBnZXRTZXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pbnZhbGlkQXQgICAgPSBpbnZhbGlkQXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc0FmdGVyICAgICAgPSBpc0FmdGVyO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNCZWZvcmUgICAgID0gaXNCZWZvcmU7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc0JldHdlZW4gICAgPSBpc0JldHdlZW47XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc1NhbWUgICAgICAgPSBpc1NhbWU7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc1ZhbGlkICAgICAgPSBtb21lbnRfdmFsaWRfX2lzVmFsaWQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5sYW5nICAgICAgICAgPSBsYW5nO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubG9jYWxlICAgICAgID0gbG9jYWxlO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubG9jYWxlRGF0YSAgID0gbG9jYWxlRGF0YTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLm1heCAgICAgICAgICA9IHByb3RvdHlwZU1heDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLm1pbiAgICAgICAgICA9IHByb3RvdHlwZU1pbjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnBhcnNpbmdGbGFncyA9IHBhcnNpbmdGbGFncztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnNldCAgICAgICAgICA9IGdldFNldDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnN0YXJ0T2YgICAgICA9IHN0YXJ0T2Y7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5zdWJ0cmFjdCAgICAgPSBhZGRfc3VidHJhY3RfX3N1YnRyYWN0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udG9BcnJheSAgICAgID0gdG9BcnJheTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnRvT2JqZWN0ICAgICA9IHRvT2JqZWN0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udG9EYXRlICAgICAgID0gdG9EYXRlO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udG9JU09TdHJpbmcgID0gbW9tZW50X2Zvcm1hdF9fdG9JU09TdHJpbmc7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by50b0pTT04gICAgICAgPSBtb21lbnRfZm9ybWF0X190b0lTT1N0cmluZztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnRvU3RyaW5nICAgICA9IHRvU3RyaW5nO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udW5peCAgICAgICAgID0gdW5peDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnZhbHVlT2YgICAgICA9IHRvX3R5cGVfX3ZhbHVlT2Y7XG5cbiAgICAvLyBZZWFyXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by55ZWFyICAgICAgID0gZ2V0U2V0WWVhcjtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzTGVhcFllYXIgPSBnZXRJc0xlYXBZZWFyO1xuXG4gICAgLy8gV2VlayBZZWFyXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by53ZWVrWWVhciAgICA9IGdldFNldFdlZWtZZWFyO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNvV2Vla1llYXIgPSBnZXRTZXRJU09XZWVrWWVhcjtcblxuICAgIC8vIFF1YXJ0ZXJcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnF1YXJ0ZXIgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnF1YXJ0ZXJzID0gZ2V0U2V0UXVhcnRlcjtcblxuICAgIC8vIE1vbnRoXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5tb250aCAgICAgICA9IGdldFNldE1vbnRoO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZGF5c0luTW9udGggPSBnZXREYXlzSW5Nb250aDtcblxuICAgIC8vIFdlZWtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLndlZWsgICAgICAgICAgID0gbW9tZW50UHJvdG90eXBlX19wcm90by53ZWVrcyAgICAgICAgPSBnZXRTZXRXZWVrO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNvV2VlayAgICAgICAgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzb1dlZWtzICAgICA9IGdldFNldElTT1dlZWs7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by53ZWVrc0luWWVhciAgICA9IGdldFdlZWtzSW5ZZWFyO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNvV2Vla3NJblllYXIgPSBnZXRJU09XZWVrc0luWWVhcjtcblxuICAgIC8vIERheVxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uZGF0ZSAgICAgICA9IGdldFNldERheU9mTW9udGg7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5kYXkgICAgICAgID0gbW9tZW50UHJvdG90eXBlX19wcm90by5kYXlzICAgICAgICAgICAgID0gZ2V0U2V0RGF5T2ZXZWVrO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8ud2Vla2RheSAgICA9IGdldFNldExvY2FsZURheU9mV2VlaztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzb1dlZWtkYXkgPSBnZXRTZXRJU09EYXlPZldlZWs7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5kYXlPZlllYXIgID0gZ2V0U2V0RGF5T2ZZZWFyO1xuXG4gICAgLy8gSG91clxuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaG91ciA9IG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaG91cnMgPSBnZXRTZXRIb3VyO1xuXG4gICAgLy8gTWludXRlXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5taW51dGUgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvLm1pbnV0ZXMgPSBnZXRTZXRNaW51dGU7XG5cbiAgICAvLyBTZWNvbmRcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnNlY29uZCA9IG1vbWVudFByb3RvdHlwZV9fcHJvdG8uc2Vjb25kcyA9IGdldFNldFNlY29uZDtcblxuICAgIC8vIE1pbGxpc2Vjb25kXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5taWxsaXNlY29uZCA9IG1vbWVudFByb3RvdHlwZV9fcHJvdG8ubWlsbGlzZWNvbmRzID0gZ2V0U2V0TWlsbGlzZWNvbmQ7XG5cbiAgICAvLyBPZmZzZXRcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnV0Y09mZnNldCAgICAgICAgICAgID0gZ2V0U2V0T2Zmc2V0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8udXRjICAgICAgICAgICAgICAgICAgPSBzZXRPZmZzZXRUb1VUQztcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmxvY2FsICAgICAgICAgICAgICAgID0gc2V0T2Zmc2V0VG9Mb2NhbDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnBhcnNlWm9uZSAgICAgICAgICAgID0gc2V0T2Zmc2V0VG9QYXJzZWRPZmZzZXQ7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5oYXNBbGlnbmVkSG91ck9mZnNldCA9IGhhc0FsaWduZWRIb3VyT2Zmc2V0O1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNEU1QgICAgICAgICAgICAgICAgPSBpc0RheWxpZ2h0U2F2aW5nVGltZTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzRFNUU2hpZnRlZCAgICAgICAgID0gaXNEYXlsaWdodFNhdmluZ1RpbWVTaGlmdGVkO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNMb2NhbCAgICAgICAgICAgICAgPSBpc0xvY2FsO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uaXNVdGNPZmZzZXQgICAgICAgICAgPSBpc1V0Y09mZnNldDtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLmlzVXRjICAgICAgICAgICAgICAgID0gaXNVdGM7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5pc1VUQyAgICAgICAgICAgICAgICA9IGlzVXRjO1xuXG4gICAgLy8gVGltZXpvbmVcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnpvbmVBYmJyID0gZ2V0Wm9uZUFiYnI7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by56b25lTmFtZSA9IGdldFpvbmVOYW1lO1xuXG4gICAgLy8gRGVwcmVjYXRpb25zXG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5kYXRlcyAgPSBkZXByZWNhdGUoJ2RhdGVzIGFjY2Vzc29yIGlzIGRlcHJlY2F0ZWQuIFVzZSBkYXRlIGluc3RlYWQuJywgZ2V0U2V0RGF5T2ZNb250aCk7XG4gICAgbW9tZW50UHJvdG90eXBlX19wcm90by5tb250aHMgPSBkZXByZWNhdGUoJ21vbnRocyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgbW9udGggaW5zdGVhZCcsIGdldFNldE1vbnRoKTtcbiAgICBtb21lbnRQcm90b3R5cGVfX3Byb3RvLnllYXJzICA9IGRlcHJlY2F0ZSgneWVhcnMgYWNjZXNzb3IgaXMgZGVwcmVjYXRlZC4gVXNlIHllYXIgaW5zdGVhZCcsIGdldFNldFllYXIpO1xuICAgIG1vbWVudFByb3RvdHlwZV9fcHJvdG8uem9uZSAgID0gZGVwcmVjYXRlKCdtb21lbnQoKS56b25lIGlzIGRlcHJlY2F0ZWQsIHVzZSBtb21lbnQoKS51dGNPZmZzZXQgaW5zdGVhZC4gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE3NzknLCBnZXRTZXRab25lKTtcblxuICAgIHZhciBtb21lbnRQcm90b3R5cGUgPSBtb21lbnRQcm90b3R5cGVfX3Byb3RvO1xuXG4gICAgZnVuY3Rpb24gbW9tZW50X19jcmVhdGVVbml4IChpbnB1dCkge1xuICAgICAgICByZXR1cm4gbG9jYWxfX2NyZWF0ZUxvY2FsKGlucHV0ICogMTAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9tZW50X19jcmVhdGVJblpvbmUgKCkge1xuICAgICAgICByZXR1cm4gbG9jYWxfX2NyZWF0ZUxvY2FsLmFwcGx5KG51bGwsIGFyZ3VtZW50cykucGFyc2Vab25lKCk7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRDYWxlbmRhciA9IHtcbiAgICAgICAgc2FtZURheSA6ICdbVG9kYXkgYXRdIExUJyxcbiAgICAgICAgbmV4dERheSA6ICdbVG9tb3Jyb3cgYXRdIExUJyxcbiAgICAgICAgbmV4dFdlZWsgOiAnZGRkZCBbYXRdIExUJyxcbiAgICAgICAgbGFzdERheSA6ICdbWWVzdGVyZGF5IGF0XSBMVCcsXG4gICAgICAgIGxhc3RXZWVrIDogJ1tMYXN0XSBkZGRkIFthdF0gTFQnLFxuICAgICAgICBzYW1lRWxzZSA6ICdMJ1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsb2NhbGVfY2FsZW5kYXJfX2NhbGVuZGFyIChrZXksIG1vbSwgbm93KSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9jYWxlbmRhcltrZXldO1xuICAgICAgICByZXR1cm4gdHlwZW9mIG91dHB1dCA9PT0gJ2Z1bmN0aW9uJyA/IG91dHB1dC5jYWxsKG1vbSwgbm93KSA6IG91dHB1dDtcbiAgICB9XG5cbiAgICB2YXIgZGVmYXVsdExvbmdEYXRlRm9ybWF0ID0ge1xuICAgICAgICBMVFMgIDogJ2g6bW06c3MgQScsXG4gICAgICAgIExUICAgOiAnaDptbSBBJyxcbiAgICAgICAgTCAgICA6ICdNTS9ERC9ZWVlZJyxcbiAgICAgICAgTEwgICA6ICdNTU1NIEQsIFlZWVknLFxuICAgICAgICBMTEwgIDogJ01NTU0gRCwgWVlZWSBoOm1tIEEnLFxuICAgICAgICBMTExMIDogJ2RkZGQsIE1NTU0gRCwgWVlZWSBoOm1tIEEnXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxvbmdEYXRlRm9ybWF0IChrZXkpIHtcbiAgICAgICAgdmFyIGZvcm1hdCA9IHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleV0sXG4gICAgICAgICAgICBmb3JtYXRVcHBlciA9IHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleS50b1VwcGVyQ2FzZSgpXTtcblxuICAgICAgICBpZiAoZm9ybWF0IHx8ICFmb3JtYXRVcHBlcikge1xuICAgICAgICAgICAgcmV0dXJuIGZvcm1hdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleV0gPSBmb3JtYXRVcHBlci5yZXBsYWNlKC9NTU1NfE1NfEREfGRkZGQvZywgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbC5zbGljZSgxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleV07XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRJbnZhbGlkRGF0ZSA9ICdJbnZhbGlkIGRhdGUnO1xuXG4gICAgZnVuY3Rpb24gaW52YWxpZERhdGUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52YWxpZERhdGU7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRPcmRpbmFsID0gJyVkJztcbiAgICB2YXIgZGVmYXVsdE9yZGluYWxQYXJzZSA9IC9cXGR7MSwyfS87XG5cbiAgICBmdW5jdGlvbiBvcmRpbmFsIChudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29yZGluYWwucmVwbGFjZSgnJWQnLCBudW1iZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByZVBhcnNlUG9zdEZvcm1hdCAoc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgfVxuXG4gICAgdmFyIGRlZmF1bHRSZWxhdGl2ZVRpbWUgPSB7XG4gICAgICAgIGZ1dHVyZSA6ICdpbiAlcycsXG4gICAgICAgIHBhc3QgICA6ICclcyBhZ28nLFxuICAgICAgICBzICA6ICdhIGZldyBzZWNvbmRzJyxcbiAgICAgICAgbSAgOiAnYSBtaW51dGUnLFxuICAgICAgICBtbSA6ICclZCBtaW51dGVzJyxcbiAgICAgICAgaCAgOiAnYW4gaG91cicsXG4gICAgICAgIGhoIDogJyVkIGhvdXJzJyxcbiAgICAgICAgZCAgOiAnYSBkYXknLFxuICAgICAgICBkZCA6ICclZCBkYXlzJyxcbiAgICAgICAgTSAgOiAnYSBtb250aCcsXG4gICAgICAgIE1NIDogJyVkIG1vbnRocycsXG4gICAgICAgIHkgIDogJ2EgeWVhcicsXG4gICAgICAgIHl5IDogJyVkIHllYXJzJ1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiByZWxhdGl2ZV9fcmVsYXRpdmVUaW1lIChudW1iZXIsIHdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpIHtcbiAgICAgICAgdmFyIG91dHB1dCA9IHRoaXMuX3JlbGF0aXZlVGltZVtzdHJpbmddO1xuICAgICAgICByZXR1cm4gKHR5cGVvZiBvdXRwdXQgPT09ICdmdW5jdGlvbicpID9cbiAgICAgICAgICAgIG91dHB1dChudW1iZXIsIHdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpIDpcbiAgICAgICAgICAgIG91dHB1dC5yZXBsYWNlKC8lZC9pLCBudW1iZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhc3RGdXR1cmUgKGRpZmYsIG91dHB1dCkge1xuICAgICAgICB2YXIgZm9ybWF0ID0gdGhpcy5fcmVsYXRpdmVUaW1lW2RpZmYgPiAwID8gJ2Z1dHVyZScgOiAncGFzdCddO1xuICAgICAgICByZXR1cm4gdHlwZW9mIGZvcm1hdCA9PT0gJ2Z1bmN0aW9uJyA/IGZvcm1hdChvdXRwdXQpIDogZm9ybWF0LnJlcGxhY2UoLyVzL2ksIG91dHB1dCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9jYWxlX3NldF9fc2V0IChjb25maWcpIHtcbiAgICAgICAgdmFyIHByb3AsIGk7XG4gICAgICAgIGZvciAoaSBpbiBjb25maWcpIHtcbiAgICAgICAgICAgIHByb3AgPSBjb25maWdbaV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIHByb3AgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB0aGlzW2ldID0gcHJvcDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpc1snXycgKyBpXSA9IHByb3A7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gTGVuaWVudCBvcmRpbmFsIHBhcnNpbmcgYWNjZXB0cyBqdXN0IGEgbnVtYmVyIGluIGFkZGl0aW9uIHRvXG4gICAgICAgIC8vIG51bWJlciArIChwb3NzaWJseSkgc3R1ZmYgY29taW5nIGZyb20gX29yZGluYWxQYXJzZUxlbmllbnQuXG4gICAgICAgIHRoaXMuX29yZGluYWxQYXJzZUxlbmllbnQgPSBuZXcgUmVnRXhwKHRoaXMuX29yZGluYWxQYXJzZS5zb3VyY2UgKyAnfCcgKyAoL1xcZHsxLDJ9Lykuc291cmNlKTtcbiAgICB9XG5cbiAgICB2YXIgcHJvdG90eXBlX19wcm90byA9IExvY2FsZS5wcm90b3R5cGU7XG5cbiAgICBwcm90b3R5cGVfX3Byb3RvLl9jYWxlbmRhciAgICAgICA9IGRlZmF1bHRDYWxlbmRhcjtcbiAgICBwcm90b3R5cGVfX3Byb3RvLmNhbGVuZGFyICAgICAgICA9IGxvY2FsZV9jYWxlbmRhcl9fY2FsZW5kYXI7XG4gICAgcHJvdG90eXBlX19wcm90by5fbG9uZ0RhdGVGb3JtYXQgPSBkZWZhdWx0TG9uZ0RhdGVGb3JtYXQ7XG4gICAgcHJvdG90eXBlX19wcm90by5sb25nRGF0ZUZvcm1hdCAgPSBsb25nRGF0ZUZvcm1hdDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl9pbnZhbGlkRGF0ZSAgICA9IGRlZmF1bHRJbnZhbGlkRGF0ZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLmludmFsaWREYXRlICAgICA9IGludmFsaWREYXRlO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX29yZGluYWwgICAgICAgID0gZGVmYXVsdE9yZGluYWw7XG4gICAgcHJvdG90eXBlX19wcm90by5vcmRpbmFsICAgICAgICAgPSBvcmRpbmFsO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX29yZGluYWxQYXJzZSAgID0gZGVmYXVsdE9yZGluYWxQYXJzZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLnByZXBhcnNlICAgICAgICA9IHByZVBhcnNlUG9zdEZvcm1hdDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLnBvc3Rmb3JtYXQgICAgICA9IHByZVBhcnNlUG9zdEZvcm1hdDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl9yZWxhdGl2ZVRpbWUgICA9IGRlZmF1bHRSZWxhdGl2ZVRpbWU7XG4gICAgcHJvdG90eXBlX19wcm90by5yZWxhdGl2ZVRpbWUgICAgPSByZWxhdGl2ZV9fcmVsYXRpdmVUaW1lO1xuICAgIHByb3RvdHlwZV9fcHJvdG8ucGFzdEZ1dHVyZSAgICAgID0gcGFzdEZ1dHVyZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLnNldCAgICAgICAgICAgICA9IGxvY2FsZV9zZXRfX3NldDtcblxuICAgIC8vIE1vbnRoXG4gICAgcHJvdG90eXBlX19wcm90by5tb250aHMgICAgICAgPSAgICAgICAgbG9jYWxlTW9udGhzO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX21vbnRocyAgICAgID0gZGVmYXVsdExvY2FsZU1vbnRocztcbiAgICBwcm90b3R5cGVfX3Byb3RvLm1vbnRoc1Nob3J0ICA9ICAgICAgICBsb2NhbGVNb250aHNTaG9ydDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl9tb250aHNTaG9ydCA9IGRlZmF1bHRMb2NhbGVNb250aHNTaG9ydDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLm1vbnRoc1BhcnNlICA9ICAgICAgICBsb2NhbGVNb250aHNQYXJzZTtcblxuICAgIC8vIFdlZWtcbiAgICBwcm90b3R5cGVfX3Byb3RvLndlZWsgPSBsb2NhbGVXZWVrO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX3dlZWsgPSBkZWZhdWx0TG9jYWxlV2VlaztcbiAgICBwcm90b3R5cGVfX3Byb3RvLmZpcnN0RGF5T2ZZZWFyID0gbG9jYWxlRmlyc3REYXlPZlllYXI7XG4gICAgcHJvdG90eXBlX19wcm90by5maXJzdERheU9mV2VlayA9IGxvY2FsZUZpcnN0RGF5T2ZXZWVrO1xuXG4gICAgLy8gRGF5IG9mIFdlZWtcbiAgICBwcm90b3R5cGVfX3Byb3RvLndlZWtkYXlzICAgICAgID0gICAgICAgIGxvY2FsZVdlZWtkYXlzO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX3dlZWtkYXlzICAgICAgPSBkZWZhdWx0TG9jYWxlV2Vla2RheXM7XG4gICAgcHJvdG90eXBlX19wcm90by53ZWVrZGF5c01pbiAgICA9ICAgICAgICBsb2NhbGVXZWVrZGF5c01pbjtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl93ZWVrZGF5c01pbiAgID0gZGVmYXVsdExvY2FsZVdlZWtkYXlzTWluO1xuICAgIHByb3RvdHlwZV9fcHJvdG8ud2Vla2RheXNTaG9ydCAgPSAgICAgICAgbG9jYWxlV2Vla2RheXNTaG9ydDtcbiAgICBwcm90b3R5cGVfX3Byb3RvLl93ZWVrZGF5c1Nob3J0ID0gZGVmYXVsdExvY2FsZVdlZWtkYXlzU2hvcnQ7XG4gICAgcHJvdG90eXBlX19wcm90by53ZWVrZGF5c1BhcnNlICA9ICAgICAgICBsb2NhbGVXZWVrZGF5c1BhcnNlO1xuXG4gICAgLy8gSG91cnNcbiAgICBwcm90b3R5cGVfX3Byb3RvLmlzUE0gPSBsb2NhbGVJc1BNO1xuICAgIHByb3RvdHlwZV9fcHJvdG8uX21lcmlkaWVtUGFyc2UgPSBkZWZhdWx0TG9jYWxlTWVyaWRpZW1QYXJzZTtcbiAgICBwcm90b3R5cGVfX3Byb3RvLm1lcmlkaWVtID0gbG9jYWxlTWVyaWRpZW07XG5cbiAgICBmdW5jdGlvbiBsaXN0c19fZ2V0IChmb3JtYXQsIGluZGV4LCBmaWVsZCwgc2V0dGVyKSB7XG4gICAgICAgIHZhciBsb2NhbGUgPSBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlKCk7XG4gICAgICAgIHZhciB1dGMgPSBjcmVhdGVfdXRjX19jcmVhdGVVVEMoKS5zZXQoc2V0dGVyLCBpbmRleCk7XG4gICAgICAgIHJldHVybiBsb2NhbGVbZmllbGRdKHV0YywgZm9ybWF0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0IChmb3JtYXQsIGluZGV4LCBmaWVsZCwgY291bnQsIHNldHRlcikge1xuICAgICAgICBpZiAodHlwZW9mIGZvcm1hdCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGluZGV4ID0gZm9ybWF0O1xuICAgICAgICAgICAgZm9ybWF0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybWF0ID0gZm9ybWF0IHx8ICcnO1xuXG4gICAgICAgIGlmIChpbmRleCAhPSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbGlzdHNfX2dldChmb3JtYXQsIGluZGV4LCBmaWVsZCwgc2V0dGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIgb3V0ID0gW107XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBvdXRbaV0gPSBsaXN0c19fZ2V0KGZvcm1hdCwgaSwgZmllbGQsIHNldHRlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0c19fbGlzdE1vbnRocyAoZm9ybWF0LCBpbmRleCkge1xuICAgICAgICByZXR1cm4gbGlzdChmb3JtYXQsIGluZGV4LCAnbW9udGhzJywgMTIsICdtb250aCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RzX19saXN0TW9udGhzU2hvcnQgKGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3QoZm9ybWF0LCBpbmRleCwgJ21vbnRoc1Nob3J0JywgMTIsICdtb250aCcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RzX19saXN0V2Vla2RheXMgKGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGxpc3QoZm9ybWF0LCBpbmRleCwgJ3dlZWtkYXlzJywgNywgJ2RheScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RzX19saXN0V2Vla2RheXNTaG9ydCAoZm9ybWF0LCBpbmRleCkge1xuICAgICAgICByZXR1cm4gbGlzdChmb3JtYXQsIGluZGV4LCAnd2Vla2RheXNTaG9ydCcsIDcsICdkYXknKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0c19fbGlzdFdlZWtkYXlzTWluIChmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgIHJldHVybiBsaXN0KGZvcm1hdCwgaW5kZXgsICd3ZWVrZGF5c01pbicsIDcsICdkYXknKTtcbiAgICB9XG5cbiAgICBsb2NhbGVfbG9jYWxlc19fZ2V0U2V0R2xvYmFsTG9jYWxlKCdlbicsIHtcbiAgICAgICAgb3JkaW5hbFBhcnNlOiAvXFxkezEsMn0odGh8c3R8bmR8cmQpLyxcbiAgICAgICAgb3JkaW5hbCA6IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICAgICAgICAgIHZhciBiID0gbnVtYmVyICUgMTAsXG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gKHRvSW50KG51bWJlciAlIDEwMCAvIDEwKSA9PT0gMSkgPyAndGgnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMSkgPyAnc3QnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMikgPyAnbmQnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMykgPyAncmQnIDogJ3RoJztcbiAgICAgICAgICAgIHJldHVybiBudW1iZXIgKyBvdXRwdXQ7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFNpZGUgZWZmZWN0IGltcG9ydHNcbiAgICB1dGlsc19ob29rc19faG9va3MubGFuZyA9IGRlcHJlY2F0ZSgnbW9tZW50LmxhbmcgaXMgZGVwcmVjYXRlZC4gVXNlIG1vbWVudC5sb2NhbGUgaW5zdGVhZC4nLCBsb2NhbGVfbG9jYWxlc19fZ2V0U2V0R2xvYmFsTG9jYWxlKTtcbiAgICB1dGlsc19ob29rc19faG9va3MubGFuZ0RhdGEgPSBkZXByZWNhdGUoJ21vbWVudC5sYW5nRGF0YSBpcyBkZXByZWNhdGVkLiBVc2UgbW9tZW50LmxvY2FsZURhdGEgaW5zdGVhZC4nLCBsb2NhbGVfbG9jYWxlc19fZ2V0TG9jYWxlKTtcblxuICAgIHZhciBtYXRoQWJzID0gTWF0aC5hYnM7XG5cbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9hYnNfX2FicyAoKSB7XG4gICAgICAgIHZhciBkYXRhICAgICAgICAgICA9IHRoaXMuX2RhdGE7XG5cbiAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzID0gbWF0aEFicyh0aGlzLl9taWxsaXNlY29uZHMpO1xuICAgICAgICB0aGlzLl9kYXlzICAgICAgICAgPSBtYXRoQWJzKHRoaXMuX2RheXMpO1xuICAgICAgICB0aGlzLl9tb250aHMgICAgICAgPSBtYXRoQWJzKHRoaXMuX21vbnRocyk7XG5cbiAgICAgICAgZGF0YS5taWxsaXNlY29uZHMgID0gbWF0aEFicyhkYXRhLm1pbGxpc2Vjb25kcyk7XG4gICAgICAgIGRhdGEuc2Vjb25kcyAgICAgICA9IG1hdGhBYnMoZGF0YS5zZWNvbmRzKTtcbiAgICAgICAgZGF0YS5taW51dGVzICAgICAgID0gbWF0aEFicyhkYXRhLm1pbnV0ZXMpO1xuICAgICAgICBkYXRhLmhvdXJzICAgICAgICAgPSBtYXRoQWJzKGRhdGEuaG91cnMpO1xuICAgICAgICBkYXRhLm1vbnRocyAgICAgICAgPSBtYXRoQWJzKGRhdGEubW9udGhzKTtcbiAgICAgICAgZGF0YS55ZWFycyAgICAgICAgID0gbWF0aEFicyhkYXRhLnllYXJzKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9hZGRfc3VidHJhY3RfX2FkZFN1YnRyYWN0IChkdXJhdGlvbiwgaW5wdXQsIHZhbHVlLCBkaXJlY3Rpb24pIHtcbiAgICAgICAgdmFyIG90aGVyID0gY3JlYXRlX19jcmVhdGVEdXJhdGlvbihpbnB1dCwgdmFsdWUpO1xuXG4gICAgICAgIGR1cmF0aW9uLl9taWxsaXNlY29uZHMgKz0gZGlyZWN0aW9uICogb3RoZXIuX21pbGxpc2Vjb25kcztcbiAgICAgICAgZHVyYXRpb24uX2RheXMgICAgICAgICArPSBkaXJlY3Rpb24gKiBvdGhlci5fZGF5cztcbiAgICAgICAgZHVyYXRpb24uX21vbnRocyAgICAgICArPSBkaXJlY3Rpb24gKiBvdGhlci5fbW9udGhzO1xuXG4gICAgICAgIHJldHVybiBkdXJhdGlvbi5fYnViYmxlKCk7XG4gICAgfVxuXG4gICAgLy8gc3VwcG9ydHMgb25seSAyLjAtc3R5bGUgYWRkKDEsICdzJykgb3IgYWRkKGR1cmF0aW9uKVxuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2FkZF9zdWJ0cmFjdF9fYWRkIChpbnB1dCwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGR1cmF0aW9uX2FkZF9zdWJ0cmFjdF9fYWRkU3VidHJhY3QodGhpcywgaW5wdXQsIHZhbHVlLCAxKTtcbiAgICB9XG5cbiAgICAvLyBzdXBwb3J0cyBvbmx5IDIuMC1zdHlsZSBzdWJ0cmFjdCgxLCAncycpIG9yIHN1YnRyYWN0KGR1cmF0aW9uKVxuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2FkZF9zdWJ0cmFjdF9fc3VidHJhY3QgKGlucHV0LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZHVyYXRpb25fYWRkX3N1YnRyYWN0X19hZGRTdWJ0cmFjdCh0aGlzLCBpbnB1dCwgdmFsdWUsIC0xKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhYnNDZWlsIChudW1iZXIpIHtcbiAgICAgICAgaWYgKG51bWJlciA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKG51bWJlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKG51bWJlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBidWJibGUgKCkge1xuICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gdGhpcy5fbWlsbGlzZWNvbmRzO1xuICAgICAgICB2YXIgZGF5cyAgICAgICAgID0gdGhpcy5fZGF5cztcbiAgICAgICAgdmFyIG1vbnRocyAgICAgICA9IHRoaXMuX21vbnRocztcbiAgICAgICAgdmFyIGRhdGEgICAgICAgICA9IHRoaXMuX2RhdGE7XG4gICAgICAgIHZhciBzZWNvbmRzLCBtaW51dGVzLCBob3VycywgeWVhcnMsIG1vbnRoc0Zyb21EYXlzO1xuXG4gICAgICAgIC8vIGlmIHdlIGhhdmUgYSBtaXggb2YgcG9zaXRpdmUgYW5kIG5lZ2F0aXZlIHZhbHVlcywgYnViYmxlIGRvd24gZmlyc3RcbiAgICAgICAgLy8gY2hlY2s6IGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8yMTY2XG4gICAgICAgIGlmICghKChtaWxsaXNlY29uZHMgPj0gMCAmJiBkYXlzID49IDAgJiYgbW9udGhzID49IDApIHx8XG4gICAgICAgICAgICAgICAgKG1pbGxpc2Vjb25kcyA8PSAwICYmIGRheXMgPD0gMCAmJiBtb250aHMgPD0gMCkpKSB7XG4gICAgICAgICAgICBtaWxsaXNlY29uZHMgKz0gYWJzQ2VpbChtb250aHNUb0RheXMobW9udGhzKSArIGRheXMpICogODY0ZTU7XG4gICAgICAgICAgICBkYXlzID0gMDtcbiAgICAgICAgICAgIG1vbnRocyA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGNvZGUgYnViYmxlcyB1cCB2YWx1ZXMsIHNlZSB0aGUgdGVzdHMgZm9yXG4gICAgICAgIC8vIGV4YW1wbGVzIG9mIHdoYXQgdGhhdCBtZWFucy5cbiAgICAgICAgZGF0YS5taWxsaXNlY29uZHMgPSBtaWxsaXNlY29uZHMgJSAxMDAwO1xuXG4gICAgICAgIHNlY29uZHMgICAgICAgICAgID0gYWJzRmxvb3IobWlsbGlzZWNvbmRzIC8gMTAwMCk7XG4gICAgICAgIGRhdGEuc2Vjb25kcyAgICAgID0gc2Vjb25kcyAlIDYwO1xuXG4gICAgICAgIG1pbnV0ZXMgICAgICAgICAgID0gYWJzRmxvb3Ioc2Vjb25kcyAvIDYwKTtcbiAgICAgICAgZGF0YS5taW51dGVzICAgICAgPSBtaW51dGVzICUgNjA7XG5cbiAgICAgICAgaG91cnMgICAgICAgICAgICAgPSBhYnNGbG9vcihtaW51dGVzIC8gNjApO1xuICAgICAgICBkYXRhLmhvdXJzICAgICAgICA9IGhvdXJzICUgMjQ7XG5cbiAgICAgICAgZGF5cyArPSBhYnNGbG9vcihob3VycyAvIDI0KTtcblxuICAgICAgICAvLyBjb252ZXJ0IGRheXMgdG8gbW9udGhzXG4gICAgICAgIG1vbnRoc0Zyb21EYXlzID0gYWJzRmxvb3IoZGF5c1RvTW9udGhzKGRheXMpKTtcbiAgICAgICAgbW9udGhzICs9IG1vbnRoc0Zyb21EYXlzO1xuICAgICAgICBkYXlzIC09IGFic0NlaWwobW9udGhzVG9EYXlzKG1vbnRoc0Zyb21EYXlzKSk7XG5cbiAgICAgICAgLy8gMTIgbW9udGhzIC0+IDEgeWVhclxuICAgICAgICB5ZWFycyA9IGFic0Zsb29yKG1vbnRocyAvIDEyKTtcbiAgICAgICAgbW9udGhzICU9IDEyO1xuXG4gICAgICAgIGRhdGEuZGF5cyAgID0gZGF5cztcbiAgICAgICAgZGF0YS5tb250aHMgPSBtb250aHM7XG4gICAgICAgIGRhdGEueWVhcnMgID0geWVhcnM7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGF5c1RvTW9udGhzIChkYXlzKSB7XG4gICAgICAgIC8vIDQwMCB5ZWFycyBoYXZlIDE0NjA5NyBkYXlzICh0YWtpbmcgaW50byBhY2NvdW50IGxlYXAgeWVhciBydWxlcylcbiAgICAgICAgLy8gNDAwIHllYXJzIGhhdmUgMTIgbW9udGhzID09PSA0ODAwXG4gICAgICAgIHJldHVybiBkYXlzICogNDgwMCAvIDE0NjA5NztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb250aHNUb0RheXMgKG1vbnRocykge1xuICAgICAgICAvLyB0aGUgcmV2ZXJzZSBvZiBkYXlzVG9Nb250aHNcbiAgICAgICAgcmV0dXJuIG1vbnRocyAqIDE0NjA5NyAvIDQ4MDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXMgKHVuaXRzKSB7XG4gICAgICAgIHZhciBkYXlzO1xuICAgICAgICB2YXIgbW9udGhzO1xuICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gdGhpcy5fbWlsbGlzZWNvbmRzO1xuXG4gICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuXG4gICAgICAgIGlmICh1bml0cyA9PT0gJ21vbnRoJyB8fCB1bml0cyA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgICBkYXlzICAgPSB0aGlzLl9kYXlzICAgKyBtaWxsaXNlY29uZHMgLyA4NjRlNTtcbiAgICAgICAgICAgIG1vbnRocyA9IHRoaXMuX21vbnRocyArIGRheXNUb01vbnRocyhkYXlzKTtcbiAgICAgICAgICAgIHJldHVybiB1bml0cyA9PT0gJ21vbnRoJyA/IG1vbnRocyA6IG1vbnRocyAvIDEyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaGFuZGxlIG1pbGxpc2Vjb25kcyBzZXBhcmF0ZWx5IGJlY2F1c2Ugb2YgZmxvYXRpbmcgcG9pbnQgbWF0aCBlcnJvcnMgKGlzc3VlICMxODY3KVxuICAgICAgICAgICAgZGF5cyA9IHRoaXMuX2RheXMgKyBNYXRoLnJvdW5kKG1vbnRoc1RvRGF5cyh0aGlzLl9tb250aHMpKTtcbiAgICAgICAgICAgIHN3aXRjaCAodW5pdHMpIHtcbiAgICAgICAgICAgICAgICBjYXNlICd3ZWVrJyAgIDogcmV0dXJuIGRheXMgLyA3ICAgICArIG1pbGxpc2Vjb25kcyAvIDYwNDhlNTtcbiAgICAgICAgICAgICAgICBjYXNlICdkYXknICAgIDogcmV0dXJuIGRheXMgICAgICAgICArIG1pbGxpc2Vjb25kcyAvIDg2NGU1O1xuICAgICAgICAgICAgICAgIGNhc2UgJ2hvdXInICAgOiByZXR1cm4gZGF5cyAqIDI0ICAgICsgbWlsbGlzZWNvbmRzIC8gMzZlNTtcbiAgICAgICAgICAgICAgICBjYXNlICdtaW51dGUnIDogcmV0dXJuIGRheXMgKiAxNDQwICArIG1pbGxpc2Vjb25kcyAvIDZlNDtcbiAgICAgICAgICAgICAgICBjYXNlICdzZWNvbmQnIDogcmV0dXJuIGRheXMgKiA4NjQwMCArIG1pbGxpc2Vjb25kcyAvIDEwMDA7XG4gICAgICAgICAgICAgICAgLy8gTWF0aC5mbG9vciBwcmV2ZW50cyBmbG9hdGluZyBwb2ludCBtYXRoIGVycm9ycyBoZXJlXG4gICAgICAgICAgICAgICAgY2FzZSAnbWlsbGlzZWNvbmQnOiByZXR1cm4gTWF0aC5mbG9vcihkYXlzICogODY0ZTUpICsgbWlsbGlzZWNvbmRzO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcignVW5rbm93biB1bml0ICcgKyB1bml0cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUT0RPOiBVc2UgdGhpcy5hcygnbXMnKT9cbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9hc19fdmFsdWVPZiAoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLl9taWxsaXNlY29uZHMgK1xuICAgICAgICAgICAgdGhpcy5fZGF5cyAqIDg2NGU1ICtcbiAgICAgICAgICAgICh0aGlzLl9tb250aHMgJSAxMikgKiAyNTkyZTYgK1xuICAgICAgICAgICAgdG9JbnQodGhpcy5fbW9udGhzIC8gMTIpICogMzE1MzZlNlxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VBcyAoYWxpYXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFzKGFsaWFzKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB2YXIgYXNNaWxsaXNlY29uZHMgPSBtYWtlQXMoJ21zJyk7XG4gICAgdmFyIGFzU2Vjb25kcyAgICAgID0gbWFrZUFzKCdzJyk7XG4gICAgdmFyIGFzTWludXRlcyAgICAgID0gbWFrZUFzKCdtJyk7XG4gICAgdmFyIGFzSG91cnMgICAgICAgID0gbWFrZUFzKCdoJyk7XG4gICAgdmFyIGFzRGF5cyAgICAgICAgID0gbWFrZUFzKCdkJyk7XG4gICAgdmFyIGFzV2Vla3MgICAgICAgID0gbWFrZUFzKCd3Jyk7XG4gICAgdmFyIGFzTW9udGhzICAgICAgID0gbWFrZUFzKCdNJyk7XG4gICAgdmFyIGFzWWVhcnMgICAgICAgID0gbWFrZUFzKCd5Jyk7XG5cbiAgICBmdW5jdGlvbiBkdXJhdGlvbl9nZXRfX2dldCAodW5pdHMpIHtcbiAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgIHJldHVybiB0aGlzW3VuaXRzICsgJ3MnXSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VHZXR0ZXIobmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFbbmFtZV07XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIG1pbGxpc2Vjb25kcyA9IG1ha2VHZXR0ZXIoJ21pbGxpc2Vjb25kcycpO1xuICAgIHZhciBzZWNvbmRzICAgICAgPSBtYWtlR2V0dGVyKCdzZWNvbmRzJyk7XG4gICAgdmFyIG1pbnV0ZXMgICAgICA9IG1ha2VHZXR0ZXIoJ21pbnV0ZXMnKTtcbiAgICB2YXIgaG91cnMgICAgICAgID0gbWFrZUdldHRlcignaG91cnMnKTtcbiAgICB2YXIgZGF5cyAgICAgICAgID0gbWFrZUdldHRlcignZGF5cycpO1xuICAgIHZhciBtb250aHMgICAgICAgPSBtYWtlR2V0dGVyKCdtb250aHMnKTtcbiAgICB2YXIgeWVhcnMgICAgICAgID0gbWFrZUdldHRlcigneWVhcnMnKTtcblxuICAgIGZ1bmN0aW9uIHdlZWtzICgpIHtcbiAgICAgICAgcmV0dXJuIGFic0Zsb29yKHRoaXMuZGF5cygpIC8gNyk7XG4gICAgfVxuXG4gICAgdmFyIHJvdW5kID0gTWF0aC5yb3VuZDtcbiAgICB2YXIgdGhyZXNob2xkcyA9IHtcbiAgICAgICAgczogNDUsICAvLyBzZWNvbmRzIHRvIG1pbnV0ZVxuICAgICAgICBtOiA0NSwgIC8vIG1pbnV0ZXMgdG8gaG91clxuICAgICAgICBoOiAyMiwgIC8vIGhvdXJzIHRvIGRheVxuICAgICAgICBkOiAyNiwgIC8vIGRheXMgdG8gbW9udGhcbiAgICAgICAgTTogMTEgICAvLyBtb250aHMgdG8geWVhclxuICAgIH07XG5cbiAgICAvLyBoZWxwZXIgZnVuY3Rpb24gZm9yIG1vbWVudC5mbi5mcm9tLCBtb21lbnQuZm4uZnJvbU5vdywgYW5kIG1vbWVudC5kdXJhdGlvbi5mbi5odW1hbml6ZVxuICAgIGZ1bmN0aW9uIHN1YnN0aXR1dGVUaW1lQWdvKHN0cmluZywgbnVtYmVyLCB3aXRob3V0U3VmZml4LCBpc0Z1dHVyZSwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUucmVsYXRpdmVUaW1lKG51bWJlciB8fCAxLCAhIXdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2h1bWFuaXplX19yZWxhdGl2ZVRpbWUgKHBvc05lZ0R1cmF0aW9uLCB3aXRob3V0U3VmZml4LCBsb2NhbGUpIHtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gY3JlYXRlX19jcmVhdGVEdXJhdGlvbihwb3NOZWdEdXJhdGlvbikuYWJzKCk7XG4gICAgICAgIHZhciBzZWNvbmRzICA9IHJvdW5kKGR1cmF0aW9uLmFzKCdzJykpO1xuICAgICAgICB2YXIgbWludXRlcyAgPSByb3VuZChkdXJhdGlvbi5hcygnbScpKTtcbiAgICAgICAgdmFyIGhvdXJzICAgID0gcm91bmQoZHVyYXRpb24uYXMoJ2gnKSk7XG4gICAgICAgIHZhciBkYXlzICAgICA9IHJvdW5kKGR1cmF0aW9uLmFzKCdkJykpO1xuICAgICAgICB2YXIgbW9udGhzICAgPSByb3VuZChkdXJhdGlvbi5hcygnTScpKTtcbiAgICAgICAgdmFyIHllYXJzICAgID0gcm91bmQoZHVyYXRpb24uYXMoJ3knKSk7XG5cbiAgICAgICAgdmFyIGEgPSBzZWNvbmRzIDwgdGhyZXNob2xkcy5zICYmIFsncycsIHNlY29uZHNdICB8fFxuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPT09IDEgICAgICAgICAgJiYgWydtJ10gICAgICAgICAgIHx8XG4gICAgICAgICAgICAgICAgbWludXRlcyA8IHRocmVzaG9sZHMubSAmJiBbJ21tJywgbWludXRlc10gfHxcbiAgICAgICAgICAgICAgICBob3VycyAgID09PSAxICAgICAgICAgICYmIFsnaCddICAgICAgICAgICB8fFxuICAgICAgICAgICAgICAgIGhvdXJzICAgPCB0aHJlc2hvbGRzLmggJiYgWydoaCcsIGhvdXJzXSAgIHx8XG4gICAgICAgICAgICAgICAgZGF5cyAgICA9PT0gMSAgICAgICAgICAmJiBbJ2QnXSAgICAgICAgICAgfHxcbiAgICAgICAgICAgICAgICBkYXlzICAgIDwgdGhyZXNob2xkcy5kICYmIFsnZGQnLCBkYXlzXSAgICB8fFxuICAgICAgICAgICAgICAgIG1vbnRocyAgPT09IDEgICAgICAgICAgJiYgWydNJ10gICAgICAgICAgIHx8XG4gICAgICAgICAgICAgICAgbW9udGhzICA8IHRocmVzaG9sZHMuTSAmJiBbJ01NJywgbW9udGhzXSAgfHxcbiAgICAgICAgICAgICAgICB5ZWFycyAgID09PSAxICAgICAgICAgICYmIFsneSddICAgICAgICAgICB8fCBbJ3l5JywgeWVhcnNdO1xuXG4gICAgICAgIGFbMl0gPSB3aXRob3V0U3VmZml4O1xuICAgICAgICBhWzNdID0gK3Bvc05lZ0R1cmF0aW9uID4gMDtcbiAgICAgICAgYVs0XSA9IGxvY2FsZTtcbiAgICAgICAgcmV0dXJuIHN1YnN0aXR1dGVUaW1lQWdvLmFwcGx5KG51bGwsIGEpO1xuICAgIH1cblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gYWxsb3dzIHlvdSB0byBzZXQgYSB0aHJlc2hvbGQgZm9yIHJlbGF0aXZlIHRpbWUgc3RyaW5nc1xuICAgIGZ1bmN0aW9uIGR1cmF0aW9uX2h1bWFuaXplX19nZXRTZXRSZWxhdGl2ZVRpbWVUaHJlc2hvbGQgKHRocmVzaG9sZCwgbGltaXQpIHtcbiAgICAgICAgaWYgKHRocmVzaG9sZHNbdGhyZXNob2xkXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpbWl0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aHJlc2hvbGRzW3RocmVzaG9sZF07XG4gICAgICAgIH1cbiAgICAgICAgdGhyZXNob2xkc1t0aHJlc2hvbGRdID0gbGltaXQ7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGh1bWFuaXplICh3aXRoU3VmZml4KSB7XG4gICAgICAgIHZhciBsb2NhbGUgPSB0aGlzLmxvY2FsZURhdGEoKTtcbiAgICAgICAgdmFyIG91dHB1dCA9IGR1cmF0aW9uX2h1bWFuaXplX19yZWxhdGl2ZVRpbWUodGhpcywgIXdpdGhTdWZmaXgsIGxvY2FsZSk7XG5cbiAgICAgICAgaWYgKHdpdGhTdWZmaXgpIHtcbiAgICAgICAgICAgIG91dHB1dCA9IGxvY2FsZS5wYXN0RnV0dXJlKCt0aGlzLCBvdXRwdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxvY2FsZS5wb3N0Zm9ybWF0KG91dHB1dCk7XG4gICAgfVxuXG4gICAgdmFyIGlzb19zdHJpbmdfX2FicyA9IE1hdGguYWJzO1xuXG4gICAgZnVuY3Rpb24gaXNvX3N0cmluZ19fdG9JU09TdHJpbmcoKSB7XG4gICAgICAgIC8vIGZvciBJU08gc3RyaW5ncyB3ZSBkbyBub3QgdXNlIHRoZSBub3JtYWwgYnViYmxpbmcgcnVsZXM6XG4gICAgICAgIC8vICAqIG1pbGxpc2Vjb25kcyBidWJibGUgdXAgdW50aWwgdGhleSBiZWNvbWUgaG91cnNcbiAgICAgICAgLy8gICogZGF5cyBkbyBub3QgYnViYmxlIGF0IGFsbFxuICAgICAgICAvLyAgKiBtb250aHMgYnViYmxlIHVwIHVudGlsIHRoZXkgYmVjb21lIHllYXJzXG4gICAgICAgIC8vIFRoaXMgaXMgYmVjYXVzZSB0aGVyZSBpcyBubyBjb250ZXh0LWZyZWUgY29udmVyc2lvbiBiZXR3ZWVuIGhvdXJzIGFuZCBkYXlzXG4gICAgICAgIC8vICh0aGluayBvZiBjbG9jayBjaGFuZ2VzKVxuICAgICAgICAvLyBhbmQgYWxzbyBub3QgYmV0d2VlbiBkYXlzIGFuZCBtb250aHMgKDI4LTMxIGRheXMgcGVyIG1vbnRoKVxuICAgICAgICB2YXIgc2Vjb25kcyA9IGlzb19zdHJpbmdfX2Ficyh0aGlzLl9taWxsaXNlY29uZHMpIC8gMTAwMDtcbiAgICAgICAgdmFyIGRheXMgICAgICAgICA9IGlzb19zdHJpbmdfX2Ficyh0aGlzLl9kYXlzKTtcbiAgICAgICAgdmFyIG1vbnRocyAgICAgICA9IGlzb19zdHJpbmdfX2Ficyh0aGlzLl9tb250aHMpO1xuICAgICAgICB2YXIgbWludXRlcywgaG91cnMsIHllYXJzO1xuXG4gICAgICAgIC8vIDM2MDAgc2Vjb25kcyAtPiA2MCBtaW51dGVzIC0+IDEgaG91clxuICAgICAgICBtaW51dGVzICAgICAgICAgICA9IGFic0Zsb29yKHNlY29uZHMgLyA2MCk7XG4gICAgICAgIGhvdXJzICAgICAgICAgICAgID0gYWJzRmxvb3IobWludXRlcyAvIDYwKTtcbiAgICAgICAgc2Vjb25kcyAlPSA2MDtcbiAgICAgICAgbWludXRlcyAlPSA2MDtcblxuICAgICAgICAvLyAxMiBtb250aHMgLT4gMSB5ZWFyXG4gICAgICAgIHllYXJzICA9IGFic0Zsb29yKG1vbnRocyAvIDEyKTtcbiAgICAgICAgbW9udGhzICU9IDEyO1xuXG5cbiAgICAgICAgLy8gaW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2RvcmRpbGxlL21vbWVudC1pc29kdXJhdGlvbi9ibG9iL21hc3Rlci9tb21lbnQuaXNvZHVyYXRpb24uanNcbiAgICAgICAgdmFyIFkgPSB5ZWFycztcbiAgICAgICAgdmFyIE0gPSBtb250aHM7XG4gICAgICAgIHZhciBEID0gZGF5cztcbiAgICAgICAgdmFyIGggPSBob3VycztcbiAgICAgICAgdmFyIG0gPSBtaW51dGVzO1xuICAgICAgICB2YXIgcyA9IHNlY29uZHM7XG4gICAgICAgIHZhciB0b3RhbCA9IHRoaXMuYXNTZWNvbmRzKCk7XG5cbiAgICAgICAgaWYgKCF0b3RhbCkge1xuICAgICAgICAgICAgLy8gdGhpcyBpcyB0aGUgc2FtZSBhcyBDIydzIChOb2RhKSBhbmQgcHl0aG9uIChpc29kYXRlKS4uLlxuICAgICAgICAgICAgLy8gYnV0IG5vdCBvdGhlciBKUyAoZ29vZy5kYXRlKVxuICAgICAgICAgICAgcmV0dXJuICdQMEQnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICh0b3RhbCA8IDAgPyAnLScgOiAnJykgK1xuICAgICAgICAgICAgJ1AnICtcbiAgICAgICAgICAgIChZID8gWSArICdZJyA6ICcnKSArXG4gICAgICAgICAgICAoTSA/IE0gKyAnTScgOiAnJykgK1xuICAgICAgICAgICAgKEQgPyBEICsgJ0QnIDogJycpICtcbiAgICAgICAgICAgICgoaCB8fCBtIHx8IHMpID8gJ1QnIDogJycpICtcbiAgICAgICAgICAgIChoID8gaCArICdIJyA6ICcnKSArXG4gICAgICAgICAgICAobSA/IG0gKyAnTScgOiAnJykgK1xuICAgICAgICAgICAgKHMgPyBzICsgJ1MnIDogJycpO1xuICAgIH1cblxuICAgIHZhciBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvID0gRHVyYXRpb24ucHJvdG90eXBlO1xuXG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hYnMgICAgICAgICAgICA9IGR1cmF0aW9uX2Fic19fYWJzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYWRkICAgICAgICAgICAgPSBkdXJhdGlvbl9hZGRfc3VidHJhY3RfX2FkZDtcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLnN1YnRyYWN0ICAgICAgID0gZHVyYXRpb25fYWRkX3N1YnRyYWN0X19zdWJ0cmFjdDtcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzICAgICAgICAgICAgID0gYXM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hc01pbGxpc2Vjb25kcyA9IGFzTWlsbGlzZWNvbmRzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXNTZWNvbmRzICAgICAgPSBhc1NlY29uZHM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5hc01pbnV0ZXMgICAgICA9IGFzTWludXRlcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzSG91cnMgICAgICAgID0gYXNIb3VycztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzRGF5cyAgICAgICAgID0gYXNEYXlzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXNXZWVrcyAgICAgICAgPSBhc1dlZWtzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uYXNNb250aHMgICAgICAgPSBhc01vbnRocztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmFzWWVhcnMgICAgICAgID0gYXNZZWFycztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLnZhbHVlT2YgICAgICAgID0gZHVyYXRpb25fYXNfX3ZhbHVlT2Y7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5fYnViYmxlICAgICAgICA9IGJ1YmJsZTtcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmdldCAgICAgICAgICAgID0gZHVyYXRpb25fZ2V0X19nZXQ7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5taWxsaXNlY29uZHMgICA9IG1pbGxpc2Vjb25kcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLnNlY29uZHMgICAgICAgID0gc2Vjb25kcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLm1pbnV0ZXMgICAgICAgID0gbWludXRlcztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmhvdXJzICAgICAgICAgID0gaG91cnM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5kYXlzICAgICAgICAgICA9IGRheXM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by53ZWVrcyAgICAgICAgICA9IHdlZWtzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8ubW9udGhzICAgICAgICAgPSBtb250aHM7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by55ZWFycyAgICAgICAgICA9IHllYXJzO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8uaHVtYW5pemUgICAgICAgPSBodW1hbml6ZTtcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLnRvSVNPU3RyaW5nICAgID0gaXNvX3N0cmluZ19fdG9JU09TdHJpbmc7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by50b1N0cmluZyAgICAgICA9IGlzb19zdHJpbmdfX3RvSVNPU3RyaW5nO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8udG9KU09OICAgICAgICAgPSBpc29fc3RyaW5nX190b0lTT1N0cmluZztcbiAgICBkdXJhdGlvbl9wcm90b3R5cGVfX3Byb3RvLmxvY2FsZSAgICAgICAgID0gbG9jYWxlO1xuICAgIGR1cmF0aW9uX3Byb3RvdHlwZV9fcHJvdG8ubG9jYWxlRGF0YSAgICAgPSBsb2NhbGVEYXRhO1xuXG4gICAgLy8gRGVwcmVjYXRpb25zXG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by50b0lzb1N0cmluZyA9IGRlcHJlY2F0ZSgndG9Jc29TdHJpbmcoKSBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIHRvSVNPU3RyaW5nKCkgaW5zdGVhZCAobm90aWNlIHRoZSBjYXBpdGFscyknLCBpc29fc3RyaW5nX190b0lTT1N0cmluZyk7XG4gICAgZHVyYXRpb25fcHJvdG90eXBlX19wcm90by5sYW5nID0gbGFuZztcblxuICAgIC8vIFNpZGUgZWZmZWN0IGltcG9ydHNcblxuICAgIGFkZEZvcm1hdFRva2VuKCdYJywgMCwgMCwgJ3VuaXgnKTtcbiAgICBhZGRGb3JtYXRUb2tlbigneCcsIDAsIDAsICd2YWx1ZU9mJyk7XG5cbiAgICAvLyBQQVJTSU5HXG5cbiAgICBhZGRSZWdleFRva2VuKCd4JywgbWF0Y2hTaWduZWQpO1xuICAgIGFkZFJlZ2V4VG9rZW4oJ1gnLCBtYXRjaFRpbWVzdGFtcCk7XG4gICAgYWRkUGFyc2VUb2tlbignWCcsIGZ1bmN0aW9uIChpbnB1dCwgYXJyYXksIGNvbmZpZykge1xuICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShwYXJzZUZsb2F0KGlucHV0LCAxMCkgKiAxMDAwKTtcbiAgICB9KTtcbiAgICBhZGRQYXJzZVRva2VuKCd4JywgZnVuY3Rpb24gKGlucHV0LCBhcnJheSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKHRvSW50KGlucHV0KSk7XG4gICAgfSk7XG5cbiAgICAvLyBTaWRlIGVmZmVjdCBpbXBvcnRzXG5cblxuICAgIHV0aWxzX2hvb2tzX19ob29rcy52ZXJzaW9uID0gJzIuMTAuNic7XG5cbiAgICBzZXRIb29rQ2FsbGJhY2sobG9jYWxfX2NyZWF0ZUxvY2FsKTtcblxuICAgIHV0aWxzX2hvb2tzX19ob29rcy5mbiAgICAgICAgICAgICAgICAgICAgPSBtb21lbnRQcm90b3R5cGU7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLm1pbiAgICAgICAgICAgICAgICAgICA9IG1pbjtcbiAgICB1dGlsc19ob29rc19faG9va3MubWF4ICAgICAgICAgICAgICAgICAgID0gbWF4O1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy51dGMgICAgICAgICAgICAgICAgICAgPSBjcmVhdGVfdXRjX19jcmVhdGVVVEM7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLnVuaXggICAgICAgICAgICAgICAgICA9IG1vbWVudF9fY3JlYXRlVW5peDtcbiAgICB1dGlsc19ob29rc19faG9va3MubW9udGhzICAgICAgICAgICAgICAgID0gbGlzdHNfX2xpc3RNb250aHM7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmlzRGF0ZSAgICAgICAgICAgICAgICA9IGlzRGF0ZTtcbiAgICB1dGlsc19ob29rc19faG9va3MubG9jYWxlICAgICAgICAgICAgICAgID0gbG9jYWxlX2xvY2FsZXNfX2dldFNldEdsb2JhbExvY2FsZTtcbiAgICB1dGlsc19ob29rc19faG9va3MuaW52YWxpZCAgICAgICAgICAgICAgID0gdmFsaWRfX2NyZWF0ZUludmFsaWQ7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmR1cmF0aW9uICAgICAgICAgICAgICA9IGNyZWF0ZV9fY3JlYXRlRHVyYXRpb247XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLmlzTW9tZW50ICAgICAgICAgICAgICA9IGlzTW9tZW50O1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy53ZWVrZGF5cyAgICAgICAgICAgICAgPSBsaXN0c19fbGlzdFdlZWtkYXlzO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5wYXJzZVpvbmUgICAgICAgICAgICAgPSBtb21lbnRfX2NyZWF0ZUluWm9uZTtcbiAgICB1dGlsc19ob29rc19faG9va3MubG9jYWxlRGF0YSAgICAgICAgICAgID0gbG9jYWxlX2xvY2FsZXNfX2dldExvY2FsZTtcbiAgICB1dGlsc19ob29rc19faG9va3MuaXNEdXJhdGlvbiAgICAgICAgICAgID0gaXNEdXJhdGlvbjtcbiAgICB1dGlsc19ob29rc19faG9va3MubW9udGhzU2hvcnQgICAgICAgICAgID0gbGlzdHNfX2xpc3RNb250aHNTaG9ydDtcbiAgICB1dGlsc19ob29rc19faG9va3Mud2Vla2RheXNNaW4gICAgICAgICAgID0gbGlzdHNfX2xpc3RXZWVrZGF5c01pbjtcbiAgICB1dGlsc19ob29rc19faG9va3MuZGVmaW5lTG9jYWxlICAgICAgICAgID0gZGVmaW5lTG9jYWxlO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy53ZWVrZGF5c1Nob3J0ICAgICAgICAgPSBsaXN0c19fbGlzdFdlZWtkYXlzU2hvcnQ7XG4gICAgdXRpbHNfaG9va3NfX2hvb2tzLm5vcm1hbGl6ZVVuaXRzICAgICAgICA9IG5vcm1hbGl6ZVVuaXRzO1xuICAgIHV0aWxzX2hvb2tzX19ob29rcy5yZWxhdGl2ZVRpbWVUaHJlc2hvbGQgPSBkdXJhdGlvbl9odW1hbml6ZV9fZ2V0U2V0UmVsYXRpdmVUaW1lVGhyZXNob2xkO1xuXG4gICAgdmFyIF9tb21lbnQgPSB1dGlsc19ob29rc19faG9va3M7XG5cbiAgICByZXR1cm4gX21vbWVudDtcblxufSkpOyIsInZhciBfID0gcmVxdWlyZShcIi4vbG9kYXNoLmN1c3RvbS5qc1wiKTtcbnZhciByZXdpbmQgPSByZXF1aXJlKFwiZ2VvanNvbi1yZXdpbmRcIik7XG5cbi8vIHNlZSBodHRwczovL3dpa2kub3BlbnN0cmVldG1hcC5vcmcvd2lraS9PdmVycGFzc190dXJiby9Qb2x5Z29uX0ZlYXR1cmVzXG52YXIgcG9seWdvbkZlYXR1cmVzID0gcmVxdWlyZShcIi4vcG9seWdvbl9mZWF0dXJlcy5qc29uXCIpO1xuXG52YXIgb3NtdG9nZW9qc29uID0ge307XG5cbm9zbXRvZ2VvanNvbiA9IGZ1bmN0aW9uKCBkYXRhLCBvcHRpb25zICkge1xuXG4gIG9wdGlvbnMgPSBfLm1lcmdlKFxuICAgIHtcbiAgICAgIHZlcmJvc2U6IGZhbHNlLFxuICAgICAgZmxhdFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgdW5pbnRlcmVzdGluZ1RhZ3M6IHtcbiAgICAgICAgXCJzb3VyY2VcIjogdHJ1ZSxcbiAgICAgICAgXCJzb3VyY2VfcmVmXCI6IHRydWUsXG4gICAgICAgIFwic291cmNlOnJlZlwiOiB0cnVlLFxuICAgICAgICBcImhpc3RvcnlcIjogdHJ1ZSxcbiAgICAgICAgXCJhdHRyaWJ1dGlvblwiOiB0cnVlLFxuICAgICAgICBcImNyZWF0ZWRfYnlcIjogdHJ1ZSxcbiAgICAgICAgXCJ0aWdlcjpjb3VudHlcIjogdHJ1ZSxcbiAgICAgICAgXCJ0aWdlcjp0bGlkXCI6IHRydWUsXG4gICAgICAgIFwidGlnZXI6dXBsb2FkX3V1aWRcIjogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHBvbHlnb25GZWF0dXJlczogcG9seWdvbkZlYXR1cmVzLFxuICAgIH0sXG4gICAgb3B0aW9uc1xuICApO1xuXG4gIHZhciByZXN1bHQ7XG4gIGlmICggKCh0eXBlb2YgWE1MRG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCIpICYmIGRhdGEgaW5zdGFuY2VvZiBYTUxEb2N1bWVudCB8fFxuICAgICAgICAodHlwZW9mIFhNTERvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSAmJiBkYXRhLmNoaWxkTm9kZXMpIClcbiAgICByZXN1bHQgPSBfb3NtWE1MMmdlb0pTT04oZGF0YSk7XG4gIGVsc2VcbiAgICByZXN1bHQgPSBfb3ZlcnBhc3NKU09OMmdlb0pTT04oZGF0YSk7XG4gIHJldHVybiByZXN1bHQ7XG5cbiAgZnVuY3Rpb24gX292ZXJwYXNzSlNPTjJnZW9KU09OKGpzb24pIHtcbiAgICAvLyBzb3J0IGVsZW1lbnRzXG4gICAgdmFyIG5vZGVzID0gbmV3IEFycmF5KCk7XG4gICAgdmFyIHdheXMgID0gbmV3IEFycmF5KCk7XG4gICAgdmFyIHJlbHMgID0gbmV3IEFycmF5KCk7XG4gICAgLy8gaGVscGVyIGZ1bmN0aW9uc1xuICAgIGZ1bmN0aW9uIGNlbnRlckdlb21ldHJ5KG9iamVjdCkge1xuICAgICAgdmFyIHBzZXVkb05vZGUgPSBfLmNsb25lKG9iamVjdCk7XG4gICAgICBwc2V1ZG9Ob2RlLmxhdCA9IG9iamVjdC5jZW50ZXIubGF0O1xuICAgICAgcHNldWRvTm9kZS5sb24gPSBvYmplY3QuY2VudGVyLmxvbjtcbiAgICAgIHBzZXVkb05vZGUuX19pc19jZW50ZXJfcGxhY2Vob2xkZXIgPSB0cnVlO1xuICAgICAgbm9kZXMucHVzaChwc2V1ZG9Ob2RlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gYm91bmRzR2VvbWV0cnkob2JqZWN0KSB7XG4gICAgICB2YXIgcHNldWRvV2F5ID0gXy5jbG9uZShvYmplY3QpO1xuICAgICAgcHNldWRvV2F5Lm5vZGVzID0gW107XG4gICAgICBmdW5jdGlvbiBhZGRQc2V1ZG9Ob2RlKGxhdCxsb24saSkge1xuICAgICAgICB2YXIgcHNldWRvTm9kZSA9IHtcbiAgICAgICAgICB0eXBlOlwibm9kZVwiLFxuICAgICAgICAgIGlkOiAgXCJfXCIrcHNldWRvV2F5LnR5cGUrXCIvXCIrcHNldWRvV2F5LmlkK1wiYm91bmRzXCIraSxcbiAgICAgICAgICBsYXQ6IGxhdCxcbiAgICAgICAgICBsb246IGxvblxuICAgICAgICB9XG4gICAgICAgIHBzZXVkb1dheS5ub2Rlcy5wdXNoKHBzZXVkb05vZGUuaWQpO1xuICAgICAgICBub2Rlcy5wdXNoKHBzZXVkb05vZGUpO1xuICAgICAgfVxuICAgICAgYWRkUHNldWRvTm9kZShwc2V1ZG9XYXkuYm91bmRzLm1pbmxhdCxwc2V1ZG9XYXkuYm91bmRzLm1pbmxvbiwxKTtcbiAgICAgIGFkZFBzZXVkb05vZGUocHNldWRvV2F5LmJvdW5kcy5tYXhsYXQscHNldWRvV2F5LmJvdW5kcy5taW5sb24sMik7XG4gICAgICBhZGRQc2V1ZG9Ob2RlKHBzZXVkb1dheS5ib3VuZHMubWF4bGF0LHBzZXVkb1dheS5ib3VuZHMubWF4bG9uLDMpO1xuICAgICAgYWRkUHNldWRvTm9kZShwc2V1ZG9XYXkuYm91bmRzLm1pbmxhdCxwc2V1ZG9XYXkuYm91bmRzLm1heGxvbiw0KTtcbiAgICAgIHBzZXVkb1dheS5ub2Rlcy5wdXNoKHBzZXVkb1dheS5ub2Rlc1swXSk7XG4gICAgICBwc2V1ZG9XYXkuX19pc19ib3VuZHNfcGxhY2Vob2xkZXIgPSB0cnVlO1xuICAgICAgd2F5cy5wdXNoKHBzZXVkb1dheSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZ1bGxHZW9tZXRyeVdheSh3YXkpIHtcbiAgICAgIGZ1bmN0aW9uIGFkZEZ1bGxHZW9tZXRyeU5vZGUobGF0LGxvbixpZCkge1xuICAgICAgICB2YXIgZ2VvbWV0cnlOb2RlID0ge1xuICAgICAgICAgIHR5cGU6XCJub2RlXCIsXG4gICAgICAgICAgaWQ6ICBpZCxcbiAgICAgICAgICBsYXQ6IGxhdCxcbiAgICAgICAgICBsb246IGxvbixcbiAgICAgICAgICBfX2lzX3VuaW50ZXJlc3Rpbmc6IHRydWVcbiAgICAgICAgfVxuICAgICAgICBub2Rlcy5wdXNoKGdlb21ldHJ5Tm9kZSk7XG4gICAgICB9XG4gICAgICBpZiAoIV8uaXNBcnJheSh3YXkubm9kZXMpKSB7XG4gICAgICAgIHdheS5ub2RlcyA9IHdheS5nZW9tZXRyeS5tYXAoZnVuY3Rpb24obmQpIHtcbiAgICAgICAgICBpZiAobmQgIT09IG51bGwpIC8vIGhhdmUgdG8gc2tpcCByZWYtbGVzcyBub2Rlc1xuICAgICAgICAgICAgcmV0dXJuIFwiX2Fub255bW91c0BcIituZC5sYXQrXCIvXCIrbmQubG9uO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBcIl9hbm9ueW1vdXNAdW5rbm93bl9sb2NhdGlvblwiO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHdheS5nZW9tZXRyeS5mb3JFYWNoKGZ1bmN0aW9uKG5kLCBpKSB7XG4gICAgICAgIGlmIChuZCkge1xuICAgICAgICAgIGFkZEZ1bGxHZW9tZXRyeU5vZGUoXG4gICAgICAgICAgICBuZC5sYXQsXG4gICAgICAgICAgICBuZC5sb24sXG4gICAgICAgICAgICB3YXkubm9kZXNbaV1cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZnVsbEdlb21ldHJ5UmVsYXRpb24ocmVsKSB7XG4gICAgICBmdW5jdGlvbiBhZGRGdWxsR2VvbWV0cnlOb2RlKGxhdCxsb24saWQpIHtcbiAgICAgICAgdmFyIGdlb21ldHJ5Tm9kZSA9IHtcbiAgICAgICAgICB0eXBlOlwibm9kZVwiLFxuICAgICAgICAgIGlkOiAgaWQsXG4gICAgICAgICAgbGF0OiBsYXQsXG4gICAgICAgICAgbG9uOiBsb25cbiAgICAgICAgfVxuICAgICAgICBub2Rlcy5wdXNoKGdlb21ldHJ5Tm9kZSk7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBhZGRGdWxsR2VvbWV0cnlXYXkoZ2VvbWV0cnksaWQpIHtcbiAgICAgICAgLy8gc2hhcmVkIG11bHRpcG9seWdvbiB3YXlzIGNhbm5vdCBiZSBkZWZpbmVkIG11bHRpcGxlIHRpbWVzIHdpdGggdGhlIHNhbWUgaWQuXG4gICAgICAgIGlmICh3YXlzLnNvbWUoZnVuY3Rpb24gKHdheSkgeyAvLyB0b2RvOiB0aGlzIGlzIHNsb3cgOihcbiAgICAgICAgICByZXR1cm4gd2F5LnR5cGUgPT0gXCJ3YXlcIiAmJiB3YXkuaWQgPT0gaWQ7XG4gICAgICAgIH0pKSByZXR1cm47XG4gICAgICAgIHZhciBnZW9tZXRyeVdheSA9IHtcbiAgICAgICAgICB0eXBlOiBcIndheVwiLFxuICAgICAgICAgIGlkOiAgIGlkLFxuICAgICAgICAgIG5vZGVzOltdXG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gYWRkRnVsbEdlb21ldHJ5V2F5UHNldWRvTm9kZShsYXQsbG9uKSB7XG4gICAgICAgICAgLy8gdG9kbz8gZG8gbm90IHNhdmUgdGhlIHNhbWUgcHNldWRvIG5vZGUgbXVsdGlwbGUgdGltZXNcbiAgICAgICAgICB2YXIgZ2VvbWV0cnlQc2V1ZG9Ob2RlID0ge1xuICAgICAgICAgICAgdHlwZTpcIm5vZGVcIixcbiAgICAgICAgICAgIGlkOiAgXCJfYW5vbnltb3VzQFwiK2xhdCtcIi9cIitsb24sXG4gICAgICAgICAgICBsYXQ6IGxhdCxcbiAgICAgICAgICAgIGxvbjogbG9uLFxuICAgICAgICAgICAgX19pc191bmludGVyZXN0aW5nOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICAgIGdlb21ldHJ5V2F5Lm5vZGVzLnB1c2goZ2VvbWV0cnlQc2V1ZG9Ob2RlLmlkKTtcbiAgICAgICAgICBub2Rlcy5wdXNoKGdlb21ldHJ5UHNldWRvTm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgZ2VvbWV0cnkuZm9yRWFjaChmdW5jdGlvbihuZCkge1xuICAgICAgICAgIGlmIChuZCkge1xuICAgICAgICAgICAgYWRkRnVsbEdlb21ldHJ5V2F5UHNldWRvTm9kZShcbiAgICAgICAgICAgICAgbmQubGF0LFxuICAgICAgICAgICAgICBuZC5sb25cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdlb21ldHJ5V2F5Lm5vZGVzLnB1c2godW5kZWZpbmVkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB3YXlzLnB1c2goZ2VvbWV0cnlXYXkpO1xuICAgICAgfVxuICAgICAgcmVsLm1lbWJlcnMuZm9yRWFjaChmdW5jdGlvbihtZW1iZXIsIGkpIHtcbiAgICAgICAgaWYgKG1lbWJlci50eXBlID09IFwibm9kZVwiKSB7XG4gICAgICAgICAgaWYgKG1lbWJlci5sYXQpIHtcbiAgICAgICAgICAgIGFkZEZ1bGxHZW9tZXRyeU5vZGUoXG4gICAgICAgICAgICAgIG1lbWJlci5sYXQsXG4gICAgICAgICAgICAgIG1lbWJlci5sb24sXG4gICAgICAgICAgICAgIG1lbWJlci5yZWZcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG1lbWJlci50eXBlID09IFwid2F5XCIpIHtcbiAgICAgICAgICBpZiAobWVtYmVyLmdlb21ldHJ5KSB7XG4gICAgICAgICAgICBhZGRGdWxsR2VvbWV0cnlXYXkoXG4gICAgICAgICAgICAgIG1lbWJlci5nZW9tZXRyeSxcbiAgICAgICAgICAgICAgbWVtYmVyLnJlZlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBjcmVhdGUgY29waWVzIG9mIGluZGl2aWR1YWwganNvbiBvYmplY3RzIHRvIG1ha2Ugc3VyZSB0aGUgb3JpZ2luYWwgZGF0YSBkb2Vzbid0IGdldCBhbHRlcmVkXG4gICAgLy8gdG9kbzogY2xvbmluZyBpcyBzbG93OiBzZWUgaWYgdGhpcyBjYW4gYmUgZG9uZSBkaWZmZXJlbnRseSFcbiAgICBmb3IgKHZhciBpPTA7aTxqc29uLmVsZW1lbnRzLmxlbmd0aDtpKyspIHtcbiAgICAgIHN3aXRjaCAoanNvbi5lbGVtZW50c1tpXS50eXBlKSB7XG4gICAgICBjYXNlIFwibm9kZVwiOlxuICAgICAgICB2YXIgbm9kZSA9IGpzb24uZWxlbWVudHNbaV07XG4gICAgICAgIG5vZGVzLnB1c2gobm9kZSk7XG4gICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ3YXlcIjpcbiAgICAgICAgdmFyIHdheSA9IF8uY2xvbmUoanNvbi5lbGVtZW50c1tpXSk7XG4gICAgICAgIHdheS5ub2RlcyA9IF8uY2xvbmUod2F5Lm5vZGVzKTtcbiAgICAgICAgd2F5cy5wdXNoKHdheSk7XG4gICAgICAgIGlmICh3YXkuY2VudGVyKVxuICAgICAgICAgIGNlbnRlckdlb21ldHJ5KHdheSk7XG4gICAgICAgIGlmICh3YXkuZ2VvbWV0cnkpXG4gICAgICAgICAgZnVsbEdlb21ldHJ5V2F5KHdheSk7XG4gICAgICAgIGVsc2UgaWYgKHdheS5ib3VuZHMpXG4gICAgICAgICAgYm91bmRzR2VvbWV0cnkod2F5KTtcbiAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInJlbGF0aW9uXCI6XG4gICAgICAgIHZhciByZWwgPSBfLmNsb25lKGpzb24uZWxlbWVudHNbaV0pO1xuICAgICAgICByZWwubWVtYmVycyA9IF8uY2xvbmUocmVsLm1lbWJlcnMpO1xuICAgICAgICByZWxzLnB1c2gocmVsKTtcbiAgICAgICAgdmFyIGhhc19mdWxsX2dlb21ldHJ5ID0gcmVsLm1lbWJlcnMgJiYgcmVsLm1lbWJlcnMuc29tZShmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgICAgICAgcmV0dXJuIG1lbWJlci50eXBlID09IFwibm9kZVwiICYmIG1lbWJlci5sYXQgfHxcbiAgICAgICAgICAgICAgICAgbWVtYmVyLnR5cGUgPT0gXCJ3YXlcIiAgJiYgbWVtYmVyLmdlb21ldHJ5ICYmIG1lbWJlci5nZW9tZXRyeS5sZW5ndGggPiAwXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocmVsLmNlbnRlcikgXG4gICAgICAgICAgY2VudGVyR2VvbWV0cnkocmVsKTtcbiAgICAgICAgaWYgKGhhc19mdWxsX2dlb21ldHJ5KVxuICAgICAgICAgIGZ1bGxHZW9tZXRyeVJlbGF0aW9uKHJlbCk7XG4gICAgICAgIGVsc2UgaWYgKHJlbC5ib3VuZHMpXG4gICAgICAgICAgYm91bmRzR2VvbWV0cnkocmVsKTtcbiAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgIC8vIHR5cGU9YXJlYSAoZnJvbSBjb29yZC1xdWVyeSkgaXMgYW4gZXhhbXBsZSBmb3IgdGhpcyBjYXNlLlxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gX2NvbnZlcnQyZ2VvSlNPTihub2Rlcyx3YXlzLHJlbHMpO1xuICB9XG4gIGZ1bmN0aW9uIF9vc21YTUwyZ2VvSlNPTih4bWwpIHtcbiAgICAvLyBzb3J0IGVsZW1lbnRzXG4gICAgdmFyIG5vZGVzID0gbmV3IEFycmF5KCk7XG4gICAgdmFyIHdheXMgID0gbmV3IEFycmF5KCk7XG4gICAgdmFyIHJlbHMgID0gbmV3IEFycmF5KCk7XG4gICAgLy8gaGVscGVyIGZ1bmN0aW9uXG4gICAgZnVuY3Rpb24gY29weV9hdHRyaWJ1dGUoIHgsIG8sIGF0dHIgKSB7XG4gICAgICBpZiAoeC5oYXNBdHRyaWJ1dGUoYXR0cikpXG4gICAgICAgIG9bYXR0cl0gPSB4LmdldEF0dHJpYnV0ZShhdHRyKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2VudGVyR2VvbWV0cnkob2JqZWN0LCBjZW50cm9pZCkge1xuICAgICAgdmFyIHBzZXVkb05vZGUgPSBfLmNsb25lKG9iamVjdCk7XG4gICAgICBjb3B5X2F0dHJpYnV0ZShjZW50cm9pZCwgcHNldWRvTm9kZSwgJ2xhdCcpO1xuICAgICAgY29weV9hdHRyaWJ1dGUoY2VudHJvaWQsIHBzZXVkb05vZGUsICdsb24nKTtcbiAgICAgIHBzZXVkb05vZGUuX19pc19jZW50ZXJfcGxhY2Vob2xkZXIgPSB0cnVlO1xuICAgICAgbm9kZXMucHVzaChwc2V1ZG9Ob2RlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gYm91bmRzR2VvbWV0cnkob2JqZWN0LCBib3VuZHMpIHtcbiAgICAgIHZhciBwc2V1ZG9XYXkgPSBfLmNsb25lKG9iamVjdCk7XG4gICAgICBwc2V1ZG9XYXkubm9kZXMgPSBbXTtcbiAgICAgIGZ1bmN0aW9uIGFkZFBzZXVkb05vZGUobGF0LGxvbixpKSB7XG4gICAgICAgIHZhciBwc2V1ZG9Ob2RlID0ge1xuICAgICAgICAgIHR5cGU6XCJub2RlXCIsXG4gICAgICAgICAgaWQ6ICBcIl9cIitwc2V1ZG9XYXkudHlwZStcIi9cIitwc2V1ZG9XYXkuaWQrXCJib3VuZHNcIitpLFxuICAgICAgICAgIGxhdDogbGF0LFxuICAgICAgICAgIGxvbjogbG9uXG4gICAgICAgIH1cbiAgICAgICAgcHNldWRvV2F5Lm5vZGVzLnB1c2gocHNldWRvTm9kZS5pZCk7XG4gICAgICAgIG5vZGVzLnB1c2gocHNldWRvTm9kZSk7XG4gICAgICB9XG4gICAgICBhZGRQc2V1ZG9Ob2RlKGJvdW5kcy5nZXRBdHRyaWJ1dGUoJ21pbmxhdCcpLGJvdW5kcy5nZXRBdHRyaWJ1dGUoJ21pbmxvbicpLDEpO1xuICAgICAgYWRkUHNldWRvTm9kZShib3VuZHMuZ2V0QXR0cmlidXRlKCdtYXhsYXQnKSxib3VuZHMuZ2V0QXR0cmlidXRlKCdtaW5sb24nKSwyKTtcbiAgICAgIGFkZFBzZXVkb05vZGUoYm91bmRzLmdldEF0dHJpYnV0ZSgnbWF4bGF0JyksYm91bmRzLmdldEF0dHJpYnV0ZSgnbWF4bG9uJyksMyk7XG4gICAgICBhZGRQc2V1ZG9Ob2RlKGJvdW5kcy5nZXRBdHRyaWJ1dGUoJ21pbmxhdCcpLGJvdW5kcy5nZXRBdHRyaWJ1dGUoJ21heGxvbicpLDQpO1xuICAgICAgcHNldWRvV2F5Lm5vZGVzLnB1c2gocHNldWRvV2F5Lm5vZGVzWzBdKTtcbiAgICAgIHBzZXVkb1dheS5fX2lzX2JvdW5kc19wbGFjZWhvbGRlciA9IHRydWU7XG4gICAgICB3YXlzLnB1c2gocHNldWRvV2F5KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZnVsbEdlb21ldHJ5V2F5KHdheSwgbmRzKSB7XG4gICAgICBmdW5jdGlvbiBhZGRGdWxsR2VvbWV0cnlOb2RlKGxhdCxsb24saWQpIHtcbiAgICAgICAgdmFyIGdlb21ldHJ5Tm9kZSA9IHtcbiAgICAgICAgICB0eXBlOlwibm9kZVwiLFxuICAgICAgICAgIGlkOiAgaWQsXG4gICAgICAgICAgbGF0OiBsYXQsXG4gICAgICAgICAgbG9uOiBsb24sXG4gICAgICAgICAgX19pc191bmludGVyZXN0aW5nOiB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgbm9kZXMucHVzaChnZW9tZXRyeU5vZGUpO1xuICAgICAgICByZXR1cm4gZ2VvbWV0cnlOb2RlLmlkO1xuICAgICAgfVxuICAgICAgaWYgKCFfLmlzQXJyYXkod2F5Lm5vZGVzKSkge1xuICAgICAgICB3YXkubm9kZXMgPSBbXTtcbiAgICAgICAgXy5lYWNoKCBuZHMsIGZ1bmN0aW9uKCBuZCwgaSApIHtcbiAgICAgICAgICB3YXkubm9kZXMucHVzaChcIl9hbm9ueW1vdXNAXCIrbmQuZ2V0QXR0cmlidXRlKCdsYXQnKStcIi9cIituZC5nZXRBdHRyaWJ1dGUoJ2xvbicpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBfLmVhY2goIG5kcywgZnVuY3Rpb24oIG5kLCBpICkge1xuICAgICAgICBpZiAobmQuZ2V0QXR0cmlidXRlKCdsYXQnKSkge1xuICAgICAgICAgIGFkZEZ1bGxHZW9tZXRyeU5vZGUoXG4gICAgICAgICAgICBuZC5nZXRBdHRyaWJ1dGUoJ2xhdCcpLFxuICAgICAgICAgICAgbmQuZ2V0QXR0cmlidXRlKCdsb24nKSxcbiAgICAgICAgICAgIHdheS5ub2Rlc1tpXVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBmdWxsR2VvbWV0cnlSZWxhdGlvbihyZWwsIG1lbWJlcnMpIHtcbiAgICAgIGZ1bmN0aW9uIGFkZEZ1bGxHZW9tZXRyeU5vZGUobGF0LGxvbixpZCkge1xuICAgICAgICB2YXIgZ2VvbWV0cnlOb2RlID0ge1xuICAgICAgICAgIHR5cGU6XCJub2RlXCIsXG4gICAgICAgICAgaWQ6ICBpZCxcbiAgICAgICAgICBsYXQ6IGxhdCxcbiAgICAgICAgICBsb246IGxvblxuICAgICAgICB9XG4gICAgICAgIG5vZGVzLnB1c2goZ2VvbWV0cnlOb2RlKTtcbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIGFkZEZ1bGxHZW9tZXRyeVdheShuZHMsaWQpIHtcbiAgICAgICAgLy8gc2hhcmVkIG11bHRpcG9seWdvbiB3YXlzIGNhbm5vdCBiZSBkZWZpbmVkIG11bHRpcGxlIHRpbWVzIHdpdGggdGhlIHNhbWUgaWQuXG4gICAgICAgIGlmICh3YXlzLnNvbWUoZnVuY3Rpb24gKHdheSkgeyAvLyB0b2RvOiB0aGlzIGlzIHNsb3cgOihcbiAgICAgICAgICByZXR1cm4gd2F5LnR5cGUgPT0gXCJ3YXlcIiAmJiB3YXkuaWQgPT0gaWQ7XG4gICAgICAgIH0pKSByZXR1cm47XG4gICAgICAgIHZhciBnZW9tZXRyeVdheSA9IHtcbiAgICAgICAgICB0eXBlOiBcIndheVwiLFxuICAgICAgICAgIGlkOiAgIGlkLFxuICAgICAgICAgIG5vZGVzOltdXG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gYWRkRnVsbEdlb21ldHJ5V2F5UHNldWRvTm9kZShsYXQsbG9uKSB7XG4gICAgICAgICAgLy8gdG9kbz8gZG8gbm90IHNhdmUgdGhlIHNhbWUgcHNldWRvIG5vZGUgbXVsdGlwbGUgdGltZXNcbiAgICAgICAgICB2YXIgZ2VvbWV0cnlQc2V1ZG9Ob2RlID0ge1xuICAgICAgICAgICAgdHlwZTpcIm5vZGVcIixcbiAgICAgICAgICAgIGlkOiAgXCJfYW5vbnltb3VzQFwiK2xhdCtcIi9cIitsb24sXG4gICAgICAgICAgICBsYXQ6IGxhdCxcbiAgICAgICAgICAgIGxvbjogbG9uLFxuICAgICAgICAgICAgX19pc191bmludGVyZXN0aW5nOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICAgIGdlb21ldHJ5V2F5Lm5vZGVzLnB1c2goZ2VvbWV0cnlQc2V1ZG9Ob2RlLmlkKTtcbiAgICAgICAgICBub2Rlcy5wdXNoKGdlb21ldHJ5UHNldWRvTm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgXy5lYWNoKG5kcywgZnVuY3Rpb24obmQpIHtcbiAgICAgICAgICBpZiAobmQuZ2V0QXR0cmlidXRlKCdsYXQnKSkge1xuICAgICAgICAgICAgYWRkRnVsbEdlb21ldHJ5V2F5UHNldWRvTm9kZShcbiAgICAgICAgICAgICAgbmQuZ2V0QXR0cmlidXRlKCdsYXQnKSxcbiAgICAgICAgICAgICAgbmQuZ2V0QXR0cmlidXRlKCdsb24nKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2VvbWV0cnlXYXkubm9kZXMucHVzaCh1bmRlZmluZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHdheXMucHVzaChnZW9tZXRyeVdheSk7XG4gICAgICB9XG4gICAgICBfLmVhY2goIG1lbWJlcnMsIGZ1bmN0aW9uKCBtZW1iZXIsIGkgKSB7XG4gICAgICAgIGlmIChyZWwubWVtYmVyc1tpXS50eXBlID09IFwibm9kZVwiKSB7XG4gICAgICAgICAgaWYgKG1lbWJlci5nZXRBdHRyaWJ1dGUoJ2xhdCcpKSB7XG4gICAgICAgICAgICBhZGRGdWxsR2VvbWV0cnlOb2RlKFxuICAgICAgICAgICAgICBtZW1iZXIuZ2V0QXR0cmlidXRlKCdsYXQnKSxcbiAgICAgICAgICAgICAgbWVtYmVyLmdldEF0dHJpYnV0ZSgnbG9uJyksXG4gICAgICAgICAgICAgIHJlbC5tZW1iZXJzW2ldLnJlZlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocmVsLm1lbWJlcnNbaV0udHlwZSA9PSBcIndheVwiKSB7XG4gICAgICAgICAgaWYgKG1lbWJlci5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbmQnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBhZGRGdWxsR2VvbWV0cnlXYXkoXG4gICAgICAgICAgICAgIG1lbWJlci5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbmQnKSxcbiAgICAgICAgICAgICAgcmVsLm1lbWJlcnNbaV0ucmVmXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIC8vIG5vZGVzXG4gICAgXy5lYWNoKCB4bWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ25vZGUnKSwgZnVuY3Rpb24oIG5vZGUsIGkgKSB7XG4gICAgICB2YXIgdGFncyA9IHt9O1xuICAgICAgXy5lYWNoKCBub2RlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0YWcnKSwgZnVuY3Rpb24oIHRhZyApIHtcbiAgICAgICAgdGFnc1t0YWcuZ2V0QXR0cmlidXRlKCdrJyldID0gdGFnLmdldEF0dHJpYnV0ZSgndicpO1xuICAgICAgfSk7XG4gICAgICB2YXIgbm9kZU9iamVjdCA9IHtcbiAgICAgICAgJ3R5cGUnOiAnbm9kZSdcbiAgICAgIH07XG4gICAgICBjb3B5X2F0dHJpYnV0ZSggbm9kZSwgbm9kZU9iamVjdCwgJ2lkJyApO1xuICAgICAgY29weV9hdHRyaWJ1dGUoIG5vZGUsIG5vZGVPYmplY3QsICdsYXQnICk7XG4gICAgICBjb3B5X2F0dHJpYnV0ZSggbm9kZSwgbm9kZU9iamVjdCwgJ2xvbicgKTtcbiAgICAgIGNvcHlfYXR0cmlidXRlKCBub2RlLCBub2RlT2JqZWN0LCAndmVyc2lvbicgKTtcbiAgICAgIGNvcHlfYXR0cmlidXRlKCBub2RlLCBub2RlT2JqZWN0LCAndGltZXN0YW1wJyApO1xuICAgICAgY29weV9hdHRyaWJ1dGUoIG5vZGUsIG5vZGVPYmplY3QsICdjaGFuZ2VzZXQnICk7XG4gICAgICBjb3B5X2F0dHJpYnV0ZSggbm9kZSwgbm9kZU9iamVjdCwgJ3VpZCcgKTtcbiAgICAgIGNvcHlfYXR0cmlidXRlKCBub2RlLCBub2RlT2JqZWN0LCAndXNlcicgKTtcbiAgICAgIGlmICghXy5pc0VtcHR5KHRhZ3MpKVxuICAgICAgICBub2RlT2JqZWN0LnRhZ3MgPSB0YWdzO1xuICAgICAgbm9kZXMucHVzaChub2RlT2JqZWN0KTtcbiAgICB9KTtcbiAgICAvLyB3YXlzXG4gICAgdmFyIGNlbnRyb2lkLGJvdW5kcztcbiAgICBfLmVhY2goIHhtbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnd2F5JyksIGZ1bmN0aW9uKCB3YXksIGkgKSB7XG4gICAgICB2YXIgdGFncyA9IHt9O1xuICAgICAgdmFyIHdub2RlcyA9IFtdO1xuICAgICAgXy5lYWNoKCB3YXkuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RhZycpLCBmdW5jdGlvbiggdGFnICkge1xuICAgICAgICB0YWdzW3RhZy5nZXRBdHRyaWJ1dGUoJ2snKV0gPSB0YWcuZ2V0QXR0cmlidXRlKCd2Jyk7XG4gICAgICB9KTtcbiAgICAgIHZhciBoYXNfZnVsbF9nZW9tZXRyeSA9IGZhbHNlO1xuICAgICAgXy5lYWNoKCB3YXkuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ25kJyksIGZ1bmN0aW9uKCBuZCwgaSApIHtcbiAgICAgICAgdmFyIGlkO1xuICAgICAgICBpZiAoaWQgPSBuZC5nZXRBdHRyaWJ1dGUoJ3JlZicpKVxuICAgICAgICAgIHdub2Rlc1tpXSA9IGlkO1xuICAgICAgICBpZiAoIWhhc19mdWxsX2dlb21ldHJ5ICYmIG5kLmdldEF0dHJpYnV0ZSgnbGF0JykpXG4gICAgICAgICAgaGFzX2Z1bGxfZ2VvbWV0cnkgPSB0cnVlO1xuICAgICAgfSk7XG4gICAgICB2YXIgd2F5T2JqZWN0ID0ge1xuICAgICAgICBcInR5cGVcIjogXCJ3YXlcIlxuICAgICAgfTtcbiAgICAgIGNvcHlfYXR0cmlidXRlKCB3YXksIHdheU9iamVjdCwgJ2lkJyApO1xuICAgICAgY29weV9hdHRyaWJ1dGUoIHdheSwgd2F5T2JqZWN0LCAndmVyc2lvbicgKTtcbiAgICAgIGNvcHlfYXR0cmlidXRlKCB3YXksIHdheU9iamVjdCwgJ3RpbWVzdGFtcCcgKTtcbiAgICAgIGNvcHlfYXR0cmlidXRlKCB3YXksIHdheU9iamVjdCwgJ2NoYW5nZXNldCcgKTtcbiAgICAgIGNvcHlfYXR0cmlidXRlKCB3YXksIHdheU9iamVjdCwgJ3VpZCcgKTtcbiAgICAgIGNvcHlfYXR0cmlidXRlKCB3YXksIHdheU9iamVjdCwgJ3VzZXInICk7XG4gICAgICBpZiAod25vZGVzLmxlbmd0aCA+IDApXG4gICAgICAgIHdheU9iamVjdC5ub2RlcyA9IHdub2RlcztcbiAgICAgIGlmICghXy5pc0VtcHR5KHRhZ3MpKVxuICAgICAgICB3YXlPYmplY3QudGFncyA9IHRhZ3M7XG4gICAgICBpZiAoY2VudHJvaWQgPSB3YXkuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2NlbnRlcicpWzBdKVxuICAgICAgICBjZW50ZXJHZW9tZXRyeSh3YXlPYmplY3QsY2VudHJvaWQpO1xuICAgICAgaWYgKGhhc19mdWxsX2dlb21ldHJ5KVxuICAgICAgICBmdWxsR2VvbWV0cnlXYXkod2F5T2JqZWN0LCB3YXkuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ25kJykpO1xuICAgICAgZWxzZSBpZiAoYm91bmRzID0gd2F5LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib3VuZHMnKVswXSlcbiAgICAgICAgYm91bmRzR2VvbWV0cnkod2F5T2JqZWN0LGJvdW5kcyk7XG4gICAgICB3YXlzLnB1c2god2F5T2JqZWN0KTtcbiAgICB9KTtcbiAgICAvLyByZWxhdGlvbnNcbiAgICBfLmVhY2goIHhtbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgncmVsYXRpb24nKSwgZnVuY3Rpb24oIHJlbGF0aW9uLCBpICkge1xuICAgICAgdmFyIHRhZ3MgPSB7fTtcbiAgICAgIHZhciBtZW1iZXJzID0gW107XG4gICAgICBfLmVhY2goIHJlbGF0aW9uLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0YWcnKSwgZnVuY3Rpb24oIHRhZyApIHtcbiAgICAgICAgdGFnc1t0YWcuZ2V0QXR0cmlidXRlKCdrJyldID0gdGFnLmdldEF0dHJpYnV0ZSgndicpO1xuICAgICAgfSk7XG4gICAgICB2YXIgaGFzX2Z1bGxfZ2VvbWV0cnkgPSBmYWxzZTtcbiAgICAgIF8uZWFjaCggcmVsYXRpb24uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ21lbWJlcicpLCBmdW5jdGlvbiggbWVtYmVyLCBpICkge1xuICAgICAgICBtZW1iZXJzW2ldID0ge307XG4gICAgICAgIGNvcHlfYXR0cmlidXRlKCBtZW1iZXIsIG1lbWJlcnNbaV0sICdyZWYnICk7XG4gICAgICAgIGNvcHlfYXR0cmlidXRlKCBtZW1iZXIsIG1lbWJlcnNbaV0sICdyb2xlJyApO1xuICAgICAgICBjb3B5X2F0dHJpYnV0ZSggbWVtYmVyLCBtZW1iZXJzW2ldLCAndHlwZScgKTtcbiAgICAgICAgaWYgKCFoYXNfZnVsbF9nZW9tZXRyeSAmJiBcbiAgICAgICAgICAgICAobWVtYmVyc1tpXS50eXBlID09ICdub2RlJyAmJiBtZW1iZXIuZ2V0QXR0cmlidXRlKCdsYXQnKSkgfHxcbiAgICAgICAgICAgICAobWVtYmVyc1tpXS50eXBlID09ICd3YXknICAmJiBtZW1iZXIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ25kJykubGVuZ3RoPjApIClcbiAgICAgICAgICBoYXNfZnVsbF9nZW9tZXRyeSA9IHRydWU7XG4gICAgICB9KTtcbiAgICAgIHZhciByZWxPYmplY3QgPSB7XG4gICAgICAgIFwidHlwZVwiOiBcInJlbGF0aW9uXCJcbiAgICAgIH1cbiAgICAgIGNvcHlfYXR0cmlidXRlKCByZWxhdGlvbiwgcmVsT2JqZWN0LCAnaWQnICk7XG4gICAgICBjb3B5X2F0dHJpYnV0ZSggcmVsYXRpb24sIHJlbE9iamVjdCwgJ3ZlcnNpb24nICk7XG4gICAgICBjb3B5X2F0dHJpYnV0ZSggcmVsYXRpb24sIHJlbE9iamVjdCwgJ3RpbWVzdGFtcCcgKTtcbiAgICAgIGNvcHlfYXR0cmlidXRlKCByZWxhdGlvbiwgcmVsT2JqZWN0LCAnY2hhbmdlc2V0JyApO1xuICAgICAgY29weV9hdHRyaWJ1dGUoIHJlbGF0aW9uLCByZWxPYmplY3QsICd1aWQnICk7XG4gICAgICBjb3B5X2F0dHJpYnV0ZSggcmVsYXRpb24sIHJlbE9iamVjdCwgJ3VzZXInICk7XG4gICAgICBpZiAobWVtYmVycy5sZW5ndGggPiAwKVxuICAgICAgICByZWxPYmplY3QubWVtYmVycyA9IG1lbWJlcnM7XG4gICAgICBpZiAoIV8uaXNFbXB0eSh0YWdzKSlcbiAgICAgICAgcmVsT2JqZWN0LnRhZ3MgPSB0YWdzO1xuICAgICAgaWYgKGNlbnRyb2lkID0gcmVsYXRpb24uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2NlbnRlcicpWzBdKVxuICAgICAgICBjZW50ZXJHZW9tZXRyeShyZWxPYmplY3QsY2VudHJvaWQpO1xuICAgICAgaWYgKGhhc19mdWxsX2dlb21ldHJ5KVxuICAgICAgICBmdWxsR2VvbWV0cnlSZWxhdGlvbihyZWxPYmplY3QsIHJlbGF0aW9uLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdtZW1iZXInKSk7XG4gICAgICBlbHNlIGlmIChib3VuZHMgPSByZWxhdGlvbi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm91bmRzJylbMF0pXG4gICAgICAgIGJvdW5kc0dlb21ldHJ5KHJlbE9iamVjdCxib3VuZHMpO1xuICAgICAgcmVscy5wdXNoKHJlbE9iamVjdCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIF9jb252ZXJ0Mmdlb0pTT04obm9kZXMsd2F5cyxyZWxzKTtcbiAgfVxuICBmdW5jdGlvbiBfY29udmVydDJnZW9KU09OKG5vZGVzLHdheXMscmVscykge1xuXG4gICAgLy8gaGVscGVyIGZ1bmN0aW9uIHRoYXQgY2hlY2tzIGlmIHRoZXJlIGFyZSBhbnkgdGFncyBvdGhlciB0aGFuIFwiY3JlYXRlZF9ieVwiLCBcInNvdXJjZVwiLCBldGMuIG9yIGFueSB0YWcgcHJvdmlkZWQgaW4gaWdub3JlX3RhZ3NcbiAgICBmdW5jdGlvbiBoYXNfaW50ZXJlc3RpbmdfdGFncyh0LCBpZ25vcmVfdGFncykge1xuICAgICAgaWYgKHR5cGVvZiBpZ25vcmVfdGFncyAhPT0gXCJvYmplY3RcIilcbiAgICAgICAgaWdub3JlX3RhZ3M9e307XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMudW5pbnRlcmVzdGluZ1RhZ3MgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgcmV0dXJuICFvcHRpb25zLnVuaW50ZXJlc3RpbmdUYWdzKHQsIGlnbm9yZV90YWdzKTtcbiAgICAgIGZvciAodmFyIGsgaW4gdClcbiAgICAgICAgaWYgKCEob3B0aW9ucy51bmludGVyZXN0aW5nVGFnc1trXT09PXRydWUpICYmXG4gICAgICAgICAgICAhKGlnbm9yZV90YWdzW2tdPT09dHJ1ZSB8fCBpZ25vcmVfdGFnc1trXT09PXRba10pKVxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgLy8gaGVscGVyIGZ1bmN0aW9uIHRvIGV4dHJhY3QgbWV0YSBpbmZvcm1hdGlvblxuICAgIGZ1bmN0aW9uIGJ1aWxkX21ldGFfaW5mb3JtYXRpb24ob2JqZWN0KSB7XG4gICAgICB2YXIgcmVzID0ge1xuICAgICAgICBcInRpbWVzdGFtcFwiOiBvYmplY3QudGltZXN0YW1wLFxuICAgICAgICBcInZlcnNpb25cIjogb2JqZWN0LnZlcnNpb24sXG4gICAgICAgIFwiY2hhbmdlc2V0XCI6IG9iamVjdC5jaGFuZ2VzZXQsXG4gICAgICAgIFwidXNlclwiOiBvYmplY3QudXNlcixcbiAgICAgICAgXCJ1aWRcIjogb2JqZWN0LnVpZFxuICAgICAgfTtcbiAgICAgIGZvciAoayBpbiByZXMpXG4gICAgICAgIGlmIChyZXNba10gPT09IHVuZGVmaW5lZClcbiAgICAgICAgICBkZWxldGUgcmVzW2tdO1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICAvLyBzb21lIGRhdGEgcHJvY2Vzc2luZyAoZS5nLiBmaWx0ZXIgbm9kZXMgb25seSB1c2VkIGZvciB3YXlzKVxuICAgIHZhciBub2RlaWRzID0gbmV3IE9iamVjdCgpO1xuICAgIGZvciAodmFyIGk9MDtpPG5vZGVzLmxlbmd0aDtpKyspIHtcbiAgICAgIGlmIChub2Rlc1tpXS5sYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAob3B0aW9ucy52ZXJib3NlKSBjb25zb2xlLndhcm4oJ05vZGUnLG5vZGVzW2ldLnR5cGUrJy8nK25vZGVzW2ldLmlkLCdpZ25vcmVkIGJlY2F1c2UgaXQgaGFzIG5vIGNvb3JkaW5hdGVzJyk7XG4gICAgICAgIGNvbnRpbnVlOyAvLyBpZ25vcmUgbm9kZXMgd2l0aG91dCBjb29yZGluYXRlcyAoZS5nLiByZXR1cm5lZCBieSBhbiBpZHNfb25seSBxdWVyeSlcbiAgICAgIH1cbiAgICAgIG5vZGVpZHNbbm9kZXNbaV0uaWRdID0gbm9kZXNbaV07XG4gICAgfVxuICAgIHZhciBwb2luaWRzID0gbmV3IE9iamVjdCgpO1xuICAgIGZvciAodmFyIGk9MDtpPG5vZGVzLmxlbmd0aDtpKyspIHtcbiAgICAgIGlmICh0eXBlb2Ygbm9kZXNbaV0udGFncyAhPSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgIGhhc19pbnRlcmVzdGluZ190YWdzKG5vZGVzW2ldLnRhZ3MpKSAvLyB0aGlzIGNoZWNrcyBpZiB0aGUgbm9kZSBoYXMgYW55IHRhZ3Mgb3RoZXIgdGhhbiBcImNyZWF0ZWRfYnlcIlxuICAgICAgICBwb2luaWRzW25vZGVzW2ldLmlkXSA9IHRydWU7XG4gICAgfVxuICAgIGZvciAodmFyIGk9MDtpPHJlbHMubGVuZ3RoO2krKykge1xuICAgICAgaWYgKCFfLmlzQXJyYXkocmVsc1tpXS5tZW1iZXJzKSkge1xuICAgICAgICBpZiAob3B0aW9ucy52ZXJib3NlKSBjb25zb2xlLndhcm4oJ1JlbGF0aW9uJyxyZWxzW2ldLnR5cGUrJy8nK3JlbHNbaV0uaWQsJ2lnbm9yZWQgYmVjYXVzZSBpdCBoYXMgbm8gbWVtYmVycycpO1xuICAgICAgICBjb250aW51ZTsgLy8gaWdub3JlIHJlbGF0aW9ucyB3aXRob3V0IG1lbWJlcnMgKGUuZy4gcmV0dXJuZWQgYnkgYW4gaWRzX29ubHkgcXVlcnkpXG4gICAgICB9XG4gICAgICBmb3IgKHZhciBqPTA7ajxyZWxzW2ldLm1lbWJlcnMubGVuZ3RoO2orKykge1xuICAgICAgICBpZiAocmVsc1tpXS5tZW1iZXJzW2pdLnR5cGUgPT0gXCJub2RlXCIpXG4gICAgICAgICAgcG9pbmlkc1tyZWxzW2ldLm1lbWJlcnNbal0ucmVmXSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHZhciB3YXlpZHMgPSBuZXcgT2JqZWN0KCk7XG4gICAgdmFyIHdheW5pZHMgPSBuZXcgT2JqZWN0KCk7XG4gICAgZm9yICh2YXIgaT0wO2k8d2F5cy5sZW5ndGg7aSsrKSB7XG4gICAgICBpZiAoIV8uaXNBcnJheSh3YXlzW2ldLm5vZGVzKSkge1xuICAgICAgICBpZiAob3B0aW9ucy52ZXJib3NlKSBjb25zb2xlLndhcm4oJ1dheScsd2F5c1tpXS50eXBlKycvJyt3YXlzW2ldLmlkLCdpZ25vcmVkIGJlY2F1c2UgaXQgaGFzIG5vIG5vZGVzJyk7XG4gICAgICAgIGNvbnRpbnVlOyAvLyBpZ25vcmUgd2F5cyB3aXRob3V0IG5vZGVzIChlLmcuIHJldHVybmVkIGJ5IGFuIGlkc19vbmx5IHF1ZXJ5KVxuICAgICAgfVxuICAgICAgd2F5aWRzW3dheXNbaV0uaWRdID0gd2F5c1tpXTtcbiAgICAgIGZvciAodmFyIGo9MDtqPHdheXNbaV0ubm9kZXMubGVuZ3RoO2orKykge1xuICAgICAgICB3YXluaWRzW3dheXNbaV0ubm9kZXNbal1dID0gdHJ1ZTtcbiAgICAgICAgd2F5c1tpXS5ub2Rlc1tqXSA9IG5vZGVpZHNbd2F5c1tpXS5ub2Rlc1tqXV07XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBwb2lzID0gbmV3IEFycmF5KCk7XG4gICAgZm9yICh2YXIgaT0wO2k8bm9kZXMubGVuZ3RoO2krKykge1xuICAgICAgaWYgKCgoIXdheW5pZHNbbm9kZXNbaV0uaWRdKSB8fFxuICAgICAgICAgIChwb2luaWRzW25vZGVzW2ldLmlkXSkpICYmXG4gICAgICAgICAgIW5vZGVzW2ldLl9faXNfdW5pbnRlcmVzdGluZylcbiAgICAgICAgcG9pcy5wdXNoKG5vZGVzW2ldKTtcbiAgICB9XG4gICAgdmFyIHJlbGlkcyA9IG5ldyBBcnJheSgpO1xuICAgIGZvciAodmFyIGk9MDtpPHJlbHMubGVuZ3RoO2krKykge1xuICAgICAgaWYgKCFfLmlzQXJyYXkocmVsc1tpXS5tZW1iZXJzKSkge1xuICAgICAgICBpZiAob3B0aW9ucy52ZXJib3NlKSBjb25zb2xlLndhcm4oJ1JlbGF0aW9uJyxyZWxzW2ldLnR5cGUrJy8nK3JlbHNbaV0uaWQsJ2lnbm9yZWQgYmVjYXVzZSBpdCBoYXMgbm8gbWVtYmVycycpO1xuICAgICAgICBjb250aW51ZTsgLy8gaWdub3JlIHJlbGF0aW9ucyB3aXRob3V0IG1lbWJlcnMgKGUuZy4gcmV0dXJuZWQgYnkgYW4gaWRzX29ubHkgcXVlcnkpXG4gICAgICB9XG4gICAgICByZWxpZHNbcmVsc1tpXS5pZF0gPSByZWxzW2ldO1xuICAgIH1cbiAgICB2YXIgcmVsc21hcCA9IHtub2RlOiB7fSwgd2F5OiB7fSwgcmVsYXRpb246IHt9fTtcbiAgICBmb3IgKHZhciBpPTA7aTxyZWxzLmxlbmd0aDtpKyspIHtcbiAgICAgIGlmICghXy5pc0FycmF5KHJlbHNbaV0ubWVtYmVycykpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMudmVyYm9zZSkgY29uc29sZS53YXJuKCdSZWxhdGlvbicscmVsc1tpXS50eXBlKycvJytyZWxzW2ldLmlkLCdpZ25vcmVkIGJlY2F1c2UgaXQgaGFzIG5vIG1lbWJlcnMnKTtcbiAgICAgICAgY29udGludWU7IC8vIGlnbm9yZSByZWxhdGlvbnMgd2l0aG91dCBtZW1iZXJzIChlLmcuIHJldHVybmVkIGJ5IGFuIGlkc19vbmx5IHF1ZXJ5KVxuICAgICAgfVxuICAgICAgZm9yICh2YXIgaj0wO2o8cmVsc1tpXS5tZW1iZXJzLmxlbmd0aDtqKyspIHtcbiAgICAgICAgdmFyIG07XG4gICAgICAgIHN3aXRjaCAocmVsc1tpXS5tZW1iZXJzW2pdLnR5cGUpIHtcbiAgICAgICAgICBjYXNlIFwibm9kZVwiOlxuICAgICAgICAgICAgbSA9IG5vZGVpZHNbcmVsc1tpXS5tZW1iZXJzW2pdLnJlZl07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBcIndheVwiOlxuICAgICAgICAgICAgbSA9IHdheWlkc1tyZWxzW2ldLm1lbWJlcnNbal0ucmVmXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwicmVsYXRpb25cIjpcbiAgICAgICAgICAgIG0gPSByZWxpZHNbcmVsc1tpXS5tZW1iZXJzW2pdLnJlZl07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFtKSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMudmVyYm9zZSkgY29uc29sZS53YXJuKCdSZWxhdGlvbicscmVsc1tpXS50eXBlKycvJytyZWxzW2ldLmlkLCdtZW1iZXInLHJlbHNbaV0ubWVtYmVyc1tqXS50eXBlKycvJytyZWxzW2ldLm1lbWJlcnNbal0uaWQsJ2lnbm9yZWQgYmVjYXVzZSBpdCBoYXMgYW4gaW52YWxpZCB0eXBlJyk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1fdHlwZSA9IHJlbHNbaV0ubWVtYmVyc1tqXS50eXBlO1xuICAgICAgICB2YXIgbV9yZWYgPSByZWxzW2ldLm1lbWJlcnNbal0ucmVmO1xuICAgICAgICBpZiAodHlwZW9mIHJlbHNtYXBbbV90eXBlXVttX3JlZl0gPT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgcmVsc21hcFttX3R5cGVdW21fcmVmXSA9IFtdO1xuICAgICAgICByZWxzbWFwW21fdHlwZV1bbV9yZWZdLnB1c2goe1xuICAgICAgICAgIFwicm9sZVwiIDogcmVsc1tpXS5tZW1iZXJzW2pdLnJvbGUsXG4gICAgICAgICAgXCJyZWxcIiA6IHJlbHNbaV0uaWQsXG4gICAgICAgICAgXCJyZWx0YWdzXCIgOiByZWxzW2ldLnRhZ3MsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBjb25zdHJ1Y3QgZ2VvanNvblxuICAgIHZhciBnZW9qc29uO1xuICAgIHZhciBnZW9qc29ubm9kZXMgPSB7XG4gICAgICBcInR5cGVcIiAgICAgOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gICAgICBcImZlYXR1cmVzXCIgOiBuZXcgQXJyYXkoKX07XG4gICAgZm9yIChpPTA7aTxwb2lzLmxlbmd0aDtpKyspIHtcbiAgICAgIGlmICh0eXBlb2YgcG9pc1tpXS5sb24gPT0gXCJ1bmRlZmluZWRcIiB8fCB0eXBlb2YgcG9pc1tpXS5sYXQgPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAob3B0aW9ucy52ZXJib3NlKSBjb25zb2xlLndhcm4oJ1BPSScscG9pc1tpXS50eXBlKycvJytwb2lzW2ldLmlkLCdpZ25vcmVkIGJlY2F1c2UgaXQgbGFja3MgY29vcmRpbmF0ZXMnKTtcbiAgICAgICAgY29udGludWU7IC8vIGxvbiBhbmQgbGF0IGFyZSByZXF1aXJlZCBmb3Igc2hvd2luZyBhIHBvaW50XG4gICAgICB9XG4gICAgICB2YXIgZmVhdHVyZSA9IHtcbiAgICAgICAgXCJ0eXBlXCIgICAgICAgOiBcIkZlYXR1cmVcIixcbiAgICAgICAgXCJpZFwiICAgICAgICAgOiBwb2lzW2ldLnR5cGUrXCIvXCIrcG9pc1tpXS5pZCxcbiAgICAgICAgXCJwcm9wZXJ0aWVzXCIgOiB7XG4gICAgICAgICAgXCJ0eXBlXCIgOiBwb2lzW2ldLnR5cGUsXG4gICAgICAgICAgXCJpZFwiICAgOiBwb2lzW2ldLmlkLFxuICAgICAgICAgIFwidGFnc1wiIDogcG9pc1tpXS50YWdzIHx8IHt9LFxuICAgICAgICAgIFwicmVsYXRpb25zXCIgOiByZWxzbWFwW1wibm9kZVwiXVtwb2lzW2ldLmlkXSB8fCBbXSxcbiAgICAgICAgICBcIm1ldGFcIjogYnVpbGRfbWV0YV9pbmZvcm1hdGlvbihwb2lzW2ldKVxuICAgICAgICB9LFxuICAgICAgICBcImdlb21ldHJ5XCIgICA6IHtcbiAgICAgICAgICBcInR5cGVcIiA6IFwiUG9pbnRcIixcbiAgICAgICAgICBcImNvb3JkaW5hdGVzXCIgOiBbK3BvaXNbaV0ubG9uLCArcG9pc1tpXS5sYXRdLFxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgaWYgKHBvaXNbaV0uX19pc19jZW50ZXJfcGxhY2Vob2xkZXIpXG4gICAgICAgIGZlYXR1cmUucHJvcGVydGllc1tcImdlb21ldHJ5XCJdID0gXCJjZW50ZXJcIjtcbiAgICAgIGdlb2pzb25ub2Rlcy5mZWF0dXJlcy5wdXNoKGZlYXR1cmUpO1xuICAgIH1cbiAgICB2YXIgZ2VvanNvbmxpbmVzID0ge1xuICAgICAgXCJ0eXBlXCIgICAgIDogXCJGZWF0dXJlQ29sbGVjdGlvblwiLFxuICAgICAgXCJmZWF0dXJlc1wiIDogbmV3IEFycmF5KCl9O1xuICAgIHZhciBnZW9qc29ucG9seWdvbnMgPSB7XG4gICAgICBcInR5cGVcIiAgICAgOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gICAgICBcImZlYXR1cmVzXCIgOiBuZXcgQXJyYXkoKX07XG4gICAgLy8gcHJvY2VzcyBtdWx0aXBvbHlnb25zXG4gICAgZm9yICh2YXIgaT0wO2k8cmVscy5sZW5ndGg7aSsrKSB7XG4gICAgICBpZiAoKHR5cGVvZiByZWxzW2ldLnRhZ3MgIT0gXCJ1bmRlZmluZWRcIikgJiZcbiAgICAgICAgICAocmVsc1tpXS50YWdzW1widHlwZVwiXSA9PSBcIm11bHRpcG9seWdvblwiIHx8IHJlbHNbaV0udGFnc1tcInR5cGVcIl0gPT0gXCJib3VuZGFyeVwiKSkge1xuICAgICAgICBpZiAoIV8uaXNBcnJheShyZWxzW2ldLm1lbWJlcnMpKSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMudmVyYm9zZSkgY29uc29sZS53YXJuKCdNdWx0aXBvbHlnb24nLHJlbHNbaV0udHlwZSsnLycrcmVsc1tpXS5pZCwnaWdub3JlZCBiZWNhdXNlIGl0IGhhcyBubyBtZW1iZXJzJyk7XG4gICAgICAgICAgY29udGludWU7IC8vIGlnbm9yZSByZWxhdGlvbnMgd2l0aG91dCBtZW1iZXJzIChlLmcuIHJldHVybmVkIGJ5IGFuIGlkc19vbmx5IHF1ZXJ5KVxuICAgICAgICB9XG4gICAgICAgIHZhciBvdXRlcl9jb3VudCA9IDA7XG4gICAgICAgIGZvciAodmFyIGo9MDtqPHJlbHNbaV0ubWVtYmVycy5sZW5ndGg7aisrKVxuICAgICAgICAgIGlmIChyZWxzW2ldLm1lbWJlcnNbal0ucm9sZSA9PSBcIm91dGVyXCIpXG4gICAgICAgICAgICBvdXRlcl9jb3VudCsrO1xuICAgICAgICAgIGVsc2UgaWYgKG9wdGlvbnMudmVyYm9zZSAmJiByZWxzW2ldLm1lbWJlcnNbal0ucm9sZSAhPSBcImlubmVyXCIpXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ011bHRpcG9seWdvbicscmVsc1tpXS50eXBlKycvJytyZWxzW2ldLmlkLCdtZW1iZXInLHJlbHNbaV0ubWVtYmVyc1tqXS50eXBlKycvJytyZWxzW2ldLm1lbWJlcnNbal0ucmVmLCdpZ25vcmVkIGJlY2F1c2UgaXQgaGFzIGFuIGludmFsaWQgcm9sZTogXCInICsgcmVsc1tpXS5tZW1iZXJzW2pdLnJvbGUgKyAnXCInKTtcbiAgICAgICAgcmVsc1tpXS5tZW1iZXJzLmZvckVhY2goZnVuY3Rpb24obSkge1xuICAgICAgICAgIGlmICh3YXlpZHNbbS5yZWZdKSB7XG4gICAgICAgICAgICAvLyB0aGlzIGV2ZW4gd29ya3MgaW4gdGhlIGZvbGxvd2luZyBjb3JuZXIgY2FzZTpcbiAgICAgICAgICAgIC8vIGEgbXVsdGlwb2x5Z29uIGFtZW5pdHk9eHh4IHdpdGggb3V0ZXIgbGluZSB0YWdnZWQgYW1lbml0eT15eXlcbiAgICAgICAgICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vdHlyYXNkL29zbXRvZ2VvanNvbi9pc3N1ZXMvN1xuICAgICAgICAgICAgaWYgKG0ucm9sZT09PVwib3V0ZXJcIiAmJiAhaGFzX2ludGVyZXN0aW5nX3RhZ3Mod2F5aWRzW20ucmVmXS50YWdzLHJlbHNbaV0udGFncykpXG4gICAgICAgICAgICAgIHdheWlkc1ttLnJlZl0uaXNfbXVsdGlwb2x5Z29uX291dGxpbmUgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKG0ucm9sZT09PVwiaW5uZXJcIiAmJiAhaGFzX2ludGVyZXN0aW5nX3RhZ3Mod2F5aWRzW20ucmVmXS50YWdzKSlcbiAgICAgICAgICAgICAgd2F5aWRzW20ucmVmXS5pc19tdWx0aXBvbHlnb25fb3V0bGluZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKG91dGVyX2NvdW50ID09IDApIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy52ZXJib3NlKSBjb25zb2xlLndhcm4oJ011bHRpcG9seWdvbiByZWxhdGlvbicscmVsc1tpXS50eXBlKycvJytyZWxzW2ldLmlkLCdpZ25vcmVkIGJlY2F1c2UgaXQgaGFzIG5vIG91dGVyIHdheXMnKTtcbiAgICAgICAgICBjb250aW51ZTsgLy8gaWdub3JlIG11bHRpcG9seWdvbnMgd2l0aG91dCBvdXRlciB3YXlzXG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNpbXBsZV9tcCA9IGZhbHNlO1xuICAgICAgICB2YXIgbXBfZ2VvbWV0cnkgPSAnJztcbiAgICAgICAgaWYgKG91dGVyX2NvdW50ID09IDEgJiYgIWhhc19pbnRlcmVzdGluZ190YWdzKHJlbHNbaV0udGFncywge1widHlwZVwiOnRydWV9KSlcbiAgICAgICAgICBzaW1wbGVfbXAgPSB0cnVlO1xuICAgICAgICB2YXIgZmVhdHVyZSA9IG51bGw7XG4gICAgICAgIGlmICghc2ltcGxlX21wKSB7XG4gICAgICAgICAgZmVhdHVyZSA9IGNvbnN0cnVjdF9tdWx0aXBvbHlnb24ocmVsc1tpXSwgcmVsc1tpXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gc2ltcGxlIG11bHRpcG9seWdvblxuICAgICAgICAgIHZhciBvdXRlcl93YXkgPSByZWxzW2ldLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uKG0pIHtyZXR1cm4gbS5yb2xlID09PSBcIm91dGVyXCI7fSlbMF07XG4gICAgICAgICAgb3V0ZXJfd2F5ID0gd2F5aWRzW291dGVyX3dheS5yZWZdO1xuICAgICAgICAgIGlmIChvdXRlcl93YXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMudmVyYm9zZSkgY29uc29sZS53YXJuKCdNdWx0aXBvbHlnb24gcmVsYXRpb24nLHJlbHNbaV0udHlwZSsnLycrcmVsc1tpXS5pZCwnaWdub3JlZCBiZWNhdXNlIG91dGVyIHdheScsIG91dGVyX3dheS50eXBlKycvJytvdXRlcl93YXkucmVmLCdpcyBtaXNzaW5nJyk7XG4gICAgICAgICAgICBjb250aW51ZTsgLy8gYWJvcnQgaWYgb3V0ZXIgd2F5IG9iamVjdCBpcyBub3QgcHJlc2VudFxuICAgICAgICAgIH1cbiAgICAgICAgICBvdXRlcl93YXkuaXNfbXVsdGlwb2x5Z29uX291dGxpbmUgPSB0cnVlO1xuICAgICAgICAgIGZlYXR1cmUgPSBjb25zdHJ1Y3RfbXVsdGlwb2x5Z29uKG91dGVyX3dheSwgcmVsc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZlYXR1cmUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMudmVyYm9zZSkgY29uc29sZS53YXJuKCdNdWx0aXBvbHlnb24gcmVsYXRpb24nLHJlbHNbaV0udHlwZSsnLycrcmVsc1tpXS5pZCwnaWdub3JlZCBiZWNhdXNlIGl0IGhhcyBpbnZhbGlkIGdlb21ldHJ5Jyk7XG4gICAgICAgICAgY29udGludWU7IC8vIGFib3J0IGlmIGZlYXR1cmUgY291bGQgbm90IGJlIGNvbnN0cnVjdGVkXG4gICAgICAgIH1cbiAgICAgICAgZ2VvanNvbnBvbHlnb25zLmZlYXR1cmVzLnB1c2goZmVhdHVyZSk7XG4gICAgICAgIGZ1bmN0aW9uIGNvbnN0cnVjdF9tdWx0aXBvbHlnb24odGFnX29iamVjdCwgcmVsKSB7XG4gICAgICAgICAgdmFyIGlzX3RhaW50ZWQgPSBmYWxzZTtcbiAgICAgICAgICB2YXIgbXBfZ2VvbWV0cnkgPSBzaW1wbGVfbXAgPyAnd2F5JyA6ICdyZWxhdGlvbidcbiAgICAgICAgICAvLyBwcmVwYXJlIG1wIG1lbWJlcnNcbiAgICAgICAgICB2YXIgbWVtYmVycztcbiAgICAgICAgICBtZW1iZXJzID0gcmVsLm1lbWJlcnMuZmlsdGVyKGZ1bmN0aW9uKG0pIHtyZXR1cm4gbS50eXBlID09PSBcIndheVwiO30pO1xuICAgICAgICAgIG1lbWJlcnMgPSBtZW1iZXJzLm1hcChmdW5jdGlvbihtKSB7XG4gICAgICAgICAgICB2YXIgd2F5ID0gd2F5aWRzW20ucmVmXTtcbiAgICAgICAgICAgIGlmICh3YXkgPT09IHVuZGVmaW5lZCkgeyAvLyBjaGVjayBmb3IgbWlzc2luZyB3YXlzXG4gICAgICAgICAgICAgIGlmIChvcHRpb25zLnZlcmJvc2UpIGNvbnNvbGUud2FybignTXVsdGlwb2x5Z29uJywgbXBfZ2VvbWV0cnkrJy8nK3RhZ19vYmplY3QuaWQsICd0YWludGVkIGJ5IGEgbWlzc2luZyB3YXknLCBtLnR5cGUrJy8nK20ucmVmKTtcbiAgICAgICAgICAgICAgaXNfdGFpbnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7IC8vIFRPRE86IHRoaXMgaXMgc2xvdyEgOihcbiAgICAgICAgICAgICAgaWQ6IG0ucmVmLFxuICAgICAgICAgICAgICByb2xlOiBtLnJvbGUgfHwgXCJvdXRlclwiLFxuICAgICAgICAgICAgICB3YXk6IHdheSxcbiAgICAgICAgICAgICAgbm9kZXM6IHdheS5ub2Rlcy5maWx0ZXIoZnVuY3Rpb24obikge1xuICAgICAgICAgICAgICAgIGlmIChuICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpc190YWludGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy52ZXJib3NlKSBjb25zb2xlLndhcm4oJ011bHRpcG9seWdvbicsIG1wX2dlb21ldHJ5KycvJyt0YWdfb2JqZWN0LmlkLCAgJ3RhaW50ZWQgYnkgYSB3YXknLCBtLnR5cGUrJy8nK20ucmVmLCAnd2l0aCBhIG1pc3Npbmcgbm9kZScpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbWVtYmVycyA9IF8uY29tcGFjdChtZW1iZXJzKTtcbiAgICAgICAgICAvLyBjb25zdHJ1Y3Qgb3V0ZXIgYW5kIGlubmVyIHJpbmdzXG4gICAgICAgICAgdmFyIG91dGVycywgaW5uZXJzO1xuICAgICAgICAgIGZ1bmN0aW9uIGpvaW4od2F5cykge1xuICAgICAgICAgICAgdmFyIF9maXJzdCA9IGZ1bmN0aW9uKGFycikge3JldHVybiBhcnJbMF19O1xuICAgICAgICAgICAgdmFyIF9sYXN0ICA9IGZ1bmN0aW9uKGFycikge3JldHVybiBhcnJbYXJyLmxlbmd0aC0xXX07XG4gICAgICAgICAgICAvLyBzdG9sZW4gZnJvbSBpRC9yZWxhdGlvbi5qc1xuICAgICAgICAgICAgdmFyIGpvaW5lZCA9IFtdLCBjdXJyZW50LCBmaXJzdCwgbGFzdCwgaSwgaG93LCB3aGF0O1xuICAgICAgICAgICAgd2hpbGUgKHdheXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIGN1cnJlbnQgPSB3YXlzLnBvcCgpLm5vZGVzLnNsaWNlKCk7XG4gICAgICAgICAgICAgIGpvaW5lZC5wdXNoKGN1cnJlbnQpO1xuICAgICAgICAgICAgICB3aGlsZSAod2F5cy5sZW5ndGggJiYgX2ZpcnN0KGN1cnJlbnQpICE9PSBfbGFzdChjdXJyZW50KSkge1xuICAgICAgICAgICAgICAgIGZpcnN0ID0gX2ZpcnN0KGN1cnJlbnQpO1xuICAgICAgICAgICAgICAgIGxhc3QgID0gX2xhc3QoY3VycmVudCk7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHdheXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgIHdoYXQgPSB3YXlzW2ldLm5vZGVzO1xuICAgICAgICAgICAgICAgICAgaWYgKGxhc3QgPT09IF9maXJzdCh3aGF0KSkge1xuICAgICAgICAgICAgICAgICAgICBob3cgID0gY3VycmVudC5wdXNoO1xuICAgICAgICAgICAgICAgICAgICB3aGF0ID0gd2hhdC5zbGljZSgxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxhc3QgPT09IF9sYXN0KHdoYXQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGhvdyAgPSBjdXJyZW50LnB1c2g7XG4gICAgICAgICAgICAgICAgICAgIHdoYXQgPSB3aGF0LnNsaWNlKDAsIC0xKS5yZXZlcnNlKCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmaXJzdCA9PSBfbGFzdCh3aGF0KSkge1xuICAgICAgICAgICAgICAgICAgICBob3cgID0gY3VycmVudC51bnNoaWZ0O1xuICAgICAgICAgICAgICAgICAgICB3aGF0ID0gd2hhdC5zbGljZSgwLCAtMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmaXJzdCA9PSBfZmlyc3Qod2hhdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgaG93ICA9IGN1cnJlbnQudW5zaGlmdDtcbiAgICAgICAgICAgICAgICAgICAgd2hhdCA9IHdoYXQuc2xpY2UoMSkucmV2ZXJzZSgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdoYXQgPSBob3cgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXdoYXQpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnZlcmJvc2UpIGNvbnNvbGUud2FybignTXVsdGlwb2x5Z29uJywgbXBfZ2VvbWV0cnkrJy8nK3RhZ19vYmplY3QuaWQsICdjb250YWlucyB1bmNsb3NlZCByaW5nIGdlb21ldHJ5Jyk7XG4gICAgICAgICAgICAgICAgICBicmVhazsgLy8gSW52YWxpZCBnZW9tZXRyeSAoZGFuZ2xpbmcgd2F5LCB1bmNsb3NlZCByaW5nKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3YXlzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBob3cuYXBwbHkoY3VycmVudCwgd2hhdCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBqb2luZWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIG91dGVycyA9IGpvaW4obWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obSkge3JldHVybiBtLnJvbGU9PT1cIm91dGVyXCI7fSkpO1xuICAgICAgICAgIGlubmVycyA9IGpvaW4obWVtYmVycy5maWx0ZXIoZnVuY3Rpb24obSkge3JldHVybiBtLnJvbGU9PT1cImlubmVyXCI7fSkpO1xuICAgICAgICAgIC8vIHNvcnQgcmluZ3NcbiAgICAgICAgICB2YXIgbXA7XG4gICAgICAgICAgZnVuY3Rpb24gZmluZE91dGVyKGlubmVyKSB7XG4gICAgICAgICAgICB2YXIgcG9seWdvbkludGVyc2VjdHNQb2x5Z29uID0gZnVuY3Rpb24ob3V0ZXIsIGlubmVyKSB7XG4gICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTxpbm5lci5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgICAgICBpZiAocG9pbnRJblBvbHlnb24oaW5uZXJbaV0sIG91dGVyKSlcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbWFwQ29vcmRpbmF0ZXMgPSBmdW5jdGlvbihmcm9tKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmcm9tLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsrbi5sYXQsK24ubG9uXTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBzdG9sZW4gZnJvbSBpRC9nZW8uanMsXG4gICAgICAgICAgICAvLyBiYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vc3Vic3RhY2svcG9pbnQtaW4tcG9seWdvbixcbiAgICAgICAgICAgIC8vIHJheS1jYXN0aW5nIGFsZ29yaXRobSBiYXNlZCBvbiBodHRwOi8vd3d3LmVjc2UucnBpLmVkdS9Ib21lcGFnZXMvd3JmL1Jlc2VhcmNoL1Nob3J0X05vdGVzL3BucG9seS5odG1sXG4gICAgICAgICAgICB2YXIgcG9pbnRJblBvbHlnb24gPSBmdW5jdGlvbihwb2ludCwgcG9seWdvbikge1xuICAgICAgICAgICAgICB2YXIgeCA9IHBvaW50WzBdLCB5ID0gcG9pbnRbMV0sIGluc2lkZSA9IGZhbHNlO1xuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IHBvbHlnb24ubGVuZ3RoIC0gMTsgaSA8IHBvbHlnb24ubGVuZ3RoOyBqID0gaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHhpID0gcG9seWdvbltpXVswXSwgeWkgPSBwb2x5Z29uW2ldWzFdO1xuICAgICAgICAgICAgICAgIHZhciB4aiA9IHBvbHlnb25bal1bMF0sIHlqID0gcG9seWdvbltqXVsxXTtcbiAgICAgICAgICAgICAgICB2YXIgaW50ZXJzZWN0ID0gKCh5aSA+IHkpICE9ICh5aiA+IHkpKSAmJlxuICAgICAgICAgICAgICAgICAgKHggPCAoeGogLSB4aSkgKiAoeSAtIHlpKSAvICh5aiAtIHlpKSArIHhpKTtcbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJzZWN0KSBpbnNpZGUgPSAhaW5zaWRlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBpbnNpZGU7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gc3RvbGVuIGZyb20gaUQvcmVsYXRpb24uanNcbiAgICAgICAgICAgIHZhciBvLCBvdXRlcjtcbiAgICAgICAgICAgIC8vIHRvZG86IGFsbCB0aGlzIGNvb3JkaW5hdGUgbWFwcGluZyBtYWtlcyB0aGlzIHVubmVjY2VzYXJpbHkgc2xvdy5cbiAgICAgICAgICAgIC8vIHNlZSB0aGUgXCJ0b2RvOiB0aGlzIGlzIHNsb3chIDooXCIgYWJvdmUuXG4gICAgICAgICAgICBpbm5lciA9IG1hcENvb3JkaW5hdGVzKGlubmVyKTtcbiAgICAgICAgICAgIC8qZm9yIChvID0gMDsgbyA8IG91dGVycy5sZW5ndGg7IG8rKykge1xuICAgICAgICAgICAgICBvdXRlciA9IG1hcENvb3JkaW5hdGVzKG91dGVyc1tvXSk7XG4gICAgICAgICAgICAgIGlmIChwb2x5Z29uQ29udGFpbnNQb2x5Z29uKG91dGVyLCBpbm5lcikpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG87XG4gICAgICAgICAgICB9Ki9cbiAgICAgICAgICAgIGZvciAobyA9IDA7IG8gPCBvdXRlcnMubGVuZ3RoOyBvKyspIHtcbiAgICAgICAgICAgICAgb3V0ZXIgPSBtYXBDb29yZGluYXRlcyhvdXRlcnNbb10pO1xuICAgICAgICAgICAgICBpZiAocG9seWdvbkludGVyc2VjdHNQb2x5Z29uKG91dGVyLCBpbm5lcikpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIG1wID0gb3V0ZXJzLm1hcChmdW5jdGlvbihvKSB7cmV0dXJuIFtvXTt9KTtcbiAgICAgICAgICBmb3IgKHZhciBqPTA7IGo8aW5uZXJzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICB2YXIgbyA9IGZpbmRPdXRlcihpbm5lcnNbal0pO1xuICAgICAgICAgICAgaWYgKG8gIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgbXBbb10ucHVzaChpbm5lcnNbal0pO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBpZiAob3B0aW9ucy52ZXJib3NlKSBjb25zb2xlLndhcm4oJ011bHRpcG9seWdvbicsIG1wX2dlb21ldHJ5KycvJyt0YWdfb2JqZWN0LmlkLCAnY29udGFpbnMgYW4gaW5uZXIgcmluZyB3aXRoIG5vIGNvbnRhaW5pbmcgb3V0ZXInKTtcbiAgICAgICAgICAgICAgLy8gc28sIG5vIG91dGVyIHJpbmcgZm9yIHRoaXMgaW5uZXIgcmluZyBpcyBmb3VuZC5cbiAgICAgICAgICAgICAgLy8gV2UncmUgZ29pbmcgdG8gaWdub3JlIGhvbGVzIGluIGVtcHR5IHNwYWNlLlxuICAgICAgICAgICAgICA7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIHNhbml0aXplIG1wLWNvb3JkaW5hdGVzIChyZW1vdmUgZW1wdHkgY2x1c3RlcnMgb3IgcmluZ3MsIHtsYXQsbG9uLC4uLn0gdG8gW2xvbixsYXRdXG4gICAgICAgICAgdmFyIG1wX2Nvb3JkcyA9IFtdO1xuICAgICAgICAgIG1wX2Nvb3JkcyA9IF8uY29tcGFjdChtcC5tYXAoZnVuY3Rpb24oY2x1c3Rlcikge1xuICAgICAgICAgICAgdmFyIGNsID0gXy5jb21wYWN0KGNsdXN0ZXIubWFwKGZ1bmN0aW9uKHJpbmcpIHtcbiAgICAgICAgICAgICAgaWYgKHJpbmcubGVuZ3RoIDwgNCkgeyAvLyB0b2RvOiBpcyB0aGlzIGNvcnJlY3Q6IHJpbmcubGVuZ3RoIDwgNCA/XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMudmVyYm9zZSkgY29uc29sZS53YXJuKCdNdWx0aXBvbHlnb24nLCBtcF9nZW9tZXRyeSsnLycrdGFnX29iamVjdC5pZCwgJ2NvbnRhaW5zIGEgcmluZyB3aXRoIGxlc3MgdGhhbiBmb3VyIG5vZGVzJyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBfLmNvbXBhY3QocmluZy5tYXAoZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbK25vZGUubG9uLCtub2RlLmxhdF07XG4gICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIGlmIChjbC5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICBpZiAob3B0aW9ucy52ZXJib3NlKSBjb25zb2xlLndhcm4oJ011bHRpcG9seWdvbicsIG1wX2dlb21ldHJ5KycvJyt0YWdfb2JqZWN0LmlkLCAnY29udGFpbnMgYW4gZW1wdHkgcmluZyBjbHVzdGVyJyk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjbDtcbiAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICBpZiAobXBfY29vcmRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy52ZXJib3NlKSBjb25zb2xlLndhcm4oJ011bHRpcG9seWdvbicsIG1wX2dlb21ldHJ5KycvJyt0YWdfb2JqZWN0LmlkLCAnY29udGFpbnMgbm8gY29vcmRpbmF0ZXMnKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gaWdub3JlIG11bHRpcG9seWdvbnMgd2l0aG91dCBjb29yZGluYXRlc1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgbXBfdHlwZSA9IFwiTXVsdGlQb2x5Z29uXCI7XG4gICAgICAgICAgaWYgKG1wX2Nvb3Jkcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIG1wX3R5cGUgPSBcIlBvbHlnb25cIjtcbiAgICAgICAgICAgIG1wX2Nvb3JkcyA9IG1wX2Nvb3Jkc1swXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gbXAgcGFyc2VkLCBub3cgY29uc3RydWN0IHRoZSBnZW9KU09OXG4gICAgICAgICAgdmFyIGZlYXR1cmUgPSB7XG4gICAgICAgICAgICBcInR5cGVcIiAgICAgICA6IFwiRmVhdHVyZVwiLFxuICAgICAgICAgICAgXCJpZFwiICAgICAgICAgOiB0YWdfb2JqZWN0LnR5cGUrXCIvXCIrdGFnX29iamVjdC5pZCxcbiAgICAgICAgICAgIFwicHJvcGVydGllc1wiIDoge1xuICAgICAgICAgICAgICBcInR5cGVcIiA6IHRhZ19vYmplY3QudHlwZSxcbiAgICAgICAgICAgICAgXCJpZFwiICAgOiB0YWdfb2JqZWN0LmlkLFxuICAgICAgICAgICAgICBcInRhZ3NcIiA6IHRhZ19vYmplY3QudGFncyB8fCB7fSxcbiAgICAgICAgICAgICAgXCJyZWxhdGlvbnNcIiA6ICByZWxzbWFwW3RhZ19vYmplY3QudHlwZV1bdGFnX29iamVjdC5pZF0gfHwgW10sXG4gICAgICAgICAgICAgIFwibWV0YVwiOiBidWlsZF9tZXRhX2luZm9ybWF0aW9uKHRhZ19vYmplY3QpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZW9tZXRyeVwiICAgOiB7XG4gICAgICAgICAgICAgIFwidHlwZVwiIDogbXBfdHlwZSxcbiAgICAgICAgICAgICAgXCJjb29yZGluYXRlc1wiIDogbXBfY29vcmRzLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXNfdGFpbnRlZCkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMudmVyYm9zZSkgY29uc29sZS53YXJuKCdNdWx0aXBvbHlnb24nLCBtcF9nZW9tZXRyeSsnLycrdGFnX29iamVjdC5pZCwgJ2lzIHRhaW50ZWQnKTtcbiAgICAgICAgICAgIGZlYXR1cmUucHJvcGVydGllc1tcInRhaW50ZWRcIl0gPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZmVhdHVyZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBwcm9jZXNzIGxpbmVzIGFuZCBwb2x5Z29uc1xuICAgIGZvciAodmFyIGk9MDtpPHdheXMubGVuZ3RoO2krKykge1xuICAgICAgaWYgKCFfLmlzQXJyYXkod2F5c1tpXS5ub2RlcykpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMudmVyYm9zZSkgY29uc29sZS53YXJuKCdXYXknLHdheXNbaV0udHlwZSsnLycrd2F5c1tpXS5pZCwnaWdub3JlZCBiZWNhdXNlIGl0IGhhcyBubyBub2RlcycpO1xuICAgICAgICBjb250aW51ZTsgLy8gaWdub3JlIHdheXMgd2l0aG91dCBub2RlcyAoZS5nLiByZXR1cm5lZCBieSBhbiBpZHNfb25seSBxdWVyeSlcbiAgICAgIH1cbiAgICAgIGlmICh3YXlzW2ldLmlzX211bHRpcG9seWdvbl9vdXRsaW5lKVxuICAgICAgICBjb250aW51ZTsgLy8gaWdub3JlIHdheXMgd2hpY2ggYXJlIGFscmVhZHkgcmVuZGVyZWQgYXMgKHBhcnQgb2YpIGEgbXVsdGlwb2x5Z29uXG4gICAgICB3YXlzW2ldLnRhaW50ZWQgPSBmYWxzZTtcbiAgICAgIHdheXNbaV0uaGlkZGVuID0gZmFsc2U7XG4gICAgICBjb29yZHMgPSBuZXcgQXJyYXkoKTtcbiAgICAgIGZvciAoaj0wO2o8d2F5c1tpXS5ub2Rlcy5sZW5ndGg7aisrKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygd2F5c1tpXS5ub2Rlc1tqXSA9PSBcIm9iamVjdFwiKVxuICAgICAgICAgIGNvb3Jkcy5wdXNoKFsrd2F5c1tpXS5ub2Rlc1tqXS5sb24sICt3YXlzW2ldLm5vZGVzW2pdLmxhdF0pO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy52ZXJib3NlKSBjb25zb2xlLndhcm4oJ1dheScsd2F5c1tpXS50eXBlKycvJyt3YXlzW2ldLmlkLCdpcyB0YWludGVkIGJ5IGFuIGludmFsaWQgbm9kZScpO1xuICAgICAgICAgIHdheXNbaV0udGFpbnRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChjb29yZHMubGVuZ3RoIDw9IDEpIHsgLy8gaW52YWxpZCB3YXkgZ2VvbWV0cnlcbiAgICAgICAgaWYgKG9wdGlvbnMudmVyYm9zZSkgY29uc29sZS53YXJuKCdXYXknLHdheXNbaV0udHlwZSsnLycrd2F5c1tpXS5pZCwnaWdub3JlZCBiZWNhdXNlIGl0IGNvbnRhaW5zIHRvbyBmZXcgbm9kZXMnKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICB2YXIgd2F5X3R5cGUgPSBcIkxpbmVTdHJpbmdcIjsgLy8gZGVmYXVsdFxuICAgICAgaWYgKHR5cGVvZiB3YXlzW2ldLm5vZGVzWzBdICE9IFwidW5kZWZpbmVkXCIgJiYgLy8gd2F5IGhhcyBpdHMgbm9kZXMgbG9hZGVkXG4gICAgICAgIHdheXNbaV0ubm9kZXNbMF0gPT09IHdheXNbaV0ubm9kZXNbd2F5c1tpXS5ub2Rlcy5sZW5ndGgtMV0gJiYgLy8gLi4uIGFuZCBmb3JtcyBhIGNsb3NlZCByaW5nXG4gICAgICAgIChcbiAgICAgICAgICB0eXBlb2Ygd2F5c1tpXS50YWdzICE9IFwidW5kZWZpbmVkXCIgJiYgLy8gLi4uIGFuZCBoYXMgdGFnc1xuICAgICAgICAgIF9pc1BvbHlnb25GZWF0dXJlKHdheXNbaV0udGFncykgLy8gLi4uIGFuZCB0YWdzIHNheSBpdCBpcyBhIHBvbHlnb25cbiAgICAgICAgICB8fCAvLyBvciBpcyBhIHBsYWNlaG9sZGVyIGZvciBhIGJvdW5kcyBnZW9tZXRyeVxuICAgICAgICAgIHdheXNbaV0uX19pc19ib3VuZHNfcGxhY2Vob2xkZXJcbiAgICAgICAgKVxuICAgICAgKSB7XG4gICAgICAgIHdheV90eXBlID0gXCJQb2x5Z29uXCI7XG4gICAgICAgIGNvb3JkcyA9IFtjb29yZHNdO1xuICAgICAgfVxuICAgICAgdmFyIGZlYXR1cmUgPSB7XG4gICAgICAgIFwidHlwZVwiICAgICAgIDogXCJGZWF0dXJlXCIsXG4gICAgICAgIFwiaWRcIiAgICAgICAgIDogd2F5c1tpXS50eXBlK1wiL1wiK3dheXNbaV0uaWQsXG4gICAgICAgIFwicHJvcGVydGllc1wiIDoge1xuICAgICAgICAgIFwidHlwZVwiIDogd2F5c1tpXS50eXBlLFxuICAgICAgICAgIFwiaWRcIiAgIDogd2F5c1tpXS5pZCxcbiAgICAgICAgICBcInRhZ3NcIiA6IHdheXNbaV0udGFncyB8fCB7fSxcbiAgICAgICAgICBcInJlbGF0aW9uc1wiIDogcmVsc21hcFtcIndheVwiXVt3YXlzW2ldLmlkXSB8fCBbXSxcbiAgICAgICAgICBcIm1ldGFcIjogYnVpbGRfbWV0YV9pbmZvcm1hdGlvbih3YXlzW2ldKVxuICAgICAgICB9LFxuICAgICAgICBcImdlb21ldHJ5XCIgICA6IHtcbiAgICAgICAgICBcInR5cGVcIiA6IHdheV90eXBlLFxuICAgICAgICAgIFwiY29vcmRpbmF0ZXNcIiA6IGNvb3JkcyxcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHdheXNbaV0udGFpbnRlZCkge1xuICAgICAgICBpZiAob3B0aW9ucy52ZXJib3NlKSBjb25zb2xlLndhcm4oJ1dheScsd2F5c1tpXS50eXBlKycvJyt3YXlzW2ldLmlkLCdpcyB0YWludGVkJyk7XG4gICAgICAgIGZlYXR1cmUucHJvcGVydGllc1tcInRhaW50ZWRcIl0gPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKHdheXNbaV0uX19pc19ib3VuZHNfcGxhY2Vob2xkZXIpXG4gICAgICAgIGZlYXR1cmUucHJvcGVydGllc1tcImdlb21ldHJ5XCJdID0gXCJib3VuZHNcIjtcbiAgICAgIGlmICh3YXlfdHlwZSA9PSBcIkxpbmVTdHJpbmdcIilcbiAgICAgICAgZ2VvanNvbmxpbmVzLmZlYXR1cmVzLnB1c2goZmVhdHVyZSk7XG4gICAgICBlbHNlXG4gICAgICAgIGdlb2pzb25wb2x5Z29ucy5mZWF0dXJlcy5wdXNoKGZlYXR1cmUpO1xuICAgIH1cblxuICAgIGdlb2pzb24gPSB7XG4gICAgICBcInR5cGVcIjogXCJGZWF0dXJlQ29sbGVjdGlvblwiLFxuICAgICAgXCJmZWF0dXJlc1wiOiBbXVxuICAgIH07XG4gICAgZ2VvanNvbi5mZWF0dXJlcyA9IGdlb2pzb24uZmVhdHVyZXMuY29uY2F0KGdlb2pzb25wb2x5Z29ucy5mZWF0dXJlcyk7XG4gICAgZ2VvanNvbi5mZWF0dXJlcyA9IGdlb2pzb24uZmVhdHVyZXMuY29uY2F0KGdlb2pzb25saW5lcy5mZWF0dXJlcyk7XG4gICAgZ2VvanNvbi5mZWF0dXJlcyA9IGdlb2pzb24uZmVhdHVyZXMuY29uY2F0KGdlb2pzb25ub2Rlcy5mZWF0dXJlcyk7XG4gICAgLy8gb3B0aW9uYWxseSwgZmxhdHRlbiBwcm9wZXJ0aWVzXG4gICAgaWYgKG9wdGlvbnMuZmxhdFByb3BlcnRpZXMpIHtcbiAgICAgIGdlb2pzb24uZmVhdHVyZXMuZm9yRWFjaChmdW5jdGlvbihmKSB7XG4gICAgICAgIGYucHJvcGVydGllcyA9IF8ubWVyZ2UoXG4gICAgICAgICAgZi5wcm9wZXJ0aWVzLm1ldGEsXG4gICAgICAgICAgZi5wcm9wZXJ0aWVzLnRhZ3MsXG4gICAgICAgICAge2lkOiBmLnByb3BlcnRpZXMudHlwZStcIi9cIitmLnByb3BlcnRpZXMuaWR9XG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLy8gZml4IHBvbHlnb24gd2luZGluZ1xuICAgIGdlb2pzb24gPSByZXdpbmQoZ2VvanNvbiwgdHJ1ZSAvKnJlbW92ZSBmb3IgZ2VvanNvbi1yZXdpbmQgPjAuMS4wKi8pO1xuICAgIHJldHVybiBnZW9qc29uO1xuICB9XG4gIGZ1bmN0aW9uIF9pc1BvbHlnb25GZWF0dXJlKCB0YWdzICkge1xuICAgIHZhciBwb2x5Z29uRmVhdHVyZXMgPSBvcHRpb25zLnBvbHlnb25GZWF0dXJlcztcbiAgICBpZiAodHlwZW9mIHBvbHlnb25GZWF0dXJlcyA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgcmV0dXJuIHBvbHlnb25GZWF0dXJlcyh0YWdzKTtcbiAgICAvLyBleHBsaWNpdGVseSB0YWdnZWQgbm9uLWFyZWFzXG4gICAgaWYgKCB0YWdzWydhcmVhJ10gPT09ICdubycgKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIC8vIGFzc3VtaW5nIHRoYXQgYSB0eXBpY2FsIE9TTSB3YXkgaGFzIGluIGF2ZXJhZ2UgbGVzcyB0YWdzIHRoYW5cbiAgICAvLyB0aGUgcG9seWdvbkZlYXR1cmVzIGxpc3QsIHRoaXMgd2F5IGFyb3VuZCBzaG91bGQgYmUgZmFzdGVyXG4gICAgZm9yICggdmFyIGtleSBpbiB0YWdzICkge1xuICAgICAgdmFyIHZhbCA9IHRhZ3Nba2V5XTtcbiAgICAgIHZhciBwZmsgPSBwb2x5Z29uRmVhdHVyZXNba2V5XTtcbiAgICAgIC8vIGNvbnRpbnVlIHdpdGggbmV4dCBpZiB0YWcgaXMgdW5rbm93biBvciBub3QgXCJjYXRlZ29yaXppbmdcIlxuICAgICAgaWYgKCB0eXBlb2YgcGZrID09PSAndW5kZWZpbmVkJyApXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgLy8gY29udGludWUgd2l0aCBuZXh0IGlmIHRhZyBpcyBleHBsaWNpdGVseSB1bi1zZXQgKFwiYnVpbGRpbmc9bm9cIilcbiAgICAgIGlmICggdmFsID09PSAnbm8nIClcbiAgICAgICAgY29udGludWU7XG4gICAgICAvLyBjaGVjayBwb2x5Z29uIGZlYXR1cmVzIGZvcjogZ2VuZXJhbCBhY2NlcHRhbmNlLCBpbmNsdWRlZCBvciBleGNsdWRlZCB2YWx1ZXNcbiAgICAgIGlmICggcGZrID09PSB0cnVlIClcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBpZiAoIHBmay5pbmNsdWRlZF92YWx1ZXMgJiYgcGZrLmluY2x1ZGVkX3ZhbHVlc1t2YWxdID09PSB0cnVlIClcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBpZiAoIHBmay5leGNsdWRlZF92YWx1ZXMgJiYgcGZrLmV4Y2x1ZGVkX3ZhbHVlc1t2YWxdICE9PSB0cnVlIClcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vIGlmIG5vIHRhZ3MgbWF0Y2hlZCwgdGhpcyBhaW4ndCBubyBhcmVhLlxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxuLy8gZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG5vc210b2dlb2pzb24udG9HZW9qc29uID0gb3NtdG9nZW9qc29uO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG9zbXRvZ2VvanNvbjtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qKlxuICogQGxpY2Vuc2VcbiAqIExvLURhc2ggMi40LjEgKEN1c3RvbSBCdWlsZCkgPGh0dHA6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIGV4cG9ydHM9XCJub2RlXCIgaW5jbHVkZT1cImNsb25lLG1lcmdlLGlzRW1wdHksaXNBcnJheSxjb21wYWN0LGVhY2hcIiAtZGBcbiAqIENvcHlyaWdodCAyMDEyLTIwMTMgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuNS4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxMyBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG47KGZ1bmN0aW9uKCkge1xuXG4gIC8qKiBVc2VkIHRvIHBvb2wgYXJyYXlzIGFuZCBvYmplY3RzIHVzZWQgaW50ZXJuYWxseSAqL1xuICB2YXIgYXJyYXlQb29sID0gW107XG5cbiAgLyoqIFVzZWQgaW50ZXJuYWxseSB0byBpbmRpY2F0ZSB2YXJpb3VzIHRoaW5ncyAqL1xuICB2YXIgaW5kaWNhdG9yT2JqZWN0ID0ge307XG5cbiAgLyoqIFVzZWQgYXMgdGhlIG1heCBzaXplIG9mIHRoZSBgYXJyYXlQb29sYCBhbmQgYG9iamVjdFBvb2xgICovXG4gIHZhciBtYXhQb29sU2l6ZSA9IDQwO1xuXG4gIC8qKiBVc2VkIHRvIG1hdGNoIHJlZ2V4cCBmbGFncyBmcm9tIHRoZWlyIGNvZXJjZWQgc3RyaW5nIHZhbHVlcyAqL1xuICB2YXIgcmVGbGFncyA9IC9cXHcqJC87XG5cbiAgLyoqIFVzZWQgdG8gZGV0ZWN0ZWQgbmFtZWQgZnVuY3Rpb25zICovXG4gIHZhciByZUZ1bmNOYW1lID0gL15cXHMqZnVuY3Rpb25bIFxcblxcclxcdF0rXFx3LztcblxuICAvKiogVXNlZCB0byBkZXRlY3QgZnVuY3Rpb25zIGNvbnRhaW5pbmcgYSBgdGhpc2AgcmVmZXJlbmNlICovXG4gIHZhciByZVRoaXMgPSAvXFxidGhpc1xcYi87XG5cbiAgLyoqIFVzZWQgdG8gZml4IHRoZSBKU2NyaXB0IFtbRG9udEVudW1dXSBidWcgKi9cbiAgdmFyIHNoYWRvd2VkUHJvcHMgPSBbXG4gICAgJ2NvbnN0cnVjdG9yJywgJ2hhc093blByb3BlcnR5JywgJ2lzUHJvdG90eXBlT2YnLCAncHJvcGVydHlJc0VudW1lcmFibGUnLFxuICAgICd0b0xvY2FsZVN0cmluZycsICd0b1N0cmluZycsICd2YWx1ZU9mJ1xuICBdO1xuXG4gIC8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgc2hvcnRjdXRzICovXG4gIHZhciBhcmdzQ2xhc3MgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICAgIGFycmF5Q2xhc3MgPSAnW29iamVjdCBBcnJheV0nLFxuICAgICAgYm9vbENsYXNzID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgICAgZGF0ZUNsYXNzID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgICAgZXJyb3JDbGFzcyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgICBmdW5jQ2xhc3MgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgICAgbnVtYmVyQ2xhc3MgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICAgIG9iamVjdENsYXNzID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgICByZWdleHBDbGFzcyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgICAgc3RyaW5nQ2xhc3MgPSAnW29iamVjdCBTdHJpbmddJztcblxuICAvKiogVXNlZCB0byBpZGVudGlmeSBvYmplY3QgY2xhc3NpZmljYXRpb25zIHRoYXQgYF8uY2xvbmVgIHN1cHBvcnRzICovXG4gIHZhciBjbG9uZWFibGVDbGFzc2VzID0ge307XG4gIGNsb25lYWJsZUNsYXNzZXNbZnVuY0NsYXNzXSA9IGZhbHNlO1xuICBjbG9uZWFibGVDbGFzc2VzW2FyZ3NDbGFzc10gPSBjbG9uZWFibGVDbGFzc2VzW2FycmF5Q2xhc3NdID1cbiAgY2xvbmVhYmxlQ2xhc3Nlc1tib29sQ2xhc3NdID0gY2xvbmVhYmxlQ2xhc3Nlc1tkYXRlQ2xhc3NdID1cbiAgY2xvbmVhYmxlQ2xhc3Nlc1tudW1iZXJDbGFzc10gPSBjbG9uZWFibGVDbGFzc2VzW29iamVjdENsYXNzXSA9XG4gIGNsb25lYWJsZUNsYXNzZXNbcmVnZXhwQ2xhc3NdID0gY2xvbmVhYmxlQ2xhc3Nlc1tzdHJpbmdDbGFzc10gPSB0cnVlO1xuXG4gIC8qKiBVc2VkIGFzIHRoZSBwcm9wZXJ0eSBkZXNjcmlwdG9yIGZvciBgX19iaW5kRGF0YV9fYCAqL1xuICB2YXIgZGVzY3JpcHRvciA9IHtcbiAgICAnY29uZmlndXJhYmxlJzogZmFsc2UsXG4gICAgJ2VudW1lcmFibGUnOiBmYWxzZSxcbiAgICAndmFsdWUnOiBudWxsLFxuICAgICd3cml0YWJsZSc6IGZhbHNlXG4gIH07XG5cbiAgLyoqIFVzZWQgYXMgdGhlIGRhdGEgb2JqZWN0IGZvciBgaXRlcmF0b3JUZW1wbGF0ZWAgKi9cbiAgdmFyIGl0ZXJhdG9yRGF0YSA9IHtcbiAgICAnYXJncyc6ICcnLFxuICAgICdhcnJheSc6IG51bGwsXG4gICAgJ2JvdHRvbSc6ICcnLFxuICAgICdmaXJzdEFyZyc6ICcnLFxuICAgICdpbml0JzogJycsXG4gICAgJ2tleXMnOiBudWxsLFxuICAgICdsb29wJzogJycsXG4gICAgJ3NoYWRvd2VkUHJvcHMnOiBudWxsLFxuICAgICdzdXBwb3J0JzogbnVsbCxcbiAgICAndG9wJzogJycsXG4gICAgJ3VzZUhhcyc6IGZhbHNlXG4gIH07XG5cbiAgLyoqIFVzZWQgdG8gZGV0ZXJtaW5lIGlmIHZhbHVlcyBhcmUgb2YgdGhlIGxhbmd1YWdlIHR5cGUgT2JqZWN0ICovXG4gIHZhciBvYmplY3RUeXBlcyA9IHtcbiAgICAnYm9vbGVhbic6IGZhbHNlLFxuICAgICdmdW5jdGlvbic6IHRydWUsXG4gICAgJ29iamVjdCc6IHRydWUsXG4gICAgJ251bWJlcic6IGZhbHNlLFxuICAgICdzdHJpbmcnOiBmYWxzZSxcbiAgICAndW5kZWZpbmVkJzogZmFsc2VcbiAgfTtcblxuICAvKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdCAqL1xuICB2YXIgcm9vdCA9IChvYmplY3RUeXBlc1t0eXBlb2Ygd2luZG93XSAmJiB3aW5kb3cpIHx8IHRoaXM7XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYCAqL1xuICB2YXIgZnJlZUV4cG9ydHMgPSBvYmplY3RUeXBlc1t0eXBlb2YgZXhwb3J0c10gJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4gIC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYCAqL1xuICB2YXIgZnJlZU1vZHVsZSA9IG9iamVjdFR5cGVzW3R5cGVvZiBtb2R1bGVdICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuICAvKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgICovXG4gIHZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzICYmIGZyZWVFeHBvcnRzO1xuXG4gIC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMgb3IgQnJvd3NlcmlmaWVkIGNvZGUgYW5kIHVzZSBpdCBhcyBgcm9vdGAgKi9cbiAgdmFyIGZyZWVHbG9iYWwgPSBvYmplY3RUeXBlc1t0eXBlb2YgZ2xvYmFsXSAmJiBnbG9iYWw7XG4gIGlmIChmcmVlR2xvYmFsICYmIChmcmVlR2xvYmFsLmdsb2JhbCA9PT0gZnJlZUdsb2JhbCB8fCBmcmVlR2xvYmFsLndpbmRvdyA9PT0gZnJlZUdsb2JhbCkpIHtcbiAgICByb290ID0gZnJlZUdsb2JhbDtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBHZXRzIGFuIGFycmF5IGZyb20gdGhlIGFycmF5IHBvb2wgb3IgY3JlYXRlcyBhIG5ldyBvbmUgaWYgdGhlIHBvb2wgaXMgZW1wdHkuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGFycmF5IGZyb20gdGhlIHBvb2wuXG4gICAqL1xuICBmdW5jdGlvbiBnZXRBcnJheSgpIHtcbiAgICByZXR1cm4gYXJyYXlQb29sLnBvcCgpIHx8IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgRE9NIG5vZGUgaW4gSUUgPCA5LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBgdmFsdWVgIGlzIGEgRE9NIG5vZGUsIGVsc2UgYGZhbHNlYC5cbiAgICovXG4gIGZ1bmN0aW9uIGlzTm9kZSh2YWx1ZSkge1xuICAgIC8vIElFIDwgOSBwcmVzZW50cyBET00gbm9kZXMgYXMgYE9iamVjdGAgb2JqZWN0cyBleGNlcHQgdGhleSBoYXZlIGB0b1N0cmluZ2BcbiAgICAvLyBtZXRob2RzIHRoYXQgYXJlIGB0eXBlb2ZgIFwic3RyaW5nXCIgYW5kIHN0aWxsIGNhbiBjb2VyY2Ugbm9kZXMgdG8gc3RyaW5nc1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUudG9TdHJpbmcgIT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgKHZhbHVlICsgJycpID09ICdzdHJpbmcnO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbGVhc2VzIHRoZSBnaXZlbiBhcnJheSBiYWNrIHRvIHRoZSBhcnJheSBwb29sLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byByZWxlYXNlLlxuICAgKi9cbiAgZnVuY3Rpb24gcmVsZWFzZUFycmF5KGFycmF5KSB7XG4gICAgYXJyYXkubGVuZ3RoID0gMDtcbiAgICBpZiAoYXJyYXlQb29sLmxlbmd0aCA8IG1heFBvb2xTaXplKSB7XG4gICAgICBhcnJheVBvb2wucHVzaChhcnJheSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNsaWNlcyB0aGUgYGNvbGxlY3Rpb25gIGZyb20gdGhlIGBzdGFydGAgaW5kZXggdXAgdG8sIGJ1dCBub3QgaW5jbHVkaW5nLFxuICAgKiB0aGUgYGVuZGAgaW5kZXguXG4gICAqXG4gICAqIE5vdGU6IFRoaXMgZnVuY3Rpb24gaXMgdXNlZCBpbnN0ZWFkIG9mIGBBcnJheSNzbGljZWAgdG8gc3VwcG9ydCBub2RlIGxpc3RzXG4gICAqIGluIElFIDwgOSBhbmQgdG8gZW5zdXJlIGRlbnNlIGFycmF5cyBhcmUgcmV0dXJuZWQuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBzbGljZS5cbiAgICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0IFRoZSBzdGFydCBpbmRleC5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGVuZCBUaGUgZW5kIGluZGV4LlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBhcnJheS5cbiAgICovXG4gIGZ1bmN0aW9uIHNsaWNlKGFycmF5LCBzdGFydCwgZW5kKSB7XG4gICAgc3RhcnQgfHwgKHN0YXJ0ID0gMCk7XG4gICAgaWYgKHR5cGVvZiBlbmQgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGVuZCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgICB9XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IGVuZCAtIHN0YXJ0IHx8IDAsXG4gICAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCA8IDAgPyAwIDogbGVuZ3RoKTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICByZXN1bHRbaW5kZXhdID0gYXJyYXlbc3RhcnQgKyBpbmRleF07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogVXNlZCBmb3IgYEFycmF5YCBtZXRob2QgcmVmZXJlbmNlcy5cbiAgICpcbiAgICogTm9ybWFsbHkgYEFycmF5LnByb3RvdHlwZWAgd291bGQgc3VmZmljZSwgaG93ZXZlciwgdXNpbmcgYW4gYXJyYXkgbGl0ZXJhbFxuICAgKiBhdm9pZHMgaXNzdWVzIGluIE5hcndoYWwuXG4gICAqL1xuICB2YXIgYXJyYXlSZWYgPSBbXTtcblxuICAvKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzICovXG4gIHZhciBlcnJvclByb3RvID0gRXJyb3IucHJvdG90eXBlLFxuICAgICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlLFxuICAgICAgc3RyaW5nUHJvdG8gPSBTdHJpbmcucHJvdG90eXBlO1xuXG4gIC8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGludGVybmFsIFtbQ2xhc3NdXSBvZiB2YWx1ZXMgKi9cbiAgdmFyIHRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbiAgLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZSAqL1xuICB2YXIgcmVOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgICBTdHJpbmcodG9TdHJpbmcpXG4gICAgICAucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csICdcXFxcJCYnKVxuICAgICAgLnJlcGxhY2UoL3RvU3RyaW5nfCBmb3IgW15cXF1dKy9nLCAnLio/JykgKyAnJCdcbiAgKTtcblxuICAvKiogTmF0aXZlIG1ldGhvZCBzaG9ydGN1dHMgKi9cbiAgdmFyIGZuVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcsXG4gICAgICBnZXRQcm90b3R5cGVPZiA9IGlzTmF0aXZlKGdldFByb3RvdHlwZU9mID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKSAmJiBnZXRQcm90b3R5cGVPZixcbiAgICAgIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHksXG4gICAgICBwdXNoID0gYXJyYXlSZWYucHVzaCxcbiAgICAgIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGUsXG4gICAgICB1bnNoaWZ0ID0gYXJyYXlSZWYudW5zaGlmdDtcblxuICAvKiogVXNlZCB0byBzZXQgbWV0YSBkYXRhIG9uIGZ1bmN0aW9ucyAqL1xuICB2YXIgZGVmaW5lUHJvcGVydHkgPSAoZnVuY3Rpb24oKSB7XG4gICAgLy8gSUUgOCBvbmx5IGFjY2VwdHMgRE9NIGVsZW1lbnRzXG4gICAgdHJ5IHtcbiAgICAgIHZhciBvID0ge30sXG4gICAgICAgICAgZnVuYyA9IGlzTmF0aXZlKGZ1bmMgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkpICYmIGZ1bmMsXG4gICAgICAgICAgcmVzdWx0ID0gZnVuYyhvLCBvLCBvKSAmJiBmdW5jO1xuICAgIH0gY2F0Y2goZSkgeyB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSgpKTtcblxuICAvKiBOYXRpdmUgbWV0aG9kIHNob3J0Y3V0cyBmb3IgbWV0aG9kcyB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcyAqL1xuICB2YXIgbmF0aXZlQ3JlYXRlID0gaXNOYXRpdmUobmF0aXZlQ3JlYXRlID0gT2JqZWN0LmNyZWF0ZSkgJiYgbmF0aXZlQ3JlYXRlLFxuICAgICAgbmF0aXZlSXNBcnJheSA9IGlzTmF0aXZlKG5hdGl2ZUlzQXJyYXkgPSBBcnJheS5pc0FycmF5KSAmJiBuYXRpdmVJc0FycmF5LFxuICAgICAgbmF0aXZlS2V5cyA9IGlzTmF0aXZlKG5hdGl2ZUtleXMgPSBPYmplY3Qua2V5cykgJiYgbmF0aXZlS2V5cztcblxuICAvKiogVXNlZCB0byBsb29rdXAgYSBidWlsdC1pbiBjb25zdHJ1Y3RvciBieSBbW0NsYXNzXV0gKi9cbiAgdmFyIGN0b3JCeUNsYXNzID0ge307XG4gIGN0b3JCeUNsYXNzW2FycmF5Q2xhc3NdID0gQXJyYXk7XG4gIGN0b3JCeUNsYXNzW2Jvb2xDbGFzc10gPSBCb29sZWFuO1xuICBjdG9yQnlDbGFzc1tkYXRlQ2xhc3NdID0gRGF0ZTtcbiAgY3RvckJ5Q2xhc3NbZnVuY0NsYXNzXSA9IEZ1bmN0aW9uO1xuICBjdG9yQnlDbGFzc1tvYmplY3RDbGFzc10gPSBPYmplY3Q7XG4gIGN0b3JCeUNsYXNzW251bWJlckNsYXNzXSA9IE51bWJlcjtcbiAgY3RvckJ5Q2xhc3NbcmVnZXhwQ2xhc3NdID0gUmVnRXhwO1xuICBjdG9yQnlDbGFzc1tzdHJpbmdDbGFzc10gPSBTdHJpbmc7XG5cbiAgLyoqIFVzZWQgdG8gYXZvaWQgaXRlcmF0aW5nIG5vbi1lbnVtZXJhYmxlIHByb3BlcnRpZXMgaW4gSUUgPCA5ICovXG4gIHZhciBub25FbnVtUHJvcHMgPSB7fTtcbiAgbm9uRW51bVByb3BzW2FycmF5Q2xhc3NdID0gbm9uRW51bVByb3BzW2RhdGVDbGFzc10gPSBub25FbnVtUHJvcHNbbnVtYmVyQ2xhc3NdID0geyAnY29uc3RydWN0b3InOiB0cnVlLCAndG9Mb2NhbGVTdHJpbmcnOiB0cnVlLCAndG9TdHJpbmcnOiB0cnVlLCAndmFsdWVPZic6IHRydWUgfTtcbiAgbm9uRW51bVByb3BzW2Jvb2xDbGFzc10gPSBub25FbnVtUHJvcHNbc3RyaW5nQ2xhc3NdID0geyAnY29uc3RydWN0b3InOiB0cnVlLCAndG9TdHJpbmcnOiB0cnVlLCAndmFsdWVPZic6IHRydWUgfTtcbiAgbm9uRW51bVByb3BzW2Vycm9yQ2xhc3NdID0gbm9uRW51bVByb3BzW2Z1bmNDbGFzc10gPSBub25FbnVtUHJvcHNbcmVnZXhwQ2xhc3NdID0geyAnY29uc3RydWN0b3InOiB0cnVlLCAndG9TdHJpbmcnOiB0cnVlIH07XG4gIG5vbkVudW1Qcm9wc1tvYmplY3RDbGFzc10gPSB7ICdjb25zdHJ1Y3Rvcic6IHRydWUgfTtcblxuICAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxlbmd0aCA9IHNoYWRvd2VkUHJvcHMubGVuZ3RoO1xuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgdmFyIGtleSA9IHNoYWRvd2VkUHJvcHNbbGVuZ3RoXTtcbiAgICAgIGZvciAodmFyIGNsYXNzTmFtZSBpbiBub25FbnVtUHJvcHMpIHtcbiAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwobm9uRW51bVByb3BzLCBjbGFzc05hbWUpICYmICFoYXNPd25Qcm9wZXJ0eS5jYWxsKG5vbkVudW1Qcm9wc1tjbGFzc05hbWVdLCBrZXkpKSB7XG4gICAgICAgICAgbm9uRW51bVByb3BzW2NsYXNzTmFtZV1ba2V5XSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KCkpO1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgYGxvZGFzaGAgb2JqZWN0IHdoaWNoIHdyYXBzIHRoZSBnaXZlbiB2YWx1ZSB0byBlbmFibGUgaW50dWl0aXZlXG4gICAqIG1ldGhvZCBjaGFpbmluZy5cbiAgICpcbiAgICogSW4gYWRkaXRpb24gdG8gTG8tRGFzaCBtZXRob2RzLCB3cmFwcGVycyBhbHNvIGhhdmUgdGhlIGZvbGxvd2luZyBgQXJyYXlgIG1ldGhvZHM6XG4gICAqIGBjb25jYXRgLCBgam9pbmAsIGBwb3BgLCBgcHVzaGAsIGByZXZlcnNlYCwgYHNoaWZ0YCwgYHNsaWNlYCwgYHNvcnRgLCBgc3BsaWNlYCxcbiAgICogYW5kIGB1bnNoaWZ0YFxuICAgKlxuICAgKiBDaGFpbmluZyBpcyBzdXBwb3J0ZWQgaW4gY3VzdG9tIGJ1aWxkcyBhcyBsb25nIGFzIHRoZSBgdmFsdWVgIG1ldGhvZCBpc1xuICAgKiBpbXBsaWNpdGx5IG9yIGV4cGxpY2l0bHkgaW5jbHVkZWQgaW4gdGhlIGJ1aWxkLlxuICAgKlxuICAgKiBUaGUgY2hhaW5hYmxlIHdyYXBwZXIgZnVuY3Rpb25zIGFyZTpcbiAgICogYGFmdGVyYCwgYGFzc2lnbmAsIGBiaW5kYCwgYGJpbmRBbGxgLCBgYmluZEtleWAsIGBjaGFpbmAsIGBjb21wYWN0YCxcbiAgICogYGNvbXBvc2VgLCBgY29uY2F0YCwgYGNvdW50QnlgLCBgY3JlYXRlYCwgYGNyZWF0ZUNhbGxiYWNrYCwgYGN1cnJ5YCxcbiAgICogYGRlYm91bmNlYCwgYGRlZmF1bHRzYCwgYGRlZmVyYCwgYGRlbGF5YCwgYGRpZmZlcmVuY2VgLCBgZmlsdGVyYCwgYGZsYXR0ZW5gLFxuICAgKiBgZm9yRWFjaGAsIGBmb3JFYWNoUmlnaHRgLCBgZm9ySW5gLCBgZm9ySW5SaWdodGAsIGBmb3JPd25gLCBgZm9yT3duUmlnaHRgLFxuICAgKiBgZnVuY3Rpb25zYCwgYGdyb3VwQnlgLCBgaW5kZXhCeWAsIGBpbml0aWFsYCwgYGludGVyc2VjdGlvbmAsIGBpbnZlcnRgLFxuICAgKiBgaW52b2tlYCwgYGtleXNgLCBgbWFwYCwgYG1heGAsIGBtZW1vaXplYCwgYG1lcmdlYCwgYG1pbmAsIGBvYmplY3RgLCBgb21pdGAsXG4gICAqIGBvbmNlYCwgYHBhaXJzYCwgYHBhcnRpYWxgLCBgcGFydGlhbFJpZ2h0YCwgYHBpY2tgLCBgcGx1Y2tgLCBgcHVsbGAsIGBwdXNoYCxcbiAgICogYHJhbmdlYCwgYHJlamVjdGAsIGByZW1vdmVgLCBgcmVzdGAsIGByZXZlcnNlYCwgYHNodWZmbGVgLCBgc2xpY2VgLCBgc29ydGAsXG4gICAqIGBzb3J0QnlgLCBgc3BsaWNlYCwgYHRhcGAsIGB0aHJvdHRsZWAsIGB0aW1lc2AsIGB0b0FycmF5YCwgYHRyYW5zZm9ybWAsXG4gICAqIGB1bmlvbmAsIGB1bmlxYCwgYHVuc2hpZnRgLCBgdW56aXBgLCBgdmFsdWVzYCwgYHdoZXJlYCwgYHdpdGhvdXRgLCBgd3JhcGAsXG4gICAqIGFuZCBgemlwYFxuICAgKlxuICAgKiBUaGUgbm9uLWNoYWluYWJsZSB3cmFwcGVyIGZ1bmN0aW9ucyBhcmU6XG4gICAqIGBjbG9uZWAsIGBjbG9uZURlZXBgLCBgY29udGFpbnNgLCBgZXNjYXBlYCwgYGV2ZXJ5YCwgYGZpbmRgLCBgZmluZEluZGV4YCxcbiAgICogYGZpbmRLZXlgLCBgZmluZExhc3RgLCBgZmluZExhc3RJbmRleGAsIGBmaW5kTGFzdEtleWAsIGBoYXNgLCBgaWRlbnRpdHlgLFxuICAgKiBgaW5kZXhPZmAsIGBpc0FyZ3VtZW50c2AsIGBpc0FycmF5YCwgYGlzQm9vbGVhbmAsIGBpc0RhdGVgLCBgaXNFbGVtZW50YCxcbiAgICogYGlzRW1wdHlgLCBgaXNFcXVhbGAsIGBpc0Zpbml0ZWAsIGBpc0Z1bmN0aW9uYCwgYGlzTmFOYCwgYGlzTnVsbGAsIGBpc051bWJlcmAsXG4gICAqIGBpc09iamVjdGAsIGBpc1BsYWluT2JqZWN0YCwgYGlzUmVnRXhwYCwgYGlzU3RyaW5nYCwgYGlzVW5kZWZpbmVkYCwgYGpvaW5gLFxuICAgKiBgbGFzdEluZGV4T2ZgLCBgbWl4aW5gLCBgbm9Db25mbGljdGAsIGBwYXJzZUludGAsIGBwb3BgLCBgcmFuZG9tYCwgYHJlZHVjZWAsXG4gICAqIGByZWR1Y2VSaWdodGAsIGByZXN1bHRgLCBgc2hpZnRgLCBgc2l6ZWAsIGBzb21lYCwgYHNvcnRlZEluZGV4YCwgYHJ1bkluQ29udGV4dGAsXG4gICAqIGB0ZW1wbGF0ZWAsIGB1bmVzY2FwZWAsIGB1bmlxdWVJZGAsIGFuZCBgdmFsdWVgXG4gICAqXG4gICAqIFRoZSB3cmFwcGVyIGZ1bmN0aW9ucyBgZmlyc3RgIGFuZCBgbGFzdGAgcmV0dXJuIHdyYXBwZWQgdmFsdWVzIHdoZW4gYG5gIGlzXG4gICAqIHByb3ZpZGVkLCBvdGhlcndpc2UgdGhleSByZXR1cm4gdW53cmFwcGVkIHZhbHVlcy5cbiAgICpcbiAgICogRXhwbGljaXQgY2hhaW5pbmcgY2FuIGJlIGVuYWJsZWQgYnkgdXNpbmcgdGhlIGBfLmNoYWluYCBtZXRob2QuXG4gICAqXG4gICAqIEBuYW1lIF9cbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBjYXRlZ29yeSBDaGFpbmluZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byB3cmFwIGluIGEgYGxvZGFzaGAgaW5zdGFuY2UuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYSBgbG9kYXNoYCBpbnN0YW5jZS5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIHdyYXBwZWQgPSBfKFsxLCAyLCAzXSk7XG4gICAqXG4gICAqIC8vIHJldHVybnMgYW4gdW53cmFwcGVkIHZhbHVlXG4gICAqIHdyYXBwZWQucmVkdWNlKGZ1bmN0aW9uKHN1bSwgbnVtKSB7XG4gICAqICAgcmV0dXJuIHN1bSArIG51bTtcbiAgICogfSk7XG4gICAqIC8vID0+IDZcbiAgICpcbiAgICogLy8gcmV0dXJucyBhIHdyYXBwZWQgdmFsdWVcbiAgICogdmFyIHNxdWFyZXMgPSB3cmFwcGVkLm1hcChmdW5jdGlvbihudW0pIHtcbiAgICogICByZXR1cm4gbnVtICogbnVtO1xuICAgKiB9KTtcbiAgICpcbiAgICogXy5pc0FycmF5KHNxdWFyZXMpO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiBfLmlzQXJyYXkoc3F1YXJlcy52YWx1ZSgpKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKi9cbiAgZnVuY3Rpb24gbG9kYXNoKCkge1xuICAgIC8vIG5vIG9wZXJhdGlvbiBwZXJmb3JtZWRcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBvYmplY3QgdXNlZCB0byBmbGFnIGVudmlyb25tZW50cyBmZWF0dXJlcy5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAdHlwZSBPYmplY3RcbiAgICovXG4gIHZhciBzdXBwb3J0ID0gbG9kYXNoLnN1cHBvcnQgPSB7fTtcblxuICAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGN0b3IgPSBmdW5jdGlvbigpIHsgdGhpcy54ID0gMTsgfSxcbiAgICAgICAgb2JqZWN0ID0geyAnMCc6IDEsICdsZW5ndGgnOiAxIH0sXG4gICAgICAgIHByb3BzID0gW107XG5cbiAgICBjdG9yLnByb3RvdHlwZSA9IHsgJ3ZhbHVlT2YnOiAxLCAneSc6IDEgfTtcbiAgICBmb3IgKHZhciBrZXkgaW4gbmV3IGN0b3IpIHsgcHJvcHMucHVzaChrZXkpOyB9XG4gICAgZm9yIChrZXkgaW4gYXJndW1lbnRzKSB7IH1cblxuICAgIC8qKlxuICAgICAqIERldGVjdCBpZiBhbiBgYXJndW1lbnRzYCBvYmplY3QncyBbW0NsYXNzXV0gaXMgcmVzb2x2YWJsZSAoYWxsIGJ1dCBGaXJlZm94IDwgNCwgSUUgPCA5KS5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBfLnN1cHBvcnRcbiAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICovXG4gICAgc3VwcG9ydC5hcmdzQ2xhc3MgPSB0b1N0cmluZy5jYWxsKGFyZ3VtZW50cykgPT0gYXJnc0NsYXNzO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZWN0IGlmIGBhcmd1bWVudHNgIG9iamVjdHMgYXJlIGBPYmplY3RgIG9iamVjdHMgKGFsbCBidXQgTmFyd2hhbCBhbmQgT3BlcmEgPCAxMC41KS5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBfLnN1cHBvcnRcbiAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICovXG4gICAgc3VwcG9ydC5hcmdzT2JqZWN0ID0gYXJndW1lbnRzLmNvbnN0cnVjdG9yID09IE9iamVjdCAmJiAhKGFyZ3VtZW50cyBpbnN0YW5jZW9mIEFycmF5KTtcblxuICAgIC8qKlxuICAgICAqIERldGVjdCBpZiBgbmFtZWAgb3IgYG1lc3NhZ2VgIHByb3BlcnRpZXMgb2YgYEVycm9yLnByb3RvdHlwZWAgYXJlXG4gICAgICogZW51bWVyYWJsZSBieSBkZWZhdWx0LiAoSUUgPCA5LCBTYWZhcmkgPCA1LjEpXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgXy5zdXBwb3J0XG4gICAgICogQHR5cGUgYm9vbGVhblxuICAgICAqL1xuICAgIHN1cHBvcnQuZW51bUVycm9yUHJvcHMgPSBwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKGVycm9yUHJvdG8sICdtZXNzYWdlJykgfHwgcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChlcnJvclByb3RvLCAnbmFtZScpO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZWN0IGlmIGBwcm90b3R5cGVgIHByb3BlcnRpZXMgYXJlIGVudW1lcmFibGUgYnkgZGVmYXVsdC5cbiAgICAgKlxuICAgICAqIEZpcmVmb3ggPCAzLjYsIE9wZXJhID4gOS41MCAtIE9wZXJhIDwgMTEuNjAsIGFuZCBTYWZhcmkgPCA1LjFcbiAgICAgKiAoaWYgdGhlIHByb3RvdHlwZSBvciBhIHByb3BlcnR5IG9uIHRoZSBwcm90b3R5cGUgaGFzIGJlZW4gc2V0KVxuICAgICAqIGluY29ycmVjdGx5IHNldHMgYSBmdW5jdGlvbidzIGBwcm90b3R5cGVgIHByb3BlcnR5IFtbRW51bWVyYWJsZV1dXG4gICAgICogdmFsdWUgdG8gYHRydWVgLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIF8uc3VwcG9ydFxuICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgKi9cbiAgICBzdXBwb3J0LmVudW1Qcm90b3R5cGVzID0gcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChjdG9yLCAncHJvdG90eXBlJyk7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlY3QgaWYgZnVuY3Rpb25zIGNhbiBiZSBkZWNvbXBpbGVkIGJ5IGBGdW5jdGlvbiN0b1N0cmluZ2BcbiAgICAgKiAoYWxsIGJ1dCBQUzMgYW5kIG9sZGVyIE9wZXJhIG1vYmlsZSBicm93c2VycyAmIGF2b2lkZWQgaW4gV2luZG93cyA4IGFwcHMpLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIF8uc3VwcG9ydFxuICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgKi9cbiAgICBzdXBwb3J0LmZ1bmNEZWNvbXAgPSAhaXNOYXRpdmUocm9vdC5XaW5SVEVycm9yKSAmJiByZVRoaXMudGVzdChmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZWN0IGlmIGBGdW5jdGlvbiNuYW1lYCBpcyBzdXBwb3J0ZWQgKGFsbCBidXQgSUUpLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIF8uc3VwcG9ydFxuICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgKi9cbiAgICBzdXBwb3J0LmZ1bmNOYW1lcyA9IHR5cGVvZiBGdW5jdGlvbi5uYW1lID09ICdzdHJpbmcnO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZWN0IGlmIGBhcmd1bWVudHNgIG9iamVjdCBpbmRleGVzIGFyZSBub24tZW51bWVyYWJsZVxuICAgICAqIChGaXJlZm94IDwgNCwgSUUgPCA5LCBQaGFudG9tSlMsIFNhZmFyaSA8IDUuMSkuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyT2YgXy5zdXBwb3J0XG4gICAgICogQHR5cGUgYm9vbGVhblxuICAgICAqL1xuICAgIHN1cHBvcnQubm9uRW51bUFyZ3MgPSBrZXkgIT0gMDtcblxuICAgIC8qKlxuICAgICAqIERldGVjdCBpZiBwcm9wZXJ0aWVzIHNoYWRvd2luZyB0aG9zZSBvbiBgT2JqZWN0LnByb3RvdHlwZWAgYXJlIG5vbi1lbnVtZXJhYmxlLlxuICAgICAqXG4gICAgICogSW4gSUUgPCA5IGFuIG9iamVjdHMgb3duIHByb3BlcnRpZXMsIHNoYWRvd2luZyBub24tZW51bWVyYWJsZSBvbmVzLCBhcmVcbiAgICAgKiBtYWRlIG5vbi1lbnVtZXJhYmxlIGFzIHdlbGwgKGEuay5hIHRoZSBKU2NyaXB0IFtbRG9udEVudW1dXSBidWcpLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIF8uc3VwcG9ydFxuICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgKi9cbiAgICBzdXBwb3J0Lm5vbkVudW1TaGFkb3dzID0gIS92YWx1ZU9mLy50ZXN0KHByb3BzKTtcblxuICAgIC8qKlxuICAgICAqIERldGVjdCBpZiBvd24gcHJvcGVydGllcyBhcmUgaXRlcmF0ZWQgYWZ0ZXIgaW5oZXJpdGVkIHByb3BlcnRpZXMgKGFsbCBidXQgSUUgPCA5KS5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBfLnN1cHBvcnRcbiAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICovXG4gICAgc3VwcG9ydC5vd25MYXN0ID0gcHJvcHNbMF0gIT0gJ3gnO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZWN0IGlmIGBBcnJheSNzaGlmdGAgYW5kIGBBcnJheSNzcGxpY2VgIGF1Z21lbnQgYXJyYXktbGlrZSBvYmplY3RzIGNvcnJlY3RseS5cbiAgICAgKlxuICAgICAqIEZpcmVmb3ggPCAxMCwgSUUgY29tcGF0aWJpbGl0eSBtb2RlLCBhbmQgSUUgPCA5IGhhdmUgYnVnZ3kgQXJyYXkgYHNoaWZ0KClgXG4gICAgICogYW5kIGBzcGxpY2UoKWAgZnVuY3Rpb25zIHRoYXQgZmFpbCB0byByZW1vdmUgdGhlIGxhc3QgZWxlbWVudCwgYHZhbHVlWzBdYCxcbiAgICAgKiBvZiBhcnJheS1saWtlIG9iamVjdHMgZXZlbiB0aG91Z2ggdGhlIGBsZW5ndGhgIHByb3BlcnR5IGlzIHNldCB0byBgMGAuXG4gICAgICogVGhlIGBzaGlmdCgpYCBtZXRob2QgaXMgYnVnZ3kgaW4gSUUgOCBjb21wYXRpYmlsaXR5IG1vZGUsIHdoaWxlIGBzcGxpY2UoKWBcbiAgICAgKiBpcyBidWdneSByZWdhcmRsZXNzIG9mIG1vZGUgaW4gSUUgPCA5IGFuZCBidWdneSBpbiBjb21wYXRpYmlsaXR5IG1vZGUgaW4gSUUgOS5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBfLnN1cHBvcnRcbiAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICovXG4gICAgc3VwcG9ydC5zcGxpY2VPYmplY3RzID0gKGFycmF5UmVmLnNwbGljZS5jYWxsKG9iamVjdCwgMCwgMSksICFvYmplY3RbMF0pO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZWN0IGxhY2sgb2Ygc3VwcG9ydCBmb3IgYWNjZXNzaW5nIHN0cmluZyBjaGFyYWN0ZXJzIGJ5IGluZGV4LlxuICAgICAqXG4gICAgICogSUUgPCA4IGNhbid0IGFjY2VzcyBjaGFyYWN0ZXJzIGJ5IGluZGV4IGFuZCBJRSA4IGNhbiBvbmx5IGFjY2Vzc1xuICAgICAqIGNoYXJhY3RlcnMgYnkgaW5kZXggb24gc3RyaW5nIGxpdGVyYWxzLlxuICAgICAqXG4gICAgICogQG1lbWJlck9mIF8uc3VwcG9ydFxuICAgICAqIEB0eXBlIGJvb2xlYW5cbiAgICAgKi9cbiAgICBzdXBwb3J0LnVuaW5kZXhlZENoYXJzID0gKCd4J1swXSArIE9iamVjdCgneCcpWzBdKSAhPSAneHgnO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZWN0IGlmIGEgRE9NIG5vZGUncyBbW0NsYXNzXV0gaXMgcmVzb2x2YWJsZSAoYWxsIGJ1dCBJRSA8IDkpXG4gICAgICogYW5kIHRoYXQgdGhlIEpTIGVuZ2luZSBlcnJvcnMgd2hlbiBhdHRlbXB0aW5nIHRvIGNvZXJjZSBhbiBvYmplY3QgdG9cbiAgICAgKiBhIHN0cmluZyB3aXRob3V0IGEgYHRvU3RyaW5nYCBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBtZW1iZXJPZiBfLnN1cHBvcnRcbiAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICovXG4gICAgdHJ5IHtcbiAgICAgIHN1cHBvcnQubm9kZUNsYXNzID0gISh0b1N0cmluZy5jYWxsKGRvY3VtZW50KSA9PSBvYmplY3RDbGFzcyAmJiAhKHsgJ3RvU3RyaW5nJzogMCB9ICsgJycpKTtcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIHN1cHBvcnQubm9kZUNsYXNzID0gdHJ1ZTtcbiAgICB9XG4gIH0oMSkpO1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBUaGUgdGVtcGxhdGUgdXNlZCB0byBjcmVhdGUgaXRlcmF0b3IgZnVuY3Rpb25zLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBUaGUgZGF0YSBvYmplY3QgdXNlZCB0byBwb3B1bGF0ZSB0aGUgdGV4dC5cbiAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgaW50ZXJwb2xhdGVkIHRleHQuXG4gICAqL1xuICB2YXIgaXRlcmF0b3JUZW1wbGF0ZSA9IGZ1bmN0aW9uKG9iaikge1xuXG4gICAgdmFyIF9fcCA9ICd2YXIgaW5kZXgsIGl0ZXJhYmxlID0gJyArXG4gICAgKG9iai5maXJzdEFyZykgK1xuICAgICcsIHJlc3VsdCA9ICcgK1xuICAgIChvYmouaW5pdCkgK1xuICAgICc7XFxuaWYgKCFpdGVyYWJsZSkgcmV0dXJuIHJlc3VsdDtcXG4nICtcbiAgICAob2JqLnRvcCkgK1xuICAgICc7JztcbiAgICAgaWYgKG9iai5hcnJheSkge1xuICAgIF9fcCArPSAnXFxudmFyIGxlbmd0aCA9IGl0ZXJhYmxlLmxlbmd0aDsgaW5kZXggPSAtMTtcXG5pZiAoJyArXG4gICAgKG9iai5hcnJheSkgK1xuICAgICcpIHsgICc7XG4gICAgIGlmIChzdXBwb3J0LnVuaW5kZXhlZENoYXJzKSB7XG4gICAgX19wICs9ICdcXG4gIGlmIChpc1N0cmluZyhpdGVyYWJsZSkpIHtcXG4gICAgaXRlcmFibGUgPSBpdGVyYWJsZS5zcGxpdChcXCdcXCcpXFxuICB9ICAnO1xuICAgICB9XG4gICAgX19wICs9ICdcXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XFxuICAgICcgK1xuICAgIChvYmoubG9vcCkgK1xuICAgICc7XFxuICB9XFxufVxcbmVsc2UgeyAgJztcbiAgICAgfSBlbHNlIGlmIChzdXBwb3J0Lm5vbkVudW1BcmdzKSB7XG4gICAgX19wICs9ICdcXG4gIHZhciBsZW5ndGggPSBpdGVyYWJsZS5sZW5ndGg7IGluZGV4ID0gLTE7XFxuICBpZiAobGVuZ3RoICYmIGlzQXJndW1lbnRzKGl0ZXJhYmxlKSkge1xcbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xcbiAgICAgIGluZGV4ICs9IFxcJ1xcJztcXG4gICAgICAnICtcbiAgICAob2JqLmxvb3ApICtcbiAgICAnO1xcbiAgICB9XFxuICB9IGVsc2UgeyAgJztcbiAgICAgfVxuXG4gICAgIGlmIChzdXBwb3J0LmVudW1Qcm90b3R5cGVzKSB7XG4gICAgX19wICs9ICdcXG4gIHZhciBza2lwUHJvdG8gPSB0eXBlb2YgaXRlcmFibGUgPT0gXFwnZnVuY3Rpb25cXCc7XFxuICAnO1xuICAgICB9XG5cbiAgICAgaWYgKHN1cHBvcnQuZW51bUVycm9yUHJvcHMpIHtcbiAgICBfX3AgKz0gJ1xcbiAgdmFyIHNraXBFcnJvclByb3BzID0gaXRlcmFibGUgPT09IGVycm9yUHJvdG8gfHwgaXRlcmFibGUgaW5zdGFuY2VvZiBFcnJvcjtcXG4gICc7XG4gICAgIH1cblxuICAgICAgICB2YXIgY29uZGl0aW9ucyA9IFtdOyAgICBpZiAoc3VwcG9ydC5lbnVtUHJvdG90eXBlcykgeyBjb25kaXRpb25zLnB1c2goJyEoc2tpcFByb3RvICYmIGluZGV4ID09IFwicHJvdG90eXBlXCIpJyk7IH0gICAgaWYgKHN1cHBvcnQuZW51bUVycm9yUHJvcHMpICB7IGNvbmRpdGlvbnMucHVzaCgnIShza2lwRXJyb3JQcm9wcyAmJiAoaW5kZXggPT0gXCJtZXNzYWdlXCIgfHwgaW5kZXggPT0gXCJuYW1lXCIpKScpOyB9XG5cbiAgICAgaWYgKG9iai51c2VIYXMgJiYgb2JqLmtleXMpIHtcbiAgICBfX3AgKz0gJ1xcbiAgdmFyIG93bkluZGV4ID0gLTEsXFxuICAgICAgb3duUHJvcHMgPSBvYmplY3RUeXBlc1t0eXBlb2YgaXRlcmFibGVdICYmIGtleXMoaXRlcmFibGUpLFxcbiAgICAgIGxlbmd0aCA9IG93blByb3BzID8gb3duUHJvcHMubGVuZ3RoIDogMDtcXG5cXG4gIHdoaWxlICgrK293bkluZGV4IDwgbGVuZ3RoKSB7XFxuICAgIGluZGV4ID0gb3duUHJvcHNbb3duSW5kZXhdO1xcbic7XG4gICAgICAgIGlmIChjb25kaXRpb25zLmxlbmd0aCkge1xuICAgIF9fcCArPSAnICAgIGlmICgnICtcbiAgICAoY29uZGl0aW9ucy5qb2luKCcgJiYgJykpICtcbiAgICAnKSB7XFxuICAnO1xuICAgICB9XG4gICAgX19wICs9XG4gICAgKG9iai5sb29wKSArXG4gICAgJzsgICAgJztcbiAgICAgaWYgKGNvbmRpdGlvbnMubGVuZ3RoKSB7XG4gICAgX19wICs9ICdcXG4gICAgfSc7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcbiAgfSAgJztcbiAgICAgfSBlbHNlIHtcbiAgICBfX3AgKz0gJ1xcbiAgZm9yIChpbmRleCBpbiBpdGVyYWJsZSkge1xcbic7XG4gICAgICAgIGlmIChvYmoudXNlSGFzKSB7IGNvbmRpdGlvbnMucHVzaChcImhhc093blByb3BlcnR5LmNhbGwoaXRlcmFibGUsIGluZGV4KVwiKTsgfSAgICBpZiAoY29uZGl0aW9ucy5sZW5ndGgpIHtcbiAgICBfX3AgKz0gJyAgICBpZiAoJyArXG4gICAgKGNvbmRpdGlvbnMuam9pbignICYmICcpKSArXG4gICAgJykge1xcbiAgJztcbiAgICAgfVxuICAgIF9fcCArPVxuICAgIChvYmoubG9vcCkgK1xuICAgICc7ICAgICc7XG4gICAgIGlmIChjb25kaXRpb25zLmxlbmd0aCkge1xuICAgIF9fcCArPSAnXFxuICAgIH0nO1xuICAgICB9XG4gICAgX19wICs9ICdcXG4gIH0gICAgJztcbiAgICAgaWYgKHN1cHBvcnQubm9uRW51bVNoYWRvd3MpIHtcbiAgICBfX3AgKz0gJ1xcblxcbiAgaWYgKGl0ZXJhYmxlICE9PSBvYmplY3RQcm90bykge1xcbiAgICB2YXIgY3RvciA9IGl0ZXJhYmxlLmNvbnN0cnVjdG9yLFxcbiAgICAgICAgaXNQcm90byA9IGl0ZXJhYmxlID09PSAoY3RvciAmJiBjdG9yLnByb3RvdHlwZSksXFxuICAgICAgICBjbGFzc05hbWUgPSBpdGVyYWJsZSA9PT0gc3RyaW5nUHJvdG8gPyBzdHJpbmdDbGFzcyA6IGl0ZXJhYmxlID09PSBlcnJvclByb3RvID8gZXJyb3JDbGFzcyA6IHRvU3RyaW5nLmNhbGwoaXRlcmFibGUpLFxcbiAgICAgICAgbm9uRW51bSA9IG5vbkVudW1Qcm9wc1tjbGFzc05hbWVdO1xcbiAgICAgICc7XG4gICAgIGZvciAoayA9IDA7IGsgPCA3OyBrKyspIHtcbiAgICBfX3AgKz0gJ1xcbiAgICBpbmRleCA9IFxcJycgK1xuICAgIChvYmouc2hhZG93ZWRQcm9wc1trXSkgK1xuICAgICdcXCc7XFxuICAgIGlmICgoIShpc1Byb3RvICYmIG5vbkVudW1baW5kZXhdKSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0ZXJhYmxlLCBpbmRleCkpJztcbiAgICAgICAgICAgIGlmICghb2JqLnVzZUhhcykge1xuICAgIF9fcCArPSAnIHx8ICghbm9uRW51bVtpbmRleF0gJiYgaXRlcmFibGVbaW5kZXhdICE9PSBvYmplY3RQcm90b1tpbmRleF0pJztcbiAgICAgfVxuICAgIF9fcCArPSAnKSB7XFxuICAgICAgJyArXG4gICAgKG9iai5sb29wKSArXG4gICAgJztcXG4gICAgfSAgICAgICc7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcbiAgfSAgICAnO1xuICAgICB9XG5cbiAgICAgfVxuXG4gICAgIGlmIChvYmouYXJyYXkgfHwgc3VwcG9ydC5ub25FbnVtQXJncykge1xuICAgIF9fcCArPSAnXFxufSc7XG4gICAgIH1cbiAgICBfX3AgKz1cbiAgICAob2JqLmJvdHRvbSkgK1xuICAgICc7XFxucmV0dXJuIHJlc3VsdCc7XG5cbiAgICByZXR1cm4gX19wXG4gIH07XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmJpbmRgIHRoYXQgY3JlYXRlcyB0aGUgYm91bmQgZnVuY3Rpb24gYW5kXG4gICAqIHNldHMgaXRzIG1ldGEgZGF0YS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtBcnJheX0gYmluZERhdGEgVGhlIGJpbmQgZGF0YSBhcnJheS5cbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYm91bmQgZnVuY3Rpb24uXG4gICAqL1xuICBmdW5jdGlvbiBiYXNlQmluZChiaW5kRGF0YSkge1xuICAgIHZhciBmdW5jID0gYmluZERhdGFbMF0sXG4gICAgICAgIHBhcnRpYWxBcmdzID0gYmluZERhdGFbMl0sXG4gICAgICAgIHRoaXNBcmcgPSBiaW5kRGF0YVs0XTtcblxuICAgIGZ1bmN0aW9uIGJvdW5kKCkge1xuICAgICAgLy8gYEZ1bmN0aW9uI2JpbmRgIHNwZWNcbiAgICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4MTUuMy40LjVcbiAgICAgIGlmIChwYXJ0aWFsQXJncykge1xuICAgICAgICAvLyBhdm9pZCBgYXJndW1lbnRzYCBvYmplY3QgZGVvcHRpbWl6YXRpb25zIGJ5IHVzaW5nIGBzbGljZWAgaW5zdGVhZFxuICAgICAgICAvLyBvZiBgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGxgIGFuZCBub3QgYXNzaWduaW5nIGBhcmd1bWVudHNgIHRvIGFcbiAgICAgICAgLy8gdmFyaWFibGUgYXMgYSB0ZXJuYXJ5IGV4cHJlc3Npb25cbiAgICAgICAgdmFyIGFyZ3MgPSBzbGljZShwYXJ0aWFsQXJncyk7XG4gICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIC8vIG1pbWljIHRoZSBjb25zdHJ1Y3RvcidzIGByZXR1cm5gIGJlaGF2aW9yXG4gICAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5pby8jeDEzLjIuMlxuICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBib3VuZCkge1xuICAgICAgICAvLyBlbnN1cmUgYG5ldyBib3VuZGAgaXMgYW4gaW5zdGFuY2Ugb2YgYGZ1bmNgXG4gICAgICAgIHZhciB0aGlzQmluZGluZyA9IGJhc2VDcmVhdGUoZnVuYy5wcm90b3R5cGUpLFxuICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQmluZGluZywgYXJncyB8fCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gaXNPYmplY3QocmVzdWx0KSA/IHJlc3VsdCA6IHRoaXNCaW5kaW5nO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyB8fCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICBzZXRCaW5kRGF0YShib3VuZCwgYmluZERhdGEpO1xuICAgIHJldHVybiBib3VuZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jbG9uZWAgd2l0aG91dCBhcmd1bWVudCBqdWdnbGluZyBvciBzdXBwb3J0XG4gICAqIGZvciBgdGhpc0FyZ2AgYmluZGluZy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2xvbmUuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcD1mYWxzZV0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjbG9uaW5nIHZhbHVlcy5cbiAgICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQT1bXV0gVHJhY2tzIHRyYXZlcnNlZCBzb3VyY2Ugb2JqZWN0cy5cbiAgICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQj1bXV0gQXNzb2NpYXRlcyBjbG9uZXMgd2l0aCBzb3VyY2UgY291bnRlcnBhcnRzLlxuICAgKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgY2xvbmVkIHZhbHVlLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZUNsb25lKHZhbHVlLCBpc0RlZXAsIGNhbGxiYWNrLCBzdGFja0EsIHN0YWNrQikge1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgdmFyIHJlc3VsdCA9IGNhbGxiYWNrKHZhbHVlKTtcbiAgICAgIGlmICh0eXBlb2YgcmVzdWx0ICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGluc3BlY3QgW1tDbGFzc11dXG4gICAgdmFyIGlzT2JqID0gaXNPYmplY3QodmFsdWUpO1xuICAgIGlmIChpc09iaikge1xuICAgICAgdmFyIGNsYXNzTmFtZSA9IHRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICAgICAgaWYgKCFjbG9uZWFibGVDbGFzc2VzW2NsYXNzTmFtZV0gfHwgKCFzdXBwb3J0Lm5vZGVDbGFzcyAmJiBpc05vZGUodmFsdWUpKSkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgICB2YXIgY3RvciA9IGN0b3JCeUNsYXNzW2NsYXNzTmFtZV07XG4gICAgICBzd2l0Y2ggKGNsYXNzTmFtZSkge1xuICAgICAgICBjYXNlIGJvb2xDbGFzczpcbiAgICAgICAgY2FzZSBkYXRlQ2xhc3M6XG4gICAgICAgICAgcmV0dXJuIG5ldyBjdG9yKCt2YWx1ZSk7XG5cbiAgICAgICAgY2FzZSBudW1iZXJDbGFzczpcbiAgICAgICAgY2FzZSBzdHJpbmdDbGFzczpcbiAgICAgICAgICByZXR1cm4gbmV3IGN0b3IodmFsdWUpO1xuXG4gICAgICAgIGNhc2UgcmVnZXhwQ2xhc3M6XG4gICAgICAgICAgcmVzdWx0ID0gY3Rvcih2YWx1ZS5zb3VyY2UsIHJlRmxhZ3MuZXhlYyh2YWx1ZSkpO1xuICAgICAgICAgIHJlc3VsdC5sYXN0SW5kZXggPSB2YWx1ZS5sYXN0SW5kZXg7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKTtcbiAgICBpZiAoaXNEZWVwKSB7XG4gICAgICAvLyBjaGVjayBmb3IgY2lyY3VsYXIgcmVmZXJlbmNlcyBhbmQgcmV0dXJuIGNvcnJlc3BvbmRpbmcgY2xvbmVcbiAgICAgIHZhciBpbml0ZWRTdGFjayA9ICFzdGFja0E7XG4gICAgICBzdGFja0EgfHwgKHN0YWNrQSA9IGdldEFycmF5KCkpO1xuICAgICAgc3RhY2tCIHx8IChzdGFja0IgPSBnZXRBcnJheSgpKTtcblxuICAgICAgdmFyIGxlbmd0aCA9IHN0YWNrQS5sZW5ndGg7XG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgaWYgKHN0YWNrQVtsZW5ndGhdID09IHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIHN0YWNrQltsZW5ndGhdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXN1bHQgPSBpc0FyciA/IGN0b3IodmFsdWUubGVuZ3RoKSA6IHt9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJlc3VsdCA9IGlzQXJyID8gc2xpY2UodmFsdWUpIDogYXNzaWduKHt9LCB2YWx1ZSk7XG4gICAgfVxuICAgIC8vIGFkZCBhcnJheSBwcm9wZXJ0aWVzIGFzc2lnbmVkIGJ5IGBSZWdFeHAjZXhlY2BcbiAgICBpZiAoaXNBcnIpIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnaW5kZXgnKSkge1xuICAgICAgICByZXN1bHQuaW5kZXggPSB2YWx1ZS5pbmRleDtcbiAgICAgIH1cbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnaW5wdXQnKSkge1xuICAgICAgICByZXN1bHQuaW5wdXQgPSB2YWx1ZS5pbnB1dDtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gZXhpdCBmb3Igc2hhbGxvdyBjbG9uZVxuICAgIGlmICghaXNEZWVwKSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICAvLyBhZGQgdGhlIHNvdXJjZSB2YWx1ZSB0byB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHNcbiAgICAvLyBhbmQgYXNzb2NpYXRlIGl0IHdpdGggaXRzIGNsb25lXG4gICAgc3RhY2tBLnB1c2godmFsdWUpO1xuICAgIHN0YWNrQi5wdXNoKHJlc3VsdCk7XG5cbiAgICAvLyByZWN1cnNpdmVseSBwb3B1bGF0ZSBjbG9uZSAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpXG4gICAgKGlzQXJyID8gYmFzZUVhY2ggOiBmb3JPd24pKHZhbHVlLCBmdW5jdGlvbihvYmpWYWx1ZSwga2V5KSB7XG4gICAgICByZXN1bHRba2V5XSA9IGJhc2VDbG9uZShvYmpWYWx1ZSwgaXNEZWVwLCBjYWxsYmFjaywgc3RhY2tBLCBzdGFja0IpO1xuICAgIH0pO1xuXG4gICAgaWYgKGluaXRlZFN0YWNrKSB7XG4gICAgICByZWxlYXNlQXJyYXkoc3RhY2tBKTtcbiAgICAgIHJlbGVhc2VBcnJheShzdGFja0IpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmNyZWF0ZWAgd2l0aG91dCBzdXBwb3J0IGZvciBhc3NpZ25pbmdcbiAgICogcHJvcGVydGllcyB0byB0aGUgY3JlYXRlZCBvYmplY3QuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwcm90b3R5cGUgVGhlIG9iamVjdCB0byBpbmhlcml0IGZyb20uXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gICAqL1xuICBmdW5jdGlvbiBiYXNlQ3JlYXRlKHByb3RvdHlwZSwgcHJvcGVydGllcykge1xuICAgIHJldHVybiBpc09iamVjdChwcm90b3R5cGUpID8gbmF0aXZlQ3JlYXRlKHByb3RvdHlwZSkgOiB7fTtcbiAgfVxuICAvLyBmYWxsYmFjayBmb3IgYnJvd3NlcnMgd2l0aG91dCBgT2JqZWN0LmNyZWF0ZWBcbiAgaWYgKCFuYXRpdmVDcmVhdGUpIHtcbiAgICBiYXNlQ3JlYXRlID0gKGZ1bmN0aW9uKCkge1xuICAgICAgZnVuY3Rpb24gT2JqZWN0KCkge31cbiAgICAgIHJldHVybiBmdW5jdGlvbihwcm90b3R5cGUpIHtcbiAgICAgICAgaWYgKGlzT2JqZWN0KHByb3RvdHlwZSkpIHtcbiAgICAgICAgICBPYmplY3QucHJvdG90eXBlID0gcHJvdG90eXBlO1xuICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgT2JqZWN0O1xuICAgICAgICAgIE9iamVjdC5wcm90b3R5cGUgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQgfHwgcm9vdC5PYmplY3QoKTtcbiAgICAgIH07XG4gICAgfSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jcmVhdGVDYWxsYmFja2Agd2l0aG91dCBzdXBwb3J0IGZvciBjcmVhdGluZ1xuICAgKiBcIl8ucGx1Y2tcIiBvciBcIl8ud2hlcmVcIiBzdHlsZSBjYWxsYmFja3MuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7Kn0gW2Z1bmM9aWRlbnRpdHldIFRoZSB2YWx1ZSB0byBjb252ZXJ0IHRvIGEgY2FsbGJhY2suXG4gICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiB0aGUgY3JlYXRlZCBjYWxsYmFjay5cbiAgICogQHBhcmFtIHtudW1iZXJ9IFthcmdDb3VudF0gVGhlIG51bWJlciBvZiBhcmd1bWVudHMgdGhlIGNhbGxiYWNrIGFjY2VwdHMuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBhIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZUNyZWF0ZUNhbGxiYWNrKGZ1bmMsIHRoaXNBcmcsIGFyZ0NvdW50KSB7XG4gICAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBpZGVudGl0eTtcbiAgICB9XG4gICAgLy8gZXhpdCBlYXJseSBmb3Igbm8gYHRoaXNBcmdgIG9yIGFscmVhZHkgYm91bmQgYnkgYEZ1bmN0aW9uI2JpbmRgXG4gICAgaWYgKHR5cGVvZiB0aGlzQXJnID09ICd1bmRlZmluZWQnIHx8ICEoJ3Byb3RvdHlwZScgaW4gZnVuYykpIHtcbiAgICAgIHJldHVybiBmdW5jO1xuICAgIH1cbiAgICB2YXIgYmluZERhdGEgPSBmdW5jLl9fYmluZERhdGFfXztcbiAgICBpZiAodHlwZW9mIGJpbmREYXRhID09ICd1bmRlZmluZWQnKSB7XG4gICAgICBpZiAoc3VwcG9ydC5mdW5jTmFtZXMpIHtcbiAgICAgICAgYmluZERhdGEgPSAhZnVuYy5uYW1lO1xuICAgICAgfVxuICAgICAgYmluZERhdGEgPSBiaW5kRGF0YSB8fCAhc3VwcG9ydC5mdW5jRGVjb21wO1xuICAgICAgaWYgKCFiaW5kRGF0YSkge1xuICAgICAgICB2YXIgc291cmNlID0gZm5Ub1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgICAgICBpZiAoIXN1cHBvcnQuZnVuY05hbWVzKSB7XG4gICAgICAgICAgYmluZERhdGEgPSAhcmVGdW5jTmFtZS50ZXN0KHNvdXJjZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFiaW5kRGF0YSkge1xuICAgICAgICAgIC8vIGNoZWNrcyBpZiBgZnVuY2AgcmVmZXJlbmNlcyB0aGUgYHRoaXNgIGtleXdvcmQgYW5kIHN0b3JlcyB0aGUgcmVzdWx0XG4gICAgICAgICAgYmluZERhdGEgPSByZVRoaXMudGVzdChzb3VyY2UpO1xuICAgICAgICAgIHNldEJpbmREYXRhKGZ1bmMsIGJpbmREYXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBleGl0IGVhcmx5IGlmIHRoZXJlIGFyZSBubyBgdGhpc2AgcmVmZXJlbmNlcyBvciBgZnVuY2AgaXMgYm91bmRcbiAgICBpZiAoYmluZERhdGEgPT09IGZhbHNlIHx8IChiaW5kRGF0YSAhPT0gdHJ1ZSAmJiBiaW5kRGF0YVsxXSAmIDEpKSB7XG4gICAgICByZXR1cm4gZnVuYztcbiAgICB9XG4gICAgc3dpdGNoIChhcmdDb3VudCkge1xuICAgICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCB2YWx1ZSk7XG4gICAgICB9O1xuICAgICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGEsIGIpO1xuICAgICAgfTtcbiAgICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICB9O1xuICAgICAgY2FzZSA0OiByZXR1cm4gZnVuY3Rpb24oYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGJpbmQoZnVuYywgdGhpc0FyZyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGNyZWF0ZVdyYXBwZXJgIHRoYXQgY3JlYXRlcyB0aGUgd3JhcHBlciBhbmRcbiAgICogc2V0cyBpdHMgbWV0YSBkYXRhLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5fSBiaW5kRGF0YSBUaGUgYmluZCBkYXRhIGFycmF5LlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIGJhc2VDcmVhdGVXcmFwcGVyKGJpbmREYXRhKSB7XG4gICAgdmFyIGZ1bmMgPSBiaW5kRGF0YVswXSxcbiAgICAgICAgYml0bWFzayA9IGJpbmREYXRhWzFdLFxuICAgICAgICBwYXJ0aWFsQXJncyA9IGJpbmREYXRhWzJdLFxuICAgICAgICBwYXJ0aWFsUmlnaHRBcmdzID0gYmluZERhdGFbM10sXG4gICAgICAgIHRoaXNBcmcgPSBiaW5kRGF0YVs0XSxcbiAgICAgICAgYXJpdHkgPSBiaW5kRGF0YVs1XTtcblxuICAgIHZhciBpc0JpbmQgPSBiaXRtYXNrICYgMSxcbiAgICAgICAgaXNCaW5kS2V5ID0gYml0bWFzayAmIDIsXG4gICAgICAgIGlzQ3VycnkgPSBiaXRtYXNrICYgNCxcbiAgICAgICAgaXNDdXJyeUJvdW5kID0gYml0bWFzayAmIDgsXG4gICAgICAgIGtleSA9IGZ1bmM7XG5cbiAgICBmdW5jdGlvbiBib3VuZCgpIHtcbiAgICAgIHZhciB0aGlzQmluZGluZyA9IGlzQmluZCA/IHRoaXNBcmcgOiB0aGlzO1xuICAgICAgaWYgKHBhcnRpYWxBcmdzKSB7XG4gICAgICAgIHZhciBhcmdzID0gc2xpY2UocGFydGlhbEFyZ3MpO1xuICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICBpZiAocGFydGlhbFJpZ2h0QXJncyB8fCBpc0N1cnJ5KSB7XG4gICAgICAgIGFyZ3MgfHwgKGFyZ3MgPSBzbGljZShhcmd1bWVudHMpKTtcbiAgICAgICAgaWYgKHBhcnRpYWxSaWdodEFyZ3MpIHtcbiAgICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIHBhcnRpYWxSaWdodEFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0N1cnJ5ICYmIGFyZ3MubGVuZ3RoIDwgYXJpdHkpIHtcbiAgICAgICAgICBiaXRtYXNrIHw9IDE2ICYgfjMyO1xuICAgICAgICAgIHJldHVybiBiYXNlQ3JlYXRlV3JhcHBlcihbZnVuYywgKGlzQ3VycnlCb3VuZCA/IGJpdG1hc2sgOiBiaXRtYXNrICYgfjMpLCBhcmdzLCBudWxsLCB0aGlzQXJnLCBhcml0eV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBhcmdzIHx8IChhcmdzID0gYXJndW1lbnRzKTtcbiAgICAgIGlmIChpc0JpbmRLZXkpIHtcbiAgICAgICAgZnVuYyA9IHRoaXNCaW5kaW5nW2tleV07XG4gICAgICB9XG4gICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSB7XG4gICAgICAgIHRoaXNCaW5kaW5nID0gYmFzZUNyZWF0ZShmdW5jLnByb3RvdHlwZSk7XG4gICAgICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNCaW5kaW5nLCBhcmdzKTtcbiAgICAgICAgcmV0dXJuIGlzT2JqZWN0KHJlc3VsdCkgPyByZXN1bHQgOiB0aGlzQmluZGluZztcbiAgICAgIH1cbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXNCaW5kaW5nLCBhcmdzKTtcbiAgICB9XG4gICAgc2V0QmluZERhdGEoYm91bmQsIGJpbmREYXRhKTtcbiAgICByZXR1cm4gYm91bmQ7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubWVyZ2VgIHdpdGhvdXQgYXJndW1lbnQganVnZ2xpbmcgb3Igc3VwcG9ydFxuICAgKiBmb3IgYHRoaXNBcmdgIGJpbmRpbmcuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIG1lcmdpbmcgcHJvcGVydGllcy5cbiAgICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQT1bXV0gVHJhY2tzIHRyYXZlcnNlZCBzb3VyY2Ugb2JqZWN0cy5cbiAgICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQj1bXV0gQXNzb2NpYXRlcyB2YWx1ZXMgd2l0aCBzb3VyY2UgY291bnRlcnBhcnRzLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZU1lcmdlKG9iamVjdCwgc291cmNlLCBjYWxsYmFjaywgc3RhY2tBLCBzdGFja0IpIHtcbiAgICAoaXNBcnJheShzb3VyY2UpID8gZm9yRWFjaCA6IGZvck93bikoc291cmNlLCBmdW5jdGlvbihzb3VyY2UsIGtleSkge1xuICAgICAgdmFyIGZvdW5kLFxuICAgICAgICAgIGlzQXJyLFxuICAgICAgICAgIHJlc3VsdCA9IHNvdXJjZSxcbiAgICAgICAgICB2YWx1ZSA9IG9iamVjdFtrZXldO1xuXG4gICAgICBpZiAoc291cmNlICYmICgoaXNBcnIgPSBpc0FycmF5KHNvdXJjZSkpIHx8IGlzUGxhaW5PYmplY3Qoc291cmNlKSkpIHtcbiAgICAgICAgLy8gYXZvaWQgbWVyZ2luZyBwcmV2aW91c2x5IG1lcmdlZCBjeWNsaWMgc291cmNlc1xuICAgICAgICB2YXIgc3RhY2tMZW5ndGggPSBzdGFja0EubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoc3RhY2tMZW5ndGgtLSkge1xuICAgICAgICAgIGlmICgoZm91bmQgPSBzdGFja0Fbc3RhY2tMZW5ndGhdID09IHNvdXJjZSkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gc3RhY2tCW3N0YWNrTGVuZ3RoXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgdmFyIGlzU2hhbGxvdztcbiAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGNhbGxiYWNrKHZhbHVlLCBzb3VyY2UpO1xuICAgICAgICAgICAgaWYgKChpc1NoYWxsb3cgPSB0eXBlb2YgcmVzdWx0ICE9ICd1bmRlZmluZWQnKSkge1xuICAgICAgICAgICAgICB2YWx1ZSA9IHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFpc1NoYWxsb3cpIHtcbiAgICAgICAgICAgIHZhbHVlID0gaXNBcnJcbiAgICAgICAgICAgICAgPyAoaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZSA6IFtdKVxuICAgICAgICAgICAgICA6IChpc1BsYWluT2JqZWN0KHZhbHVlKSA/IHZhbHVlIDoge30pO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBhZGQgYHNvdXJjZWAgYW5kIGFzc29jaWF0ZWQgYHZhbHVlYCB0byB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHNcbiAgICAgICAgICBzdGFja0EucHVzaChzb3VyY2UpO1xuICAgICAgICAgIHN0YWNrQi5wdXNoKHZhbHVlKTtcblxuICAgICAgICAgIC8vIHJlY3Vyc2l2ZWx5IG1lcmdlIG9iamVjdHMgYW5kIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpXG4gICAgICAgICAgaWYgKCFpc1NoYWxsb3cpIHtcbiAgICAgICAgICAgIGJhc2VNZXJnZSh2YWx1ZSwgc291cmNlLCBjYWxsYmFjaywgc3RhY2tBLCBzdGFja0IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIHJlc3VsdCA9IGNhbGxiYWNrKHZhbHVlLCBzb3VyY2UpO1xuICAgICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBzb3VyY2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgdmFsdWUgPSByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQsIHdoZW4gY2FsbGVkLCBlaXRoZXIgY3VycmllcyBvciBpbnZva2VzIGBmdW5jYFxuICAgKiB3aXRoIGFuIG9wdGlvbmFsIGB0aGlzYCBiaW5kaW5nIGFuZCBwYXJ0aWFsbHkgYXBwbGllZCBhcmd1bWVudHMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb258c3RyaW5nfSBmdW5jIFRoZSBmdW5jdGlvbiBvciBtZXRob2QgbmFtZSB0byByZWZlcmVuY2UuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIG9mIG1ldGhvZCBmbGFncyB0byBjb21wb3NlLlxuICAgKiAgVGhlIGJpdG1hc2sgbWF5IGJlIGNvbXBvc2VkIG9mIHRoZSBmb2xsb3dpbmcgZmxhZ3M6XG4gICAqICAxIC0gYF8uYmluZGBcbiAgICogIDIgLSBgXy5iaW5kS2V5YFxuICAgKiAgNCAtIGBfLmN1cnJ5YFxuICAgKiAgOCAtIGBfLmN1cnJ5YCAoYm91bmQpXG4gICAqICAxNiAtIGBfLnBhcnRpYWxgXG4gICAqICAzMiAtIGBfLnBhcnRpYWxSaWdodGBcbiAgICogQHBhcmFtIHtBcnJheX0gW3BhcnRpYWxBcmdzXSBBbiBhcnJheSBvZiBhcmd1bWVudHMgdG8gcHJlcGVuZCB0byB0aG9zZVxuICAgKiAgcHJvdmlkZWQgdG8gdGhlIG5ldyBmdW5jdGlvbi5cbiAgICogQHBhcmFtIHtBcnJheX0gW3BhcnRpYWxSaWdodEFyZ3NdIEFuIGFycmF5IG9mIGFyZ3VtZW50cyB0byBhcHBlbmQgdG8gdGhvc2VcbiAgICogIHByb3ZpZGVkIHRvIHRoZSBuZXcgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbYXJpdHldIFRoZSBhcml0eSBvZiBgZnVuY2AuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gY3JlYXRlV3JhcHBlcihmdW5jLCBiaXRtYXNrLCBwYXJ0aWFsQXJncywgcGFydGlhbFJpZ2h0QXJncywgdGhpc0FyZywgYXJpdHkpIHtcbiAgICB2YXIgaXNCaW5kID0gYml0bWFzayAmIDEsXG4gICAgICAgIGlzQmluZEtleSA9IGJpdG1hc2sgJiAyLFxuICAgICAgICBpc0N1cnJ5ID0gYml0bWFzayAmIDQsXG4gICAgICAgIGlzQ3VycnlCb3VuZCA9IGJpdG1hc2sgJiA4LFxuICAgICAgICBpc1BhcnRpYWwgPSBiaXRtYXNrICYgMTYsXG4gICAgICAgIGlzUGFydGlhbFJpZ2h0ID0gYml0bWFzayAmIDMyO1xuXG4gICAgaWYgKCFpc0JpbmRLZXkgJiYgIWlzRnVuY3Rpb24oZnVuYykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3I7XG4gICAgfVxuICAgIGlmIChpc1BhcnRpYWwgJiYgIXBhcnRpYWxBcmdzLmxlbmd0aCkge1xuICAgICAgYml0bWFzayAmPSB+MTY7XG4gICAgICBpc1BhcnRpYWwgPSBwYXJ0aWFsQXJncyA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAoaXNQYXJ0aWFsUmlnaHQgJiYgIXBhcnRpYWxSaWdodEFyZ3MubGVuZ3RoKSB7XG4gICAgICBiaXRtYXNrICY9IH4zMjtcbiAgICAgIGlzUGFydGlhbFJpZ2h0ID0gcGFydGlhbFJpZ2h0QXJncyA9IGZhbHNlO1xuICAgIH1cbiAgICB2YXIgYmluZERhdGEgPSBmdW5jICYmIGZ1bmMuX19iaW5kRGF0YV9fO1xuICAgIGlmIChiaW5kRGF0YSAmJiBiaW5kRGF0YSAhPT0gdHJ1ZSkge1xuICAgICAgLy8gY2xvbmUgYGJpbmREYXRhYFxuICAgICAgYmluZERhdGEgPSBzbGljZShiaW5kRGF0YSk7XG4gICAgICBpZiAoYmluZERhdGFbMl0pIHtcbiAgICAgICAgYmluZERhdGFbMl0gPSBzbGljZShiaW5kRGF0YVsyXSk7XG4gICAgICB9XG4gICAgICBpZiAoYmluZERhdGFbM10pIHtcbiAgICAgICAgYmluZERhdGFbM10gPSBzbGljZShiaW5kRGF0YVszXSk7XG4gICAgICB9XG4gICAgICAvLyBzZXQgYHRoaXNCaW5kaW5nYCBpcyBub3QgcHJldmlvdXNseSBib3VuZFxuICAgICAgaWYgKGlzQmluZCAmJiAhKGJpbmREYXRhWzFdICYgMSkpIHtcbiAgICAgICAgYmluZERhdGFbNF0gPSB0aGlzQXJnO1xuICAgICAgfVxuICAgICAgLy8gc2V0IGlmIHByZXZpb3VzbHkgYm91bmQgYnV0IG5vdCBjdXJyZW50bHkgKHN1YnNlcXVlbnQgY3VycmllZCBmdW5jdGlvbnMpXG4gICAgICBpZiAoIWlzQmluZCAmJiBiaW5kRGF0YVsxXSAmIDEpIHtcbiAgICAgICAgYml0bWFzayB8PSA4O1xuICAgICAgfVxuICAgICAgLy8gc2V0IGN1cnJpZWQgYXJpdHkgaWYgbm90IHlldCBzZXRcbiAgICAgIGlmIChpc0N1cnJ5ICYmICEoYmluZERhdGFbMV0gJiA0KSkge1xuICAgICAgICBiaW5kRGF0YVs1XSA9IGFyaXR5O1xuICAgICAgfVxuICAgICAgLy8gYXBwZW5kIHBhcnRpYWwgbGVmdCBhcmd1bWVudHNcbiAgICAgIGlmIChpc1BhcnRpYWwpIHtcbiAgICAgICAgcHVzaC5hcHBseShiaW5kRGF0YVsyXSB8fCAoYmluZERhdGFbMl0gPSBbXSksIHBhcnRpYWxBcmdzKTtcbiAgICAgIH1cbiAgICAgIC8vIGFwcGVuZCBwYXJ0aWFsIHJpZ2h0IGFyZ3VtZW50c1xuICAgICAgaWYgKGlzUGFydGlhbFJpZ2h0KSB7XG4gICAgICAgIHVuc2hpZnQuYXBwbHkoYmluZERhdGFbM10gfHwgKGJpbmREYXRhWzNdID0gW10pLCBwYXJ0aWFsUmlnaHRBcmdzKTtcbiAgICAgIH1cbiAgICAgIC8vIG1lcmdlIGZsYWdzXG4gICAgICBiaW5kRGF0YVsxXSB8PSBiaXRtYXNrO1xuICAgICAgcmV0dXJuIGNyZWF0ZVdyYXBwZXIuYXBwbHkobnVsbCwgYmluZERhdGEpO1xuICAgIH1cbiAgICAvLyBmYXN0IHBhdGggZm9yIGBfLmJpbmRgXG4gICAgdmFyIGNyZWF0ZXIgPSAoYml0bWFzayA9PSAxIHx8IGJpdG1hc2sgPT09IDE3KSA/IGJhc2VCaW5kIDogYmFzZUNyZWF0ZVdyYXBwZXI7XG4gICAgcmV0dXJuIGNyZWF0ZXIoW2Z1bmMsIGJpdG1hc2ssIHBhcnRpYWxBcmdzLCBwYXJ0aWFsUmlnaHRBcmdzLCB0aGlzQXJnLCBhcml0eV0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgY29tcGlsZWQgaXRlcmF0aW9uIGZ1bmN0aW9ucy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsuLi5PYmplY3R9IFtvcHRpb25zXSBUaGUgY29tcGlsZSBvcHRpb25zIG9iamVjdChzKS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmFycmF5XSBDb2RlIHRvIGRldGVybWluZSBpZiB0aGUgaXRlcmFibGUgaXMgYW4gYXJyYXkgb3IgYXJyYXktbGlrZS5cbiAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy51c2VIYXNdIFNwZWNpZnkgdXNpbmcgYGhhc093blByb3BlcnR5YCBjaGVja3MgaW4gdGhlIG9iamVjdCBsb29wLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5rZXlzXSBBIHJlZmVyZW5jZSB0byBgXy5rZXlzYCBmb3IgdXNlIGluIG93biBwcm9wZXJ0eSBpdGVyYXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5hcmdzXSBBIGNvbW1hIHNlcGFyYXRlZCBzdHJpbmcgb2YgaXRlcmF0aW9uIGZ1bmN0aW9uIGFyZ3VtZW50cy5cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLnRvcF0gQ29kZSB0byBleGVjdXRlIGJlZm9yZSB0aGUgaXRlcmF0aW9uIGJyYW5jaGVzLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubG9vcF0gQ29kZSB0byBleGVjdXRlIGluIHRoZSBvYmplY3QgbG9vcC5cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmJvdHRvbV0gQ29kZSB0byBleGVjdXRlIGFmdGVyIHRoZSBpdGVyYXRpb24gYnJhbmNoZXMuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgY29tcGlsZWQgZnVuY3Rpb24uXG4gICAqL1xuICBmdW5jdGlvbiBjcmVhdGVJdGVyYXRvcigpIHtcbiAgICAvLyBkYXRhIHByb3BlcnRpZXNcbiAgICBpdGVyYXRvckRhdGEuc2hhZG93ZWRQcm9wcyA9IHNoYWRvd2VkUHJvcHM7XG5cbiAgICAvLyBpdGVyYXRvciBvcHRpb25zXG4gICAgaXRlcmF0b3JEYXRhLmFycmF5ID0gaXRlcmF0b3JEYXRhLmJvdHRvbSA9IGl0ZXJhdG9yRGF0YS5sb29wID0gaXRlcmF0b3JEYXRhLnRvcCA9ICcnO1xuICAgIGl0ZXJhdG9yRGF0YS5pbml0ID0gJ2l0ZXJhYmxlJztcbiAgICBpdGVyYXRvckRhdGEudXNlSGFzID0gdHJ1ZTtcblxuICAgIC8vIG1lcmdlIG9wdGlvbnMgaW50byBhIHRlbXBsYXRlIGRhdGEgb2JqZWN0XG4gICAgZm9yICh2YXIgb2JqZWN0LCBpbmRleCA9IDA7IG9iamVjdCA9IGFyZ3VtZW50c1tpbmRleF07IGluZGV4KyspIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgaXRlcmF0b3JEYXRhW2tleV0gPSBvYmplY3Rba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGFyZ3MgPSBpdGVyYXRvckRhdGEuYXJncztcbiAgICBpdGVyYXRvckRhdGEuZmlyc3RBcmcgPSAvXlteLF0rLy5leGVjKGFyZ3MpWzBdO1xuXG4gICAgLy8gY3JlYXRlIHRoZSBmdW5jdGlvbiBmYWN0b3J5XG4gICAgdmFyIGZhY3RvcnkgPSBGdW5jdGlvbihcbiAgICAgICAgJ2Jhc2VDcmVhdGVDYWxsYmFjaywgZXJyb3JDbGFzcywgZXJyb3JQcm90bywgaGFzT3duUHJvcGVydHksICcgK1xuICAgICAgICAnaW5kaWNhdG9yT2JqZWN0LCBpc0FyZ3VtZW50cywgaXNBcnJheSwgaXNTdHJpbmcsIGtleXMsIG9iamVjdFByb3RvLCAnICtcbiAgICAgICAgJ29iamVjdFR5cGVzLCBub25FbnVtUHJvcHMsIHN0cmluZ0NsYXNzLCBzdHJpbmdQcm90bywgdG9TdHJpbmcnLFxuICAgICAgJ3JldHVybiBmdW5jdGlvbignICsgYXJncyArICcpIHtcXG4nICsgaXRlcmF0b3JUZW1wbGF0ZShpdGVyYXRvckRhdGEpICsgJ1xcbn0nXG4gICAgKTtcblxuICAgIC8vIHJldHVybiB0aGUgY29tcGlsZWQgZnVuY3Rpb25cbiAgICByZXR1cm4gZmFjdG9yeShcbiAgICAgIGJhc2VDcmVhdGVDYWxsYmFjaywgZXJyb3JDbGFzcywgZXJyb3JQcm90bywgaGFzT3duUHJvcGVydHksXG4gICAgICBpbmRpY2F0b3JPYmplY3QsIGlzQXJndW1lbnRzLCBpc0FycmF5LCBpc1N0cmluZywgaXRlcmF0b3JEYXRhLmtleXMsIG9iamVjdFByb3RvLFxuICAgICAgb2JqZWN0VHlwZXMsIG5vbkVudW1Qcm9wcywgc3RyaW5nQ2xhc3MsIHN0cmluZ1Byb3RvLCB0b1N0cmluZ1xuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAgICovXG4gIGZ1bmN0aW9uIGlzTmF0aXZlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nICYmIHJlTmF0aXZlLnRlc3QodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYHRoaXNgIGJpbmRpbmcgZGF0YSBvbiBhIGdpdmVuIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBzZXQgZGF0YSBvbi5cbiAgICogQHBhcmFtIHtBcnJheX0gdmFsdWUgVGhlIGRhdGEgYXJyYXkgdG8gc2V0LlxuICAgKi9cbiAgdmFyIHNldEJpbmREYXRhID0gIWRlZmluZVByb3BlcnR5ID8gbm9vcCA6IGZ1bmN0aW9uKGZ1bmMsIHZhbHVlKSB7XG4gICAgZGVzY3JpcHRvci52YWx1ZSA9IHZhbHVlO1xuICAgIGRlZmluZVByb3BlcnR5KGZ1bmMsICdfX2JpbmREYXRhX18nLCBkZXNjcmlwdG9yKTtcbiAgfTtcblxuICAvKipcbiAgICogQSBmYWxsYmFjayBpbXBsZW1lbnRhdGlvbiBvZiBgaXNQbGFpbk9iamVjdGAgd2hpY2ggY2hlY2tzIGlmIGEgZ2l2ZW4gdmFsdWVcbiAgICogaXMgYW4gb2JqZWN0IGNyZWF0ZWQgYnkgdGhlIGBPYmplY3RgIGNvbnN0cnVjdG9yLCBhc3N1bWluZyBvYmplY3RzIGNyZWF0ZWRcbiAgICogYnkgdGhlIGBPYmplY3RgIGNvbnN0cnVjdG9yIGhhdmUgbm8gaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydGllcyBhbmQgdGhhdFxuICAgKiB0aGVyZSBhcmUgbm8gYE9iamVjdC5wcm90b3R5cGVgIGV4dGVuc2lvbnMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHBsYWluIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICAgKi9cbiAgZnVuY3Rpb24gc2hpbUlzUGxhaW5PYmplY3QodmFsdWUpIHtcbiAgICB2YXIgY3RvcixcbiAgICAgICAgcmVzdWx0O1xuXG4gICAgLy8gYXZvaWQgbm9uIE9iamVjdCBvYmplY3RzLCBgYXJndW1lbnRzYCBvYmplY3RzLCBhbmQgRE9NIGVsZW1lbnRzXG4gICAgaWYgKCEodmFsdWUgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gb2JqZWN0Q2xhc3MpIHx8XG4gICAgICAgIChjdG9yID0gdmFsdWUuY29uc3RydWN0b3IsIGlzRnVuY3Rpb24oY3RvcikgJiYgIShjdG9yIGluc3RhbmNlb2YgY3RvcikpIHx8XG4gICAgICAgICghc3VwcG9ydC5hcmdzQ2xhc3MgJiYgaXNBcmd1bWVudHModmFsdWUpKSB8fFxuICAgICAgICAoIXN1cHBvcnQubm9kZUNsYXNzICYmIGlzTm9kZSh2YWx1ZSkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIElFIDwgOSBpdGVyYXRlcyBpbmhlcml0ZWQgcHJvcGVydGllcyBiZWZvcmUgb3duIHByb3BlcnRpZXMuIElmIHRoZSBmaXJzdFxuICAgIC8vIGl0ZXJhdGVkIHByb3BlcnR5IGlzIGFuIG9iamVjdCdzIG93biBwcm9wZXJ0eSB0aGVuIHRoZXJlIGFyZSBubyBpbmhlcml0ZWRcbiAgICAvLyBlbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gICAgaWYgKHN1cHBvcnQub3duTGFzdCkge1xuICAgICAgZm9ySW4odmFsdWUsIGZ1bmN0aW9uKHZhbHVlLCBrZXksIG9iamVjdCkge1xuICAgICAgICByZXN1bHQgPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0ICE9PSBmYWxzZTtcbiAgICB9XG4gICAgLy8gSW4gbW9zdCBlbnZpcm9ubWVudHMgYW4gb2JqZWN0J3Mgb3duIHByb3BlcnRpZXMgYXJlIGl0ZXJhdGVkIGJlZm9yZVxuICAgIC8vIGl0cyBpbmhlcml0ZWQgcHJvcGVydGllcy4gSWYgdGhlIGxhc3QgaXRlcmF0ZWQgcHJvcGVydHkgaXMgYW4gb2JqZWN0J3NcbiAgICAvLyBvd24gcHJvcGVydHkgdGhlbiB0aGVyZSBhcmUgbm8gaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydGllcy5cbiAgICBmb3JJbih2YWx1ZSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgcmVzdWx0ID0ga2V5O1xuICAgIH0pO1xuICAgIHJldHVybiB0eXBlb2YgcmVzdWx0ID09ICd1bmRlZmluZWQnIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHJlc3VsdCk7XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIChmdW5jdGlvbigpIHsgcmV0dXJuIF8uaXNBcmd1bWVudHMoYXJndW1lbnRzKTsgfSkoMSwgMiwgMyk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc0FyZ3VtZW50cyhbMSwgMiwgM10pO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKi9cbiAgZnVuY3Rpb24gaXNBcmd1bWVudHModmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnICYmIHR5cGVvZiB2YWx1ZS5sZW5ndGggPT0gJ251bWJlcicgJiZcbiAgICAgIHRvU3RyaW5nLmNhbGwodmFsdWUpID09IGFyZ3NDbGFzcyB8fCBmYWxzZTtcbiAgfVxuICAvLyBmYWxsYmFjayBmb3IgYnJvd3NlcnMgdGhhdCBjYW4ndCBkZXRlY3QgYGFyZ3VtZW50c2Agb2JqZWN0cyBieSBbW0NsYXNzXV1cbiAgaWYgKCFzdXBwb3J0LmFyZ3NDbGFzcykge1xuICAgIGlzQXJndW1lbnRzID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcgJiYgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PSAnbnVtYmVyJyAmJlxuICAgICAgICBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgJiYgIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodmFsdWUsICdjYWxsZWUnKSB8fCBmYWxzZTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgYW4gYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogKGZ1bmN0aW9uKCkgeyByZXR1cm4gXy5pc0FycmF5KGFyZ3VtZW50cyk7IH0pKCk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqXG4gICAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqL1xuICB2YXIgaXNBcnJheSA9IG5hdGl2ZUlzQXJyYXkgfHwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnICYmIHR5cGVvZiB2YWx1ZS5sZW5ndGggPT0gJ251bWJlcicgJiZcbiAgICAgIHRvU3RyaW5nLmNhbGwodmFsdWUpID09IGFycmF5Q2xhc3MgfHwgZmFsc2U7XG4gIH07XG5cbiAgLyoqXG4gICAqIEEgZmFsbGJhY2sgaW1wbGVtZW50YXRpb24gb2YgYE9iamVjdC5rZXlzYCB3aGljaCBwcm9kdWNlcyBhbiBhcnJheSBvZiB0aGVcbiAgICogZ2l2ZW4gb2JqZWN0J3Mgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnNwZWN0LlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYW4gYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gICAqL1xuICB2YXIgc2hpbUtleXMgPSBjcmVhdGVJdGVyYXRvcih7XG4gICAgJ2FyZ3MnOiAnb2JqZWN0JyxcbiAgICAnaW5pdCc6ICdbXScsXG4gICAgJ3RvcCc6ICdpZiAoIShvYmplY3RUeXBlc1t0eXBlb2Ygb2JqZWN0XSkpIHJldHVybiByZXN1bHQnLFxuICAgICdsb29wJzogJ3Jlc3VsdC5wdXNoKGluZGV4KSdcbiAgfSk7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gYXJyYXkgY29tcG9zZWQgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGFuIG9iamVjdC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaW5zcGVjdC5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGFuIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmtleXMoeyAnb25lJzogMSwgJ3R3byc6IDIsICd0aHJlZSc6IDMgfSk7XG4gICAqIC8vID0+IFsnb25lJywgJ3R3bycsICd0aHJlZSddIChwcm9wZXJ0eSBvcmRlciBpcyBub3QgZ3VhcmFudGVlZCBhY3Jvc3MgZW52aXJvbm1lbnRzKVxuICAgKi9cbiAgdmFyIGtleXMgPSAhbmF0aXZlS2V5cyA/IHNoaW1LZXlzIDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGlmICgoc3VwcG9ydC5lbnVtUHJvdG90eXBlcyAmJiB0eXBlb2Ygb2JqZWN0ID09ICdmdW5jdGlvbicpIHx8XG4gICAgICAgIChzdXBwb3J0Lm5vbkVudW1BcmdzICYmIG9iamVjdC5sZW5ndGggJiYgaXNBcmd1bWVudHMob2JqZWN0KSkpIHtcbiAgICAgIHJldHVybiBzaGltS2V5cyhvYmplY3QpO1xuICAgIH1cbiAgICByZXR1cm4gbmF0aXZlS2V5cyhvYmplY3QpO1xuICB9O1xuXG4gIC8qKiBSZXVzYWJsZSBpdGVyYXRvciBvcHRpb25zIHNoYXJlZCBieSBgZWFjaGAsIGBmb3JJbmAsIGFuZCBgZm9yT3duYCAqL1xuICB2YXIgZWFjaEl0ZXJhdG9yT3B0aW9ucyA9IHtcbiAgICAnYXJncyc6ICdjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZycsXG4gICAgJ3RvcCc6IFwiY2FsbGJhY2sgPSBjYWxsYmFjayAmJiB0eXBlb2YgdGhpc0FyZyA9PSAndW5kZWZpbmVkJyA/IGNhbGxiYWNrIDogYmFzZUNyZWF0ZUNhbGxiYWNrKGNhbGxiYWNrLCB0aGlzQXJnLCAzKVwiLFxuICAgICdhcnJheSc6IFwidHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJ1wiLFxuICAgICdrZXlzJzoga2V5cyxcbiAgICAnbG9vcCc6ICdpZiAoY2FsbGJhY2soaXRlcmFibGVbaW5kZXhdLCBpbmRleCwgY29sbGVjdGlvbikgPT09IGZhbHNlKSByZXR1cm4gcmVzdWx0J1xuICB9O1xuXG4gIC8qKiBSZXVzYWJsZSBpdGVyYXRvciBvcHRpb25zIGZvciBgYXNzaWduYCBhbmQgYGRlZmF1bHRzYCAqL1xuICB2YXIgZGVmYXVsdHNJdGVyYXRvck9wdGlvbnMgPSB7XG4gICAgJ2FyZ3MnOiAnb2JqZWN0LCBzb3VyY2UsIGd1YXJkJyxcbiAgICAndG9wJzpcbiAgICAgICd2YXIgYXJncyA9IGFyZ3VtZW50cyxcXG4nICtcbiAgICAgICcgICAgYXJnc0luZGV4ID0gMCxcXG4nICtcbiAgICAgIFwiICAgIGFyZ3NMZW5ndGggPSB0eXBlb2YgZ3VhcmQgPT0gJ251bWJlcicgPyAyIDogYXJncy5sZW5ndGg7XFxuXCIgK1xuICAgICAgJ3doaWxlICgrK2FyZ3NJbmRleCA8IGFyZ3NMZW5ndGgpIHtcXG4nICtcbiAgICAgICcgIGl0ZXJhYmxlID0gYXJnc1thcmdzSW5kZXhdO1xcbicgK1xuICAgICAgJyAgaWYgKGl0ZXJhYmxlICYmIG9iamVjdFR5cGVzW3R5cGVvZiBpdGVyYWJsZV0pIHsnLFxuICAgICdrZXlzJzoga2V5cyxcbiAgICAnbG9vcCc6IFwiaWYgKHR5cGVvZiByZXN1bHRbaW5kZXhdID09ICd1bmRlZmluZWQnKSByZXN1bHRbaW5kZXhdID0gaXRlcmFibGVbaW5kZXhdXCIsXG4gICAgJ2JvdHRvbSc6ICcgIH1cXG59J1xuICB9O1xuXG4gIC8qKiBSZXVzYWJsZSBpdGVyYXRvciBvcHRpb25zIGZvciBgZm9ySW5gIGFuZCBgZm9yT3duYCAqL1xuICB2YXIgZm9yT3duSXRlcmF0b3JPcHRpb25zID0ge1xuICAgICd0b3AnOiAnaWYgKCFvYmplY3RUeXBlc1t0eXBlb2YgaXRlcmFibGVdKSByZXR1cm4gcmVzdWx0O1xcbicgKyBlYWNoSXRlcmF0b3JPcHRpb25zLnRvcCxcbiAgICAnYXJyYXknOiBmYWxzZVxuICB9O1xuXG4gIC8qKlxuICAgKiBBIGZ1bmN0aW9uIGNvbXBpbGVkIHRvIGl0ZXJhdGUgYGFyZ3VtZW50c2Agb2JqZWN0cywgYXJyYXlzLCBvYmplY3RzLCBhbmRcbiAgICogc3RyaW5ncyBjb25zaXN0ZW5seSBhY3Jvc3MgZW52aXJvbm1lbnRzLCBleGVjdXRpbmcgdGhlIGNhbGxiYWNrIGZvciBlYWNoXG4gICAqIGVsZW1lbnQgaW4gdGhlIGNvbGxlY3Rpb24uIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWRcbiAgICogd2l0aCB0aHJlZSBhcmd1bWVudHM7ICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS4gQ2FsbGJhY2tzIG1heSBleGl0XG4gICAqIGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5IHJldHVybmluZyBgZmFsc2VgLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAdHlwZSBGdW5jdGlvblxuICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R8c3RyaW5nfSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAgICovXG4gIHZhciBiYXNlRWFjaCA9IGNyZWF0ZUl0ZXJhdG9yKGVhY2hJdGVyYXRvck9wdGlvbnMpO1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBBc3NpZ25zIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2Ygc291cmNlIG9iamVjdChzKSB0byB0aGUgZGVzdGluYXRpb25cbiAgICogb2JqZWN0LiBTdWJzZXF1ZW50IHNvdXJjZXMgd2lsbCBvdmVyd3JpdGUgcHJvcGVydHkgYXNzaWdubWVudHMgb2YgcHJldmlvdXNcbiAgICogc291cmNlcy4gSWYgYSBjYWxsYmFjayBpcyBwcm92aWRlZCBpdCB3aWxsIGJlIGV4ZWN1dGVkIHRvIHByb2R1Y2UgdGhlXG4gICAqIGFzc2lnbmVkIHZhbHVlcy4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHR3b1xuICAgKiBhcmd1bWVudHM7IChvYmplY3RWYWx1ZSwgc291cmNlVmFsdWUpLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAqIEBhbGlhcyBleHRlbmRcbiAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICAgKiBAcGFyYW0gey4uLk9iamVjdH0gW3NvdXJjZV0gVGhlIHNvdXJjZSBvYmplY3RzLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgYXNzaWduaW5nIHZhbHVlcy5cbiAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5hc3NpZ24oeyAnbmFtZSc6ICdmcmVkJyB9LCB7ICdlbXBsb3llcic6ICdzbGF0ZScgfSk7XG4gICAqIC8vID0+IHsgJ25hbWUnOiAnZnJlZCcsICdlbXBsb3llcic6ICdzbGF0ZScgfVxuICAgKlxuICAgKiB2YXIgZGVmYXVsdHMgPSBfLnBhcnRpYWxSaWdodChfLmFzc2lnbiwgZnVuY3Rpb24oYSwgYikge1xuICAgKiAgIHJldHVybiB0eXBlb2YgYSA9PSAndW5kZWZpbmVkJyA/IGIgOiBhO1xuICAgKiB9KTtcbiAgICpcbiAgICogdmFyIG9iamVjdCA9IHsgJ25hbWUnOiAnYmFybmV5JyB9O1xuICAgKiBkZWZhdWx0cyhvYmplY3QsIHsgJ25hbWUnOiAnZnJlZCcsICdlbXBsb3llcic6ICdzbGF0ZScgfSk7XG4gICAqIC8vID0+IHsgJ25hbWUnOiAnYmFybmV5JywgJ2VtcGxveWVyJzogJ3NsYXRlJyB9XG4gICAqL1xuICB2YXIgYXNzaWduID0gY3JlYXRlSXRlcmF0b3IoZGVmYXVsdHNJdGVyYXRvck9wdGlvbnMsIHtcbiAgICAndG9wJzpcbiAgICAgIGRlZmF1bHRzSXRlcmF0b3JPcHRpb25zLnRvcC5yZXBsYWNlKCc7JyxcbiAgICAgICAgJztcXG4nICtcbiAgICAgICAgXCJpZiAoYXJnc0xlbmd0aCA+IDMgJiYgdHlwZW9mIGFyZ3NbYXJnc0xlbmd0aCAtIDJdID09ICdmdW5jdGlvbicpIHtcXG5cIiArXG4gICAgICAgICcgIHZhciBjYWxsYmFjayA9IGJhc2VDcmVhdGVDYWxsYmFjayhhcmdzWy0tYXJnc0xlbmd0aCAtIDFdLCBhcmdzW2FyZ3NMZW5ndGgtLV0sIDIpO1xcbicgK1xuICAgICAgICBcIn0gZWxzZSBpZiAoYXJnc0xlbmd0aCA+IDIgJiYgdHlwZW9mIGFyZ3NbYXJnc0xlbmd0aCAtIDFdID09ICdmdW5jdGlvbicpIHtcXG5cIiArXG4gICAgICAgICcgIGNhbGxiYWNrID0gYXJnc1stLWFyZ3NMZW5ndGhdO1xcbicgK1xuICAgICAgICAnfSdcbiAgICAgICksXG4gICAgJ2xvb3AnOiAncmVzdWx0W2luZGV4XSA9IGNhbGxiYWNrID8gY2FsbGJhY2socmVzdWx0W2luZGV4XSwgaXRlcmFibGVbaW5kZXhdKSA6IGl0ZXJhYmxlW2luZGV4XSdcbiAgfSk7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgdmFsdWVgLiBJZiBgaXNEZWVwYCBpcyBgdHJ1ZWAgbmVzdGVkIG9iamVjdHMgd2lsbCBhbHNvXG4gICAqIGJlIGNsb25lZCwgb3RoZXJ3aXNlIHRoZXkgd2lsbCBiZSBhc3NpZ25lZCBieSByZWZlcmVuY2UuIElmIGEgY2FsbGJhY2tcbiAgICogaXMgcHJvdmlkZWQgaXQgd2lsbCBiZSBleGVjdXRlZCB0byBwcm9kdWNlIHRoZSBjbG9uZWQgdmFsdWVzLiBJZiB0aGVcbiAgICogY2FsbGJhY2sgcmV0dXJucyBgdW5kZWZpbmVkYCBjbG9uaW5nIHdpbGwgYmUgaGFuZGxlZCBieSB0aGUgbWV0aG9kIGluc3RlYWQuXG4gICAqIFRoZSBjYWxsYmFjayBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCBvbmUgYXJndW1lbnQ7ICh2YWx1ZSkuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2xvbmUuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcD1mYWxzZV0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjbG9uaW5nIHZhbHVlcy5cbiAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBjbG9uZWQgdmFsdWUuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHZhciBjaGFyYWN0ZXJzID0gW1xuICAgKiAgIHsgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2IH0sXG4gICAqICAgeyAnbmFtZSc6ICdmcmVkJywgICAnYWdlJzogNDAgfVxuICAgKiBdO1xuICAgKlxuICAgKiB2YXIgc2hhbGxvdyA9IF8uY2xvbmUoY2hhcmFjdGVycyk7XG4gICAqIHNoYWxsb3dbMF0gPT09IGNoYXJhY3RlcnNbMF07XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogdmFyIGRlZXAgPSBfLmNsb25lKGNoYXJhY3RlcnMsIHRydWUpO1xuICAgKiBkZWVwWzBdID09PSBjaGFyYWN0ZXJzWzBdO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiBfLm1peGluKHtcbiAgICogICAnY2xvbmUnOiBfLnBhcnRpYWxSaWdodChfLmNsb25lLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgKiAgICAgcmV0dXJuIF8uaXNFbGVtZW50KHZhbHVlKSA/IHZhbHVlLmNsb25lTm9kZShmYWxzZSkgOiB1bmRlZmluZWQ7XG4gICAqICAgfSlcbiAgICogfSk7XG4gICAqXG4gICAqIHZhciBjbG9uZSA9IF8uY2xvbmUoZG9jdW1lbnQuYm9keSk7XG4gICAqIGNsb25lLmNoaWxkTm9kZXMubGVuZ3RoO1xuICAgKiAvLyA9PiAwXG4gICAqL1xuICBmdW5jdGlvbiBjbG9uZSh2YWx1ZSwgaXNEZWVwLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIC8vIGFsbG93cyB3b3JraW5nIHdpdGggXCJDb2xsZWN0aW9uc1wiIG1ldGhvZHMgd2l0aG91dCB1c2luZyB0aGVpciBgaW5kZXhgXG4gICAgLy8gYW5kIGBjb2xsZWN0aW9uYCBhcmd1bWVudHMgZm9yIGBpc0RlZXBgIGFuZCBgY2FsbGJhY2tgXG4gICAgaWYgKHR5cGVvZiBpc0RlZXAgIT0gJ2Jvb2xlYW4nICYmIGlzRGVlcCAhPSBudWxsKSB7XG4gICAgICB0aGlzQXJnID0gY2FsbGJhY2s7XG4gICAgICBjYWxsYmFjayA9IGlzRGVlcDtcbiAgICAgIGlzRGVlcCA9IGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gYmFzZUNsb25lKHZhbHVlLCBpc0RlZXAsIHR5cGVvZiBjYWxsYmFjayA9PSAnZnVuY3Rpb24nICYmIGJhc2VDcmVhdGVDYWxsYmFjayhjYWxsYmFjaywgdGhpc0FyZywgMSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGVzIG92ZXIgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdCxcbiAgICogZXhlY3V0aW5nIHRoZSBjYWxsYmFjayBmb3IgZWFjaCBwcm9wZXJ0eS4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYFxuICAgKiBhbmQgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czsgKHZhbHVlLCBrZXksIG9iamVjdCkuIENhbGxiYWNrcyBtYXkgZXhpdFxuICAgKiBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAdHlwZSBGdW5jdGlvblxuICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIGZ1bmN0aW9uIFNoYXBlKCkge1xuICAgKiAgIHRoaXMueCA9IDA7XG4gICAqICAgdGhpcy55ID0gMDtcbiAgICogfVxuICAgKlxuICAgKiBTaGFwZS5wcm90b3R5cGUubW92ZSA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICogICB0aGlzLnggKz0geDtcbiAgICogICB0aGlzLnkgKz0geTtcbiAgICogfTtcbiAgICpcbiAgICogXy5mb3JJbihuZXcgU2hhcGUsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICogICBjb25zb2xlLmxvZyhrZXkpO1xuICAgKiB9KTtcbiAgICogLy8gPT4gbG9ncyAneCcsICd5JywgYW5kICdtb3ZlJyAocHJvcGVydHkgb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQgYWNyb3NzIGVudmlyb25tZW50cylcbiAgICovXG4gIHZhciBmb3JJbiA9IGNyZWF0ZUl0ZXJhdG9yKGVhY2hJdGVyYXRvck9wdGlvbnMsIGZvck93bkl0ZXJhdG9yT3B0aW9ucywge1xuICAgICd1c2VIYXMnOiBmYWxzZVxuICB9KTtcblxuICAvKipcbiAgICogSXRlcmF0ZXMgb3ZlciBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdCwgZXhlY3V0aW5nIHRoZSBjYWxsYmFja1xuICAgKiBmb3IgZWFjaCBwcm9wZXJ0eS4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmQgaW52b2tlZCB3aXRoIHRocmVlXG4gICAqIGFyZ3VtZW50czsgKHZhbHVlLCBrZXksIG9iamVjdCkuIENhbGxiYWNrcyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnlcbiAgICogZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAdHlwZSBGdW5jdGlvblxuICAgKiBAY2F0ZWdvcnkgT2JqZWN0c1xuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uZm9yT3duKHsgJzAnOiAnemVybycsICcxJzogJ29uZScsICdsZW5ndGgnOiAyIH0sIGZ1bmN0aW9uKG51bSwga2V5KSB7XG4gICAqICAgY29uc29sZS5sb2coa2V5KTtcbiAgICogfSk7XG4gICAqIC8vID0+IGxvZ3MgJzAnLCAnMScsIGFuZCAnbGVuZ3RoJyAocHJvcGVydHkgb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQgYWNyb3NzIGVudmlyb25tZW50cylcbiAgICovXG4gIHZhciBmb3JPd24gPSBjcmVhdGVJdGVyYXRvcihlYWNoSXRlcmF0b3JPcHRpb25zLCBmb3JPd25JdGVyYXRvck9wdGlvbnMpO1xuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBlbXB0eS4gQXJyYXlzLCBzdHJpbmdzLCBvciBgYXJndW1lbnRzYCBvYmplY3RzIHdpdGggYVxuICAgKiBsZW5ndGggb2YgYDBgIGFuZCBvYmplY3RzIHdpdGggbm8gb3duIGVudW1lcmFibGUgcHJvcGVydGllcyBhcmUgY29uc2lkZXJlZFxuICAgKiBcImVtcHR5XCIuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBgdmFsdWVgIGlzIGVtcHR5LCBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNFbXB0eShbMSwgMiwgM10pO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiBfLmlzRW1wdHkoe30pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNFbXB0eSgnJyk7XG4gICAqIC8vID0+IHRydWVcbiAgICovXG4gIGZ1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICB2YXIgY2xhc3NOYW1lID0gdG9TdHJpbmcuY2FsbCh2YWx1ZSksXG4gICAgICAgIGxlbmd0aCA9IHZhbHVlLmxlbmd0aDtcblxuICAgIGlmICgoY2xhc3NOYW1lID09IGFycmF5Q2xhc3MgfHwgY2xhc3NOYW1lID09IHN0cmluZ0NsYXNzIHx8XG4gICAgICAgIChzdXBwb3J0LmFyZ3NDbGFzcyA/IGNsYXNzTmFtZSA9PSBhcmdzQ2xhc3MgOiBpc0FyZ3VtZW50cyh2YWx1ZSkpKSB8fFxuICAgICAgICAoY2xhc3NOYW1lID09IG9iamVjdENsYXNzICYmIHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicgJiYgaXNGdW5jdGlvbih2YWx1ZS5zcGxpY2UpKSkge1xuICAgICAgcmV0dXJuICFsZW5ndGg7XG4gICAgfVxuICAgIGZvck93bih2YWx1ZSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gKHJlc3VsdCA9IGZhbHNlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNGdW5jdGlvbihfKTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKi9cbiAgZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ2Z1bmN0aW9uJztcbiAgfVxuICAvLyBmYWxsYmFjayBmb3Igb2xkZXIgdmVyc2lvbnMgb2YgQ2hyb21lIGFuZCBTYWZhcmlcbiAgaWYgKGlzRnVuY3Rpb24oL3gvKSkge1xuICAgIGlzRnVuY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nICYmIHRvU3RyaW5nLmNhbGwodmFsdWUpID09IGZ1bmNDbGFzcztcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBsYW5ndWFnZSB0eXBlIG9mIE9iamVjdC5cbiAgICogKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IE9iamVjdHNcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5pc09iamVjdCh7fSk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNPYmplY3QoMSk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqL1xuICBmdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAgIC8vIGNoZWNrIGlmIHRoZSB2YWx1ZSBpcyB0aGUgRUNNQVNjcmlwdCBsYW5ndWFnZSB0eXBlIG9mIE9iamVjdFxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4OFxuICAgIC8vIGFuZCBhdm9pZCBhIFY4IGJ1Z1xuICAgIC8vIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTIyOTFcbiAgICByZXR1cm4gISEodmFsdWUgJiYgb2JqZWN0VHlwZXNbdHlwZW9mIHZhbHVlXSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0IGNyZWF0ZWQgYnkgdGhlIGBPYmplY3RgIGNvbnN0cnVjdG9yLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHBsYWluIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBmdW5jdGlvbiBTaGFwZSgpIHtcbiAgICogICB0aGlzLnggPSAwO1xuICAgKiAgIHRoaXMueSA9IDA7XG4gICAqIH1cbiAgICpcbiAgICogXy5pc1BsYWluT2JqZWN0KG5ldyBTaGFwZSk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqXG4gICAqIF8uaXNQbGFpbk9iamVjdChbMSwgMiwgM10pO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiBfLmlzUGxhaW5PYmplY3QoeyAneCc6IDAsICd5JzogMCB9KTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKi9cbiAgdmFyIGlzUGxhaW5PYmplY3QgPSAhZ2V0UHJvdG90eXBlT2YgPyBzaGltSXNQbGFpbk9iamVjdCA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaWYgKCEodmFsdWUgJiYgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gb2JqZWN0Q2xhc3MpIHx8ICghc3VwcG9ydC5hcmdzQ2xhc3MgJiYgaXNBcmd1bWVudHModmFsdWUpKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgdmFsdWVPZiA9IHZhbHVlLnZhbHVlT2YsXG4gICAgICAgIG9ialByb3RvID0gaXNOYXRpdmUodmFsdWVPZikgJiYgKG9ialByb3RvID0gZ2V0UHJvdG90eXBlT2YodmFsdWVPZikpICYmIGdldFByb3RvdHlwZU9mKG9ialByb3RvKTtcblxuICAgIHJldHVybiBvYmpQcm90b1xuICAgICAgPyAodmFsdWUgPT0gb2JqUHJvdG8gfHwgZ2V0UHJvdG90eXBlT2YodmFsdWUpID09IG9ialByb3RvKVxuICAgICAgOiBzaGltSXNQbGFpbk9iamVjdCh2YWx1ZSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgc3RyaW5nLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGB2YWx1ZWAgaXMgYSBzdHJpbmcsIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5pc1N0cmluZygnZnJlZCcpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqL1xuICBmdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycgfHxcbiAgICAgIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzdHJpbmdDbGFzcyB8fCBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWN1cnNpdmVseSBtZXJnZXMgb3duIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiB0aGUgc291cmNlIG9iamVjdChzKSwgdGhhdFxuICAgKiBkb24ndCByZXNvbHZlIHRvIGB1bmRlZmluZWRgIGludG8gdGhlIGRlc3RpbmF0aW9uIG9iamVjdC4gU3Vic2VxdWVudCBzb3VyY2VzXG4gICAqIHdpbGwgb3ZlcndyaXRlIHByb3BlcnR5IGFzc2lnbm1lbnRzIG9mIHByZXZpb3VzIHNvdXJjZXMuIElmIGEgY2FsbGJhY2sgaXNcbiAgICogcHJvdmlkZWQgaXQgd2lsbCBiZSBleGVjdXRlZCB0byBwcm9kdWNlIHRoZSBtZXJnZWQgdmFsdWVzIG9mIHRoZSBkZXN0aW5hdGlvblxuICAgKiBhbmQgc291cmNlIHByb3BlcnRpZXMuIElmIHRoZSBjYWxsYmFjayByZXR1cm5zIGB1bmRlZmluZWRgIG1lcmdpbmcgd2lsbFxuICAgKiBiZSBoYW5kbGVkIGJ5IHRoZSBtZXRob2QgaW5zdGVhZC4gVGhlIGNhbGxiYWNrIGlzIGJvdW5kIHRvIGB0aGlzQXJnYCBhbmRcbiAgICogaW52b2tlZCB3aXRoIHR3byBhcmd1bWVudHM7IChvYmplY3RWYWx1ZSwgc291cmNlVmFsdWUpLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBPYmplY3RzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAgICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VdIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIG1lcmdpbmcgcHJvcGVydGllcy5cbiAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIG5hbWVzID0ge1xuICAgKiAgICdjaGFyYWN0ZXJzJzogW1xuICAgKiAgICAgeyAnbmFtZSc6ICdiYXJuZXknIH0sXG4gICAqICAgICB7ICduYW1lJzogJ2ZyZWQnIH1cbiAgICogICBdXG4gICAqIH07XG4gICAqXG4gICAqIHZhciBhZ2VzID0ge1xuICAgKiAgICdjaGFyYWN0ZXJzJzogW1xuICAgKiAgICAgeyAnYWdlJzogMzYgfSxcbiAgICogICAgIHsgJ2FnZSc6IDQwIH1cbiAgICogICBdXG4gICAqIH07XG4gICAqXG4gICAqIF8ubWVyZ2UobmFtZXMsIGFnZXMpO1xuICAgKiAvLyA9PiB7ICdjaGFyYWN0ZXJzJzogW3sgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2IH0sIHsgJ25hbWUnOiAnZnJlZCcsICdhZ2UnOiA0MCB9XSB9XG4gICAqXG4gICAqIHZhciBmb29kID0ge1xuICAgKiAgICdmcnVpdHMnOiBbJ2FwcGxlJ10sXG4gICAqICAgJ3ZlZ2V0YWJsZXMnOiBbJ2JlZXQnXVxuICAgKiB9O1xuICAgKlxuICAgKiB2YXIgb3RoZXJGb29kID0ge1xuICAgKiAgICdmcnVpdHMnOiBbJ2JhbmFuYSddLFxuICAgKiAgICd2ZWdldGFibGVzJzogWydjYXJyb3QnXVxuICAgKiB9O1xuICAgKlxuICAgKiBfLm1lcmdlKGZvb2QsIG90aGVyRm9vZCwgZnVuY3Rpb24oYSwgYikge1xuICAgKiAgIHJldHVybiBfLmlzQXJyYXkoYSkgPyBhLmNvbmNhdChiKSA6IHVuZGVmaW5lZDtcbiAgICogfSk7XG4gICAqIC8vID0+IHsgJ2ZydWl0cyc6IFsnYXBwbGUnLCAnYmFuYW5hJ10sICd2ZWdldGFibGVzJzogWydiZWV0JywgJ2NhcnJvdF0gfVxuICAgKi9cbiAgZnVuY3Rpb24gbWVyZ2Uob2JqZWN0KSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGxlbmd0aCA9IDI7XG5cbiAgICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuICAgIC8vIGFsbG93cyB3b3JraW5nIHdpdGggYF8ucmVkdWNlYCBhbmQgYF8ucmVkdWNlUmlnaHRgIHdpdGhvdXQgdXNpbmdcbiAgICAvLyB0aGVpciBgaW5kZXhgIGFuZCBgY29sbGVjdGlvbmAgYXJndW1lbnRzXG4gICAgaWYgKHR5cGVvZiBhcmdzWzJdICE9ICdudW1iZXInKSB7XG4gICAgICBsZW5ndGggPSBhcmdzLmxlbmd0aDtcbiAgICB9XG4gICAgaWYgKGxlbmd0aCA+IDMgJiYgdHlwZW9mIGFyZ3NbbGVuZ3RoIC0gMl0gPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFyIGNhbGxiYWNrID0gYmFzZUNyZWF0ZUNhbGxiYWNrKGFyZ3NbLS1sZW5ndGggLSAxXSwgYXJnc1tsZW5ndGgtLV0sIDIpO1xuICAgIH0gZWxzZSBpZiAobGVuZ3RoID4gMiAmJiB0eXBlb2YgYXJnc1tsZW5ndGggLSAxXSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYWxsYmFjayA9IGFyZ3NbLS1sZW5ndGhdO1xuICAgIH1cbiAgICB2YXIgc291cmNlcyA9IHNsaWNlKGFyZ3VtZW50cywgMSwgbGVuZ3RoKSxcbiAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgc3RhY2tBID0gZ2V0QXJyYXkoKSxcbiAgICAgICAgc3RhY2tCID0gZ2V0QXJyYXkoKTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICBiYXNlTWVyZ2Uob2JqZWN0LCBzb3VyY2VzW2luZGV4XSwgY2FsbGJhY2ssIHN0YWNrQSwgc3RhY2tCKTtcbiAgICB9XG4gICAgcmVsZWFzZUFycmF5KHN0YWNrQSk7XG4gICAgcmVsZWFzZUFycmF5KHN0YWNrQik7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBJdGVyYXRlcyBvdmVyIGVsZW1lbnRzIG9mIGEgY29sbGVjdGlvbiwgZXhlY3V0aW5nIHRoZSBjYWxsYmFjayBmb3IgZWFjaFxuICAgKiBlbGVtZW50LiBUaGUgY2FsbGJhY2sgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzO1xuICAgKiAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuIENhbGxiYWNrcyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnlcbiAgICogZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAgICpcbiAgICogTm90ZTogQXMgd2l0aCBvdGhlciBcIkNvbGxlY3Rpb25zXCIgbWV0aG9kcywgb2JqZWN0cyB3aXRoIGEgYGxlbmd0aGAgcHJvcGVydHlcbiAgICogYXJlIGl0ZXJhdGVkIGxpa2UgYXJyYXlzLiBUbyBhdm9pZCB0aGlzIGJlaGF2aW9yIGBfLmZvckluYCBvciBgXy5mb3JPd25gXG4gICAqIG1heSBiZSB1c2VkIGZvciBvYmplY3QgaXRlcmF0aW9uLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBhbGlhcyBlYWNoXG4gICAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uc1xuICAgKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gICAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R8c3RyaW5nfSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXyhbMSwgMiwgM10pLmZvckVhY2goZnVuY3Rpb24obnVtKSB7IGNvbnNvbGUubG9nKG51bSk7IH0pLmpvaW4oJywnKTtcbiAgICogLy8gPT4gbG9ncyBlYWNoIG51bWJlciBhbmQgcmV0dXJucyAnMSwyLDMnXG4gICAqXG4gICAqIF8uZm9yRWFjaCh7ICdvbmUnOiAxLCAndHdvJzogMiwgJ3RocmVlJzogMyB9LCBmdW5jdGlvbihudW0pIHsgY29uc29sZS5sb2cobnVtKTsgfSk7XG4gICAqIC8vID0+IGxvZ3MgZWFjaCBudW1iZXIgYW5kIHJldHVybnMgdGhlIG9iamVjdCAocHJvcGVydHkgb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQgYWNyb3NzIGVudmlyb25tZW50cylcbiAgICovXG4gIGZ1bmN0aW9uIGZvckVhY2goY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBpZiAoY2FsbGJhY2sgJiYgdHlwZW9mIHRoaXNBcmcgPT0gJ3VuZGVmaW5lZCcgJiYgaXNBcnJheShjb2xsZWN0aW9uKSkge1xuICAgICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgICAgbGVuZ3RoID0gY29sbGVjdGlvbi5sZW5ndGg7XG5cbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICAgIGlmIChjYWxsYmFjayhjb2xsZWN0aW9uW2luZGV4XSwgaW5kZXgsIGNvbGxlY3Rpb24pID09PSBmYWxzZSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGJhc2VFYWNoKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBhcnJheSB3aXRoIGFsbCBmYWxzZXkgdmFsdWVzIHJlbW92ZWQuIFRoZSB2YWx1ZXMgYGZhbHNlYCwgYG51bGxgLFxuICAgKiBgMGAsIGBcIlwiYCwgYHVuZGVmaW5lZGAsIGFuZCBgTmFOYCBhcmUgYWxsIGZhbHNleS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgQXJyYXlzXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjb21wYWN0LlxuICAgKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYSBuZXcgYXJyYXkgb2YgZmlsdGVyZWQgdmFsdWVzLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLmNvbXBhY3QoWzAsIDEsIGZhbHNlLCAyLCAnJywgM10pO1xuICAgKiAvLyA9PiBbMSwgMiwgM11cbiAgICovXG4gIGZ1bmN0aW9uIGNvbXBhY3QoYXJyYXkpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwLFxuICAgICAgICByZXN1bHQgPSBbXTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0LCB3aGVuIGNhbGxlZCwgaW52b2tlcyBgZnVuY2Agd2l0aCB0aGUgYHRoaXNgXG4gICAqIGJpbmRpbmcgb2YgYHRoaXNBcmdgIGFuZCBwcmVwZW5kcyBhbnkgYWRkaXRpb25hbCBgYmluZGAgYXJndW1lbnRzIHRvIHRob3NlXG4gICAqIHByb3ZpZGVkIHRvIHRoZSBib3VuZCBmdW5jdGlvbi5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25zXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGJpbmQuXG4gICAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gICAqIEBwYXJhbSB7Li4uKn0gW2FyZ10gQXJndW1lbnRzIHRvIGJlIHBhcnRpYWxseSBhcHBsaWVkLlxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBib3VuZCBmdW5jdGlvbi5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIGZ1bmMgPSBmdW5jdGlvbihncmVldGluZykge1xuICAgKiAgIHJldHVybiBncmVldGluZyArICcgJyArIHRoaXMubmFtZTtcbiAgICogfTtcbiAgICpcbiAgICogZnVuYyA9IF8uYmluZChmdW5jLCB7ICduYW1lJzogJ2ZyZWQnIH0sICdoaScpO1xuICAgKiBmdW5jKCk7XG4gICAqIC8vID0+ICdoaSBmcmVkJ1xuICAgKi9cbiAgZnVuY3Rpb24gYmluZChmdW5jLCB0aGlzQXJnKSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPiAyXG4gICAgICA/IGNyZWF0ZVdyYXBwZXIoZnVuYywgMTcsIHNsaWNlKGFyZ3VtZW50cywgMiksIG51bGwsIHRoaXNBcmcpXG4gICAgICA6IGNyZWF0ZVdyYXBwZXIoZnVuYywgMSwgbnVsbCwgbnVsbCwgdGhpc0FyZyk7XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgZmlyc3QgYXJndW1lbnQgcHJvdmlkZWQgdG8gaXQuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQG1lbWJlck9mIF9cbiAgICogQGNhdGVnb3J5IFV0aWxpdGllc1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIEFueSB2YWx1ZS5cbiAgICogQHJldHVybnMgeyp9IFJldHVybnMgYHZhbHVlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIG9iamVjdCA9IHsgJ25hbWUnOiAnZnJlZCcgfTtcbiAgICogXy5pZGVudGl0eShvYmplY3QpID09PSBvYmplY3Q7XG4gICAqIC8vID0+IHRydWVcbiAgICovXG4gIGZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgbm8tb3BlcmF0aW9uIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBVdGlsaXRpZXNcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogdmFyIG9iamVjdCA9IHsgJ25hbWUnOiAnZnJlZCcgfTtcbiAgICogXy5ub29wKG9iamVjdCkgPT09IHVuZGVmaW5lZDtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKi9cbiAgZnVuY3Rpb24gbm9vcCgpIHtcbiAgICAvLyBubyBvcGVyYXRpb24gcGVyZm9ybWVkXG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICBsb2Rhc2guYXNzaWduID0gYXNzaWduO1xuICBsb2Rhc2guYmluZCA9IGJpbmQ7XG4gIGxvZGFzaC5jb21wYWN0ID0gY29tcGFjdDtcbiAgbG9kYXNoLmZvckVhY2ggPSBmb3JFYWNoO1xuICBsb2Rhc2guZm9ySW4gPSBmb3JJbjtcbiAgbG9kYXNoLmZvck93biA9IGZvck93bjtcbiAgbG9kYXNoLmtleXMgPSBrZXlzO1xuICBsb2Rhc2gubWVyZ2UgPSBtZXJnZTtcblxuICBsb2Rhc2guZWFjaCA9IGZvckVhY2g7XG4gIGxvZGFzaC5leHRlbmQgPSBhc3NpZ247XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLy8gYWRkIGZ1bmN0aW9ucyB0aGF0IHJldHVybiB1bndyYXBwZWQgdmFsdWVzIHdoZW4gY2hhaW5pbmdcbiAgbG9kYXNoLmNsb25lID0gY2xvbmU7XG4gIGxvZGFzaC5pZGVudGl0eSA9IGlkZW50aXR5O1xuICBsb2Rhc2guaXNBcmd1bWVudHMgPSBpc0FyZ3VtZW50cztcbiAgbG9kYXNoLmlzQXJyYXkgPSBpc0FycmF5O1xuICBsb2Rhc2guaXNFbXB0eSA9IGlzRW1wdHk7XG4gIGxvZGFzaC5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcbiAgbG9kYXNoLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG4gIGxvZGFzaC5pc1BsYWluT2JqZWN0ID0gaXNQbGFpbk9iamVjdDtcbiAgbG9kYXNoLmlzU3RyaW5nID0gaXNTdHJpbmc7XG4gIGxvZGFzaC5ub29wID0gbm9vcDtcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogVGhlIHNlbWFudGljIHZlcnNpb24gbnVtYmVyLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEB0eXBlIHN0cmluZ1xuICAgKi9cbiAgbG9kYXNoLlZFUlNJT04gPSAnMi40LjEnO1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIGlmIChmcmVlRXhwb3J0cyAmJiBmcmVlTW9kdWxlKSB7XG4gICAgLy8gaW4gTm9kZS5qcyBvciBSaW5nb0pTXG4gICAgaWYgKG1vZHVsZUV4cG9ydHMpIHtcbiAgICAgIChmcmVlTW9kdWxlLmV4cG9ydHMgPSBsb2Rhc2gpLl8gPSBsb2Rhc2g7XG4gICAgfVxuXG4gIH1cblxufS5jYWxsKHRoaXMpKTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJ2YXIgZ2VvanNvbkFyZWEgPSByZXF1aXJlKCdnZW9qc29uLWFyZWEnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXdpbmQ7XG5cbmZ1bmN0aW9uIHJld2luZChnaiwgb3V0ZXIpIHtcbiAgICBzd2l0Y2ggKChnaiAmJiBnai50eXBlKSB8fCBudWxsKSB7XG4gICAgICAgIGNhc2UgJ0ZlYXR1cmVDb2xsZWN0aW9uJzpcbiAgICAgICAgICAgIGdqLmZlYXR1cmVzID0gZ2ouZmVhdHVyZXMubWFwKGN1cnJ5T3V0ZXIocmV3aW5kLCBvdXRlcikpO1xuICAgICAgICAgICAgcmV0dXJuIGdqO1xuICAgICAgICBjYXNlICdGZWF0dXJlJzpcbiAgICAgICAgICAgIGdqLmdlb21ldHJ5ID0gcmV3aW5kKGdqLmdlb21ldHJ5LCBvdXRlcik7XG4gICAgICAgICAgICByZXR1cm4gZ2o7XG4gICAgICAgIGNhc2UgJ1BvbHlnb24nOlxuICAgICAgICBjYXNlICdNdWx0aVBvbHlnb24nOlxuICAgICAgICAgICAgcmV0dXJuIGNvcnJlY3QoZ2osIG91dGVyKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBnajtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGN1cnJ5T3V0ZXIoYSwgYikge1xuICAgIHJldHVybiBmdW5jdGlvbihfKSB7IHJldHVybiBhKF8sIGIpOyB9O1xufVxuXG5mdW5jdGlvbiBjb3JyZWN0KF8sIG91dGVyKSB7XG4gICAgaWYgKF8udHlwZSA9PT0gJ1BvbHlnb24nKSB7XG4gICAgICAgIF8uY29vcmRpbmF0ZXMgPSBjb3JyZWN0UmluZ3MoXy5jb29yZGluYXRlcywgb3V0ZXIpO1xuICAgIH0gZWxzZSBpZiAoXy50eXBlID09PSAnTXVsdGlQb2x5Z29uJykge1xuICAgICAgICBfLmNvb3JkaW5hdGVzID0gXy5jb29yZGluYXRlcy5tYXAoY3VycnlPdXRlcihjb3JyZWN0UmluZ3MsIG91dGVyKSk7XG4gICAgfVxuICAgIHJldHVybiBfO1xufVxuXG5mdW5jdGlvbiBjb3JyZWN0UmluZ3MoXywgb3V0ZXIpIHtcbiAgICBvdXRlciA9ICEhb3V0ZXI7XG4gICAgX1swXSA9IHdpbmQoX1swXSwgIW91dGVyKTtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IF8ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgX1tpXSA9IHdpbmQoX1tpXSwgb3V0ZXIpO1xuICAgIH1cbiAgICByZXR1cm4gXztcbn1cblxuZnVuY3Rpb24gd2luZChfLCBkaXIpIHtcbiAgICByZXR1cm4gY3coXykgPT09IGRpciA/IF8gOiBfLnJldmVyc2UoKTtcbn1cblxuZnVuY3Rpb24gY3coXykge1xuICAgIHJldHVybiBnZW9qc29uQXJlYS5yaW5nKF8pID49IDA7XG59XG4iLCJ2YXIgd2dzODQgPSByZXF1aXJlKCd3Z3M4NCcpO1xuXG5tb2R1bGUuZXhwb3J0cy5nZW9tZXRyeSA9IGdlb21ldHJ5O1xubW9kdWxlLmV4cG9ydHMucmluZyA9IHJpbmdBcmVhO1xuXG5mdW5jdGlvbiBnZW9tZXRyeShfKSB7XG4gICAgaWYgKF8udHlwZSA9PT0gJ1BvbHlnb24nKSByZXR1cm4gcG9seWdvbkFyZWEoXy5jb29yZGluYXRlcyk7XG4gICAgZWxzZSBpZiAoXy50eXBlID09PSAnTXVsdGlQb2x5Z29uJykge1xuICAgICAgICB2YXIgYXJlYSA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgXy5jb29yZGluYXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJlYSArPSBwb2x5Z29uQXJlYShfLmNvb3JkaW5hdGVzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJlYTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHBvbHlnb25BcmVhKGNvb3Jkcykge1xuICAgIHZhciBhcmVhID0gMDtcbiAgICBpZiAoY29vcmRzICYmIGNvb3Jkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFyZWEgKz0gTWF0aC5hYnMocmluZ0FyZWEoY29vcmRzWzBdKSk7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgY29vcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmVhIC09IE1hdGguYWJzKHJpbmdBcmVhKGNvb3Jkc1tpXSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcmVhO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZSB0aGUgYXBwcm94aW1hdGUgYXJlYSBvZiB0aGUgcG9seWdvbiB3ZXJlIGl0IHByb2plY3RlZCBvbnRvXG4gKiAgICAgdGhlIGVhcnRoLiAgTm90ZSB0aGF0IHRoaXMgYXJlYSB3aWxsIGJlIHBvc2l0aXZlIGlmIHJpbmcgaXMgb3JpZW50ZWRcbiAqICAgICBjbG9ja3dpc2UsIG90aGVyd2lzZSBpdCB3aWxsIGJlIG5lZ2F0aXZlLlxuICpcbiAqIFJlZmVyZW5jZTpcbiAqIFJvYmVydC4gRy4gQ2hhbWJlcmxhaW4gYW5kIFdpbGxpYW0gSC4gRHVxdWV0dGUsIFwiU29tZSBBbGdvcml0aG1zIGZvclxuICogICAgIFBvbHlnb25zIG9uIGEgU3BoZXJlXCIsIEpQTCBQdWJsaWNhdGlvbiAwNy0wMywgSmV0IFByb3B1bHNpb25cbiAqICAgICBMYWJvcmF0b3J5LCBQYXNhZGVuYSwgQ0EsIEp1bmUgMjAwNyBodHRwOi8vdHJzLW5ldy5qcGwubmFzYS5nb3YvZHNwYWNlL2hhbmRsZS8yMDE0LzQwNDA5XG4gKlxuICogUmV0dXJuczpcbiAqIHtmbG9hdH0gVGhlIGFwcHJveGltYXRlIHNpZ25lZCBnZW9kZXNpYyBhcmVhIG9mIHRoZSBwb2x5Z29uIGluIHNxdWFyZVxuICogICAgIG1ldGVycy5cbiAqL1xuXG5mdW5jdGlvbiByaW5nQXJlYShjb29yZHMpIHtcbiAgICB2YXIgYXJlYSA9IDA7XG5cbiAgICBpZiAoY29vcmRzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgdmFyIHAxLCBwMjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29yZHMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBwMSA9IGNvb3Jkc1tpXTtcbiAgICAgICAgICAgIHAyID0gY29vcmRzW2kgKyAxXTtcbiAgICAgICAgICAgIGFyZWEgKz0gcmFkKHAyWzBdIC0gcDFbMF0pICogKDIgKyBNYXRoLnNpbihyYWQocDFbMV0pKSArIE1hdGguc2luKHJhZChwMlsxXSkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFyZWEgPSBhcmVhICogd2dzODQuUkFESVVTICogd2dzODQuUkFESVVTIC8gMjtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJlYTtcbn1cblxuZnVuY3Rpb24gcmFkKF8pIHtcbiAgICByZXR1cm4gXyAqIE1hdGguUEkgLyAxODA7XG59XG4iLCJtb2R1bGUuZXhwb3J0cy5SQURJVVMgPSA2Mzc4MTM3O1xubW9kdWxlLmV4cG9ydHMuRkxBVFRFTklORyA9IDEvMjk4LjI1NzIyMzU2Mztcbm1vZHVsZS5leHBvcnRzLlBPTEFSX1JBRElVUyA9IDYzNTY3NTIuMzE0MjtcbiIsIm1vZHVsZS5leHBvcnRzPXtcbiAgICBcImJ1aWxkaW5nXCI6IHRydWUsXG4gICAgXCJoaWdod2F5XCI6IHtcbiAgICAgICAgXCJpbmNsdWRlZF92YWx1ZXNcIjoge1xuICAgICAgICAgICAgXCJzZXJ2aWNlc1wiOiB0cnVlLFxuICAgICAgICAgICAgXCJyZXN0X2FyZWFcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiZXNjYXBlXCI6IHRydWVcbiAgICAgICAgfVxuICAgIH0sXG4gICAgXCJuYXR1cmFsXCI6IHtcbiAgICAgICAgXCJleGNsdWRlZF92YWx1ZXNcIjoge1xuICAgICAgICAgICAgXCJjb2FzdGxpbmVcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiY2xpZmZcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwicmlkZ2VcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiYXJldGVcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwidHJlZV9yb3dcIjogdHJ1ZVxuICAgICAgICB9XG4gICAgfSxcbiAgICBcImxhbmR1c2VcIjogdHJ1ZSxcbiAgICBcIndhdGVyd2F5XCI6IHtcbiAgICAgICAgXCJpbmNsdWRlZF92YWx1ZXNcIjoge1xuICAgICAgICAgICAgXCJyaXZlcmJhbmtcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwiZG9ja1wiOiB0cnVlLFxuICAgICAgICAgICAgXCJib2F0eWFyZFwiOiB0cnVlLFxuICAgICAgICAgICAgXCJkYW1cIjogdHJ1ZVxuICAgICAgICB9XG4gICAgfSxcbiAgICBcImFtZW5pdHlcIjogdHJ1ZSxcbiAgICBcImxlaXN1cmVcIjogdHJ1ZSxcbiAgICBcImJhcnJpZXJcIjoge1xuICAgICAgICBcImluY2x1ZGVkX3ZhbHVlc1wiOiB7XG4gICAgICAgICAgICBcImNpdHlfd2FsbFwiOiB0cnVlLFxuICAgICAgICAgICAgXCJkaXRjaFwiOiB0cnVlLFxuICAgICAgICAgICAgXCJoZWRnZVwiOiB0cnVlLFxuICAgICAgICAgICAgXCJyZXRhaW5pbmdfd2FsbFwiOiB0cnVlLFxuICAgICAgICAgICAgXCJ3YWxsXCI6IHRydWUsXG4gICAgICAgICAgICBcInNwaWtlc1wiOiB0cnVlXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwicmFpbHdheVwiOiB7XG4gICAgICAgIFwiaW5jbHVkZWRfdmFsdWVzXCI6IHtcbiAgICAgICAgICAgIFwic3RhdGlvblwiOiB0cnVlLFxuICAgICAgICAgICAgXCJ0dXJudGFibGVcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwicm91bmRob3VzZVwiOiB0cnVlLFxuICAgICAgICAgICAgXCJwbGF0Zm9ybVwiOiB0cnVlXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwiYXJlYVwiOiB0cnVlLFxuICAgIFwiYm91bmRhcnlcIjogdHJ1ZSxcbiAgICBcIm1hbl9tYWRlXCI6IHtcbiAgICAgICAgXCJleGNsdWRlZF92YWx1ZXNcIjoge1xuICAgICAgICAgICAgXCJjdXRsaW5lXCI6IHRydWUsXG4gICAgICAgICAgICBcImVtYmFua21lbnRcIjogdHJ1ZSxcbiAgICAgICAgICAgIFwicGlwZWxpbmVcIjogdHJ1ZVxuICAgICAgICB9XG4gICAgfSxcbiAgICBcInBvd2VyXCI6IHtcbiAgICAgICAgXCJpbmNsdWRlZF92YWx1ZXNcIjoge1xuICAgICAgICAgICAgXCJwbGFudFwiOiB0cnVlLFxuICAgICAgICAgICAgXCJzdWJzdGF0aW9uXCI6IHRydWUsXG4gICAgICAgICAgICBcImdlbmVyYXRvclwiOiB0cnVlLFxuICAgICAgICAgICAgXCJ0cmFuc2Zvcm1lclwiOiB0cnVlXG4gICAgICAgIH1cbiAgICB9LFxuICAgIFwicGxhY2VcIjogdHJ1ZSxcbiAgICBcInNob3BcIjogdHJ1ZSxcbiAgICBcImFlcm93YXlcIjoge1xuICAgICAgICBcImV4Y2x1ZGVkX3ZhbHVlc1wiOiB7XG4gICAgICAgICAgICBcInRheGl3YXlcIjogdHJ1ZVxuICAgICAgICB9XG4gICAgfSxcbiAgICBcInRvdXJpc21cIjogdHJ1ZSxcbiAgICBcImhpc3RvcmljXCI6IHRydWUsXG4gICAgXCJwdWJsaWNfdHJhbnNwb3J0XCI6IHRydWUsXG4gICAgXCJvZmZpY2VcIjogdHJ1ZSxcbiAgICBcImJ1aWxkaW5nOnBhcnRcIjogdHJ1ZSxcbiAgICBcIm1pbGl0YXJ5XCI6IHRydWUsXG4gICAgXCJydWluc1wiOiB0cnVlLFxuICAgIFwiYXJlYTpoaWdod2F5XCI6IHRydWUsXG4gICAgXCJjcmFmdFwiOiB0cnVlLFxuICAgIFwiZ29sZlwiOiB0cnVlXG59XG4iXX0=
