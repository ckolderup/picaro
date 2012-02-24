define [ "jquery", "item", "inventory", "room", "vendor/underscore" ], ($, Item, Inventory, Room) ->
  GameEvent =
    allById: {}

    init: (events) ->
      _.each events, (event) ->
        @allById[gameEvent.id] = event

    updateStatus: (gameEvent) ->

    takeItem: (gameEvent) ->
      $(document).trigger "immediateTake", gameEvent

    dropItem: (gameEvent) ->
      Inventory.remove gameEvent.item
      gameEvent.item.location = Room.current.name
      $(document).trigger "resetMenus"

    removeItem: (gameEvent) ->
      Inventory.remove gameEvent.item
      Item.allById[gameEvent.item].location = undefined 
      $(document).trigger "resetMenus"

    updateAttribute: (gameEvent) ->
      Item.allById[gameEvent.item][gameEvent.attribute] = gameEvent.newValue
      $(document).trigger "resetMenus"

    instantVictory: (gameEvent) ->
      console.log "THE GAME IS WON"

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
    if afterEvent
      $(document).trigger "updateStatus", afterEvent.message if afterEvent.message
      GameEvent[afterEvent.type] afterEvent

  GameEvent