define [ "jquery", "item", "inventory", "util", "vendor/underscore" ], ($, Item, Inventory, Util) ->
  Room =
    allById: {}

    construct: (id, room) ->
      room.name ||= id
      room.id = Util.toIdString id
      Room.allById[room.id] = room

    init: (startingRoom) ->
      @current = startingRoom
      $(document).trigger "changeRoom",
        room: startingRoom
        items: Item.findByRoom(@current)

    starter: ->
      _(@allById).find (room) -> room.starter is true

    find: (id) ->
      @allById[id]

    findByName: (name) ->
      _(@allById).find (room) -> room.name is name

  Room