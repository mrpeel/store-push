'use strict';

/* eslint-env browser, serviceworker */

importScripts('./scripts/analytics.js');

self.analytics.trackingId = 'UA-77119321-2';

self.addEventListener('push', function(event) {
  console.log('Received push');
  let notificationTitle = 'Ready for collection';
  const notificationOptions = {
    body: 'Your order is ready for collection.  John is waiting for you at' +
      ' front counter',
    icon: './images/icon-192x192.png',
    badge: './images/icon-72x72.png',
    tag: 'NK-push-notification',
    requireInteraction: true,
    data: {
      url: 'https://developers.google.com/web/fundamentals/getting-started/push-notifications/'
    }
  };

  if (event.data) {
    const dataText = event.data.text();
    notificationTitle = 'Received Payload';
    notificationOptions.body = dataText;
  }

  console.log(notificationTitle);
  console.log(notificationOptions);

  /* event.waitUntil(
    /*Promise.all([
      self.registration.showNotification(
        notificationTitle, notificationOptions),
      self.analytics.trackEvent('push-received')
    ])
  );
});*/
  self.registration.showNotification(
    notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  let clickResponsePromise = Promise.resolve();
  if (event.notification.data && event.notification.data.url) {
    clickResponsePromise = clients.openWindow(event.notification.data
      .url);
  }

  event.waitUntil(
    Promise.all([
      clickResponsePromise,
      self.analytics.trackEvent('notification-click')
    ])
  );
});

self.addEventListener('notificationclose', function(event) {
  event.waitUntil(
    Promise.all([
      self.analytics.trackEvent('notification-close')
    ])
  );
});
