
define(['util', 'vendor/underscore'], function(Util) {
  var Itemish;
  return Itemish = (function() {

    function Itemish(itemObject, id) {
      var action, actionType, key, value, _i, _j, _len, _len2, _ref, _ref2, _ref3;
      id || (id = _(itemObject).keys()[0]);
      _ref = itemObject[id] || itemObject;
      for (key in _ref) {
        value = _ref[key];
        this[key] = value;
      }
      this.name || (this.name = id);
      this.id = Util.toIdString(id);
      _ref2 = ["use"];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        actionType = _ref2[_i];
        if (typeof this[actionType] === "object") {
          action = this[actionType];
          _ref3 = _(action).keys();
          for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
            key = _ref3[_j];
            action[Util.toIdString(key)] = action[key];
          }
        }
      }
    }

    Itemish.all = function() {
      return console.log("Classy");
    };

    return Itemish;

  })();
});
