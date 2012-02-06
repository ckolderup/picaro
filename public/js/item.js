define(["jquery", "util", "inventory", "vendor/underscore"], function($, Util, Inventory) {
  var Item = {
    takeConditions: ['itemInInventory'],

    canTake: function(item) {
      var condition = item.take.condition && _.keys(item.take.condition)[0]
      if (condition && _.include(this.takeConditions, condition)) {
        console.log("Got here!", condition)
        return false
      } else {
        throw "No conditions found for " + item.name + ", please pass a boolean or conditions object"
      }
    }
  };

  return Item;
});