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
      apiKey: "AIzaSyAGhQA94m5Ck8hJgCOS9c4Q_JlpZd6Nn90",
      authDomain: "school-runner-decf3.firebaseapp.com",
      projectId: "school-runner-decf3",
      storageBucket: "school-runner-decf3.appspot.com",
      messagingSenderId: "231831769030",
      appId: "1:231831769030:web:11d9098fd2b39035d72cc7"
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
