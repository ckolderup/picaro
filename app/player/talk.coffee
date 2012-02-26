define [ "jquery", "vendor/underscore" ], ($) ->
  Convo = {}
  Convo.askQuestions = (n) ->
    question =
      message: n.name
      responses: n.children

    Convo.prompt question

  Convo.prompt = (question) ->
    $(document).trigger "askQuestion", question

  Convo.answerQuestion = (answerIndex, nodes) ->
    console.log "answerQuestion", nodes
    choice = nodes[answerIndex]
    debugger
    if _.isObject(choice)
      whatsNext = choice.children[0]
      if whatsNext and whatsNext.children and whatsNext.children.length
        Convo.askQuestions whatsNext
      else
        Convo.over whatsNext
    else
      convoOver name: "... that was not an option"

  Convo.over = (lastNode) ->
    if lastNode and lastNode.name
      console.log "Lst node!", lastNode.name
    else
      console.log "Game over, man"
    1

  Convo.onErr = (err) ->
    console.log "ERROR!!", err
    0

  $(document).bind "askQuestion", (e, question) ->
    console.log "askQuestion", question
    $("#action-talk-character-message").html question.message
    _.each question.responses, (response, index) ->
      console.log "response", response, index
      $("#action-talk-player ul").append $("<li><span class=\"playerTalkResponse\" data-response-id=\"" + index + "\" >" + response.name + "</></li>")

  Convo