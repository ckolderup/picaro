
define(function() {
  var Game;
  return Game = (function() {

    Game.name = 'Game';

    function Game(name, author, version, authorURL, inlineActions) {
      this.name = name;
      this.author = author;
      this.version = version;
      this.authorURL = authorURL;
      this.inlineActions = inlineActions;
    }

    Game.init = function(data) {
      this.data = data;
      return this.current = new Game(data.gameName, data.author, data.version, data.authorURL, data.inlineActions);
    };

    Game.prototype.unaryVerbs = ['look', 'take', 'talk', 'attack'];

    Game.prototype.binaryVerbs = ['use'];

    return Game;

  })();
});
