(function() {
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
          direction = room.paths[i].direction;
          _results.push(direction === "North" ? ($("#move-compass-north a").attr("href", room.paths[i].name), $("#move-compass-north, #move-compass-north a").removeClass("disabled")) : direction === "South" ? ($("#move-compass-south a").attr("href", room.paths[i].name), $("#move-compass-south, #move-compass-south a").removeClass("disabled")) : direction === "East" ? ($("#move-compass-east a").attr("href", room.paths[i].name), $("#move-compass-east, #move-compass-east a").removeClass("disabled")) : direction === "West" ? ($("#move-compass-west a").attr("href", room.paths[i].name), $("#move-compass-west, #move-compass-west a").removeClass("disabled")) : void 0);
        }
        return _results;
      }
    };
    $(document).bind("roomChanged", function(e, room) {
      return console.log("yes i know i changed", arguments);
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
}).call(this);
