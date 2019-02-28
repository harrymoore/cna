define(function(require, exports, module) {
    var Ratchet = require("ratchet/web");
    var TemplateHelperFactory = require("template-helper");
    require("//code.jquery.com/ui/1.12.1/jquery-ui.js");

    var ContentInstancesGadget = require("oneteam/modules/app/gadgets/project/content/content-instances.js");

    return Ratchet.GadgetRegistry.register("cna-content-instances", ContentInstancesGadget.extend({

        // getDefaultSortField: function(model)
        // {
        //     return "sequence";
        // },

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
        // applyDynamicConfiguration: function(model)
        // {
        //     var self = this;
            
        //     this.base(model);

        //     var sortSelectorGroupFields = model["selectorGroups"]["sort-selector-group"]["fields"];
        //     sortSelectorGroupFields.unshift({
        //         "key": "sequence",
        //         "title": "Sequence",
        //         "field": "sequence"
        //     });
        // },


        // beforeSwap: function(el, model, callback)
        // {
        //     var self = this;

        //     this.base(el, model, function() {
        //         callback();
        //     });
        // },

        // afterSwap: function(el, model, originalContext, callback)
        // {
        //     var self = this;
        //     this.thisModel = model;
            
        //     this.base(el, model, originalContext, function() {

        //         // drag and drop (jquery ui sortable)
        //         $(el).find('.dataTable > tbody').sortable({
        //             update: function (event, ui) {
        //                 console.log("Items re-sorted");
    
        //                 $(event.target.children).each(function (index, item) {
        //                     console.log(index + " " + (item.id || "") + " " + (item.sequence || ""));
        //                 });
    
        //                 var nodeIds = [];
        //                 $(event.target.children).map(function () {
        //                     nodeIds.push(this.id);
        //                 });
    
        //                 // find the content-instances gadget
        //                 var gadget = Ratchet.Instances[$('div .gadget.content-instances').attr("ratchet")];
        //                 var branch = gadget.observable("branch").get();
        //                 var sortDirection = gadget.observable("sortDirection").get();
    
        //                 Chain(branch).queryNodes({
        //                     _doc: {
        //                         "$in": nodeIds
        //                     },
        //                     _fields: {
        //                         sequence: 1,
        //                         title: 1,
        //                         isActive: 1
        //                     }
        //                 // }, {
        //                 //     sort: {
        //                 //         sequence: 1
        //                 //     }
        //                 }).then(function () {
        //                     var result = this;
        //                     var nodes = result.asArray();
        //                     console.log("nodes: " + JSON.stringify(nodes, null, 4));
    
        //                     var patches = [];
        //                     for (var i = 0; i < nodeIds.length; i++) {
        //                         var sequence = 1+i;
        //                         var node = result[nodeIds[i]];
        //                         // if (node.isActive && node.isActive === "no") {
        //                         //     // skip inactive nodes
        //                         //     continue;
        //                         // }
    
        //                         if (!Gitana.isEmpty(node.sequence) && node.sequence == sequence) {
        //                             // skip nodes whos order has not changed
        //                             continue;
        //                         }
    
        //                         if (node.sequence !== sequence) {
        //                             // this node needs a new sequence. patch it.
        //                             patches.push({
        //                                 node: node,
        //                                 patch: {
        //                                     op: Gitana.isEmpty(node.sequence) ? "add" : "replace",
        //                                     path: "/sequence",
        //                                     value: sequence
        //                                 }
        //                             });
        //                         }
        //                     }
    
        //                     // run any patches
        //                     console.log("patches: " + JSON.stringify(patches, null, 4));
        //                     async.each(patches, function(patch, callback) {
        //                         Chain(patch.node).patch([patch.patch]).then(callback);        
        //                     }, function(err) {
        //                         // completed pathes
        //                         console.log("patches completed");
        //                         gadget.trigger("global_refresh");
        //                     });
        //                 });
        //             }
        //         });
    
        //         callback();
        //     });
        // }

        // doGitanaQuery: function(context, model, searchTerm, query, pagination, callback)
        // {
        //     var self = this;

        //     pagination.paths = true;

        //     if (pagination.limit == 10) {
        //         pagination.limit = 25;
        //     }                                                                                                 

        //     var project = self.observable("project").get();

        //     if (OneTeam.isEmptyOrNonExistent(query) && searchTerm)
        //     {
        //         query = OneTeam.searchQuery(searchTerm, ["title", "description"]);
        //     }

        //     if (!query)
        //     {
        //         query = {};
        //     }

        //     OneTeam.projectBranch(self, function() {

        //         // selected content type
        //         var selectedContentTypeDescriptor = self.observable("selected-content-type").get();
        //         if (!selectedContentTypeDescriptor)
        //         {
        //             // produce an empty node map
        //             return callback(new Gitana.NodeMap(this));
        //         }

        //         query._type = selectedContentTypeDescriptor.definition.getQName();

        //         // if (self.selectedLocale) {
        //         //     query["_features.f:translation.locale"] = self.selectedLocale;
        //         // }

        //         this.queryNodes(query, pagination).then(function() {
        //             callback(this);
        //         });
        //     });
        // },

    }));

});