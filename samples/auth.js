/* Just copy and paste this snippet into your code */

module.exports = function (event, done) {

  var slack = Hoist.connector('<key>');
  slack.get('/auth.test')
    .then(function (result) {
      return Hoist.event.raise('authTest:found', result);
    })
    .then(done);
};