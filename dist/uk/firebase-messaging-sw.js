// Give The Service Worker Access To Firebase Messaging.
// Note That You Can Only Use Firebase Messaging Here, Other Firebase Libraries
// Will Not Be Available In The Service Worker.
importScripts("https://www.gstatic.com/firebasejs/5.5.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.5.0/firebase-messaging.js");
// Initialize The Firebase App In The Service Worker By Passing In The
// MessagingSenderId.
var config = {
  apiKey: "AIzaSyCu9B3a-USiPB571j9C1jRhOKbFtTXA9SI",
  authDomain: "upkeepcloud.firebaseapp.com",
  databaseURL: "https://upkeepcloud.firebaseio.com",
  projectId: "upkeepcloud",
  storageBucket: "upkeepcloud.appspot.com",
  messagingSenderId: "36085283940",
  appId: "1:36085283940:web:6d2b7e37df5e73beef7371",
  measurementId: "G-Y7HQECGJ5H"
};
firebase.initializeApp(config);
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then(registration => {
      messaging.useServiceWorker(registration);
    })
    .catch(err => console.log("Service Worker Error", err));
} else {
  console.log("Error in Web Service");
}
// Retrieve An Instance Of Firebase Messaging So That It Can Handle Background
// Messages.
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(payload => {
  console.log(payload);
  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true
    })
    .then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        windowClient.postMessage(payload);
      }
    })
    .then(() => {
      return self.registration.showNotification(payload.data.title);
    });
});
