define(function (require, exports, module) {
    var $ = require("jquery");
    var url = "" + location.href;

    // only register this handler on the Content instances page
    if (url && -1 !== url.indexOf('/content/cna:showcase')) {
        document.addEventListener("load", function (evt) {
            // an image was loaded.
            // if it looks like the preview image of a content instance then handle it
            // http://localhost/preview/244853726?repository=127f0940f8f174c0b9ed&branch=285db7b759a4bfa4084a&node=4239867c07516c57dbe7&mimetype=image/jpeg&size=160&name=icon&attachment=default&fallback=http%3A%2F%2Flocalhost%2Foneteam%2Fmodules%2Fapp%2Fimages%2Fdoclib%2Fdocument-64.png
            var srcUrl = "" + evt.target.src;
            var matches = srcUrl.match(/preview\/([^?]+)\?repository=([^&]+)\&branch=([^&]+)\&node=([^&]+)\&/);

            if (matches && matches.length == 5 && -1 == srcUrl.indexOf('name=icon-cna')) {
                console.log("Node id = " + matches[4] + " srcUrl = " + srcUrl);
                console.log("event.target.src " + JSON.stringify(evt.target.src));

                var nodeUrl = "/proxy/repositories/" + matches[2] + "/branches/" + matches[3] + "/nodes/query";
                var query = '{"_doc": "_ID_","_fields": {"image.id": 1}}'.replace("_ID_", matches[4]);

                
                $.ajax({
                    type: "GET",
                    url: nodeUrl,
                    data: {
                        "query": query
                    },
                    context: evt.target
                    // dataType: "json",
                    // contentType: "application/json; charset=utf-8",
                }).done(function (data) {
                    var targetEl = this;
                    try {
                        // attempt to replace the icon preview url with a url that refers to the node's image property
                        // console.log("Data Loaded: " + JSON.stringify(data, null, 4));
                        // targetEl.src = "/preview/" + matches[1] + "?repository=" + matches[2] + "&branch=" + data.rows[0].image.id + "&node=" + matches[4] + "&mimetype=image/jpeg&size=160&name=icon-cna160&attachment=default&fallback=/oneteam/modules/app/images/doclib/document-64.png";
                        // targetEl.src = "/proxy/repositories/127f0940f8f174c0b9ed/branches/285db7b759a4bfa4084a/nodes/65f7e5094c9fe6b4827d/attachments/default";
                        targetEl.src = "/proxy/repositories/127f0940f8f174c0b9ed/branches/285db7b759a4bfa4084a/nodes/_NODE_/attachments/default".replace("_NODE_", matches[4]);
                        // targetEl.src = "/proxy/repositories/_REPO_/branches/_BRANCH_/nodes/_NODE_/attachments/default".replace("_REPO_", matches[2]).replace("_BRANCH_", matches[3]).replace("_NODE_", matches[4]);
                        // targetEl.src = "/proxy/repositories/_REPO_/branches/_BRANCH_/nodes/_NODE_/attachments/default".replace("_REPO_", matches[2]).replace("_BRANCH_", matches[3]).replace("_NODE_", matches[4]);
                    } finally {}
                // }).always(function (data, textStatus, err) {
                //     console.log("always: " + JSON.stringify(err, null, 4));
                });
            }
        }, true);
    }

});