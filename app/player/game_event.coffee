# Game Events
# ==============
# The primary way in which the gameworld responds to player action is via events.  Currently, an "after" event is all that's specified, but at some point we will likely add "before" events or events that occur after some period of time has elapsed. The idea is that an event ID can be attached to any action (a verb called on an item) as its "after" property.  When an action (generally, anything of the form "verb + noun") is performed, the event will be looked up and triggered here if it is one of the known types.

# First we declare our dependencies on Item, Inventory and Room, as well as the usual suspects, $ and _.
define [ "jquery", "game", "item", "inventory", "room", "util", "vendor/underscore"], ($, Game, Item, Inventory, Room, Util) ->
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
      item = Item.find Util.toIdString(gameEvent.item)
      $(document).trigger "immediateTake", item

    # Removes the item from inventory and sets its location to the current room, effectively dropping it there.
    dropItem: (gameEvent) ->
      Inventory.remove gameEvent.item
      gameEvent.item.location = Room.current.name
      $(document).trigger "resetMenus"

    # Remove the item from the game and set its location to nil, effectively removing it from the gameworld. It's still available in the Item list if it needs to pop back into existence later.
    removeItem: (gameEvent) ->
      Inventory.remove gameEvent.item
      Item.find(gameEvent.item).location = undefined
      $(document).trigger "resetMenus"

    # Take the item specified and replace the named attribute with a new value; this might be just a string replacement, or swapping in a complex object.
    updateAttribute: (gameEvent) ->
      Item.find(gameEvent.item)[gameEvent.attribute] = gameEvent.newValue
      $(document).trigger "resetMenus"

    # Triggers the UI to disable itself and show the end-game message.
    endGame: (gameEvent) ->
      gameName = Game.current.name || "a mysteriously un-named Picaro Game"
      gameAuthor = Game.current.author || "Anonymous"

      $(document).trigger "gameOver", "This has been #{gameName}, by #{gameAuthor}."

    # Entirely blows away the `items` specified in the gameEvent which is passed in, and replaces them with the `newItem`.  Should work with items in the Inventory, in the room, or a mix between the two.  If any of the old items were in the user's Inventory, the new item will appear there as well.
    replaceItems: (gameEvent) ->
      oldItemsWereInInventory = false
      _(gameEvent.items).each (itemId, index) ->
        id = Util.toIdString itemId
        oldItemsWereInInventory = true if Inventory.remove id
        Item.remove id

      newItem = Item.create(gameEvent.newItem, location: Room.current.id)
      if oldItemsWereInInventory
        Inventory.add newItem
      $(document).trigger "resetMenus"

  #### DOM Event binding

  # This is the generic event listener for all Game Events. An 'action' (verb + noun) object is passed along, and if the `after` event therein exists in `@allById`, it's passed to the function specified by its type.
  $(document).bind "gameEvent", (e, action) ->
    if afterEvent = GameEvent.allById[action["after"]]
      $(document).trigger "updateStatus", afterEvent.message if afterEvent.message
      GameEvent[afterEvent.type](afterEvent)

  # Return the GameEvent module, so it can be required by others.
  GameEvent