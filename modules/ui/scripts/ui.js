define(function(require, exports, module) {
    var $ = require("jquery");

    // use larger image previews
    document.addEventListener("load", function(ev) {
        var s = "" + ev.target.src;
        if (s && -1 !== s.indexOf('/preview/') && -1 !== s.indexOf('size=64')) {
            s = s.replace("name=icon64", "name=icon160");
            s = s.replace("size=64", "size=160");
            s = s.replace("mimetype=image/png", "mimetype=image/jpeg");
            ev.target.src = s;
        }
    }, true);

});