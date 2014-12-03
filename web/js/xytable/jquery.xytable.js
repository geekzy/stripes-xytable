/**
 * XYBASE Simple Data Grid, Extending a table as a data grid representation
 *
 * jQuery XYTable Plugins (Ported from xytable.js prototype version)
 *
 * jquery.xytable.js v1.0
 *
 * Developer: Imam Kurniawan <imam@xybase.com>
 * Copyright (c) 2010 XYBASE <http://www.xybase.com>
 */
(function($) {
    $.fn.xytable = function(options) {
        if (this.length === 0) {return this;}
        // has been created before
        var grid = $.data(this[0], 'xytable');
        if (this.length == 1 && grid) {return grid;}

        else {
            return this.each(function() {
                // set id and merge with custom options else will be xytable
                var id = $(this).attr('id'),
                    opt = $.extend({id: id}, options),
                    xytable = new $.xytable(opt);

                $.data(this, 'xytable', xytable);
                return xytable;
            });
        }
    };

    // xytable constructor | public interface: $.xytable
    $.xytable = function(options) {
        this.settings = $.extend(true, {}, $.xytable.defaults, options);
        this.table = $('#' + this.settings.id)[0];
        if ($(this.table).find('tbody').length === 0) {$(this.table).append('<tbody/>');}
        this.Init();
    };

    // xytable class definition
    $.extend(true, $.xytable, {
        defaults: {
            id: 'xytable',                                  // table DOM id
            width: 0,                                       // table width not included rowcheck and rowcount @28px
            fontSize: '0',                                  // override default font size which default value will be from css
            header: true,                                   // generate header based on colModel
            mapToForm: true,                                // enable mapping to fields, property field must be provided in colModel
            mapOnCheck: false,                              // mapping to fields when checkbox is click
            highlight: true,                                // highlight when row is clicked
            highlightOnCheck: false,                        // highlight when checkbox is checked
            checkOnSelect: false,                           // check row when selecting row
            multiple: true,                                 // whether to generate checkbox or radio (true means checkbox)
            checkRow: true,                                 // whether to generate checkbox/radio
            rowCount: true,                                 // whether to generate row count
            clearOnSelect: false,                           // clear checkbox selection when row clicked
            noSelect: false,                                // disable row selection
            rowMarking: [-1, 0, 1],                         // marking status when add/delete -1 is deleted, 0 is new, 1 is initial data
            rowAlternate: true,                             // add odd row with class ui-xytable-alternate
            cursor: 'pointer',                              // default cursor is hand (pointer)
            emptyMsg: 'No Data',                            // display msg when no data
            contentControl: false,                          // Use content control column for edit/delete a row
            colModel: [],                                   // the column model array of object, array count match total columns excluding row check and row count
            gridOp: '.',
            data: false,                                    // initial data (array of object)
            json: false,                                    // data is in json string
            remote: false,                                  // data is from a remote output
            hidedelete: false,
            hiddenIds: true,                                // Generate hidden inputs for ID columns
            baseKey: '',
            callback: {
                onSelect: $.noop,                           // this callback called when row is clicked
                onCheck: $.noop,                            // this callback called when checkbox is clicked -1 if check-all clicked
                onAdd: function() { return true; },         // this callback called after add row
                onUpdate: function() { return true; },      // this callback called after update row
                onDelete: function() { return true; },      // this callback called after delete row
                onAfterShift: $.noop,                       // this callback called after row shifting has been applied
                onBeforeShift: function() { return true; }, // this callback called before row shifting has been applied
                onLoaded: $.noop                            // this callback called when table is loaded (processed)
            },
            pager: {                                        // pager object, when not empty will generate pagination
                id:'pager', base:'', pos: 'bottom',
                // offset, index of start record
                offset: 0,
                // page is current page, total is total pages, records is total records
                page: 1, total: 1, records: 1,
                // max is max page to be displayed, rows is maximum records to show
                max: 5, rows: 10,
                // param to be added to the generated url
                param: {},
                limitPages: true,
                showEdge: true, showSkip: false, showInactive: false, showInactiveNextPrev: false,
                ajax: false,
                callback : $.noop
            },
            sorter: false                                   // sort feature either client-side or server-side
                                                            // for server-side sorter: {remote: {href:'url', sortx:'column sorted', sortd:'sort direction'}}
                                                            // sort directions are: 1 -> asc; -1 -> desc
        },
        messages : {
            'xytable.pager.info.tmpl'           : 'Showing #{first}-#{last} of #{total}',
            'xytable.pager.index.info'          : 'Pages:',
            'xytable.pager.index.first.title'   : 'First Page',
            'xytable.pager.index.first.label'   : 'First',
            'xytable.pager.index.last.title'    : 'Last Page',
            'xytable.pager.index.last.label'    : 'Last',
            'xytable.pager.index.next.title'    : 'Next Page',
            'xytable.pager.index.next.label'    : 'Next',
            'xytable.pager.index.prev.title'    : 'Previous Page',
            'xytable.pager.index.prev.label'    : 'Previous',
            'xytable.pager.index.skipnext.title': 'Skip Next #{skip} pages',
            'xytable.pager.index.skipnext.label': 'Skip Next',
            'xytable.pager.index.skipprev.title': 'Skip Previous #{skip} pages',
            'xytable.pager.index.skipprev.label': 'Skip Prev',
            'xytable.pager.index.page.title'    : 'Page #{page}',
            'xytable.pager.index.page.label'    : '#{page}',
            'xytable.pager.index.current.title' : 'Current Page',
            'xytable.pager.goto.label'          : 'Go to:',
            'xytable.remote.loading.label'      : 'LOADING'
        },
        prototype: {
            /**
             * Initialize xytable object
             */
            Init: function() {
                var settings = this.settings;
                if (settings.colModel.length === 0) {throw "Please specify column model";}
                if (!settings.remote) {
                    // initialize Data Model
                    this.DataInit();
                    // initialize DOM
                    this.DOMInit();
                    // initialize Events
                    this.EventsInit();
                    if (settings.callback.onLoaded) {
                        settings.callback.onLoaded.call(this, this.data);
                    }
                } else { this.RemoteInit(); }
            },
            RemoteInit: function(href, page, events) {
                var settings = this.settings, xytable = this, table = $(xytable.table),
                    url = href || settings.remote.url,
                    type = settings.remote.type,
                    ajaxOpts = {
                        url:        url || '',
                        type:       'GET', data: {}, cache: false, value: '', remote: true,
                        dataType:   type || 'json',
                        beforeSend: function() {
                            $(table).find('tbody').html(
                                '<tr><td style="text-align:center;padding:5px 0;" colspan="0">' + $.xytable.messages['xytable.remote.loading.label'] + '</td></tr>'
                            );
                            if (settings.header) { table.find('thead').remove(); }
                        },
                        success: function(resp) {
                            // data is in json
                            if (type === 'json') {
                                var respData = resp[settings.remote.key || 'data'];
                                if (!respData) { throw 'Invalid json key!! key='+settings.remote.key; }
                                xytable.PopulateData(respData, true);
                            }
                            // data is in html
                            else {
                                $(table).find('tbody').html(resp);
                            }

                            if (settings.sorter && settings.sorter.remote) {
                                $.extend(true, settings, {sorter: {remote: {sortx: resp['sortx'], sortd: resp['sortd']}}});
                            }
                            if (settings.pager) { $.extend(true, settings, {pager: {records: resp['records'], page: page || 1}}); }

                            // initialize Data
                            xytable.DataInit();
                            // initialize DOM
                            xytable.DOMInit();
                            // initialize Events
                            if (events !== false) { xytable.EventsInit(); }
                            if (settings.callback.onLoaded) {
                                settings.callback.onLoaded.call(xytable, xytable.data);
                            }
                        }
                    };

                $.ajax($.extend(true, ajaxOpts, settings['ajaxOpts']));
            },
            /**
             * Grab available data into array of object per row basis
             */
            DataInit: function() {
                var settings = this.settings, table = $(this.table),
                    jsonObj, data = [], xytable = this,
                    baseKey =  settings.baseKey,
                    gridOp = settings.gridOp,
                    colModel = settings.colModel;
                // get data from array
                if (settings.data) {
                    this.PopulateData(settings.data);
                } else
                // or get data from json
                if (settings.json && $.parseJSON) {
                    jsonObj = $.parseJSON(settings.json);
                    this.PopulateData(jsonObj.data);
                }
                // get data from html
                $.each(table.find('tbody tr'), function() {
                    var obj = {}, tr = $(this),
                        d = tr.find('td').map(function() {
                            return $(this).text();
                        });
                    $.each(d, function(i) {
                        var k = colModel[i].name;
                        k = colModel[i].key ? k + gridOp + colModel[i].key : k;
                        obj[k] = this.toString();
                    });
                    data.push(obj);
                });
                this.data = data;
            },
            /**
             * Initialize DOM for xytable
             */
            DOMInit: function() {
                var i, head, style, colHeader = '', label = '', xytable = this,
                    totalWidth = 0, countWidth = 0, offset = 0, settings = this.settings,
                    colModel = settings.colModel,
                    gridId = settings.id, gridOp = settings.gridOp,
                    table = $(this.table), baseKey = settings.baseKey,
                    colSpan = 1, rowSpan = 1,
                    rows = table.find('tbody tr'),
                    visibleRows = table.find('tbody tr:visible'),
                    idGroup, ids = '', sorter = settings.sorter.remote || false,
                    headerSorter = {}, headerSortDir = [];
                // identify skip cols
                this.skip = 0;
                this.skip += settings.rowCount ? 1 : 0;
                this.skip += settings.checkRow ? 1 : 0;

                // wrapping, adding class, alternating to tables
                if (settings.rowAlternate) {table.find('tbody tr:odd').addClass('ui-xytable-alternate');}
                table.wrap('<div class="ui-xytable-wrapper" id="'+gridId+'-wrapper"></div>');

                // creating columns header
                if (settings.header) {
                    $.each(colModel, function(i) {
                        style = '';
                        if (this.width) {style += 'width:' + (!$.browser.safari ? this.width : (this.width+15)) + 'px;';}
                        if (this.hidden) {style += 'display:none;';}

                        label = this.label||'Column'+(i+1);
                        if (this['bindToCheck']) {
                            label += (!label.empty()?'<br/>':'')+'<input type="checkbox" id="'+gridId+'-chk-all-col'+i+'"/>';
                        }
                        colHeader += '<th class="' + (this.align || '') + ' "style="'+style+'" _idx="'+i+'">'+label+'</th>';
                        totalWidth += this.width || 0;
                        if (sorter) {
                            headerSortDir[i] = sorter.sortx && this.name == sorter.sortx ? sorter.sortd : 1;
                        }
                    });
                    totalWidth = (settings.width && settings.width > totalWidth) ? settings.width : totalWidth;
                    // assign table width
                    if (totalWidth > 0) {
                        // add generated column width (count and/or check)
                        totalWidth += (this.skip * 25);
                        table.addClass('ui-xytable').attr('width', totalWidth);
                    }
                    else {table.addClass('ui-xytable').attr('width', '100%');}
                    // put headers
                    table.prepend('<thead><tr></tr></thead>').find('thead tr').append(colHeader).addClass('ui-xytable-header');
                    this.headerSortDir = headerSortDir;
                }

                // prosess overriden header
                else {
                    head = table.find('thead');
                    rowSpan = head.find('tr').length;
                    if (head.length > 0) {head.find('tr').addClass('ui-xytable-header');}
                }

                // providing reference for header and body
                this.thead = table.find('thead');
                this.tbody = table.find('tbody');
                this.pager = $('#' + settings.pager.id);
                this.wrapper = $('#' + gridId + '-wrapper');

                if (totalWidth > 0) {this.pager.css({'width': '98%'});}
                if (this.pager.length > 0 && this.data.length > 0) {
                    // pager at bottom then move pager into wrapper and apply workaround for IE7
                    if (settings.pager.pos === 'bottom') {
                        this.wrapper.append(this.pager);
                        if ($.browser['msie']) {this.wrapper.append('<div class="after-pager-ie-workaround"></div>');}
                    }
                    // pager at top then move pager into wrapper
                    else {this.wrapper.prepend(this.pager);}
                }

                // processing hidden
                rows.each(function(i) {
                    var tr = $(this), tds = tr.find('td'),
                        nameGetter = function(name, base) { return baseKey ? name.replace(baseKey + gridOp, '') : base ? name.replace(base + gridOp, '') : name; };
                    tr.attr('_idx', i);
                    $.each(colModel, function(i) {
                        var td = $(tds[i]);
                        // column should be hidden
                        if (this.hidden) {td.hide();}
                        // column is considered as row id
                        if (this.id) {
                            var name = nameGetter(this.name, this.base);
                            ids += '<input type="hidden" name="'+name+'" value="'+td.text()+'"/>';
                            td.attr('rel', 'id');
                        }
                        // text aligning
                        if (this.align) {
                            switch (this.align) {
                                case 'right' : case 'left' : case 'center' :
                                    td.addClass(this.align);
                                    break;
                            }
                        }
                    });
                });

                // put hidden ids in wrapper
                if (settings.hiddenIds) {
                    idGroup = $('.ui-xytable-ids', this.wrapper);
                    if (idGroup.length == 0) {
                        this.wrapper.append('<div class="ui-xytable-ids" style="display:none;">'+ids+'</div>');
                    } else { idGroup.html(ids); }
                }

                // if has pager then initialize it now
                if (this.pager.length > 0) {this.PagerInit();}

                // row count
                if (settings.rowCount) {
                    offset = parseInt(settings.pager.offset, 10);
                    countWidth = offset > 999 ? ($.browser.safari ? 45 : 35) : 0;

                    this.thead.find('tr').prepend('<th class="count center" rowSpan="'+rowSpan+'">No.</th>');
                    if (countWidth > 0) {
                        $(this.thead.find('th.count').get(0)).css({'width': countWidth});
                    }

                    visibleRows.each(function(i) {
                        var count = i + 1;
                        if (offset) {count += offset;}
                        $(this).prepend('<td class="count center">'+count+'.</td>');
                    });
                }

                // checkboxes
                if (settings.multiple && settings.checkRow) {
                    this.thead.find('tr').prepend('<th class="check center" rowSpan="'+rowSpan+'"><input type="checkbox" id="'+gridId+'-chk-all" class="ui-xytable-control"/></th>');
                    rows.each(function(i) {
                        var tr = $(this), idTd = tr.find('td[rel=id]'),
                            idValue = idTd.length > 0 ? idTd.text() : (i + 1);
                        tr.prepend('<td class="check center"><input type="checkbox" class="ui-xytable-control" name="'+gridId+'ChkList" value="'+idValue+'"/></td>');
                    });
                }
                // radiobuttons
                else if (settings.checkRow) {
                    this.thead.find('tr').prepend('<th class="radio" rowSpan="'+rowSpan+'">&nbsp;</th>');
                    rows.each(function(i) {
                        var tr = $(this), idTd = tr.find('td[rel=id]'),
                            idValue = idTd.length > 0 ? idTd.val() : (i + 1);
                        tr.prepend('<td class="radio center"><input type="radio" name="'+gridId+'Rdo" value="'+idValue+'"/></td>');
                    });
                }

                // if no data show empty msg
                if (rows.length === 0) {
                    this.PutEmptyMsg();
                }
                // if has data then set row index
                else {rows.each(function(i) {this._idx = i;});}

                // adjust font size when fontSize setting is provided
                if (settings.fontSize && settings.fontSize !== '' && settings.fontSize !== '0') {
                    this.thead.parents('table').find('th, td').css({'font-size': settings.fontSize});
                }
                // apply sorter if config defined and grid not empty
                if (settings.sorter && rows.length > 1 && !settings.sorter.remote) {
                    for (i = 0; i < this.skip; i++) {
                        headerSorter[i] = {sorter: false};
                    }
                    sorter = $.extend(true, {headers : headerSorter}, settings.sorter);
                    table.tablesorter(sorter);
                }
                // remote sorter
                else if (settings.sorter.remote && rows.length > 1) {
                    $.each(this.thead.find('th'), function(i) { if (i >= xytable.skip) { $(this).addClass('header'); } });
                    // check url which field and what direction initially set
                    if (sorter.sortx && sorter.sortx !== 'null') {
                        $.each(colModel, function(i) {
                            var th = $(xytable.thead.find('th')[i + xytable.skip]);
                            if (this.name === sorter.sortx) {
                                th.addClass(sorter.sortd == 1 ? 'headerSortUp' : 'headerSortDown')
                            }
                        });
                    }
                }
            },
            /**
             * Initialize all xytable events (row click, checkbox/checkbox all click)
             */
            EventsInit: function() {
                var xytable = this, settings = xytable.settings,
                    table = $(this.table),
                    data = xytable.data,
                    mapToForm = $.noop,
                    selectCheckRow = $.noop,
                    clickCheck = $.noop;

                mapToForm = function(row) {
                    var colModel = settings.colModel;

                    $(row).find('td').each(function(i, c) {
                        if (i < xytable.skip) {return;}

                        var elt, idx = i - xytable.skip,
                            v = $(c).text(),
                            eltId = (colModel[idx])['field'];

                        if ( eltId && eltId !== '') {
                            // get element's jQuery Object
                            elt = $('#' + eltId);
                            if (elt.length === 0 && /\./.test(eltId)) {
                                elt = $('input').map(function() { if (this.name === eltId) { return this; } });
                            }
                            else if (elt.length === 0) {elt = $(':input[name="'+eltId+'"]');}

                            // checkbox
                            if (elt.is(':checkbox')) {
                                elt[0].checked = v === 'Y' || v === 'true' || v === '1';
                            }
                            // radio buttons select by name so could be more than 1
                            else if (elt.length >= 1 && $(elt[0]).is(':radio')) {
                                elt.each(function() {
                                    this.checked = $(this).val() == v;
                                });
                            }
                            // select
                            else if (elt.is('select')) {elt.val(v.split(','));}
                            // text|hidden|password input, textarea or select
                            else {elt.val(v);}
                        }
                    });
                };

                clickCheck = function(elt, row, call) {
                    var raw = elt.get(0), check = false,  checked = 0, rows = 0, idx = row.attr('_idx');
                    // checkall is clicked
                    if (elt.is(':checkbox[id$=chk-all].ui-xytable-control')) {
                        // checked or not
                        check = elt.get(0).checked;
                        // apply checked or not
                        row.parents('table').find(':checkbox.ui-xytable-control').each(function (i) {
                            this.checked = check;
                            // highlight
                            if (settings.highlight && settings.highlightOnCheck) {xytable.Highlight.call(raw, i, check, true);}
                        });
                        // call onCheck callback
                        settings.callback.onCheck.call(xytable, check, data, -1);
                    }
                    // single checkbox is clicked
                    else {
                        // map row values to form field
                        if (settings.mapToForm && settings.mapOnCheck) {mapToForm.call(raw, row.get(0));}

                        // highlight
                        if (settings.highlight && settings.highlightOnCheck) {xytable.Highlight.call(raw, idx, raw.checked, true);}

                        // apply check/uncheck all if checkbox click
                        if (elt.is(':checkbox')) {
                            // count total rows
                            rows = row.parents('tbody').find('tr').length;
                            // count total checked
                            checked = elt.parents('tbody').find(':checkbox.ui-xytable-control[checked]').length;

                            // check all if rows equal to checked
                            elt.parents('table')
                                   .find('thead :checkbox.ui-xytable-control')
                                   .get(0).checked = (checked == rows);
                        }

                        // call onCHeck callback
                        if (call === true) {
                            settings.callback.onCheck.call(xytable, checked > 0, data[parseInt(idx, 10)], idx);
                        }
                    }
                };

                selectCheckRow = function(e) {
                    var idx, check, elt = $(e.target),
                        remoteSorting = elt.is('th') && settings.sorter.remote, thIdx = 0, sortx, sortd,
                        sortHref = remoteSorting ? sortForm ? $(sortForm).attr('action') : settings.sorter.remote.href : '',
                        sortForm = remoteSorting ? settings.sorter.remote.form : '',
                        row = elt.is('td') || elt.is(':checkbox') ? elt.parents('tr') : elt,
                        gridOp = settings.gridOp,
                        _sortHref = sortHref + (sortHref.indexOf('?') != -1 ? '&' : '?') + '#{gridId}#{gridOp}sortx=#{sortx}&#{gridId}#{gridOp}sortd=#{sortd}';

                    idx = row.attr('_idx');
                    if (elt.is(':checkbox')) {
                        clickCheck(elt, row, true);
                    }
                    // Header click and support remote sorting
                    else if (remoteSorting) {
                        thIdx = parseInt(elt.attr('_idx'), 10);
                        sortd = xytable.headerSortDir[thIdx] = xytable.headerSortDir[thIdx] * -1;
                        sortx = settings.colModel[thIdx].name;

                        sortHref = $.tmpl(_sortHref, {sortx: sortx, sortd: sortd, gridId: settings.id, gridOp: gridOp});

                        elt.addClass(sortd == 1 ? 'headerSortUp' : 'headerSortDown');
                        elt.removeClass(sortd == 1 ? 'headerSortDown' : 'headerSortUp');

                        // ajax sort (reload)
                        if (settings.remote) { xytable.RemoteInit(sortHref, null, false); }
                        // submit to sorter url
                        else if (sortForm) { $(sortForm).attr('action', sortHref).submit(); }
                        // redirect to sorter url
                        else { location.href = sortHref; }
                    }
                    // Cell selection, highlight and/or map to form
                    else {
                        // map row values to form field
                        if (settings.mapToForm) {mapToForm.call(elt.get(0), row);}

                        // highlight when applicable
                        if (settings.highlight && !elt.is('th')) {xytable.Highlight.call(elt.get(0), idx, true, settings.checkOnSelect);}

                        // check if needs to clear check on select
                        if (settings.clearOnSelect) {xytable.ClearCheck();}
                        else if (settings.checkRow && settings.checkOnSelect) {
                            check = elt.parents('tr').find(':checkbox.ui-xytable-control');
                            check.get(0).checked = true;
                            clickCheck(check, row);
                        }

                        // Call user's onSelect callback function
                        settings.callback.onSelect.call(xytable, xytable.data[parseInt(idx, 10)], idx);
                    }
                };

                // Event handler for selecting/check row
                $('#' + settings.id).live('click', 'td, th', selectCheckRow);

                // Re-Order row count after sorting
                if (settings.sorter && !settings.sorter.remote) {
                    table.bind("sortEnd", function() {
                        var table = $(this.table);
                        table.find('tbody tr.ui-xytable-alternate').removeClass('ui-xytable-alternate');
                        table.find('tbody tr:odd').addClass('ui-xytable-alternate');
                        table.find('tbody tr').each(function(i, tr) {
                            var count = i + 1;
                            if (settings.rowCount) {$(tr).find('td.count').text(count+'.');}
                        });
                    });
                }
            },
            /**
             * Initialize Pagination Support
             */
            PagerInit: function() {
                var i, x, y, lower, higher, prop, settings = this.settings, hide = false,
                    gotoStr = '', infoStr = '', links = '', paramIsEmpty = true,
                    // pager options
                    opts = settings.pager, xytable = this,
                    // pager index anchor template
                    link_tmpl = '<a href="#{href}" title="#{title}" class="#{clazz}" page="#{page}">#{text}</a>',
                    // pager info template
                    info_tmpl = $.xytable.messages['xytable.pager.info.tmpl'],
                    // offset of grid operator (java ussualy used . (dot) but php should use _ (uderscore))
                    gridOp = settings.gridOp,
                    // pager container
                    container = $('#'+opts.id), paramPos = opts.base.indexOf('?'),
                    // get base parameters in query string as object to be merged with user param
                    url, baseParam = paramPos !== -1 ?
                            $.deparam(opts.base.substr(paramPos+1, opts.base.length)) : {},
                    // merge base param with user's param
                    param = $.extend({}, opts.param, baseParam);

                for(prop in opts.param) {
                    if(opts.param.hasOwnProperty(prop)) {paramIsEmpty = false;}
                }

                // if sortrted
                if (settings.sorter && settings.sorter.remote && settings.sorter.remote.sortx) {
                    param[settings.id + gridOp + 'sortx'] = settings.sorter.remote.sortx;
                    param[settings.id + gridOp + 'sortd'] = settings.sorter.remote.sortd;
                }
                param[settings.id + gridOp + 'offset'] = '';

                // compose pagination url query string
                url = (paramIsEmpty ? '' : opts.base) + opts.base.substr(0, paramPos !== -1 ? paramPos : opts.base.length) + '?' + $.param(param);

                // get current page and total available records as number (integer)
                opts.page = parseInt(opts.page, 10);
                opts.records = parseInt(opts.records, 10);
                // count offset and total page
                opts.offset = (opts.page * opts.rows) - opts.rows;
                opts.total = Math.ceil(opts.records / opts.rows);

                x = 1;y = opts.total > opts.max && opts.limitPages ? opts.max : opts.total;
                // Build pager if total pages more than 1
                if ((opts.total > opts.max) && opts.limitPages) {
                    lower = opts.page - Math.floor(opts.max / 2);
                    higher = opts.page + Math.floor(opts.max / 2);

                    if (lower > 0 && opts.total > opts.max) {x = lower;}
                    if (higher > opts.total-1)  {x = x-(higher-opts.total);}
                    if (higher < opts.total && higher > opts.max && opts.total > opts.max) {y = opts.max % 2 !== 0 ? higher : higher-1;}
                    else if (higher > opts.total-1) {y = opts.total;}
                }

                // first page
                if (opts.page != 1 && opts.showEdge) {
                    links += $.tmpl(link_tmpl, {
                        href: url + '0',
                        clazz: 'pager-link nav',
                        title: $.xytable.messages['xytable.pager.index.first.title'],
                        text: $.xytable.messages['xytable.pager.index.first.label'],
                        page: 1
                    });
                }
                // already on first page
                else if (opts.showEdge) {
                    links += $.tmpl(link_tmpl, {
                        href: '#',
                        clazz: 'pager-link nav edge inactive',
                        title: $.xytable.messages['xytable.pager.index.first.title'],
                        text: $.xytable.messages['xytable.pager.index.first.label'],
                        page: 1
                    });
                }
                // skip previous max pages
                if ((opts.page - opts.max) > 0 && opts.showSkip) {
                    links += $.tmpl(link_tmpl, {
                        href: url + (opts.offset - (opts.rows * opts.max)),
                        clazz: 'pager-link nav',
                        title: $.tmpl($.xytable.messages['xytable.pager.index.skipprev.title'], {skip: opts.max}),
                        text: $.tmpl($.xytable.messages['xytable.pager.index.skipprev.label'], {skip: opts.max}),
                        page: opts.page - opts.max
                    });
                }
                // no previous max pages available
                else if (opts.showSkip) {
                    links += $.tmpl(link_tmpl, {
                        href: '#',
                        clazz: 'pager-link nav inactive',
                        title: $.tmpl($.xytable.messages['xytable.pager.index.skipprev.title'], {skip: opts.max}),
                        text: $.tmpl($.xytable.messages['xytable.pager.index.skipprev.label'], {skip: opts.max}),
                        page: 0
                    });
                }
                // previous page
                if (opts.page > 1) {
                    links += $.tmpl(link_tmpl, {
                        href: url + (opts.offset - opts.rows),
                        clazz: 'pager-link nav',
                        title: $.xytable.messages['xytable.pager.index.prev.title'],
                        text: $.xytable.messages['xytable.pager.index.prev.label'],
                        page: opts.page - 1
                    });
                }
                // no previous page available
                else {
                    links += $.tmpl(link_tmpl, {
                        href: '#',
                        clazz: 'pager-link nav nextprev inactive',
                        title: $.xytable.messages['xytable.pager.index.prev.title'],
                        text: $.xytable.messages['xytable.pager.index.prev.label'],
                        page: 0
                    });
                }

                // display available page index label
                if (y > 1) {links += '&nbsp;<span>'+$.xytable.messages['xytable.pager.index.info']+'</span>&nbsp;';}
                // available pages
                for (i = x; i <= y; i++) {
                    links += $.tmpl(link_tmpl, {
                        href: url + ((i - 1) * opts.rows),
                        clazz: opts.page === i ? 'pager-link current inactive' : 'pager-link',
                        title: opts.page === i ? $.xytable.messages['xytable.pager.index.current.title'] : $.tmpl($.xytable.messages['xytable.pager.index.page.title'], {page: i}),
                        text: $.tmpl($.xytable.messages['xytable.pager.index.page.label'], {page: i}),
                        page: i
                    });
                }

                // next page
                if (opts.page < opts.total) {
                    links += $.tmpl(link_tmpl, {
                        href: url + (opts.offset + opts.rows),
                        clazz: 'pager-link nav',
                        title: $.xytable.messages['xytable.pager.index.next.title'],
                        text: $.xytable.messages['xytable.pager.index.next.label'],
                        page: opts.page + 1
                    });
                }
                // no next pages available
                else {
                    links += $.tmpl(link_tmpl, {
                        href: '#',
                        clazz: 'pager-link nav nextprev inactive',
                        title: $.xytable.messages['xytable.pager.index.next.title'],
                        text: $.xytable.messages['xytable.pager.index.next.label'],
                        page: 0
                    });
                }
                // skip next max pages
                if ((opts.page + opts.max) < opts.total && opts.showSkip) {
                    links += $.tmpl(link_tmpl, {
                        href: url + (opts.offset + (opts.rows * opts.max)),
                        clazz: 'pager-link nav',
                        title: $.tmpl($.xytable.messages['xytable.pager.index.skipnext.title'], {skip: opts.max}),
                        text: $.tmpl($.xytable.messages['xytable.pager.index.skipnext.label'], {skip: opts.max}),
                        page: opts.page + opts.max
                    });
                }
                // no next max pages available
                else if (opts.showSkip) {
                    links += $.tmpl(link_tmpl, {
                        href: '#',
                        clazz: 'pager-link nav inactive',
                        title: $.tmpl($.xytable.messages['xytable.pager.index.skipnext.title'], {skip: opts.max}),
                        text: $.tmpl($.xytable.messages['xytable.pager.index.skipnext.label'], {skip: opts.max}),
                        page: 0
                    });
                }
                // last page
                if (opts.page != opts.total && opts.showEdge) {
                    links += $.tmpl(link_tmpl, {
                        href: url + (opts.rows * (opts.total - 1)),
                        clazz: 'pager-link nav',
                        title: $.xytable.messages['xytable.pager.index.last.title'],
                        text: $.xytable.messages['xytable.pager.index.last.label'],
                        page: opts.total
                    });
                }
                // already on last page
                else if (opts.showEdge) {
                    links += $.tmpl(link_tmpl, {
                        href: '#',
                        clazz: 'pager-link nav edge inactive',
                        title: $.xytable.messages['xytable.pager.index.last.title'],
                        text: $.xytable.messages['xytable.pager.index.last.label'],
                        page: 0
                    });
                }

                // attach pager index
                infoStr = $.tmpl(info_tmpl, {
                    first: opts.offset + 1,
                    last: opts.records > opts.offset + opts.rows ? opts.offset + opts.rows : opts.records,
                    total: opts.records,
                    pages: opts.total
                });

                container.html('');
                container.addClass('ui-xytable-pager');
                container.append('<div class="info">' + infoStr + '</div>');
                container.append('<div class="index">' + links + '</div>');

                // hide by default
                container.find('a.inactive:not(.current)').hide();

                // show inactive links
                if (opts.showInactive) {container.find('a.inactive').show();}
                // show inactive nextprev only
                else if (opts.showInactiveNextPrev) {container.find('a.nextprev.inactive').show();}

                if (opts['goto']) {
                    gotoStr = $.xytable.messages['xytable.pager.goto.label'] + '&nbsp;<input type="text" class="field goto" id="' + settings.id + 'Goto"/>';
                    container.find('.index').append(gotoStr);
                    // listen to keyup event on goto field
                    $('#' + settings.id + 'Goto').keyup(function(e) {
                        var val, ch = String.fromCharCode(e.keyCode);
                        // reject if not number and enter key
                        if (!/[\d]/.test(ch) && e.keyCode !== 13) {
                            if (!/[\d]/.test(ch)) { // revert value if not number entered
                                $(this).val($(this).val().substr(0, $(this).val().length - 1));
                            }
                        }
                        // enter key detected
                        if (e.keyCode === 13) {
                            val = $(this).val() > opts.total ? opts.total : val;
                            // setup offset value
                            url += (val * opts.rows) - opts.rows;
                            // when ajax call callback
                            if (opts.ajax) { xytable.RemoteInit(this.href, val); }
                            // common redirect
                            else { location.href = url; }
                        }
                    });
                }

                // attach event click to navigation link
                container.find('a.pager-link').click(function() {
                    var page = parseInt($(this).attr('page'), 10);
                    if ($(this).is('.inactive')) {return false;}
                    // call ajax pagination callback
                    if (opts.ajax) {
                        xytable.RemoteInit(this.href, page, false);
                        return false;
                    }
                    // form submited pagination
                    else if (opts.form) {
                        $('#' + opts.form).attr('action', this.href);
                        $('#' + opts.form).trigger('submit');
                        return false;
                    }
                });

                // hide if no data
                hide = this.data.length === 0 || opts.records <= opts.rows;
                container[hide ? 'hide' : 'show']();
            },
            /**
             *  Highlight a row identified by row index
             */
            Highlight: function(idx, isOn, noClear) {
                var table = $(this).parents('table'), xytable = table.xytable(),
                    row = table.find('tbody tr').get(idx);

                if (idx == undefined) { return; }
                if (!noClear) { xytable.ClearHighlight(); }
                $(row)[isOn === true ? 'addClass' : 'removeClass']('ui-xytable-highlight');
            },
            /**
             *  Clear checked row
             */
            ClearCheck: function() {
                $(this.table).find(':checkbox.ui-xytable-control').each(function() {this.checked = false;});
            },
            /**
             *  Clear highlighted row
             */
            ClearHighlight: function() {
                $(this.table).find('.ui-xytable-highlight').removeClass('ui-xytable-highlight');
            },
            /**
             *  Disable row cheked functionality
             */
            DisableCheck: function() {
                $(this.table).find(':checkbox..ui-xytable-control, :radio.ui-xytable-control')
                    .each(function() {this.disabled = true;});
            },
            /**
             *  Enable row cheked functionality
             */
            EnableCheck: function() {
                $(this.table).find(':checkbox..ui-xytable-control, :radio.ui-xytable-control')
                    .each(function() {this.disabled = false;});
            },
            /**
             *  Shift checked row up by one row
             */
            ShiftRowUp: function() {
                // selected row to be shifted
                var settings = this.settings,
                    selected = $(this.table).find('tbody tr:visible').map(function() {
                        if ($(this).find(':checkbox.ui-xytable-control').get(0).checked) {return this;}
                    });
                if (settings.callback.onBeforeShift.call(this, selected)) {
                    this.ShiftRow('up', selected);
                    settings.callback.onAfterShift.call(this, 'up', selected);
                }
            },
            /**
             *  Shift checked row down by one row
             */
            ShiftRowDown: function() {
                // selected row to be shifted
                var settings = this.settings,
                    selected = $(this.table).find('tbody tr:visible').map(function() {
                        if ($(this).find(':checkbox.ui-xytable-control').get(0).checked) {return this;}
                    });
                if (settings.callback.onBeforeShift.call(this, selected)) {
                    this.ShiftRow('down', selected);
                    settings.callback.onAfterShift.call(this, 'down', selected);
                }
            },
            /**
             *  Shift row up/down functionality
             */
            ShiftRow: function(dir, selected) {
                var settings = this.settings, table = $(this.table);
                // shift up
                if (dir === 'up') {
                    // shift 'em
                    $.each(selected, function() {
                        var visibleRows = $(this).prevAll(':visible');
                        if (visibleRows.length > 0) {$(visibleRows[0]).before(this);}
                        else {return false;}
                    });
                }
                //  shift down
                else if (dir === 'down') {
                    // reverse selected
                    selected = $.makeArray(selected).reverse();
                    // shift 'em
                    $.each(selected, function() {
                        var visibleRows = $(this).nextAll(':visible');
                        if (visibleRows.length > 0) {$(visibleRows[0]).after(this);}
                        else {return false;}
                    });
                }
                // fix count & alternating rows
                table.find('tbody tr.ui-xytable-alternate').removeClass('ui-xytable-alternate');
                table.find('tbody tr:odd').addClass('ui-xytable-alternate');
                table.find('tbody tr').each(function(i, r) {
                    var count = i + 1;
                    if (settings.rowCount) {$(r).find('td.count').text(count+'.');}
                });
            },
            /**
             *  Set empty grid message (label)
             */
            SetEmptyMsg: function(msg) {
                var settings = this.settings;
                if (this.data.length === 0) {if (msg) {settings.emptyMsg = msg;} $(this.table).find('tbody td').text(settings.emptyMsg);}
            },
            /**
             * Put Message for Empty Grid
             */
            PutEmptyMsg: function() {
                var settings = this.settings;
                colSpan = $('th', this.thead).length;
                this.tbody.append('<tr class="ui-xytable-empty-row"><td colSpan="'+colSpan+'">'+settings.emptyMsg+'</td></tr>');
                this.DisableCheck();
            },
            /**
             *  Populate data (object) into rows and columns (HTML)
             */
            PopulateData: function(data, noMerge) {
                var rows = '', settings = this.settings, table = $(this.table),
                    colModel = settings.colModel;

                if (!(noMerge||false)) {this.data = $.merge(this.data, data);} else {this.data = data;}
                $.each(this.data, function() {
                    var row = this, td = '';
                    $.each(colModel, function() {
                        var keys = [], name = this.name, text = row[name] !== undefined ? row[name] : '--error--';
                        if (this.key && !this.key.empty()) {
                            keys = this.key.split('.');
                            $.each(keys, function() { text = text[this]; });
                        }
                        td += '<td>' + text + '</td>';
                    });
                    rows += '<tr ' + (this.hide ? 'style="display:none;"' : '') + '>' + td + '</tr>';
                });

                table.find('tbody').html(rows);

                if (!settings.remote) {
                    // reset header for non static header
                    if (settings.header) {
                        table.find('thead').remove();
                    }
                    // initialize Data Model
                    this.DataInit();
                    // initialize DOM
                    this.DOMInit();
                }
            },
            /**
             *  Insert a row by populating a supplied data (Object)
             */
            AddRow: function(data) {
                var callback = this.settings.callback;
                if (!(data instanceof Array)) {data = [data];}
                if (callback.onAdd()) { this.PopulateData(data); }
            },
            /**
             *  Update a row by index
             */
            UpdateRow: function(newData, formSer) {
                var data = this.data, skip = this.skip, tbody = this.tbody,
                    settings = this.settings,
                    colModel = settings.colModel,
                    callback = settings.callback,
                    baseKey =  settings.baseKey,
                    gridOp = settings.gridOp,
                    idx = -1, id = '', row,
                    nameGetter = function(name, base) { return baseKey ? name.replace(baseKey + gridOp, '') : base ? name.replace(base + gridOp, '') : name; },
                    idKey = $.map(colModel, function(x) {
                        if (x.id === true) {
                            return nameGetter(x.name, x.base);
                        }
                    });

                if (idKey.length == 0) { return false; }
                if (callback.onUpdate()) {
                    id = idKey[0];
                    // update data
                    $.each(data, function(i) {
                        if (data[i][id] == newData[id]) {
                            idx = i; data[i] = newData;
                        }
                    });
                    if (idx === -1) {
                        throw 'No Rows Matched';
                    }
                    // get the correct row
                    row = $('tr:eq(' + idx + ')', tbody);
                    // update contents
                    $.each(colModel, function(i) {
                        var text, colIdx = i + skip, keys = [],
                            name = nameGetter(this.name, this.base);

                        name = formSer && this.key ? name + gridOp + this.key : name;
                        text = newData[name] !== undefined ? newData[name] : '--error--';
                        if (!formSer && this.key && !this.key.empty()) {
                            keys = this.key.split('.');
                            $.each(keys, function() { text = text[this]; });
                        }
                        $('td:eq('+colIdx+')', row).text(text);
                    });
                }
            },
            /**
             *  Delete checked row or by row index as parameter
             */
            DeleteRow: function(rowIdx) {
                var newData = [], settings = this.settings, hide = settings.hidedelete, callback = settings.callback;
                if (typeof rowIdx == 'undefined') {
                    rowIdx = $(this.table).find('tbody tr').map(function(i) {
                        if (!$(this).is(':visible')) { return i; }
                        if ($(this).find(':checkbox.ui-xytable-control').get(0).checked) { return i; }
                    });
                    rowIdx = $.map(rowIdx, function(x) { return x; });
                }
                if (!(rowIdx instanceof Array)) { rowIdx = [rowIdx]; }
                $.each(this.data, function(i) {
                    if ($.inArray(i, rowIdx) === -1) { newData.push(this); }
                    else if (hide) { this.hide = true; newData.push(this); }
                });
                if (callback.onDelete() && rowIdx.length > 0) { this.PopulateData(newData, true); }
                return rowIdx;
            },
            /**
             *  Delete all rows
             */
            DeleteAll: function() {
                var settings = this.settings, tbody = this.tbody, rows = $('tr', tbody);
                rows = $.map(rows, function(tr, i) { return i; });
                this.DeleteRow(rows);
                if (settings.remote) {
                    this.PutEmptyMsg();
                    $.extend(true, settings.pager, {offset: 0, page: 1, total: 1, records: 1});
                    this.PagerInit();
                }
            },
            /**
             *  Reload xytable
             */
            Reload: function() {
                var settings = this.settings;
                if (!settings.remote) { return; }
                this.RemoteInit(settings.remote.url, false, false);
            },
            /**
             *  Serialize Data
             */
            Serialize: function(name) {
                var i = 0, data = this.data, arr = [], dataKeys = {},
                    settings = this.settings, gridOp = settings.gridOp,
                    colModel = settings.colModel, baseKey = settings['baseKey'];

                $.each(colModel, function() { dataKeys[this.name] = this.key; });
                $.each(data, function() {
                    var row = this, val = '', obj = {};
                    if (name) { arr.push(row[name].toString()); }
                    else {
                        $.each(row, function(key) {
                            key = baseKey ? baseKey + gridOp + key : key;
                            key = dataKeys[key] ? key + gridOp + dataKeys[key] : key;
                            obj[key] = this.toString();
                        });
                        arr.push(obj);
                    }
                });
                return arr;
            }
        }
    });
})(jQuery);