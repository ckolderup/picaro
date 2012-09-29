define ->
  class Game
    constructor: (@name, @author, @version, @authorURL, @inlineActions) ->

    @init: (@data) ->
      @current = new Game(data.gameName, data.author, data.version, data.authorURL, data.inlineActions)

    unaryVerbs: ['look', 'take', 'talk', 'attack']

    binaryVerbs: ['use']