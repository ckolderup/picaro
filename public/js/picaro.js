
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
        var item, room, _i, _j, _len, _len2, _ref, _ref2;
        _ref = data.rooms;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          room = _ref[_i];
          if (room.starter) startingRoom = room;
          Room.all.push(room);
          _ref2 = room.items;
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            item = _ref2[_j];
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
