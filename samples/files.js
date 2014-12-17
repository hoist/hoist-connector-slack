/* Just copy and paste this snippet into your code */

module.exports = function (event, done) {

  var slack = Hoist.connector('<key>');
  slack.get('/files.list')
    .then(function (result) {
      var promises = [];
      for (var index = 0; index < result.files.length; index++) {
        promises.push(Hoist.event.raise('file:found', result.files[index]));
      }
      return Hoist.promise.all(promises);
    })
    .then(done);
};