const firebaseConfig = {
    apiKey: "AIzaSyByf034Dywhuer2ZobXdQwhFKgHdEUnzDI",
    authDomain: "siliconwat-org.firebaseapp.com",
    databaseURL: "https://siliconwat-org.firebaseio.com",
    projectId: "siliconwat-org",
    storageBucket: "siliconwat-org.appspot.com",
    messagingSenderId: "873288813878",
    appId: "1:873288813878:web:8e3a197dc4adf857ca3797",
    measurementId: "G-631ZF6PF0C"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  import {HbGithub} from "./hb-github.mjs"
  customElements.define("hb-github", HbGithub)

