#Picaro Player
#==============

# This files serves to declare the top-level dependencies of the Player interface, as well as the code which fetches game data and bootstraps the gameworld.

require [ "jquery", "util", "room", "inventory", "item", "ui", "game_event", "action_guard", "vendor/underscore" ], ($, Util, Room, Inventory, Item, UI, GameEvent, ActionGuard) ->
  $(document).ready ->
    startingRoom = undefined
    gameItems = {}
    uuid = 0

# Here we look up a JSON file as specified by the slug embedded in the page.
    $.ajax
      url: "/../game_data/" + gameId + ".json"
      dataType: "json"
      async: false
      success: (data) ->
        for room of data.rooms
          startingRoom = room if room.starter
          Room.all.push room
          for k of room.items
            item = room.items[k]
            item.id = uuid++ unless item.id
            item.location = room.name
            gameItems[item.id] = item

        # We look for special items here (currently just the player's "Self" object) and add them to the list of game items; these are not attached to any room and probably should be handled in a less specialized way.
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