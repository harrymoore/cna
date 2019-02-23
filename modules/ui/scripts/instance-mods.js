define(function (require, exports, module) {
    var $ = require("jquery");

    $("body").on("cloudcms-ready", function () {
        // cloud cms ui widgets done loading
        require(["jquery", "//code.jquery.com/ui/1.12.1/jquery-ui.js"], function ($) {
            $('.dataTable > tbody').sortable({
                update: function (event, ui) {
                    console.log("Items re-sorted");
                    // console.log(JSON.stringify(event,null,4));
                    // console.log(JSON.stringify(ui.item, null, 4));
                    // console.log(JSON.stringify(ui.offset, null, 4));
                    // console.log(JSON.stringify(ui.position, null, 4));
                    // console.log(JSON.stringify(ui.originalPosition, null, 4));
                    // console.log(JSON.stringify(ui.sender, null, 4));
                    // console.log(JSON.stringify(ui.placeholder, null, 4));

                    $(event.target.children).each(function (index, item) {
                        console.log(index + " " + (item.id || "") + " " + (item.sequence || ""));
                    });

                    var nodeIds = [];
                    $(event.target.children).map(function () {
                        nodeIds.push(this.id);
                    });

                    // find the content-instances gadget
                    var gadget = Ratchet.Instances[$('div .gadget.content-instances').attr("ratchet")];
                    // var repo = gadget.observable("repository").get()._doc;
                    var branch = gadget.observable("branch").get();

                    Chain(branch).queryNodes({
                        _doc: {
                            "$in": nodeIds
                        },
                        _fields: {
                            sequence: 1,
                            title: 1
                        }
                    },{
                        sort: sequence
                    }).then(function(){
                        var nodes = this.asArray();
                        // console.log("nodes: " + JSON.stringify(this.asArray(), null, 4));
                        console.log("nodes: " + JSON.stringify(nodes, null, 4));
                        // console.log("nodes");
                    });

                    // var url = window.origin + "/proxy/repositories/" +repo + "/branches/" +branch + "/nodes/query";

                    // // read the nodes to see which ones need sequence updated
                    // $.ajax({
                    //     global: false,
                    //     type: "GET",
                    //     url: url,
                    //     data: query,
                    //     context: event
                    // }).done(function (data) {
                    //     if (data) {
                    //         var event = this;
                    //         console.log(JSON.stringify(data, null, 4));
                    //     }
                    // });
                }
            });
        });
    });
});