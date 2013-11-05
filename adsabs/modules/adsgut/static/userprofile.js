// Generated by CoffeeScript 1.6.1
(function() {
  var $, Postable, PostableList, PostableListView, PostableView, h, make_postable_link, parse_fqin, parse_userinfo, prefix, root, w,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    _this = this;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  $ = jQuery;

  console.log("In userprofile");

  h = teacup;

  w = widgets;

  prefix = "/adsgut";

  parse_fqin = function(fqin) {
    var vals;
    vals = fqin.split(':');
    return vals[-1 + vals.length];
  };

  parse_userinfo = function(data) {
    var e, postablesin, postablesinvitedto, postablesowned, priv, publ, userdict;
    publ = "adsgut/group:public";
    priv = data.user.nick + "/group:default";
    postablesin = data.user.postablesin;
    postablesowned = data.user.postablesowned;
    postablesinvitedto = data.user.postablesinvitedto;
    userdict = {
      groupsin: (function() {
        var _i, _len, _ref, _results;
        _results = [];
        for (_i = 0, _len = postablesin.length; _i < _len; _i++) {
          e = postablesin[_i];
          if (e.ptype === 'group' && ((_ref = e.fqpn) !== publ && _ref !== priv)) {
            _results.push(e.fqpn);
          }
        }
        return _results;
      })(),
      groupsowned: (function() {
        var _i, _len, _ref, _results;
        _results = [];
        for (_i = 0, _len = postablesowned.length; _i < _len; _i++) {
          e = postablesowned[_i];
          if (e.ptype === 'group' && ((_ref = e.fqpn) !== publ && _ref !== priv)) {
            _results.push(e.fqpn);
          }
        }
        return _results;
      })(),
      groupsinvitedto: (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = postablesinvitedto.length; _i < _len; _i++) {
          e = postablesinvitedto[_i];
          if (e.ptype === 'group') {
            _results.push(e.fqpn);
          }
        }
        return _results;
      })(),
      userinfo: {
        nick: data.user.nick,
        email: data.user.adsid,
        whenjoined: data.user.basic.whencreated,
        name: data.user.basic.name
      }
    };
    userdict.librariesin = _.union((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = postablesin.length; _i < _len; _i++) {
        e = postablesin[_i];
        if (e.ptype === 'library') {
          _results.push(e.fqpn);
        }
      }
      return _results;
    })(), userdict.groupsin);
    userdict.librariesowned = _.union((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = postablesowned.length; _i < _len; _i++) {
        e = postablesowned[_i];
        if (e.ptype === 'library') {
          _results.push(e.fqpn);
        }
      }
      return _results;
    })(), userdict.groupsowned);
    userdict.librariesinvitedto = _.union((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = postablesinvitedto.length; _i < _len; _i++) {
        e = postablesinvitedto[_i];
        if (e.ptype === 'library') {
          _results.push(e.fqpn);
        }
      }
      return _results;
    })(), userdict.groupsinvitedto);
    console.log("LIBGRPSSIN", userdict.librariesin);
    return userdict;
  };

  make_postable_link = h.renderable(function(fqpn, libmode) {
    h.a({
      href: prefix + ("/postable/" + fqpn + "/profile/html")
    }, function() {
      return h.text(parse_fqin(fqpn));
    });
    if (libmode === true) {
      h.raw("&nbsp;(");
      h.a({
        href: prefix + ("/postable/" + fqpn + "/filter/html")
      }, function() {
        return h.text("items");
      });
      return h.raw(")");
    }
  });

  Postable = (function(_super) {

    __extends(Postable, _super);

    function Postable() {
      return Postable.__super__.constructor.apply(this, arguments);
    }

    return Postable;

  })(Backbone.Model);

  PostableView = (function(_super) {

    __extends(PostableView, _super);

    function PostableView() {
      var _this = this;
      this.clickedYes = function() {
        return PostableView.prototype.clickedYes.apply(_this, arguments);
      };
      this.render = function() {
        return PostableView.prototype.render.apply(_this, arguments);
      };
      return PostableView.__super__.constructor.apply(this, arguments);
    }

    PostableView.prototype.tagName = "tr";

    PostableView.prototype.events = {
      "click .yesbtn": "clickedYes"
    };

    PostableView.prototype.initialize = function(options) {
      return this.libmode = options.libmode;
    };

    PostableView.prototype.render = function() {
      var content, libmode;
      if (this.model.get('invite')) {
        this.$el.html(w.table_from_dict_partial(make_postable_link(this.model.get('fqpn'), false), w.single_button('Yes')));
      } else {
        content = w.one_col_table_partial(make_postable_link(this.model.get('fqpn'), libmode = this.libmode));
        console.log("CONTENT", content);
        this.$el.html(content);
      }
      return this;
    };

    PostableView.prototype.clickedYes = function() {
      var cback, eback, loc, useremail;
      loc = window.location;
      cback = function(data) {
        console.log("return data", data, loc);
        return window.location = location;
      };
      eback = function(xhr, etext) {
        console.log("ERROR", etext, loc);
        return alert('Did not succeed');
      };
      console.log("GGG", this.model, this.$el);
      useremail = this.model.get('email');
      return syncs.accept_invitation(useremail, this.model.get('fqpn'), cback, eback);
    };

    return PostableView;

  })(Backbone.View);

  PostableList = (function(_super) {

    __extends(PostableList, _super);

    function PostableList() {
      return PostableList.__super__.constructor.apply(this, arguments);
    }

    PostableList.prototype.model = Postable;

    PostableList.prototype.initialize = function(models, options) {
      this.listtype = options.listtype;
      this.invite = options.invite;
      this.nick = options.nick;
      return this.email = options.email;
    };

    return PostableList;

  })(Backbone.Collection);

  PostableListView = (function(_super) {

    __extends(PostableListView, _super);

    function PostableListView() {
      var _this = this;
      this.render = function() {
        return PostableListView.prototype.render.apply(_this, arguments);
      };
      return PostableListView.__super__.constructor.apply(this, arguments);
    }

    PostableListView.prototype.tmap = {
      "in": "In",
      ow: "Owned",
      iv: "Invited"
    };

    PostableListView.prototype.initialize = function(options) {
      this.$el = options.$e_el;
      return this.libmode = options.libmode;
    };

    PostableListView.prototype.render = function() {
      var $widget, m, rendered, v, views;
      views = (function() {
        var _i, _len, _ref, _results;
        _ref = this.collection.models;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          m = _ref[_i];
          _results.push(new PostableView({
            model: m,
            libmode: this.libmode
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
      console.log("RENDER1", rendered);
      console.log("RENDER2");
      if (this.collection.invite) {
        $widget = w.$table_from_dict("Invitations", "Accept?", rendered);
      } else {
        $widget = w.$one_col_table(this.tmap[this.collection.listtype], rendered);
      }
      this.$el.append($widget);
      return this;
    };

    return PostableListView;

  })(Backbone.View);

  root.userprofile = {
    parse_userinfo: parse_userinfo,
    Postable: Postable,
    PostableList: PostableList,
    PostableListView: PostableListView
  };

}).call(this);
