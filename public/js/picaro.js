require(["jquery", "util", "room", "inventory", "item"], function($, Util, Room, Inventory, Item) {

  $(document).ready(function() {
    var gameMeta;
    var itemStatuses = [];
    var counters = [];
    var rooms = [];

    $(document).bind("updateStatus", function(event, status) {
      $("p.new:first ").removeClass("new").addClass("old");
      var n = $("p.old").length;
      if (n > 5) {
        $("p.old:first").remove();
      }
      $("#game").append("<p class='new'>" + status + "</p>");
    })

    function gameInfoObject (name, version, description) {
      this.name = name;
      this.version = version;
      this.description = description;
    }

    function itemObject (name, location, look, talk, attack, take, use) {
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

          rooms.push(new roomObject(roomName, roomDescription, paths, starter));
          for(var k in data.Rooms[i].Items) {
            var lookResults = data.Rooms[i].Items[k].Look;
            var takeResult = data.Rooms[i].Items[k].Take;
            var useResults = data.Rooms[i].Items[k].Use;
            var talkResults = data.Rooms[i].Items[k].Talk;
            var attackResults = data.Rooms[i].Items[k].Attack;
            var itemName = data.Rooms[i].Items[k].Name;
            var itemLocation = roomName;
            itemStatuses.push(new itemObject(itemName, itemLocation, lookResults, talkResults, attackResults, takeResult, useResults));
          }
        }

        for(var j in data.Counters){
          var counterName = data.Counters[j].Name.replace(/ /g,'');
          var counterMin = data.Counters[j].Min;
          var counterMax = data.Counters[j].Max;
          var counterVal = data.Counters[j].Val;
          counters.push(new counterObject(counterName, counterMin, counterMax, counterVal));
        }
      },
      error: function() {
        console.log("Error getting game JSON", arguments)
      }
    });                                                                                            // end json get

    //begin item/action function

    var itemAction = function(action, item) {

      for(var i in itemStatuses) {
        if(itemStatuses[i].name === item) {
          var itemData = itemStatuses[i];
          var key = i;
          break;
        }
      }

      var lookNum = itemData.lookNum;
      var talkNum = itemData.talkNum;
      var attackNum = itemData.attackNum;

      if(action === "Look") {
        $(document).trigger("updateStatus", itemData.look[lookNum]);
        if(itemStatuses[key].look.length > (itemStatuses[key].lookNum + 1)){
          itemStatuses[key].lookNum += 1;
        }
      }

      if(action === "Take") {
        if (Item.canTake(itemData)) {
          Item.take(itemData)
        } else {
          Item.cannotTake(itemData)
        };
      }

      if(action === "Talk") {
        $(document).trigger("updateStatus", itemData.talk[talkNum]);
        if(itemStatuses[key].talk.length > (itemStatuses[key].talkNum + 1)){
          itemStatuses[key].talkNum += 1;
        }
      }

      if(action === "Attack") {
        $(document).trigger("updateStatus", itemData.attack[attackNum]);
        if(itemStatuses[key].attack.length > (itemStatuses[key].attackNum + 1)){
          itemStatuses[key].attackNum += 1;
        }
      }

      if(action === "Use") {
        console.log("\"Ability to use things tk.\" - THE MANAGEMENT");
      }

    }

    //begin helper/display functions

    $(".ui-action ul li a").live('click', function() {                                              //set off user-triggered item/action events
      var that = $(this);
      var action = that.parent().parent().attr("id");
      var item = that.clone().find("small").remove().end().text().replace(/ /g,'');
      $(".ui-overlay, .ui-action").fadeOut();
      $(".active").removeClass("active");
      itemAction(action, item);
    })


    $("a.path:not(.disabled)").click(function() {                                                     //compass-controlling
      var roomName = $(this).attr("href");
      $("#move-preview .ul-modal-inner").html(roomName);
      for (var i in rooms) {
        if (roomName === rooms[i].name) {
          Room.get(rooms[i], itemStatuses);
        }
      }
    })


    //END PREP CODE, INITIALIZE GAME

    for(var i in rooms) {
      if(rooms[i].starter === true) {                                             //initialize room that's flagged as 'starter'
        Room.get(rooms[i], itemStatuses);
      }
    }


    $("#footer ul li a").click(function() {                                                  // bunch of UI dom manipulation stuff, should probably break this out into its own file for now
      $(".ui-overlay").fadeIn("fast");
      $(".ui-action").fadeOut("fast");
      $(".active").removeClass("active");
      $("#footer, #footer").addClass("active");
      $(this).parent().addClass("active");
    })

    $("#footer-look a").click(function() {                                                   // this is mad f*** redundant, refactor this you cad
      $("#action-look").fadeIn("fast");
      return false;
    });

    $("#footer-take a").click(function() {
      $("#action-take").fadeIn("fast");
      return false;
    });

    $("#footer-use a").click(function() {
      $("#action-use").fadeIn("fast");
      return false;
    });

    $("#footer-talk a").click(function() {
      $("#action-talk").fadeIn("fast");
      return false;
    });

    $("#footer-attack a").click(function() {
      $("#action-attack").fadeIn("fast");
      return false;
    });

    $(".ui-overlay, .ui-action-sheet-back").click(function() {
      $(".active").removeClass("active");
      $(this).fadeOut("fast");
      $(".ui-action, .ui-overlay, #move").fadeOut("fast");
    })


    $("#header-move, #move").click(function() {
      $("#move").fadeToggle("fast");
      $(".ui-overlay").fadeToggle("fast");
      return false;
    });


    $("#move-compass li").mouseover(function() {
      if(!$(this).hasClass("disabled")) {
        var preview = $(this).children("a").attr("href");
        $("#move-preview .ui-modal-inner").html(preview);
        $("#move-preview").fadeIn("fast");
      }
      return false;
    });

    $("#move-compass li:not(.disabled) a").mouseout(function() {
      $("#move-preview").fadeOut("fast");
      return false;
    });
  });
});