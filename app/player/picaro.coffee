#Picaro Player
#==============

# This file declares the top-level dependencies of the Player app, as well as the code which fetches game data and bootstraps the gameworld.
require [ "jquery", "game", "util", "room", "inventory", "item", "ui", "game_event", "action_guard", "vendor/underscore" ], ($, Game, Util, Room, Inventory, Item, UI, GameEvent, ActionGuard) ->

  $(document).ready ->
    window.alert "Yikes! Picaro couldn't find or parse the game data." unless typeof window.game_source is 'object'
    data = window.game_source
    startingRoom = undefined

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
    Game.init data

    # Finally, initialize the user interface.
    UI.init(data.gameName)
