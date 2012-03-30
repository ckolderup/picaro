define [ "game_event", "game", "jquery"], (GameEvent, Game, $) ->
  testDoc = $(document)
  setFixtures $("<div id='game'></div>")

  describe "endGame", ->
    beforeEach ->
      Game.current = {
        gameName: "Test Game"
      }

    # TODO: reenable this spec
    it "adds a special message", ->
      testDoc.trigger "endGame"
      # expect(testDoc.find("p.end").length).toBeGreaterThan 0
