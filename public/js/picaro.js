require(["jquery", "util", "room", "inventory", "item", "ui", 'game_event', "vendor/underscore"], function($, Util, Room, Inventory, Item, UI, GameEvent) {

  $(document).ready(function() {
    var gameMeta;
    var itemStatuses = [];
    var counters = [];
    var rooms = [];
    var gameItems = _({});

    // $(document).trigger('roomChanged', _.find(rooms, function(room) {return room.starter}).name) //initialize room that's flagged as 'starter'


    $(document).bind("updateStatus", function(event, status) {
      $("p.new:first ").removeClass("new").addClass("old");
      var n = $("p.old").length;
      if (n > 5) {
        $("p.old:first").remove();
      }
      $("#game").append("<p class='new'>" + status + "</p>");
    })

    $(document).bind("roomChanged", function(e, roomName) {
      console.log('roomChanged')
      Room.changeToRoomName(roomName);
    });

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

        for(var i in data.Rooms) {
          var roomName = data.Rooms[i].Name;
          var roomDescription = data.Rooms[i].Description;
          var paths = data.Rooms[i].Paths;
          if(data.Rooms[i].Starter){
            var starter = data.Rooms[i].Starter;
          }
          else {
            var starter = false;
          }
          var room = new roomObject(roomName, roomDescription, paths, starter);
          rooms.push(room);
          Room.all.push(room);

          for(var k in data.Rooms[i].Items) {
            var id = data.Rooms[i].Items[k].Id;
            var lookResults = data.Rooms[i].Items[k].Look;
            var takeResult = data.Rooms[i].Items[k].Take;
            var useResults = data.Rooms[i].Items[k].Use;
            var talkResults = data.Rooms[i].Items[k].Talk;
            var attackResults = data.Rooms[i].Items[k].Attack;
            var itemName = data.Rooms[i].Items[k].Name;
            var itemLocation = roomName;

            var item = new itemObject(id, itemName, itemLocation, lookResults, talkResults, attackResults, takeResult, useResults);
            itemStatuses.push(item);
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

      },
      error: function() {
        console.log("Error getting game JSON", arguments)
      }
    });                                                                                            // end json get

    //END PREP CODE, INITIALIZE GAME

    for(var i in rooms) {
      if(rooms[i].starter === true) {                                             //initialize room that's flagged as 'starter'
        Room.get(rooms[i], itemStatuses);
      }
    }

    Item.all = itemStatuses;
    Item.allById = gameItems;
    UI.init();

  });
});