define [ "jquery", "util", "inventory", "action_guard", "talk", "vendor/underscore" ], ($, Util, Inventory, ActionGuard, Talk) ->
  class Item
    constructor: (itemObject, id) ->
      # Either an id for this Item is passed as a second argument, or it's the top-level key of the object passed at the first argument.
      id ||= _(itemObject).keys()[0]

      # We iterate across the keys of the passed-in itemObject, assigning them to our new Item instance.
      this[key] = value for key, value of itemObject[id] || itemObject

      # If no name is set, we use the id. We then convert the id to a more easily embedded format- camelcased and HTML-escaped
      @name ||= id
      @id = Util.toIdString id

      for actionType in ["use"]
        if typeof this[actionType] is "object"
          action = this[actionType]
          for key in _(action).keys()
            action[Util.toIdString key] = action[key]
            # delete action[key]

    @allById: {}

    # Takes a room object and returns all items whose `location` is the same as its name.
    @findByRoom: (room) ->
      _.filter @allById, (item, id) ->
        item.location is room.id

    # Takes a room object and returns all items whose `location` is the same as its name.
    @find: (id) -> @allById[id]

    # Removes the specified item from the internal map- the item no longer exists in the game.
    @remove: (id) -> delete @allById[id]

    # Takes an itemData
    @create: (itemData, extraData) ->
      if extraData
        id = extraData.id
        location = extraData.location

      item = new Item(itemData, id)
      item.location ||= location
      throw "Duplicate item!" if @allById[item.id]?
      @allById[item.id] = item

    # Checks the item's look action. If it's an Array, it assumes there will be a `lookNum` as an index. If it's a String, simply display that message. Lastly, if it's an Object, it will display its message and optionally fire an after event.
    @look: (item) ->
      action = item.look
      if typeof action is "string"
        $(document).trigger "updateStatus", action
      else if action instanceof Array
        item.lookNum ||= 0
        $(document).trigger "updateStatus", action[item.lookNum]
        item.lookNum += 1  if action.length > (item.lookNum + 1)
      else
        $(document).trigger "updateStatus", action.message
        $(document).trigger "gameEvent", action if action.after

    @talk: (item) ->
      # $(document).trigger "updateStatus", item.talk[item.talkNum]
      # item.talkNum += 1 if item.talk.length > (item.talkNum + 1)

    @attack: (item) ->
      $(document).trigger "updateStatus", item.attack[item.attackNum]
      item.attackNum += 1 if item.attack.length > (item.attackNum + 1)

    # Add the item to the Inventory.
    @take: (item) ->
      Inventory.add item
      $(document).trigger "itemTaken", item
      $(document).trigger "closeMenu"
      $(document).trigger "gameEvent", item.take if item.take.after

    @tryToTake: (item) ->
      if @canTake item then @take item else @willNotTake item

    @canTake: (item) ->
      if item.take is true
        true
      else if item.take and item.take.actionGuard
        ActionGuard.test item.take
      else
        false

    @willNotTake: (item) ->
      message = "You can't take the " + item.name + ". "
      message += item.take.cannotTakeMessage if item.take and item.take.cannotTakeMessage
      $(document).trigger "updateStatus", message

    @immediateTake: (gameEvent) ->
      item = Item.find gameEvent.item
      Item.take item

    # This method first looks up the two item IDs passed as arguments.  Then, if the second item has a Use property mentioning the first, it checks if this action is guarded and fires it if not.
    @use: (itemId1, itemId2) ->
      [item1, item2] = [@allById[itemId1], @allById[itemId2]]
      if item1 and item2 and item2.use and item2.use[item1.id]
        using = item2.use[item1.id]
        $(document).trigger "gameEvent", using if not using.actionGuard or ActionGuard.test(using)
      else
        $(document).trigger "updateStatus", "You can't use those things together."

  #### DOM Event binding

  # The current crop of 5 actions are bound here.
  $(document).bind "actionTalk", (e, id) ->
    $(document).trigger "beginTalk", Item.find(id)

  $(document).bind "actionAttack", (e, o) ->
    Item.attack o

  $(document).bind "actionLook", (e, o) ->
    Item.look o

  # Notice that Use takes two items as arguments, while the others take only one.
  $(document).bind "actionUse", (e, item1, item2) ->
    Item.use item1, item2

  $(document).bind "actionTake", (e, o) ->
    Item.tryToTake o

  $(document).bind "immediateTake", (e, o) ->
    Item.immediateTake o

  Item