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
    var gameMeta;
    var counters = [];
    var rooms = [];
    var gameItems = {};

    $(document).bind("updateStatus", function(event, message) {
      UI.newStatusMessage(message);
    })

    function gameInfoObject (name, version, description) {
      this.name = name;
      this.version = version;
      this.description = description;
    }

    function itemObject (id, name, location, look, talk, attack, take, use) {
      this.id = id || uuid++;
      this.name = name;
      this.location = location;
      this.look = look;
      this.lookNum = 0;
      this.talk = talk;
      this.talkNum = 0;
      this.attack = attack;
      this.attackNum = 0;
      if(take) {
        this.take = take;
      }
      else {
        this.take = null;
      }
      if(use) {
        this.use = use;
      }
      else {
        this.use = null;
      }
    }

    function roomObject (name, description, paths, starter) {
      this.name = name;
      this.description = description;
      this.paths = paths;
      if(starter) {
        this.starter = true;
      }
    }

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

        gameMeta = new gameInfoObject(data.gameName, data.Version, data.gameDescription);

        //push all of the game data into arrays, making it as deliciously malleable as some once-hard ice cream that's been heated in the microwave for a few seconds

        for(var i in data.rooms) {
          var room = data.rooms[i];
          rooms = data.rooms;
          Room.all.push(room);

          for(var k in room.items) {
            var item = room.items[k]

            // var id = data.Rooms[i].Items[k].Id;
            // var lookResults = data.Rooms[i].Items[k].Look;
            // var takeResult = data.Rooms[i].Items[k].Take;
            // var useResults = data.Rooms[i].Items[k].Use;
            // var talkResults = data.Rooms[i].Items[k].Talk;
            // var attackResults = data.Rooms[i].Items[k].Attack;
            // var itemName = data.Rooms[i].Items[k].Name;
            // var itemLocation = roomName;

            // var item = new itemObject(id, itemName, itemLocation, lookResults, talkResults, attackResults, takeResult, useResults);
            if (!item.id) {
              item.id = uuid++
            }
            item.location = room.name
            console.log(item.id, item)

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

        _.each(data.Events, function(gameEvent) {
          GameEvent.allById[gameEvent.id] = gameEvent
        });

        _.each(data.ActionGuards, function(actionGuard) {
          ActionGuard.allById[actionGuard.Id] = actionGuard
        });

      },
      error: function(e) {
        window.alert("Yikes! Picaro couldn't find or parse the game JSON.", e)
      }
    });
    // end json get

    var startingRoom = _.find(rooms, function(room) { return room.starter })
debugger
    Item.init(gameItems)
    Room.init(startingRoom)
    UI.init()
  });
});