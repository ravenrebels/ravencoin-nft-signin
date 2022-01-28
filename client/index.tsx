import React from "react";
import ReactDOM from "react-dom";
import { getAuth, signInAnonymously, signOut } from "firebase/auth";
import { getDatabase, ref, set, update, onValue } from "firebase/database";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
import firebaseConfig from "./firebaseConfig.json";

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
      {!isVerified && <Intro />}
      {!address && Step1(setName, name, next)}

      {!isVerified &&
        address &&
        Step2(address, message, signature, setSignature, signIn)}

      <Hello verificationObject={verificationObject} signOut={out} />
    </div>
  );
}
function Intro() {
  return (
    <div>
      <h1 className="h3">Sign in</h1>
      <p>
        {" "}
        <i>with Ravencoin NFT (unique asset)</i>
      </p>
    </div>
  );
}

function Step1(setName: any, name: any, next: () => void) {
  return (
    <div
      style={{
        border: "1px solid silver",
        borderRadius: "20px",
        padding: "30px",
      }}
    >
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
  );
}

function Step2(
  address: any,
  message: any,
  signature: any,
  setSignature: any,
  signIn: () => void
) {
  return (
    <div
      style={{
        border: "1px solid silver",
        borderRadius: "20px",
        padding: "30px",
      }}
    >
      <p className="mt-4">Please sign the message with the address</p>

      <p>
        <strong>Address</strong> <small>{address}</small>
      </p>
      <p>
        <strong>Message</strong> {message}
      </p>

      <p>
        <div class="mb-3">
          <label htmlFor="signature" class="form-label">
            Signature
          </label>

          <textarea
            id="signature"
            name="signature"
            className="form-control"
            value={signature}
            onChange={(event) => {
              setSignature(event.target.value);
            }}
          ></textarea>
        </div>
      </p>

      <button className="btn btn-primary" onClick={signIn}>
        Sign in
      </button>
    </div>
  );
}

function Hello({ verificationObject, signOut }) {
  console.log("VerificationObject", verificationObject);
  if (!verificationObject) {
    return null;
  }
  const isVerified = verificationObject.isVerified;
  if (!isVerified) {
    return null;
  }

  return (
    <div>
      <div>
        Hello <strong> {verificationObject && verificationObject.name}</strong>
        <div>
          <Avatar verificationObject={verificationObject} />
        </div>
      </div>

      <button
        onClick={signOut}
        style={{ float: "right" }}
        className="mt-5 btn btn-primary"
      >
        Sign out
      </button>
    </div>
  );
}

function Avatar({ verificationObject }) {
  if (!verificationObject) {
    return null;
  }

  const assetData = verificationObject.assetdata;
  if (!assetData) {
    return null;
  }

  if (assetData.ipfs_hash) {
    return (
      <img
        src={"https://cloudflare-ipfs.com/ipfs/" + assetData.ipfs_hash}
        width="100"
        className="mt-2"
      />
    );
  }
}
ReactDOM.render(<App />, document.getElementById("app"));
