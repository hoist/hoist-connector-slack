/* Just copy and paste this snippet into your code */

module.exports = function (event, done) {

  var slack = Hoist.connector('<key>');
  var data = {
    channel: 'C1234567890',
    topic: 'My Topic'
  };
  slack.post('/groups.setTopic', data)
    .then(function (result) {
      return Hoist.event.raise('topic:set', result);
    })
    .then(done);
};