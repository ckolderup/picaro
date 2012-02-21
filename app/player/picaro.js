(function() {
  require(["jquery", "util", "room", "inventory", "item", "ui", "game_event", "action_guard", "vendor/underscore"], function($, Util, Room, Inventory, Item, UI, GameEvent, ActionGuard) {
    return $(document).ready(function() {
      var gameItems, startingRoom, uuid;
      startingRoom = void 0;
      gameItems = {};
      uuid = 0;
      $.ajax({
        url: "/../game_data/" + gameId + ".json",
        dataType: "json",
        async: false,
        success: function(data) {
          var i, item, k, room;
          $("title").html(data.gameName);
          for (i in data.rooms) {
            room = data.rooms[i];
            if (room.starter) {
              startingRoom = room;
            }
            Room.all.push(room);
            for (k in room.items) {
              item = room.items[k];
              if (!item.id) {
                item.id = uuid++;
              }
              item.location = room.name;
              gameItems[item.id] = item;
            }
          }
          _.each(data.events, function(gameEvent) {
            return GameEvent.allById[gameEvent.id] = gameEvent;
          });
          return _.each(data.actionGuards, function(actionGuard) {
            return ActionGuard.allById[actionGuard.id] = actionGuard;
          });
        },
        error: function(e) {
          return window.alert("Yikes! Picaro couldn't find or parse the game JSON.", e);
        }
      });
      Item.init(gameItems);
      Room.init(startingRoom);
      return UI.init();
    });
  });
}).call(this);
