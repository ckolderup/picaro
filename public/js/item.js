
define(["jquery", "util", "inventory", "action_guard", "talk", "vendor/underscore"], function($, Util, Inventory, ActionGuard, Talk) {
  var Item;
  Item = (function() {

    function Item(itemObject, id) {
      var action, actionType, key, value, _i, _j, _len, _len2, _ref, _ref2, _ref3;
      id || (id = _(itemObject).keys()[0]);
      _ref = itemObject[id] || itemObject;
      for (key in _ref) {
        value = _ref[key];
        this[key] = value;
      }
      this.name || (this.name = id);
      this.id = Util.toIdString(id);
      _ref2 = ["use"];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        actionType = _ref2[_i];
        if (typeof this[actionType] === "object") {
          action = this[actionType];
          _ref3 = _(action).keys();
          for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
            key = _ref3[_j];
            action[Util.toIdString(key)] = action[key];
          }
        }
      }
    }

    Item.allById = {};

    Item.findByRoom = function(room) {
      return _.filter(this.allById, function(item, id) {
        return item.location === room.id;
      });
    };

    Item.find = function(id) {
      return this.allById[id];
    };

    Item.remove = function(id) {
      return delete this.allById[id];
    };

    Item.create = function(itemData, extraData) {
      var id, item, location;
      if (extraData) {
        id = extraData.id;
        location = extraData.location;
      }
      item = new Item(itemData, id);
      item.location || (item.location = location);
      if (this.allById[item.id] != null) throw "Duplicate item!";
      return this.allById[item.id] = item;
    };

    Item.look = function(item) {
      var action;
      action = item.look;
      if (typeof action === "string") {
        return $(document).trigger("updateStatus", action);
      } else if (action instanceof Array) {
        item.lookNum || (item.lookNum = 0);
        $(document).trigger("updateStatus", action[item.lookNum]);
        if (action.length > (item.lookNum + 1)) return item.lookNum += 1;
      } else {
        $(document).trigger("updateStatus", action.message);
        if (action.after) return $(document).trigger("gameEvent", action);
      }
    };

    Item.talk = function(item) {};

    Item.attack = function(item) {
      $(document).trigger("updateStatus", item.attack[item.attackNum]);
      if (item.attack.length > (item.attackNum + 1)) return item.attackNum += 1;
    };

    Item.take = function(item) {
      Inventory.add(item);
      $(document).trigger("itemTaken", item);
      $(document).trigger("closeMenu");
      if (item.take.after) return $(document).trigger("gameEvent", item.take);
    };

    Item.tryToTake = function(item) {
      if (this.canTake(item)) {
        return this.take(item);
      } else {
        return this.willNotTake(item);
      }
    };

    Item.canTake = function(item) {
      if (item.take === true) {
        return true;
      } else if (item.take && item.take.actionGuard) {
        return ActionGuard.test(item.take);
      } else {
        return false;
      }
    };

    Item.willNotTake = function(item) {
      var message;
      message = "You can't take the " + item.name + ". ";
      if (item.take && item.take.cannotTakeMessage) {
        message += item.take.cannotTakeMessage;
      }
      return $(document).trigger("updateStatus", message);
    };

    Item.immediateTake = function(gameEvent) {
      var item;
      item = Item.find(gameEvent.item);
      return Item.take(item);
    };

    Item.use = function(itemId1, itemId2) {
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
    };

    return Item;

  })();
  $(document).bind("actionTalk", function(e, id) {
    return $(document).trigger("beginTalk", Item.find(id));
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
