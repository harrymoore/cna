define(function (require, exports, module) {
    var $ = require("jquery");

    $("body").on("cloudcms-ready", function () {
        // cloud cms ui widgets done loading
        require([
            "//cdn.jsdelivr.net/npm/async@2.6.2/dist/async.min.js", 
            "jquery",
            "//code.jquery.com/ui/1.12.1/jquery-ui.js"
        ], function (async, $) {
            $('.dataTable > tbody').sortable({
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
        });
    });
});