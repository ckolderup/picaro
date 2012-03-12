define [ "jquery", "util", "inventory", "talk", "action_guard", "vendor/underscore" ], ($, Util, Inventory, Talk, ActionGuard) ->
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
    actionLook: ->
      action = this.look
      if typeof action is "string"
        $(document).trigger "updateStatus", action
      else if action instanceof Array
        @lookNum ||= 0
        $(document).trigger "updateStatus", action[@lookNum]
        @lookNum += 1  if action.length > (@lookNum + 1)
      else
        $(document).trigger "updateStatus", action.message
        $(document).trigger "gameEvent", action if action.after

    actionTalk: (item) ->
      $(document).trigger "beginTalk", this

    actionAttack: ->
      @attackNum ||= 0
      $(document).trigger "updateStatus", @attack[@attackNum]
      @attackNum += 1 if @attack.length > (@attackNum + 1)

    # Add the item to the Inventory- skips any guards that might be in place.
    immediateTake: ->
      Inventory.add this
      $(document).trigger "itemTaken", this
      $(document).trigger "closeMenu"
      $(document).trigger "gameEvent", @take if @take.after

    actionTake: ->
      if @canTake() then @immediateTake() else @willNotTake()

    canTake: ->
      if @take is true
        true
      else if @take and @take.actionGuard
        ActionGuard.test @take
      else
        false

    willNotTake: ->
      message = "You can't take the " + @name + ". "
      message += @take.cannotTakeMessage if @take and @take.cannotTakeMessage
      $(document).trigger "updateStatus", message

    # This method first looks up the two item IDs passed as arguments.  Then, if the second item has a Use property mentioning the first, it checks if this action is guarded and fires it if not.
    actionUse: (otherItem) ->
      if otherItem and otherItem.use and using = otherItem.use[this.id]
        $(document).trigger "gameEvent", using if not using.actionGuard or ActionGuard.test(using)
      else
        $(document).trigger "updateStatus", "You can't use those things together."

  #### DOM Event binding

  # The current crop of 5 actions are bound here.
  $(document).bind "actionTalk", (e, item) -> item.actionTalk()
  $(document).bind "actionAttack", (e, item) -> item.actionAttack()
  $(document).bind "actionLook", (e, item) -> item.actionLook()
  $(document).bind "actionUse", (e, item, otherItem) -> item.actionUse(otherItem)
  $(document).bind "actionTake", (e, item) -> item.actionTake()

  # Other item actions not directly resulting from user action.
  $(document).bind "immediateTake", (e, item) -> item.immediateTake()

  Item