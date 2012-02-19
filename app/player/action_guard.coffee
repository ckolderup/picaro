define [ "jquery", "inventory", "vendor/underscore" ], ($, Inventory) ->
  ActionGuard =
    allById: {}
    itemInInventory: (guard, action) ->
      Inventory.include guard.item

    itemNotInInventory: (guard, action) ->
      not ActionGuard.itemInInventory(guard, action)

    test: (action) ->
      guardId = action.actionGuard
      guard = @allById[guardId]
      if guard and typeof this[guard.type] is "function"
        guardFunction = this[guard.type]
        testResult = guardFunction(guard, action)
        if not testResult and guard.failMessage
          $(document).trigger "updateStatus", guard.failMessage
        else $(document).trigger "updateStatus", guard.successMessage  if testResult and guard.successMessage
        testResult
      else
        console.log "Y U no pass a known guard function?", action, @allById
        false

  ActionGuard