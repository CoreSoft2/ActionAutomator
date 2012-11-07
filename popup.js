// Generated by CoffeeScript 1.4.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $(document).ready(function() {
    var App, AppView, RecordView;
    $('#start').click(function() {
      chrome.extension.sendMessage({
        type: 'action',
        action: 'start'
      });
      return true;
    });
    $('#stop').click(function() {
      chrome.extension.sendMessage({
        type: 'action',
        action: 'stop'
      });
      return true;
    });
    RecordView = (function(_super) {

      __extends(RecordView, _super);

      function RecordView() {
        return RecordView.__super__.constructor.apply(this, arguments);
      }

      RecordView.prototype.tagName = 'li';

      RecordView.prototype.events = {
        "click .playback": "playback",
        "click .place": "placeOnPage",
        "dblclick .record": "edit",
        "click .delete": "delete",
        "keypress .edit": "updateOnEnter",
        "blur .edit": "close"
      };

      RecordView.prototype.initialize = function() {
        this.model.bind('change', this.render, this);
        return this.model.bind('destroy', this.remove, this);
      };

      RecordView.prototype.playback = function() {
        var record;
        record = this.model;
        console.log(record);
        console.log(record.id);
        return chrome.extension.sendMessage({
          type: 'action',
          action: 'start-playback',
          id: record.id
        });
      };

      RecordView.prototype.placeOnPage = function() {
        return chrome.extension.sendMessage({
          type: 'action',
          action: 'place',
          id: this.model.id
        });
      };

      RecordView.prototype["delete"] = function() {
        return this.model.destroy();
      };

      RecordView.prototype.render = function() {
        this.$el.html('<div class="record">\
        <input class="playback" type="button" value="playback" />\
        <input class="place" type="button" value="place" />\
        <label>' + this.model.get('title') + '</label>\
        <input class="delete" type="button" value="delete" />\
      </div>\
      <input class="edit" type="text" value="' + this.model.get('title') + '" />');
        this.input = this.$('.edit');
        return this;
      };

      RecordView.prototype.edit = function() {
        this.$el.addClass('editing');
        return this.input.focus();
      };

      RecordView.prototype.close = function() {
        var value;
        value = this.input.val();
        this.model.save({
          title: value
        });
        this.$el.removeClass('editing');
        return this.render();
      };

      RecordView.prototype.updateOnEnter = function(e) {
        if (e.keyCode === 13) {
          return this.close();
        }
      };

      return RecordView;

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
        $('#record-list').html('');
        return this.addAll();
      };

      AppView.prototype.addOne = function(record) {
        var view;
        view = new RecordView({
          model: record
        });
        return $('#record-list').append(view.render().el);
      };

      AppView.prototype.addAll = function() {
        return window.Database.each(this.addOne);
      };

      AppView.prototype.refresh = function() {
        window.Database.fetch();
        $('#record-list').html('');
        return this.addAll();
      };

      return AppView;

    })(Backbone.View);
    App = window.App = new AppView;
    window.RecordView = RecordView;
    return App.render();
  });

}).call(this);