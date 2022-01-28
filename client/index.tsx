import React from "react";
import ReactDOM from "react-dom";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getDatabase, ref, set, update, onValue } from "firebase/database";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBr4_Uqy9Znuy1pF9-11ps9c2GgeTswbn4",
  authDomain: "signin-80421.firebaseapp.com",
  databaseURL:
    "https://signin-80421-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "signin-80421",
  storageBucket: "signin-80421.appspot.com",
  messagingSenderId: "330665323225",
  appId: "1:330665323225:web:0da276ecf7425ab56e2cc8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase();
const auth = getAuth();

signInAnonymously(auth);

function App() {
  const [name, setName] = React.useState("");
  const [user, setUser] = React.useState(null);
  const [address, setAddress] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [signature, setSignature] = React.useState("");
  const [isVerified, setIsVerified] = React.useState(false);

  const [verificationObject, setVerificationObject] = React.useState(null);
  React.useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        setUser(user);
        //Start listening to changes in firebase
        const db = getDatabase();
        const userRef = ref(db, "users/" + user.uid);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (!data) {
            return;
          }
          setAddress(data.address);
          setMessage(data.message);
        });

        const verificationsbyuseridRef = ref(
          db,
          "verificationsbyuserid/" + user.uid
        );
        onValue(verificationsbyuseridRef, (snapshot) => {
          const data = snapshot.val();
          if (!data) {
            return;
          }
          setIsVerified(data.isVerified);
          setVerificationObject(data);
        });
      }
    });
  }, []);
  function next() {
    //send a request to firebase

    const db = getDatabase();
    set(ref(db, "users/" + user.uid), {
      name: name,
    });
  }

  const signIn = () => {
    if (signature) {
      const db = getDatabase();
      update(ref(db, "users/" + user.uid), {
        signature: signature,
      });
    }
  };
  return (
    <div>
      <h1 className="h3">Sign in</h1>
      <p> using Ravencoin NFT (unique asset)</p>
      {!address && (
        <div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Enter name of your NFT
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              onChange={(event) => {
                setName(event.target.value);
              }}
              value={name}
            />
          </div>

          <div className="mb-3 row mt-4">
            <button
              type="button"
              className="btn btn-primary form-control"
              onClick={next}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {isVerified === true && (
        <div>
          <h1>
            You are verified, hello{" "}
            {verificationObject && verificationObject.name}
          </h1>
        </div>
      )}
      {!isVerified && address && (
        <div>
          <h5>Please sign the message with the address</h5>

          <p>
            <strong>Address</strong> {address}
          </p>
          <p>
            <strong>Message</strong> {message}
          </p>

          <p>
            <strong>Signature</strong>
            <textarea
              name="signature"
              value={signature}
              onChange={(event) => {
                setSignature(event.target.value);
              }}
            ></textarea>
          </p>

          <button className="btn btn-primary" onClick={signIn}>
            Sign in
          </button>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
