define [ "jquery", "item", "inventory", "room", "vendor/underscore" ], ($, Item, Inventory, Room) ->
  GameEvent =
    allById: {}

    init: (events) ->
      _.each events, (event) ->
        @allById[gameEvent.id] = event

    takeItem: (gameEvent) ->
      $(document).trigger "updateStatus", gameEvent.message
      $(document).trigger "immediateTake", gameEvent

    dropItem: (gameEvent) ->
      $(document).trigger "updateStatus", gameEvent.message
      Inventory.remove gameEvent.item
      gameEvent.item.location = Room.current.name
      $(document).trigger "resetMenus"

    instantVictory: (gameEvent) ->
      $(document).trigger "updateStatus", gameEvent.message

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

  $(document).bind "gameEvent", (e, using) ->
    afterEvent = GameEvent.allById[using["after"]]
    GameEvent[afterEvent.type] afterEvent  if afterEvent

  GameEvent