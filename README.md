#adapt-visTimeline

An adapt timeline component that displays items positioned chronologically along a marked axis. As with most Adapt components, it may be preceded by title, body text, and instruction elements.

The component incorporates the [vis.js](http://visjs.org/index.html#modules) Timeline module (v3.9.1). Vis.js is dual licensed under both [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0) and [MIT](http://opensource.org/licenses/MIT).

##Installation

First, be sure to install the [Adapt Command Line Interface](https://github.com/adaptlearning/adapt-cli), then from the command line run:-

        adapt install adapt-visTimeline

This component can also be installed by adding the component to the adapt.json file before running `adapt install`:

        "adapt-visTimeline": "*"

##Usage

Four aspects of the component are configurable: the overall widget including the timeline axis, item data and its source, group data and its source, and each item's template. Configuration properties mirror those documented by [vis.js](http://visjs.org/docs/timeline.html); visit the site for property descriptions.

###General options including the timeline axis
The timeline axis may be positioned either at the bottom or at the top of the widget. The timeline is displayed horizontally. Currently there is no support for a vertical presentation. The time increment is customizable. By default the range is established by the `start` of the chronologically first item and the `end` of the last item. If the range exceeds the width of the viewport, the timeline can be dragged to bring items into view.

Two defaults can be set at the level of the widget and can be overridden by item properties:
- `type`: Designates the appearance of the item and its visual relationship to the timeline axis. Choose from `box`, `point`, `range`, and `background`.
  + `box` draws a single line to the `start` date/time on the timeline axis.
  + `point` eliminates the visual box and places, instead, a dot in front of the `content`. `point` draws no line to the timeline axis.
  + `range` extends the box from `start` to `end`; it draws no line to the timeline axis.
  + `background` draws itself behind the other data items based on the `start` and `end` dates/times.
- `template`: Determines how the data is arranged within each item. HTML, handlebars, and mustache templates are all acceptable. The name of a template file is arbitrary but must include the extension. (The *templates/visTimeline.hbs* file should not be deleted.)

Other options include the following:
- Items may be dragged along the timeline.
- Items may be added, edited, or deleted.

[Configurable settings](http://visjs.org/docs/timeline.html#Configuration_Options) are explained in more detail on the [vis.js website](http://visjs.org/docs/timeline.html#Configuration_Options).

###Item data and data source
>####Item data
>Item data is governed by the properties specified by [vis.js documentation](http://visjs.org/docs/timeline.html#Items). Some item properties are required: `start` and `content`. (`content` may be omitted if a template is employed that does not require it.) An item may have data elements in addition to those specified by vis.js. A custom item template must be provided in order to display these extra data.

>####Data source
>Data in the json format can be supplied in either the component model (*components.json*) or in a separate json file. They cannot be supplied in both. Item data that appear in *components.json* will be ignored if a value for `_items-url` (the path to the json data file) is provided in the component model. The name of an external data file is arbitrary but must include the .json extension.

###Group data and data source
>####Group data
>Group data is governed by the properties specified by [vis.js documentation](http://visjs.org/docs/timeline.html#groups). Groups are optional. If groups are used, an item will display only if a reference to a group id is present in the item properties (e.g., `"group": 1`). Some group properties are required: `id` and `content`.

>####Data source
>Data in the json format can be supplied in either the component model (*components.json*) or in a separate json file. They cannot be supplied in both. Groups data that appear in *components.json* will be ignored if a value for `_groups-url` (the path to the json data file) is provided in the component model. The name of an external data file is arbitrary but must include the .json extension.

###Item template
A [template handler](http://visjs.org/docs/timeline.html#Templates) has been provided. When no value for `template` is provided either in the `_options` or in the item's properties, the item's `content` will be displayed with default styling. When a value for `template` is provided for `_options`, the template will be applied to all items. A template can be assigned to a specific item by specifying the template in the item's properties. The item's template will override the template specified in `_options`. The name of a template file is arbitrary but must include the extension. (The *templates/visTimeline.hbs* file should not be deleted.)

//TODO: Address where to place template and how to account for template path, if necessary.

##Settings overview

####_component

This value must be: `visTimeline`.

####_classes

You can use this setting to add custom classes to your template and LESS file.

####_layout

This defines the position of the component in the block. Values can be `full`, `left` or `right`. 

####displayTitle, title, body, instruction

The `displayTitle`, `title`,  `body`, and `instruction` settings are optional and may be left blank.

####_options

All acceptable options are specified by the [visjs.org documentation]((http://visjs.org/docs/timeline.html#Configuration_Options)) for the Timeline module. Options must match the spelling found in visjs.org documentation as they are passed directly to the code library. `_options` is not required, but its use is encouraged. Only several common properties are highlighted here.

>#####width and height

>`width` and `height` are strings whose units may be either "%" or "px". It is recommended that the developer begin with `"width": "100%"`.

>#####margin

>The `margin` represents the minimal number of pixels that will separate item boxes from the timeline axis and adjacent item boxes from each other. Defaults are a minimum of 20px from the timeline axis and a minimum of 10px between items.

>#####template

>`template` is the name of the template file without any extension (eg., .html, .hbs). No path is needed if the file (with extension) is placed in the XXXX directory. This template will be applied to all data items unless another template is specified in the item properties. The item's `template` will override the option's `template`. If no `template` is specified in `_options`, the item's `content` will be rendered with default styling.

####_items-url

`_items-url` is optional. If it is not used, the component will look for item data within its model specified in *components.json*. Item data, however, may be supplied in an external file. `_items-url` specifies the name of the json file (including the extension) that supplies the item data. No path is needed if the file is placed in the XXXX directory. Both techniques cannot be used simultaneously. If a value is present for `_items-url`, the component will ignore any item data in *components.json*.

####_items

Items data may be specified in one of two places: in `_items-url` in *components.json* or as a separate JSON file. The item properties are the same regardless of which technique is used. All [item properties](http://visjs.org/docs/timeline.html#Items) are documented on the visjs.org website. Item properties must match the spelling found in visjs.org documentation as they are passed directly to the code library. Not all properties are described here.

>#####start and end

>`start` and `end` determine the range of an item. Only `start` is required. Both properties require a date string. [Acceptable date formats](http://chuck supply URL) are described in vis.js documentation. (What about Moment.js??) Neither date is presented by default, but are used to determine placement on the timeline. If the dates need to be presented within the item box, a custom template must be supplied.

>#####content

>`content` is a string that will be presented within the item box. HTML is acceptable.

>#####type

>`type` is a string that determines the item's relationship to the timeline. Acceptable values are `box`, `range`, `point`, and `background`. `box` is the default.  If undefined, the component will auto detect the type from the item's data: if both `start` and `end` are present, a `range` will be created, otherwise, a `box` is created. `point` and `background` must be specified explicitly.

>#####template

>`template` is the name of the template file without any extension (eg., .html, .hbs). No path is needed if the file (with extension) is placed in the XXXX directory.`template` is optional. The template specified here will override any template that is specified in `_options`. It is possible for each item to have its own template.

>#####group

>The use of groups is optional. However, if a value is present for `_groups` or `_groups-url`, the item's `group` property must reference an `id` of one of the groups. If it does not, it will not be displayed in the timeline.

####_groups-url

`_groups-url` is optional. `_groups-url` specifies the name of the json file (including the extension) that supplies the groups data. No path is needed if the file is placed in the XXXX directory. If it is not used, the component will look for groups data within its model specified in *components.json*; but this, too, is optional. Both techniques cannot be used simultaneously. If a value is present for `_groups-url`, the component will ignore any groups data in *components.json*.

####_groups

Groups data may be specified in one of two places: in `_groups-url` in *components.json* or as a separate JSON file. The group properties are the same regardless of which technique is used. All [group properties](http://visjs.org/docs/timeline.html#groups) are documented on the visjs.org website. Group properties must match the spelling found in visjs.org documentation as they are passed directly to the code library. Not all properties are described here.

>#####id

>The `id` is a string or a number that is referenced by those items that belong to the group. The value of the group's `id` matches the member item's `group` value.

>#####content

>`content` is the group's label that appears in the widget.

##Examples
Example data and templates are included within the source code. All are prefaced with `ex_`. Data files are found in the `assets` directory. Templates are found in the `templates` directory. These should be deleted when no longer needed.

##Limitations

The timeline displays horizontally. It does not have a vertical orientation. Consequently, prudence should be exercised in situations that require portrait display on small devices.

Accessibility standards are not fully met.

The vis.js timeline module has many features. Not all have been tested with this component.

##Browser spec

This component has not been tested against the standard Adapt browser specification. According to the [visjs.org website](http://visjs.org/docs/index.html): "Vis.js runs fine on Chrome, Firefox, Opera, Safari, IE9+, and most mobile browsers (with full touch support)."

##To Do

- Rework LESS to match Adapt standards.
- Review accessibility.

##Licenses

Adapt and adapt-visTimeline licensed under [GPL3](http://github.com/adaptlearning/adapt_framework/blob/master/LICENSE).

Vis.js is dual licensed under both [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0) and [MIT](http://opensource.org/licenses/MIT).

