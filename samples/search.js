/* Just copy and paste this snippet into your code */

module.exports = function (event, done) {

  var slack = Hoist.connector('<key>');
  slack.get('/search.messages?query=pickleface')
    .then(function (result) {
      var promises = [];
      for (var index = 0; index < result.messages.length; index++) {
        promises.push(Hoist.event.raise('message:found', result.messages[index]));
      }
      return Hoist.promise.all(promises);
    })
    .then(done);
};