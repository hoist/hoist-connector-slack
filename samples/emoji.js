/* Just copy and paste this snippet into your code */

module.exports = function (event, done) {

  var slack = Hoist.connector('<key>');
  slack.get('/emoji.list')
    .then(function (emojiList) {
      return Hoist.event.raise('emojis:found', emojiList);
    })
    .then(done);
};