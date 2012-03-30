
define(["game_event", "game", "jquery"], function(GameEvent, Game, $) {
  var testDoc;
  testDoc = $(document);
  setFixtures($("<div id='game'></div>"));
  return describe("endGame", function() {
    beforeEach(function() {
      return Game.current = {
        gameName: "Test Game"
      };
    });
    return it("adds a special message", function() {
      return testDoc.trigger("endGame");
    });
  });
});
