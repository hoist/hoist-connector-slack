'use strict';
var BBPromise = require('bluebird');
var requestPromise = require('request-promise');
var logger = require('hoist-logger');
var url = require('url');
var errors = require('hoist-errors');
var _ = require('lodash');

var authUrl = 'https://slack.com/oauth/authorize';
var redirectUri = 'https://bouncer.hoist.io/bounce';
var authGetTokenUrl = 'https://slack.com/api/oauth.access';
var apiUrl = 'https://slack.com/api';


/*jshint camelcase: false */

function SlackConnector(settings) {
  logger.info({
    settings: settings
  }, 'constructed angel-list-connector');
  this.settings = settings;
}

SlackConnector.prototype.get = function (url, queryParams) {
  logger.info('inside hoist-connector-slack.get');
  return this.request('GET', url, queryParams);
};

SlackConnector.prototype.post = function (url, data) {
  logger.info('inside hoist-connector-slack.post');
  if (!data) {
    throw new errors.connector.request.InvalidError('no data specified in post');
  }
  return this.request('POST', url, null, data);
};

SlackConnector.prototype.request = function (method, path, queryParams, data) {
  if (!path) {
    throw new errors.connector.request.InvalidError('no path specified');
  }
  data = data && (typeof data === 'object') ? data : {};
  if (this.authSettings ) {
    data.token = this.authSettings.get('token');
  } else {
    throw new errors.connector.request.UnauthorizedError();
  }
  logger.info({
    method: method,
    path: path
  }, 'inside hoist-connector-slack.request');
  var options = {
    method: method,
    json: true,
    resolveWithFullResponse: true,
    uri: apiUrl + path,
  };
  if (method === 'POST') {
    options.body = data;
  }
  if (method === 'GET') {
    var parsedUrl = url.parse(options.uri, true);
    parsedUrl.search = null;
    var query = parsedUrl.query;
    queryParams = queryParams ? queryParams : {};
    queryParams.token = this.authSettings.get('token');
    query = _.extend(query, queryParams);
    options.uri = url.format(parsedUrl);
  }
  return this.requestPromiseHelper(options)
  .then(function(response) {
    logger.info({responseBody: response.body}, 'inside hoist-connector-slack.request');
    return response.body;
  });
};


/* istanbul ignore next */
SlackConnector.prototype.authorize = function (authSettings) {
  this.authSettings = authSettings;
  return BBPromise.resolve({});
};

SlackConnector.prototype.receiveBounce = function (bounce) {
  if (bounce.query && bounce.query.code) {
    return bounce.set('code', bounce.query.code)
      .bind(this)
      .then(function () {
        return this.requestAccessToken(bounce);
      })
      .then(function (response) {
        logger.info({responseBody: response.body}, 'inside hoist-connector-slack.bounce');
        return bounce.set('token', JSON.parse(response.body).access_token);
      })
      .then(function () {
        bounce.done();
      })
      .catch(function(err){
        logger.error(err);
        bounce.done(err);
      });
  } else {
    var scope = '&scope=read,post,identify';
    return bounce.redirect(authUrl + '?client_id=' +this.settings.clientId + scope+'&redirect_uri='+ redirectUri);
  }
};

SlackConnector.prototype.requestAccessToken = function (bounce) {
  var body = {
    code: bounce.get('code'),
    client_id: this.settings.clientId,
    client_secret: this.settings.clientSecret,
    redirect_uri: redirectUri
  };
  var options = {
    method: 'POST',
    uri: authGetTokenUrl,
    formData: body,
    resolveWithFullResponse: true
  };

  return this.requestPromiseHelper(options);
};

/* istanbul ignore next */
SlackConnector.prototype.requestPromiseHelper = function (options) {
  return BBPromise.resolve(requestPromise(options));
};

module.exports = SlackConnector;