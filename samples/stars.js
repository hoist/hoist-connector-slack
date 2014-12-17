/* Just copy and paste this snippet into your code */

module.exports = function (event, done) {

  var slack = Hoist.connector('<key>');
  slack.get('/stars.list')
    .then(function (result) {
      var promises = [];
      for (var index = 0; index < result.items.length; index++) {
        promises.push(Hoist.event.raise('item:found', result.items[index]));
      }
      return Hoist.promise.all(promises);
    })
    .then(done);
};