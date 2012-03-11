#Picaro Player
#==============

# This file declares the top-level dependencies of the Player app, as well as the code which fetches game data and bootstraps the gameworld.
require [ "jquery", "util", "room", "inventory", "item", "ui", "game_event", "action_guard", "itemish", "vendor/underscore" ], ($, Util, Room, Inventory, Item, UI, GameEvent, ActionGuard, Itemish) ->
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
            item = new Itemish item, id
            item.location = room.id
            gameItems[item.id] = item

        # We look for special items here (currently just the player's "Self" object) and add them to the list of game items; these are not attached to any room and probably should be handled in a less specialized way.
        if data.specialItems and data.specialItems.self
          gameItems.self = data.specialItems.self

        # Initialize the main datatypes.
        GameEvent.init data.events
        ActionGuard.init data.actionGuards
        Item.init gameItems
        Room.init startingRoom

        # Finally, initialize the user interface.
        UI.init(data.gameName)

      error: (e) ->
        window.alert "Yikes! Picaro couldn't find or parse the game JSON.", e