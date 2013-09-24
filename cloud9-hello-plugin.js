define(function(require, exports, module) {

var ext = require("core/ext");
var multiselect = require("ace/multi_select")
var Editor = require("ace/editor").Editor

var Search = require("ace/search").Search;
var search = new Search();

function find(session, needle, dir) {
    search.$options.wrap = true;
    search.$options.needle = needle;
    search.$options.backwards = dir == -1;
    return search.find(session);
}

module.exports = ext.register("ext/helloplugin/helloplugin", {
    name    : "cloud9-hello-plugin",
    dev     : "Ajax.org",
    type    : ext.GENERAL,
    deps    : [],
    nodes   : [],
    alone   : true,

    hook : function() {
        Editor.prototype.selectMore = function (dir, skip) {
            var session = this.session;
            var sel = session.multiSelect;

            var range = sel.toOrientedRange();
            if (range.isEmpty()) {
                var range = session.getWordRange(range.start.row, range.start.column);
                range.cursor = range.end;
                this.multiSelect.addRange(range);
                return;
            }
            var needle = session.getTextRange(range);

            var newRange = find(session, needle, dir);
            if (newRange) {
                newRange.cursor = dir == -1 ? newRange.start : newRange.end;
                this.multiSelect.addRange(newRange);
            }
            if (skip)
                this.multiSelect.substractPoint(range.cursor);
        }
    },

    enable: function () {},

    disable: function () {}
});

});
