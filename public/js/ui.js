
define(["jquery", "util", "item", "room", "inventory", "vendor/underscore"], function($, util, Item, Room, Inventory) {
  var UI, itemTriggers;
  itemTriggers = [];
  UI = {
    updateStatus: function(message) {
      return $(document).trigger("updateStatus", message);
    },
    resetForNewRoom: function(room, roomItems) {
      var itemNames, message;
      this.resetMenus();
      itemNames = _.pluck(roomItems, "name");
      message = "";
      if (room.description) {
        message += room.description;
        message += "\n";
      }
      return this.updateStatus(message + "You see " + util.arrayToSentence(itemNames));
    },
    resetMenus: function() {
      var roomItems;
      roomItems = Item.findByRoom(Room.current);
      if (Item.allById.self) roomItems.push(Item.allById.self);
      $(".ui-action ul").empty();
      _.each(Inventory.list(), function(item) {
        $("#action-use ul").append("<li><a href='#' class='item' data-action-id='" + util.actionId(item, "use") + "'>" + item.name + " <small> (held) </small></a></li>");
        return $("#action-look ul").append("<li><a href='#' class='item' data-action-id='" + util.actionId(item, "take") + "'>" + item.name + " <small> (held) </small></a></li>");
      });
      _.each(_.difference(roomItems, Inventory.list()), function(item) {
        $("#action-take ul").append("<li><a href='#' class='item' data-action-id='" + util.actionId(item, "take") + "'>" + item.name + "</a></li>");
        $("#action-use ul").append("<li><a href='#' class='item' data-item-id='" + item.id + "' data-action-id='" + util.actionId(item, "use") + "'>" + item.name + "</a></li>");
        return $("#action-look ul").append("<li><a href='#' class='item' data-action-id='" + util.actionId(item, "look") + "'>" + item.name + "</a></li>");
      });
      return _.each(roomItems, function(item) {
        if (item.talk) {
          $("#action-talk ul").append("<li><a href='#' class='item' data-action-id='" + util.actionId(item, "take") + "'>" + item.name + "</a></li>");
        }
        if (item.attack) {
          return $("#action-attack ul").append("<li><a href='#' class='item' data-action-id='" + util.actionId(item, "take") + "'>" + item.name + "</a></li>");
        }
      });
    },
    newStatusMessage: function(message) {
      var n;
      $("p.new:first ").removeClass("new").addClass("old");
      n = $("p.old").length;
      if (n > 5) $("p.old:first").remove();
      return $("#game").append("<p class='new'>" + message + "</p>");
    },
    changeRoom: function(e, roomData) {
      var items, room;
      room = roomData.room;
      items = roomData.items;
      Room.current = room;
      UI.resetForNewRoom(room, items);
      $("#header h2").html(room.name);
      $("#move-preview .ul-modal-inner").html(room.name);
      return $(document).trigger("roomReady", room);
    },
    itemTaken: function(e, item) {
      $(document).trigger("updateStatus", "You take the " + item.name + ".");
      $("#action-take a[data-action-id='" + util.actionId(item, "take") + "']").remove();
      $("#action-use  a[data-action-id='" + util.actionId(item, "use") + "']").append($("<small> (held) </small>"));
      $("#action-look a[data-action-id='" + util.actionId(item, "look") + "']").append($("<small> (held) </small>"));
      return $("#action-use").trigger("closeMenu");
    },
    hideCompass: function() {
      return $("#move").fadeOut('fast');
    },
    init: function(gameName) {
      var itemAction, oldMenus;
      $("title").html(gameName);
      oldMenus = _(["look", "take", "talk", "attack"]);
      oldMenus.each(function(action) {
        var menuSelector;
        menuSelector = "#action-" + action;
        $("#footer-" + action + " a").click(function() {
          $(menuSelector).fadeIn("fast");
          return false;
        });
        $(menuSelector + ".ui-overlay," + menuSelector + " .ui-action-sheet-back").click(function() {
          $(".active").removeClass("active");
          $(this).fadeOut("fast");
          return $(".ui-action, .ui-overlay, #move").fadeOut("fast");
        });
        return $(menuSelector + " ul li a").live("click", function(event) {
          var actionAndId;
          actionAndId = util.splitActionId(this);
          $(this).trigger("closeMenu");
          return itemAction(actionAndId[0], actionAndId[1], event);
        });
      });
      $("#header-move, #move").click(function() {
        $("#move").fadeToggle("fast");
        $(".ui-overlay").fadeToggle("fast");
        return false;
      });
      $("#move-compass li").mouseover(function() {
        var preview;
        if (!$(this).hasClass("disabled")) {
          preview = $(this).children("a").attr("href");
          $("#move-preview .ui-modal-inner").html(preview);
          $("#move-preview").fadeIn("fast");
        }
        return false;
      });
      $("#move-compass li:not(.disabled) a").mouseout(function() {
        $("#move-preview").fadeOut("fast");
        return false;
      });
      return itemAction = function(action, item, event) {
        item = Item.allById[item];
        if (action === "look") $(document).trigger("actionLook", item);
        if (action === "take") $(document).trigger("actionTake", item);
        if (action === "talk") $(document).trigger("actionTalk", item);
        if (action === "attack") $(document).trigger("actionAttack", item);
        if (action === "use") {
          event.stopPropagation();
          return false;
        }
      };
    }
  };
  $("#footer ul li a").click(function() {
    $(".ui-overlay").fadeIn("fast");
    $(".ui-action").fadeOut("fast");
    $(".active").removeClass("active");
    $("#footer").addClass("active");
    return $(this).parent().addClass("active");
  });
  $(".ui-overlay").click(function() {
    return $(".ui-action, .ui-overlay, #move").fadeOut("fast");
  });
  $("a.path:not(.disabled)").click(function() {
    var room, roomData;
    room = Room.findByName($(this).attr("href"));
    roomData = {
      room: room,
      items: Item.findByRoom(room)
    };
    return $(document).trigger("changeRoom", roomData);
  });
  $("#footer-use").click(function() {
    return $("#action-use").trigger("openMenu");
  });
  $("#action-use li a").live("click", function() {
    itemTriggers.push(util.splitActionId(this)[1]);
    if (itemTriggers.length === 1) {
      return $(this).addClass("active");
    } else if (itemTriggers.length === 2) {
      $(this).trigger("closeMenu");
      $(document).trigger("actionUse", itemTriggers);
      return itemTriggers = [];
    }
  });
  $(".ui-action").bind("openMenu", function(e, i) {
    $(".ui-overlay").fadeIn("fast");
    return $(this).fadeIn("fast").addClass("active");
  });
  $(".ui-action").bind("closeMenu", function() {
    $(this).fadeOut("fast").removeClass("active");
    return $(".ui-overlay").fadeOut("fast");
  });
  $(document).bind("updateStatus", function(event, message) {
    return UI.newStatusMessage(message);
  });
  $(document).bind("resetMenus", UI.resetMenus);
  $(document).bind("itemTaken", UI.itemTaken);
  $(document).bind("changeRoom", UI.changeRoom);
  return UI;
});
