(function() {

  define(["jquery", "util", "inventory", "action_guard", "vendor/underscore"], function($, Util, Inventory, ActionGuard) {
    var Item;
    Item = {
      init: function(items) {
        return this.allById = items;
      },
      findByRoom: function(room) {
        return _.filter(this.allById, function(item, id) {
          return item.location === room.name;
        });
      },
      look: function(item) {
        $(document).trigger("updateStatus", item.look[item.lookNum]);
        if (item.look.length > (item.lookNum + 1)) return item.lookNum += 1;
      },
      talk: function(item) {
        $(document).trigger("updateStatus", item.talk[item.talkNum]);
        if (item.talk.length > (item.talkNum + 1)) return item.talkNum += 1;
      },
      attack: function(item) {
        $(document).trigger("updateStatus", item.attack[item.attackNum]);
        if (item.attack.length > (item.attackNum + 1)) return item.attackNum += 1;
      },
      take: function(item) {
        Inventory.add(item);
        $(document).trigger("itemTaken", item);
        $(document).trigger("closeMenu");
        if (item.take.after) return $(document).trigger("gameEvent", item.take);
      },
      tryToTake: function(item) {
        if (this.canTake(item)) {
          return this.take(item);
        } else {
          return this.willNotTake(item);
        }
      },
      canTake: function(item) {
        if (item.take === true) {
          return true;
        } else if (item.take && item.take.actionGuard) {
          return ActionGuard.test(item.take);
        } else {
          return false;
        }
      },
      willNotTake: function(item) {
        var message;
        message = "You can't take the " + item.name + ". ";
        if (item.take && item.take.cannotTakeMessage) {
          message += item.take.cannotTakeMessage;
        }
        return $(document).trigger("updateStatus", message);
      },
      immediateTake: function(gameEvent) {
        var item;
        item = Item.allById[gameEvent.item];
        return Item.take(item);
      },
      use: function(itemId1, itemId2) {
        var item1, item2, using;
        item1 = this.allById[itemId1];
        item2 = this.allById[itemId2];
        if (item1 && item2 && item2.use && item2.use[item1.id]) {
          using = item2.use[item1.id];
          if (!using.actionGuard || ActionGuard.test(using)) {
            return $(document).trigger("gameEvent", using);
          }
        } else {
          $(document).trigger("updateStatus", "You can't use those things together.");
          return console.log("you can't use this on that.", item1, item2);
        }
      }
    };
    $(document).bind("actionTalk", function(e, o) {
      return Item.talk(o);
    });
    $(document).bind("actionAttack", function(e, o) {
      return Item.attack(o);
    });
    $(document).bind("actionLook", function(e, o) {
      return Item.look(o);
    });
    $(document).bind("actionUse", function(e, item1, item2) {
      return Item.use(item1, item2);
    });
    $(document).bind("actionTake", function(e, o) {
      return Item.tryToTake(o);
    });
    $(document).bind("immediateTake", function(e, o) {
      return Item.immediateTake(o);
    });
    return Item;
  });

}).call(this);
