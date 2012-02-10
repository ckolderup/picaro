define(['jquery', 'item', 'inventory', 'vendor/underscore'], function($, Item, Inventory) {
  var Room = {};
  Room.all = [];

  Room.changeToRoomName = function(roomName) {
    var room = _.find(this.all, function(room) { return room.name === roomName })
    this.get(room, Item.all)
  }

  Room.get = function(room, itemStatuses) {
    $("ul").not("#footer ul").not("#move-compass ul").each(function() {                  // clear out all the room-specific lists
      $(this).empty();
    });

    var names = [];
    var roomItems = [];                                                                  // create array of items in the current room
    for(var i in itemStatuses) {
      if(itemStatuses[i].location === room.name) {
        roomItems.push(itemStatuses[i]);
        names.push(itemStatuses[i].name);
      }
    }

    var roomDescription = room.description;

    $("#header h2").html(room.name);
    $(document).trigger("updateStatus", roomDescription + "<br/ ><br/>You see " + util.toArrayToSentence(names));

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

    _.each(Inventory.list(), function(item) {
      $("#action-use ul").append("<li><a href='#' class='item data-action-id='" + util.actionId(item, 'use') + "'>" + item.name + " <small> (held) </small></a></li>");
      $("#action-look ul").append("<li><a href='#' class='item' data-action-id='" + util.actionId(item, 'take') + "'>" + item.name + " <small> (held) </small></a></li>");
    });

    _.each(_.difference(roomItems, Inventory.list()), function(item) {
      $("#action-take ul").append("<li><a href='#' class='item' data-action-id='" + util.actionId(item, 'take') + "'>" + item.name + "</a></li>");
      $("#action-use ul").append("<li><a href='#' class='item' data-item-id='" + item.id +"' data-action-id='" + util.actionId(item, 'use') + "'>" + item.name + "</a></li>");
      $("#action-look ul").append("<li><a href='#' class='item' data-action-id='" + util.actionId(item, 'look') + "'>" + item.name + "</a></li>");
    });

    for (var i in roomItems) {

      var item = roomItems[i];

      if(item.talk) {
        $("#action-talk ul").append("<li><a href='#' class='item' data-action-id='" + util.actionId(item, 'take') + "'>" + item.name + "</a></li>");
      }

      if(item.attack) {
        $("#action-attack ul").append("<li><a href='#' class='item' data-action-id='" + util.actionId(item, 'take') + "'>" + item.name + "</a></li>");
      }

    }

  }
  return Room;
});