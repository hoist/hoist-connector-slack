/* Just copy and paste this snippet into your code */

module.exports = function (event, done) {

  var slack = Hoist.connector('<key>');
  var queryParams = {
    client_id: '4b39e9-752c4',
    client_secret: '33fea0113f5b1',
    code: 'ccdaa72ad'
  };
  slack.get('/oauth.access', queryParams)
    .then(function (result) {
      return Hoist.event.raise('accessToken:created', result);
    })
    .then(done);
};