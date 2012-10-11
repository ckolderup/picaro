
define(["jquery", "item", "inventory", "util", "vendor/underscore"], function($, Item, Inventory, Util) {
  var Room;
  Room = {
    allById: {},
    construct: function(id, room) {
      room.name || (room.name = id);
      room.id = Util.toIdString(id);
      return Room.allById[room.id] = room;
    },
    init: function(startingRoom) {
      this.current = startingRoom;
      return $(document).trigger("changeRoom", {
        room: startingRoom,
        items: Item.findByRoom(this.current)
      });
    },
    starter: function() {
      return _(this.allById).find(function(room) {
        return room.starter === true;
      });
    },
    find: function(id) {
      return this.allById[id];
    },
    findByName: function(name) {
      return _(this.allById).find(function(room) {
        return room.name === name;
      });
    }
  };
  return Room;
});
