define [ "jquery", "inventory", "vendor/underscore" ], ($, Inventory) ->
  # We take the array of guards from the game JSON and store them, hashed by ID.
  init: (guards) ->
    @allById[guard.id] = guard for guard in guards

  #### Types

  # Is item ID passed with the guard is not found in the Player's inventory?
  itemInInventory: (guard, action) ->
    Inventory.include guard.item

  # ...or not?
  itemNotInInventory: (guard, action) ->
    not @itemInInventory guard, action

  #### Test

  # An Action (verb + noun) is passed in, and we look for an id in its actioGuard property. We then do a lookup in ActionGuard.allById.
  # If we find a guard and it's of a known type (see below), we call the function of that type, passing the guard and the original action.
  # A success or fail message is specified, we update the status.
  # Lastly, the boolean result of testing the guard function, `testResult`, is returned.
  test: (action) ->
    guardId = action.actionGuard
    guard = @allById[guardId]
    throw "Invalid Action Guard: #{guardId}" unless guard and guardFunction = this[guard.type]       

    testResult = guardFunction(guard, action)
    if not testResult and guard.failMessage
      $(document).trigger "updateStatus", guard.failMessage
    else if testResult and guard.successMessage
      $(document).trigger "updateStatus", guard.successMessage
    testResult