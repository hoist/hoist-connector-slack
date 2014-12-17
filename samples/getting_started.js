/* Just copy and paste this snippet into your code */

module.exports = function(event, done) {

  var slack = Hoist.connector('<key>');
  slack.get('/channels.list')
  .then(function (channels) {
    var promises = [];
    for(var index = 0; index < channels.length; index++) {
      promises.push(Hoist.event.raise('channel:found', channels[index]));
    }
    return Hoist.promise.all(promises)
  })
  .then(done);
};