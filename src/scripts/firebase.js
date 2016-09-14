'use strict';

/* eslint-env browser, serviceworker */

// Record curl command to firebase
class Firebase {
  recordSubscription(curlText) {
    if (!curlText || curlText == '') {
      console.error('No curl text was supplied');

      // We want this to be a safe method, so avoid throwing Unless
      // It's absolutely necessary.
      return Promise.resolve();
    }

    let dateKey = Date.now();
    let payload = '{ ' +
      '"clients/' + dateKey + '": "' + curlText + '"' +
      '}';

    console.log(payload);

    return fetch(
        'https://push-store.firebaseio.com/push-clients.json', {
          method: 'PATCH',
          body: payload
        })
      .then(response => {
        if (!response.ok) {
          return response.text()
            .then(responseText => {
              throw new Error(
                `Bad response from firebase ` +
                `[${response.status}] ${responseText}`);
            });
        }
      })
      .catch(err => {
        console.warn('Unable to record in firebase', err);
      });
  }
}

if (typeof self !== 'undefined') {
  self.analytics = new Firebase();
}
