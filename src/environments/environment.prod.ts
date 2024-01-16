// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  apiBaseUrl: `${window.location.protocol}//${window.location.hostname}:8080`,
  firebaseConfig: {
    apiKey: 'AIzaSyCCy4wR_lfkri2QGzRoPUcXTZtsFXV1Rhs',
    authDomain: 'trading-stats-31429.firebaseapp.com',
    projectId: 'trading-stats-31429',
    storageBucket: 'trading-stats-31429.appspot.com',
    messagingSenderId: '1015930729920',
    appId: '1:1015930729920:web:b6e2a33ff5406ff856c425',
  },
};
