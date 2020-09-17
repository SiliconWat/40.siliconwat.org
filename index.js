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

const button = document.querySelector("button")
button.addEventListener("click", () => {
    const provider = new firebase.auth.GithubAuthProvider();
    firebase.auth().signInWithRedirect(provider);
})

  firebase.auth().getRedirectResult().then(function(result) {
    if (result.credential) {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      var token = result.credential.accessToken;
      // ...
    }
    // The signed-in user info.
    var user = result.user;
    console.log(token, user)
    
    const img = document.querySelector("img")
    img.src = user.photoURL
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });

