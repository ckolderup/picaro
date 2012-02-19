define(['jquery', 'item', 'inventory', 'vendor/underscore'], function($, Item, Inventory) {
  var Room = {
    all: [],

    init: function(startingRoom) {
      this.current = startingRoom
      var roomItems = Item.findByRoom(startingRoom)
      $(document).trigger('changeRoom', {
        room: startingRoom,
        items: roomItems
      });
    },

    findByName: function(name) {
      return _(this.all).find(function(room) { return room.name == name })
    },

    get: function(room, roomItems) {
      $("#move a").attr("href", "#");                                                //repopulate compass links
      $("#move li").addClass("disabled");

      for(var i in room.paths) {
        var direction = room.paths[i].Direction;
        if(direction === "North"){
          $("#move-compass-north a").attr("href", room.paths[i].Name);
          $("#move-compass-north, #move-compass-north a").removeClass("disabled");
        }
        else if(direction === "South") {
          $("#move-compass-south a").attr("href", room.paths[i].Name);
          $("#move-compass-south, #move-compass-south a").removeClass("disabled");
        }
        else if(direction === "East") {
          $("#move-compass-east a").attr("href", room.paths[i].Name);
          $("#move-compass-east, #move-compass-east a").removeClass("disabled");
        }
        else if(direction === "West") {
          $("#move-compass-west a").attr("href", room.paths[i].Name);
          $("#move-compass-west, #move-compass-west a").removeClass("disabled");
        }
      }
    }
  }

  $(document).bind("roomChanged", function(e, room) {
    console.log("yes i know i changed")
    // Room.current = room
  })

  // Event Bindings
  $(document).bind("roomReady", function(e, room) {
    var roomItems = _(Item.allById).filter(function(item, id) { return item.location === room.name})
    Room.get(room, roomItems)
  });

  return Room;
});