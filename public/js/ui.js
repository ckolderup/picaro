define(["jquery", 'item', 'vendor/underscore'], function($, Item) {
  UI = {}

  var usable = function() {
    var itemTriggers = [];

    $('#footer-use').click(function() {
      $('#action-use').trigger('openMenu')
    });

    $('#action-use li a').live('click', function() {
      itemTriggers.push($(this).data('item-id'))
      console.log('itemTriggers', itemTriggers)
      if(itemTriggers.length == 2) {
        Item.use(itemTriggers[0], itemTriggers[1])
        itemTriggers = [];
        $(this).addClass('active')
      }
    })

    $('#action-use').bind('openMenu', function(e, i) {
      $(this).fadeIn("fast").addClass('active');
    })
  }
  usable();

  UI.init = function() {
    $("#footer ul li a").click(function() {                                                  // bunch of UI dom manipulation stuff, should probably break this out into its own file for now
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
        var that = $(this);
        var action = that.parent().parent().attr("id");
        var item = that.clone().find("small").remove().end().text().replace(/ /g,'');
        $(".ui-overlay, .ui-action").fadeOut();
        $(".active").removeClass("active");
        itemAction(action, item, event);
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
        if(Item.all[i].name === item) {
          var itemData = Item.all[i];
          var key = i;
          break;
        }
      }

      var lookNum = itemData.lookNum;
      var talkNum = itemData.talkNum;
      var attackNum = itemData.attackNum;

      if(action === "Look") {
        $(document).trigger("updateStatus", itemData.look[lookNum]);
        if(Item.all[key].look.length > (Item.all[key].lookNum + 1)){
          Item.all[key].lookNum += 1;
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
        if(Item.all[key].talk.length > (Item.all[key].talkNum + 1)){
          Item.all[key].talkNum += 1;
        }
      }

      if(action === "Attack") {
        $(document).trigger("updateStatus", itemData.attack[attackNum]);
        if(Item.all[key].attack.length > (Item.all[key].attackNum + 1)){
          Itema.all[key].attackNum += 1;
        }
      }

      if(action === "Use") {
        event.stopPropagation();
        console.log("\"Ability to use things tk.\" - THE MANAGEMENT");
        return false
      }

    }

    $("a.path:not(.disabled)").click(function() {                                                     //compass-controlling
      var roomName = $(this).attr("href");
      $("#move-preview .ul-modal-inner").html(roomName);
      for (var i in rooms) {
        if (roomName === rooms[i].name) {
          Room.get(rooms[i], Item.all);
        }
      }
    })

  }
  return UI;
});