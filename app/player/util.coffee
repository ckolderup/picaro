define [ "jquery" ], ($) ->

  arrayToSentence: (array, options = {}) ->
    separator = options.separator or ", "
    lastSeparator = options.lastSeparator || " and "
    string = ""

    for word, i in array
      firstLetter = word[0]
      if firstLetter.toUpperCase() is firstLetter
        vowels = "AEIOU".split('')
        if _.include vowels, firstLetter
          string += "an "
        else
          string += "a "
      string += word
      firstLetter = word[0]
      if i is array.length - 2
        string += lastSeparator
      else string += separator  if i < array.length - 1
    string + "."

  arrayEquality: (a, b) ->
    if a.length is b.length
      i = 0
      while i < a.length
        if typeof a[i] is "object"
          return false unless Equals(a[i], b[i])
        else return false unless a[i] is b[i]
        i++
      true
    else
      false

  toIdString: (string) ->
    escape string.replace /[-\s](.)?/g, (match, chr) ->
      if chr then chr.toUpperCase() else ''
    .replace /^[A-Z]/, (chr) ->
      if chr then chr.toLowerCase() else chr

  createId: (object) ->
    object.id || object.name

  actionId: (item, action) ->
    action + "-" + item.id

  splitActionId: (domNode) ->
    $(domNode).data("action-id").split "-"

  getQueryParams: ->
    queryString = location.search.replace('?', '').split('&')
    queryObj = {}

    for piece in queryString
      name = piece.split('=')[0];
      value = piece.split('=')[1];
      queryObj[name] = value;
    queryObj

  # from http://coffeescriptcookbook.com/chapters/classes_and_objects/type-function
  typeOf: (obj) ->
    if obj == undefined or obj == null
      return String obj
    classToType = new Object
    for name in "Boolean Number String Function Array Date RegExp".split(" ")
      classToType["[object " + name + "]"] = name.toLowerCase()
    myClass = Object.prototype.toString.call obj
    if myClass of classToType
      return classToType[myClass]
    return "object"