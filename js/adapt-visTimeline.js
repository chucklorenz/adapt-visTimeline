/*
* adapt-timeline
* License - http://github.com/adaptlearning/adapt_framework/blob/master/LICENSE
* Maintainers - Daryl Hedley <darylhedley@hotmail.com>, Brian Quinn <brian@learningpool.com>
*/
define(function(require) {

    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');
    //var vis = require('components/adapt-timeline/js/vis/dist/vis.min'); // works alone but is bloated
    var vis = require('components/adapt-timeline/js/vis-timeline'); // Contains moment, but I can't figure out how to call it. Consider rebundling to remove moment.
    //var moment = require('components/adapt-timeline/js/moment.min');

    var VisTimeline = ComponentView.extend({
        
        postRender: function() {
            this.buildTimeline();
            this.setReadyStatus();

            // Check if instruction or body is set, otherwise force completion
            var cssSelector = this.$('.component-instruction').length > 0 ? '.component-instruction' 
                : (this.$('.component-body').length > 0 ? '.component-body' : null);

            if (!cssSelector) {
                this.setCompletionStatus();
            } else {
                this.model.set('cssSelector', cssSelector);
                this.$(cssSelector).on('inview', _.bind(this.inview, this));
            }
        },

        buildTimeline: function() {
            var modelItems = this.model.get('_items');
            this.validateItemsForVisTimeline(modelItems);
            var container = document.getElementById('visualization'); // line 57 fails if jQuery is used here
            //console.log(container);
            //console.log(this.$('#visualization'));
            //var testMoment = moment('2013-04-20');
            //console.log(testMoment);

            /*var data = new vis.DataSet([
                {id: 1, content: 'item 1', start: moment('2013-04-20')},
                {id: 2, content: 'item 2', start: moment('2013-04-14')},
                {id: 3, content: 'item 3', start: moment('2013-04-18')},
                {id: 4, content: 'item 4', start: moment('2013-04-16'), end: moment('2013-04-19')},
                {id: 5, content: 'item 5', start: moment('2013-04-25')},
                {id: 6, content: 'item 6', start: moment('2013-04-27')}
            ]);*/

            /*var data = new vis.DataSet([
                {id: 1, content: 'item 1', start: '2013-04-20'},
                {id: 2, content: 'item 2', start: '2013-04-14'},
                {id: 3, content: 'item 3', start: '2013-04-18'},
                {id: 4, content: 'item 4', start: '2013-04-16', end: '2013-04-19'},
                {id: 5, content: 'item 5', start: '2013-04-25'},
                {id: 6, content: 'item 6', start: '2013-04-27'}
                */

            // Configuration for the Timeline
            var options = {
                width: '100%',
                height: '300px',
                margin: {
                    item: 20
                }
            };

            if (this.model.has('_data-url') && this.model.get('_data-url')!=='') {
                //console.log(this.model.get('_data-url'));
                this.loadExternalData(container, this.model.get('_data-url'), options);
            } else {
                this.loadModelData(container, modelItems, options);
            }
        },

        validateItemsForVisTimeline: function (items) {
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

        loadExternalData: function(container, url, options) {
            // load data via an ajax request. When the data is in, load the timeline
            $.ajax({
                url: url,
                success: function (data) {
                    // hide the "loading..." message
                    //this.$('#data-loading').style.display = 'none';
                    // DOM element where the Timeline will be attached
                    //var container = document.getElementById('visualization'); // line XX fails if jQuery is used here
                    // Create a DataSet (allows two way data-binding)
                    var items = new vis.DataSet(data);
                    // Create a Timeline
                    var timeline = new vis.Timeline(container, items, options);
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

        loadModelData: function (container, data, options) {
            //var data = new vis.DataSet(data);
            /*var data = new vis.DataSet();
            _.each(this.model.get('items'), function(item, index) {
                *//*data.add({
                    id: index + 1,
                    //group: group,
                    content: ' <span style="color:#97B0F8;">' + item.content + '</span>',
                    start: item.start,
                    type: 'box'
                });*//*
                data.add(item);
            });*/

            /*var options = {
                width: '100%',
                height: '300px',
                margin: {
                    item: 20
                }
            };*/
            var timeline = new vis.Timeline(container, data, options);
        },

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
    
    Adapt.register("visTimeline", VisTimeline);

    return VisTimeline;
    
});