/* Just copy and paste this snippet into your code */

module.exports = function (event, done) {

  var slack = Hoist.connector('<key>');
  slack.get('/users.info')
    .then(function (result) {
      return Hoist.event.raise('user:found', result.user);
    })
    .then(done);
};