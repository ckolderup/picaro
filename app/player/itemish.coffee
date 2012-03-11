define ['util', 'vendor/underscore'], (Util) ->

  class Itemish
    constructor: (itemObject, id) ->
      id ||= _(itemObject).keys()[0]
      this[key] = value for key, value of itemObject[id] || itemObject
      @name ||= id
      @id = Util.toIdString id

      for actionType in ["use"]
        if typeof this[actionType] is "object"
          action = this[actionType]
          for key in _(action).keys()
            action[Util.toIdString key] = action[key]
            # delete action[key]

    @all: ->
      console.log "Classy"