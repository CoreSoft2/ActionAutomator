// Generated by CoffeeScript 1.4.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $(document).ready(function() {
    var App, AppRouter, AppView, EditView, RecordView, router;
    AppRouter = (function(_super) {

      __extends(AppRouter, _super);

      function AppRouter() {
        return AppRouter.__super__.constructor.apply(this, arguments);
      }

      AppRouter.prototype.routes = {
        '*id': "defaultRoute"
      };

      return AppRouter;

    })(Backbone.Router);
    RecordView = (function(_super) {

      __extends(RecordView, _super);

      function RecordView() {
        return RecordView.__super__.constructor.apply(this, arguments);
      }

      RecordView.prototype.tagName = 'li';

      RecordView.prototype.events = {
        "click .record-button": "select",
        "click .delete": "delete"
      };

      RecordView.prototype.initialize = function() {
        this.model.bind('change', this.render, this);
        return this.model.bind('destroy', this.remove, this);
      };

      RecordView.prototype.render = function() {
        this.$el.html('<a class="record-button">' + this.model.get('title') + '</a>');
        return this;
      };

      RecordView.prototype.select = function() {
        window.App.record = this.model;
        return window.App.render();
      };

      RecordView.prototype["delete"] = function() {
        return this.model.destroy();
      };

      return RecordView;

    })(Backbone.View);
    EditView = (function(_super) {

      __extends(EditView, _super);

      function EditView() {
        return EditView.__super__.constructor.apply(this, arguments);
      }

      EditView.prototype.tagName = 'div';

      EditView.prototype.events = {
        "click .save": "save",
        "click .duplicate": "duplicate",
        "click .reset": "render",
        "click .delete": "delete"
      };

      EditView.prototype.initialize = function() {
        return this.model.bind('destroy', this.remove, this);
      };

      EditView.prototype.render = function() {
        var event, html, _i, _len, _ref;
        html = 'Title: <input type="text" class="title" value="' + this.model.get('title') + '">';
        html += '<ul>';
        _ref = this.model.get('events');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          event = _ref[_i];
          html += '<li><ul class="event">';
          html += '<li>URL: <input type="text" class="url" value="' + event.url + '"></li>';
          html += '<li>Target: <input type="text" class="target" value=\'' + event.target + '\'></li>';
          html += '<li>Type: <input type="text" class="type" value="' + event.type + '"></li>';
          html += '<li>Value: <input type="text" class="value" value="' + event.value + '"></li>';
          html += '<a class="btn btn-danger delete-event">Delete</a>';
          html += '</ul></li>';
        }
        html += '</ul>';
        html += '<a class="btn btn-primary save">Save</a>';
        html += '<a class="btn btn-success duplicate">Duplicate</a>';
        html += '<a class="btn btn-warning reset">Reset</a>';
        html += '<a class="btn btn-danger delete">Delete</a>';
        this.$el.html(html);
        return this;
      };

      EditView.prototype.save = function() {
        var event, events, _i, _len, _ref;
        events = [];
        _ref = this.$el.find('.event');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          event = _ref[_i];
          event = $(event);
          events.push({
            url: (event.find('.url')).val(),
            target: (event.find('.target')).val(),
            type: (event.find('.type')).val(),
            value: (event.find('.value')).val()
          });
        }
        this.model.save({
          title: (this.$el.find('.title')).val()
        });
        return this.model.save({
          events: events
        });
      };

      EditView.prototype.duplicate = function() {
        var record;
        record = {
          events: this.model.get('events')
        };
        record = window.Database.create(record);
        return chrome.extension.sendMessage({
          type: 'action',
          action: 'save',
          record: record.attributes
        });
      };

      EditView.prototype["delete"] = function() {
        return this.model.destroy();
      };

      return EditView;

    })(Backbone.View);
    AppView = (function(_super) {

      __extends(AppView, _super);

      function AppView() {
        return AppView.__super__.constructor.apply(this, arguments);
      }

      AppView.prototype.el = $('#app');

      AppView.prototype.initialize = function() {
        window.Database.bind('add', this.addOne, this);
        window.Database.bind('reset', this.addAll, this);
        window.Database.bind('all', this.render, this);
        return window.Database.fetch();
      };

      AppView.prototype.render = function() {
        var record, view;
        $('#record-list').html('');
        window.Database.each(this.addOne);
        if (this.record) {
          record = this.record;
          view = new EditView({
            model: record
          });
          console.log(view);
          return $('#edit-record').html(view.render().el);
        }
      };

      AppView.prototype.addOne = function(record) {
        var view;
        view = new RecordView({
          model: record
        });
        return $('#record-list').append(view.render().el);
      };

      return AppView;

    })(Backbone.View);
    $(document).on('click', '.delete-event', function() {
      return $(this).parent().parent().remove();
    });
    router = window.router = new AppRouter;
    App = window.App = new AppView;
    window.RecordView = RecordView;
    App.render();
    router.on('route:defaultRoute', function(id) {
      var record;
      window.Database.fetch();
      record = window.Database.get(id);
      App.record = record;
      App.render();
      return console.log(record);
    });
    return Backbone.history.start();
  });

}).call(this);
