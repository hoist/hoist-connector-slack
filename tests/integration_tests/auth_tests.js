'use strict';
require('../bootstrap');
var Slack = require('../../lib/connector');
var sinon = require('sinon');
var BBPromise = require('bluebird');
var expect = require('chai').expect;
var requestPromise = require('request-promise');
var config = require('config');
var errors = require('@hoist/errors');
var child = require('child_process');

describe.skip('SlackConnector Authentication', function () {

  describe('Single Tenant', function() {

    var connector;
    var bounce;
    before(function() {
      connector = new Slack({
        authType: "Private", 
        clientId: config.get("slack.clientId"),
        clientSecret: config.get("slack.clientSecret")
      });
      bounce = {
        get: function(arg) {
          if(arg==="code") {
            return this.code;
          }
          if(arg==="token") {
            return this.token;
          }
          return undefined;
        },
        delete: function () {
          return BBPromise.resolve(null);
        },
        set: function(arg, value) {
          if(arg === "code") {
            this.code = value;
          }
          if(arg === "token") {
            this.token = value;
          }
          return BBPromise.resolve(this);
        },
        redirect: function () {
          console.log('redirect', arguments);
          return BBPromise.resolve(arguments[0]);
        },
        done: function () {
          console.log('done', arguments);
          return BBPromise.resolve(null);
        },
        displayProperties: {},
        setDisplayProperty: function(prop, val) {
          this.displayProperties[prop] = val;
          return BBPromise.resolve(this);
        }
      };
    });
    describe('Initial Bounce', function() {
      var url;
      before(function() {
        return connector.receiveBounce(bounce).then(function(_url) {
          url = _url;
        });
      });
      it('should give a return url', function(done) {
        expect(url).to.be.a('string');
      });
      after(function() {
        var spawn = child.exec("open -a Safari " + url);
        return true;
      })
    });
    describe.skip('Second Bounce', function() {
      before(function() {
        bounce.query = { code: "" };
        return connector.authorize(bounce).then(function() {
          return connector.receiveBounce(bounce)
        })
        
      });  
      it('should set display property to team name', function() {
        return expect(bounce.displayProperties.Team).to.equal(config.get('slack.teamName'));
      });

    });

  });

});
