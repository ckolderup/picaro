define(["jquery", "util", "inventory", "vendor/underscore"], function($, Util, Inventory) {
  var Item = {
    allById: {},

    takeConditions: {
      itemInInventory: function(otherItem) {
        return _.find(Inventory.list(), function(item) {return item.name == otherItem})
      }
    },

    canTake: function(item) {
      if (item.take && typeof item.take == 'object') {
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
        console.log("ultimate else")
        return item.take;
      }
    },

    cannotTake: function(item) {
      var message = "You can't take the " + item.name + ". ";
      if (item.take && item.take.cannotTakeMessage) {
        message += item.take.cannotTakeMessage
      }
      $(document).trigger("updateStatus", message);
    },

    take: function(item) {
      Inventory.add(item);
      $(document).trigger('itemTaken', item)
      $(document).trigger('closeMenu')
      if (item.take.after) {
        $(document).trigger('gameEvent', item.take)
      }
    },

    // This is non-commutative right now- item1 is used ON item2, which is expecting item1 to be used on it.
    use: function(itemId1, itemId2) {
      item1 = this.allById[itemId1];
      item2 = this.allById[itemId2];

      if (item1 && item2 && item2.use[item1.id]) {
        var using = item2.use[item1.id];
        $(document).trigger('gameEvent', using)
      } else {
        console.log("you can't use this on that.", item1, item2)
      }
    }

  };

  return Item;
});