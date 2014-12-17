/* Just copy and paste this snippet into your code */

module.exports = function (event, done) {

  var slack = Hoist.connector('<key>');
  var queryParams = {
    channel: 'C1234567890',
    text: 'Hello World',
    username: 'My Bot'
  };
  slack.get('/chat.postMessage', queryParams)
    .then(function (result) {
      return Hoist.event.raise('message:sent', result);
    })
    .then(done);
};