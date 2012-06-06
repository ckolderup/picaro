
define(["jquery", "room", "util", "vendor/underscore"], function($, Room, util) {
  var Editor;
  Editor = {
    saveGameButton: $('#save-game'),
    form: $('form#game'),
    codeTextArea: document.getElementById("code"),
    yamlIsValid: function(valid, errorObject) {
      if (this.yamlIndicator == null) {
        this.yamlIndicator = $('#yaml-indicator');
      }
      if (valid) {
        this.yamlIndicator.removeClass('badge-warning');
        this.yamlIndicator.addClass('badge-success');
        return this.preventSave(false);
      } else {
        this.yamlIndicator.addClass('badge-warning');
        this.yamlIndicator.removeClass('badge-success');
        this.preventSave(true);
        return console.log("Game not parsing so good at this point:", errorObject);
      }
    },
    preventSave: function(gameInSaveableState) {
      return this.saveGameButton.attr('disabled', gameInSaveableState);
    },
    drawRoom: function(roomName, x, y) {
      var destination, direction, item, itemDots, positionOffset, room, roomDiv, _i, _len, _ref, _ref1, _results;
      room = Room.findByName(roomName);
      if (!room || (room.drawn != null)) {
        return;
      }
      room.drawn = true;
      positionOffset = 125;
      $(".section-visual").scrollTop(650).scrollLeft(650);
      roomDiv = $("<div data-room-id='" + room.name + "' data-content='" + (_.escape(room.description)) + "' class='room'><h4>" + room.name + " </h3></div>");
      if (room.starter) {
        roomDiv.append('&#9823;');
      }
      roomDiv.popover({
        placement: 'right',
        title: roomName,
        animation: false
      });
      if (room.items) {
        itemDots = '';
        _ref = room.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          itemDots += "&#9817;";
        }
        roomDiv.append(itemDots);
      }
      roomDiv.css("left", x).css('top', y);
      $(".rooms").append(roomDiv);
      _ref1 = room.paths;
      _results = [];
      for (direction in _ref1) {
        destination = _ref1[direction];
        switch (direction) {
          case "North":
          case "N":
            _results.push(this.drawRoom(destination, x, y - positionOffset));
            break;
          case "South":
          case "S":
            _results.push(this.drawRoom(destination, x, y + positionOffset));
            break;
          case "East":
          case "E":
            _results.push(this.drawRoom(destination, x + positionOffset, y));
            break;
          case "West":
          case "W":
            _results.push(this.drawRoom(destination, x - positionOffset, y));
            break;
          default:
            _results.push(void 0);
        }
      }
      return _results;
    },
    resetGameData: function(game) {
      var id, room, _ref;
      if (game && game.rooms) {
        Editor.yamlIsValid(true);
        _ref = game.rooms;
        for (id in _ref) {
          room = _ref[id];
          Room.construct(id, room);
        }
        $('.game-name').html(game.gameName);
        $("#roomNum").html(game.rooms.length);
        $(".rooms").empty();
        return this.drawRoom(Room.starter().name, 900, 900);
      } else {
        return Editor.yamlIsValid(false);
      }
    },
    initCodeMirror: function(mode) {
      var mirror;
      return mirror = CodeMirror.fromTextArea(Editor.codeTextArea, {
        mode: mode,
        theme: "monokai",
        onChange: function(mirror, changes) {
          var jsGameObject;
          mirror.save();
          try {
            jsGameObject = jsyaml.load(Editor.codeTextArea.value);
            return Editor.resetGameData(jsGameObject);
          } catch (error) {
            return Editor.resetGameData(false);
          }
        }
      });
    },
    initPlaintextUpdate: function() {
      var updateGame;
      updateGame = function(v, e) {
        var jsGameObject;
        try {
          jsGameObject = jsyaml.load(Editor.codeTextArea.value);
          return Editor.resetGameData(jsGameObject);
        } catch (error) {
          return Editor.resetGameData(false);
        }
      };
      Editor.codeTextArea.onkeyup = updateGame;
      return Editor.codeTextArea.blur = updateGame;
    }
  };
  $(function() {
    var mode;
    Editor.resetGameData(jsyaml.load(Editor.codeTextArea.value));
    $('#yaml-indicator').tooltip({
      placement: 'left',
      delay: {
        show: 200,
        hide: 1000
      }
    });
    mode = util.getQueryParams()["mode"] || 'text';
    if (mode === 'plain') {
      return Editor.initPlaintextUpdate();
    } else {
      return Editor.initCodeMirror(mode);
    }
  });
  return Editor;
});
