
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
      var direction, i, _results;
      $("#move a").attr("href", "#");
      $("#move li").addClass("disabled");
      _results = [];
      for (i in room.paths) {
        direction = room.paths[i].Direction;
        if (direction === "North") {
          $("#move-compass-north a").attr("href", room.paths[i].name);
          _results.push($("#move-compass-north, #move-compass-north a").removeClass("disabled"));
        } else if (direction === "South") {
          $("#move-compass-south a").attr("href", room.paths[i].name);
          _results.push($("#move-compass-south, #move-compass-south a").removeClass("disabled"));
        } else if (direction === "East") {
          $("#move-compass-east a").attr("href", room.paths[i].name);
          _results.push($("#move-compass-east, #move-compass-east a").removeClass("disabled"));
        } else if (direction === "West") {
          $("#move-compass-west a").attr("href", room.paths[i].name);
          _results.push($("#move-compass-west, #move-compass-west a").removeClass("disabled"));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  };
  $(document).bind("roomChanged", function(e, room) {
    return console.log("yes i know i changed");
  });
  $(document).bind("roomReady", function(e, room) {
    var roomItems;
    roomItems = _(Item.allById).filter(function(item, id) {
      return item.location === room.name;
    });
    return Room.get(room, roomItems);
  });
  return Room;
});
