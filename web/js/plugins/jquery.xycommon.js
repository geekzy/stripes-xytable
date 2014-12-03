/*
 * jQuery Commonly Usage Plugins Collection
 *
 * jquery.xycommon.js v1.6
 *
 * Copyright (c) 2009 XYBASE, <imam@xybase.com><geekzy@gmail.com>
 *
 */
(function($) {
    /* --------------------------------------------------------------------------- *
     * ------------------------ STATIC METHOD PLUGINS ---------------------------- *
     * --------------------------------------------------------------------------- */
    $.extend({
        // public interface: $.namespace *adopting from Ext Core :D thx jack!
        namespace: function() {
            var o, d;
            $.each(arguments, function() {
                d = this.split(".");
                o = window[d[0]] = window[d[0]] || {};
                $.each(d.slice(1), function() {
                    o = o[this] = o[this] || {};
                });
            });
            return o;
        },
        // public interface: $.tmpl
        tmpl : function(tmpl, vals, rgxp) {
            // default to doing no harm
            tmpl = tmpl   || '';
            vals = vals || {};

            // regular expression for matching our placeholders; e.g., #{my-cLaSs_name77}
            rgxp = rgxp || /#\{([^{}]*)\}/g;

            // function to making replacements
            var repr = function (str, match) {
                return typeof vals[match] === 'string' || typeof vals[match] === 'number' ? vals[match] : '';
            };

            return tmpl.replace(rgxp, repr);
        },
        // public interface: $.popup
        popup : function(options) {
            var openoptions,
                opts = $.extend({
                    url: '#',
                    left: "", top: "",
                    width: 800, height: 600,
                    name: "_blank",
                    location: "no", menubar: "no", toolbar: "no", status: "yes", scrollbars: "yes", resizable: "yes",
                    normal: false
                }, options || {});

            if (opts.normal) {
                opts.menubar = "yes";
                opts.status = "yes";
                opts.toolbar = "yes";
                opts.location = "yes";
            }

            opts.width = opts.width < screen.availWidth ? opts.width : screen.availWidth;
            opts.height = opts.height < screen.availHeight ? opts.height : screen.availHeight;

            openoptions = 'width=' + opts.width + ',height=' + opts.height + ',location=' + opts.location +
                ',menubar=' + opts.menubar + ',toolbar=' + opts.toolbar + ',scrollbars=' +
                opts.scrollbars + ',resizable=' + opts.resizable + ',status=' + opts.status;

            if (opts.top !== '') {
                openoptions += ",top=" + opts.top;
            }
            if (opts.left !== '') {
                openoptions += ",left=" + opts.left;
            }

            return window.open(opts.url, opts.name, openoptions);
        },
        //public interface $.empty of string value as str
        empty: function(str) {
            return str === '';
        },
        // public interface $.bool of string value as val
        bool: function(val) {
            return (/^true$/i).test(val);
        }
    });
    /* --------------------------------------------------------------------------- *
     * ----------------------- SELECTOR BASED PLUGINS ---------------------------- *
     * --------------------------------------------------------------------------- */
    var plugins = {
        /**
         * Clear a node contents
         */
        clear: function() {
            return this.each(function() {
                $(this).html('');
            });
        },
        /**
         * Load options of select with ajax
         *
         * @param {String} url
         * @param {Object} options
         */
        loadOptions: function(url, options) {
            return this.each(function() {
                var select = $(this),
                    tmpl = '<option value="#{id}" title="#{title}">#{label}</option>',
                    opts = $.extend({
                        // Default options
                        url:        url || '',  // URL is a mandatory param when remote true
                        type:       'GET',      // default request method
                        data:       {},         // default params to send to request
                        cache:      false,      // caching option
                        dataType:   'json',     // default data type from server
                        value:      '',         // default selected value
                        remote:     true,       // call ajax to get the options
                        key:        'options',  // key of the list
                        select:	function(val) {
                            select.val(val);
                        },
                        beforeSend: function() {
                            select.disableElement();
                            var loader = $.tmpl(tmpl, {
                                id: '',
                                label: 'Loading...'
                            });
                            select.html(loader);
                        },
                        success: function(data) {
                            select.clear();
                            if (data instanceof Object) {
                                data = data[this.key];
                            }
                            if (data) {
                                $.each(data, function() {
                                    var label = this['label'], value = $.extend({title:label}, this),
                                        opt = $.tmpl(tmpl, value);
                                    select.append(opt);
                                });
                                this.select(this.value);
                                this.afterLoaded.call(this);
                            }
                        },
                        afterLoaded: function() {},
                        complete: function() { select.enableElement(); }
                    }, options || {});

                // Call AJAX Request
                if (opts.remote) {
                    $.ajax(opts);
                }
                // Get options entries from data
                else {
                    opts.beforeSend();
                    opts.success.call(opts, opts.data);
                }
            });
        },
        /**
         * Delegate a depends property of elements validation rules
         *
         * @param {String} key the validation methods to delegate
         * @param {String} callback the callback to evaluate depends
         */
        depends: function(key, callback) {
            return this.each(function() {
                var elm = this,
                    numKeys = ['minlength', 'maxlength', 'min', 'max'],
                    keys = key.replace(/\s/g, '').split(',');

                $.each(keys, function(i, k) {
                    var val, rules = $(elm).rules();
                    // methods with number values
                    if ($.inArray(k, numKeys) != -1 && callback) {
                        val = rules[k];
                        rules[k] = {
                            param: val,
                            depends: callback
                        };
                    }
                    // methods non-number values
                    else if (callback) {
                        rules[k] = {
                            depends: callback
                        };
                    }

                    $(elm).rules('add', rules);
                });
            });
        },
        /**
         * Round numbers to the nearest hundredth, with two digits following
         * the decimal point.
         * Insert commas between every third digit (right to left) for
         * numbers 1000 and larger.
         *
         * @param {Object} options configuration of formatter
         */
        priceFormat: function(options) {
            options = $.extend({
                prefix: 'US$ ',
                centsSeparator: '.',
                thousandsSeparator: ',',
                limit: false,
                centsLimit: 2
            }, options || {});

            return this.each(function() {

                function formatCurrency(str) {
                    var num = '', minus = '', amount = '', a = [], d = '', n = '', nn = '',
                        regex = new RegExp(options.thousandsSeparator, 'g');

                    str = str.replace(regex, '');
                    // make sure cents seperated by dot before parse
                    if (options.centsSeparator !== '.') {
                        str = str.replace(new RegExp(options.centsSeparator), '.');
                    }

                    if (options.centsLimit > 0) {
                        num = Number(str);
                    } else {
                        num = parseInt(str);
                    }

                    if (isNaN(num)) {
                        num = 0.00;
                    }
                    if (num < 0) {
                        minus = '-';
                    }
                    num = Math.abs(num);
                    num = parseInt((num + .005) * 100);
                    num = num / 100;
                    amount = new String(num);
                    if (amount.indexOf('.') == -1) {
                        amount += options.centsSeparator + '00';
                    }
                    if (amount.indexOf('.') == (amount.length - 2)) {
                        amount += '0';
                    }

                    a = amount.split(options.centsSeparator, 2);
                    d = a[1];
                    num = parseInt(a[0]);
                    num = Math.abs(num);
                    n = new String(num);
                    a = [];
                    while (n.length > 3) {
                        nn = n.substr(n.length - 3);
                        a.unshift(nn);
                        n = n.substr(0, n.length - 3);
                    }
                    if (n.length > 0) {
                        a.unshift(n);
                    }
                    n = a.join(options.thousandsSeparator);
                    if (d.length < 1) {
                        amount = n;
                    } else {
                        amount = n + options.centsSeparator + d;
                    }
                    amount = minus + amount;

                    return amount;
                }

                $(this).val(options.prefix + formatCurrency($(this).val()));
            });
        },
        /**
         * jscalendar implementation for datepicker
         * note: there's still bug when hovering combo the combo will disappear.
         *
         * @param {Object} options options to control jscalendar
         */
        jscalendar: function(options) {
            return this.each(function() {
                var fieldId = this.id;
                options.ifFormat = options.dateFormat || '%d/%m/%Y';
                options.inputField = fieldId;
                options.button = fieldId + '-trigger';
                $(this).after(
                    $.tmpl('<img src="#{path}" class="ui-datepicker-trigger" id="#{id}" alt="#{alt}"/>',
                    {
                        id: options.button,
                        path: options.buttonImage,
                        alt: 'Click to select date!'
                    })
                );
                Calendar.setup(options);
            });
        },
        /**
         * Trigger an event handler (no bubbling)
         *
         * @param {String} type the event type (i.e click, keyup, keydown, etc.)
         * @param {Object} target selector of which element to trigger the event
         */
        triggerEvent: function(type, target) {
            return this.triggerHandler(type, [$.event.fix({
                type: type,
                target: target
            })]);
        },
        /**
         * Check if current view is scrolled into the matched selector
         */
        isScrolledIntoView: function() {
            var elm = $(this[0]),
                docViewTop = $(window).scrollTop(),
                docViewBottom = docViewTop + $(window).height(),
                elemTop = elm.offset().top,
                elemBottom = elemTop + elm.height();

            return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom));
        },
        /**
         * Disbale elements
         * @param clazz (optional) the disabled style class by default will be ui-state-disabled
         */
        disableElement: function(clazz) {
            return this.each(function() {
                $(this).addClass(clazz || "ui-state-disabled")
	                   .attr("disabled", "disabled");
            });
        },
        /**
         * Enable elements
         * @param clazz (optional) the disabled style class by default will be ui-state-disabled
         */
        enableElement: function(clazz) {
            return this.each(function() {
                $(this).removeClass(clazz || "ui-state-disabled")
	                   .removeAttr("disabled");
            });
        },
        /**
         * Set/Unset an input element readonly
         * @param status set to false to remove attribute readonly
         */
        readonly: function(status) {
            return this.each(function() {
                if (!status || status !== false) { $(this).attr('readonly', 'readonly'); }
                else { $(this).removeAttr('readonly'); }
            });
        },
        /**
         * Serialize a Form into a string of json
         * dependency: json2.js
         * @param toObject true will output an object instead of json
         */
        jsonSerialize: function (toObject, exception) {
            var obj = {}, form = this[0], lastName = '', arr = [];
            if (!JSON) { throw 'Please include json2.js'; }

            if (form.tagName !== "FORM") {
                return "";
            }

            $(form.elements).each(function () {
                var elt = $(this), count = $(':input[name=' + this.name + ']', form).length;
                if (!$.empty(this.name) || (exception && !$.inArray(this.name, exception))) {
                    if (!toObject || (toObject && elt.val() != null) ) {
                        if (count > 1) {
                            if (this.name != lastName) { arr = []; arr.push(elt.val()); }
                            else { arr.push(elt.val()); obj[this.name] = arr; }
                        } else { obj[this.name] = elt.val(); arr = []; }
                        lastName = this.name;
                    }
                }
            });

            return toObject ? obj : JSON.stringify(obj);
        }
    };
    // initialize plugins
    $.each(plugins, function(i) {
        $.fn[i] = this;
    });

})(jQuery);

// extending String to check if boolean value
String.prototype.bool = function() {
    return (/^true$/i).test(this);
};
// extending String to check if it's empty
String.prototype.empty = function() {
    return this == '';
};
// extending String to test if it starts with str
String.prototype.startsWith = function(str) {
    return (this.match('^' + str) == str);
};
// extending String to test if it ends with str
String.prototype.endsWith = function(str) {
    return (this.match(str + '$') == str);
};
// extending String to remove the whitespace from the beginning and end
String.prototype.trim = function() {
    return (this.replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, ''));
};
// extending String to convert the first letter to upper case
String.prototype.toUpperFirst = function(){
	return this.toLowerCase().replace(/(^[a-z])/g, function($1) { return $1.toUpperCase(); });
};
// extending String to convert dashed string into camel case
String.prototype.toCamel = function(){
	return this.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
};