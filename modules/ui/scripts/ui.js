define(function(require, exports, module) {
    var $ = require("jquery");

    // use larger image previews
    document.addEventListener("load", function(ev) {
        var s = "" + ev.target.src;
        if (s && -1 !== s.indexOf('.cloudcms.net/preview/') && -1 !== s.indexOf('size=64') && -1 === s.indexOf('&_replaced')) {
            s = s.replace("name=icon64", "name=iconcmh");
            s = s.replace("size=64", "size=250");
            s = s.replace("mimetype=image/png", "mimetype=image/jpeg");
            // s += "&force=true&_replaced=true";
            ev.target.src = s;
        }
    }, true);

});