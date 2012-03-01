
define(["jquery", "item", "inventory", "vendor/underscore"], function($, Item, Inventory) {
  var Room;
  Room = {
    all: [],
    init: function(startingRoom) {
      var roomItems;
      this.current = startingRoom;
      roomItems = Item.findByRoom(startingRoom);
      return $(document).trigger("changeRoom", {
        room: startingRoom,
        items: roomItems
      });
    },
    findByName: function(name) {
      return _(this.all).find(function(room) {
        return room.name === name;
      });
    },
    get: function(room, roomItems) {
      var direction, name, _ref, _results;
      $("#move a").attr("href", "#");
      $("#move li").addClass("disabled");
      _ref = room.paths;
      _results = [];
      for (direction in _ref) {
        name = _ref[direction];
        switch (direction) {
          case "North":
          case "N":
            $("#move-compass-north a").attr("href", name);
            _results.push($("#move-compass-north, #move-compass-north a").removeClass("disabled"));
            break;
          case "South":
          case "S":
            $("#move-compass-south a").attr("href", name);
            _results.push($("#move-compass-south, #move-compass-south a").removeClass("disabled"));
            break;
          case "East":
          case "E":
            $("#move-compass-east a").attr("href", name);
            _results.push($("#move-compass-east, #move-compass-east a").removeClass("disabled"));
            break;
          case "West":
          case "W":
            $("#move-compass-west a").attr("href", name);
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
    roomItems = _(Item.allById).filter(function(item, id) {
      return item.location === room.name;
    });
    return Room.get(room, roomItems);
  });
  return Room;
});
