import React from "react";
import { Avatar } from "./Avatar";

export function Hello({ verificationObject, signOut }) {
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
