// Generated by CoffeeScript 1.4.0
(function() {
  var Database, Record,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Record = (function(_super) {

    __extends(Record, _super);

    function Record() {
      return Record.__super__.constructor.apply(this, arguments);
    }

    Record.prototype.initialize = function() {
      if (!this.get('title')) {
        return this.set('title', 'New record');
      }
    };

    return Record;

  })(Backbone.Model);

  Database = (function(_super) {

    __extends(Database, _super);

    function Database() {
      return Database.__super__.constructor.apply(this, arguments);
    }

    Database.prototype.localStorage = new Backbone.LocalStorage("Database");

    Database.prototype.model = Record;

    return Database;

  })(Backbone.Collection);

  window.Record = Record;

  window.Database = new Database;

}).call(this);