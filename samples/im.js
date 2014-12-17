/* Just copy and paste this snippet into your code */

module.exports = function (event, done) {

  var slack = Hoist.connector('<key>');
  slack.get('/im.list')
    .then(function (result) {
      var promises = [];
      for (var index = 0; index < result.ims.length; index++) {
        promises.push(Hoist.event.raise('im:found', result.ims[index]));
      }
      return Hoist.promise.all(promises);
    })
    .then(done);
};