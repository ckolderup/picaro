define ['vendor/underscore'],
  # A private hash of items.
  _items: {}

  # Takes an item object and adds it to the internal _items store, hashed by ID.
  add: (item) ->
    @_items[item.id] = item

  # If an item with the passed ID exists in inventory, removes it.
  remove: (itemId) ->
    if @include itemId
      delete @_items[itemId]
      true

  # Exposes an array of objects we have in our inventory.
  list: ->
    _.values(@_items)

  # Find the item specified by the passed ID and return it.
  get: (itemId) ->
    @_items[itemId]

  # Checks if an item with this ID exists in inventory.
  include: (itemId) ->
    @get(itemId)?

  # Returns the number of items held.
  size: ->
    _.size(@_items)