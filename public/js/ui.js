define(["jquery", 'item', 'room', 'inventory', 'vendor/underscore'], function($, Item, Room, Inventory) {
  var itemTriggers = [];

  var UI = {
    updateStatus: function(message) {
      $(document).trigger("updateStatus", message)
    },

    resetForNewRoom: function(room, roomItems) {
      this.resetMenus();
      var itemNames = _.pluck(roomItems, "name")
      var message = ""
      if (room.description) {
        message += room.description
        message += "\n"
      }
      this.updateStatus(message + "You see " + util.toArrayToSentence(itemNames))
    },

    resetMenus: function() {
      var roomItems = Item.findByRoom(Room.current)
      $('.ui-action ul').empty()

      _.each(Inventory.list(), function(item) {
        $("#action-use ul").append("<li><a href='#' class='item' data-action-id='" + util.actionId(item, 'use') + "'>" + item.name + " <small> (held) </small></a></li>");
        $("#action-look ul").append("<li><a href='#' class='item' data-action-id='" + util.actionId(item, 'take') + "'>" + item.name + " <small> (held) </small></a></li>");
      })

      _.each(_.difference(roomItems, Inventory.list()), function(item) {
        $("#action-take ul").append("<li><a href='#' class='item' data-action-id='" + util.actionId(item, 'take') + "'>" + item.name + "</a></li>");
        $("#action-use ul").append("<li><a href='#' class='item' data-item-id='" + item.id +"' data-action-id='" + util.actionId(item, 'use') + "'>" + item.name + "</a></li>");
        $("#action-look ul").append("<li><a href='#' class='item' data-action-id='" + util.actionId(item, 'look') + "'>" + item.name + "</a></li>");
      })

      for (var i in roomItems) {
        var item = roomItems[i];

        if(item.talk) {
          $("#action-talk ul").append("<li><a href='#' class='item' data-action-id='" + util.actionId(item, 'take') + "'>" + item.name + "</a></li>");
        }

        if(item.attack) {
          $("#action-attack ul").append("<li><a href='#' class='item' data-action-id='" + util.actionId(item, 'take') + "'>" + item.name + "</a></li>");
        }
      }
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

    renderUseMenu: function(inventoryItems, roomItems) {
      $('.ui-action ul').empty()

      _.each(inventoryItems, function(item) {
        $("#action-use ul").append("<li><a href='#' class='item data-action-id='" + util.actionId(item, 'use') + "'>" + item.name + " <small> (held) </small></a></li>");
        $("#action-look ul").append("<li><a href='#' class='item' data-action-id='" + util.actionId(item, 'take') + "'>" + item.name + " <small> (held) </small></a></li>");
      })

      _.each(_.difference(roomItems, inventoryItems), function(item) {
        $("#action-take ul").append("<li><a href='#' class='item' data-action-id='" + util.actionId(item, 'take') + "'>" + item.name + "</a></li>");
        $("#action-use ul").append("<li><a href='#' class='item' data-item-id='" + item.id +"' data-action-id='" + util.actionId(item, 'use') + "'>" + item.name + "</a></li>");
        $("#action-look ul").append("<li><a href='#' class='item' data-action-id='" + util.actionId(item, 'look') + "'>" + item.name + "</a></li>");
      })
    },

    init: function() {
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
          $(document).trigger("actionLook", item)
        }

        if(action === "take") {
          $(document).trigger("actionTake", item)
        }

        if(action === "talk") {
          $(document).trigger("actionTalk", item)
        }

        if(action === "attack") {
          $(document).trigger("actionAttack", item)
        }

        if(action === "use") {
          event.stopPropagation();
          return false
        }
      }
    }
  }

  // Click event binding

  $("#footer ul li a").click(function() {
    $(".ui-overlay").fadeIn("fast");
    $(".ui-action").fadeOut("fast");
    $(".active").removeClass("active");
    $("#footer").addClass("active");
    $(this).parent().addClass("active");
  })

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
    if (itemTriggers.length == 1) {
      $(this).addClass('active')
    } else if (itemTriggers.length == 2) {
      Item.use(itemTriggers[0], itemTriggers[1])
      itemTriggers = [];
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

  $(document).bind('resetMenus', UI.resetMenus)
  $(document).bind('itemTaken', UI.itemTaken)
  $(document).bind('changeRoom', UI.changeRoom)

  return UI;
});