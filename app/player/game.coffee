define ->
  class Game
    constructor: (@name, @author, @version, @authorURL) ->

    @init: (@data) ->
      @current = new Game(data.gameName, data.author, data.version, data.authorURL)