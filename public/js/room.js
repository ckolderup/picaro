
define(["jquery", "item", "inventory", "util", "vendor/underscore"], function($, Item, Inventory, Util) {
  var Room;
  Room = {
    allById: {},
    construct: function(id, room) {
      room.name || (room.name = id);
      debugger;
      room.id = Util.toIdString(id);
      return Room.allById[room.id] = room;
    },
    init: function(startingRoom) {
      var roomItems;
      this.current = startingRoom;
      roomItems = Item.findByRoom(startingRoom);
      return $(document).trigger("changeRoom", {
        room: startingRoom,
        items: roomItems
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
    },
    get: function(room, roomItems) {
      var direction, id, roomId, _ref, _results;
      $("#move a").attr("href", "#");
      $("#move li").addClass("disabled");
      _ref = room.paths;
      _results = [];
      for (direction in _ref) {
        roomId = _ref[direction];
        id = Util.toIdString(roomId);
        switch (direction) {
          case "North":
          case "N":
            $("#move-compass-north a").attr("href", id);
            _results.push($("#move-compass-north, #move-compass-north a").removeClass("disabled"));
            break;
          case "South":
          case "S":
            $("#move-compass-south a").attr("href", id);
            _results.push($("#move-compass-south, #move-compass-south a").removeClass("disabled"));
            break;
          case "East":
          case "E":
            $("#move-compass-east a").attr("href", id);
            _results.push($("#move-compass-east, #move-compass-east a").removeClass("disabled"));
            break;
          case "West":
          case "W":
            $("#move-compass-west a").attr("href", id);
            _results.push($("#move-compass-west, #move-compass-west a").removeClass("disabled"));
            break;
          default:
            _results.push(void 0);
        }
      }
      return _results;
    }
  };
  $(document).bind("roomReady", function(e, room) {
    var roomItems;
    roomItems = _(Item.find).filter(function(item, id) {
      return item.location === room.id;
    });
    return Room.get(room, roomItems);
  });
  return Room;
});
