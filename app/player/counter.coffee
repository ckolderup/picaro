define [ "jquery", "vendor/underscore" ], ($) ->
  Counter = {
    init: (counters) ->
      @all = counters
  }

  Counter