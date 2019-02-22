define(function (require, exports, module) {
    var $ = require("jquery");

    $("body").on("cloudcms-ready", function () {
        // cloud cms ui widgets done loading
        require(["jquery", "//code.jquery.com/ui/1.12.1/jquery-ui.js"], function ($) {
            $('.dataTable > tbody').sortable({
                update: function (event, ui) {
                    console.log("Items restorted");
                    // console.log(JSON.stringify(event,null,4));
                    console.log(JSON.stringify(ui.item, null, 4));
                    console.log(JSON.stringify(ui.offset, null, 4));
                    console.log(JSON.stringify(ui.position, null, 4));
                    console.log(JSON.stringify(ui.originalPosition, null, 4));
                    console.log(JSON.stringify(ui.sender, null, 4));
                    console.log(JSON.stringify(ui.placeholder, null, 4));
                }
            });
        });
    });
});