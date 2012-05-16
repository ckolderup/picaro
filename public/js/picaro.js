
require(["jquery", "game", "util", "room", "inventory", "item", "ui", "game_event", "action_guard", "vendor/underscore"], function($, Game, Util, Room, Inventory, Item, UI, GameEvent, ActionGuard) {
  return $(document).ready(function() {
    var data, id, item, room, startingRoom, _ref, _ref2;
    if (typeof window.game_source !== 'object') {
      window.alert("Yikes! Picaro couldn't find or parse the game data.");
    }
    data = window.game_source;
    startingRoom = void 0;
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
    Game.init(data);
    return UI.init(data.gameName);
  });
});
