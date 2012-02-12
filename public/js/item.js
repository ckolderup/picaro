define(["jquery", "util", "inventory", "action_guard", "vendor/underscore"], function($, Util, Inventory, ActionGuard) {
  var Item = {
    allById: {},

    take: function(item) {
      Inventory.add(item);
      $(document).trigger('itemTaken', item)
      $(document).trigger('closeMenu');
      if (item.take.after) $(document).trigger('gameEvent', item.take)
    },

    tryToTake: function(item) {
      if (this.canTake(item)) {
        this.take(item)
      } else {
        this.willNotTake(item)
      }
    },

    takeConditions: {
      itemInInventory: function(otherItem) {
        return _.find(Inventory.list(), function(item) {return item.name == otherItem})
      }
    },

    canTake: function(item) {
      if (item.take == true) {
        return true
      } else if (item.take && item.take.actionGuard) {
        return ActionGuard.test(item.take)
      } else {
        return false
      }
    },

    willNotTake: function(item) {
      var message = "You can't take the " + item.name + ". ";
      if (item.take && item.take.cannotTakeMessage) {
        message += item.take.cannotTakeMessage
      }
      $(document).trigger("updateStatus", message);
    },

    immediateTake: function(gameEvent) {
      var item = Item.allById[gameEvent.item]
      Item.take(item)
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

  $(document).bind("clickActionTake", function(e, o) {
    Item.tryToTake(o)
  })

  $(document).bind("immediateTake", function(e, o) {
    Item.immediateTake(o)
  })

  return Item;
});