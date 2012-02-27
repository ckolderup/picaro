define [ "jquery", "vendor/underscore" ], ($) ->
  Talk = {}

  Talk.currentConversation = {}

  Talk.prompt = (question) ->
    $(document).trigger "askQuestion", question

  Talk.askQuestions = (node) ->
    Talk.currentConversation = node.children
    Talk.prompt message: node.message, responses: node.children

  Talk.answerQuestion = (answerIndex) ->
    choice = Talk.currentConversation[answerIndex]
    if _.isObject(choice)
      whatsNext = choice.children[0]
      if whatsNext and whatsNext.children and whatsNext.children.length
        Talk.askQuestions whatsNext
      else
        Talk.over whatsNext
    else
      Talk.over message: "... that was not an option"

  Talk.over = (lastNode) ->
    message = if lastNode then lastNode.message else "<i>The Converstation drifts into silence.</i>"
    $(document).trigger "updateCharacterDialog", message
    $(document).trigger "endTalk"
    Talk.currentConversation = {}

  $(document).bind 'beginTalk', (event, item) ->
    Talk.askQuestions item.talk

  Talk