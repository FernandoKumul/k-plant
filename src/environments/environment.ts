// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_KEY: '29fac49f85db9d4b93496492a2717274',
  API_URL: 'https://api.openweathermap.org/data/2.5',
  firebaseConfig: {
    projectId: 'k-plant',
    appId: '1:958087125209:web:82319f2a29220aaf8946c8',
    databaseURL: 'https://k-plant-default-rtdb.firebaseio.com',
    storageBucket: 'k-plant.appspot.com',
    apiKey: 'AIzaSyButpFvcCDDwjOAjd08r8GoDGMrruIeisg',
    authDomain: 'k-plant.firebaseapp.com',
    messagingSenderId: '958087125209',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
