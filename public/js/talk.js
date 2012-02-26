
define(["jquery", "vendor/underscore"], function($) {
  var Convo;
  Convo = {};
  Convo.askQuestions = function(n) {
    var question;
    question = {
      message: n.name,
      responses: n.children
    };
    return Convo.prompt(question);
  };
  Convo.prompt = function(question) {
    return $(document).trigger("askQuestion", question);
  };
  Convo.answerQuestion = function(answerIndex, nodes) {
    var choice, whatsNext;
    console.log("answerQuestion", nodes);
    choice = nodes[answerIndex];
    debugger;
    if (_.isObject(choice)) {
      whatsNext = choice.children[0];
      if (whatsNext && whatsNext.children && whatsNext.children.length) {
        return Convo.askQuestions(whatsNext);
      } else {
        return Convo.over(whatsNext);
      }
    } else {
      return convoOver({
        name: "... that was not an option"
      });
    }
  };
  Convo.over = function(lastNode) {
    if (lastNode && lastNode.name) {
      console.log("Lst node!", lastNode.name);
    } else {
      console.log("Game over, man");
    }
    return 1;
  };
  Convo.onErr = function(err) {
    console.log("ERROR!!", err);
    return 0;
  };
  $(document).bind("askQuestion", function(e, question) {
    console.log("askQuestion", question);
    $("#action-talk-character-message").html(question.message);
    return _.each(question.responses, function(response, index) {
      console.log("response", response, index);
      return $("#action-talk-player ul").append($("<li><span class=\"playerTalkResponse\" data-response-id=\"" + index + "\" >" + response.name + "</></li>"));
    });
  });
  return Convo;
});
