#Picaro Player
#==============

# This file declares the top-level dependencies of the Player app, as well as the code which fetches game data and bootstraps the gameworld.
require [ "jquery", "util", "room", "inventory", "item", "ui", "game_event", "action_guard", "vendor/underscore" ], ($, Util, Room, Inventory, Item, UI, GameEvent, ActionGuard) ->
  $(document).ready ->
    startingRoom = undefined
    gameItems = {}

    # Fetch the JSON file as specified by the slug embedded in the page.
    $.ajax
      url: "/games/" + gameId
      dataType: "json"
      async: false
      success: (data) ->
        for id, room of data.rooms
          room.id = Util.toIdString id
          room.name ||= id
          startingRoom = room if room.starter
          Room.allById[room.id] = room

          _(room.items).map (item, id) ->
            Item.create(item, id: id, location: room.id)

        # These are items not attached to a specific room- most notably the "self" item which represents the player.
        for id, item of data.unattachedItems
          Item.create item, id: id

        # Initialize the main datatypes.
        GameEvent.init data.events
        ActionGuard.init data.actionGuards
        Room.init startingRoom

        # Finally, initialize the user interface.
        UI.init(data.gameName)

      error: (e) ->
        window.alert "Yikes! Picaro couldn't find or parse the game JSON.", e