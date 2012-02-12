define(["jquery", 'item', 'room', 'vendor/underscore'], function($, Item, Room) {
  var itemTriggers = [];

  var UI = {
    resetForNewRoom: function(room, roomItems) {
      $('.ui-action ul').empty()
      var itemNames = _.pluck(roomItems, "name")
      $(document).trigger("updateStatus", room.description + "<br/ ><br/>You see " + util.toArrayToSentence(itemNames));
    },

    newStatusMessage: function(message) {
      $("p.new:first ").removeClass("new").addClass("old");
      var n = $("p.old").length;
      if (n > 5) {
        $("p.old:first").remove();
      }
      $("#game").append("<p class='new'>" + message + "</p>");
    },

    changeRoom: function(e, roomData) {
      var room = roomData.room, items = roomData.items

      UI.resetForNewRoom(room, items);
      $("#header h2").html(room.name);
      $("#move-preview .ul-modal-inner").html(room.name);
      $(document).trigger('roomReady', room)
    },

    itemTaken: function(e, item) {
      $(document).trigger("updateStatus", "You take the " + item.name + ".");

      $("#action-take a[data-action-id='" + util.actionId(item, 'take') + "']" ).remove();
      $("#action-use  a[data-action-id='" + util.actionId(item, "use") + "']" ).append($("<small> (held) </small>"));
      $("#action-look a[data-action-id='" + util.actionId(item, "look") + "']" ).append($("<small> (held) </small>"));
      $('#action-use').trigger('closeMenu')
    },

    init: function() {
      $("#footer ul li a").click(function() {
        $(".ui-overlay").fadeIn("fast");
        $(".ui-action").fadeOut("fast");
        $(".active").removeClass("active");
        $("#footer").addClass("active");
        $(this).parent().addClass("active");
      })

      var oldMenus = _(["look", "take", "talk", "attack"])

      oldMenus.each(function(action) {
      var menuSelector = "#action-" + action
      $("#footer-" + action + " a").click(function() {
        $(menuSelector).fadeIn("fast");
        return false;
      });

      $(menuSelector + ".ui-overlay," + menuSelector + " .ui-action-sheet-back").click(function() {
        $(".active").removeClass("active");
        $(this).fadeOut("fast");
        $(".ui-action, .ui-overlay, #move").fadeOut("fast");
      })

      $(menuSelector + " ul li a").live('click', function(event) { //set off user-triggered item/action events
        var actionAndId = $(this) .data('action-id').split('-')
        $(".ui-overlay, .ui-action").fadeOut();
        $(".active").removeClass("active");
        itemAction(actionAndId[0], actionAndId[1], event);
        })
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

      //begin item/action function

      var itemAction = function(action, item, event) {
       var item = Item.allById[item]

       if(action === "look") {
         $(document).trigger("updateStatus", item.look[item.lookNum]);
         if(item.look.length > (item.lookNum + 1)){
           item.lookNum += 1;
         }
       }

       if(action === "take") {
         $(document).trigger("clickActionTake", item)
       }

       if(action === "talk") {
         $(document).trigger("updateStatus", item.talk[item.talkNum]);
         if(item.talk.length > (item.talkNum + 1)){
           item.talkNum += 1;
         }
       }

       if(action === "attack") {
         $(document).trigger("updateStatus", item.attack[item.attackNum]);
         if(item.attack.length > (item.attackNum + 1)){
           item.attackNum += 1;
         }
       }

       if(action === "use") {
         event.stopPropagation();
         return false
       }
      }
    }
  }


  // compass-controlling
  $("a.path:not(.disabled)").click(function() {
    // FIXME: the UI should not be gathering this room data
    var room = Room.findByName($(this).attr('href'))
    var roomData = {
      room: room,
      items: Item.findByRoom(room)
    }
    $(document).trigger("changeRoom", roomData)
  })

  $('#footer-use').click(function() {
    $('#action-use').trigger('openMenu')
  });

  $('#action-use li a').live('click', function() {
    itemTriggers.push($(this).data('item-id'))
    if(itemTriggers.length == 2) {
      Item.use(itemTriggers[0], itemTriggers[1])
      itemTriggers = [];
      $(this).addClass('active')
    }
  })

  $('.ui-action').bind('openMenu', function(e, i) {
    $(".ui-overlay").fadeIn("fast");
    $(this).fadeIn("fast").addClass('active');
  })

  $('.ui-action').bind('closeMenu', function(e, i) {
    $(this).fadeOut("fast").removeClass('active');
    $(".ui-overlay").fadeOut("fast");
  })


  $(document).bind('itemTaken', UI.itemTaken)
  $(document).bind('changeRoom', UI.changeRoom)

  return UI;
});