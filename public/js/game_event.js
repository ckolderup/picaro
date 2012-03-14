
define(["jquery", "game", "item", "inventory", "room", "util", "vendor/underscore"], function($, Game, Item, Inventory, Room, Util) {
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
      var item;
      item = Item.find(Util.toIdString(gameEvent.item));
      return $(document).trigger("immediateTake", item);
    },
    dropItem: function(gameEvent) {
      Inventory.remove(gameEvent.item);
      gameEvent.item.location = Room.current.name;
      return $(document).trigger("resetMenus");
    },
    removeItem: function(gameEvent) {
      Inventory.remove(gameEvent.item);
      Item.find(gameEvent.item).location = void 0;
      return $(document).trigger("resetMenus");
    },
    updateAttribute: function(gameEvent) {
      Item.find(gameEvent.item)[gameEvent.attribute] = gameEvent.newValue;
      return $(document).trigger("resetMenus");
    },
    endGame: function(gameEvent) {
      var gameAuthor, gameName;
      gameName = Game.current.name || "a mysteriously un-named Picaro Game";
      gameAuthor = Game.current.author || "Anonymous";
      if (Game.current.authorURL) {
        gameAuthor = "<a href='" + (encodeURI(Game.current.authorURL)) + "'>" + gameAuthor + "</a>";
      }
      return $(document).trigger("gameOver", "This has been " + gameName + ", by " + gameAuthor + ".");
    },
    replaceItems: function(gameEvent) {
      var newItem, oldItemsWereInInventory;
      oldItemsWereInInventory = false;
      _(gameEvent.items).each(function(itemId, index) {
        var id;
        id = Util.toIdString(itemId);
        if (Inventory.remove(id)) oldItemsWereInInventory = true;
        return Item.remove(id);
      });
      newItem = Item.create(gameEvent.newItem, {
        location: Room.current.id
      });
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
