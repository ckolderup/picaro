define(["jquery", "vendor/underscore"], function($) {
  var GameEvent = {
    allById: {},

    takeItem : function(gameEvent) {
      $(document).trigger("updateStatus", gameEvent.message);
      $(document).trigger("immediateTake", gameEvent)
    },

    instantVictory: function(gameEvent) {
      $(document).trigger("updateStatus", gameEvent.message);
    }

  }

  // Event binding
  $(document).bind('gameEvent', function(e, using) {
    var afterEvent = GameEvent.allById[using['after']];
    if (afterEvent) {
      GameEvent[afterEvent.type](afterEvent)
    }
  })

  return GameEvent
})