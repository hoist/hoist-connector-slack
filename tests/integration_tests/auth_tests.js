'use strict';
require('../bootstrap');
var Slack = require('../../lib/connector');
var sinon = require('sinon');
var BBPromise = require('bluebird');
var expect = require('chai').expect;
var requestPromise = require('request-promise');
var config = require('config');
var errors = require('@hoist/errors');
var child = require('child_process');

describe.skip('SlackConnector Authentication', function () {

  describe('Single Tenant', function() {

    var connector;
    var bounce;
    before(function() {
      connector = new Slack({
        authType: "Private", 
        clientId: config.get("slack.clientId"),
        clientSecret: config.get("slack.clientSecret")
      });
      bounce = {
        get: function(arg) {
          if(arg==="code") {
            return this.code;
          }
          if(arg==="token") {
            return this.token;
          }
          return undefined;
        },
        delete: function () {
          return BBPromise.resolve(null);
        },
        set: function(arg, value) {
          if(arg === "code") {
            this.code = value;
          }
          if(arg === "token") {
            this.token = value;
          }
          return BBPromise.resolve(this);
        },
        redirect: function () {
          console.log('redirect', arguments);
          return BBPromise.resolve(arguments[0]);
        },
        done: function () {
          console.log('done', arguments);
          return BBPromise.resolve(null);
        },
        displayProperties: {},
        setDisplayProperty: function(prop, val) {
          this.displayProperties[prop] = val;
          return BBPromise.resolve(this);
        }
      };
    });
    describe('Initial Bounce', function() {
      var url;
      before(function() {
        return connector.receiveBounce(bounce).then(function(_url) {
          url = _url;
        });
      });
      it('should give a return url', function(done) {
        expect(url).to.be.a('string');
      });
      after(function() {
        var spawn = child.exec("open -a Safari " + url);
        return true;
      })
    });
    describe.skip('Second Bounce', function() {
      before(function() {
        bounce.query = { code: "" };
        return connector.authorize(bounce).then(function() {
          return connector.receiveBounce(bounce)
        })
        
      });  
      it('should set display property to team name', function() {
        return expect(bounce.displayProperties.Team).to.equal(config.get('slack.teamName'));
      });

    });

  });

});


// var Connector = require('../../lib/connector');
// var fs = require('fs');
// var path = require('path');
// var BBPromise = require('bluebird');
// describe.skip('Partner Auth', function () {
//   var connector;
//   before(function () {
//     var privateKey = fs.readFileSync(path.resolve('/Volumes/Store/Projects/hoist/ssl/xero/hoist_xero_private_key.pem')).toString();
//     var publicKey = fs.readFileSync(path.resolve('/Volumes/Store/Projects/hoist/ssl/xero/hoist_xero.cer')).toString();
//     connector = new Connector({
//       authType: 'Partner',
//       privateKey: privateKey,
//       publicKey: publicKey,
//       consumerKey: 'NXKZHFJYX3SFUHZ7RXKXLE0LTZPMM0',
//       consumerSecret: '2TIE2ST6N1U54JZ8KHRDWONLW02SZM'
//     });
//   });
//   this.timeout(50000);
//   describe('initial bounce', function () {
//     before(function () {
//       var bounce = {
//         get: function () {
//           return undefined;
//         },
//         delete: function () {
//           return BBPromise.resolve(null);
//         },
//         set: function () {
//           console.log('set', arguments);
//           return BBPromise.resolve(null);
//         },
//         redirect: function () {
//           console.log('redirect', arguments);
//           return BBPromise.resolve(null);
//         },
//         done: function () {
//           console.log('done', arguments);
//           return BBPromise.resolve(null);
//         }
//       };
//       return connector.receiveBounce(bounce);
//     });
//     it('should do some redirect', function () {

//     });
//   });
//   describe('second bounce', function () {
//     before(function () {
//       /*jshint camelcase: false */
//       var bounce = {
//         query: {
//           oauth_verifier: '1500743'
//         },
//         get: function (key) {
//           if (key === 'RequestToken') {
//             return '24A38953RA0DOFV58JNSQDZIZSZB9C';
//           }
//           if (key === 'RequestTokenSecret') {
//             return 'SGOT4TJTRFRXYEDVZKITAHNUZB2QTH';
//           }
//           return undefined;
//         },
//         delete: function () {
//           return BBPromise.resolve(null);
//         },
//         set: function () {
//           console.log('set', arguments);
//           return BBPromise.resolve(null);
//         },
//         redirect: function () {
//           console.log('redirect', arguments);
//           return BBPromise.resolve(null);
//         },
//         done: function () {
//           console.log('done', arguments);
//           return BBPromise.resolve(null);
//         }
//       };
//       return connector.receiveBounce(bounce).catch(function (err) {
//         console.log(err);
//       });
//     });
//     it('should do some redirect', function () {

//     });
//   });
//   describe('get contacts', function () {
//     before(function () {

//       var auth = {
//         AccessToken: 'YDEPSYUOV9ZVCWKWS9OORH1992FEMW',
//         AccessTokenSecret: 'ZYJRYPZQ5NIJDQ1Z0VU9JTF1DKBQUN',
//         SessionHandle: 'AXI05QGE5G7TXJLXTPGL',
//         SessionExpiresAt: '2024-12-14T02:54:08.256Z',
//         TokenExpiresAt: '2014-12-17T03:24:08.255Z'
//       };
//       var bounce = {
//         get: function (key) {
//           return auth[key];
//         },
//         delete: function () {
//           return BBPromise.resolve(null);
//         },
//         set: function (key, value) {
//           console.log('set',arguments);
//           auth[key] = value;
//           return BBPromise.resolve(null);
//         },
//         redirect: function () {
//           console.log('redirect', arguments);
//           return BBPromise.resolve(null);
//         },
//         done: function () {
//           console.log('done', arguments);
//           return BBPromise.resolve(null);
//         }
//       };
//       connector.authorize(bounce);
//       return connector.get('/contacts').then(function () {
//         console.log(arguments);
//       }).catch(function (err) {
//         console.log(err, err.stack);
//       });
//     });
//     it('should', function () {

//     });
//   });
// });
