// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/*export const environment = {
  production: false,
  defaultauth: 'fackbackend',
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  }
}; */
export const environment = {
  production: false,
  firebase : {
    apiKey: "AIzaSyDu9UNJLm50NUle62FEdPP0PfQLpk1rhYk",
    authDomain: "mahis-tech.firebaseapp.com",
    projectId: "mahis-tech",
    storageBucket: "mahis-tech.appspot.com",
    messagingSenderId: "929304707274",
    appId: "1:929304707274:web:1e4bbb55289343e56cb433"
    },
    defaultauth: 'firebase'
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
