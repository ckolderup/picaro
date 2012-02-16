define(["jquery", "inventory", "vendor/underscore"], function($, Inventory) {

  var ActionGuard = {
    allById: {},

    itemInInventory: function(guard, action) {
      return Inventory.include(guard.item)
    },

    // Takes an ActionGuard id once attached to an object. Looks it up in all known guards and runs the function associated with that type, if found.
    test: function(action) {
      var guardId = action.actionGuard,
          guard = this.allById[guardId]

      if (guard && typeof this[guard.type] === "function") {
        var guardFunction = this[guard.type]
        return guardFunction(guard, action)
      } else {
        console.log("Y U no pass a known guard function?")
        return false
      }
    }
  }

  return ActionGuard;
})