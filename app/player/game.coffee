define ->
  class Game
    constructor: (@name, @author, @version) ->

    @init: (@data) ->
      @current = new Game(data.gameName, data.author, data.version)