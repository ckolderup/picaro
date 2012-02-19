define(["jquery", "item", "inventory", "room", "vendor/underscore"], function($, Item, Inventory, Room) {
  var GameEvent = {
    allById: {},

    takeItem: function(gameEvent) {
      $(document).trigger("updateStatus", gameEvent.message)
      $(document).trigger("immediateTake", gameEvent)
    },

    dropItem: function(gameEvent) {
      $(document).trigger("updateStatus", gameEvent.message)
      Inventory.remove(gameEvent.item)
      gameEvent.item.location = Room.current.name
      $(document).trigger('resetMenus')
    },

    instantVictory: function(gameEvent) {
      $(document).trigger("updateStatus", gameEvent.message)
    },

    replaceItems: function(gameEvent) {
      var newItem = gameEvent.newItem
      var oldItemsWereInInventory

      _(gameEvent.items).each(function(item, index) {
        if (Inventory.remove(item)) {
          oldItemsWereInInventory = true
        }

        if (Item.allById[item]) {
          delete Item.allById[item]
        }
      })

      // ugh, this sucks. the event system shouldn't be managing items in rooms & inventory like this
      newItem.location = Room.current.name
      Item.allById[newItem.id] = newItem
      if (oldItemsWereInInventory) Inventory.add(newItem);
      $(document).trigger('resetMenus')
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