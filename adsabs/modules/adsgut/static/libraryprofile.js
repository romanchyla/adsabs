// Generated by CoffeeScript 1.6.1
(function() {
  var $, PostableListView, PostableView, get_info, h, root, rwmap, w,
    _this = this,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  $ = jQuery;

  h = teacup;

  w = widgets;

  rwmap = function(boolrw) {
    if (boolrw === true) {
      return "read and post";
    } else {
      return "read only";
    }
  };

  PostableView = (function(_super) {

    __extends(PostableView, _super);

    function PostableView() {
      var _this = this;
      this.clickedToggle = function() {
        return PostableView.prototype.clickedToggle.apply(_this, arguments);
      };
      this.render = function() {
        return PostableView.prototype.render.apply(_this, arguments);
      };
      return PostableView.__super__.constructor.apply(this, arguments);
    }

    PostableView.prototype.tagName = "tr";

    PostableView.prototype.events = {
      "click .yesbtn": "clickedToggle"
    };

    PostableView.prototype.initialize = function(options) {
      return this.rwmode = options.rwmode, this.memberable = options.memberable, this.fqpn = options.fqpn, this.owner = options.owner, this.username = options.username, this.ownerfqin = options.ownerfqin, options;
    };

    PostableView.prototype.render = function() {
      var content;
      if (!this.owner) {
        content = w.table_from_dict_partial(this.username, "Only owner can see this.");
      } else {
        if (this.ownerfqin === this.memberable) {
          content = w.table_from_dict_partial(this.username + " (owner)", rwmap(this.rwmode));
        } else {
          content = w.table_from_dict_partial(this.username, w.single_button_label(rwmap(this.rwmode), "Toggle"));
        }
      }
      this.$el.html(content);
      return this;
    };

    PostableView.prototype.clickedToggle = function() {
      var cback, eback, loc;
      loc = window.location;
      cback = function(data) {
        return window.location = location;
      };
      eback = function(xhr, etext) {
        return alert('Did not succeed');
      };
      return syncs.toggle_rw(this.memberable, this.fqpn, cback, eback);
    };

    return PostableView;

  })(Backbone.View);

  PostableListView = (function(_super) {

    __extends(PostableListView, _super);

    function PostableListView() {
      var _this = this;
      this.render = function() {
        return PostableListView.prototype.render.apply(_this, arguments);
      };
      return PostableListView.__super__.constructor.apply(this, arguments);
    }

    PostableListView.prototype.initialize = function(options) {
      this.$el = options.$e_el;
      this.fqpn = options.fqpn;
      this.users = options.users;
      this.owner = options.owner;
      return this.ownerfqin = options.ownerfqin;
    };

    PostableListView.prototype.render = function() {
      var $widget, rendered, u, v, views;
      views = (function() {
        var _results;
        _results = [];
        for (u in this.users) {
          _results.push(new PostableView({
            rwmode: this.users[u][1],
            fqpn: this.fqpn,
            memberable: u,
            username: this.users[u][0],
            owner: this.owner,
            ownerfqin: this.ownerfqin
          }));
        }
        return _results;
      }).call(this);
      rendered = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = views.length; _i < _len; _i++) {
          v = views[_i];
          _results.push(v.render().el);
        }
        return _results;
      })();
      $widget = w.$table_from_dict("User", "Access", rendered);
      this.$el.append($widget);
      return this;
    };

    return PostableListView;

  })(Backbone.View);

  get_info = function(sections, config) {
    var cback, eback;
    cback = function() {};
    eback = function() {};
    return $.get(config.infoURL, function(data) {
      var content, ownerfqin;
      content = views.library_info(data, templates.library_info);
      ownerfqin = data.library.owner;
      sections.$infodiv.append(content);
      $.fn.editable.defaults.mode = 'inline';
      sections.$infodiv.find('.edtext').editable({
        type: 'textarea',
        rows: 2,
        url: function(params) {
          return syncs.change_description(params.value, config.fqpn, cback, eback);
        }
      });
      sections.$infodiv.find('.edclick').click(function(e) {
        e.stopPropagation();
        e.preventDefault();
        return sections.$infodiv.find('.edtext').editable('toggle');
      });
      sections.$infodiv.show();
      return $.get(config.membersURL, function(data) {
        var plinv, viewu;
        plinv = new PostableListView({
          users: data.users,
          fqpn: config.fqpn,
          owner: config.owner,
          ownerfqin: ownerfqin,
          $e_el: sections.$membersdiv
        });
        plinv.render();
        sections.$membersdiv.show();
        if (config.owner) {
          viewu = new views.InviteUser({
            postable: config.fqpn,
            withcb: true
          });
          return $.get(config.guiURL, function(data) {
            var groups, view;
            groups = data.groups;
            view = new views.AddGroup({
              postable: config.fqpn,
              groups: groups,
              withcb: true
            });
            sections.$invitedform.append(view.render().$el);
            sections.$invitedform.show();
            return $.get(config.invitedsURL, function(data) {
              content = views.postable_inviteds(config.fqpn, data, templates.postable_inviteds, false);
              sections.$invitedsdiv.prepend(viewu.render().el);
              sections.$invitedsdiv.append(content);
              return sections.$invitedsdiv.show();
            });
          });
        }
      });
    });
  };

  root.libraryprofile = {
    PostableView: PostableView,
    PostableListView: PostableListView,
    get_info: get_info
  };

}).call(this);