define(["jquery", "inventory", "util", "vendor/underscore"], function($, Inventory, Util) {
  var Guard;
  Guard = {
    init: function(guards) {
      var guard, _i, _len, _results;
      this.allById = {};
      if (guards) {
        _results = [];
        for (_i = 0, _len = guards.length; _i < _len; _i++) {
          guard = guards[_i];
          _results.push(this.allById[guard.id] = guard);
        }
        return _results;
      }
    },
    itemInInventory: function(guard, action) {
      return Inventory.include(Util.toIdString(guard.item));
    },
    itemNotInInventory: function(guard, action) {
      return !Guard.itemInInventory(guard, action);
    },
    test: function(action) {
      var guard, guardFunction, guardId, testResult;
      guardId = action.actionGuard;
      guard = this.allById[guardId];
      if (!(guard && (guardFunction = this[guard.type]))) {
        throw "Invalid Action Guard: " + guardId;
      }
      testResult = guardFunction(guard, action);
      if (!testResult && guard.failMessage) {
        $(document).trigger("updateStatus", guard.failMessage);
      } else if (testResult && guard.successMessage) {
        $(document).trigger("updateStatus", guard.successMessage);
      }
      return testResult;
    }
  };
  return Guard;
});