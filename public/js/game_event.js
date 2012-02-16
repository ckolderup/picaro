define(["jquery", "item", "inventory", "vendor/underscore"], function($, Item, Inventory) {
  var GameEvent = {
    allById: {},

    takeItem : function(gameEvent) {
      $(document).trigger("updateStatus", gameEvent.message);
      $(document).trigger("immediateTake", gameEvent)
    },

    instantVictory: function(gameEvent) {
      $(document).trigger("updateStatus", gameEvent.message);
    },

    replaceItems: function(gameEvent) {
      var newItem = gameEvent.newItem

      _(gameEvent.items).each(function(item, index) {
        if (Inventory.remove(item)) {
          Inventory.add(newItem)
        }

        if (Item.allById[item]) {
          delete Item.allById[item]
        }
      })

      Item.allById[newItem.id] = newItem
      $(document).trigger('renderMenus', Inventory.list())
    }
  }

  // Event binding
  $(document).bind('gameEvent', function(e, using) {
    var afterEvent = GameEvent.allById[using['after']];
    if (afterEvent) {
      GameEvent[afterEvent.type](afterEvent)
    }
  })

  return GameEvent
})