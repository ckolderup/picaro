define(["jquery", "util", "inventory", "vendor/underscore"], function($, Util, Inventory) {
  var Item = {
    takeConditions: {
      itemInInventory: function(otherItem) {
        return _.find(Inventory.list(), function(item) {return item.name == otherItem})
      }
    },

    canTake: function(item) {
      if (typeof item.take == 'object') {
        var condition = item.take.condition && _.keys(item.take.condition)[0]
        if (condition && _.include(_.keys(this.takeConditions), condition)) {
          if (this.takeConditions[condition](item.take.condition[condition])) {
            return true
          } else {
            return false
          }
        } else {
          console.log("No take conditions found for " + item.name + ", please pass a boolean or conditions object");
          return false
        }
      } else {
        return item.take;
      }
    },

    cannotTake: function(item) {
      var message = "You can't take the " + item.name + ". ";
      if (item.take.cannotTakeMessage) {
        message += item.take.cannotTakeMessage
      }
      $(document).trigger("updateStatus", message);
    },

    take: function(item) {
      Inventory.add(item);
      if (item.after) {
        console.log(item.after)
        // console.log()
      }

      $(document).trigger("updateStatus", "You take the " + item.name + ".");
      $("a[data-action-id='" + util.actionId(item, 'take') + "']" ).remove();
      $("#action-use ul").append("<li><a href='#' class='item'>" + item.name + " <small>(held)</small></a></li>");
      $("#action-look ul li a:contains(" + item.name + ")").append(" <small>(held)</small>");
    }

  };

  return Item;
});