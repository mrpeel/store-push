'use strict';

/* eslint-env browser, serviceworker */

// Record curl command to firebase

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Firebase = function () {
  function Firebase() {
    _classCallCheck(this, Firebase);
  }

  _createClass(Firebase, [{
    key: 'recordSubscription',
    value: function recordSubscription(endpoint, headersList) {
      if (!endpoint || endpoint == '') {
        console.error('No endpoint was supplied');
        // We want this to be a safe method, so avoid throwing Unless
        // It's absolutely necessary.
        return Promise.resolve();
      }

      if (!headersList || headersList.length == 0) {
        console.error('No headers were supplied');
        // We want this to be a safe method, so avoid throwing Unless
        // It's absolutely necessary.
        return Promise.resolve();
      }

      var dateKey = Date.now();
      var headersPayload = '';

      Object.keys(headersList).forEach(function (header) {
        if (headersPayload !== '') {
          headersPayload += ', ';
        }
        headersPayload += '"' + header + '": "' + headersList[header] + '"';
      });

      /*let payload = '{ ' +
        '"clients/' + dateKey + '": {' +
        '"endpoint": "' + endpoint + '",' +
        '"headers": {' +
        headersPayload + '}' +
        '}' +
        '}';*/
      var keyName = '"clients/' + dateKey + '"';
      var payload = {};
      payload[keyName] = {
        "endpoint": endpoint,
        "headers": headersList
      };

      console.log(payload);

      return fetch('https://push-store.firebaseio.com/push-clients.json', {
        method: 'PATCH',
        body: JSON.stringify(payload)
      }).then(function (response) {
        if (!response.ok) {
          return response.text().then(function (responseText) {
            throw new Error('Bad response from firebase ' + ('[' + response.status + '] ' + responseText));
          });
        }
      }).catch(function (err) {
        console.warn('Unable to record in firebase', err);
      });
    }
  }]);

  return Firebase;
}();

if (typeof self !== 'undefined') {
  self.analytics = new Firebase();
}