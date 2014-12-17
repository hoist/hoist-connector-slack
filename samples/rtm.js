/* Just copy and paste this snippet into your code */

module.exports = function (event, done) {

  var slack = Hoist.connector('<key>');
  slack.get('/rtm.start')
    .then(function (result) {
      return Hoist.event.raise('rtm:started', result);
    })
    .then(done);
};