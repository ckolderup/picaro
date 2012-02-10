define(["jquery", 'item', 'vendor/underscore'], function($, Item) {
  UI = {}

  var itemTriggers = [];

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

  UI.newStatusMessage = function(message) {
    $("p.new:first ").removeClass("new").addClass("old");
    var n = $("p.old").length;
    if (n > 5) {
      $("p.old:first").remove();
    }
    $("#game").append("<p class='new'>" + message + "</p>");
  };

  UI.updateRoomTitle = function(roomName) {
    $("#move-preview .ul-modal-inner").html(roomName);
  };

  UI.itemTaken = function(e, item) {
    $(document).trigger("updateStatus", "You take the " + item.name + ".");

    $("#action-take a[data-action-id='" + util.actionId(item, 'take') + "']" ).remove();
    $("#action-use  a[data-action-id='" + util.actionId(item, "use") + "']" ).append($("<small> (held) </small>"));
    $("#action-look a[data-action-id='" + util.actionId(item, "look") + "']" ).append($("<small> (held) </small>"));
    $('#action-use').trigger('closeMenu')

  };

  $(document).bind('itemTaken', UI.itemTaken)
  $(document).bind('roomChanged', UI.changeRoomName)

  UI.init = function() {
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

      $(menuSelector + " ul li a").live('click', function(event) {                             //set off user-triggered item/action events
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
      for(var i in Item.all) {
        if(Item.all[i].id === item) {
          var itemData = Item.all[i];
          break;
        }
      }

      var lookNum = itemData.lookNum;
      var talkNum = itemData.talkNum;
      var attackNum = itemData.attackNum;

      if(action === "look") {
        $(document).trigger("updateStatus", itemData.look[lookNum]);
        if(Item.all[key].look.length > (Item.all[key].lookNum + 1)){
          Item.all[key].lookNum += 1;
        }
      }

      if(action === "take") {
        if (Item.canTake(itemData)) {
          Item.take(itemData)
        } else {
          Item.cannotTake(itemData)
        };
      }

      if(action === "talk") {
        $(document).trigger("updateStatus", itemData.talk[talkNum]);
        if(Item.all[key].talk.length > (Item.all[key].talkNum + 1)){
          Item.all[key].talkNum += 1;
        }
      }

      if(action === "attack") {
        $(document).trigger("updateStatus", itemData.attack[attackNum]);
        if(Item.all[key].attack.length > (Item.all[key].attackNum + 1)){
          Itema.all[key].attackNum += 1;
        }
      }

      if(action === "use") {
        event.stopPropagation();
        return false
      }

    }

    //compass-controlling
    $("a.path:not(.disabled)").click(function() {
      $(document).trigger("roomChanged", $(this).attr('href'))
    })

  }
  return UI;
});