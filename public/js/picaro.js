require([
  "jquery",
  "util",
  "room",
  "inventory",
  "item",
  "ui",
  'game_event',
  'action_guard',
  "vendor/underscore"
], function($, Util, Room, Inventory, Item, UI, GameEvent, ActionGuard) {

  $(document).ready(function() {
    var counters = [];
    var startingRoomm;
    var gameItems = {};

    $(document).bind("updateStatus", function(event, message) {
      UI.newStatusMessage(message);
    })

    function counterObject (name, min, max, val) {
      this.name = name;
      this.min = min;
      this.max = max;
      this.val = val;
    }

    var uuid = 0;
    $.ajax({
      url: '/../game_data/' + gameId + '.json',
      dataType: 'json',
      async: false,
      success: function(data) {
        $("title").html(data.gameName);

        for(var i in data.rooms) {
          var room = data.rooms[i];
          if (room.starter) startingRoom = room;
          Room.all.push(room);

          for(var k in room.items) {
            var item = room.items[k]

            if (!item.id) {
              item.id = uuid++
            }
            item.location = room.name
            gameItems[item.id] = item;
          }
        }

        for(var j in data.Counters){
          var counterName = data.Counters[j].Name.replace(/ /g,'');
          var counterMin = data.Counters[j].Min;
          var counterMax = data.Counters[j].Max;
          var counterVal = data.Counters[j].Val;
          counters.push(new counterObject(counterName, counterMin, counterMax, counterVal));
        }

        _.each(data.events, function(gameEvent) {
          GameEvent.allById[gameEvent.id] = gameEvent
        });

        _.each(data.actionGuards, function(actionGuard) {
          ActionGuard.allById[actionGuard.id] = actionGuard
        });

      },
      error: function(e) {
        window.alert("Yikes! Picaro couldn't find or parse the game JSON.", e)
      }
    });
    // end json get

    Item.init(gameItems)
    Room.init(startingRoom)
    UI.init()
  });
});