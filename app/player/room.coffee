define [ "jquery", "item", "inventory", "util", "vendor/underscore" ], ($, Item, Inventory, Util) ->
  Room =
    allById: {}

    init: (startingRoom) ->
      @current = startingRoom
      roomItems = Item.findByRoom(startingRoom)
      $(document).trigger "changeRoom",
        room: startingRoom
        items: roomItems

    starter: ->
      _(@allById).find (room) -> room.starter is true

    find: (id) ->
      @allById[id]

    findByName: (name) ->
      _(@allById).find (room) -> room.name is name

    get: (room, roomItems) ->
      $("#move a").attr "href", "#"
      $("#move li").addClass "disabled"
      for direction, roomId of room.paths
        id = Util.toIdString roomId
        switch direction
          when "North", "N"
            $("#move-compass-north a").attr "href", id
            $("#move-compass-north, #move-compass-north a").removeClass "disabled"
          when "South", "S"
            $("#move-compass-south a").attr "href", id
            $("#move-compass-south, #move-compass-south a").removeClass "disabled"
          when "East", "E"
            $("#move-compass-east a").attr "href", id
            $("#move-compass-east, #move-compass-east a").removeClass "disabled"
          when "West", "W"
            $("#move-compass-west a").attr "href", id
            $("#move-compass-west, #move-compass-west a").removeClass "disabled"

  $(document).bind "roomReady", (e, room) ->
    roomItems = _(Item.find).filter (item, id) -> item.location is room.id
    Room.get room, roomItems

  Room