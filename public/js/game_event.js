
define(["jquery", "item", "inventory", "room", "vendor/underscore"], function($, Item, Inventory, Room) {
  var GameEvent;
  GameEvent = {
    allById: {},
    init: function(events) {
      return _.each(events, function(event) {
        return this.allById[gameEvent.id] = event;
      });
    },
    takeItem: function(gameEvent) {
      $(document).trigger("updateStatus", gameEvent.message);
      return $(document).trigger("immediateTake", gameEvent);
    },
    dropItem: function(gameEvent) {
      $(document).trigger("updateStatus", gameEvent.message);
      Inventory.remove(gameEvent.item);
      gameEvent.item.location = Room.current.name;
      return $(document).trigger("resetMenus");
    },
    instantVictory: function(gameEvent) {
      return $(document).trigger("updateStatus", gameEvent.message);
    },
    replaceItems: function(gameEvent) {
      var newItem, oldItemsWereInInventory;
      oldItemsWereInInventory = false;
      _(gameEvent.items).each(function(itemId, index) {
        if (Inventory.remove(itemId)) oldItemsWereInInventory = true;
        if (Item.allById[itemId]) return delete Item.allById[itemId];
      });
      newItem = gameEvent.newItem;
      newItem.location = Room.current.name;
      Item.allById[newItem.id] = newItem;
      if (oldItemsWereInInventory) Inventory.add(newItem);
      return $(document).trigger("resetMenus");
    }
  };
  $(document).bind("gameEvent", function(e, using) {
    var afterEvent;
    afterEvent = GameEvent.allById[using["after"]];
    if (afterEvent) return GameEvent[afterEvent.type](afterEvent);
  });
  return GameEvent;
});
