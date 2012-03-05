
define(["jquery", "util", "inventory", "action_guard", "talk", "vendor/underscore"], function($, Util, Inventory, ActionGuard, Talk) {
  var Item;
  Item = {
    allById: {},
    init: function(items) {
      return this.allById = items;
    },
    findByRoom: function(room) {
      return _.filter(this.allById, function(item, id) {
        return item.location === room.name;
      });
    },
    look: function(item) {
      var action;
      action = item.look;
      if (action instanceof Array) {
        item.lookNum || (item.lookNum = 0);
        $(document).trigger("updateStatus", action[item.lookNum]);
        if (action.length > (item.lookNum + 1)) return item.lookNum += 1;
      } else if (action instanceof String) {
        return $(document).trigger("updateStatus", action);
      } else {
        $(document).trigger("updateStatus", action.message);
        if (action.after) return $(document).trigger("gameEvent", action);
      }
    },
    talk: function(item) {},
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
      var item1, item2, using, _ref;
      _ref = [this.allById[itemId1], this.allById[itemId2]], item1 = _ref[0], item2 = _ref[1];
      if (item1 && item2 && item2.use && item2.use[item1.id]) {
        using = item2.use[item1.id];
        if (!using.actionGuard || ActionGuard.test(using)) {
          return $(document).trigger("gameEvent", using);
        }
      } else {
        return $(document).trigger("updateStatus", "You can't use those things together.");
      }
    }
  };
  $(document).bind("actionTalk", function(e, id) {
    return $(document).trigger("beginTalk", Item.allById[id]);
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
