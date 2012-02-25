
define(["jquery", "item", "inventory", "room", "vendor/underscore"], function($, Item, Inventory, Room) {
  var GameEvent;
  GameEvent = {
    init: function(events) {
      var event, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = events.length; _i < _len; _i++) {
        event = events[_i];
        _results.push(this.allById[gameEvent.id] = event);
      }
      return _results;
    },
    updateStatus: function(gameEvent) {
      return $(document).trigger("updateStatus", gameEvent.message);
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
    removeItem: function(gameEvent) {
      $(document).trigger("updateStatus", gameEvent.message);
      Inventory.remove(gameEvent.item);
      Item.allById[gameEvent.item].location = void 0;
      return $(document).trigger("resetMenus");
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
    },
    instantVictory: function(gameEvent) {
      return $(document).trigger("updateStatus", gameEvent.message);
    }
  };
  $(document).bind("gameEvent", function(e, action) {
    var afterEvent;
    if (afterEvent = GameEvent.allById[action["after"]]) {
      return GameEvent[afterEvent.type](afterEvent);
    }
  });
  return GameEvent;
});
