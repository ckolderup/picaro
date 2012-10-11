
define(["jquery", "game", "util", "inventory", "talk", "action_guard", "util", "vendor/underscore"], function($, Game, Util, Inventory, Talk, ActionGuard, util) {
  var Item;
  Item = (function() {

    Item.name = 'Item';

    function Item(itemObject, id) {
      var action, actionType, key, value, _i, _j, _len, _len1, _ref, _ref1, _ref2;
      id || (id = _(itemObject).keys()[0]);
      _ref = itemObject[id] || itemObject;
      for (key in _ref) {
        value = _ref[key];
        this[key] = value;
      }
      this.name || (this.name = id);
      this.name = Util.stringChomp(this.name);
      this.id = Util.toIdString(id);
      _ref1 = ["use"];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        actionType = _ref1[_i];
        if (typeof this[actionType] === "object") {
          action = this[actionType];
          _ref2 = _(action).keys();
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            key = _ref2[_j];
            action[Util.toIdString(key)] = action[key];
          }
        }
      }
    }

    Item.allById = {};

    Item.descriptionsFor = function(items, descriptionString) {
      var item, itemsGroupedByType, _i, _len, _ref;
      if (descriptionString == null) {
        descriptionString = '';
      }
      itemsGroupedByType = _.groupBy(items, function(item) {
        return util.typeOf(item.description);
      });
      if (itemsGroupedByType['string'] != null) {
        _ref = itemsGroupedByType['string'];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          descriptionString += item.linkifiedDescription();
        }
      }
      if (itemsGroupedByType['undefined'] != null) {
        descriptionString += "You see " + util.arrayToSentence(itemsGroupedByType['undefined']);
      }
      return descriptionString;
    };

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
      if (this.allById[item.id] != null) {
        throw "Duplicate item!";
      }
      return this.allById[item.id] = item;
    };

    Item.prototype.actionLook = function() {
      var action;
      action = this.look;
      if (typeof action === "string") {
        return $(document).trigger("updateStatus", action);
      } else if (action instanceof Array) {
        this.lookNum || (this.lookNum = 0);
        $(document).trigger("updateStatus", action[this.lookNum]);
        if (action.length > (this.lookNum + 1)) {
          return this.lookNum += 1;
        }
      } else {
        $(document).trigger("updateStatus", action.message);
        if (action.after) {
          return $(document).trigger("gameEvent", action);
        }
      }
    };

    Item.prototype.actionTalk = function(item) {
      return $(document).trigger("beginTalk", this);
    };

    Item.prototype.actionAttack = function() {
      if (typeof this.attack === 'string') {
        return $(document).trigger("updateStatus", this.attack);
      } else if (this.attack.actionGuard) {
        return ActionGuard.test(this.attack);
      } else {
        if (this.attack.after) {
          return $(document).trigger("gameEvent", this.attack);
        }
      }
    };

    Item.prototype.immediateTake = function() {
      Inventory.add(this);
      $(document).trigger("itemTaken", this);
      $(document).trigger("closeMenu");
      if (this.take.after) {
        return $(document).trigger("gameEvent", this.take);
      }
    };

    Item.prototype.actionTake = function() {
      if (this.canTake()) {
        return this.immediateTake();
      } else {
        return this.willNotTake();
      }
    };

    Item.prototype.canTake = function() {
      if (this.take === true) {
        return true;
      } else if (typeof this.take === 'string') {
        return $(document).trigger("updateStatus", this.take);
      } else if (this.take && this.take.actionGuard) {
        return ActionGuard.test(this.take);
      } else {
        return false;
      }
    };

    Item.prototype.willNotTake = function() {
      var message;
      message = "You can't take the " + this.name + ". ";
      if (this.take && this.take.cannotTakeMessage) {
        message += this.take.cannotTakeMessage;
      }
      return $(document).trigger("updateStatus", message);
    };

    Item.prototype.actionUse = function(otherItem) {
      var using;
      if (otherItem && otherItem.use && (using = otherItem.use[this.id])) {
        if (!using.actionGuard || ActionGuard.test(using)) {
          return $(document).trigger("gameEvent", using);
        }
      } else {
        return $(document).trigger("updateStatus", "You can't use those things together.");
      }
    };

    Item.prototype.nameToRegex = function() {
      return new RegExp("" + this.name + "\\b", 'ig');
    };

    Item.prototype.linkifiedName = function() {
      return "<a rel='popover' class='inline-item' href='#' data-trigger='hover' data-item-id='" + this.id + "' data-title='" + this.name + "'>" + this.name + "</a>";
    };

    Item.prototype.linkifiedDescription = function() {
      if (!this.description) {
        return;
      }
      if (Game.current.inlineActions) {
        return this.description.replace(this.nameToRegex(), this.linkifiedName());
      } else {
        return this.description;
      }
    };

    return Item;

  })();
  $(document).bind("actionTalk", function(e, item) {
    return item.actionTalk();
  });
  $(document).bind("actionAttack", function(e, item) {
    return item.actionAttack();
  });
  $(document).bind("actionLook", function(e, item) {
    return item.actionLook();
  });
  $(document).bind("actionTake", function(e, item) {
    return item.actionTake();
  });
  $(document).bind("actionUse", function(e, item, otherItem) {
    return item.actionUse(otherItem);
  });
  $(document).bind("immediateTake", function(e, item) {
    return item.immediateTake();
  });
  return Item;
});
