define(function (require, exports, module) {
    var Ratchet = require("ratchet/web");
    var async = require("//cdn.jsdelivr.net/npm/async@2.6.2/dist/async.min.js");
    var OneTeam = require("oneteam");
    require("//code.jquery.com/ui/1.12.1/jquery-ui.js");

    var ContentInstancesGadget = require("app/gadgets/project/content/content-instances");

    return Ratchet.GadgetRegistry.register("cna-content-instances", ContentInstancesGadget.extend({

        getDefaultSortField: function (model) {
            return "sequence";
        },

        configureDefault: function () {
            this.base();

            // this part is normally not needed (it should be picked up from config)
            // there is a bug in OneTeam whereby this isn't being retained, so set manually here
            this.config({
                "chrome": false,
                "buttons": [],
                "columns": [{
                    "title": "Content",
                    "key": "titleDescription"
                }],
                "icon": true,
                "checkbox": true,
                "loader": "gitana",
                "actions": true,
                "selectorGroups": {
                    "multi-documents-action-selector-group": {
                        "actions": []
                    },
                    "sort-selector-group": {
                        "fields": [{
                            "key": "title",
                            "title": "Title",
                            "field": "title"
                        }, {
                            "key": "description",
                            "title": "Description",
                            "field": "description"
                        }, {
                            "key": "createdOn",
                            "title": "Created On",
                            "field": "_system.created_on.ms"
                        }, {
                            "key": "createdBy",
                            "title": "Created By",
                            "field": "_system.created_by"
                        }, {
                            "key": "modifiedOn",
                            "title": "Modified On",
                            "field": "_system.modified_on.ms"
                        }, {
                            "key": "modifiedBy",
                            "title": "Modified By",
                            "field": "_system.modified_by"
                        }, {
                            "key": "size",
                            "title": "Size",
                            "field": "_system.attachments.default.length"
                        }]
                    }
                }
            });
        },

        prepareModel: function (el, model, callback) {
            var self = this;

            this.base(el, model, function () {

                model.options.defaultSortDirection = 1;

                callback();

            });
        },

        /**
         * Loads dynamic/configuration driven portions of the list into the model.
         *
         * @param model
         */
        applyDynamicConfiguration: function (model) {
            var self = this;

            this.base(model);

            var sortSelectorGroupFields = model["selectorGroups"]["sort-selector-group"]["fields"];
            sortSelectorGroupFields.unshift({
                "key": "sequence",
                "title": "Sequence",
                "field": "sequence"
            });
        },

        /*
        beforeSwap: function(el, model, callback)
        {
            var self = this;

            this.base(el, model, function() {
                callback();
            });
        },
        */

        _applyResort: function (gadget, model, event, ui) {
            var newOrder = $(event.target.children).map(function (index, item) {
                return item.id;
            });

            var direction = 1;
            if (model.pagination && model.pagination.sort && model.pagination.sort.sequence) {
                direction = model.pagination.sort.sequence;
            }

            var patches = [];
            var sequence = direction < 0 ? 1 + model.totalRows : 0;
            for (var i = 0; i < newOrder.length; i++) {
                sequence += direction;
                var node = model.rowsById[newOrder[i]];

                if (!Gitana.isEmpty(node.sequence) && node.sequence == sequence) {
                    // skip nodes whos order has not changed
                    continue;
                }

                if (node.sequence !== sequence) {
                    // this node needs a new sequence. patch it.
                    patches.push({
                        node: node,
                        patch: {
                            op: Gitana.isEmpty(node.sequence) ? "add" : "replace",
                            path: "/sequence",
                            value: sequence
                        }
                    });
                }
            }

            // run any patches
            async.each(patches, function (patch, callback) {
                Chain(patch.node).patch([patch.patch]).then(callback);
            }, function (err) {
                // completed patches
                gadget.refresh(model);
            });
        },

        afterSwap: function (el, model, originalContext, callback) {
            var self = this;

            this.base(el, model, originalContext, function () {

                // apply drag and drop (jquery ui sortable) to table dom element
                // only apply sortable if list is sorted by the sequence field
                if (model.pagination && model.pagination.sort && model.pagination.sort.sequence) {
                    $(el).find('.dataTable > tbody').sortable({
                        update: async.apply(self._applyResort, self, model)
                    });
                }

                callback();
            });
        },

        doGitanaQuery: function (context, model, searchTerm, query, pagination, callback) {
            this.base(context, model, searchTerm, query, pagination, function (resultMap) {

                var array = resultMap.asArray();

                model.size = resultMap.size();
                model.totalRows = resultMap.totalRows();

                // copy into map so that we can reference by ID
                // this may help with drag/drop                
                model.rowsById = {};
                for (var i = 0; i < array.length; i++) {
                    var row = array[i];
                    model.rowsById[row._doc] = row;
                }

                callback(resultMap);
            });
        },

        iconUri: function(row, model, context)
        {
            var _iconUri = OneTeam.iconUriForNode(row);

            if (row.image && row.image.id) {
                _iconUri = OneTeam.iconUriForNode(row, {size: 160});
                _iconUri = _iconUri.replace(new RegExp("node=" + row._doc + "&"), "node=" + row.image.id + "&");
            }

            return _iconUri;
        }
    }));
});