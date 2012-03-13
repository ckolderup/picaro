
define(function() {
  var Game;
  return Game = (function() {

    function Game(name, author, version) {
      this.name = name;
      this.author = author;
      this.version = version;
    }

    Game.init = function(data) {
      this.data = data;
      return this.current = new Game(data.gameName, data.author, data.version);
    };

    return Game;

  })();
});
