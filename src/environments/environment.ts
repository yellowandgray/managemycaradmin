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
    apiKey: "AIzaSyCsfVs81KxVWxgxpwhv2XbvOInFngXQ2h8",
    authDomain: "fluted-reason-415816.firebaseapp.com",
    projectId: "fluted-reason-415816",
    storageBucket: "fluted-reason-415816.appspot.com",
    messagingSenderId: "592242630088",
    appId: "1:592242630088:web:a78422511c80894ccdb4fd"
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
