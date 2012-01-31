require(["jquery", "util", "room"], function($, Util, Room) {

$(document).ready(function() {
         var roomID;
         var inventory = [];
         var actions = ["Look", "Take", "Use", "Talk", "Attack"];
         var itemStatuses = [];
         var counters = [];

         $(document).bind("updateStatus", function(event, status) {
           $("p.new:first ").removeClass("new").addClass("old");
            var n = $("p.old").length;
            if(n > 5) {
            $("p.old:first").remove();
            }
            $("#game").append("<p class='new'>" + status + "</p>");
         })

         function itemObject (name) {
                  this.name = name;
                  this.look = 0;
                  this.talk = 0;
                  this.attack = 0;
         }

         function counter (name, min, max, val) {
                  this.name = name;
                  this.min = min;
                  this.max = max;
                  this.val = val;
         }

         $.getJSON('hmm.json', function(data) {
              $("title").html(data.gameName);

                  $("a").on("click", function(e) {
                           var that = $(this);
                           if(that.hasClass("path") && !$(this).hasClass("disabled")) {      // If the link has the class "path," and isn't disabled, then it's a room change.
                           e.preventDefault();
                           var roomName = that.attr("href");
                           $("#move-preview .ul-modal-inner").html(roomName);
                           for (var i in data.Rooms) {
                                    if (roomName === data.Rooms[i].Name) {
                                             Room.get(data.Rooms[i], i)
                                    }
                           }
                  }

                           else if(that.hasClass("action")){                                 // If it doesn't, it must be an action...

                                    var action = that.html();

                                    if(action === "Use") {                                       // ...which can be either an item being used on an item...

                                    }

                                    else {                                                       // ...or an action being performed on an item.



                                    }
                           }

                  });


                  itemItem = function(items, roomID) {
                           items = items.sort();

                           for (var i in data.ItemCombos) {
                                    var ingredients = data.ItemCombos[i].Ingredients;
                                    ingredients = ingredients.sort();

                                    if(Util.arrayEquality(items,ingredients)) {
                                             console.log("You Created " + data.ItemCombos[i].Name);
                                             changeStatus(data.ItemCombos[i].Message);
                                    }
                           }
                  }                                                                                 // end item/item function


                  itemAction = function(action, item, roomID) {

                           for (var i in actions) {
                                    if(actions[i] === action) {
                                             var verb = action;
                                    }
                           }

                           for (var i in data.Rooms[roomID].items) {

                                             var nospaceItem = item.replace(/ /g,'');
                                    if(data.Rooms[roomID].items[i].Name === nospaceItem) {


                                             for(var x in itemStatuses) {
                                                      if(nospaceItem === itemStatuses[x].name) {
                                                               var itemStatus = itemStatuses[x];
                                                               var attackStatus = itemStatuses[x].attack;
                                                               var lookStatus = itemStatuses[x].look;
                                                               var talkStatus = itemStatuses[x].talk;
                                                               break;
                                                      }
                                             }
                                             var itemData = data.Rooms[roomID].items[i];


                                             if(verb === "Take") {
                                                      inventory.push(item);
                                                      $(document).trigger("updateStatus", "You take the " + item + ".");
                                                      $("#action-use ul").append("<li><a href='#' class='item'>" + item        + " <small>(held)</small></a></li>");
                                                      $("#action-look ul li a:contains(" + item + ")").append(" <small>(held)</small>");

                                             }

                                             if(verb === "Look") {
                                                      $(document).trigger("updateStatus", itemData.Look[lookStatus]);
                                                      for(var y in itemStatuses) {
                                                               if(nospaceItem === itemStatuses[y].name) {
                                                                        var lookCounter = itemStatuses[y].look + 1;
                                                                        if(data.Rooms[roomID].items[i].Look[lookCounter]) {
                                                                        itemStatuses[y].look += 1;
                                                                        }
                                                                        break;
                                                               }
                                                      }
                                             }

                                             if(verb === "Talk") {
                                                      $(document).trigger("updateStatus", itemData.Talk[talkStatus]);
                                                      for(var y in itemStatuses) {
                                                               if(nospaceItem === itemStatuses[y].name) {
                                                                        var talkCounter = itemStatuses[y].talk + 1;
                                                                        if(data.Rooms[roomID].items[i].Talk[talkCounter]) {
                                                                        itemStatuses[y].talk += 1;
                                                                        }
                                                                        break;
                                                               }
                                                      }
                                             }

                                             if(verb === "Attack") {
                                                      $(document).trigger("updateStatus", itemData.Attack[attackStatus]);

                                                      if(data.Rooms[roomID].items[i].Counters.Attack) {            // if a counter exists on the item
                                                      for(var q in counters) {
                                                               if(counters[q].name === data.Rooms[roomID].items[i].Counters.Attack[0] && counters[q].val < counters[q].max) {
                                                               }
                                                      }
                                                      }

                                                      for(var y in itemStatuses) {
                                                               if(nospaceItem === itemStatuses[y].name) {
                                                                        var attackCounter = itemStatuses[y].attack + 1;
                                                                        if(data.Rooms[roomID].items[i].Attack[attackCounter]) {
                                                                        itemStatuses[y].attack += 1;
                                                                        }
                                                                        break;
                                                               }
                                                      }
                                             }
                                    }
                           }
                  }                                                                                           // end item/action function

               var gameCounters = data.Counters;


                  for(var j in gameCounters){
                           var counterName = gameCounters[j].Name;
                           var counterMin = gameCounters[j].Min;
                           var counterMax = gameCounters[j].Max;
                           var counterVal = gameCounters[j].Val;
                           counters.push(new counter(counterName, counterMin, counterMax, counterVal));
                  }

              for(var i in data.Rooms) {

                  var items = data.Rooms[i].items;

                  for(var k in items) {
                           var itemName = items[k].Name;
                           itemName = itemName.replace(/ /g,'');
                           itemStatuses.push(new itemObject(itemName));
                  }

                  if(data.Rooms[i].Starter) {
                           var firstRoom = data.Rooms[i];
                           Room.get(firstRoom, i);
                  }
              }


            });                                                                                   // end json get



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