
define(["jquery", "room", "vendor/underscore"], function($, Room) {
  var Editor;
  Editor = {
    saveGameButton: $('.btn.save-game'),
    form: $('#form'),
    codeTextArea: $('#code'),
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
      if (room.drawn) {
        return;
      }
      room.drawn = true;
      positionOffset = 125;
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
        return this.drawRoom(Room.starter().name, 75, 100);
      } else {
        return Editor.yamlIsValid(false);
      }
    }
  };
  $(function() {
    var mirror;
    Editor.saveGameButton.click(function() {
      console.log('yayuh');
      return Editor.submitForm.trigger('submit');
    });
    $('#yaml-indicator').tooltip({
      placement: 'left'
    });
    mirror = CodeMirror.fromTextArea(document.getElementById("code"), {
      mode: "yaml",
      theme: "monokai",
      onChange: function(mirror, changes) {
        var jsGameObject;
        mirror.save();
        try {
          jsGameObject = jsyaml.load(mirror.getTextArea().value || '');
          return Editor.resetGameData(jsGameObject);
        } catch (error) {
          return Editor.resetGameData(false);
        }
      }
    });
    return Editor.resetGameData(jsyaml.load(Editor.codeTextArea.html()));
  });
  return Editor;
});
