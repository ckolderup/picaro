
define(["jquery", "item", "inventory", "room", "util", "vendor/underscore"], function($, Item, Inventory, Room, Util) {
  var GameEvent;
  GameEvent = {
    init: function(events) {
      var event, _i, _len, _results;
      if (events) {
        _results = [];
        for (_i = 0, _len = events.length; _i < _len; _i++) {
          event = events[_i];
          _results.push(this.allById[event.id] = event);
        }
        return _results;
      }
    },
    allById: {},
    updateStatus: function(gameEvent) {},
    takeItem: function(gameEvent) {
      return $(document).trigger("immediateTake", gameEvent);
    },
    dropItem: function(gameEvent) {
      Inventory.remove(gameEvent.item);
      gameEvent.item.location = Room.current.name;
      return $(document).trigger("resetMenus");
    },
    removeItem: function(gameEvent) {
      Inventory.remove(gameEvent.item);
      Item.allById[gameEvent.item].location = void 0;
      return $(document).trigger("resetMenus");
    },
    updateAttribute: function(gameEvent) {
      Item.allById[gameEvent.item][gameEvent.attribute] = gameEvent.newValue;
      return $(document).trigger("resetMenus");
    },
    instantVictory: function(gameEvent) {
      return $(document).trigger("A winner is you!");
    },
    replaceItems: function(gameEvent) {
      var newItem, oldItemsWereInInventory;
      oldItemsWereInInventory = false;
      _(gameEvent.items).each(function(itemId, index) {
        var id;
        id = Util.toIdString(itemId);
        if (Inventory.remove(id)) oldItemsWereInInventory = true;
        if (Item.allById[id]) return delete Item.allById[id];
      });
      newItem = new Item(gameEvent.newItem);
      newItem.location = Room.current.id;
      Item.allById[newItem.id] = newItem;
      if (oldItemsWereInInventory) Inventory.add(newItem);
      return $(document).trigger("resetMenus");
    }
  };
  $(document).bind("gameEvent", function(e, action) {
    var afterEvent;
    if (afterEvent = GameEvent.allById[action["after"]]) {
      if (afterEvent.message) {
        $(document).trigger("updateStatus", afterEvent.message);
      }
      return GameEvent[afterEvent.type](afterEvent);
    }
  });
  return GameEvent;
});
