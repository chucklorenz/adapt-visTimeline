/*
 * adapt-visTimeline
 * Adapt License - http://github.com/adaptlearning/adapt_framework/blob/master/LICENSE
 * Vis.js is dual licensed under both Apache 2.0(http://www.apache.org/licenses/LICENSE-2.0)
 * and MIT(http://opensource.org/licenses/MIT).
 * Maintainer - Chuck Lorenz <chucklorenz@yahoo.com>
 */
define(function(require) {

    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');
    var vis = require('components/adapt-visTimeline/js/vis-timeline_3_9_1');
    //var moment = require('components/adapt-visTimeline/js/moment.min');
    //var itemTemplate = Handlebars.templates['ex_visTimelineItem'];
    var myTimeline;

    var VisTimeline = ComponentView.extend({

        events: {
            'click .visTimeline-controls': 'onNavigationClicked'
        },

        preRender: function() {
            // Checks to see if the text should be reset on revisit
            this.checkIfResetOnRevisit();
        },

        postRender: function() {
            this.buildTimeline();
            this.setReadyStatus();

            // Check if instruction or body is set, otherwise force completion
            var cssSelector = this.$('.component-instruction').length > 0
                ? '.component-instruction'
                : (this.$('.component-body').length > 0 ? '.component-body' : null);

            if (!cssSelector) {
                this.setCompletionStatus();
            } else {
                this.model.set('cssSelector', cssSelector);
                this.$(cssSelector).on('inview', _.bind(this.inview, this));
            }
        },

        buildTimeline: function() {
            //build container, options, data, groups
            var container = document.getElementById('visualization'); // code fails if jQuery is used here
            var modelItems = this.model.get('_items');
            if (this.model.has('_items-url') && this.model.get('_items-url')!=='') {
                this.loadExternalData(container, this.model.get('_items-url'));
            } else {
                this.loadModelData(container, modelItems);
            }
        },

        loadModelData: function(container, data) {
            this.validateDataItems(data);
            myTimeline = new vis.Timeline(container, data);
            this.validateConfigOpts(data, myTimeline);
            this.validateGroups(myTimeline);
        },

        loadExternalData: function(container, url) {
            // load data via an ajax request. When the data is in, load the timeline
            $.ajax({
                url: url,
                context: this,
                success: function (data) {
                    this.validateDataItems(data);
                    var items = new vis.DataSet(data);
                    myTimeline = new vis.Timeline(container, items);
                    this.validateConfigOpts(data, myTimeline);
                    this.validateGroups(myTimeline);
                },
                error: function (err) {
                    console.log('Error', err);
                    if (err.status === 0) {
                        alert('Failed to load data.json.\nPlease run this example on a server.');
                    }
                    else {
                        alert('Failed to load data.json.');
                    }
                }
            });
        },

        validateDataItems: function(items) {
            //Vis.js documentation says these properties are not required:
            var optionalItems = ['classname', 'end', 'group', 'id', 'style', 'subgroup', 'title'];
            // check model items for any of vis.js's optional properties
            _.each(items, function (item) {
                // delete empty properties before they are passed to vis.js to prevent errors (e.g., NaN).
                _.each (optionalItems, function(optItem) {
                    if (item.hasOwnProperty(optItem) && item[optItem] == '') {
                        delete item[optItem];
                    }
                });
                // ensure optional items meet documented requirements
                if ((item.type === 'range' || item.type === 'background') && (item.end === undefined || item.end === '')) {
                    item.type = 'box'; // 'box' is the default
                }
            });
        },

        validateConfigOpts: function(items, timeline) {
            var configOptions = this.model.get('_options') || {};
            var optsHasTemplate = false;
            for(var option in configOptions) {
                if (configOptions.hasOwnProperty(option) && configOptions[option] === '') {
                    delete configOptions[option];
                }
                if (configOptions.hasOwnProperty(option) && option === 'template') {
                    //template from configOpts unless item.template exists:
                    configOptions[option] = this.getItemTemplate(items, configOptions[option]);
                    optsHasTemplate = true;
                }
            }
            if(_.isEmpty(configOptions)) {
                configOptions['template'] = this.getItemTemplate(items, configOptions[option]);
            }
            timeline.setOptions(configOptions);
        },

        getItemTemplate: function(items, templateFromConfigOpts) {
            var template = function (item) {
                if(item.template) {
                    var template = Handlebars.templates[item.template];
                    return template(item);
                } else if(templateFromConfigOpts !== '' && templateFromConfigOpts !== undefined) {
                    var template = Handlebars.templates[templateFromConfigOpts];
                    return template(item);
                } else if(item.content !== undefined) {
                    return item.content;
                } else {
                    return;
                }
            }
            return template;
        },

        validateGroups: function(timeline) {
            //console.log('before groups is validated:');
            //var dataCopy = jQuery.extend(true, {}, groups);
            //console.log(dataCopy);

            //Vis.js documentation says these properties are not required:
            var optionalItems = ['classname', 'style', 'subgroupOrder', 'title'];

            if (this.model.has('_groups-url') && this.model.get('_groups-url')!=='') {
                // load data via an ajax request. When the data is in, load the timeline
                $.ajax({
                    url: this.model.get('_groups-url'),
                    context: this,
                    success: function (data) {
                        console.log('before data is validated:');
                        var dataCopy = jQuery.extend(true, {}, data);
                        console.log(dataCopy);
                        _.each(data, function (group) {
                            // delete empty properties before they are passed to vis.js to prevent errors (e.g., NaN).
                            _.each(optionalItems, function (optItem) {
                                if (group.hasOwnProperty(optItem) && group[optItem] == '') {
                                    delete group[optItem];
                                }
                            });
                        });
                        console.log('after data is validated:');
                        console.log(data);
                        timeline.setGroups(data);
                    },
                    error: function (err) {
                        console.log('Error', err);
                        if (err.status === 0) {
                            alert('Failed to load data.json.\nPlease run this example on a server.');
                        }
                        else {
                            alert('Failed to load data.json.');
                        }
                    }
                });
                return;
            }

            if (this.model.has('_groups')) {
                groups = this.model.get('_groups');
                _.each(groups, function (group) {
                    // delete empty properties before they are passed to vis.js to prevent errors (e.g., NaN).
                    _.each (optionalItems, function(optItem) {
                        if (group.hasOwnProperty(optItem) && group[optItem] == '') {
                            delete group[optItem];
                        }
                    });
                });
                timeline.setGroups(groups);
            }
        },

        onNavigationClicked: function(event) {
            event.preventDefault();
            if ($(event.currentTarget).hasClass('visTimeline-control-right')) {
                this.moveTimeline(-0.2);
            } else if ($(event.currentTarget).hasClass('visTimeline-control-left')) {
                this.moveTimeline(0.2);
            }
        },

        moveTimeline: function (percentage) {
            var range = myTimeline.getWindow();
            var interval = range.end - range.start;
            myTimeline.setWindow({
                start: range.start.valueOf() - interval * percentage,
                end: range.end.valueOf() - interval * percentage
            })
        },

        // Used to check if the text should reset on revisit
        checkIfResetOnRevisit: function() {
            var isResetOnRevisit = this.model.get('_isResetOnRevisit');

            // If reset is enabled set defaults
            if (isResetOnRevisit) {
                this.model.set({
                    _isEnabled: true,
                    _isComplete: false
                });
            }
        },

        //TODO Improve check for setCompletionStatus: check to see if range of
        // timeline has brought all data items into view.
        inview: function(event, visible, visiblePartX, visiblePartY) {
            if (visible) {
                if (visiblePartY === 'top') {
                    this._isVisibleTop = true;
                } else if (visiblePartY === 'bottom') {
                    this._isVisibleBottom = true;
                } else {
                    this._isVisibleTop = true;
                    this._isVisibleBottom = true;
                }

                if (this._isVisibleTop && this._isVisibleBottom) {
                    this.$(this.model.get('cssSelector')).off('inview');
                    this.setCompletionStatus();
                }
            }
        }
    });

    Adapt.register('visTimeline', VisTimeline);

});