import React from "react";
import ReactDOM from "react-dom";
import { getAuth, signInAnonymously, signOut } from "firebase/auth";
import { getDatabase, ref, set, update, onValue } from "firebase/database";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
import firebaseConfig from "./firebaseConfig.json";
import { Intro } from "./Intro";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Hello } from "./Hello";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase();
const auth = getAuth();

signInAnonymously(auth);

const PREFIX = "HALEYNJOHNSON#";
function App() {
  const [name, _setName] = React.useState(PREFIX);

  const setName = (name) => {
    //Make sure that the name always starts with PREFIX
    if (!name) {
      name = PREFIX;
    }

    if(name.startsWith(PREFIX) === false){
      name = PREFIX;
    }


    _setName(name);
  };
  const [user, setUser] = React.useState(null);
  const [address, setAddress] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [signature, setSignature] = React.useState("");
  const [isVerified, setIsVerified] = React.useState(false);
  const [error, setError] = React.useState("");

  const [verificationObject, setVerificationObject] = React.useState(null);

  /* Register event listener at start */
  React.useEffect(() => {
    //Start listening to auth changes that is if we have a firebase session.
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
          setError(data.error);
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
  const out = () => {
    signOut(auth);
    window.location.reload();
  };
  return (
    <div>
      <Intro isVerified={isVerified} />

      <Step1 address={address} setName={setName} name={name} next={next} />
      <Error error={error} />
      <Step2
        address={address}
        isVerified={isVerified}
        message={message}
        signature={signature}
        setSignature={setSignature}
        signIn={signIn}
        signOut={out}
      />

      <Hello verificationObject={verificationObject} signOut={out} />
    </div>
  );
}
ReactDOM.render(<App />, document.getElementById("app"));

function Error({ error }) {
  if (!error) {
    return null;
  }
  return (
    <div className="mt-4 alert alert-danger" role="alert">
      {error}
    </div>
  );
}
