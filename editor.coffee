$(document).ready ->
  class AppRouter extends Backbone.Router
    routes:
      '*id': "defaultRoute"

  class RecordView extends Backbone.View
    tagName: 'li'

    events:
      "click .record-button": "select"

    initialize: ->
      @model.bind 'change', @render, @
      @model.bind 'destroy', @remove, @

    render: ->
      @$el.html '<a class="record-button">' + @model.get('title') + '</a>'
      @

    select: ->
      window.App.record = @model
      window.App.render()

  class EditView extends Backbone.View
    tagName: 'div'

    events:
      "click #save": "save"

    initialize: ->
      @model.bind 'destroy', @remove, @

    render: ->
      html = 'Title: <input type="text" class="title" value="' + @model.get('title') + '">'
      html += '<ul>'
      for event in @model.get 'events'
        html += '<li><ul class="event">'
        html += '<li>URL: <input type="text" class="url" value="' + event.url + '"></li>'
        html += '<li>Target: <input type="text" class="target" value=\'' + event.target + '\'></li>'
        html += '<li>Type: <input type="text" class="type" value="' + event.type + '"></li>'
        html += '<li>Value: <input type="text" class="value" value="' + event.value + '"></li>'
        html += '</ul></li>'
      html += '</ul>'
      html += '<a class="btn btn-primary" id="save">Save</a>'
      @$el.html html
      @

    save: ->
      events = []
      for event in @$el.find '.event'
        event = $ event
        events.push
          url: (event.find '.url').val()
          target: (event.find '.target').val()
          type: (event.find '.type').val()
          value: (event.find '.value').val()
      @model.save title: (@$el.find '.title').val()
      @model.save events: events

  class AppView extends Backbone.View
    el: $ '#app'

    initialize: ->
      window.Database.bind 'add', @addOne, @
      window.Database.bind 'reset', @addAll, @
      window.Database.bind 'all', @render, @
      window.Database.fetch()

    render: ->
      $('#record-list').html ''
      window.Database.each @addOne
      if @record
        record = @record
        view = new EditView model: record
        console.log view
        $('#edit-record').html view.render().el

    addOne: (record) ->
      view = new RecordView model: record
      $('#record-list').append view.render().el

  router = window.router = new AppRouter

  App = window.App = new AppView
  window.RecordView = RecordView
  App.render()

  router.on 'route:defaultRoute', (id) ->
    window.Database.fetch()
    record = window.Database.get id
    App.record = record
    App.render()
    console.log record

  Backbone.history.start()

