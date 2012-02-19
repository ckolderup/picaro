
define(["jquery", "inventory", "vendor/underscore"], function($, Inventory) {
  var ActionGuard;
  ActionGuard = {
    allById: {},
    itemInInventory: function(guard, action) {
      return Inventory.include(guard.item);
    },
    itemNotInInventory: function(guard, action) {
      return !ActionGuard.itemInInventory(guard, action);
    },
    test: function(action) {
      var guard, guardFunction, guardId, testResult;
      guardId = action.actionGuard;
      guard = this.allById[guardId];
      if (guard && typeof this[guard.type] === "function") {
        guardFunction = this[guard.type];
        testResult = guardFunction(guard, action);
        if (!testResult && guard.failMessage) {
          $(document).trigger("updateStatus", guard.failMessage);
        } else {
          if (testResult && guard.successMessage) {
            $(document).trigger("updateStatus", guard.successMessage);
          }
        }
        return testResult;
      } else {
        console.log("Y U no pass a known guard function?", action, this.allById);
        return false;
      }
    }
  };
  return ActionGuard;
});
