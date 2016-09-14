'use strict';

/* eslint-env browser, serviceworker */

// Record curl command to firebase
class Firebase {
  recordSubscription(endpoint, headersList) {
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

    let dateKey = Date.now();
    let headersPayload = '';

    Object.keys(headersList)
      .forEach(header => {
        if (headersPayload !== '') {
          headersPayload += ', ';
        }
        headersPayload += '"' + header + '": "' + headersList[
          header] + '"';
      });


    /*let payload = '{ ' +
      '"clients/' + dateKey + '": {' +
      '"endpoint": "' + endpoint + '",' +
      '"headers": {' +
      headersPayload + '}' +
      '}' +
      '}';*/
    let keyName = dateKey;
    let payload = {
      "clients": {}
    };
    payload['clients'][keyName] = {
      "endpoint": endpoint,
      "headers": headersList
    };

    console.log(payload);

    return fetch(
        'https://push-store.firebaseio.com/push-clients.json', {
          method: 'PATCH',
          body: JSON.stringify(payload)
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
