
require(["jquery", "util", "room", "inventory", "item", "ui", "game_event", "action_guard", "vendor/underscore"], function($, Util, Room, Inventory, Item, UI, GameEvent, ActionGuard) {
  return $(document).ready(function() {
    var gameItems, startingRoom;
    startingRoom = void 0;
    gameItems = {};
    return $.ajax({
      url: "/games/" + gameId,
      dataType: "json",
      async: false,
      success: function(data) {
        var id, item, room, _ref, _ref2;
        _ref = data.rooms;
        for (id in _ref) {
          room = _ref[id];
          room.id = Util.toIdString(id);
          room.name || (room.name = id);
          if (room.starter) startingRoom = room;
          Room.allById[room.id] = room;
          _(room.items).map(function(item, id) {
            return Item.create(item, {
              id: id,
              location: room.id
            });
          });
        }
        _ref2 = data.unattachedItems;
        for (id in _ref2) {
          item = _ref2[id];
          Item.create(item, {
            id: id
          });
        }
        GameEvent.init(data.events);
        ActionGuard.init(data.actionGuards);
        Room.init(startingRoom);
        return UI.init(data.gameName);
      },
      error: function(e) {
        return window.alert("Yikes! Picaro couldn't find or parse the game JSON.", e);
      }
    });
  });
});
