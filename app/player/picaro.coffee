require [ "jquery", "util", "room", "inventory", "item", "ui", "game_event", "action_guard", "vendor/underscore" ], ($, Util, Room, Inventory, Item, UI, GameEvent, ActionGuard) ->
  $(document).ready ->
    startingRoom = undefined
    gameItems = {}
    uuid = 0

    $.ajax
      url: "/../game_data/" + gameId + ".json"
      dataType: "json"
      async: false
      success: (data) ->
        for i of data.rooms
          room = data.rooms[i]
          startingRoom = room if room.starter
          Room.all.push room
          for k of room.items
            item = room.items[k]
            item.id = uuid++ unless item.id
            item.location = room.name
            gameItems[item.id] = item

        # shouldn't be a special case for this. starting to question if items really should be nested under rooms... hmm
        if data.specialItems and data.specialItems.self
          gameItems.self = data.specialItems.self

        _.each data.events, (gameEvent) ->
          GameEvent.allById[gameEvent.id] = gameEvent

        _.each data.actionGuards, (actionGuard) ->
          ActionGuard.allById[actionGuard.id] = actionGuard

        Item.init gameItems
        Room.init startingRoom
        UI.init(data.gameName)

      error: (e) ->
        window.alert "Yikes! Picaro couldn't find or parse the game JSON.", e