define(["jquery", "inventory", "vendor/underscore"], function($, Inventory) {

  var ActionGuard = {
    allById: {},

    itemInInventory: function(guard, action) {
      return Inventory.include(guard.item)
    },

    itemNotInInventory: function(guard, action) {
      return !ActionGuard.itemInInventory(guard, action)
    },

    // Takes an ActionGuard id once attached to an object. Looks it up in all known guards and runs the function associated with that type, if found.
    test: function(action) {
      var guardId = action.actionGuard,
          guard = this.allById[guardId]

      if (guard && typeof this[guard.type] === "function") {
        var guardFunction = this[guard.type]
        var testResult = guardFunction(guard, action)

        if (!testResult && guard.failMessage) {
          $(document).trigger('updateStatus',  guard.failMessage)
        } else if (testResult && guard.successMessage) {
          $(document).trigger('updateStatus',  guard.successMessage)
        }
        return testResult;
      } else {
        console.log("Y U no pass a known guard function?", action, this.allById)
        return false
      }
    }
  }

  return ActionGuard;
})