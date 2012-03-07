
require(["jquery", "util", "room", "inventory", "item", "ui", "game_event", "action_guard", "vendor/underscore"], function($, Util, Room, Inventory, Item, UI, GameEvent, ActionGuard) {
  return $(document).ready(function() {
    var gameItems, startingRoom, uuid;
    startingRoom = void 0;
    gameItems = {};
    uuid = 0;
    return $.ajax({
      url: "/games/" + gameId,
      dataType: "json",
      async: false,
      success: function(data) {
        var item, name, room, _i, _len, _ref, _ref2;
        _ref = data.rooms;
        for (name in _ref) {
          room = _ref[name];
          if (room.starter) startingRoom = room;
          room.name = name;
          Room.all[name] = room;
          _ref2 = room.items;
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            item = _ref2[_i];
            if (!item.id) item.id = uuid++;
            item.location = room.name;
            gameItems[item.id] = item;
          }
        }
        if (data.specialItems && data.specialItems.self) {
          gameItems.self = data.specialItems.self;
        }
        GameEvent.init(data.events);
        ActionGuard.init(data.actionGuards);
        Item.init(gameItems);
        Room.init(startingRoom);
        return UI.init(data.gameName);
      },
      error: function(e) {
        return window.alert("Yikes! Picaro couldn't find or parse the game JSON.", e);
      }
    });
  });
});
