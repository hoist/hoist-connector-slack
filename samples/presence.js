/* Just copy and paste this snippet into your code */

module.exports = function (event, done) {

  var slack = Hoist.connector('<key>');
  slack.get('/presence.set?presence=away')
    .then(function (result) {
      return Hoist.event.raise('presence:set', result);
    })
    .then(done);
};