#### Game Events

# Game Events are the main way of specifying changes to the gameworld as a result of some action.  Currently, an "after" event is all that's specified, but at some point we will likely add "before" events or events that occur after some period of time has elapsed. The idea is that an event ID can be attached to any action (a verb called on an item) as its "after" property.  When an action (generally, anything of the form "verb + noun") is performed, the event will be looked up and triggered here if it is one of the known types.

# First we declare our dependencies on Item, Inventory and Room, as well as the usual suspects, $ and _.
define [ "jquery", "item", "inventory", "room", "vendor/underscore" ], ($, Item, Inventory, Room) ->
  GameEvent =
    # We take the array of events from the game JSON and store them, hashed by ID.
    init: (events) ->
      @allById[event.id] = event for event in events if events

    allById: {}

    #### Types

    # Simply add a new message to the game's main display.
    updateStatus: (gameEvent) ->

    # The player actually takes the item. Item listens to `immediateTake` and adds to the Inventory with not further checks.
    takeItem: (gameEvent) ->
      $(document).trigger "immediateTake", gameEvent

    # Removes the item from inventory and sets its location to the current room, effectively dropping it there.
    dropItem: (gameEvent) ->
      Inventory.remove gameEvent.item
      gameEvent.item.location = Room.current.name
      $(document).trigger "resetMenus"

    # Remove the item from the game and set its location to nil, effectively removing it from the gameworld. It's still available in the Item list if it needs to pop back into existence later.
    removeItem: (gameEvent) ->
      Inventory.remove gameEvent.item
      Item.allById[gameEvent.item].location = undefined 
      $(document).trigger "resetMenus"

    updateAttribute: (gameEvent) ->
      Item.allById[gameEvent.item][gameEvent.attribute] = gameEvent.newValue
      $(document).trigger "resetMenus"

    # A winner is you!  We need some sort of joy-enhancing user experience here, as there's nothing special going on here at the moment.
    instantVictory: (gameEvent) ->
      console.log "THE GAME IS WON"

    # Entirely blows away the `items` specified in the gameEvent which is passed in, and replaces them with the `newItem`.  Should work with items in the Inventory, in the room, or a mix between the two.  If any of the old items were in the user's Inventory, the new item will appear there as well.
    replaceItems: (gameEvent) ->
      oldItemsWereInInventory = false
      _(gameEvent.items).each (itemId, index) ->
        oldItemsWereInInventory = true if Inventory.remove(itemId)
        delete Item.allById[itemId] if Item.allById[itemId]

      newItem = gameEvent.newItem
      newItem.location = Room.current.name
      Item.allById[newItem.id] = newItem
      Inventory.add newItem  if oldItemsWereInInventory
      $(document).trigger "resetMenus"

  #### DOM Event binding

  # This is the generic event listener for all Game Events. An 'action' (verb + noun) object is passed along, and if the `after` event therein exists in `@allById`, it's passed to the function specified by its type. 
  $(document).bind "gameEvent", (e, action) ->
    if afterEvent = GameEvent.allById[action["after"]]
      $(document).trigger "updateStatus", afterEvent.message if afterEvent.message
      GameEvent[afterEvent.type] afterEvent
      
  # Return the GameEvent module, so it can be required by others.
  GameEvent