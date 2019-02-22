define(function (require, exports, module) {
    var $ = require("jquery");
    var url = "" + location.href;

    // only register this handler on the Content instances page
    if (url && -1 !== url.indexOf('/content/cna:showcase') || -1 !== url.indexOf('/documents/')) {
        document.addEventListener("load", function (evt) {
            // an image was loaded. if it looks like the preview image of a content instance then handle it
            var srcUrl = "" + evt.target.src;
            var matches = srcUrl.match(/preview\/([^?]+)\?repository=([^&]+)\&branch=([^&]+)\&node=([^&]+)\&/);

            if (matches && matches.length == 5) {
                // console.log("Node id = " + matches[4] + " srcUrl = " + srcUrl);
                // console.log("event.target.src " + JSON.stringify(evt.target.src));

                var nodeUrl = "/proxy/repositories/" + matches[2] + "/branches/" + matches[3] + "/nodes/query";
                var query = '{"_doc": "_ID_","_fields": {"image.id": 1}}'.replace("_ID_", matches[4]);
                
                // see if this is a cna:showcase icon preview request
                $.ajax({
                    type: "GET",
                    url: nodeUrl,
                    data: {
                        "query": query
                    },
                    context: evt.target
                }).done(function (data) {
                    if (data && data.rows && data.rows.length && data.rows.length > 0 && data.rows[0].image && data.rows[0].image.id) {
                        var targetEl = this;
                        try {
                            // attempt to replace the icon preview url with a url that refers to the node's image property
                            targetEl.src = "/proxy/repositories/_REPO_/branches/_BRANCH_/nodes/_NODE_/attachments/default".replace("_REPO_", matches[2]).replace("_BRANCH_", matches[3]).replace("_NODE_", data.rows[0].image.id);
                        } finally {}                        
                    }
                });
            }
        }, true);
    }
});