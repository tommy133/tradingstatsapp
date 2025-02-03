//To use localhost with production backend, you can use the following configuration:

export const environment = {
  production: false,
  apiBaseUrl: 'http://192.168.1.196:8080/api',
  tradingViewUrl:
    'https://es.tradingview.com/chart/svq2CwMv/?symbol=IBROKER%3A',
  firebaseConfig: {
    apiKey: 'AIzaSyCCy4wR_lfkri2QGzRoPUcXTZtsFXV1Rhs',
    authDomain: 'trading-stats-31429.firebaseapp.com',
    projectId: 'trading-stats-31429',
    storageBucket: 'trading-stats-31429.appspot.com',
    messagingSenderId: '1015930729920',
    appId: '1:1015930729920:web:b6e2a33ff5406ff856c425',
  },
};
