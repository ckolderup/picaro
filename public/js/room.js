define(["jquery", "item", "inventory", "util", "vendor/underscore"], function($, Item, Inventory, Util) {
  var Room;
  Room = {
    allById: {},
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
        _results.push((function() {
          switch (direction) {
            case "North":
            case "N":
              $("#move-compass-north a").attr("href", id);
              return $("#move-compass-north, #move-compass-north a").removeClass("disabled");
            case "South":
            case "S":
              $("#move-compass-south a").attr("href", id);
              return $("#move-compass-south, #move-compass-south a").removeClass("disabled");
            case "East":
            case "E":
              $("#move-compass-east a").attr("href", id);
              return $("#move-compass-east, #move-compass-east a").removeClass("disabled");
            case "West":
            case "W":
              $("#move-compass-west a").attr("href", id);
              return $("#move-compass-west, #move-compass-west a").removeClass("disabled");
          }
        })());
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