'use strict';
require('../bootstrap');
var Slack = require('../../lib/connector');
var sinon = require('sinon');
var BBPromise = require('bluebird');
var expect = require('chai').expect;
var requestPromise = require('request-promise');
var config = require('config');
var errors = require('hoist-errors');

describe('SlackConnector', function () {
  var connector;
  before(function () {
    connector = new Slack({
      clientId: 'clientId',
      clientSecret: 'clientSecret'
    });
    connector.authSettings = {
      authProxy: {
        token: '123456789'
      },
      get: function (name) {
        return this.authProxy[name];
      },
      set: function (name, value) {
        this.authProxy[name] = value;
        return BBPromise.resolve(this);
      }
    };
  });
  describe('#get', function () {
    describe('with no queryParams', function () {
      var response = {};
      var result;
      before(function () {
        sinon.stub(connector, 'request').returns(BBPromise.resolve(response));
        result = connector.get('/groups.rename');
      });
      after(function () {
        connector.request.restore();
      });
      it('calls #request', function () {
        expect(connector.request)
          .to.have.been.calledWith('GET', '/groups.rename');
      });
    });
    describe('with queryParams', function () {
      var response = {};
      var result;
      var queryParams = {
        query: 'query'
      };
      before(function () {
        sinon.stub(connector, 'request').returns(BBPromise.resolve(response));
        result = connector.get('/groups.rename', queryParams);
      });
      after(function () {
        connector.request.restore();
      });
      it('calls #request', function () {
        expect(connector.request)
          .to.have.been.calledWith('GET', '/groups.rename', queryParams);
      });
    });
  });
  describe('#post', function () {
    describe('with no data', function () {
      it('rejects', function () {
        expect(function () {
          connector.post('/path');
        }).to.throw(errors.connector.request.InvalidError);
      });
    });
    describe('with data', function () {
      var response = {};
      var result;
      var data = {
        data: 'data'
      };
      before(function () {
        sinon.stub(connector, 'request').returns(BBPromise.resolve(response));
        result = connector.post('/groups.rename', data);
      });
      after(function () {
        connector.request.restore();
      });
      it('calls #request', function () {
        expect(connector.request)
          .to.have.been.calledWith('POST', '/groups.rename', null, data);
      });
    });
  });

  describe('#request', function () {
    describe('GET', function () {

      describe('with no authSetting', function () {
        before(function () {
          connector.authSettings = null;
        });
        after(function () {
          connector.authSettings = {
            authProxy: {
              token: '123456789'
            },
            get: function (name) {
              return this.authProxy[name];
            },
            set: function (name, value) {
              this.authProxy[name] = value;
              return BBPromise.resolve(this);
            }
          };
        });
        it('rejects', function () {
          expect(function () {
            connector.request('GET', '/path');
          }).to.throw(errors.connector.request.UnauthorizedError);
        });
      });
      describe('with no queryParams', function () {
        var response = {
          body: {
            token: "some body"
          }
        };
        var options = {
          method: 'GET',
          uri: 'https://slack.com/api/groups.rename?token=123456789',
          json: true,
          resolveWithFullResponse: true
        };
        var result;
        before(function () {
          sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
          result = connector.request('GET', '/groups.rename', null);
        });
        after(function () {
          connector.requestPromiseHelper.restore();
        });
        it('calls requestPromiseHelper with access token', function () {
          expect(connector.requestPromiseHelper)
            .to.have.been.calledWith(options);
        });
        it('returns the response body', function () {
          expect(result)
            .to.become(response.body);
        });
      });
      describe('with queryParams object', function () {
        var response = {
          body: {
            keyName: "some body"
          }
        };

        var queryParams = {
          query: 'query'
        };
        var options = {
          method: 'GET',
          uri: 'https://slack.com/api/groups.rename?query=query&token=123456789',
          json: true,
          resolveWithFullResponse: true
        };
        var result;
        before(function () {
          sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
          result = connector.request('GET', '/groups.rename', queryParams);
        });
        after(function () {
          connector.requestPromiseHelper.restore();
        });
        it('calls requestPromiseHelper with access token', function () {
          expect(connector.requestPromiseHelper)
            .to.have.been.calledWith(options);
        });
        it('returns the response body', function () {
          expect(result)
            .to.become(response.body);
        });
      });
      describe('with queryParams in path', function () {
        var response = {
          body: {
            keyName: "some body"
          }
        };
        var options = {
          method: 'GET',
          uri: 'https://slack.com/api/groups.rename?query=query&token=123456789',
          json: true,
          resolveWithFullResponse: true
        };
        var result;
        before(function () {
          sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
          result = connector.request('GET', '/groups.rename?query=query', null);
        });
        after(function () {
          connector.requestPromiseHelper.restore();
        });
        it('calls requestPromiseHelper with access token', function () {
          expect(connector.requestPromiseHelper)
            .to.have.been.calledWith(options);
        });
      });
      describe('with queryParams in path and object', function () {
        var response = {
          body: {
            keyName: "some body"
          }
        };
        var queryParams = {
          query: 'query'
        };
        var options = {
          method: 'GET',
          uri: 'https://slack.com/api/groups.rename?querypath=querypath&query=query&token=123456789',
          json: true,
          resolveWithFullResponse: true
        };
        var result;
        before(function () {
          sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
          result = connector.request('GET', '/groups.rename?querypath=querypath', queryParams);
        });
        after(function () {
          connector.requestPromiseHelper.restore();
        });
        it('calls requestPromiseHelper with access token', function () {
          expect(connector.requestPromiseHelper)
            .to.have.been.calledWith(options);
        });
      });
      describe('with duplicate queryParams in path and object', function () {
        var response = {
          body: {
            keyName: "some body"
          }
        };
        var queryParams = {
          query: 'query'
        };
        var options = {
          method: 'GET',
          uri: 'https://slack.com/api/groups.rename?query=query&token=123456789',
          json: true,
          resolveWithFullResponse: true
        };
        var result;
        before(function () {
          sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
          result = connector.request('GET', '/groups.rename?query=queryfalse', queryParams);
        });
        after(function () {
          connector.requestPromiseHelper.restore();
        });
        it('calls requestPromiseHelper with access token correctly', function () {
          expect(connector.requestPromiseHelper)
            .to.have.been.calledWith(options);
        });
      });
    });
    describe('POST', function () {
      describe('with no path', function () {
        it('rejects', function () {
          expect(function () {
            connector.request();
          }).to.throw(errors.connector.request.InvalidError);
        });
      });
      describe('with object', function () {
        var response = {
          body: {
            keyName: "some body"
          }
        };
        var data = {
          Staff: {
            Name: "John"
          },
          token: '123456789'
        };
        var options = {
          method: 'POST',
          resolveWithFullResponse: true,
          uri: 'https://slack.com/api/groups.rename',
          body: data,
          json: true
        };
        var result;
        before(function () {
          sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve(response));
          result = connector.request('POST', '/groups.rename', null, data);
        });
        after(function () {
          connector.requestPromiseHelper.restore();
        });
        it('calls requestPromiseHelper', function () {
          expect(connector.requestPromiseHelper)
            .to.have.been.calledWith(options);
        });
        it('returns response', function () {
          return expect(result).to.become(response.body);
        });
      });
    });
  });

  describe('#receiveBounce', function () {
    describe('with bounce.query', function () {
      var bounce = {
        query: {
          code: 'code'
        },
        proxy: {},
        get: function (name) {
          return this.proxy[name];
        },
        set: function (name, value) {
          this.proxy[name] = value;
          return BBPromise.resolve(this);
        },
        done: sinon.stub()
      };
      var response = {
        body: '{\n    "access_token": "accessToken"\n}'
      }
      before(function () {
        sinon.stub(connector, 'requestAccessToken').returns(BBPromise.resolve(response));
        return connector.receiveBounce(bounce);
      });
      after(function () {
        connector.requestAccessToken.restore();
      });
      it('calls requestAccessToken with correct arguments', function () {
        expect(connector.requestAccessToken).to.have.been.calledWith(bounce);
      });
      it('sets correct properties on bounce', function () {
        expect(bounce.get('code')).to.eql('code');
        expect(bounce.get('token')).to.eql(JSON.parse(response.body).access_token);
      });
      it('calls bounce.done', function () {
        expect(bounce.done).to.have.been.called;
      });
    });
    describe('without bounce.query', function () {
      var bounce = {
        proxy: {},
        get: function (name) {
          return this.proxy[name];
        },
        set: function (name, value) {
          this.proxy[name] = value;
          return BBPromise.resolve(this);
        },
        redirect: sinon.stub(),
        done: sinon.stub()
      };
      var response = {
        body: 'body'
      }
      before(function () {
        sinon.stub(connector, 'requestAccessToken').returns(BBPromise.resolve(response));
        return connector.receiveBounce(bounce);
      });
      after(function () {
        connector.requestAccessToken.restore();
      });
      it('does not call requestAccessToken', function () {
        expect(connector.requestAccessToken).to.have.not.been.called;
      });
      it('does not call bounce.done', function () {
        expect(bounce.done).to.have.not.been.called;
      });
      it('calls redirect with correct url', function () {
        expect(bounce.redirect)
          .to.have.been.calledWith('https://slack.com/oauth/authorize?client_id=clientId&scope=read,post,identify&redirect_uri=https://bouncer.hoist.io/bounce');
      });
    });
  });

  describe('#requestAccessToken', function () {
    var bounce = {
      proxy: {
        code: 'code'
      },
      get: function (name) {
        return this.proxy[name];
      }
    };
    var body = {
      code: 'code',
      client_id: 'clientId',
      client_secret: 'clientSecret',
      redirect_uri: 'https://bouncer.hoist.io/bounce'
    };
    var options = {
      method: 'POST',
      resolveWithFullResponse: true,
      uri: 'https://slack.com/api/oauth.access',
      formData: body
    };
    before(function () {
      sinon.stub(connector, 'requestPromiseHelper').returns(BBPromise.resolve());
      return connector.requestAccessToken(bounce)
    });
    it('calls requestPromiseHelper with correct arguments', function () {
      expect(connector.requestPromiseHelper).to.have.been.calledWith(options);
    })
  });
});