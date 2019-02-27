define(function(require, exports, module) {
    // require("css!./content-instances.css");

    var Ratchet = require("ratchet/web");
    var DocList = require("ratchet/dynamic/doclist");
    var OneTeam = require("oneteam");
    var TemplateHelperFactory = require("template-helper");
    require("//code.jquery.com/ui/1.12.1/jquery-ui.js");

    var thisModel;

    return Ratchet.GadgetRegistry.register("content-instances", DocList.extend({

        configureDefault: function()
        {
            this.base();

            this.config({
                "observables": {
                    "query": "content-instances-list_query",
                    "sort": "content-instances-list_sort",
                    "sortDirection": "content-instances-list_sortDirection",
                    "searchTerm": "content-instances-list_searchTerm",
                    "selectedItems": "content-instances-list_selectedItems"
                }
            });
        },

        setup: function()
        {
            this.get("/projects/{projectId}/content", this.index);
            this.get("/projects/{projectId}/content/{qname}", this.index);
            this.get("/projects/{projectId}/content/{qname}/documents", this.index);
        },

        entityTypes: function()
        {
            return {
                "plural": "content instances",
                "singular": "content instance"
            }
        },

        getDefaultSortField: function(model)
        {
            return "sequence";
        },

        // prepareModel: function(el, model, callback)
        // {
        //     var self = this;

        //     this.base(el, model, function() {

        //         model.options.defaultSortDirection = 1;

        //         callback();

        //     });
        // },

        /**
         * Loads dynamic/configuration driven portions of the list into the model.
         *
         * @param model
         */
        applyDynamicConfiguration: function(model)
        {
            var self = this;
            
            var selectedContentType = this.observable("selected-content-type").get();

            // if (!model["selectorGroups"]) {
            //     model["selectorGroups"] = {};
            // }
            // if (!model["selectorGroups"]["sort-selector-group"])
            // {
            //     model["selectorGroups"]["sort-selector-group"] = {};
            // }
            // if (!model["selectorGroups"]["sort-selector-group"]["fields"])
            // {
            //     model["selectorGroups"]["sort-selector-group"]["fields"] = [];
            // }

            // model["selectorGroups"]["sort-selector-group"]["fields"] = [];

            var sortSelectorGroupFields = model["selectorGroups"]["sort-selector-group"]["fields"];
            sortSelectorGroupFields.unshift({
                "key": "sequence",
                "title": "Sequence",
                "field": "sequence"
            });
            // sortSelectorGroupFields.push({
            //     "key": "title",
            //     "title": "Title",
            //     "field": "title"
            // });

            // "content-instances-buttons"
            var buttons = OneTeam.configEvalArray(selectedContentType, "content-instances-buttons", self);
            if (buttons && buttons.length > 0)
            {
                for (var i = 0; i < buttons.length; i++)
                {
                    model.buttons.push(buttons[i]);
                }
            }

            // "content-instances-list-selected-actions"
            var selectedActions = OneTeam.configEvalArray(self, "content-instances-list-selected-actions", self);
            if (selectedActions && selectedActions.length > 0)
            {
                if (!model["selectorGroups"]) {
                    model["selectorGroups"] = {};
                }
                if (!model["selectorGroups"]["multi-documents-action-selector-group"])
                {
                    model["selectorGroups"]["multi-documents-action-selector-group"] = {};
                }
                if (!model["selectorGroups"]["multi-documents-action-selector-group"]["actions"])
                {
                    model["selectorGroups"]["multi-documents-action-selector-group"]["actions"] = [];
                }

                for (var i = 0; i < selectedActions.length; i++)
                {
                    model["selectorGroups"]["multi-documents-action-selector-group"]["actions"].push(selectedActions[i]);
                }
            }
        },

        prepareModel: function(el, model, callback)
        {
            var self = this;

            this.base(el, model, function() {

                model.options.defaultSortDirection = 1;

                TemplateHelperFactory.create(self, "content-instances", function(err, renderTemplate) {

                    model.renderTemplate = renderTemplate;

                    callback();
                });
            });
        },

        beforeSwap: function(el, model, callback)
        {
            var self = this;

            this.base(el, model, function() {

                // set up observables
                var refreshHandler = self.refreshHandler(el);

                // when the selected content type changes, we refresh
                self.subscribe("selected-content-type", refreshHandler);

                callback();

            });
        },

        checkPermission: function(observableHolder, permissionedId, permissionId, item)
        {
            var result = this.base(observableHolder, permissionedId, permissionId, item);

            // should we do a capabilities check?
            if (item.category === "capabilities-check")
            {
                result = false;

                var descriptor = observableHolder.observable("selected-content-type").get();
                if (descriptor && descriptor.capabilities)
                {
                    if (permissionId === "create_subobjects")
                    {
                        permissionId = "create";
                    }

                    result = descriptor.capabilities.contains(permissionId);
                }
            }

            return result;
        },

        afterSwap: function(el, model, originalContext, callback)
        {
            var self = this;
            this.thisModel = model;
            
            this.base(el, model, originalContext, function() {

                TemplateHelperFactory.afterRender(self, el);

                // hide create button if nothing selected
                var descriptor = self.observable("selected-content-type").get();
                if (!descriptor)
                {
                    $(".btn.list-button-create-content").hide();
                }

                // drag and drop (jquery ui sortable)
                $(el).find('.dataTable > tbody').sortable({
                    update: function (event, ui) {
                        console.log("Items re-sorted");
    
                        $(event.target.children).each(function (index, item) {
                            console.log(index + " " + (item.id || "") + " " + (item.sequence || ""));
                        });
    
                        var nodeIds = [];
                        $(event.target.children).map(function () {
                            nodeIds.push(this.id);
                        });
    
                        // find the content-instances gadget
                        var gadget = Ratchet.Instances[$('div .gadget.content-instances').attr("ratchet")];
                        var branch = gadget.observable("branch").get();
                        var sortDirection = gadget.observable("sortDirection").get();
    
                        Chain(branch).queryNodes({
                            _doc: {
                                "$in": nodeIds
                            },
                            _fields: {
                                sequence: 1,
                                title: 1,
                                isActive: 1
                            }
                        // }, {
                        //     sort: {
                        //         sequence: 1
                        //     }
                        }).then(function () {
                            var result = this;
                            var nodes = result.asArray();
                            console.log("nodes: " + JSON.stringify(nodes, null, 4));
    
                            var patches = [];
                            for (var i = 0; i < nodeIds.length; i++) {
                                var sequence = 1+i;
                                var node = result[nodeIds[i]];
                                // if (node.isActive && node.isActive === "no") {
                                //     // skip inactive nodes
                                //     continue;
                                // }
    
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
                            console.log("patches: " + JSON.stringify(patches, null, 4));
                            async.each(patches, function(patch, callback) {
                                Chain(patch.node).patch([patch.patch]).then(callback);        
                            }, function(err) {
                                // completed pathes
                                console.log("patches completed");
                                gadget.trigger("global_refresh");
                            });
                        });
                    }
                });
    
                callback();
            });
        },

        doGitanaQuery: function(context, model, searchTerm, query, pagination, callback)
        {
            var self = this;

            pagination.paths = true;

            if (pagination.limit == 10) {
                pagination.limit = 25;
            }                                                                                                 

            var project = self.observable("project").get();

            if (OneTeam.isEmptyOrNonExistent(query) && searchTerm)
            {
                query = OneTeam.searchQuery(searchTerm, ["title", "description"]);
            }

            if (!query)
            {
                query = {};
            }

            OneTeam.projectBranch(self, function() {

                // selected content type
                var selectedContentTypeDescriptor = self.observable("selected-content-type").get();
                if (!selectedContentTypeDescriptor)
                {
                    // produce an empty node map
                    return callback(new Gitana.NodeMap(this));
                }

                query._type = selectedContentTypeDescriptor.definition.getQName();

                // if (self.selectedLocale) {
                //     query["_features.f:translation.locale"] = self.selectedLocale;
                // }

                this.queryNodes(query, pagination).then(function() {
                    callback(this);
                });
            });
        },

        linkUri: function(row, model, context)
        {
            return OneTeam.linkUri(this, row);;
        },

        iconUri: function(row, model, context)
        {
            return OneTeam.iconUriForNode(row);
        },

        columnValue: function(row, item, model, context)
        {
            var self = this;

            var project = self.observable("project").get();

            var value = this.base(row, item, model, context);

            row.pagination = model.pagination;

            if (item.key === "titleDescription") {

                value = model.renderTemplate(row);
            }

            return value;
        },

        populateSingleDocumentActions: function(row, item, model, context, selectorGroup)
        {
            var self = this;

            var thing = Chain(row);

            // evaluate the config space against the current row so that per-row action buttons customize per document
            var itemActions = OneTeam.configEvalArray(thing, "content-instances-list-item-actions", self, null, null, true);

            if (itemActions && itemActions.length > 0)
            {
                for (var z = 0; z < itemActions.length; z++)
                {
                    selectorGroup.actions.push(itemActions[z]);
                }
            }

            // TODO: can't do this yet, need ACLs for every document?
            //selectorGroup.actions = self.filterAccessRights(self, thing, model.buttons);
        }

    }));

});